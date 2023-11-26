<template>
<u-form
   :schema="validator"
   :state="state"
   :validate-on="['submit']"
   @submit="submit"
>
   <div class="grid gap-4">
      <u-form-group
         label="Nama"
         name="name"
         required
      >
         <u-input
            v-model="(state.name as string)"
            :disabled="loading"
         ></u-input>
      </u-form-group>

      <u-form-group
         label="Kategori"
         name="data_category_id"
         required
      >
         <u-select-menu
            v-model="(state.data_category_id as number)"
            :disabled="loading"
            :options="categoryOptions"
            value-attribute="value"
            searchable
            searchable-placeholder="Cari..."
            :search-attributes="['label']"
         >
            <template #label>
               <template v-if="!state.data_category_id || categoryOptions.length < 1">
                  <span class="text-gray-400">Pilih kategori...</span>
               </template>
               <template v-else>
                  {{ categoryOptions.find(item => item.value === state.data_category_id)?.label }}
               </template>
            </template>
         </u-select-menu>
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
         icon="i-heroicons-check"
         :loading="loading"
         type="submit"
      >
         Simpan
      </u-button>
   </div>
</u-form>
</template>

<script setup lang="ts">
import * as yup from 'yup'

const store = useAppStore()
const loading : Ref <boolean> = ref(false)
const state : Ref <API.Request.Form.DataType> = ref({
   name: store.dialog.data?.name || '',
   data_category_id: store.dialog.data?.data_category_id || 0
})
const validator = yup.object({
   name: yup.string().required('Nama harus diisi'),
   data_category_id: yup.number().typeError('Kategori harus diisi').required('Kategori harus diisi')
})

const categoryOptions = await getDataCategoryOptions()

const submit = async () => {
   loading.value = true
   const isCreate = store.dialog.id.includes('create')
   try {
      if (isCreate) await createDataType(state.value)
      else await updateDataType(store.dialog.data.id! as number, state.value)

      const message = isCreate ? 'Tipe data baru berhasil disimpan' : 'Tipe data berhasil diperbarui'
      store.notify('success', message, 'data-type-form')
      if (store.dialog.callback) store.dialog.callback()
      store.clearDialog()
   } catch (e: unknown) {
      const error = e as API.Error
      store.notify('error', `${error.response?._data?.message} || ${error}`, 'data-type-error')
   } finally {
      loading.value = false
   }
}
</script>