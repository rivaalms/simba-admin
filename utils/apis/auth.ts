export const login = async (payload: API.Request.Login) => {
   const response = await $api ('/login', {
      method: 'POST',
      body: payload
   }) as API.Response <{ user: Model.User, token: string}>
   return response.data
}

export const logout = async () : Promise <void> => {
   await $api ('/logout', {
      method: 'POST'
   }) as API.Response <null>
}