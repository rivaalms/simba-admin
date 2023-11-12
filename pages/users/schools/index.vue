<template>
<u-card>
   <app-data-table
      :columns="columns"
      :rows="rows"
      :total="dataLength"
      :loading="loading"
      @fetch="onTableEmit"
   >
      <template #filters>
         <div class="grid grid-cols-12 gap-4">
            <!-- SECTION: Name -->
            <u-form-group
               class="col-span-3"
               label="Cari"
            >
               <template #hint>
                  <span v-if="showSearchHint" class="text-xs">
                     <u-kbd size="xs">Enter</u-kbd> untuk mencari
                  </span>
               </template>
               <u-input
                  v-model="(filters.search as string)"
                  icon="i-heroicons-magnifying-glass"
                  placeholder="Cari nama/email/kepala sekolah..."
                  @keyup.enter="fetchSchools(filters)"
                  @focus="showSearchHint = true"
                  @blur="showSearchHint = false"
               ></u-input>
            </u-form-group>
            <!-- !SECTION -->

            <!-- SECTION: Type -->
            <u-form-group
               class="col-span-2"
               label="Tipe"
            >
               <u-select-menu
                  v-model="(filters.type as number)"
                  :options="typeOptions"
                  value-attribute="value"
                  searchable
                  searchable-placeholder="Cari..."
                  :search-attributes="['label']"
                  @update:model-value="fetchSchools(filters)"
               >
                  <template #label>
                     {{ typeOptions.find(item => item.value === filters.type)?.label || 'Pilih tipe...' }}
                  </template>

                  <template #option="{ option: type }">
                     <span
                        class="truncate"
                        :class="{ 'text-gray-400': type.value === null }"
                     >
                        {{ type.label }}
                     </span>
                  </template>
               </u-select-menu>
            </u-form-group>
            <!-- !SECTION -->

            <!-- SECTION: Supervisor -->
            <u-form-group
               class="col-span-2"
               label="Pengawas"
            >
               <u-select-menu
                  v-model="(filters.supervisor as number)"
                  :options="supervisorOptions"
                  value-attribute="value"
                  searchable
                  searchable-placeholder="Cari..."
                  :search-attributes="['label']"
                  @update:model-value="fetchSchools(filters)"
               >
                  <template #label>
                     {{ supervisorOptions.find(item => item.value === filters.supervisor)?.label || 'Pilih pengawas...' }}
                  </template>

                  <template #option="{ option: supervisor }">
                     <span
                        class="truncate"
                        :class="{ 'text-gray-400': supervisor.value === null }"
                     >
                        {{ supervisor.label }}
                     </span>
                  </template>
               </u-select-menu>
            </u-form-group>
            <!-- !SECTION -->

            <!-- SECTION: Add Button -->
            <div class="col-span-2 col-end-13 flex items-end justify-end">
               <u-button
                  icon="i-heroicons-plus"
                  @click.stop="store.showDialog('school-create', 'Tambah Sekolah', null, () => fetchSchools(filters))"
               >
                  Tambah Sekolah
               </u-button>
            </div>
            <!-- !SECTION -->
         </div>
      </template>

      <template #actions="{ row }">
         <u-dropdown
            :items="actionMenu(row)"
         >
            <u-button
               color="gray"
               variant="ghost"
               icon="i-heroicons-ellipsis-vertical"
            ></u-button>

            <template #delete="{ item }">
               <u-icon :name="item.icon" class="flex-shrink-0 h-4 w-4 text-red-400 dark:text-red-500"></u-icon>
               <span class="truncate text-red-400 dark:text-red-500">{{ item.label }}</span>
            </template>
         </u-dropdown>
      </template>
   </app-data-table>
</u-card>
</template>

<script setup lang="ts">
const store = useAppStore()

const columns : ComputedRef <Util.TableColumns[]> = computed(() => [
   { key: 'user.name', label: 'Nama Sekolah' },
   { key: 'user.email', label: 'Email' },
   { key: 'type.name', label: 'Tipe' },
   { key: 'principal', label: 'Kepala Sekolah' },
   { key: 'supervisor.user.name', label: 'Pengawas' },
   { key: 'updated_at', label: 'Diperbarui' },
   { key: 'actions', label: '' }
])

const rows : Ref <Model.School[]> = ref([])
const dataLength : Ref <number> = ref(0)
const loading : Ref <boolean> = ref(false)
const filters = shallowRef <API.Request.Query.School> ({
   search: null,
   supervisor: null,
   type: null,
   per_page: 10,
})

const supervisorOptions : Ref <Util.SelectOption[]> = ref([])
const typeOptions : Ref <Util.SelectOption[]> = ref([])
const showSearchHint : Ref <boolean> = ref(false)

const actionMenu = (row: Model.Data) => ([
   [
      {
         label: 'Lihat detail',
         icon: 'i-heroicons-document-magnifying-glass',
         click: () => { console.log(row) }
      },
      {
         label: 'Sunting sekolah',
         icon: 'i-heroicons-pencil-square',
         click: () => store.showDialog('school-edit', 'Sunting Sekolah', row, () => fetchSchools(filters.value))
      },
   ],
   [
      {
         label: 'Hapus sekolah',
         icon: 'i-heroicons-trash',
         slot: 'delete',
         click: () => store.showDialog('school-delete', 'Hapus Sekolah', row, () => fetchSchools(filters.value))
      }
   ]
])

onBeforeMount(async () => {
   await fetchSchools({
      page: 1,
      per_page: 10
   })

   await useGetSupervisorOptions()
      .then(resp => {
         supervisorOptions.value = resp
         supervisorOptions.value.unshift({
            label: 'Pilih pengawas...',
            value: null
         })
      })

   await useGetSchoolTypeOptions()
      .then(resp => {
         typeOptions.value = resp
         typeOptions.value.unshift({
            label: 'Pilih tipe...',
            value: null
         })
      })
})

const fetchSchools = async (payload: API.Request.Query.School) => {
   loading.value = true
   await useGetSchools(payload)
      .then(resp => {
         rows.value = resp.data
         dataLength.value = resp.total
      })
      .catch((error: API.Error) => store.notify('error', error.response._data.message || 'Error fetching schools'))
      .finally(() => loading.value = false)
}

const onTableEmit = async (emitData: { [key: string]: number | string }) => {
   for (const [key, value] of Object.entries(emitData)) {
      filters.value[key] = value
   }

   await fetchSchools(filters.value)
}
</script>