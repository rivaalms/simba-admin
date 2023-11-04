export async function useGetSchoolOptions() : Promise <Util.SelectOption[]> {
   const response = await useAPI('/options/schools', {
      method: 'GET'
   }) as API.Response <Util.SelectOption[]>
   return response.data
}