//Renvoie une Promise
//input : url/object/response
//Init : options du fetch
export const requestJson = async <T>(
  input: RequestInfo | Response,
  init: RequestInit,
): Promise<T> => {
  //Si input est déjà un Response, on l’utilise directement.
  const res = input instanceof Response ? input : await fetch(input, init);
  if (!res.ok) {
    let message = "Erreur API.";
    try {
      const data = await res.json();
      if (typeof data?.detail === "string") {
        message = data.detail;
        console.log(message);
      }
    } catch {}
    throw new Error(message);
  }
  return res.json() as Promise<T>;
};
