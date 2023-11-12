export async function useGetSupervisors (payload: API.Request.Query.Supervisor) : Promise <Util.LaravelPagination <Model.Supervisor[]>> {
   const response = await $api('/supervisors', {
      method: 'GET',
      query: payload
   }) as API.Response <Util.LaravelPagination <Model.Supervisor[]>>
   return response.data
}

export async function useCreateSupervisor (payload: API.Request.Form.Supervisor) : Promise <Model.Supervisor> {
   const response = await $api('/supervisor', {
      method: 'POST',
      body: payload
   }) as API.Response<Model.Supervisor>
   return response.data
}

export async function useUpdateSupervisor (supervisorId: number, payload: API.Request.Form.Supervisor) : Promise <string> {
   const response = await $api(`/supervisor/${supervisorId}`, {
      method: 'PUT',
      body: payload
   }) as API.Response <boolean>
   return response.message!
}

export async function useDeleteSupervisor (supervisorId: number) : Promise <string> {
   const response = await $api('/supervisor', {
      method: 'DELETE',
      body: {
         id: supervisorId
      }
   }) as API.Response <boolean>
   return response.message!
}

export async function useGetSupervisorOptions () : Promise <Util.SelectOption[]> {
   const response = await $api('/options/supervisors', {
      method: 'GET'
   }) as API.Response <Util.SelectOption[]>
   return response.data
}