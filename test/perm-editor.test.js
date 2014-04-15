/* Copyright (c) 2014 Chico Charlesworth, MIT License */
'use strict';

// mocha perm-editor.test.js

var seneca  = require('seneca');
var assert  = require('chai').assert;
var gex  = require('gex');

describe('perm-editor', function() {

  it('happy', function( done ){
    seneca()
      .use('..')
      .ready( function(err, si){
        assert.isNull(err);
        done();
      })
  });

});
