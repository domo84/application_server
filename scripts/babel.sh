#!/bin/bash

bin=$(readlink -f ./node_modules/.bin/browserify)
preset=$(readlink -f ./node_modules/babel-preset-env)

$bin $1 -o $2 -t [ babelify --presets [ $preset ] ]
