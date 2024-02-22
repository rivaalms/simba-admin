export const login = async (payload: API.Request.Login) => {
   const response = await $api <API.Response <{ user: Model.User<null>, token: string}>> ('/login', {
      method: 'POST',
      body: payload
   })
   return response.data
}

export const logout = async () : Promise <void> => {
   await $api <API.Response <null>> ('/logout', {
      method: 'POST'
   })
}

export const forgotPassword = async (payload: API.Request.Form.ForgotPassword) : Promise <string> => {
   const response = await $api <API.Response <boolean>> ('/forgot-password', {
      method: 'POST',
      body: payload
   })
   return response.message!
}

export const resetPassword = async (payload: API.Request.Form.ResetPassword) : Promise <string> => {
   const response = await $api <API.Response <boolean>> ('/reset-password', {
      method: 'POST',
      body: payload
   })
   return response.message!
}

export const checkResetPasswordToken = async (payload: API.Request.Form.CheckResetPasswordToken) : Promise <boolean> => {
   const response = await $api <API.Response <boolean>> ('/check-reset-password-token', {
      method: 'POST',
      body: payload
   })
   return response.data
}