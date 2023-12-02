<template>
<u-form
   :schema="validator"
   :state="state"
   :validate-on="['submit']"
   @submit="submit"
>
   <div class="grid gap-4">
      <u-form-group
         label="Upload file"
         name="file"
      >
         <input
            ref="fileInput"
            type="file"
            class="hidden"
            accept=".pdf, .doc, .docx, .xls, .xlsx, application/msword, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.google-apps.document, application/vnd.google-apps.spreadsheet"
            @change="onFileChange"
         >

         <u-button-group class="w-full">
            <u-button
               color="white"
               icon="i-heroicons-document-plus"
               :disabled="loading"
               @click.stop="fileInput.click()"
            ></u-button>

            <u-input
               :model-value="(fileInputName as string)"
               readonly
               class="flex-1"
               input-class="cursor-pointer focus:ring-inset"
               placeholder="Pilih file..."
               :disabled="loading"
               @click.stop="fileInput.click()"
            ></u-input>
         </u-button-group>
      </u-form-group>
   </div>
   <div class="mt-6 flex items-center justify-end gap-2">
      <u-button
         color="gray"
         variant="ghost"
         icon="i-heroicons-arrow-uturn-left"
         :disabled="loading"
         @click.stop="store.clearDialog()"
      >
         Batal
      </u-button>
      <u-button
         color="emerald"
         icon="i-heroicons-document-arrow-up"
         :loading="loading"
         type="submit"
      >
         Upload
      </u-button>
   </div>
</u-form>
</template>

<script setup lang="ts">
import * as yup from 'yup'

const store = useAppStore()
const loading : Ref <boolean> = ref(false)
const state : Ref <Pick <API.Request.Form.Data, 'file'>> = ref({
   file: null
})

const validator = yup.object({
   file: yup.mixed().required('File harus diisi')
})

const fileInput : Ref <any> = ref(null)
const fileInputName : ComputedRef <string | null> = computed(() => {
   return state.value.file?.name || null
})

const onFileChange = (e: any) => {
   state.value.file = e.target.files[0]
}

const submit = async () => {
   loading.value = true
   await updateFile((store.dialog.data.id as number), state.value)
      .then(resp => {
         store.notify('success', 'File berhasil diperbarui', 'file-upload')
         if (store.dialog.callback) store.dialog.callback()
         store.clearDialog()
      })
      .catch((error: API.Error) => store.notify('error', `${error.response?._data?.message || error}`, 'file-upload-error'))
      .finally(() => loading.value = false)
}
</script>