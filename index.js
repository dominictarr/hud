
var MuxDemux = require('mux-demux')
var through  = require('through')
var ecstatic = require('ecstatic')
var u        = require('./util')
var shoe     = require('shoe')
var http     = require('http')
var prober   = require('probe-stream')

module.exports = function () {

  var streams = {}
  var server = http.createServer(ecstatic(__dirname + '/static'))
  var i = 0
  var probe = prober()
  server.probe = probe

  server.createStream = function (meta) {
    i++

    meta = 'string' === typeof meta ? {name: meta} : meta || {name: 'monitor_'+i}
    meta.i = meta.i || i
    meta.type = meta.type || 'monitor'
    var stream = streams[meta.name] = through()
    stream.meta = meta
    server.emit('stream', stream)
    stream.setMaxListeners(Infinity)
    u.onTerminate(stream, function () {
       delete streams[meta.name]
    })

    return stream
  }

  shoe(function (stream) {
    var mx = MuxDemux()
    stream.pipe(mx).pipe(stream)
    mx.pipe(probe.createStream())
    function add (stream) {
      stream.pipe(mx.createStream(stream.meta))
    }

    for(var name in streams)
      add(streams[name])

    server.on('stream', add)
  }).install(server, '/monitor')

  return server

}
