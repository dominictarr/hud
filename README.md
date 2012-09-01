# HUD - Head Up Display

pre-configured graphing for monitoring node stuff in real-time.

``` js
var hud = require('hud')()
var from = require('from') 
var os   = require('os')

//take something you want to monitor.
//oh yeah, make it a stream.
//from == a simple way to make a readable stream.
var osStream = 
  from(function (i, next) {
    this.emit('data', {
      memory: 1 - (os.freemem() / os.totalmem()),
      //make sure you add a time property.
      //else, monitor will use the time it receives the data
      //which may not be accurate.
      time: Date.now()
    })
    setTimeout(next, 1e3)
  })

osStream.pipe(hud.createStream('memory'))

//start a server on local host...
hud.listen(6464)
```

now, open `http://localhost:6464` in your browser!

``` js

//hud can even monitor it self!
//using probe-stream
hud.probe.pipe(hud.createStream('monitor'))

```

Of course, you can monitor anything!
I recommend using [probe-stream](https://github.com/dominictarr/probe-stream)

## How

`hud` uses [smoothie-stream](https://github.com/dominictarr/smoothie-stream)
it will graph the properties that are numbers.

## License

MIT
