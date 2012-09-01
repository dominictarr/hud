var reconnect = require('reconnect')
var ss        = require('smoothie-stream')
var MuxDemux  = require('mux-demux')
var ready     = require('domready')
var h         = require('h')
var u         = require('./util')

function getCanvas (id) {
  var canvas = document.getElementById(id)
  if(!canvas) {
   document.getElementById('graphs')
      .appendChild(
      h('div', h('lable', id),
        canvas = h('canvas#'+id, { width: '600px', height: '200px' })
      )
    )
  }
  return canvas
}

//streams are pushed to the client by the server.
//that is why mux-demux looks like a server!
//note, reconnect also looks like a server!
//this is because you don't know when reconnections will occur.

ready(function () {
  reconnect(function (shoe) {
    shoe.pipe(MuxDemux(function (stats) {
      var canvas = getCanvas(stats.meta.name)
      var smoothie = ss(stats.meta)
      smoothie.streamTo(canvas, 1e3)
      u.onTerminate(stats, function () {
        canvas.parentElement.removeChild(canvas)
      })

    })).pipe(shoe)
  }).connect('/monitor')
})
