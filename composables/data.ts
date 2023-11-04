export async function useGetData (payload: API.Request.Data) : Promise<Util.LaravelPagination<Model.Data[]>> {
   const response = await useAPI('/data', {
      method: 'GET',
      query: payload
   }) as API.Response <Util.LaravelPagination<Model.Data[]>>
   return response.data
}

export async function useCreateData (payload: any) : Promise <any> {
   const form = new FormData()
   for (const i in payload) {
      form.append(i, payload[i])
   }
   console.log('form', form)
   const response = await useAPI('/data', {
      method: 'POST',
      body: form
   }) as API.Response <any>
   return response.data
}

export async function useDataCategoryOptions () : Promise <Util.SelectOption[]> {
   const response = await useAPI('/options/data-categories', {
      method: 'GET'
   }) as API.Response <Util.SelectOption[]>
   return response.data
}

export async function useDataTypeOptions (categoryId: number) : Promise <Util.SelectOption[]> {
   const response = await useAPI('/options/data-types', {
      method: 'GET',
      query: {
         category: categoryId
      }
   }) as API.Response <Util.SelectOption[]>
   return response.data
}

export async function useDataStatusOptions () : Promise <Util.SelectOption[]> {
   const response = await useAPI('/options/data-status', {
      method: 'GET',
   }) as API.Response <Util.SelectOption[]>
   return response.data
}