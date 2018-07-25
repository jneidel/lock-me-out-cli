const os = require( "os" );
const gpg = require( "./gpg" );
const log = require( "./log" );
const inquirer = require( "inquirer" );
const path = require( "path" );
const execute = require( "./execute" );

const scriptPath = path.resolve( __dirname, "..", "bin", "install-gpg.sh" );

async function installInstructions( platformSpecificMsg ) {
  log.printPrompt( `gpg is not available on your system.
  You can install it using:
  ${platformSpecificMsg}
    (Rewiew script before running it!)` );

  const qName = "Resume? (assumes that gpg has been installed)";

  const resume = await inquirer.prompt( [ {
    type      : "confirm",
    name      : qName,
    desciption: qName,
    default   : true,
  } ] );

  if ( !resume )
    process.exit();
}

async function installGpg() {
  const version = await gpg.version();

  if ( version === null ) {
    const platform = os.type();

    switch ( platform ) {
      case "Linux":
        await installInstructions( `1. A package manager: $ <your-pkgmanager> gpg
  2. A build script: $ ${scriptPath}` );
        break;
      case "Darwin":
        await installInstructions( `1. A package manager (homebrew): $ brew install gpg
  2. A build script: $ ${scriptPath}` );
        break;
      default:
        log.printPrompt( "Windows is not supported." );
        process.exit();
    }
  } else if ( version.split( "." )[0] != 2 ) {
    log.printPrompt( "Only gpg 2.x is currently supported.\n  gpg 1.x has not been tested yet." );
  }
}

exports.gpg = installGpg;

