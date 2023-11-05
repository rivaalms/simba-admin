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
         <!-- SECTION: Filters -->
         <div class="grid grid-cols-12 gap-4">
            <!-- SECTION: School -->
            <u-form-group
               class="col-span-2"
               label="Sekolah"
            >
               <u-select-menu
                  v-model="(filters.school as number)"
                  :options="schoolOptions"
                  value-attribute="value"
                  searchable
                  searchable-placeholder="Cari..."
                  :search-attributes="['label']"
                  @update:model-value="fetchData(filters)"
               >
                  <template #label>
                     {{ schoolOptions.find(item => item.value === filters.school)?.label || 'Pilih sekolah...' }}
                  </template>

                  <template #option="{ option: school }">
                     <span v-if="school.value === null" class="text-gray-500 font-light truncate">
                        {{ school.label }}
                     </span>
                     <span v-else class="truncate">
                        {{ school.label }}
                     </span>
                  </template>
               </u-select-menu>
            </u-form-group>
            <!-- !SECTION -->

            <!-- SECTION: Category -->
            <u-form-group
               class="col-span-2"
               label="Kategori"
            >
               <u-select-menu
                  v-model="(filters.category as number)"
                  :options="categoryOptions"
                  value-attribute="value"
                  searchable
                  searchable-placeholder="Cari..."
                  :search-attributes="['label']"
                  @update:model-value="(val) => {
                     onCategoryChanges(val)
                     fetchData(filters)
                  }"
               >
                  <template #label>
                     {{ categoryOptions.find(item => item.value === filters.category)?.label || 'Pilih kategori...' }}
                  </template>

                  <template #option="{ option: category }">
                     <span v-if="category.value === null" class="text-gray-500 font-light truncate">
                        {{ category.label }}
                     </span>
                     <span v-else class="truncate">
                        {{ category.label }}
                     </span>
                  </template>
               </u-select-menu>
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
                  :disabled="typeOptions.length < 1"
                  searchable-placeholder="Cari..."
                  :search-attributes="['label']"
                  @update:model-value="fetchData(filters)"
               >
                  <template #label>
                     <template v-if="filters.category === null">
                        <span class="text-gray-500 truncate">
                           Kategori belum dipilih
                        </span>
                     </template>
                     <template v-else>
                        {{ typeOptions.find(item => item.value === filters.type)?.label || 'Pilih tipe...' }}
                     </template>
                  </template>

                  <template #option="{ option: type }">
                     <span v-if="type.value === null" class="text-gray-500 font-light truncate">
                        {{ type.label }}
                     </span>
                     <span v-else class="truncate">
                        {{ type.label }}
                     </span>
                  </template>
               </u-select-menu>
            </u-form-group>
            <!-- !SECTION -->

            <!-- SECTION: Year -->
            <u-form-group
               class="col-span-2"
               label="Tahun Ajaran"
            >
               <u-input
                  v-model="(filters.year as string)"
                  @keypress="validateNumber"
                  @keydown.enter="fetchData(filters)"
               >
                  <template #trailing>
                     <u-kbd size="xs">Enter</u-kbd>
                  </template>
               </u-input>
            </u-form-group>
            <!-- !SECTION -->

            <!-- SECTION: Status -->
            <u-form-group
               class="col-span-2"
               label="Status"
            >
               <u-select-menu
                  v-model="(filters.status as number)"
                  :options="statusOptions"
                  value-attribute="value"
                  searchable
                  searchable-placeholder="Cari..."
                  :search-attributes="['label']"
                  @update:model-value="fetchData(filters)"
               >
                  <template #label>
                     {{ statusOptions.find(item => item.value === filters.status)?.label || 'Pilih status...' }}
                  </template>

                  <template #option="{ option: status }">
                     <template v-if="status.value === null">
                        <span class="text-gray-500 font-light truncate">
                           {{ status.label }}
                        </span>
                     </template>
                     <template v-else>
                        <span
                           class="inline-block h-2 w-2 flex-shrink-0 rounded-full"
                           :class="statusOptionColor(status.value)"
                           aria-hidden="true"
                        ></span>
                        <span class="truncate">{{ status.label }}</span>
                     </template>
                  </template>
               </u-select-menu>
            </u-form-group>
            <!-- !SECTION -->

            <!-- SECTION: Add Button -->
            <div class="col-span-2 flex items-end justify-end">
               <u-button
                  icon="i-heroicons-plus"
                  @click.stop="store.showDialog('data-create', 'Tambah Data', null, () => fetchData(filters))"
               >
                  Tambah Data
               </u-button>
            </div>
            <!-- !SECTION -->
         </div>
         <!-- !SECTION -->
      </template>

      <template #status="{ row }">
         <u-badge
            :color="statusColor(row.data_status_id)"
            variant="subtle"
         >
            {{ row.status.name }}
         </u-badge>
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

