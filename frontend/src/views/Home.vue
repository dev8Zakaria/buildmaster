<script setup>
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const handleLogout = () => {
    authStore.logout();
    router.push('/login');
};
</script>

<template>
  <v-app>
    <v-main class="bg-grey-lighten-4 fill-height d-flex flex-column align-center justify-center">
      <v-container class="text-center">
        <h1 class="text-h2 font-weight-black text-primary mb-2">
          Mini Market
        </h1>
        <p class="text-h5 text-medium-emphasis mb-10">
          Experience the future of grocery shopping.
        </p>

        <!-- Dynamic Content based on Auth State -->
        <div v-if="authStore.user">
          <v-card class="mx-auto pa-6 mb-6" max-width="500" elevation="4" rounded="lg">
            <v-card-text>
              <h2 class="text-h5 font-weight-bold mb-2">
                Welcome back, {{ authStore.user.firstName || 'User' }}!
              </h2>
              <div class="mt-2">
                You are logged in as
                <v-chip color="secondary" class="font-weight-bold">
                  {{ authStore.user.role || 'Customer' }}
                </v-chip>
              </div>
            </v-card-text>
            <v-card-actions class="justify-center">
               <v-btn color="error" variant="outlined" size="large" @click="handleLogout">
                Log Out
              </v-btn>
            </v-card-actions>
          </v-card>
        </div>

        <div v-else class="d-flex flex-column flex-sm-row justify-center ga-4">
          <v-btn
            color="primary"
            size="x-large"
            to="/login"
            prepend-icon="mdi-login"
            elevation="4"
          >
            Sign In
          </v-btn>
          <v-btn
            color="secondary"
            variant="outlined"
            size="x-large"
            to="/signup"
            prepend-icon="mdi-account-plus"
          >
            Create Account
          </v-btn>
        </div>
      </v-container>
    </v-main>
  </v-app>
</template>
