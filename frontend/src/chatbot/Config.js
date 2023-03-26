import { createChatBotMessage } from "react-chatbot-kit";
import DogPicture from '../components/DogPicture.jsx'


const Config = {
  initialMessages: [createChatBotMessage(`Hello!`)],
  widgets: [
    {widgetName: 'dogPicture', widgetFunc: (props) => <DogPicture {...props} />,},
  ],
}

export default Config