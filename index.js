#!/usr/bin/env node

"use strict";

const crypto = require('crypto');
const variationsStream = require('variations-stream');
const pkg = require('./package');
const fs = require('fs')
// arguments
var argv = require('yargs')
  .usage('Usage: jwt-cracker -t <token> [options]')
  .options({
    't': {
      alias: 'token',
      describe: 'The JSON Web Token you want to crack'
    },
    'quite': {
      describe: 'run quitely',
      boolean: true
    },
    'w': {
      alias: 'wordlist',
      describe: 'Wordlist to use to use in dictionary attack',
      default: null
    },
    'a': {
      alias: 'alphabet',
      describe: 'Charecters used in the brute force attack',
      default: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    },
    'M': {
      alias: 'max-length',
      describe: 'Maximum string length of brute force attack payload',
      default: 12
    }
  })
  .demandOption(['token'])
  .example('jwt-cracker -t <token>', 'Brute force attack on JSON Web Token')
  .example('jwt-cracker -t <token> -w <path>', 'Dictionary force attack on JSON Web Token')
  .argv;

const generateSignature = function(content, secret) {
  return (
    crypto.createHmac('sha256', secret)
      .update(content)
      .digest('base64')
      .replace('=', '')
      .replace('+', '-')
      .replace('/', '_')
  );
};

const printResult = function(startTime, attempts, result) {
  if (result) {
    console.log('SECRET FOUND:', result);
  } else {
    console.log('SECRET NOT FOUND');
  }
  console.log('Time taken (sec):', ((new Date).getTime() - startTime)/1000);
  console.log('Attempts:', attempts);
};

const token = argv.token
const [header, payload, signature] = token.split('.');
const content = `${header}.${payload}`;

const startTime = new Date().getTime();
let attempts = 0;

if (typeof argv.wordlist !== "undefined") {
  const wordlistfile = argv.wordlist;
  if (! argv.quite) {
    console.log('Starting dictionary attack...');
    console.log('Using: ' + wordlistfile);
  }

  if (fs.lstatSync(wordlistfile).isFile()) {
    var remaining = '';
    fs.createReadStream(wordlistfile).on('data', function(data) {
      remaining += data;
      var index = remaining.indexOf('\n');
      while (index > -1) {
        var line = remaining.substring(0, index);
        remaining = remaining.substring(index + 1);
        // generate
        attempts++;
        const currentSignature = generateSignature(content, line);

        if (attempts%1000 === 0 && ! argv.quite) {
          console.log('Attempts: ', attempts);
        }
        if (currentSignature == signature) {
          printResult(startTime, attempts, line);
          process.exit(0);
        }
        index = remaining.indexOf('\n');
      }
    })
    .on('end', function(){
      if (! argv.quite) {
        console.log('Done!');
      }
      process.exit(1);
    });
  }
  else {
    console.log('This is not currently supported...')
  }

} else {
  if (! argv.quite) {
    console.log('Starting brute force attack...');
  }

  variationsStream(argv.alphabet, argv.maxLength)
    .on('data', function(comb) {
      attempts++;
      const currentSignature = generateSignature(content, comb);
      if (attempts%1000 === 0 && ! argv.quite) {
        console.log('Attempts: ', attempts);
      }
      if (currentSignature == signature) {
        printResult(startTime, attempts, comb);
        process.exit(0);
      }
    })
    .on('end', function(){
      printResult(startTime, attempts);
      process.exit(1);
    });
}