const rows: Ref <Model.Data[]> = ref([])
const columns = [
   { key: 'school.user.name', label: 'Sekolah' },
   { key: 'type.name', label: 'Tipe' },
   { key: 'type.category.name', label: 'Kategori' },
   { key: 'year', label: 'Tahun' },
   { key: 'status.name', label: 'Status' },
   { key: 'updated_at', label: 'Diperbarui' },
   { key: 'actions', label: '' },
]
const dataLength : Ref <number> = ref(0)
const loading : Ref <boolean> = ref(false)
const filters : Ref <API.Request.Query.Data> = ref({
   school: null,
   year: null,
   category: null,
   type: null,
   status: null,
   per_page: 10
})
const schoolOptions : Ref <Util.SelectOption[]> = ref([])
const categoryOptions : Ref <Util.SelectOption[]> = ref([])
const typeOptions : Ref <Util.SelectOption[]> = ref([])
const statusOptions : Ref <Util.SelectOption[]> =ref([])

const actionMenu = (row: Model.Data) => ([
   [
      {
         label: 'Unduh data',
         icon: 'i-heroicons-folder-arrow-down',
         click: () => useDownloadFile(row)
            .then(resp => store.notify('success', 'File berhasil diunduh'))
            .catch((error: API.Error) => store.notify('error', error.response._data.message || 'Error downloading data'))
      },
      {
         label: 'Lihat detail',
         icon: 'i-heroicons-document-magnifying-glass',
         click: () => { console.log(row) }
      },
      {
         label: 'Sunting data',
         icon: 'i-heroicons-pencil-square',
         click: () => store.showDialog('data-edit', 'Sunting Data', row, () => fetchData(filters.value))
      },
      {
         label: 'Sunting File',
         icon: 'i-heroicons-document',
         click: () => store.showDialog('file-upload', 'Upload File', row, () => fetchData(filters.value)),
      }
   ],
   [
      {
         label: 'Hapus data',
         icon: 'i-heroicons-trash',
         slot: 'delete',
         click: () => { console.log(row) }
      }
   ]
])

onBeforeMount(async () => {
   await fetchData({
      page: 1,
      per_page: 10
   })

   await useGetSchoolOptions()
      .then(resp => {
         schoolOptions.value = resp
         schoolOptions.value.unshift({
            label: 'Pilih sekolah...',
            value: null
         })
      })

   await useDataCategoryOptions()
      .then(resp => {
         categoryOptions.value = resp
         categoryOptions.value.unshift({
            label: 'Pilih kategori...',
            value: null
         })
      })

   await useDataStatusOptions()
      .then(resp => {
         statusOptions.value = resp
         statusOptions.value.unshift({
            label: 'Pilih status...',
            value: null
         })
      })
})

const fetchData = async (payload: API.Request.Query.Data) => {
   loading.value = true
   await useGetData(payload)
      .then(resp => {
         rows.value = resp.data
         dataLength.value = resp.total
      })
      .catch((error: API.Error) => {
         store.notify('error', error.response._data.message || 'Error fetching data')
      })
      .finally(() => {
         loading.value = false
      })
}

const fetchTypeOptions = async (categoryId: number) => {
   await useDataTypeOptions(categoryId)
      .then(resp => {
         typeOptions.value = resp
         typeOptions.value.unshift({
            label: 'Pilih tipe...',
            value: null
         })
      })
}

const onCategoryChanges = async (categoryId: number) => {
   await new Promise(async (resolve) => {
      if (!categoryId) {
         filters.value.type = null
         typeOptions.value = []
      }
      else await fetchTypeOptions(categoryId)

      resolve(() => {})
   })
}

const onTableEmit = async (emitData: { [key: string]: number | string }) => {
   for (const [key, value] of Object.entries(emitData)) {
      filters.value[key] = value
   }

   await fetchData(filters.value)
}

const statusColor = (statusId: number) => {
   switch (statusId) {
      case 1:
         return 'gray'
      case 2:
         return 'green'
      case 3:
         return 'amber'
      case 4:
         return 'cyan'
      default:
         return 'gray'
   }
}

const statusOptionColor = (statusId: number) => {
   switch (statusId) {
      case 1:
         return 'bg-gray-400'
      case 2:
         return 'bg-green-500'
      case 3:
         return 'bg-amber-500'
      case 4:
         return 'bg-cyan-500'
      default:
         return 'bg-gray-100'
   }
}
</script>