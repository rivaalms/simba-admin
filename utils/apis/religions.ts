export async function getReligions (payload?: API.Request.Query.Religion) : Promise <Util.Religion[] | Util.LaravelPagination <Util.Religion[]>> {
   const response = await $api <API.Response <Util.Religion[] | Util.LaravelPagination <Util.Religion[]>>> ('/religions', {
      method: 'GET',
      query: payload
   })
   return response.data
}

export async function createReligion (payload: API.Request.Form.Religion) : Promise <Util.Religion> {
   const response = await $api <API.Response <Util.Religion>> ('/religion', {
      method: 'POST',
      body: payload
   })
   return response.data
}

export async function updateReligion (id: number, payload: API.Request.Form.Religion) : Promise <string> {
   const response = await $api <API.Response <boolean>> (`/religion/${id}`, {
      method: 'PUT',
      body: payload
   })
   return response.message!
}

export async function deleteReligion (id: number) : Promise <string> {
   const response = await $api <API.Response <boolean>> (`/religion/${id}`, {
      method: 'DELETE',
   })
   return response.message!
}