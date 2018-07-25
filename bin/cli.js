#! /usr/bin/env node

const meow = require( "meow" );
const log = require( "../lib/log" );
const commands = require( "../lib/commands" );
const installGpgIfUnavailable = require( "../lib/install" ).gpg;

/* Cli entry point */

( async function main() {
  await installGpgIfUnavailable();

  const cli = meow( `Usage
  $ lmo <command> <options>

Commands
  encrypt, en Encrypt value
  decrypt, de Decrypt value
  list, ls    List encrypted values

Options
  --name, -n  Name to identify the encrypted value
  --date, -d  When the data will be decryptable
  --value, -v Data to be encrypted

Examples
  $ lmo encrypt -s netflix -d "tomorrow 9" -v mypassword
  $ lmo encrypt -s youtube -d nextweek -v yt123

  $ lmo decrypt netflix

Changing any of the files in ~/.config/lock-me-out/data
will lead to corruption. Your data won't be accessible.

For the documentation please refer to:
https://github.com/jneidel/lock-me-out-cli`, {
    description: "lock-me-out: ",
    flags      : {
      name: {
        alias  : "n",
        type   : "string",
        default: null,
      },
      date: {
        alias  : "d",
        type   : "string",
        default: null,
      },
      value: {
        alias  : "v",
        type   : "string",
        default: null,
      },
    },
  } );

  // Clean up input
  const args = cli.flags;
  args._ = cli.input;

  // Cli requires command
  if ( args._.length === 0 ) {
    log.printPrompt( "Specify '--help' for available commands" );
    process.exit();
  }

  // Flag requires parameter
  [
    { name: "name", val: args.name, commands: [ "encrypt", "en", "decrypt", "de" ] },
    { name: "date", val: args.date, commands: [ "encrypt", "en" ] },
    { name: "value", val: args.value, commands: [ "encrypt", "en" ] },
  ].forEach( arg => {
    if ( ~arg.commands.indexOf( args._[0] ) ) {
      if ( arg.val === null ) {
        log.printPrompt( `The '--${arg.name}' flag requires a parameter. Specify '--help' for available commands` );
        process.exit();
      }
    }
  } );

  // Parse commands
  switch ( args._[0] ) {
    case "config":
      commands.config( args );
      break;
    case "en":
    case "encrypt":
      commands.encrypt( args );
      break;
    case "de":
    case "decrypt":
      commands.decrypt( args );
      break;
    case "ls":
    case "list":
      commands.list( args );
      break;
    case "setup":
      commands.setup();
      break;
  }
} )();

process.on( "unhandledRejection", ( err ) => { throw err; } );

