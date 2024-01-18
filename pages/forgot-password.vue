<template>
<main class="h-screen">
   <div class="h-full flex justify-center items-center">
      <u-card class="w-1/3">
         <template #header>
            <p class="text-sm">Lupa kata sandi</p>
         </template>

         <template v-if="!isEmailSent">
            <div class="grid grid-cols-1 gap-4">
               <p class="text-sm">
                  Silakan isi email yang terdaftar. Kami akan mengirimkan email berisi tautan untuk mengatur ulang kata sandi.
               </p>

               <u-form
                  :schema="validator"
                  :state="state"
                  :validate-on="['submit']"
                  @submit="submit"
               >
                  <div class="grid gap-4">
                     <u-form-group
                        name="email"
                     >
                        <u-input
                           v-model="(state.email as string)"
                           name="email"
                           type="email"
                           icon="i-heroicons-envelope"
                           placeholder="Email"
                           :disabled="loading"
                        ></u-input>
                     </u-form-group>

                     <div class="flex items-center justify-between">
                        <u-button
                           variant="ghost"
                           color="gray"
                           icon="i-heroicons-arrow-uturn-left"
                           :disabled="loading"
                           to="/login"
                        >
                           Batalkan
                        </u-button>

                        <u-button
                           type="submit"
                           :loading="loading"
                           icon="i-heroicons-paper-airplane"
                        >
                           Kirim
                        </u-button>
                     </div>
                  </div>
               </u-form>
            </div>
         </template>

         <template v-else>
            <div class="flex flex-col items-center gap-6">
               <u-icon name="i-heroicons-check-circle" class="text-green-400 h-16 w-16"></u-icon>

               <p class="text-sm">
                  Kami telah mengirimkan email berisi tautan untuk mengatur ulang kata sandi. Silakan cek email Anda untuk melanjutkan.
               </p>

               <u-button
                  icon="i-heroicons-arrow-uturn-left"
                  variant="outline"
                  to="/login"
               >
                  Kembali ke halaman login
               </u-button>
            </div>
         </template>
      </u-card>
   </div>
</main>
</template>

<script setup lang="ts">
import * as yup from 'yup'

const store = useAppStore()
store.setPageTitle('Lupa kata sandi')

definePageMeta({
   layout: false
})

const loading : Ref <boolean> = ref(false)
const isEmailSent : Ref <boolean> = ref(false)

const state : Ref <API.Request.Form.ForgotPassword> = ref({
   email: ''
})

const validator = yup.object({
   email: yup.string().required('Email harus diisi').email('Email tidak valid')
})

const submit = async () => {
   loading.value = true
   await forgotPassword(state.value)
      .then(() => {
         isEmailSent.value = true
      })
      .finally(() => loading.value = false)
}
</script>