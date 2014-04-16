/* Copyright (c) 2014 Chico Charlesworth, MIT License */
'use strict';

var buffer  = require('buffer');
var util    = require('util');

var connect  = require('connect');
var _        = require('underscore');

var name = 'perm-editor';

module.exports = function( options ) {

  var seneca  = this;
  var plugin = name;

  options = seneca.util.deepextend({
    prefix:    '/perm-editor'
  },options);

  seneca.use(
    {name:'jsonrest-api', tag:'perm-editor'},
    {
      prefix: options.prefix+'/rest',
      list:{embed:'list'}
    }
  );

  seneca.add({init:plugin}, init);

  seneca.add({role:plugin, cmd:'config'}, cmd_config);

  function cmd_config( args, done ) {
    done(null,config);
  }

  function init( args, done ) {
    done();
  }

  var app = connect();
  app.use(connect.static(__dirname+'/../web'));

  function checkperm(req,res,next){
    // TODO: if there is a user, still need to be able to block entirely based on perms

    // requires an admin user
    if( req.seneca && req.seneca.user && req.seneca.user.admin) {
      next();
    }
    else {
      res.writeHead(401);
      return res.end();
    }
  }

  function buildcontext( req, res, args, act, respond ) {
    var user = req.seneca && req.seneca.user
    if( user ) {
      args.user = user
    }
    act(args,respond)
  }

  var service = seneca.http({
    prefix:options.prefix,
    pin:{role:plugin, cmd:'*'},
    premap:checkperm,
    map:{
      entlist:{GET:buildcontext},
      config:true
    },
    endware:function(req,res,next){
      if( 0 != req.url.indexOf(options.prefix) ) return next();

      req = _.clone(req);
      req.url = req.url.substring(options.prefix.length);

      if(''===req.url) {
        res.writeHead(301, {
          'Location': options.prefix+'/'
        });
        return res.end();
      }
      else {
        return app(req, res, next);
      }
    }
  });


  seneca.act({role:'web', use:service ,plugin:'perm-editor', config:{prefix:options.prefix}});


  return {
    name:'data-editor'
  }
}
