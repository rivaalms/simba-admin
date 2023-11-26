export async function getSubjects (payload: API.Request.Query.Subject) : Promise <Util.Subject[] | Util.LaravelPagination <Util.Subject[]>> {
   const response = await $api('/subjects', {
      method: 'GET',
      query: payload
   }) as API.Response <Util.Subject[] | Util.LaravelPagination <Util.Subject[]>>
   return response.data
}

export async function createSubject (payload: API.Request.Form.Subject) : Promise <Util.Subject> {
   const response = await $api ('/subject', {
      method: 'POST',
      body: payload
   }) as API.Response <Util.Subject>
   return response.data
}

export async function updateSubject (id: number, payload: API.Request.Form.Subject) : Promise <string> {
   const response = await $api (`/subject/${id}`, {
      method: 'PUT',
      body: payload
   }) as API.Response <boolean>
   return response.message!
}

export async function deleteSubject (id: number) : Promise <string> {
   const response = await $api ('/subject', {
      method: 'DELETE',
      body: {
         id
      }
   }) as API.Response <boolean>
   return response.message!
}