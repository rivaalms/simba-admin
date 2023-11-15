export async function useGetSubjects () : Promise <Util.Subject[]> {
   const response = await $api('/subjects', {
      method: 'GET'
   }) as API.Response <Util.Subject[]>
   return response.data
}