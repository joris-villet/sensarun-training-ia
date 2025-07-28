import type { APIRoute } from "astro";
import { Groq } from "groq-sdk";
import type { IMessage } from "../../interfaces";

export const POST: APIRoute = async (context: any) => {

  const promptTemplate = `
    - Tu es un coach assistant personnel et expert en course à pieds.
    - Tu réponds uniquement à la question de l'athlète.
    - S'il te demande de s'améliorer et que tu n'as pas de données à propos de l'athlète n'hésite pas à demander
    par exemple ses derniers chronos, sa vma, poids, taille, objectis, tous ce qui pourrait améliorer ton planning entrainement.
    - Veille bien à équilibrer ton vocabulaire à l'athlète, si tu perçois qu'il est néophite, expliques lui ce qui n'est 
    pas clair pour lui.
  `;

  try {
    
  // const groqApiKey = import.meta.env.API_KEY_GROQ_CLOUD || context.locals?.runtime?.env.API_KEY_GROQ_CLOUD;

  //   if (!groqApiKey) {
  //     return new Response(JSON.stringify({ error: "Missing GROQ_API_KEY" }), { status: 500 });
  //   }
  
  //   const groq = new Groq({ apiKey: groqApiKey });
  //   const messages: IMessage[] = await context.request.json();

  //   const system = {
  //     role: "system" as const,
  //     content: promptTemplate.trim(),
  //   };

  //   const chatHistory = messages.map((m: IMessage) => ({
  //     role: m.role as "user" | "assistant" | "system",
  //     content: m.content,
  //   }));

  //   chatHistory.unshift(system);

  //   const chatCompletion = await groq.chat.completions.create({
  //     messages: chatHistory,
  //     model: "llama3-70b-8192",
  //     temperature: 0.2,
  //     max_completion_tokens: 150,
  //     top_p: 0.95,
  //     stream: false,
  //   });

  //   const output = chatCompletion.choices[0].message;

  //   return new Response(JSON.stringify({
  //     message: output.content,
  //   }));

    return new Response(JSON.stringify({
      message: 'ok',
    }));

  } 
  catch (err: any) {

    console.error("🔥 Error from GROQ API:", err);

    return new Response(JSON.stringify({
      error: err.message || "Unknown error"
    }), { status: 500 });
  }
};


// import type { APIRoute } from "astro";
// import { Groq } from "groq-sdk";

// // Types pour les données utilisateur
// interface AthleteProfile {
//   name?: string;
//   age?: number;
//   experience?: 'debutant' | 'intermediaire' | 'avance' | 'expert';
//   objectif?: 'forme' | '5k' | '10k' | 'semi' | 'marathon' | 'ultra';
//   fcMax?: number;
//   fcRepos?: number;
//   vma?: number; // Vitesse Maximale Aérobie
//   kilometrageHebdo?: number;
//   blessures?: string[];
//   disponibilite?: number; // jours par semaine
//   preferences?: string[];
// }

// interface CoachRequest {
//   messages: Array<{ role: string; content: string }>;
//   athleteProfile?: AthleteProfile;
//   intentType?: 'collecte_donnees' | 'analyse_demande' | 'programme_entrainement' | 'conseil_general' | 'motivation';
//   urgency?: 'low' | 'medium' | 'high';
// }

// // Configuration des prompts selon le contexte
// const getPromptConfig = (intentType: string, athleteProfile?: AthleteProfile) => {
//   const basePersonality = `Tu es un coach personnel expert en course à pied, bienveillant, précis et motivant.`;
  
//   switch (intentType) {
//     case 'collecte_donnees':
//       return {
//         template: `${basePersonality}
        
// MISSION: Collecter les données essentielles de l'athlète de manière conversationnelle.

// DONNÉES À COLLECTER (priorité):
// 1. Expérience en course (débutant/intermédiaire/avancé/expert)
// 2. Objectif principal (remise en forme, 5K, 10K, semi-marathon, marathon, ultra)
// 3. Kilométrage hebdomadaire actuel
// 4. Disponibilité (jours d'entraînement par semaine)
// 5. Historique de blessures
// 6. FC Max si connue
// 7. Tests récents (VMA, temps de référence)

// STYLE:
// - Pose UNE question à la fois
// - Reste naturel et conversationnel
// - Adapte tes questions selon les réponses précédentes
// - Encourage et rassure`,
//         temperature: 0.7,
//         maxTokens: 300
//       };

//     case 'analyse_demande':
//       return {
//         template: `${basePersonality}
        
// MISSION: Analyser la demande spécifique de l'athlète et identifier ses besoins.

// PROFIL ATHLÈTE: ${JSON.stringify(athleteProfile, null, 2)}

// ANALYSE À FAIRE:
// - Comprendre la demande exacte
// - Identifier les lacunes d'information
// - Détecter les signaux d'alarme (surmenage, blessure, objectifs irréalistes)
// - Prioriser les conseils selon l'urgence

// RÉPONSE:
// - Confirme ta compréhension de sa demande
// - Pose des questions de précision si nécessaire
// - Donne un premier conseil orienté`,
//         temperature: 0.5,
//         maxTokens: 400
//       };

//     case 'programme_entrainement':
//       return {
//         template: `${basePersonality}
        
// MISSION: Créer un programme d'entraînement personnalisé et détaillé.

// PROFIL ATHLÈTE: ${JSON.stringify(athleteProfile, null, 2)}

// PRINCIPES:
// - Progressivité absolue (règle des 10%)
// - Alternance travail/récupération
// - Spécificité selon l'objectif
// - Prévention des blessures

// STRUCTURE DE RÉPONSE:
// 1. Vue d'ensemble du programme (durée, fréquence)
// 2. Répartition hebdomadaire type
// 3. Description détaillée des séances
// 4. Zones de fréquence cardiaque si FCMax connue
// 5. Conseils de récupération
// 6. Signaux d'alarme à surveiller

