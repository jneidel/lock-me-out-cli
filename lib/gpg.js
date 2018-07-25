const fs = require( "mz/fs" );
const expandHome = require( "expand-home-dir" );
const path = require( "path" );
const log = require( "./log" );
const execute = require( "./execute" );
const settings = require( "./settings" );

/* Functions for working with gpg */

const home = settings.home;
const keyid = settings.getKeyid();

/**
 * Used gpg commands/flags:
 * --homedir - set path of gpg directory (pubring.kbx, etc)
 * --quick-gen-key - Pass userid, etc. via as args instead
 *    of the interactive mode of --gen-key
 * --batch --pinentry loopback --passphrase - pass passphrase
 *    as argument instead of typing it in via prompt/popup
 * -d, --decrypt - decrypt file/stdin
 * -e, --encrypt - encrypt file/stdin
 * -a, --armor   - output/input in ascii
 * -r, --recipient - keyid to encrypt for
 * --clearsign - sign smt, with visable value
 * --local-user - specify keyid for signing
 * --verify - verify if signature checks out
 * --output - output signed msg while verifying
 * For more info on the commands refer to the gpg man page
 */

/**
 * Execute gpg command by passing the flags
 * @param commandIn - gpg option flags
 * @param optionsIn - child_process.exec options
 * @param optionsIn.stdin - string that should be echo piped to gpg: echo "str" | gpg
 * @param optionsIn.home - --homedir to be applied
 * @param optionsIn.pass - password to be applied
 * @returns result
 * @returns result.stdout
 * @returns result.stderr
 */
function gpg( commandIn, optionsIn = {} ) {
  let command = `gpg `;

  const defaults = { shell: "/bin/bash" };
  const options = Object.assign( defaults, optionsIn );

  if ( options.stdin ) { // prepend stdin string
    command = `echo '${options.stdin}' | ${command}`;
    delete options.stdin;
  }
  if ( options.home ) { // insert --homedir
    command += `--homedir '${home}/gpg' --no-permission-warning `;
    delete options.home;
  }
  if ( options.pass ) { // insert --passphrase
    command += `--batch --pinentry-mode loopback --passphrase '${options.pass}' `;
    delete options.pass;
  }

  command += commandIn;

  return execute( command, options );
}

/**
 * @returns version - gpg version or null if not in $PATH
 */
const version = () => gpg( "--version" ).then( x => x.stdout ).then( output => output.match( /gpg\s\(GnuPG\)\s(\d\.\d\.\d+)/i )[1] ).catch( err => null );

/**
 * Generate new key with given passphrase
 * @param pass - Passphrase
 * @returns keyid
 */
const generateKey = pass => gpg( `--quick-gen-key lock-me-out-cli default default never`, { home: true, pass } )
  .then( res => res.stdout ? res.stdout : res.stderr )
  .then( out => out.match( /gpg:\skey\s([0-9A-Z]+)\smarked\sas\sultimately\strusted/ )[1] )
  .catch( err => null ); // submit error msg to api.jneidel.com

const encryptValue = str => gpg( `-r ${keyid} -a -e`, { stdin: str, home: true } )
  .then( x => x.stdout );

const decryptValue = ( value, pass ) => gpg( `-a -d`, { home: true, pass, stdin: value } )
  .then( x => x.stdout );

/**
 * Sign vale with private key
 * @returns signature
 */
const signMsg = ( msg, pass ) => gpg( `-a --clearsign --local-user '${keyid}' `, { home: true, pass, stdin: msg } )
  .then( res => res.stderr ? new Error( "gpg.sign" ) : res.stdout )
  .catch( err => console.log( err ) );

/**
 * Verify if signature is valid
 * @returns msg  - If good signature
 * @returns null - If bad signature
 * @exits        - If file has been corrupted by user
 */
const verifyMsg = ( sig ) => gpg( `--verify --output -`, { stdin: sig, home: true } )
  .then( response =>
    response.stderr.match( /Good\ssignature\sfrom\s"lock-me-out-cli/i ) ?
      response.stdout.trim() : null )
  .catch( err => err.stderr.match( /Bad\ssignature\sfrom\s"lock-me-out-cli/i ) ? null : new Error( `user corrupted signed message file:\n${sig}\nTo fix this file, revert it to its original state` ) )
  .then( log.throwIfErr );

const composeMsg = ( name, date, encryptedValue ) => `${name}|\n${date}|\n${encryptedValue}`;

const cleanMsg = msg => {
  const [ name, date, encryptedValue ] = msg.split( "|" ).map( x => x.trim() );

  return { name, date, encryptedValue };
};

module.exports = {
  version,
  generateKey,
  encryptValue,
  decryptValue,
  signMsg,
  verifyMsg,
  composeMsg,
  cleanMsg,
};

