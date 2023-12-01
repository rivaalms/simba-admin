export async function getSchools (payload: API.Request.Query.School) : Promise <Util.LaravelPagination<Model.School[]>> {
   const response = await $api(`/schools`, {
      method: 'GET',
      query: payload
   }) as API.Response <Util.LaravelPagination <Model.School[]>>
   return response.data
}

export async function getSchoolDetails (schoolId: number) : Promise <Model.School> {
   const response = await $api(`/school/${schoolId}`, {
      method: 'GET',
   }) as API.Response<Model.School>
   return response.data
}

export async function createSchool (payload: API.Request.Form.School) : Promise <Model.User> {
   const response = await $api('/school', {
      method: 'POST',
      body: payload
   }) as API.Response <Model.User>
   return response.data
}

export async function updateSchool (schoolId: number, payload: API.Request.Form.School) : Promise <string> {
   const response = await $api(`/school/${schoolId}`, {
      method: 'PUT',
      body: payload
   }) as API.Response <boolean>
   return response.message!
}

export async function deleteSchool (schoolId: number) : Promise <string> {
   const response = await $api(`/school/${schoolId}`, {
      method: 'DELETE',
   }) as API.Response <boolean>
   return response.message!
}

export async function getSchoolStudents (payload: API.Request.Query.SchoolStudent) : Promise <Model.School.Student[]> {
   const response = await $api(`/school-students`, {
      method: 'GET',
      query: payload
   }) as API.Response <Model.School.Student[]>
   return response.data
}

export async function getSchoolTeachers (payload: API.Request.Query.SchoolTeacher) : Promise <Model.School.Teacher[]> {
   const response = await $api(`/school-teachers`, {
      method: 'GET',
      query: payload
   }) as API.Response <Model.School.Teacher[]>
   return response.data
}