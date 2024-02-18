import express from "express";
import {
  addMessageToConversation,
  createMessage,
  isValidRequest,
  postChatGPTMessage,
} from "../utils/chatGPTUtil.js";
import USER_TYPES from "../constants/chatGPTRoles.js";

const router = express.Router();

router.post("/", async (req, res) => {
  if (!isValidRequest(req.body)) {
    return res.status(400).json({ error: "Invalid request" });
  }

  const { context, message, conversation = [] } = req.body;

  const contextMessage = createMessage(context, USER_TYPES.SYSTEM);

  addMessageToConversation(message, conversation, USER_TYPES.USER);

  const chatGPTResponse = await postChatGPTMessage(
    contextMessage,
    conversation
  );

  // Check if there was an error with the ChatGPT API
  if (!chatGPTResponse) {
    return res.status(500).json({ error: "Error with ChatGPT" });
  }

  // Get the content from the ChatGPT response
  const { content } = chatGPTResponse;
  addMessageToConversation(content, conversation, USER_TYPES.ASSISTANT);

  console.log("Updated conversation:\n", conversation);
  return res.status(200).json({ message: conversation });
});

export default router;
