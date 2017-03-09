#!/bin/bash

bin=$(readlink -f ./node_modules/.bin/browserify)
preset=$(readlink -f ./node_modules/babel-preset-env)

$bin $@ -t [ babelify --presets [ $preset ] ] --no-bundle-external
