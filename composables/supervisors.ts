export async function useGetSupervisorOptions () : Promise <Util.SelectOption[]> {
   const response = await useAPI('/options/supervisors', {
      method: 'GET'
   }) as API.Response <Util.SelectOption[]>
   return response.data
}