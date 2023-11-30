<template>
<div class="grid gap-4 py-4 first:py-0 first:pb-4 last:py-0 last:pt-4">
   <div class="flex items-center gap-4">
      <u-avatar
         src="https://avatars.githubusercontent.com/u/739984?v=4"
      ></u-avatar>
      <div class="text-sm">
         <p class="tracking-wide">
            {{ comment.user?.name }}
            <u-badge
               v-if="comment.user?.id === user?.id"
               variant="subtle"
               color="green"
               size="xs"
               class="ms-1"
            >
               Anda
            </u-badge>

            <u-badge
               v-if="comment.user?.id === props.data.school.user?.id"
               variant="subtle"
               color="emerald"
               size="xs"
               class="ms-1"
            >
               Pemilik
            </u-badge>

            <u-badge
               v-if="comment.user?.userable_type === 'school'"
               variant="subtle"
               color="blue"
               size="xs"
               class="ms-1"
            >
               Sekolah
            </u-badge>

            <u-badge
               v-if="comment.user?.userable_type === 'supervisor'"
               variant="subtle"
               color="cyan"
               size="xs"
               class="ms-1"
            >
               Pengawas
            </u-badge>

            <u-badge
               v-if="comment.user?.userable_type === 'officer'"
               variant="subtle"
               color="gray"
               size="xs"
               class="ms-1"
            >
               Officer
            </u-badge>

            <u-badge
               v-if="!comment.user?.userable_type"
               variant="subtle"
               color="red"
               size="xs"
               class="ms-1"
            >
               Admin
            </u-badge>
         </p>
         <p class="text-gray-500">
            {{ comment.user?.email }}
         </p>
      </div>
      <div class="flex-grow self-start flex justify-end">
         <p class="text-gray-500 text-sm">
            {{ dayjs(comment.created_at).fromNow() }}
         </p>
      </div>
   </div>

   <p class="text-sm">
      {{ comment.message }}
   </p>

   <div class="flex divide-x">
      <template v-if="(comment.replies ?? []).length > 0">
         <span
            v-if="!comment.replies_visible"
            class="text-xs text-gray-500 px-2 first:px-0 first:pe-2 cursor-pointer select-none hover:underline"
            @click.stop="comment.replies_visible = true"
         >
            Lihat balasan ({{ comment.replies?.length }})
         </span>

         <span
            v-else
            class="text-xs text-gray-500 px-2 first:px-0 first:pe-2 cursor-pointer select-none hover:underline"
            @click.stop="comment.replies_visible = false"
         >
            Sembunyikan balasan
         </span>
      </template>

      <span
         class="text-xs text-gray-500 px-2 first:px-0 first:pe-2 cursor-pointer select-none hover:underline"
         @click.stop="emit('reply', comment)"
      >
         Balas
      </span>
   </div>

   <template v-if="comment.replies_visible && (comment.replies ?? []).length > 0">
      <div class="flex">
         <div class="border-l border-gray-300 border-dashed h-full mx-6"></div>
         <div class="flex-grow grid">
            <template v-for="reply in comment.replies">
               <comment-block
                  :comment="reply"
                  :data="props.data"
                  @reply="emit('reply', reply)"
               />
            </template>
         </div>
      </div>
   </template>
</div>
</template>

<script setup lang="ts">
const user = useAuthStore().getUser
const dayjs = useDayjs()

type Props = {
   comment: Model.Comment
   data: Model.Data
}

const props = defineProps<Props>()
const emit = defineEmits(['reply'])

const comment : Ref <Model.Comment> = ref(props.comment)

watch(() => props.comment, () => {
   comment.value = props.comment
})
</script>