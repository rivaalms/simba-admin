export async function getSchoolTypes (payload: API.Request.Query.SchoolType) : Promise <Model.School.Type[]> {
   const response = await $api ('/school-types', {
      method: 'GET',
      query: payload
   }) as API.Response <Model.School.Type[]>
   return response.data
}

export async function createSchoolType (payload: API.Request.Form.SchoolType) : Promise <Model.School.Type> {
   const response = await $api ('/school-type', {
      method: 'POST',
      body: payload
   }) as API.Response <Model.School.Type>
   return response.data
}

export async function updateSchoolType (id: number, payload: API.Request.Form.SchoolType) : Promise <string> {
   const response = await $api (`/school-type/${id}`, {
      method: 'PUT',
      body: payload
   }) as API.Response <boolean>
   return response.message!
}

export async function deleteSchoolType (id: number) : Promise <string> {
   const response = await $api ('/school-type', {
      method: 'DELETE',
      body: {
         id
      }
   }) as API.Response <boolean>
   return response.message!
}