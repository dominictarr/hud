'use strict';

var reconnect = require('reconnect')
var ss        = require('smoothie-stream')
var MuxDemux  = require('mux-demux')
var ready     = require('domready')
var h         = require('h')
var u         = require('./util')

function toCanvas (stream) {
  var canvas = document.getElementById(stream.meta.name)
    ,  parent
  if(!canvas) {
   document.getElementById('graphs')
      .appendChild(
      parent = h('div', h('lable', id),
        canvas = h('canvas#'+id, { width: '600px', height: '200px' })
      )
    )
    u.onTerminate(stats, function () {
      parent.parentElement.removeChild(canvas)
    })
  }
  return canvas
}

//streams are pushed to the client by the server.
//that is why mux-demux looks like a server!
//note, reconnect also looks like a server!
//this is because you don't know when reconnections will occur.

ready(function () {
  reconnect(function (shoe) {
    shoe.pipe(MuxDemux(function toCanvas (stream) {
      var canvas = document.getElementById(stream.meta.name)
      var container
      var id = stream.meta.name
      if(!canvas) {
       document.getElementById('graphs')
          .appendChild(
          container = h('div', h('label', id), h('br'),
            canvas = h('canvas#'+id, { width: '600px', height: '200px' })
          )
        )
        var s = ss(stream.meta)
        stream.pipe(s)
        s.streamTo(canvas, 1e3)

        u.onTerminate(stream, function () {
          container.parentElement.removeChild(container)
        })
      }
    })).pipe(shoe)
  }).connect('/monitor')
})
