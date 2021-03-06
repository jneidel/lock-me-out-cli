# lock-me-out-cli

> Temporarily lock yourself out, by encrypting e.g. your netflix password for a week

<!--[![Travis Build Status](https://img.shields.io/travis/jneidel/lock-me-out-cli.svg?style=flat-square)](https://travis-ci.org/jneidel/lock-me-out-cli)-->
![User tested gnu/linux](https://img.shields.io/badge/user_tested-GNU%2FLinux-brightgreen.svg?style=flat-square)
[![Npm Downloads](https://img.shields.io/npm/dw/lock-me-out-cli.svg?style=flat-square)](https://www.npmjs.com/package/lock-me-out-cli)
[![License MIT](https://img.shields.io/badge/license-MIT-green.svg?style=flat-square)](https://github.com/jneidel/lock-me-out-cli/blob/master/license)
[![Code Style Custom](https://img.shields.io/badge/code%20style-custom-ff69b4.svg?style=flat-square)](https://github.com/jneidel/dotfiles/blob/master/.eslintrc)

Leveraging [GPG](https://gnupg.org/), this cli allows you to forfeit something temporarily.

Example: Lock-up your netflix password because you need concentrate for a hour:

```zsh
$ lock-me-out encrypt --name "netflix" --date "today +1" --value "mypassword"
```

<!--## Features-->

## Install

[![Npm Version](https://img.shields.io/npm/v/lock-me-out-cli.svg?style=flat-square)](https://www.npmjs.com/package/lock-me-out-cli)

```
$ npm install lock-me-out-cli
```

**Setup:**

```
$ lmo setup
```

## Usage

You can either use `lock-me-out` or `lmo` to access the cli.

```
$ lmo --help

  lock-me-out: 

  Usage
    $ lmo <command> <options>

  Commands
    en, encrypt Encrypt value
    de, decrypt Decrypt value
    ls, list    List encrypted values
        setup   Setup ~/.config dir

  Options
    -n, --name  Name to identify the encrypted value
    -d, --date  When the data will be decryptable
    -v, --value Data to be encrypted

  Examples
    $ lmo encrypt -n netflix -d "tomorrow 9" -v mypassword
    $ lmo encrypt -n youtube -d nextweek -v yt123

    $ lmo decrypt netflix

```

### Dates/times

If no time is specified, the current time will be used.

For specifying dates/times you have multiple options:

**Dates:**

- `tod`/`today`
- `tom`/`tomorrow`
- `+N` - +5 (days)
- `Nday`/`Ndays` - 8days
- `nextweek`/`next-week`
- `Nweek`/`Nweeks` - 7weeks
- `YYYY-MM-DD`/`MM-DD`/`DD` - 2018-08-13, 08-13, 13

**Times:**

- `now`
- `+N` - +2 (hours)
- `-N` - -2 (hours)
- `HH:MM`/`HH`- 12:55, 12

The date can not be omitted: `--date "today +2"` not `--date "+2"`.

## Reset

To reset config, data, gpg keys, etc.:

```zsh
$ rm -rf ~/.config/lock-me-out; lmo setup;
```

<!--## Commands

### lock-me-out-cli [options]

<table><tr>
  <td>
    options:
    <code><a href="#--out">--out</a></code>,
    <code><a href="#--micro">--micro</a></code>
  </td>
</tr></table>

Describe functionality

```
$ lock-me-out-cli
```

### config

Describe functionality

## Options

### --out

<table><tr>
  <td>Alias: <code>-o</code></td>
  <td>Default: <code></code></td>
  <td>Type: <code>string</code></td>
</tr></table>

Set the output path.

```zsh
$ lock-me-out-cli
```-->

## Related

- [jneidel/lock-me-out](https://github.com/jneidel/lock-me-out): Webapp of this cli.
- [jneidel/lock-me-out-api](https://github.com/jneidel/lock-me-out-api): API for this module.

<!--## Test

```
$ npm run test
```-->

## License

MIT © [Jonathan Neidel](https://jneidel.com)

