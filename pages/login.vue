<template>
<main class="h-screen gradient-bg">
   <div class="h-full flex justify-center items-center">
      <u-card class="w-1/3 ring-0 shadow-xl shadow-blue-100/40">
         <div class="grid grid-cols-1 gap-4">
            <p class="font-medium">Login</p>
            <u-form
               :schema="validator"
               :state="state"
               :validate-on="['submit']"
               @submit="submit"
            >
            <div class="grid grid-cols-1 gap-4">
                  <u-form-group
                     label="Email"
                     name="email"
                  >
                     <u-input
                        v-model="state.email"
                        name="email"
                        type="email"
                        icon="i-heroicons-envelope"
                     ></u-input>
                  </u-form-group>

                  <u-form-group
                     label="Kata Sandi"
                     name="password"
                  >
                     <u-button-group class="w-full">
                        <u-input
                           v-model="state.password"
                           name="password"
                           icon="i-heroicons-lock-closed"
                           autocomplete
                           class="flex-1"
                           input-class="focus:ring-inset"
                           :type="showPassword ? 'text' : 'password'"
                        ></u-input>
                        <u-button
                           :icon="showPassword ? 'i-heroicons-eye' : 'i-heroicons-eye-slash'"
                           color="white"
                           @click="showPassword = !showPassword"
                        ></u-button>
                     </u-button-group>
                  </u-form-group>

                  <div class="flex justify-between items-center gap-2">
                     <u-button
                        variant="link"
                        color="primary"
                        to="/forgot-password"
                     >
                        Lupa kata sandi?
                     </u-button>
                     <u-button
                        icon="i-heroicons-arrow-right-on-rectangle"
                        type="submit"
                        :loading="loading"
                     >
                        Log In
                     </u-button>
                  </div>
               </div>
            </u-form>
         </div>
      </u-card>
   </div>
</main>
</template>

<script setup lang="ts">
import * as yup from 'yup'

const authStore = useAuthStore()
const store = useAppStore()

store.setPageTitle('Login')

definePageMeta({
   layout: false
})

const validator = yup.object({
   email: yup.string().email('Email tidak valid').required('Email harus diisi'),
   password: yup.string().required('Kata sandi harus diisi')
})

const state : Ref <API.Request.Login> = ref({
   email: '',
   password: ''
})
const showPassword : Ref <boolean> = ref(false)
const loading : Ref <boolean> = ref(false)

const submit = async () => {
   loading.value = true

   await authStore.login(state.value)
      .then(resp => {
         store.notify('success', 'Log in success', 'login')
         navigateTo('/')
      })
      .catch((error: API.Error) => {
         state.value.password = ''
      })
      .finally(() => loading.value = false)
}
</script>

<style scoped>
.gradient-bg {
   background-image: linear-gradient(109.6deg, #dbeafe 11.2%, #eff6ff 100.2%);
}
</style>