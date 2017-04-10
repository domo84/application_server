#!/bin/bash

bin=$(readlink -f ./node_modules/.bin/browserify)

$bin $@ -t uglifyify -t node-underscorify -t jstify -t babelify -t [ envify --NODE_ENV prod ] --no-bundle-external --bare