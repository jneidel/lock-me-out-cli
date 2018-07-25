const fs = require( "mz/fs" );
const log = require( "./log" );
const gpg = require( "./gpg" );
const datetime = require( "./datetime" );
const filesystem = require( "./fs" );
const settings = require( "./settings" );

/* Functions for parsing cli commands */

async function encrypt( args ) {
  const date = datetime.parse( args.date );
  const name = filesystem.fixFilename( args.name );
  const value = args.value;

  log.printPrompt( `Name:  ${name}
  Date:  ${date} / ${datetime.stringify( date )}
  Value: ${value}` );

  const { isCorrect } = await log.prompt( {
    type   : "confirm",
    name   : "isCorrect",
    message: "Is this correct?",
    default: true,
  } );
  if ( !isCorrect )
    process.exit();

  const passphrase = await settings.getPassphrase();

  const encryptedValue = await gpg.encryptValue( value );
  const msg = gpg.composeMsg( name, date, encryptedValue );
  const signedMsg = await gpg.signMsg( msg, passphrase );

  await filesystem.writeMsg( signedMsg, name );
}

async function decrypt( args ) {
  const nameIpt = filesystem.fixFilename( args.name );

  const signedMsg = await filesystem.readMsg( nameIpt );
  const msg = await gpg.verifyMsg( signedMsg );
  const { name, date, encryptedValue } = gpg.cleanMsg( msg );

  const dateIsPast = datetime.verify( date );

  if ( !dateIsPast ) {
    log.printPrompt( `The date set for ${name} has not yet been reached.
  ${date} / ${datetime.stringify( date )}` );
  }

  const passphrase = await settings.getPassphrase();
  const decryptedValue = await gpg.decryptValue( encryptedValue, passphrase )
    .then( x => x.trim() );

  log.printPrompt( `Decryption successful!
  The value you encrypted for ${name} is: ${decryptedValue}` );
}

async function list( args ) {
  const str = await filesystem.walk()
    .then( names => Promise.all( names.map( async x => {
      const signedMsg = await filesystem.readMsg( x );
      const msg = await gpg.verifyMsg( signedMsg );
      const { name, date } = gpg.cleanMsg( msg );

      return { name, date };
    } ) ) )
    .then( objects => objects.map( x => `${x.name}: ${x.date} / ${datetime.stringify( x.date )}` ) )
    .then( names => names.reduce( ( acc, cur ) => acc += `  ${cur}\n`, "Encrypted values:\n" ) )
    .then( str => str.trim() ); // Remove trailing \n

  log.printPrompt( str );

  checkForUpdate();
}

function setup() {
  settings.setup();
}

function checkForUpdate() {
  const updateCheck = require( "update-check" );
  const pkg = require( "../package.json" );

  updateCheck( pkg )
    .then( update => {
      if ( update )
        log.promptConsole( `A new version of lock-me-out-cli is available: current ${pkg.version}, latest ${update.latest}` );
    } );
}

module.exports = {
  list,
  encrypt,
  decrypt,
  setup,
};

