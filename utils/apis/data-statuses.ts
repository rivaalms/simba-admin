export async function getDataStatus (search?: string | null) : Promise <Model.Data.Status[]> {
   const response = await $api ('/data-statuses', {
      method: 'GET',
      query: {
         search
      }
   }) as API.Response <Model.Data.Status[]>
   return response.data
}

export async function createDataStatus (payload: API.Request.Form.DataStatus) : Promise <Model.Data.Status> {
   const response = await $api ('/data-status', {
      method: 'POST',
      body: payload
   }) as API.Response <Model.Data.Status>
   return response.data
}

export async function updateDataStatus (id: number, payload: API.Request.Form.DataStatus) : Promise <string> {
   const response = await $api (`/data-status/${id}`, {
      method: 'PUT',
      body: payload
   }) as API.Response <boolean>
   return response.message!
}

export async function deleteDataStatus (id: number) : Promise <string> {
   const response = await $api ('data-status', {
      method: 'DELETE',
      body: {
         id
      }
   }) as API.Response <boolean>
   return response.message!
}