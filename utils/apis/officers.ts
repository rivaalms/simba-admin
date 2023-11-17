export async function getOfficers (payload: API.Request.Query.Officer) : Promise <Util.LaravelPagination <Model.Officer[]>> {
   const response = await $api('/officers', {
      method: 'GET',
      query: payload
   }) as API.Response <Util.LaravelPagination <Model.Officer[]>>
   return response.data
}

export async function createOfficer (payload: API.Request.Form.Officer) : Promise <Model.Officer> {
   const response = await $api('/officer', {
      method: 'POST',
      body: payload
   }) as API.Response <Model.Officer>
   return response.data
}

export async function updateOfficer (officerId: number, payload: API.Request.Form.Officer) : Promise <string> {
   const response = await $api(`/officer/${officerId}`, {
      method: 'PUT',
      body: payload
   }) as API.Response <boolean>
   return response.message!
}

export async function deleteOfficer (officerId: number) : Promise <string> {
   const response = await $api('/officer', {
      method: 'DELETE',
      body: {
         id: officerId
      }
   }) as API.Response <boolean>
   return response.message!
}