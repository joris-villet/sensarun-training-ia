// // src/pages/api/answer.ts
// import type { APIRoute } from 'astro';
// import { db } from '../../lib/db'; // adjust based on your setup
// import { profileAnswers } from '../../db/schema';
// import { eq } from 'drizzle-orm';

// export const POST: APIRoute = async (context: any) => {
//   try {
//     const { user } = context.locals;

//     if (!user || !user.id) {
//       return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
//     }

//     const body = await context.request.json();

//     const { questionId, value } = body;

//     if (!questionId || !value) {
//       return new Response(JSON.stringify({ error: 'Missing data' }), { status: 400 });
//     }

//     // Optional: check if answer already exists
//     const existing = await db
//       .select()
//       .from(profileAnswers)
//       .where(
//         eq(profileAnswers.userId, user.id),
//         eq(profileAnswers.questionId, questionId)
//       );

//     if (existing.length > 0) {
//       return new Response(
//         JSON.stringify({ error: 'Answer already exists' }),
//         { status: 409 }
//       );
//     }

//     // Insert new answer
//     await db.insert(profileAnswers).values({
//       userId: user.id,
//       questionId,
//       value,
//     });

//     return new Response(JSON.stringify({ success: true }), { status: 201 });
//   } catch (err) {
//     console.error(err);
//     return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
//   }
// };
