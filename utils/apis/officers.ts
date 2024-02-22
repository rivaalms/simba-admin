export async function getOfficers (payload: API.Request.Query.Officer) : Promise <Util.LaravelPagination <Model.Officer[]>> {
   const response = await $api <API.Response <Util.LaravelPagination <Model.Officer[]>>> ('/officers', {
      method: 'GET',
      query: payload
   })
   return response.data
}

export async function getOfficerDetails (officerId: number) : Promise <Model.Officer> {
   const response = await $api <API.Response <Model.Officer>> (`/officer/${officerId}`, {
      method: 'GET'
   })
   return response.data
}

export async function createOfficer (payload: API.Request.Form.Officer) : Promise <Model.Officer> {
   const response = await $api <API.Response <Model.Officer>> ('/officer', {
      method: 'POST',
      body: payload
   })
   return response.data
}

export async function updateOfficer (officerId: number, payload: API.Request.Form.Officer) : Promise <string> {
   const response = await $api <API.Response <boolean>> (`/officer/${officerId}`, {
      method: 'PUT',
      body: payload
   })
   return response.message!
}

export async function deleteOfficer (officerId: number) : Promise <string> {
   const response = await $api <API.Response <boolean>> (`/officer/${officerId}`, {
      method: 'DELETE',
   })
   return response.message!
}