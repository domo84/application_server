#!/bin/bash

bin=$(readlink -f ./node_modules/.bin/browserify)

$bin $@ -t node-underscorify -t jstify -t babelify -t [ envify --NODE_ENV dev ] -d --no-bundle-external --bare
