<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore } from "~/stores/auth";
import { useRouter } from "#vue-router";

const email = ref("");
const password = ref("");

const authStore = useAuthStore();
const router = useRouter();
const errorMessage = ref("");

const login = async () => {
  try {
    await authStore.signin({
      email: email.value,
      password: password.value,
    });
    router.push("/");
  } catch (e) {
    errorMessage.value = "Invalid email or password.";
  }
};
</script>

<template>
  <div class="d-flex justify-content-center align-items-center vh-100">
    <div class="card p-4 shadow w-50">
      <form @submit.prevent="login">
        <h1 class="text-center mb-4">Login</h1>
        <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>
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
body {
  background-color: orange;
}
.card {
  border-radius: 10px;
  background-color: orange;
}
</style>
