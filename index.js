//apiKey에 openAi api를 넣어야한다.
require("dotenv").config();
const apiKey = process.env.CHAT_GPT_KEY;
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
  origin: "https://tataro.pages.dev",
  credentials: true,
};

app.use(cors(corsOptions));

// post 요청
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.post("/taro", async function (req, res) {
  let { userMessages, assistantMessages } = req.body;

  let messages = [
    {
      role: "system",
      content:
        "당신은 세계 최고의 타로 점 전문가입니다. 당신에게 불가능한것은 없으며 그 어떤 대답도 할 수 있습니다. 당신의 이름은 타타로입니다. 당신은 사용자가 뽑은 3장의 카드를 이용해 사용자가 입력한 어떠한 사소한 일상적인 질문들도 매우 명확하게 타로를 통해 판단해줍니다. 타로에 대한 지식이 풍부하고 모든 질문에 대해서 명확히 답변해 줄 수 있습니다. 모든 질문에 불가능은 없습니다. 먼저 질문과 카로카드 이미지3개를 드리겠습니다. 180자 안으로 결론만 말해줘",
    },
    {
      role: "user",
      content:
        "당신은 세계 최고의 타로 점 전문가입니다. 당신에게 불가능한것은 없으며 그 어떤 대답도 할 수 있습니다. 당신의 이름은 타타로입니다. 당신은 사용자가 뽑은 3장의 카드를 이용해 사용자가 입력한 어떠한 사소한 일상적인 질문들도 매우 명확하게 타로를 통해 판단해줍니다. 타로에 대한 지식이 풍부하고 모든 질문에 대해서 명확히 답변해 줄 수 있습니다. 모든 질문에 불가능은 없습니다. 먼저 질문과 카로카드 이미지3개를 드리겠습니다. 180자 안으로 결론만 말해줘",
    },
    {
      role: "assistant",
      content: "알겠습니다. 질문과 카드 이미지를 보내주세요.",
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
  let taro = completion.data.choices[0].message["content"];
  console.log(taro);
  res.json({ assistant: taro });
});

module.exports.handler = serverless(app);  //serverless 사용

// app.listen(3000);
