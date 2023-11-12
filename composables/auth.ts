export const useLogin = async (payload: API.Request.Login) => {
   const response = await $api (`/login`, {
      method: 'POST',
      body: payload
   }) as API.Response<{ user: Model.User, token: string }>
   return response.data
}

export const useLogout = async () : Promise <void> => {
   await $api (`/logout`, {
      method: 'POST'
   }) as API.Response <null>
}