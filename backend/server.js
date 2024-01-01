const express = require('express');
const { createServer } = require('node:http');
const path = require('node:path');
const { Server } = require('socket.io');
const fs = require('fs');

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(express.static(path.resolve("./public")));

app.get('/', (req, res) => {
  res.sendFile('index.html');
});

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('message',(msg)=>{
    socket.broadcast.emit('message',msg);
  })     

});

app.get('/chats', (req, res) => {
  const filePath = path.join(__dirname, 'chats.json');

  // Read the contents of chats.json
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading the JSON file:', err);
      res.status(500).send('Internal Server Error');
      return;
    }

    try {
      const chatsData = JSON.parse(data);
      res.json(chatsData);
    } catch (parseError) {
      console.error('Error parsing JSON:', parseError);
      res.status(500).send('Internal Server Error');
    }
  });
});

server.listen(4000, () => {
  console.log('server running at http://localhost:4000');
});