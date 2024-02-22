export async function getSupervisors (payload: API.Request.Query.Supervisor) : Promise <Util.LaravelPagination <Model.Supervisor[]>> {
   const response = await $api <API.Response <Util.LaravelPagination <Model.Supervisor[]>>> ('/supervisors', {
      method: 'GET',
      query: payload
   })
   return response.data
}

export async function getSupervisorDetails (supervisorId: number) : Promise <Model.Supervisor> {
   const response = await $api <API.Response <Model.Supervisor>> (`/supervisor/${supervisorId}`, {
      method: 'GET'
   })
   return response.data
}

export async function createSupervisor (payload: API.Request.Form.Supervisor) : Promise <Model.Supervisor> {
   const response = await $api <API.Response<Model.Supervisor>> ('/supervisor', {
      method: 'POST',
      body: payload
   })
   return response.data
}

export async function updateSupervisor (supervisorId: number, payload: API.Request.Form.Supervisor) : Promise <string> {
   const response = await $api <API.Response <boolean>> (`/supervisor/${supervisorId}`, {
      method: 'PUT',
      body: payload
   })
   return response.message!
}

export async function deleteSupervisor (supervisorId: number) : Promise <string> {
   const response = await $api <API.Response <boolean>> (`/supervisor/${supervisorId}`, {
      method: 'DELETE',
   })
   return response.message!
}