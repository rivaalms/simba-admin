export async function useGetReligions () : Promise <Util.Religion[]> {
   const response = await $api('/religions', {
      method: 'GET'
   }) as API.Response <Util.Religion[]>
   return response.data
}