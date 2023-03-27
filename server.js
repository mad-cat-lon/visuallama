const app = require("express")();
const { spawn } = require('child_process');
var http = require('http').createServer(app);

const LLAMA_EXE_PATH = 'C:\\Users\\cyrus\\Desktop\\llama.cpp\\llama.exe'

var MODELS = [{
  name: "Alpaca 7B 4-bit quantized",
  id: 1,
  sockets: [],
  participants: 0,
  model_path: "C:\\Users\\cyrus\\Desktop\\llama.cpp\\models\\7B\\ggml-model-q4_0.bin",
  prompt_path: 'C:\\Users\\cyrus\\Desktop\\llama.cpp\\prompts\\test.txt',
  top_k: 40,
  top_p: 0.9,
  num_tokens: 128,
  repeat_penalty: 1.3,
  repeat_penalty_num_tokens: 64,
  temp: 0.8,
  proc: null,
}]

const socketIO = require('socket.io')(http, {
  cors: {
    origin: "http://localhost:3000"
  }
});

const PORT = process.env.PORT || 4000;

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});


http.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

socketIO.on('connection', (socket) => {
    console.log(`⚡: ${socket.id} user just connected!`);
    
    socket.on('load-model', id => {
      console.log(`[*] Loading model ${id}`);
      MODELS.forEach(m => {
        if ((m.id == id) && (m.proc == null)) {
          if (m.sockets.indexOf(socket.id) == -1) {
            m.sockets.push(socket.id);
            m.participants++;
            socketIO.emit('model', m);
            m.proc = spawn(LLAMA_EXE_PATH, ['-m', m.model_path, '-n', '256', '--repeat_penalty', '1.0', '-i', '-r', '"User:"', '-f', m.prompt_path])
            if (m.proc != null) {
              replyBuffer = [];
              m.proc.stdout.on('data', (data) => {
                output = data.toString('utf8');
                console.log(`Reply from ${m.name}: ${output}`);
                if (output.includes("\n")) {
                  replyBuffer.push(output);
                  console.log("Sending message...");
                  socketIO.emit("message", {model_id: m.id, senderName: m.name, text: replyBuffer.join(" ")});
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
              });
            }
          }
        }
      });
      return id;
    });

    socket.on('send-message', (message) => {
      console.log(`Received message: ${message.text} from ${message.senderName} to model ${message.model_id}`);
      socketIO.emit('message', message);
    });

    socket.on('disconnect', () => {
      MODELS.forEach(m => {
          let index = m.sockets.indexOf(socket.id);
          if (index != (-1)) {
              m.sockets.splice(index, 1);
              m.participants--;
              socketIO.emit('model', m);
          }
      });
    });

});

app.get('/getModels', (req, res) => {
  res.json({
      models: MODELS
  })
});