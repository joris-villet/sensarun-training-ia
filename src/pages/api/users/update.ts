// src/pages/api/questions.ts
import type { APIRoute } from "astro";
import { createDB } from "../../../lib/db";
import { users } from "../../../db/schema";
import { eq } from "drizzle-orm";

export const PATCH: APIRoute = async (context: any) => {

  
  try {
    const dbUrl = context.locals?.runtime?.env?.DATABASE_URL || import.meta.env.DATABASE_URL;
    
    const { id } = await context.request.json();

    if (!dbUrl) {
        return new Response(JSON.stringify('DATABASE_URL not configured'), {
          status: 500
        })
      }
    
      const db = createDB(dbUrl);

    const result = await db.update(users)
      .set({ first_connection: false })
      .where(eq(users.id, id));

   console.log('result from database => ', result)

    return new Response(JSON.stringify(result), {
      headers: { "Content-Type": "application/json" },
    });

  } catch(err) {
    return new Response(JSON.stringify({
      message: "err api/questions => " + err,
    }))
  }
}
