import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const basePromptPrefix = `
Explain the topic in simple language that can be understand by a high schooler. Give a high level summary that piques interest.
Topic:
`;
const generateAction = async (req, res) => {
  // Run first prompt
  console.log(`API: ${basePromptPrefix}${req.body.userInput}\n`);
  console.log(process.env.OPENAI_API_KEY);
  const baseCompletion = await openai.createCompletion({
    model: "text-davinci-002",
    prompt: `${basePromptPrefix}${req.body.userInput}`,
    temperature: 0.7,
    max_tokens: 250,
  });

  const basePromptOutput = baseCompletion.data.choices.pop();

  // I build Prompt #2.
  const secondPrompt = `
  Take the topic and a summary and write a high school essay about the topic. Go into details for terms that are not well understood.

  Topic: ${req.body.userInput}

  Summary: ${basePromptOutput.text}

  Essay:

  `;

  // I call the OpenAI API a second time with Prompt #2
  const secondPromptCompletion = await openai.createCompletion({
    model: "text-davinci-002",
    prompt: `${secondPrompt}`,
    // I set a higher temperature for this one. Up to you!
    temperature: 0.85,
    // I also increase max_tokens.
    max_tokens: 1250,
  });

  // Get the output
  const secondPromptOutput = secondPromptCompletion.data.choices.pop();

  // Send over the Prompt #2's output to our UI instead of Prompt #1's.
  res.status(200).json({ output: secondPromptOutput });
};

export default generateAction;
