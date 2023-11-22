export async function getDataCategories (search?: string | null) : Promise <Model.Data.Category[]> {
   const response = await $api ('/data-categories', {
      method: 'GET',
      query: {
         search
      }
   }) as API.Response <Model.Data.Category[]>
   return response.data
}

export async function createDataCategory (payload: Pick <Model.Data.Category, 'name'>) : Promise <Model.Data.Category> {
   const response = await $api ('/data-category', {
      method: 'POST',
      body: payload
   }) as API.Response <Model.Data.Category>
   return response.data
}

export async function updateDataCategory (id: number, payload: Pick <Model.Data.Category, 'name'>) : Promise <string> {
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