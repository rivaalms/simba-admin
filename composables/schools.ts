export async function useGetSchools (payload: API.Request.Query.School) : Promise <Util.LaravelPagination<Model.School[]>> {
   const response = await useAPI(`/schools`, {
      method: 'GET',
      query: payload
   }) as API.Response <Util.LaravelPagination <Model.School[]>>
   return response.data
}

export async function useGetSchoolOptions() : Promise <Util.SelectOption[]> {
   const response = await useAPI('/options/schools', {
      method: 'GET'
   }) as API.Response <Util.SelectOption[]>
   return response.data
}

export async function useCreateSchool (payload: API.Request.Form.School) : Promise <Model.User> {
   const response = await useAPI('/school', {
      method: 'POST',
      body: payload
   }) as API.Response <Model.User>
   return response.data
}

export async function useUpdateSchool (schoolId: number, payload: API.Request.Form.School) : Promise <string> {
   const response = await useAPI(`/school/${schoolId}`, {
      method: 'PUT',
      body: payload
   }) as API.Response <boolean>
   return response.message!
}

export async function useDeleteSchool (schoolId: number) : Promise <string> {
   const response = await useAPI('/school', {
      method: 'DELETE',
      body: {
         id: schoolId
      }
   }) as API.Response <boolean>
   return response.message!
}

export async function useGetSchoolTypeOptions () : Promise <Util.SelectOption[]> {
   const response = await useAPI('/options/school-types', {
      method: 'GET'
   }) as API.Response <Util.SelectOption[]>
   return response.data
}