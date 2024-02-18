import dotenv from "dotenv";
dotenv.config();
import axios from "axios";
import yup from "yup";

const CHATGPT_END_POINT = "https://api.openai.com/v1/chat/completions";
const CHATGPT_MODEL = "gpt-3.5-turbo";

const config = {
  headers: {
    Authorization: `Bearer ${process.env.CHATGPT_API_KEY}`,
  },
};

const buildConversation = async (contextMessage, conversation) => {
  return [contextMessage].concat(conversation);
};

// Function to post a message to the ChatGPT API
export const postChatGPTMessage = async (contextMessage, conversation) => {
  const messages = buildConversation(contextMessage, conversation);

  const chatGPTData = {
    model: CHATGPT_MODEL,
    messages: messages,
  };

  try {
    const resp = await axios.post(CHATGPT_END_POINT, chatGPTData, config);
    const data = resp.data;
    const message = data?.choices[0]?.message; // Get response message
    return message;
  } catch (error) {
    console.error("Error with ChatGPT API"); // Log error message
    console.error(error);
    return null;
  }
};

export const createMessage = (message, role) => {
  return {
    role: role,
    content: message,
  };
};

export const addMessageToConversation = (message, conversation, role) => {
  conversation.push(createMessage(message, role));
};

const conversationSchema = yup.object().shape({
  role: yup.string().required("Role is required"),
  content: yup.string().required("Content is required"),
});

const requestSchema = yup.object().shape({
  context: yup.string().required(),
  message: yup.string().required(),
  conversation: yup.array().of(conversationSchema).notRequired(),
});

export const isValidRequest = (request) => {
  try {
    requestSchema.validateSync(request);
    return true;
  } catch (error) {
    return false;
  }
};
