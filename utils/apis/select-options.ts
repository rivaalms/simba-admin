export async function getDataCategoryOptions () : Promise <Util.SelectOption[]> {
   const response = await $api <API.Response <Util.SelectOption[]>>  ('/options/data-categories', {
      method: 'GET'
   })
   return response.data
}

export async function getDataTypeOptions (categoryId: number) : Promise <Util.SelectOption[]> {
   const response = await $api <API.Response <Util.SelectOption[]>> ('/options/data-types', {
      method: 'GET',
      query: {
         category: categoryId
      }
   })
   return response.data
}

export async function getDataStatusOptions () : Promise <Util.SelectOption[]> {
   const response = await $api <API.Response <Util.SelectOption[]>>  ('/options/data-status', {
      method: 'GET'
   })
   return response.data
}

export async function getSchoolOptions () : Promise <Util.SelectOption[]> {
   const response = await $api <API.Response <Util.SelectOption[]>> ('/options/schools', {
      method: 'GET'
   })
   return response.data
}

export async function getSchoolTypeOptions () : Promise <Util.SelectOption[]> {
   const response = await $api <API.Response <Util.SelectOption[]>> ('/options/school-types', {
      method: 'GET'
   })
   return response.data
}

export async function getSupervisorOptions () : Promise <Util.SelectOption[]> {
   const response = await $api <API.Response <Util.SelectOption[]>> ('/options/supervisors', {
      method: 'GET'
   })
   return response.data
}

export async function getReligionOptions () : Promise <Util.SelectOption[]> {
   const response = await $api <API.Response <Util.SelectOption[]>> ('/options/religions', {
      method: 'GET'
   })
   return response.data
}

export async function getSubjectOptions () : Promise <Util.SelectOption[]> {
   const response = await $api <API.Response <Util.SelectOption[]>> ('/options/subjects', {
      method: 'GET'
   })
   return response.data
}