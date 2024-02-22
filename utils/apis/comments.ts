export async function getComments (dataId: number, payload: API.Request.Query.Comment) : Promise <Model.Comment[]> {
   const response = await $api <API.Response <Model.Comment[]>> (`/comments/${dataId}`, {
      method: 'GET',
      query: payload
   })
   return response.data
}

export async function createComment (payload: API.Request.Form.Comment) : Promise <Model.Comment> {
   const response = await $api<API.Response <Model.Comment>> (`/comment`, {
      method: 'POST',
      body: payload
   })
   return response.data
}

export async function updateComment (id: number, payload: API.Request.Form.Comment) : Promise <string> {
   const response = await $api <API.Response <boolean>> (`/comment/${id}`, {
      method: 'PUT',
      body: payload
   })
   return response.message!
}

export async function deleteComment (id: number) : Promise <string> {
   const response = await $api <API.Response <boolean>> (`/comment/${id}`, {
      method: 'DELETE'
   })
   return response.message!
}