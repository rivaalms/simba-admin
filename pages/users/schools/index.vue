<template>
<u-card>
   <data-table
      :columns="columns"
      :rows="rows"
      :total="dataLength"
      :loading="loading"
      filterable
      :filter-count="filterCount"
      @fetch="onTableEmit"
   >
      <template #filter>
         <div class="p-4 grid gap-4">
            <!-- SECTION: Type -->
            <u-form-group
               class=""
               label="Tipe"
            >
               <u-button-group class="w-full">
                  <u-select-menu
                     v-model="(filter.type as number)"
                     :options="typeOptions"
                     value-attribute="value"
                     class="flex-1"
                     searchable
                     searchable-placeholder="Cari..."
                     :search-attributes="['label']"
                     @update:model-value="fetchSchools()"
                  >
                     <template #label>
                        {{ typeOptions.find(item => item.value === filter.type)?.label || 'Pilih tipe...' }}
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

                  <u-tooltip v-if="!!filter.type" text="Hapus filter">
                     <u-button
                        color="white"
                        icon="i-heroicons-x-mark"
                        class="rounded-s-none"
                        @click.stop="async () => {
                           filter.type = null
                           await fetchSchools()
                        }"
                     ></u-button>
                  </u-tooltip>
               </u-button-group>
            </u-form-group>
            <!-- !SECTION -->

            <!-- SECTION: Supervisor -->
            <u-form-group
               class=""
               label="Pengawas"
            >
               <u-button-group class="w-full">
                  <u-select-menu
                     v-model="(filter.supervisor as number)"
                     :options="supervisorOptions"
                     value-attribute="value"
                     class="flex-1"
                     searchable
                     searchable-placeholder="Cari..."
                     :search-attributes="['label']"
                     @update:model-value="fetchSchools()"
                  >
                     <template #label>
                        {{ supervisorOptions.find(item => item.value === filter.supervisor)?.label || 'Pilih pengawas...' }}
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

                  <u-tooltip v-if="!!filter.supervisor" text="Hapus filter">
                     <u-button
                        color="white"
                        icon="i-heroicons-x-mark"
                        class="rounded-s-none"
                        @click.stop="async () => {
                           filter.supervisor = null
                           await fetchSchools()
                        }"
                     ></u-button>
                  </u-tooltip>
               </u-button-group>
            </u-form-group>
            <!-- !SECTION -->
         </div>
      </template>

      <template #header>
         <div class="flex-1 flex justify-between items-center gap-4">
            <!-- SECTION: Name -->
            <u-button-group>
               <u-input
                  v-model="(filter.search as string)"
                  placeholder="Cari nama/email/kepala sekolah..."
                  class="flex-1"
                  input-class="focus:ring-inset"
                  @keyup.enter="fetchSchools()"
               ></u-input>

               <u-tooltip v-if="!!filter.search" text="Hapus filter">
                  <u-button
                     color="white"
                     icon="i-heroicons-x-mark"
                     class="rounded-none"
                     @click.stop="async () => {
                        filter.search = null
                        await fetchSchools()
                     }"
                  ></u-button>
               </u-tooltip>

               <u-button
                  color="white"
                  icon="i-heroicons-magnifying-glass"
                  @click.stop="fetchSchools()"
               >
                  Cari
               </u-button>
            </u-button-group>
            <!-- !SECTION -->

            <u-button
               icon="i-heroicons-plus"
               @click.stop="store.showDialog('school-create', 'Tambah Sekolah', null, () => fetchSchools())"
            >
               Tambah Sekolah
            </u-button>
         </div>
      </template>

      <template #user-status="{ row }">
         <u-badge
            :color="row.user.status === 'ACTIVE' ? 'emerald' : 'red'"
            variant="subtle"
            class="capitalize"
         >
            {{ row.user.status.toLowerCase() }}
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

store.setPageTitle('Daftar Sekolah')

const columns : ComputedRef <Util.TableColumns[]> = computed(() => [
   { key: 'user.name', label: 'Nama Sekolah' },
   { key: 'user.email', label: 'Email' },
   { key: 'type.name', label: 'Tipe' },
   { key: 'principal', label: 'Kepala Sekolah' },
   { key: 'user.status', label: 'Status' },
   { key: 'updated_at', label: 'Diperbarui' },
   { key: 'actions', label: '' }
])

const rows : Ref <Model.School[]> = ref([])
const dataLength : Ref <number> = ref(0)
const loading : Ref <boolean> = ref(false)
const filter : Ref <API.Request.Query.School> = ref({
   search: null,
   supervisor: null,
   type: null,
   per_page: 10,
})
const filterCount = computed(() => {
   const { per_page, page, search, ...rest } = filter.value
   const count = Object.values(rest).filter((i: any) => !!i).length
   return count
})

const supervisorOptions : Ref <Util.SelectOption[]> = ref([])
const typeOptions : Ref <Util.SelectOption[]> = ref([])

const actionMenu = (row: Model.Data) => ([
   [
      {
         label: 'Lihat detail',
         icon: 'i-heroicons-document-magnifying-glass',
         click: () => useRouter().push(`/users/schools/${row.id}`)
      },
      {
         label: 'Sunting sekolah',
         icon: 'i-heroicons-pencil-square',
         click: () => store.showDialog('school-edit', 'Sunting Sekolah', row, () => fetchSchools())
      },
   ],
   [
      {
         label: 'Hapus sekolah',
         icon: 'i-heroicons-trash',
         slot: 'delete',
         click: () => store.showDialog('school-delete', 'Hapus Sekolah', row, () => fetchSchools())
      }
   ]
])

onBeforeMount(async () => {
   await fetchSchools()

   await getSupervisorOptions()
      .then(resp => {
         supervisorOptions.value = resp
      })

   await getSchoolTypeOptions()
      .then(resp => {
         typeOptions.value = resp
      })
})

const fetchSchools = async () => {
   loading.value = true
   await getSchools(filter.value)
      .then(resp => {
         rows.value = resp.data
         dataLength.value = resp.total
      })
      .finally(() => loading.value = false)
}

const onTableEmit = async (data: any) => await mapFilters(data, filter.value).then(async (resp) => {
   filter.value = resp
   await fetchSchools()
})
</script>