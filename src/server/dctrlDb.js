let PORT = process.env.PORT || 8003

const Kefir = require('kefir')
const _ = require('lodash')
const uuidV1 = require('uuid/v1')
const dbengine = require( 'better-sqlite3')
const config = require('../../configuration')
const cryptoUtils = require('../crypto')

const preparedStmts = {};

var conn, eventEmitter, shadowEmitter

const changeFeed = Kefir.stream(e => {
  eventEmitter = e
})

const shadowFeed = Kefir.stream(e => {
  shadowEmitter = e
})

function triggerShadow(x){
    shadowEmitter.emit(x)
}

function initializeSqlite(cb) {
  console.log('initializing new sqlite3');
  var err = null;
  try {
    var initDb = conn.prepare("CREATE TABLE `events` ( `document` BLOB NOT NULL, `timestamp` INTEGER UNIQUE, PRIMARY KEY(`timestamp`) )");
    var initBackups = conn.prepare("CREATE TABLE `backups` ( `document` BLOB NOT NULL, `timestamp` INTEGER UNIQUE, PRIMARY KEY(`timestamp`) )");
    initDb.run();
    initBackups.run();
    createStatements()
  } catch(actualErr) {
    console.log(actualErr);
    err = actualErr;
  }
  if (err) {
    cb(err, conn);
  } else {
    startFeed();
    cb(null, conn);
  }
}

function createStatements() {
    conn.function('eventFeed', (doc) => {
        eventEmitter.emit(JSON.parse(doc))
    })
    preparedStmts.getAll = conn.prepare('SELECT document FROM events WHERE (timestamp > ?) ORDER BY timestamp') // WHERE (timestamp > ?)
    preparedStmts.insertEvent = conn.prepare("INSERT INTO events VALUES (?, ?)")
    preparedStmts.insertBackup = conn.prepare("INSERT INTO backups VALUES (?, ?)")
    preparedStmts.recover  = conn.prepare("SELECT document from backups ORDER BY timestamp DESC LIMIT 1")
}

function recover(callback){
    try {
      let all = [];

      for (const ev of preparedStmts.recover.iterate()) {
          console.log
          all.push(JSON.parse(ev.document))
      }
      callback(null, all)
    } catch(err){
      console.log('err caught recover ' + err)
    }
}

function getAll(timestamp, callback) {
    try {
      let all = [];

      for (const ev of preparedStmts.getAll.iterate(timestamp)) {
          all.push(JSON.parse(ev.document))
      }
      callback(null, all)
    } catch(err) {
      console.log('err caught getAll ' + err)
    }
}

function startFeed() {
  conn.function('eventFeed', (doc) => {
      eventEmitter.emit(JSON.parse(doc))
  })
  conn.prepare('CREATE TRIGGER updateHook AFTER INSERT ON events BEGIN SELECT eventFeed(NEW.document); END').run()
}

function insertEvent(ev, callback) {
    if (!conn) return callback("No db connection")
    if (!ev.timestamp) {
        ev.timestamp = Date.now()
    }
    var err = null;
    var result = null;
    try{
      result = preparedStmts.insertEvent.run(JSON.stringify(ev), ev.timestamp);
    } catch(actualErr) {
      console.log("insertEvent try", {actualErr, ev})
      err = actualErr
    }
    if (callback) {
        callback(err, {result,ev});
    }
}

function insertBackup(state, callback) {
    if (!conn) return callback("No db connection")

    state.timestamp = Date.now()

    var err = null;
    var result = null;
    try{
        result = preparedStmts.insertBackup.run(JSON.stringify(state), state.timestamp);
    } catch(actualErr) {
        err = actualErr;
    }
    if (callback) return callback(err, result);
}

function startDb(callback){

    dblocation = config.sqlite3.file
    if (PORT !== 8003){
        dblocation = dblocation.replace('database', PORT)
    }
    conn = dbengine(dblocation, { });
    var checkTable = conn.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='events'");

    if(checkTable.all().length == 0){
       initializeSqlite(callback);
    } else {
       createStatements();
       callback(null, conn);
    }
}

function getConn(){
    return conn
}

module.exports = {
  conn:conn,
  startDb,
  getAll,
  changeFeed,
  shadowFeed,
  triggerShadow,
  insertEvent,
  insertBackup,
  getConn,
  recover,
}
