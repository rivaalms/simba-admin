export async function useGetData (payload: API.Request.Query.Data) : Promise<Util.LaravelPagination<Model.Data[]>> {
   const response = await useAPI('/data', {
      method: 'GET',
      query: payload
   }) as API.Response <Util.LaravelPagination<Model.Data[]>>
   return response.data
}

export async function useCreateData (payload: API.Request.Form.Data) : Promise <Model.Data> {
   const form = new FormData()
   for (const i in payload) {
      form.append(i, payload[i] as string | Blob)
   }

   const response = await useAPI('/data', {
      method: 'POST',
      body: form
   }) as API.Response <Model.Data>
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