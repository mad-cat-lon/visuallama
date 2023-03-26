class Chat {
    static run() {
        const { spawn } = require('child_process');
        const shell = spawn('C:\\Users\\cyrus\\Desktop\\llama.cpp\\llama.exe',['-m', 'C:\\Users\\cyrus\\Desktop\\llama.cpp\\models\\7B\\ggml-model-q4_0.bin', '-n', '256', '--repeat_penalty', '1.0', '--color', '-i', '-r', '"User:"', '-f', 'C:\\Users\\cyrus\\Desktop\\llama.cpp\\prompts\\dan.txt'], { stdio: 'inherit' });
        shell.on('close',(code)=>{console.log('[shell] terminated :',code)});
    }
}
