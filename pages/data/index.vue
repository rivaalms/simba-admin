<template>
<u-card>
   <data-table
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
               <u-button-group class="w-full">
                  <u-select-menu
                     v-model="(filter.school as number)"
                     :options="schoolOptions"
                     value-attribute="value"
                     searchable
                     searchable-placeholder="Cari..."
                     :search-attributes="['label']"
                     class="flex-1"
                     @update:model-value="fetchData()"
                  >
                     <template #label>
                        <span class="">
                           {{ schoolOptions.find(item => item.value === filter.school)?.label || 'Pilih sekolah...' }}
                        </span>
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

                  <u-tooltip v-if="!!filter.school" text="Hapus filter">
                     <u-button
                        color="white"
                        icon="i-heroicons-x-mark"
                        class="rounded-s-none"
                        @click.stop="async () => {
                           filter.school = null
                           await fetchData()
                        }"
                     ></u-button>
                  </u-tooltip>
               </u-button-group>
            </u-form-group>
            <!-- !SECTION -->

            <!-- SECTION: Category -->
            <u-form-group
               class="col-span-2"
               label="Kategori"
            >
               <u-button-group class="w-full">
                  <u-select-menu
                     v-model="(filter.category as number)"
                     :options="categoryOptions"
                     value-attribute="value"
                     searchable
                     searchable-placeholder="Cari..."
                     :search-attributes="['label']"
                     class="flex-1"
                     @update:model-value="(val) => {
                        onCategoryChanges(val)
                        fetchData()
                     }"
                  >
                     <template #label>
                        {{ categoryOptions.find(item => item.value === filter.category)?.label || 'Pilih kategori...' }}
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

                  <u-tooltip v-if="!!filter.category" text="Hapus filter">
                     <u-button
                        color="white"
                        icon="i-heroicons-x-mark"
                        class="rounded-s-none"
                        @click.stop="async () => {
                           filter.category = null
                           await fetchData()
                        }"
                     ></u-button>
                  </u-tooltip>
               </u-button-group>
            </u-form-group>
            <!-- !SECTION -->

            <!-- SECTION: Type -->
            <u-form-group
               class="col-span-2"
               label="Tipe"
            >
               <u-button-group class="w-full">
                  <u-select-menu
                     v-model="(filter.type as number)"
                     :options="typeOptions"
                     value-attribute="value"
                     searchable
                     :disabled="(filter.category as number) < 1"
                     searchable-placeholder="Cari..."
                     :search-attributes="['label']"
                     class="flex-1"
                     @update:model-value="fetchData()"
                  >
                     <template #label>
                        <template v-if="filter.category === null">
                           <span class="text-gray-500 truncate">
                              Kategori belum dipilih
                           </span>
                        </template>
                        <template v-else>
                           {{ typeOptions.find(item => item.value === filter.type)?.label || 'Pilih tipe...' }}
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

                  <u-tooltip v-if="!!filter.type" text="Hapus filter">
                     <u-button
                        color="white"
                        icon="i-heroicons-x-mark"
                        class="rounded-s-none"
                        @click.stop="async () => {
                           filter.type = null
                           await fetchData()
                        }"
                     ></u-button>
                  </u-tooltip>
               </u-button-group>
            </u-form-group>
            <!-- !SECTION -->

            <!-- SECTION: Year -->
            <u-form-group
               class="col-span-2"
               label="Tahun Ajaran"
            >
            <u-button-group class="w-full">
               <date-picker
                  v-model="yearPicker"
                  :mode="['year-picker']"
                  @update:model-value="async (val) => {
                     yearPicker = val
                     filter.year = `${parseInt(val)}-${parseInt(val) + 1}`
                     await fetchData()
                  }"
               >
                  <u-input
                     v-model="(filter.year as string)"
                     :input-class="`cursor-pointer focus:ring-inset ${!!filter.year ? 'rounded-e-none' : ''}`"
                     placeholder="Pilih tahun ajaran..."
                     readonly
                     icon="i-heroicons-calendar-days"
                  ></u-input>
               </date-picker>

               <u-tooltip v-if="!!filter.year" text="Hapus filter">
                  <u-button
                     color="white"
                     icon="i-heroicons-x-mark"
                     class="rounded-s-none"
                     @click.stop="async () => {
                        filter.year = null
                        await fetchData()
                     }"
                  ></u-button>
               </u-tooltip>
            </u-button-group>
            </u-form-group>
            <!-- !SECTION -->

            <!-- SECTION: Status -->
            <u-form-group
               class="col-span-2"
               label="Status"
            >
               <u-button-group class="w-full">
                  <u-select-menu
                     v-model="(filter.status as number)"
                     :options="statusOptions"
                     value-attribute="value"
                     searchable
                     searchable-placeholder="Cari..."
                     :search-attributes="['label']"
                     class="flex-1"
                     @update:model-value="fetchData()"
                  >
                     <template #label>
                        <span
                           v-if="!!filter.status"
                           class="inline-block h-2 w-2 flex-shrink-0 rounded-full"
                           :class="statusOptionColor(filter.status as number)"
                           aria-hidden="true"
                        ></span>
                        {{ statusOptions.find(item => item.value === filter.status)?.label || 'Pilih status...' }}
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

                  <u-tooltip v-if="!!filter.status" text="Hapus filter">
                     <u-button
                        color="white"
                        icon="i-heroicons-x-mark"
                        class="rounded-s-none"
                        @click.stop="async () => {
                           filter.status = null
                           await fetchData()
                        }"
                     ></u-button>
                  </u-tooltip>
               </u-button-group>
            </u-form-group>
            <!-- !SECTION -->

            <!-- SECTION: Add Button -->
            <div class="col-span-2 flex items-end justify-end">
               <u-button
                  icon="i-heroicons-plus"
                  @click.stop="store.showDialog('data-create', 'Tambah Data', null, () => fetchData())"
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
   </data-table>
