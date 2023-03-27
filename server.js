const express = require("express");
const responseHelper = require('express-response-helper');
const { spawn } = require('child_process');
const app = express();
var http = require('http').Server(app);
const cors = require('cors');

app.use(cors());
app.use(responseHelper.helper());
app.use(express.json());
const socketIO = require('socket.io')(http, {
  cors: {
    origin: "http://localhost:3000"
  }
});

socketIO.on('connection', (socket) => {
    console.log(`⚡: ${socket.id} user just connected!`);
    socket.on('disconnect', () => {
      console.log('🔥: A user disconnected');
    });
    socket.on('message', (msg) => {
      console.log(msg)
      if (msg.text == "init") {
        console.log("[*] initializing model...")
        const shell = spawn('C:\\Users\\cyrus\\Desktop\\llama.cpp\\llama.exe',['-m', 'C:\\Users\\cyrus\\Desktop\\llama.cpp\\models\\7B\\ggml-model-q4_0.bin', '-n', '256', '--repeat_penalty', '1.0', '-i', '-r', '"User:"', '-f', 'C:\\Users\\cyrus\\Desktop\\llama.cpp\\prompts\\test.txt']);
        replyBuffer = [];
        shell.stdout.on('data', (data) => {
          output = data.toString('utf8');
          console.log(output);
          if (output.indexOf("\n") > -1) {
            replyBuffer.push(output);
            socketIO.emit("reply", {text: replyBuffer.join(" ")});
            replyBuffer.length = 0;
          }
          else {
            if (output == "," || output == ".")  {
              replyBuffer[replyBuffer.length - 1] = replyBuffer[replyBuffer.length - 1] + output
            }
            else {
              replyBuffer.push(output);
            }
          }
        })
      }
    });

});

app.use((req, res) => {
  res.send('Hello world');
});


app.get('/api', (req, res) => {
  res.json({
    message: 'Hello world',
  });
});

const PORT = process.env.PORT || 4000;

http.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);

});