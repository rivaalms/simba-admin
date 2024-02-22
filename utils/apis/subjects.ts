export async function getSubjects (payload?: API.Request.Query.Subject) : Promise <Util.Subject[] | Util.LaravelPagination <Util.Subject[]>> {
   const response = await $api <API.Response <Util.Subject[] | Util.LaravelPagination <Util.Subject[]>>> ('/subjects', {
      method: 'GET',
      query: payload
   })
   return response.data
}

export async function createSubject (payload: API.Request.Form.Subject) : Promise <Util.Subject> {
   const response = await $api <API.Response <Util.Subject>> ('/subject', {
      method: 'POST',
      body: payload
   })
   return response.data
}

export async function updateSubject (id: number, payload: API.Request.Form.Subject) : Promise <string> {
   const response = await $api <API.Response <boolean>> (`/subject/${id}`, {
      method: 'PUT',
      body: payload
   })
   return response.message!
}

export async function deleteSubject (id: number) : Promise <string> {
   const response = await $api <API.Response <boolean>> (`/subject/${id}`, {
      method: 'DELETE',
   })
   return response.message!
}