// SOIS PRÉCIS: distances, allures, durées, récupération.`,
//         temperature: 0.3,
//         maxTokens: 800
//       };

//     case 'motivation':
//       return {
//         template: `${basePersonality}
        
// MISSION: Motiver et encourager l'athlète, gérer les moments difficiles.

// PROFIL ATHLÈTE: ${JSON.stringify(athleteProfile, null, 2)}

// APPROCHE:
// - Empathie et compréhension
// - Rappel des objectifs et des progrès
// - Conseils pratiques pour surmonter les obstacles
// - Perspective positive et réaliste

// TONE: Chaleureux, encourageant, mais pas naïf.`,
//         temperature: 0.8,
//         maxTokens: 350
//       };

//     default: // conseil_general
//       return {
//         template: `${basePersonality}
        
// PROFIL ATHLÈTE: ${athleteProfile ? JSON.stringify(athleteProfile, null, 2) : 'Profil non disponible - collecte les infos nécessaires'}

// Réponds de manière experte en t'appuyant sur les données de l'athlète si disponibles.
// Si tu manques d'informations importantes, demande-les avant de donner des conseils spécifiques.`,
//         temperature: 0.6,
//         maxTokens: 500
//       };
//   }
// };

// // Fonction pour détecter l'intention depuis les messages
// const detectIntent = (messages: Array<{ content: string }>): string => {
//   const lastMessage = messages[messages.length - 1]?.content.toLowerCase() || '';
  
//   // Mots-clés pour détecter l'intention
//   if (lastMessage.includes('programme') || lastMessage.includes('plan') || lastMessage.includes('entraînement')) {
//     return 'programme_entrainement';
//   }
  
//   if (lastMessage.includes('motivé') || lastMessage.includes('découragé') || lastMessage.includes('difficile')) {
//     return 'motivation';
//   }
  
//   if (lastMessage.includes('commencer') || lastMessage.includes('débuter') || lastMessage.includes('nouveau')) {
//     return 'collecte_donnees';
//   }
  
//   return 'conseil_general';
// };

// export const POST: APIRoute = async (context: any) => {
//   console.log('🏃‍♂️ Coach API appelée');

//   try {
//     const groqApiKey = import.meta.env.GROQ_API_KEY || context.locals?.runtime?.env.GROQ_API_KEY;

//     if (!groqApiKey) {
//       return new Response(JSON.stringify({ error: "Missing GROQ_API_KEY" }), { 
//         status: 500,
//         headers: { "Content-Type": "application/json" }
//       });
//     }

//     const requestData: CoachRequest = await context.request.json();
//     const { messages, athleteProfile, intentType, urgency = 'medium' } = requestData;

//     // Détection automatique de l'intention si non fournie
//     const detectedIntent = intentType || detectIntent(messages);
//     console.log('🎯 Intention détectée:', detectedIntent);
//     console.log('👤 Profil athlète:', athleteProfile ? 'présent' : 'absent');

//     // Configuration dynamique du prompt
//     const promptConfig = getPromptConfig(detectedIntent, athleteProfile);
    
//     const groq = new Groq({ apiKey: groqApiKey });

//     // Préparation des messages avec le prompt adapté
//     const systemMessage = {
//       role: "system" as const,
//       content: promptConfig.template,
//     };

//     const chatHistory = messages.map(m => ({
//       role: m.role as "user" | "assistant" | "system",
//       content: m.content,
//     }));

//     chatHistory.unshift(systemMessage);

//     console.log('⚙️ Config utilisée:', {
//       intent: detectedIntent,
//       temperature: promptConfig.temperature,
//       maxTokens: promptConfig.maxTokens,
//       hasProfile: !!athleteProfile
//     });

//     // Appel API avec configuration dynamique
//     const chatCompletion = await groq.chat.completions.create({
//       messages: chatHistory,
//       model: "llama3-70b-8192",
//       temperature: promptConfig.temperature,
//       max_completion_tokens: promptConfig.maxTokens,
//       top_p: 0.95,
//       stream: false,
//     });

//     const output = chatCompletion.choices[0].message;

//     return new Response(JSON.stringify({
//       message: output.content,
//       intent: detectedIntent,
//       config: {
//         temperature: promptConfig.temperature,
//         maxTokens: promptConfig.maxTokens,
//       },
//       suggestions: getSuggestions(detectedIntent, athleteProfile)
//     }), {
//       headers: { "Content-Type": "application/json" }
//     });

//   } catch (err: any) {
//     console.error("🔥 Erreur Coach API:", err);
    
//     return new Response(JSON.stringify({
//       error: err.message || "Unknown error",
//       type: err.constructor.name
//     }), { 
//       status: 500,
//       headers: { "Content-Type": "application/json" }
//     });
//   }
// };

// // Fonction pour suggérer des actions suivantes
// const getSuggestions = (intent: string, profile?: AthleteProfile): string[] => {
//   switch (intent) {
//     case 'collecte_donnees':
//       return [
//         "Quel est ton niveau actuel ?",
//         "Combien de fois cours-tu par semaine ?",
//         "As-tu un objectif précis ?"
//       ];
    
//     case 'programme_entrainement':
//       if (!profile?.fcMax) {
//         return [
//           "Comment calculer ma FC Max ?",
//           "J'ai besoin d'un test VMA",
//           "Modifier mon programme"
//         ];
//       }
//       return [
//         "Adapter le programme",
//         "Questions sur les allures",
//         "Conseils récupération"
//       ];
    
//     default:
//       return [
//         "Créer mon programme",
//         "Analyser mes performances",
//         "Conseils nutrition"
//       ];
//   }
// };