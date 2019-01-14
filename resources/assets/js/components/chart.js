import Chart from 'chart.js'

const port = Number(process.env.SOCKET_PORT)
const protocol = window.location.protocol
const socketUrl = process.env.SOCKET_URL + ':' + (protocol === 'https:' ? port : (port + 10))
const socket = require('socket.io-client')(socketUrl)
const canvas = $('#visits')

socket.emit('adminka', true)

socket.on('connect_error', function () {
  socket.disconnect()
})

if (canvas.length !== 0) {
  var chart = new Chart(canvas, {
    type: 'pie',
    data: {
      labels: [],
      datasets: [{
        data: [],
        backgroundColor: []
      }]
    }
  })

  socket.on('room', function (data) {
    let chartData = {
      labels: [],
      count: [],
      color: []
    }
    for (let room of data) {
      chartData.labels.push(room.name)
      chartData.count.push(room.count)
      chartData.color.push(room.color)
      visitorsTable(room.name, room.count)
    }
    chart.data.labels = chartData.labels
    chart.data.datasets[0].data = chartData.count
    chart.data.datasets[0].backgroundColor = chartData.color
    chart.update()
  })
} else {
  socket.on('room', function (data) {
    for (let room of data) {
      if (room.name === 'all') {
        $('.user_all span').text(room.count)
        break
      }
    }
  })
}

function visitorsTable (key, value) {
  let table = $('#dataTable')
  let room = table.find('[data-room="' + key + '"]')

  if (room.length > 0) {
    room.addClass('change').find('.user__num').text(value)
  } else {
    if (key !== 'admin') {
      table.find('.user__rooms:last-child').after(`
        <tr class="user__rooms" role="row" data-room="${key}">
          <td class="user__room">${key}</td>
          <td class="user__num">${value}</td>
        </tr>`)
    }
  }
}
