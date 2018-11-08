 ![npm](https://img.shields.io/npm/dt/jwt-cracker.svg)
 [![npm](https://img.shields.io/npm/v/jwt-cracker.svg)](https://www.npmjs.com/package/jwt-cracker)
 [![Rawsec's CyberSecurity Inventory](https://inventory.rawsec.ml/img/badges/Rawsec-inventoried-FF5050_flat.svg)](https://inventory.rawsec.ml/tools.html#jwt-cracker) 
 [![GitHub stars](https://img.shields.io/github/stars/lmammino/jwt-cracker.svg)](https://github.com/lmammino/jwt-cracker/stargazers)
 [![GitHub license](https://img.shields.io/github/license/lmammino/jwt-cracker.svg)](https://github.com/lmammino/jwt-cracker/blob/master/LICENSE)

# jwt-cracker

Simple HS256 JWT token brute force cracker.

Effective only to crack JWT tokens with weak secrets.
**Recommendation**: Use strong long secrets or RS256 tokens.


## Install

With npm:

```bash
npm install --global jwt-cracker
```


## Usage

**From command line:**

```bash
jwt-cracker -t <token> [options]
```

**Options:**

```
Options:
  --quite                   Run quitely
  -w, --wordlist            Wordlist to use to use in dictionary attack
  -a, --alphabet            Charecters used in the brute force attack
  -M, --max-length          Maximum string length of brute force attack payload
```

## Requirements

This script requires Node.js version 6.0.0 or higher

## Examples

### Brute Force Attack 

Cracking the default [jwt.io example](https://jwt.io):

```bash
# Brute force attack
jwt-cracker -t "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ"
```

It takes about 2 hours in a Macbook Pro (2.5GHz quad-core Intel Core i7).


### Dictionary Attack

Cracking the defailt [jwt.io example](https://jwt.io) using [danielmiessler/SecLists](https://github.com/danielmiessler/SecLists/tree/master/Passwords) password lists:

```bash
# Dictionary attack using wordlist
jwt-cracker -w "/usr/share/wordlists/10-million-password-list-top-1000000.txt" -t "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ"
```

The list being used will NOT crack this JWT due to that key not being in the list.


## Contributing

Everyone is very welcome to contribute to this project.
You can contribute just by submitting bugs or suggesting improvements by
[opening an issue on GitHub](https://github.com/lmammino/jwt-cracker/issues).


## License

Licensed under [MIT License](LICENSE). © Luciano Mammino.
