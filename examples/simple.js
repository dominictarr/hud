var monitor = require('..')()
var from = require('from') 
var os   = require('os')

//take something you want to monitor.

//oh yeah, make it a stream.
//from == a simple way to make a readable stream.
from(function (i, next) {
  this.emit('data', {
    memory: 1 - (os.freemem() / os.totalmem()),
    //make sure you add a time property.
    //else, monitor will use the time it receives the data
    //which may not be accurate.
    timestamp: Date.now()
  })
  setTimeout(next, 1e3)
})
.pipe(monitor.createStream({
    name: 'memory', maxValue: 1, minValue: 0
}))

monitor.probe.pipe(monitor.createStream({name: 'monitor-output'}))

//start a server on localhost:6464...
monitor.listen(6464)

