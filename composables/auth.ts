export const useLogin = async (payload: API.Request.Login) => {
   const response = await $fetch <API.Response <{ user: Model.User, token: string }>> (`/login`, {
      method: 'POST'
   })
   return response.data
}

export const useLogout = async () : Promise <void> => {
   await $fetch <API.Response <null>> (`/logout`, {
      method: 'POST'
   })
}