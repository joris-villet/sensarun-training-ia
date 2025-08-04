// src/pages/api/questions.ts
import type { APIRoute } from "astro";
import { db } from "../../lib/db";
import { profileQuestions } from "../../db/schema"; // your drizzle schema

export const GET: APIRoute = async (context: any) => {

  try {
    const questions = await db.select().from(profileQuestions).orderBy(profileQuestions.id);
   // console.log('questions from database => ', questions)
    return new Response(JSON.stringify(questions), {
      headers: { "Content-Type": "application/json" },
    });

  } catch(err) {
    return new Response(JSON.stringify({
      message: "err api/questions => " + err,
    }))
  }
}
