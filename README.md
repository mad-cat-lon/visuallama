## visuallama
A simple web interface for running [llama.cpp](https://github.com/ggerganov/llama.cpp) models locally, built using:
- [React](https://github.com/facebook/react) 
- [Material UI](https://github.com/mui/material-ui)
- [Express,js](https://github.com/expressjs/expressjs.com)
- [NodeJS](https://nodejs.org/en)
- MongoDB (not implemented yet)
- [Socket.IO](https://github.com/socketio/socket.io) and [socket.io-client](https://github.com/socketio/socket.io-client)

This is a work in progress and is being continually updated! I am not an expert in the MERN stack and web dev, so code and UX design may not always be of the highest quality! 

### Upcoming features 
- Unit tests 
- Might change backend from Express.js to Flask (this is my first time using Javascript and I'm more comfortable with Python)
- Easier setup and installation (paths to models and settings are currently hardcoded)
- Configuring model parameters like prompts, temperature etc. from web UI
- Storing model settings, chat history, logs etc. in MongoDB
- Cleaner UI 
- Support for multiple users

https://user-images.githubusercontent.com/113548315/228936879-af1c88ed-4269-4d28-b93d-c60ae6619d31.mp4

Tiny usage example (sped up slightly because my CPU is pretty slow, even when running running the smallest LLaMa model with 4-bit quantization) 
