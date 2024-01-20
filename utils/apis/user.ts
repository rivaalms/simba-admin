export async function activateUser (userId: number) : Promise <string> {
   const response = await $api(`/user/${userId}/activate`, {
      method: 'post'
   }) as API.Response <boolean>

   return response.message!
}

export async function deactivateUser (userId: number) : Promise <string> {
   const response = await $api(`/user/${userId}/inactivate`, {
      method: 'post',
   }) as API.Response <boolean>

   return response.message!
}