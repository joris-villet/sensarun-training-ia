

export function onRequest(context: any, next: any) {

  //console.log('je passe par middleware')
  const groqApiKey = import.meta.env.API_KEY_GROQ_CLOUD || context.locals?.runtime?.env.API_KEY_GROQ_CLOUD;
  //console.log('clé api', groqApiKey)

  let currentUser = "";

  const sessionCookie = context.cookies.get("session");
  //console.log("session cookie => ", sessionCookie);

  if (sessionCookie) {
    currentUser = JSON.parse(context.cookies.get('session').value);
    // console.log("current user => ", currentUser)
    context.locals.user = currentUser;
  }

  // Routes publiques
  const isPublicRoute = 
    context.url.pathname === '/login' ||
    context.url.pathname.startsWith('/api');

  // Si pas de session ET route privée
  if (!sessionCookie && !isPublicRoute) {
    console.log('route interdites - pas de session');
    return context.redirect('/login');
  }

  // Optionnel : parser et valider le cookie
  if (sessionCookie) {
    try {
      const sessionData = JSON.parse(sessionCookie.value);
      console.log('User connecté:', sessionData.email);
      // Vous pouvez ajouter sessionData au context si nécessaire
    } catch (error) {
      console.log('Cookie session invalide');
      return context.redirect('/login');
    }
  }

  // console.log('route autorisées');
  return next();
}