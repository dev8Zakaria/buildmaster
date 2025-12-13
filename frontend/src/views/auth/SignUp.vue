<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const form = ref({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'Customer'
});

const error = ref('');
const isLoading = ref(false);
const visible = ref(false);

const handleSignup = async () => {
    error.value = '';

    // Basic Validation
    if (!form.value.firstName || !form.value.lastName || !form.value.email || !form.value.password) {
        error.value = "All fields are required";
        return;
    }

    isLoading.value = true;
    try {
        await authStore.signup(form.value);
        router.push('/login'); 
    } catch (err) {
        error.value = err;
    } finally {
        isLoading.value = false;
    }
};
</script>

<template>
  <v-container class="fill-height justify-center">
    <v-card width="500" class="pa-5" elevation="8" rounded="lg">
      <v-card-title class="text-h5 font-weight-bold text-center mb-4">
        Create an Account
      </v-card-title>
      <v-card-subtitle class="text-center mb-6">
        Join Mini Market today
      </v-card-subtitle>

      <v-form @submit.prevent="handleSignup">
        <v-row>
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="form.firstName"
              label="First Name"
              variant="outlined"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="form.lastName"
              label="Last Name"
              variant="outlined"
              required
            ></v-text-field>
          </v-col>
        </v-row>

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
          Sign Up
        </v-btn>
      </v-form>

      <v-divider class="my-4"></v-divider>

      <div class="text-center text-body-2">
        Already have an account?
        <router-link to="/login" class="text-decoration-none font-weight-bold text-primary">
          Sign in
        </router-link>
      </div>
    </v-card>
  </v-container>
</template>
