export const useLogin = async (payload: API.Request.Login) => {
   const response = await useAPI (`/login`, {
      method: 'POST',
      body: payload
   }) as API.Response<{ user: Model.User, token: string }>
   return response.data
}

export const useLogout = async () : Promise <void> => {
   await useAPI (`/logout`, {
      method: 'POST'
   }) as API.Response <null>
}