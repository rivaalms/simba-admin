export async function activateUser (userId: number) : Promise <string> {
   const response = await $api <API.Response <boolean>> (`/user/${userId}/activate`, {
      method: 'post'
   })

   return response.message!
}

export async function deactivateUser (userId: number) : Promise <string> {
   const response = await $api <API.Response <boolean>> (`/user/${userId}/inactivate`, {
      method: 'post',
   })

   return response.message!
}

export async function countUser () : Promise<Util.UserCount> {
   const response = await $api <API.Response<Util.UserCount>> (`/users/count`, {
      method: 'get'
   })

   return response.data
}