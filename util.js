exports.onTerminate = onTerminate

function onTerminate (stream, listener) {
  function term () {
    stream.removeListener('end', term)
    stream.removeListener('close', term)
    stream.removeListener('error', term)
    listener.call(stream)
  }
  stream.on('end', term).on('close', term).on('error', term)
}
