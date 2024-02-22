export async function getData (payload: API.Request.Query.Data) : Promise <Util.LaravelPagination<Model.Data[]>> {
   const response = await $api <API.Response<Util.LaravelPagination<Model.Data[]>>> ('/data', {
      method: 'GET',
      query: payload
   })
   return response.data
}

export async function getSingleData (id: number) : Promise <Model.Data> {
   const response = await $api <API.Response <Model.Data>> (`/data/${id}`, {
      method: 'GET',
   })
   return response.data
}

export async function createData (payload: API.Request.Form.Data) : Promise <Model.Data> {
   const form = new FormData()
   for (const i in payload) {
      form.append(i, payload[i] as string | Blob)
   }

   const response = await $api <API.Response <Model.Data>> ('/data', {
      method: 'POST',
      body: form
   })
   return response.data
}

export async function updateData (dataId: number, payload: API.Request.Form.Data) : Promise <string> {
   const response = await $api <API.Response <boolean>> (`/data/${dataId}`, {
      method: 'PUT',
      body: payload
   })
   return response.message!
}

export async function updateFile (dataId: number, payload: Pick <API.Request.Form.Data, 'file'>) : Promise <string> {
   const form = new FormData()
   form.append('file', payload.file as Blob)

   const response = await $api <API.Response <boolean>> (`/data/file/${dataId}`, {
      method: 'POST',
      body: form
   })
   return response.message!
}

export async function deleteData (dataId: number) : Promise <string> {
   const response = await $api <API.Response <boolean>> (`/data/${dataId}`, {
      method: 'DELETE',
   })
   return response.message!
}

export async function downloadFile (data: Model.Data) : Promise <boolean> {
   try {
      const response = await $api <Blob> ('/data/download', {
         method: 'POST',
         body: {
            id: data.id
         }
      })

      const url = window.URL.createObjectURL(response)
      const a = document.createElement('a')
      const filename = `${data.school.user!.name}_${data.type.category!.name}_${data.type.name}_${data.year}`
      a.href = url
      a.setAttribute('download', filename)
      a.click()
      return true
   } catch (e: any) {
      throw e
   }
}