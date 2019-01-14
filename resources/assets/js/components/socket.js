const main = $('main')
const mainRoom = main.attr('data-room')
const mainPage = main.attr('data-roomAll')
const port = Number(process.env.SOCKET_PORT)
const protocol = window.location.protocol
let socketUrl = ''

if (protocol === 'https:') {
  socketUrl = process.env.SOCKET_URL + ':' + port
} else {
  socketUrl = process.env.SOCKET_URL + ':' + (port + 10)
}

const socket = require('socket.io-client')(socketUrl)
let storage = {
  'url': window.location.pathname,
  'route': mainRoom
}

if (typeof mainPage !== typeof undefined && mainPage !== false) {
  storage.page = mainPage
}

socket.on('id', function (data) {
  if (window.sessionStorage && !sessionStorage.getItem('user')) {
    sessionStorage.setItem('user', data)
    storage.exist = false
    storage.id = data
    socket.emit('user', storage)
  } else {
    storage.id = sessionStorage.getItem('user')
    storage.exist = true
    socket.emit('user', storage)
  }
})

socket.on('connect_error', function () {
  socket.disconnect()
})
