export async function useGetSchools (payload: API.Request.Query.School) : Promise <Util.LaravelPagination<Model.School[]>> {
   const response = await $api(`/schools`, {
      method: 'GET',
      query: payload
   }) as API.Response <Util.LaravelPagination <Model.School[]>>
   return response.data
}

export async function useGetSchoolDetails (schoolId: number) : Promise <Model.School> {
   const response = await $api(`/school/${schoolId}`, {
      method: 'GET',
   }) as API.Response<Model.School>
   return response.data
}

export async function useCreateSchool (payload: API.Request.Form.School) : Promise <Model.User> {
   const response = await $api('/school', {
      method: 'POST',
      body: payload
   }) as API.Response <Model.User>
   return response.data
}

export async function useUpdateSchool (schoolId: number, payload: API.Request.Form.School) : Promise <string> {
   const response = await $api(`/school/${schoolId}`, {
      method: 'PUT',
      body: payload
   }) as API.Response <boolean>
   return response.message!
}

export async function useDeleteSchool (schoolId: number) : Promise <string> {
   const response = await $api('/school', {
      method: 'DELETE',
      body: {
         id: schoolId
      }
   }) as API.Response <boolean>
   return response.message!
}

export async function useGetSchoolOptions() : Promise <Util.SelectOption[]> {
   const response = await $api('/options/schools', {
      method: 'GET'
   }) as API.Response <Util.SelectOption[]>
   return response.data
}

export async function useGetSchoolTypeOptions () : Promise <Util.SelectOption[]> {
   const response = await $api('/options/school-types', {
      method: 'GET'
   }) as API.Response <Util.SelectOption[]>
   return response.data
}

export async function useGetSchoolStudents (payload: API.Request.Query.SchoolStudent) : Promise <Model.School.Student[]> {
   const response = await $api(`/school-students`, {
      method: 'GET',
      query: payload
   }) as API.Response <Model.School.Student[]>
   return response.data
}

export async function useGetSchoolTeachers (payload: API.Request.Query.SchoolTeacher) : Promise <Model.School.Teacher[]> {
   const response = await $api(`/school-teachers`, {
      method: 'GET',
      query: payload
   }) as API.Response <Model.School.Teacher[]>
   return response.data
}