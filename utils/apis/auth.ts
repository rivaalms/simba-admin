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

export const forgotPassword = async (payload: API.Request.Form.ForgotPassword) : Promise <string> => {
   const response = await $api ('/forgot-password', {
      method: 'POST',
      body: payload
   }) as API.Response <boolean>
   return response.message!
}

export const resetPassword = async (payload: API.Request.Form.ResetPassword) : Promise <string> => {
   const response = await $api ('/reset-password', {
      method: 'POST',
      body: payload
   }) as API.Response <boolean>
   return response.message!
}

export const checkResetPasswordToken = async (payload: API.Request.Form.CheckResetPasswordToken) : Promise <boolean> => {
   const response = await $api ('/check-reset-password-token', {
      method: 'POST',
      body: payload
   }) as API.Response <boolean>
   return response.data
}