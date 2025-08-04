import type { APIRoute } from "astro";
import { Groq } from "groq-sdk";
import type { IMessage } from "../../interfaces";

export const POST: APIRoute = async (context: any) => {

  const promptTemplate = `
Tu es un assistant chargé d'extraire des valeurs claires et interprétables des réponses d'un formulaire sportif.

IMPORTANT: Détecte d'abord si l'utilisateur pose une QUESTION au lieu de donner une réponse.

Si l'utilisateur pose une question (contient ?, "pourquoi", "est-ce que", "comment", etc.), réponds à sa question de manière utile :
{
  "field": "question",
  "value": null,
  "text": "[Réponse claire et utile à la question posée]",
  "valid": false
}

Si la réponse est claire et interprétable pour le champ attendu, retourne :
{
  "field": "poids",
  "value": 75,
  "text": "75 kg",
  "valid": true
}

Si la réponse est floue, ambigüe ou incorrecte pour le champ attendu, demande des précisions :
{
  "field": "âge",
  "value": null,
  "text": "Désolé, je n'ai pas compris. Pouvez-vous préciser votre âge ?",
  "valid": false
}

Exemples de questions à reconnaître :
- "est ce obligatoire?" → Expliquer pourquoi l'information est demandée
- "pourquoi vous demandez ça?" → Expliquer l'utilité de la donnée
- "c'est confidentiel?" → Rassurer sur la confidentialité
- "comment ça marche?" → Expliquer le processus

Instructions :
- "field" = nom du champ détecté OU "question" si c'est une question
- "value" = valeur brute interprétée (nombre/string) OU null pour les questions
- "text" = reformulation lisible OU réponse à la question
- "valid" = true si valeur cohérente, false pour questions ou réponses floues

Ne jamais discuter ou commenter. Réponds uniquement avec un JSON bien formé.
`;

  try {
    const groqApiKey = import.meta.env.API_KEY_GROQ_CLOUD || context.locals?.runtime?.env.API_KEY_GROQ_CLOUD;

    if (!groqApiKey) {
      return new Response(JSON.stringify({ error: "Missing GROQ_API_KEY" }), { status: 500 });
    }

    const groq = new Groq({ apiKey: groqApiKey });
    const messages: IMessage[] = await context.request.json();

    const system = {
      role: "system" as const,
      content: promptTemplate.trim(),
    };

    const answersAthlete = messages.map((m: IMessage) => ({
      role: m.role as "user" | "assistant" | "system",
      content: m.content,
    }));

    answersAthlete.unshift(system);

    const chatCompletion = await groq.chat.completions.create({
      messages: answersAthlete,
      model: "llama-3.3-70b-versatile",
      temperature: 0.4,
      max_completion_tokens: 300,
      top_p: 0.8,
      stream: false,
    });

    const output = chatCompletion.choices[0].message;
    console.log('réponse brute => ', output.content);

    try {
      // Parser le JSON retourné par le LLM
      const parsedResponse = JSON.parse(output.content ?? '{}');
      console.log('réponse parsée => ', parsedResponse);
      
      // Retourner directement l'objet parsé
      return new Response(JSON.stringify(parsedResponse));
      
    } catch (parseError) {
      console.error('Erreur de parsing JSON:', parseError);
      // Si le parsing échoue, retourner une réponse d'erreur
      return new Response(JSON.stringify({
        field: "unknown",
        value: null,
        text: "Désolé, une erreur s'est produite. Pouvez-vous reformuler votre réponse ?",
        valid: false
      }));
    }

  } catch (err) {
    console.error('Erreur API:', err);
    return new Response(JSON.stringify({
      field: "unknown",
      value: null,
      text: "Désolé, une erreur s'est produite. Veuillez réessayer.",
      valid: false
    }), { status: 500 });
  }
};