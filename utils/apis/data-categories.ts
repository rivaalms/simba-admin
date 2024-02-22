export async function getDataCategories (payload: API.Request.Query.DataCategory) : Promise <Model.Data.Category[] | Util.LaravelPagination <Model.Data.Category[]>> {
   const response = await $api <API.Response <Model.Data.Category[] | Util.LaravelPagination <Model.Data.Category[]>>> ('/data-categories', {
      method: 'GET',
      query: payload
   })
   return response.data
}

export async function createDataCategory (payload: API.Request.Form.DataCategory) : Promise <Model.Data.Category> {
   const response = await $api <API.Response <Model.Data.Category>> ('/data-category', {
      method: 'POST',
      body: payload
   })
   return response.data
}

export async function updateDataCategory (id: number, payload: API.Request.Form.DataCategory) : Promise <string> {
   const response = await $api <API.Response <boolean>> (`/data-category/${id}`, {
      method: 'PUT',
      body: payload
   })
   return response.message!
}

export async function deleteDataCategory (id: number) : Promise <string> {
   const response = await $api <API.Response <boolean>> (`/data-category/${id}`, {
      method: 'DELETE',
   })
   return response.message!
}