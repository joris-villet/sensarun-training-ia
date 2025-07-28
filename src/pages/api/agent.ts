import type { APIRoute } from "astro";
import { ChatOpenAI } from "@langchain/openai";
import type { IMessage } from "../../interfaces";

export const POST: APIRoute = async (context: any) => {

  // const promptTemplate = `
  //   Tu es un assistant coach en course à pieds.

  //   - Répond aux questions de l'utilisateur de façon simple.
  //   - Par exemple, si l'utilisateur ne connait pas sa FCMAX, expliques lui de façon simple et concise.
  //   - Génère un plan d'entrainement approprié aux objectifs de l'utilisateur s'il te le demande.
  // `;

  const promptTemplate = `
    - Tu es un coach personnel expert en course à pied, marathon et entraînement cardio. 
    - Tu es bienveillant, précis et motivant.
    - Par exemple, si l'utilisateur ne connait pas sa FCMAX, expliques lui de façon simple et concise
    - Tu aides ton client à structurer ses entraînements, éviter les blessures et atteindre ses objectifs. 
  `;


  const openAIApiKey = import.meta.env.OPENROUTER_API_KEY || context.locals?.runtime?.env.OPENROUTER_API_KEY;

  try {
    
      const model = new ChatOpenAI({ 
        apiKey: openAIApiKey,
        model: "deepseek/deepseek-r1-0528-qwen3-8b:free",
        temperature: 0.5,   
        configuration: {
          baseURL: "https://openrouter.ai/api/v1",
        },
      });

      const messages: IMessage[]  = await context.request.json(); // array messages ?
    console.log('messages stores => ', messages);

    const system = {
      role: 'system' as const,
      content: `${promptTemplate}`
    }

    const chatHistory = messages.map((message: IMessage) => {
      return {
        role: message.role as 'user' | 'assistant' | 'system',
        content: message.content
      }
    });
    
    const output = await model.invoke(chatHistory);

    if (output) {
      console.log("output => ", output)
      console.log("output model => ", output.content)
      console.log('total token => ', output.usage_metadata?.total_tokens)
    }
  
    return new Response(JSON.stringify({
      message: output.content,
      totalToken: output.usage_metadata?.total_tokens
    }))

  } 
  catch(err) {
    return new Response(JSON.stringify({
      message: err
    }))
  }
};