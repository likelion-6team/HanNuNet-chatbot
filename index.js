//apiKey에 openAi api를 넣어야한다.
require("dotenv").config();
const apiKey = process.env.API_KEY;
const serverless = require("serverless-http");
const { Configuration, OpenAIApi } = require("openai");
const cors = require("cors");
const express = require("express");
const app = express();

const configuration = new Configuration({
  apiKey: apiKey,
});
const openai = new OpenAIApi(configuration);

// cors 이슈해결
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};

app.use(cors(corsOptions));

// post 요청
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.post("/hannunet", async function (req, res) {
  let { userMessages, assistantMessages } = req.body;

  let messages = [
    {
      role: "system",
      content:
        "너는 전자기기를 추천해주는 chatbot이야. 내가 사용 용도를 말해주면 너는 전자기기를 추천해줘. 전자기기는 노트북, 데스크탑, 패드, 핸드폰, 그래픽카드 등 모든 전자기기를 다 잘 알아야 해. 3가지만 추천해줘. 다른 부가 설명은 하지말고 노트북 이름만 말해줘.",
    },
    {
      role: "user",
      content:
        "너는 전자기기를 추천해주는 chatbot이야. 내가 사용 용도를 말해주면 너는 전자기기를 추천해줘. 전자기기는 노트북, 데스크탑, 패드, 핸드폰, 그래픽카드 등 모든 전자기기를 다 잘 알아야 해. 3가지만 추천해줘. 다른 부가 설명은 하지말고 노트북 이름만 말해줘.",
    },
    {
      role: "assistant",
      content: "알겠습니다. 질문해주세요.",
    },
  ];

  while (userMessages.length != 0 || assistantMessages.length != 0) {
    if (userMessages.length != 0) {
      messages.push(
        JSON.parse(
          '{"role": "user", "content": "' +
            String(userMessages.shift()).replace(/\n/g, "") +
            '"}'
        )
      );
    }
    if (assistantMessages.length != 0) {
      messages.push(
        JSON.parse(
          '{"role": "assistant", "content": "' +
            String(assistantMessages.shift()).replace(/\n/g, "") +
            '"}'
        )
      );
    }
  }
  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    max_tokens: 300,
    temperature: 0.5,
    messages: messages,
  });
  let question = completion.data.choices[0].message["content"];
  console.log(taro);
  res.json({ assistant: question });
});

module.exports.handler = serverless(app); //serverless 사용

// app.listen(8080);
