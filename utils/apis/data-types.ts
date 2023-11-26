export async function getDataTypes (payload: API.Request.Query.DataType) : Promise <Util.LaravelPagination<Model.Data.Type[]>> {
   const response = await $api ('/data-types', {
      method: 'GET',
      query: payload
   }) as API.Response <Util.LaravelPagination<Model.Data.Type[]>>
   return response.data
}

export async function createDataType (payload: API.Request.Form.DataType) : Promise <Model.Data.Type> {
   const response = await $api ('/data-type', {
      method: 'POST',
      body: payload
   }) as API.Response <Model.Data.Type>
   return response.data
}

export async function updateDataType (id: number, payload: API.Request.Form.DataType) : Promise <string> {
   const response = await $api (`/data-type/${id}`, {
      method: 'PUT',
      body: payload
   }) as API.Response <boolean>
   return response.message!
}

export async function deleteDataType (id: number) : Promise <string> {
   const response = await $api ('/data-type', {
      method: 'DELETE',
      body: {
         id
      }
   }) as API.Response <boolean>
   return response.message!
}