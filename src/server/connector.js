const express = require('express')
const router = express.Router()
const tr = require('tor-request');
const crypto = require('../crypto')
const calculations = require('../calculations')
const request = require('superagent')

function postEvent(address, secret, body, callback){
  tr.request({
      url: 'http://' + address + '/events',
      headers: {"Authorization": secret},
      method: 'post',
      body,
      json: true,
    }, function (err, res, resBody) {
          if (err){
              return callback(err)
          }
          callback(resBody)
  })
}

function checkHash(address, secret, taskId, callback){
  tr.request({
      url: 'http://' + address + '/taskhash/' + taskId,
      headers: {"Authorization": secret},
      method: 'post',
      json: true,
    }, function (err, res, resBody) {
          if (err){
              return callback(err)
          }
          callback(resBody)
  })
}

function getState(address, secret, callback){
  tr.request({
      url: 'http://' + address + '/state',
      headers: {"Authorization": secret},
      method: 'post',
      body: { x: true },
      json: true
    }, function (err, res, resBody) {
          if (err){
              return callback(err)
          }
          callback(null, resBody)
  })
}

module.exports = {
    postEvent,
    getState,
    checkHash,
}
