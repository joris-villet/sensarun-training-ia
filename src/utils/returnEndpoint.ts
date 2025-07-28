


export const send = (message: string) => {
  return new Response(JSON.stringify(message))
}