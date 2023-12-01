export async function getSupervisors (payload: API.Request.Query.Supervisor) : Promise <Util.LaravelPagination <Model.Supervisor[]>> {
   const response = await $api('/supervisors', {
      method: 'GET',
      query: payload
   }) as API.Response <Util.LaravelPagination <Model.Supervisor[]>>
   return response.data
}

export async function getSupervisorDetails (supervisorId: number) : Promise <Model.Supervisor> {
   const response = await $api(`/supervisor/${supervisorId}`, {
      method: 'GET'
   }) as API.Response <Model.Supervisor>
   return response.data
}

export async function createSupervisor (payload: API.Request.Form.Supervisor) : Promise <Model.Supervisor> {
   const response = await $api('/supervisor', {
      method: 'POST',
      body: payload
   }) as API.Response<Model.Supervisor>
   return response.data
}

export async function updateSupervisor (supervisorId: number, payload: API.Request.Form.Supervisor) : Promise <string> {
   const response = await $api(`/supervisor/${supervisorId}`, {
      method: 'PUT',
      body: payload
   }) as API.Response <boolean>
   return response.message!
}

export async function deleteSupervisor (supervisorId: number) : Promise <string> {
   const response = await $api(`/supervisor/${supervisorId}`, {
      method: 'DELETE',
   }) as API.Response <boolean>
   return response.message!
}