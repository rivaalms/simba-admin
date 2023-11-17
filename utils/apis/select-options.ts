export async function getDataCategoryOptions () : Promise <Util.SelectOption[]> {
   const response = await $api ('/options/data-categories', {
      method: 'GET'
   }) as API.Response <Util.SelectOption[]>
   return response.data
}

export async function getDataTypeOptions (categoryId: number) : Promise <Util.SelectOption[]> {
   const response = await $api ('/options/data-types', {
      method: 'GET',
      query: {
         category: categoryId
      }
   }) as API.Response <Util.SelectOption[]>
   return response.data
}

export async function getDataStatusOptions () : Promise <Util.SelectOption[]> {
   const response = await $api ('/options/data-status', {
      method: 'GET'
   }) as API.Response <Util.SelectOption[]>
   return response.data
}

export async function getSchoolOptions () : Promise <Util.SelectOption[]> {
   const response = await $api('/options/schools', {
      method: 'GET'
   }) as API.Response <Util.SelectOption[]>
   return response.data
}

export async function getSchoolTypeOptions () : Promise <Util.SelectOption[]> {
   const response = await $api('/options/school-types', {
      method: 'GET'
   }) as API.Response <Util.SelectOption[]>
   return response.data
}

export async function getSupervisorOptions () : Promise <Util.SelectOption[]> {
   const response = await $api('/options/supervisors', {
      method: 'GET'
   }) as API.Response <Util.SelectOption[]>
   return response.data
}