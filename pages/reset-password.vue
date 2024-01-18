<template>
<main class="h-screen">
   <div class="h-full flex justify-center items-center">
      <u-card class="w-1/3">
         <template #header>
            <p class="text-sm">
               Atur Ulang Kata Sandi
            </p>
         </template>

         <div v-if="isTokenExist" class="grid gap-6">
            <p class="text-sm">
               Silakan atur ulang kata sandi untuk akun <span class="text-blue-500">{{ email }}</span>.
            </p>

            <u-form
               :schema="validator"
               :state="state"
               :validate-on="['submit']"
               @submit="submit"
               class="grid gap-4"
            >
            <u-form-group
               label="Kata sandi"
               name="password"
            >
               <template #description>
                  <div class="flex items-center justify-between">
                     <span class="text-xs text-gray-400">
                        Minimal 8 karakter
                     </span>

                     <span
                        v-if="showPasswordCounter"
                        class="text-xs transition-all"
                        :class="(state.password?.length || 0) > 7 ? 'text-emerald-500' : 'text-red-500'"
                     >
                        {{ state.password?.length || 0 }} / 8
                     </span>
                  </div>
               </template>

               <u-button-group class="w-full">
                  <u-input
                     v-model="(state.password as string)"
                     name="password"
                     icon="i-heroicons-lock-closed"
                     autocomplete
                     class="flex-1"
                     input-class="focus:ring-inset"
                     :type="showPassword.password ? 'text' : 'password'"
                     :disabled="loading"
                     @focus="showPasswordCounter = true"
                     @blur="showPasswordCounter = false"
                  ></u-input>
                  <u-button
                     :icon="showPassword.password ? 'i-heroicons-eye' : 'i-heroicons-eye-slash'"
                     color="white"
                     @click="showPassword.password = !showPassword.password"
                  ></u-button>
               </u-button-group>
            </u-form-group>

            <u-form-group
               label="Konfirmasi kata sandi"
               name="password_confirmation"
            >
               <u-button-group class="w-full">
                  <u-input
                     v-model="(state.password_confirmation as string)"
                     name="password_confirmation"
                     icon="i-heroicons-lock-closed"
                     autocomplete
                     class="flex-1"
                     input-class="focus:ring-inset"
                     :type="showPassword.password_confirmation ? 'text' : 'password'"
                     :disabled="loading"
                  ></u-input>
                  <u-button
                     :icon="showPassword.password_confirmation ? 'i-heroicons-eye' : 'i-heroicons-eye-slash'"
                     color="white"
                     @click="showPassword.password_confirmation = !showPassword.password_confirmation"
                  ></u-button>
               </u-button-group>
            </u-form-group>

            <div class="flex items-center justify-end mt-2">
               <u-button
                  type="submit"
                  color="emerald"
                  icon="i-heroicons-check"
                  :loading="loading"
               >
                  Simpan
               </u-button>
            </div>
         </u-form>
         </div>

         <div v-else class="flex flex-col items-center gap-6">
            <u-icon name="i-heroicons-check-circle" class="text-green-400 h-16 w-16"></u-icon>

            <p class="text-sm">
               Kata sandi Anda berhasil diatur ulang. Silakan kembali ke halaman login.
            </p>

            <u-button
               icon="i-heroicons-arrow-uturn-left"
               variant="outline"
               to="/login"
            >
               Kembali ke halaman login
            </u-button>
         </div>
      </u-card>
   </div>
</main>
</template>

<script setup lang="ts">
import * as yup from 'yup'

const store = useAppStore()

definePageMeta({
   layout: false
})

const isTokenExist : Ref <boolean> = ref(false)
const loading : Ref <boolean> = ref(false)
const token : ComputedRef <string> = computed(() => useRoute().query.token as string)
const email : ComputedRef <string> = computed(() => useRoute().query.email as string)

const state : Ref <API.Request.Form.ResetPassword> = ref({
   email: email.value,
   password: null,
   password_confirmation: null,
   token: token.value
})

const validator = yup.object().shape({
   password: yup.string().required('Kata sandi harus diisi').min(8, 'Kata sandi minimal 8 karakter'),
   password_confirmation: yup.string().required('Konfirmasi kata sandi harus diisi').oneOf([yup.ref('password')], 'Konfirmasi kata sandi tidak cocok'),
   email: yup.string().required('Email harus diisi').email('Email tidak valid'),
   token: yup.string().required('Token harus diisi')
})

const showPassword : Ref <{ [key: string]: boolean }> = ref({
   password: false,
   password_confirmation: false
})
const showPasswordCounter : Ref <boolean> = ref(false)

onBeforeMount(async () => {
   await checkResetPasswordToken({ email: email.value, token: token.value })
      .then(resp => {
         isTokenExist.value = resp
      })
})

const submit = async () => {
   loading.value = true

   await resetPassword(state.value)
      .then(resp => {
         isTokenExist.value = false
      })
      .finally(() => loading.value = false)
}
</script>