import express from "express";
import bodyParser from "body-parser";
import chatGPTRoutes from "./routes/chatGPT.js";

const app = express();

app.use(bodyParser.json());
const PORT = 3000;

app.use("/chatGPT", chatGPTRoutes);

app.use(({ err, req, res, next }) => {
  console.log(err.message);
  res.status(500).send("Internal server error");
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
