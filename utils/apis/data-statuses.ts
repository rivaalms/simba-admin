export async function getDataStatus (payload: API.Request.Query.DataStatus) : Promise <Model.Data.Status[] | Util.LaravelPagination <Model.Data.Status[]>> {
   const response = await $api <API.Response <Model.Data.Status[] | Util.LaravelPagination <Model.Data.Status[]>>> ('/data-statuses', {
      method: 'GET',
      query: payload
   })
   return response.data
}

export async function createDataStatus (payload: API.Request.Form.DataStatus) : Promise <Model.Data.Status> {
   const response = await $api <API.Response <Model.Data.Status>> ('/data-status', {
      method: 'POST',
      body: payload
   })
   return response.data
}

export async function updateDataStatus (id: number, payload: API.Request.Form.DataStatus) : Promise <string> {
   const response = await $api <API.Response <boolean>> (`/data-status/${id}`, {
      method: 'PUT',
      body: payload
   })
   return response.message!
}

export async function deleteDataStatus (id: number) : Promise <string> {
   const response = await $api <API.Response <boolean>> (`data-status/${id}`, {
      method: 'DELETE',
   })
   return response.message!
}