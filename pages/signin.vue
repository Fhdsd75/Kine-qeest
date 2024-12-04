<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore } from "~/stores/auth";
import { useRouter } from "#vue-router";

const email = ref("");
const password = ref("");

const authStore = useAuthStore();
const router = useRouter();
const login = async () => {
  try {
    await authStore.signin(
        {
          email: email.value,
          password: password.value,
        }
    );
    router.push("/");
  } catch (e) {
    console.error(e);
  }
};
</script>

<template>
  <div class="d-flex justify-content-center align-items-center vh-100">
    <div class="card p-4 shadow w-50">
      <form @submit.prevent="login">
        <h1 class="text-center mb-4">Login</h1>
        <div class="mb-3">
          <label for="email" class="form-label">E-Mail</label>
          <input v-model="email" type="email" class="form-control" id="email" placeholder="mail@email.com">
        </div>
        <div class="mb-3">
          <label for="password" class="form-label">Password</label>
          <input v-model="password" type="password" class="form-control" id="password" placeholder="">
        </div>
        <div>
          <button type="submit" class="btn btn-primary w-100">Sign In</button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
/* Optional: Add a background color or style */
body {
  background-color: #f8f9fa; /* Light grey background */
}
</style>
