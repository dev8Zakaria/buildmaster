<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const form = ref({
    email: '',
    password: ''
});

const error = ref('');
const isLoading = ref(false);
const visible = ref(false);

const handleLogin = async () => {
    error.value = '';
    
    // Basic client-side validation
    if (!form.value.email || !form.value.password) {
        error.value = 'Please fill in all fields';
        return;
    }

    isLoading.value = true;
    try {
        await authStore.login(form.value);
        router.push('/'); // Redirect to home after successful login
    } catch (err) {
        error.value = err;
    } finally {
        isLoading.value = false;
    }
};
</script>

<template>
  <v-container class="fill-height justify-center">
    <v-card width="400" class="pa-5" elevation="8" rounded="lg">
      <v-card-title class="text-h5 font-weight-bold text-center mb-4">
        Welcome Back
      </v-card-title>
      <v-card-subtitle class="text-center mb-6">
        Sign in to your account
      </v-card-subtitle>

      <v-form @submit.prevent="handleLogin">
        <v-text-field
          v-model="form.email"
          label="Email address"
          prepend-inner-icon="mdi-email-outline"
          variant="outlined"
          type="email"
          required
        ></v-text-field>

        <v-text-field
          v-model="form.password"
          label="Password"
          prepend-inner-icon="mdi-lock-outline"
          variant="outlined"
          :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
          :type="visible ? 'text' : 'password'"
          @click:append-inner="visible = !visible"
          required
        ></v-text-field>

        <v-alert
          v-if="error"
          type="error"
          variant="tonal"
          class="mb-4"
          closable
        >
          {{ error }}
        </v-alert>

        <v-btn
          type="submit"
          block
          color="primary"
          size="large"
          variant="elevated"
          :loading="isLoading"
        >
          Sign In
        </v-btn>
      </v-form>

      <v-divider class="my-4"></v-divider>

      <div class="text-center text-body-2">
        Don't have an account?
        <router-link to="/signup" class="text-decoration-none font-weight-bold text-primary">
          Sign up
        </router-link>
      </div>
    </v-card>
  </v-container>
</template>
