import type { APIRoute } from 'astro';
import { users } from '../../../../db/schema';
import { eq } from 'drizzle-orm';
import { db } from '../../../../lib/db';


export const GET: APIRoute = async (context: any) => {
  // console.log('=== OAUTH CALLBACK START ===');
  // console.log('URL:', context.url.toString());
  // console.log('Origin:', context.url.origin);

  const dbUrl =
    context.locals?.runtime?.env?.DATABASE_URL ||
    import.meta.env.DATABASE_URL; // fallback local

  const googleClientId =
    context.locals?.runtime?.env?.GOOGLE_CLIENT_ID ||
    import.meta.env.GOOGLE_CLIENT_ID;

  const googleClientSecret =
    context.locals?.runtime?.env?.GOOGLE_CLIENT_SECRET ||
    import.meta.env.GOOGLE_CLIENT_SECRET;

  if (!dbUrl) {
    return new Response(JSON.stringify('DATABASE_URL not configured'), {
      status: 500
    })
  }

  const code = context?.url?.searchParams.get('code');
  console.log('Code received:', code ? 'YES' : 'NO');

  if (!code) {
    console.log('ERROR: Missing code');
    return new Response(JSON.stringify('Missing code'), {
      status: 400
    })
  }

  try {
    // console.log('Environment check:');
    // console.log('GOOGLE_CLIENT_ID:', context.locals.runtime.env.GOOGLE_CLIENT_ID ? 'SET' : 'NOT SET');
    // console.log('GOOGLE_CLIENT_SECRET:', context.locals.runtime.env.GOOGLE_CLIENT_SECRET ? 'SET' : 'NOT SET');
    // console.log('DATABASE_URL:', context.locals.runtime.env.DATABASE_URL ? 'SET' : 'NOT SET');

    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: googleClientId,
        client_secret: googleClientSecret,
        redirect_uri: `${context.url?.origin}/api/auth/google/callback`,
        grant_type: 'authorization_code',
      }),
    });

    console.log("token response => ", tokenRes)

    console.log('Token response status:', tokenRes.status);

    if (!tokenRes.ok) {
      const errorText = await tokenRes.text();
      console.log('Token error response:', errorText);
      return new Response(JSON.stringify(`Token error: ${errorText}`), {
        status: 401
      })
    }


    const token = await tokenRes.json();
    console.log('Token received:', token.access_token ? 'YES' : 'NO');

    if (!token.access_token) {
      return new Response(JSON.stringify('Token error'), {
        status: 401
      })
    }

    // 3. Récupère le profil utilisateur
    const profileRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${token.access_token}` },
    });

    const profile = await profileRes.json();

    console.log("profile => ", profile);

    if (profile.email !== "jorisvillet@gmail.com") {
      return new Response(JSON.stringify('Accès refusé - Application en développement'), {
        status: 403
      })
    }

    let [existingUser] = await db.select().from(users).where(eq(users.email, profile.email)).limit(1);

    let user;

    if (!existingUser) {
      [user] = await db.insert(users).values({
        name: profile.name,
        google_id: profile.id,
        email: profile.email,
        picture: profile.picture,
        first_connection: true, // explicitly set to true for new users
      }).returning()
   
    } else {
      // Update the existing user's first_connection to false
   
      await db.update(users)
        .set({ first_connection: false })
        .where(eq(users.email, profile.email))
        .returning();
    }

    // Créer le cookie de session
    const sessionData = {
      userId: existingUser.id,
      email: existingUser.email,
      name: existingUser.name,
      google_id: existingUser.google_id,
      first_connection: existingUser.first_connection,
      picture: existingUser.picture,
    };

    context.cookies.set('session', JSON.stringify(sessionData), {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 jours
      path: '/',
    });

    // Rediriger vers la page d'accueil ou dashboard
    return context.redirect(new URL('/', context.url.origin));

  } catch (error: any) {
    console.error('OAUTH ERROR:', error);
    return new Response(JSON.stringify(`Error: ${error.message}`), {
      status: 500
    })
  }
};





// import jwt from 'jsonwebtoken';

// // Dans votre callback
// const token = jwt.sign(
//   { userId: user.id, email: user.email },
//   process.env.JWT_SECRET!, // Ajoutez cette variable dans .env
//   { expiresIn: '7d' }
// );

// cookies.set('session', token, {
//   httpOnly: true,
//   secure: process.env.NODE_ENV === 'production',
//   sameSite: 'lax',
//   maxAge: 60 * 60 * 24 * 7,
//   path: '/',
// });