</u-card>
</template>

<script setup lang="ts">
const store = useAppStore()

store.setPageTitle('Data')

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
const filter : Ref <API.Request.Query.Data> = ref({
   school: null,
   year: null,
   category: null,
   type: null,
   status: null,
   per_page: 10,
   page: 1
})
const yearPicker : Ref <string> = ref((useDayjs())().format('YYYY'))

const schoolOptions : Ref <Util.SelectOption[]> = ref([])
const categoryOptions : Ref <Util.SelectOption[]> = ref([])
const typeOptions : Ref <Util.SelectOption[]> = ref([])
const statusOptions : Ref <Util.SelectOption[]> =ref([])

const actionMenu = (row: Model.Data) => ([
   [
      {
         label: 'Unduh data',
         icon: 'i-heroicons-folder-arrow-down',
         click: () => downloadFile(row)
            .then(resp => store.notify('success', 'File berhasil diunduh'))
      },
      {
         label: 'Lihat detail',
         icon: 'i-heroicons-document-magnifying-glass',
         click: () => useRouter().push(`/data/${row.id}`)
      },
      {
         label: 'Sunting data',
         icon: 'i-heroicons-pencil-square',
         click: () => store.showDialog('data-edit', 'Sunting Data', row, () => fetchData())
      },
      {
         label: 'Sunting File',
         icon: 'i-heroicons-document',
         click: () => store.showDialog('file-upload', 'Upload File', row, () => fetchData()),
      }
   ],
   [
      {
         label: 'Hapus data',
         icon: 'i-heroicons-trash',
         slot: 'delete',
         click: () => store.showDialog('data-delete', 'Hapus Data', row, () => fetchData())
      }
   ]
])

onBeforeMount(async () => {
   await fetchData()

   await getSchoolOptions()
      .then(resp => {
         schoolOptions.value = resp
      })

   await getDataCategoryOptions()
      .then(resp => {
         categoryOptions.value = resp
      })

   await getDataStatusOptions()
      .then(resp => {
         statusOptions.value = resp
      })
})

const fetchData = async () => {
   loading.value = true
   await getData(filter.value)
      .then(resp => {
         rows.value = resp.data
         dataLength.value = resp.total
      })
      .finally(() => {
         loading.value = false
      })
}

const fetchTypeOptions = async (categoryId: number) => {
   await getDataTypeOptions(categoryId)
      .then(resp => {
         typeOptions.value = resp
      })
}

const onCategoryChanges = async (categoryId: number) => {
   await new Promise(async (resolve) => {
      if (!categoryId) {
         filter.value.type = null
         typeOptions.value = []
      }
      else await fetchTypeOptions(categoryId)

      resolve(() => {})
   })
}

const onTableEmit = async (data: any) => await mapFilters(data, filter.value).then(async (resp) => {
   filter.value = resp
   await fetchData()
})

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