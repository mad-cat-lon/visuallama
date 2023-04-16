const app = require("express")();
const { spawn } = require('child_process');
var http = require('http').createServer(app);
const bodyParser = require('body-parser');

const LLAMA_EXE_PATH = 'your\\path\\goes\\here'

var MODELS = [{
  name: "gpt4all-lora-quantized",
  id: 0,
  sockets: [],
  participants: 0,
  model_path: "your\\path\\goes\\here",
  prompt_path: 'your\\path\\goes\\here',
  top_k: 40,
  top_p: 0.9,
  num_tokens: 100,
  repeat_penalty: 1.3,
  repeat_penalty_num_tokens: 64,
  temp: 0.1,
  proc: null,
},
{
  name: "gpt4all-lora-quantized-unfiltered",
  sockets: [],
  id: 1,
  participants: 0,
  model_path: "your\\path\\goes\\here",
  prompt_path: 'your\\path\\goes\\here',
  top_k: 40,
  top_p: 0.9,
  num_tokens: 100,
  repeat_penalty: 1.3,
  repeat_penalty_num_tokens: 64,
  temp: 0.1,
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

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

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
            m.proc = spawn(LLAMA_EXE_PATH, ['-m', m.model_path, '-n', m.num_tokens, '--repeat_penalty', m.repeat_penalty, '--interactive-start', '--color'])
            if (m.proc != null) {
              console.log(`[*] Model ${id} loaded`)
              m.proc.stdout.on('data', (data) => {
                // this is hacky, fix this later
                if (firstToken == false) {
                  output = data.toString('utf8').replace(/\u001b[^m]*?m/g, "");
                  console.log(`Output from ${m.name}: ${output}`);
                  if (output.includes("\n> ")) {
                    socketIO.emit("finished", {model_id: m.id, senderName: m.name, question: false, text: ""}); 
                  }
                  else {
                    socketIO.emit("output", {model_id: m.id, senderName: m.name, question: false, text: output});
                  }
                }
                else {
                  firstToken = false;
                }
              });
              m.proc.stdout.on('close', (code) => {
                console.log("Finished output.");
                socketIO.emit("finished", {model_id: m.id, senderName: m.name, question: false, text: `END OF OUTPUT`}); 
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
      let msg = message;
      msg.question = true;
      socketIO.emit('input', msg);
      MODELS.forEach(m => {
        if ((m.id === msg.model_id) && (m.proc != null)) {
          console.log("Sending message to model stdin")
          m.proc.stdin.setEncoding('utf-8');
          m.proc.stdin.write(msg.text.concat("\n"));
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

app.post('/editModelConfig', (req, res) => {
  console.log('Got body', req.body);
  res.sendStatus(200);
})
