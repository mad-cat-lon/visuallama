const express = require("express");
const { spawn } = require('child_process');
const app = express();

app.post("/post", (req, res) => {
  console.log("received post request");
  console.log(req.body);
  const shell = spawn('C:\\Users\\cyrus\\Desktop\\llama.cpp\\llama.exe',['-m', 'C:\\Users\\cyrus\\Desktop\\llama.cpp\\models\\7B\\ggml-model-q4_0.bin', '-n', '256', '--repeat_penalty', '1.0', '--color', '-i', '-r', '"User:"', '-f', 'C:\\Users\\cyrus\\Desktop\\llama.cpp\\prompts\\chat-with-bob.txt'], { stdio: 'inherit' });
  shell.on('close',(code)=>{console.log('[shell] terminated :',code)});
});
  
const PORT = process.env.PORT || 8080;
  
app.listen(PORT, console.log(`Server started on port ${PORT}`));    