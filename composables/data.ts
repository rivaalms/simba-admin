export async function useGetData (payload: API.Request.Query.Data) : Promise<Util.LaravelPagination<Model.Data[]>> {
   const response = await $api('/data', {
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

   const response = await $api('/data', {
      method: 'POST',
      body: form
   }) as API.Response <Model.Data>
   return response.data
}

export async function useUpdateData (dataId: number, payload: API.Request.Form.Data) : Promise <string> {
   const response = await $api(`/data/${dataId}`, {
      method: 'PUT',
      body: payload
   }) as API.Response <boolean>
   return response.message!
}

export async function useUpdateDataFile (dataId: number, payload: Pick <API.Request.Form.Data, 'file'>) : Promise <string> {
   const form = new FormData()
   form.append('file', payload.file as Blob)

   const response = await $api(`/data/file/${dataId}`, {
      method: 'POST',
      body: form
   }) as API.Response <boolean>
   return response.message!
}

export async function useDeleteData (dataId: number) : Promise <string> {
   const response = await $api(`/data`, {
      method: 'DELETE',
      body: {
         id: dataId
      }
   }) as API.Response <boolean>
   return response.message!
}

export async function useDownloadFile(data: Model.Data) : Promise <boolean> {
   const response = await $api('/data/download', {
      method: 'POST',
      body: {
         id: data.id
      }
   }) as Blob

   const url = window.URL.createObjectURL(response)
   const a = document.createElement('a')
   const fileName = `${data.school.user!.name}_${data.type.category!.name}_${data.type.name}_${data.year}`
   a.href = url
   a.setAttribute('download', fileName)
   a.click()
   return true
}

export async function useDataCategoryOptions () : Promise <Util.SelectOption[]> {
   const response = await $api('/options/data-categories', {
      method: 'GET'
   }) as API.Response <Util.SelectOption[]>
   return response.data
}

export async function useDataTypeOptions (categoryId: number) : Promise <Util.SelectOption[]> {
   const response = await $api('/options/data-types', {
      method: 'GET',
      query: {
         category: categoryId
      }
   }) as API.Response <Util.SelectOption[]>
   return response.data
}

export async function useDataStatusOptions () : Promise <Util.SelectOption[]> {
   const response = await $api('/options/data-status', {
      method: 'GET',
   }) as API.Response <Util.SelectOption[]>
   return response.data
}