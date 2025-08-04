// src/pages/api/questions.ts
import type { APIRoute } from "astro";
import { db } from "../../../lib/db";
import { users } from "../../../db/schema";
import { eq } from "drizzle-orm";

export const PATCH: APIRoute = async (context: any) => {

  const { id } = await context.request.json();

  try {
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
