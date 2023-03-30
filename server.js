const app = require("express")();
const { spawn } = require('child_process');
var http = require('http').createServer(app);

const LLAMA_EXE_PATH = 'C:\\Users\\cyrus\\Desktop\\llama.cpp\\llama.exe'

var MODELS = [{
  name: "7b-ggml-model-q4",
  id: 1,
  sockets: [],
  participants: 0,
  model_path: "C:\\Users\\cyrus\\Desktop\\llama.cpp\\models\\7B\\ggml-model-q4_0.bin",
  prompt_path: 'C:\\Users\\cyrus\\Desktop\\llama.cpp\\prompts\\test.txt',
  top_k: 40,
  top_p: 0.9,
  num_tokens: 100,
  repeat_penalty: 1.3,
  repeat_penalty_num_tokens: 64,
  temp: 0.1,
  proc: null,
},
{
  name: "13b-ggml-model-f16",
  id: 2,
  sockets: [],
  participants: 0,
  model_path: "C:\\Users\\cyrus\\Desktop\\llama.cpp\\models\\13B\\ggml-model-f16.bin",
  prompt_path: 'C:\\Users\\cyrus\\Desktop\\llama.cpp\\prompts\\test.txt',
  top_k: 40,
  top_p: 0.9,
  num_tokens: 100,
  repeat_penalty: 1.3,
  repeat_penalty_num_tokens: 64,
  temp: 0.1,
  proc: null,
},
{
  name: "13b-ggml-model-q4",
  id: 3,
  sockets: [],
  participants: 0,
  model_path: "C:\\Users\\cyrus\\Desktop\\llama.cpp\\models\\13B\\ggml-model-q4_0.bin",
  prompt_path: 'C:\\Users\\cyrus\\Desktop\\llama.cpp\\prompts\\test.txt',
  top_k: 40,
  top_p: 0.9,
  num_tokens: 100,
  repeat_penalty: 1.3,
  repeat_penalty_num_tokens: 64,
  temp: 0.1,
  proc: null,
}
]

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
            // We need to ignore the first token that gets outputted
            let firstToken = true;
            m.proc = spawn(LLAMA_EXE_PATH, ['-m', m.model_path, '-n', m.num_tokens, '--repeat_penalty', m.repeat_penalty, '--interactive-start'])
            if (m.proc != null) {
              console.log(`[*] Model ${id} loaded`)
              replyBuffer = [];
              m.proc.stdout.on('data', (data) => {
                // this is hacky, fix this later
                if (firstToken == false) {
                  output = data.toString('utf8');
                  console.log(`Reply from ${m.name}: ${output}`);
                  /*
                  console.log(`Reply from ${m.name}: ${output}`);
                  if (output == "," || output == "." || output == ";" || output == "!" || output == "?")  {
                    replyBuffer.push(output);
                    console.log("Sending message...");
                    socketIO.emit("message", {model_id: m.id, senderName: m.name, text: replyBuffer.join("")});
                    replyBuffer.length = 0;
                  }
                  else {
                    replyBuffer.push(output);
                  }
                  */
                socketIO.emit("output", {model_id: m.id, senderName: m.name, text: output});
                }
                else {
                  firstToken = false;
                }
              });
              m.proc.stdout.on('close', (code) => {
                console.log("Finished output.");
                socketIO.emit("finished", {model_id: m.id, senderName: m.name, text: `END OF OUTPUT`});
                m.proc = null;
              });
            }
          }
        }
      });
      return id;
    });

    socket.on('unload-model', (id) => {
      MODELS.forEach(m => {
        if ((m.id == id) && (m.proc != null)) {
          console.log(`Unloading model ${id}`);
          m.proc.kill();
          m.proc = null;
          console.log(`Model ${id} unloaded`);
        }
      });
      return id;
    });
    

    socket.on('send-input', (message) => {
      console.log(`Received input: ${message.text} from ${message.senderName} to model ${message.model_id}`);
      socketIO.emit('input', message);
      MODELS.forEach(m => {
        if ((m.id === message.model_id) && (m.proc != null)) {
          console.log("Sending message to model stdin")
          m.proc.stdin.setEncoding('utf-8');
          m.proc.stdin.write(message.text.concat("\n"));
        }
      })
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

