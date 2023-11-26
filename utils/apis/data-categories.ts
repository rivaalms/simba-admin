export async function getDataCategories (payload: API.Request.Query.DataCategory) : Promise <Model.Data.Category[]> {
   const response = await $api ('/data-categories', {
      method: 'GET',
      query: payload
   }) as API.Response <Model.Data.Category[]>
   return response.data
}

export async function createDataCategory (payload: API.Request.Form.DataCategory) : Promise <Model.Data.Category> {
   const response = await $api ('/data-category', {
      method: 'POST',
      body: payload
   }) as API.Response <Model.Data.Category>
   return response.data
}

export async function updateDataCategory (id: number, payload: API.Request.Form.DataCategory) : Promise <string> {
   const response = await $api (`/data-category/${id}`, {
      method: 'PUT',
      body: payload
   }) as API.Response <boolean>
   return response.message!
}

export async function deleteDataCategory (id: number) : Promise <string> {
   const response = await $api ('/data-category', {
      method: 'DELETE',
      body: {
         id
      }
   }) as API.Response <boolean>
   return response.message!
}