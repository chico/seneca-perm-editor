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
    prefix:    '/' + plugin,
    checkpermissions: false,
    roles: ['admin']
  },options);
  options.restapi = options.prefix + '/rest';
  options.allowedentities = ['sys_user'];

  function deny(res){
    res.writeHead(401);
    return res.end();
  }

  function checkperm(req,res,next){
    // requires an admin user
    if( req.seneca && req.seneca.user && req.seneca.user.admin) {

      // check permissions is required
      if (options.checkpermissions) {
        var foundRole = false;
        var roles = (req.seneca.user.perm && req.seneca.user.perm.roles) ? req.seneca.user.perm.roles : [];
        for (var i = 0; i < options.roles.length; i++) {
          if (roles.indexOf(options.roles[i]) !== -1) {
              foundRole = true;
              break;
          }
        }
        if (!foundRole) {
          return deny(res);
        }
      }

      next();
    }
    else {
      return deny(res);
    }
  }

  function checkrest(req,res,next){

    function isAllowedEntityUrl(req) {
      for(var i = 0; i < options.allowedentities.length; i++) {
        if (req.url.indexOf(options.restapi + '/' + options.allowedentities[i]) !== -1) {
          return true;
        }
      }
      return false;
    }

    if (!isAllowedEntityUrl(req)) {
      return deny(res);
    }

    checkperm(req, res, next);
  }

  seneca.use(
    {name:'jsonrest-api', tag:plugin},
    {
      prefix: options.restapi,
      premap: checkrest,
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


  seneca.act({role:'web', use:service ,plugin:plugin, config:{prefix:options.prefix}});


  return {
    name:plugin
  };

};