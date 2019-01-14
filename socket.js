require('dotenv').config()
const https = require('https')
const http = require('http')
const fs = require('fs')
const socket = require('socket.io')
let port = Number(process.env.SOCKET_PORT)
let options = {
  key: fs.readFileSync(process.env.CERTIFICATE_PATH + 'privkey.pem'),
  cert: fs.readFileSync(process.env.CERTIFICATE_PATH + 'fullchain.pem')
}

let httpServer = http.createServer().listen(port + 10)
let httpsServer = https.createServer(options).listen(port)

let page = {
  data: [
    {
      name: 'all',
      count: 0,
      color: '#000'
    }
  ],
  add: function (room, count) {
    let search = false
    for (let item of this.data) {
      if (item.name === room) {
        item.count = count
        search = true
        break
      }
    }

    if (!search) {
      this.data.push({
        name: room,
        count: count,
        color: getRandomColor()
      })
    }
  },
  get: function () {
    return this.sortByCount()
  },
  sortByCount: function () {
    return this.data.sort(function (a, b) {
      return b.count - a.count
    })
  }
}

runServer(httpServer)
runServer(httpsServer)

function runServer (server) {
  let io = socket.listen(server)

  io.on('connection', function (socket) {
    io.sockets.sockets[socket.id].leave(socket.id)
    socket.emit('id', socket.id)

      .on('user', function (data) {
        addToRoom('all')

        if ('page' in data) {
          addToRoom(data['page'])
        }

        addToRoom(data['route'].toLowerCase())
        io.to('admin').emit('room', page.get())
      })

      .on('disconnect', function (reason) {
        let rooms = io.sockets.adapter.rooms

        for (let room of page.data) {
          if (rooms[room.name]) {
            room.count = rooms[room.name].length
          } else {
            room.count = 0
          }
        }
        io.to('admin').emit('room', page.get())
      })

      .on('adminka', function () {
        socket.join('admin')
        io.to('admin').emit('room', page.get())
      })

    function addToRoom (room) {
      socket.join(room)
      page.add(room, io.sockets.adapter.rooms[room].length)
    }
  })
}

function getRandomColor () {
  const letters = '0123456789ABCDEF'
  let color = '#'
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}
