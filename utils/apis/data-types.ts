export async function getDataTypes (payload: API.Request.Query.DataType) : Promise <Model.Data.Type[] | Util.LaravelPagination<Model.Data.Type[]>> {
   const response = await $api <API.Response <Model.Data.Type[] | Util.LaravelPagination<Model.Data.Type[]>>> ('/data-types', {
      method: 'GET',
      query: payload
   })
   return response.data
}

export async function createDataType (payload: API.Request.Form.DataType) : Promise <Model.Data.Type> {
   const response = await $api <API.Response <Model.Data.Type>> ('/data-type', {
      method: 'POST',
      body: payload
   })
   return response.data
}

export async function updateDataType (id: number, payload: API.Request.Form.DataType) : Promise <string> {
   const response = await $api <API.Response <boolean>> (`/data-type/${id}`, {
      method: 'PUT',
      body: payload
   })
   return response.message!
}

export async function deleteDataType (id: number) : Promise <string> {
   const response = await $api <API.Response <boolean>> (`/data-type/${id}`, {
      method: 'DELETE',
   })
   return response.message!
}