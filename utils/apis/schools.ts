export async function getSchools (payload: API.Request.Query.School) : Promise <Util.LaravelPagination<Model.School[]>> {
   const response = await $api <API.Response <Util.LaravelPagination <Model.School[]>>> (`/schools`, {
      method: 'GET',
      query: payload
   })
   return response.data
}

export async function getSchoolDetails (schoolId: number) : Promise <Model.School> {
   const response = await $api <API.Response<Model.School>> (`/school/${schoolId}`, {
      method: 'GET',
   })
   return response.data
}

export async function createSchool (payload: API.Request.Form.School) : Promise <Model.User> {
   const response = await $api <API.Response <Model.User>> ('/school', {
      method: 'POST',
      body: payload
   })
   return response.data
}

export async function updateSchool (schoolId: number, payload: API.Request.Form.School) : Promise <string> {
   const response = await $api <API.Response <boolean>> (`/school/${schoolId}`, {
      method: 'PUT',
      body: payload
   })
   return response.message!
}

export async function deleteSchool (schoolId: number) : Promise <string> {
   const response = await $api <API.Response <boolean>> (`/school/${schoolId}`, {
      method: 'DELETE',
   })
   return response.message!
}

export async function getSchoolStudents (payload: API.Request.Query.SchoolStudent) : Promise <Model.School.Student[]> {
   const response = await $api <API.Response <Model.School.Student[]>> (`/school-students`, {
      method: 'GET',
      query: payload
   })
   return response.data
}

export async function updateSchoolStudents (payload: API.Request.Form.SchoolStudent) : Promise <string> {
   const response = await $api <API.Response <boolean>> ('/school-students', {
      method: 'POST',
      body: payload
   })
   return response.message!
}

export async function getSchoolTeachers (payload: API.Request.Query.SchoolTeacher) : Promise <Model.School.Teacher[]> {
   const response = await $api <API.Response <Model.School.Teacher[]>> (`/school-teachers`, {
      method: 'GET',
      query: payload
   })
   return response.data
}

export async function updateSchoolTeachers (payload: API.Request.Form.SchoolTeachers) : Promise <string> {
   const response = await $api <API.Response <boolean>> ('/school-teachers', {
      method: 'POST',
      body: payload
   })
   return response.message!
}