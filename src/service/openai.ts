import OpenAI from "openai";

export const client = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"], // This is the default and can be omitted
});

export async function createCompletion(option: {
  client: OpenAI;
  model: "gpt-4o-mini";
  userPrompt: string;
  systemPrompt: string;
}): Promise<string> {
  const { client, model, userPrompt, systemPrompt } = option;
  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: userPrompt,
      },
    ],
  });

  if (
    !completion.choices ||
    !completion.choices[0].message ||
    !completion.choices[0].message.content
  ) {
    throw new Error();
  }

  return completion.choices[0].message.content;
}
