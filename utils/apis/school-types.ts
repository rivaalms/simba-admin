export async function getSchoolTypes (payload: API.Request.Query.SchoolType) : Promise <Model.School.Type[] | Util.LaravelPagination <Model.School.Type[]>> {
   const response = await $api <API.Response <Model.School.Type[] | Util.LaravelPagination <Model.School.Type[]>>> ('/school-types', {
      method: 'GET',
      query: payload
   })
   return response.data
}

export async function createSchoolType (payload: API.Request.Form.SchoolType) : Promise <Model.School.Type> {
   const response = await $api <API.Response <Model.School.Type>> ('/school-type', {
      method: 'POST',
      body: payload
   })
   return response.data
}

export async function updateSchoolType (id: number, payload: API.Request.Form.SchoolType) : Promise <string> {
   const response = await $api <API.Response <boolean>> (`/school-type/${id}`, {
      method: 'PUT',
      body: payload
   })
   return response.message!
}

export async function deleteSchoolType (id: number) : Promise <string> {
   const response = await $api <API.Response <boolean>> (`/school-type/${id}`, {
      method: 'DELETE',
   })
   return response.message!
}