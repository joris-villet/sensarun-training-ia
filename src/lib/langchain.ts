import { ChatOpenAI } from "@langchain/openai";
// import { createGraph } from "langgraph";

export function callModel(modelName: string) {

  const model = new ChatOpenAI({
    modelName,
    openAIApiKey: process.env.OPENROUTER_API_KEY,
    configuration: {
      baseURL: "https://openrouter.ai/api/v1",
    },
  });

  return model;

  // const graph = createGraph()
  //   .addNode("prompt", async (input) => {
  //     return await model.invoke(`Donne un plan d'entraînement de base pour : ${input}`);
  //   })
  //   .setEntryPoint("prompt");

  // return graph;
}
