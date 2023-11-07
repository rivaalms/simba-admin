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

export async function useGetSchoolTypeOptions () : Promise <Util.SelectOption[]> {
   const response = await useAPI('/options/school-types', {
      method: 'GET'
   }) as API.Response <Util.SelectOption[]>
   return response.data
}