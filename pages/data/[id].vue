<template>
<div class="grid grid-cols-3 gap-2">
   <div class="col-span-2 grid gap-2 place-self-start w-full">
      <u-card class="place-self-start w-full max-h-[calc(100dvh-57px-1rem)] overflow-auto">
         <template #header>
            <div class="grid grid-cols-12">
               <p class="col-span-6">
                  Komentar
               </p>
               <div class="col-span-6 flex justify-end">
                  <u-select-menu
                     v-model="(commentFilter.sort as string)"
                     :options="commentFilterOptions"
                     option-attribute="label"
                     value-attribute="value"
                  >
                     <template #label>
                        {{ commentFilterOptions.find(item => item.value === commentFilter.sort)?.label || 'Urutkan komentar...' }}
                     </template>
                  </u-select-menu>
               </div>
            </div>
         </template>

         <loading-state v-if="commentLoading"></loading-state>

         <div v-else class="grid divide-y">
            <template v-if="comments?.length || 0 > 0">
               <template v-for="comment in comments">
                  <comment-block
                     :comment="comment"
                     :data="data!"
                     @reply="replyToComment"
                  />
               </template>
            </template>

            <template v-else>
               <div class="flex justify-center text-sm text-gray-500">
                  Tidak ada komentar
               </div>
            </template>
         </div>
      </u-card>

      <u-card class="place-self-start w-full">

         <loading-state v-if="dataLoading"></loading-state>

         <div v-else class="grid gap-4">
            <p>Tulis Komentar</p>

            <div v-if="isReplyingTo" class="bg-gray-100 ps-6 p-2 relative rounded">
               <div class="absolute w-2 left-0 inset-y-0 bg-primary-500 rounded-s"></div>

               <div class="flex items-center justify-between gap-4">
                  <div class="text-sm">
                     <p class="font-medium">{{ isReplyingTo?.user?.name }}</p>
                     <p class="text-gray-500">{{ isReplyingTo?.message }}</p>
                  </div>

                  <u-button
                     icon="i-heroicons-x-mark"
                     variant="ghost"
                     color="grey"
                     @click.stop="cancelReplying"
                  ></u-button>
               </div>
            </div>

            <u-textarea
               ref="commentInput"
               v-model="(commentState.message as string)"
               :rows="4"
               autoresize
            ></u-textarea>

            <div class="flex items-center justify-end">
               <u-button-group>
                  <u-button
                     type="submit"
                     :loading="isCommentSending"
                     icon="i-heroicons-paper-airplane"
                     @click.stop="sendComment"
                  >
                     Kirim
                  </u-button>
                  <u-dropdown
                     :items="commentBtnDropdown()"
                  >
                     <u-button
                        icon="i-heroicons-chevron-down"
                        class="rounded-s-none"
                     ></u-button>
                  </u-dropdown>
               </u-button-group>
            </div>
         </div>
         </u-card>
   </div>

   <div class="grid gap-2 place-self-start w-full">
      <u-card v-if="data" class="place-self-start overflow-visible w-full">
         <template #header>
            <div class="flex items-center justify-between">
               <p>Detail Data</p>
               <u-dropdown
                  :items="dataDropdown()"
               >
                  <u-button
                     color="gray"
                     variant="ghost"
                     icon="i-heroicons-ellipsis-vertical"
                  ></u-button>
               </u-dropdown>
            </div>
         </template>
         <loading-state v-if="dataLoading"></loading-state>

         <div v-else class="grid grid-cols-2 gap-4">
            <div class="text-sm">
               <p class="text-gray-500">ID</p>
               <p class="tracking-wide">{{ data.id }}</p>
            </div>
            <div class="text-sm">
               <p class="text-gray-500">Tahun Ajaran</p>
               <p class="tracking-wide">{{ data.year }}</p>
            </div>
            <div class="text-sm">
               <p class="text-gray-500">Kategori Data</p>
               <p class="tracking-wide">{{ data.type.category.name }}</p>
            </div>
            <div class="text-sm">
               <p class="text-gray-500">Tipe Data</p>
               <p class="tracking-wide">{{ data.type.name }}</p>
            </div>
            <div class="text-sm">
               <p class="text-gray-500">Status</p>
               <u-badge
                  :color="statusColor(data.data_status_id)"
                  variant="subtle"
                  class="mt-1"
               >
                  {{ data.status.name }}
               </u-badge>
            </div>
            <div class="text-sm">
               <p class="text-gray-500">Diperbarui</p>
               <p class="tracking-wide">{{ dayjs(data.updated_at).format('DD MMMM YYYY HH:mm') }}</p>
            </div>
            <div class="col-span-2">
               <u-button
                  block
                  color="emerald"
                  icon="i-heroicons-folder-arrow-down"
                  @click.stop="downloadFile(data)"
               >
                  Unduh File
               </u-button>
            </div>
         </div>
      </u-card>

      <u-card class="place-self-start overflow-visible w-full">
         <template #header>
            <p>Detail Sekolah</p>
         </template>

         <loading-state v-if="dataLoading"></loading-state>

         <nuxt-link v-else :to="`/users/schools/${data?.school_id}`" target="_blank" class="flex items-center gap-4 group/school">
            <u-avatar
               :src="data?.school.user?.profile_picture || `/img/profile.webp`"
               size="2xl"
            ></u-avatar>
            <div class="text-sm">
               <p class="tracking-wide text-base group-hover/school:text-blue-500 transition-all">
                  {{ data?.school.user?.name }}
               </p>
               <p class="text-gray-500 group-hover/school:text-blue-600/50 transition-all">
                  {{ data?.school.user?.email }}
               </p>
            </div>
            <div class="flex-grow flex justify-end group-hover/school:text-blue-500 transition-all">
               <u-icon name="i-heroicons-arrow-top-right-on-square-20-solid"></u-icon>
            </div>
         </nuxt-link>
      </u-card>
   </div>
