import type { APIRoute } from 'astro';


export const GET: APIRoute = async (context: any) => {

  try {
    const runtime = context.locals?.runtime;
    
    const clientId =
    runtime?.env?.GOOGLE_CLIENT_ID ||
    import.meta.env.GOOGLE_CLIENT_ID; 

    if (!clientId) {
      return new Response(JSON.stringify('Google Client ID not configured'));
    }

    const baseUrl = context.url.origin;
    
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: `${baseUrl}/api/auth/google/callback`,
      response_type: 'code',
      scope: 'openid email profile',
      prompt: 'consent',
    });

    return context.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`);
    
  } catch (error) {
    console.error('OAuth redirect error:', error);
    return new Response(JSON.stringify('Authentication error'));
  }
};

