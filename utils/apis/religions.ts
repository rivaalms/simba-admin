export async function getReligions (payload?: API.Request.Query.Religion) : Promise <Util.Religion[] | Util.LaravelPagination <Util.Religion[]>> {
   const response = await $api('/religions', {
      method: 'GET',
      query: payload
   }) as API.Response <Util.Religion[] | Util.LaravelPagination <Util.Religion[]>>
   return response.data
}

export async function createReligion (payload: API.Request.Form.Religion) : Promise <Util.Religion> {
   const response = await $api ('/religion', {
      method: 'POST',
      body: payload
   }) as API.Response <Util.Religion>
   return response.data
}

export async function updateReligion (id: number, payload: API.Request.Form.Religion) : Promise <string> {
   const response = await $api (`/religion/${id}`, {
      method: 'PUT',
      body: payload
   }) as API.Response <boolean>
   return response.message!
}

export async function deleteReligion (id: number) : Promise <string> {
   const response = await $api ('/religion', {
      method: 'DELETE',
      body: {
         id
      }
   }) as API.Response <boolean>
   return response.message!
}