</div>
</template>

<script setup lang="ts">
const store = useAppStore()
const user = useAuthStore().getUser
const dayjs = useDayjs()
const paramsId = useRoute().params.id as unknown

store.setPageTitle('Detail Data', '/data')

const commentFilter : Ref <API.Request.Query.Comment> = ref({
   sort: 'latest'
})

const { data, pending: dataLoading, refresh: fetchData } = await useLazyAsyncData(
   'fetch-data-details',
   () => getSingleData(paramsId as number)
)

const { data: comments, pending: commentLoading, execute: fetchComments } = await useLazyAsyncData(
   'fetch-comments',
   () => getComments(paramsId as number, commentFilter.value),
   {
      transform: (resp) => resp.map(item => ({ ...item, replies_visible: false })),
      watch: [commentFilter],
      immediate: false,
      default: () => []
   }
)

watch(dataLoading, async (_new) => {
   if (_new) await fetchComments()
})

const commentFilterOptions: ComputedRef <Util.SelectOption[]> = computed(() => [
   {
      label: 'Terbaru',
      value: 'latest'
   },
   {
      label: 'Terlama',
      value: 'oldest'
   }
])
const commentInput : Ref <any> = ref(null)
const commentState : Ref <API.Request.Form.Comment> = ref({
   user_id: user?.id || null,
   data_id: null,
   message: null,
   reply_to: null
})
const isCommentSending : Ref <boolean> = ref(false)
const isReplyingTo : Ref <Model.Comment | null> = ref(null)

const dataDropdown = () => ([
   [
      {
         label: 'Sunting data',
         icon: 'i-heroicons-pencil-square',
         click: () => store.showDialog('data-edit', 'Sunting Data', data.value, () => fetchData())
      },
      {
         label: 'Sunting file',
         icon: 'i-heroicons-document',
         click: () => store.showDialog('file-upload', 'Upload File', data.value, () => fetchData()),
      }
   ]
])

const commentBtnDropdown = () => ([
   [
      {
         label: 'Kirim dan verifikasi',
         click: () => sendCommentAndMarkStatus(true)
      },
      {
         label: 'Kirim dan tandai revisi',
         click: () => sendCommentAndMarkStatus(false)
      }
   ]
])

const replyToComment = (comment: Model.Comment) => {
   if (!comment.reply_to) commentState.value.reply_to = comment.id
   else commentState.value.reply_to = comments.value!.find(item => item.id === comment.reply_to)!.id
   isReplyingTo.value = comment
   commentInput.value.$refs.textarea.focus()
}

const cancelReplying = () => {
   commentState.value.reply_to = null
   isReplyingTo.value = null
}

const sendComment = async () => {
   if (!commentState.value.message) return store.notify('error', 'Komentar harus diisi')
   commentState.value.data_id = data.value!.id
   isCommentSending.value = true
   await createComment(commentState.value)
      .then(async (resp) => {
         commentState.value.message = null
         commentState.value.reply_to = null
         store.notify('success', 'Komentar ditambahkan')
         isReplyingTo.value = null
         await fetchComments()
      })
      .finally(() => isCommentSending.value = false)
}

const sendCommentAndMarkStatus = async (verify: boolean) => {
   const { id, path, created_at, updated_at, school, type, status, ..._data } = data.value!

   if (verify) _data.data_status_id = 2
   else _data.data_status_id = 3

   await sendComment()
      .then(async () =>
         await updateData(id, _data)
            .then(async () => await fetchData())
      )
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
</script>