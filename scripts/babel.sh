#!/bin/bash

bin=$(readlink -f ./node_modules/.bin/browserify)
preset=$(readlink -f ./node_modules/babel-preset-env)

$bin $@ -t node-underscorify -t jstify -t [ babelify --presets [ $preset ] ] --no-bundle-external --fast
