<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore } from "~/stores/auth";
import { useRouter } from "#vue-router";
import { useGenderStore } from "~/stores/gender";

const fio = ref("");
const email = ref("");
const password = ref("");
const birthday = ref("");
const gender = ref(0);
const genderStore = useGenderStore();
const authStore = useAuthStore();
const router = useRouter();

const register = async () => {
  try {
    await authStore.signup({
      fio: fio.value,
      email: email.value,
      password: password.value,
      birthday: birthday.value,
      gender_id: gender.value,
    });
    router.push("/");
  } catch (e) {
    console.log(e);
  }
};
</script>

<template>
  <div class="d-flex justify-content-center align-items-center vh-100">
    <div class="card p-4 shadow w-50">
      <form @submit.prevent="register">
        <h1 class="text-center mb-4">Registration</h1>
        <div class="mb-3">
          <label for="fio" class="form-label">FIO</label>
          <input v-model="fio" type="text" class="form-control" id="fio" placeholder="Ivanov Ivan Ivanovich">
        </div>
        <div class="mb-3">
          <label for="email" class="form-label">E-Mail</label>
          <input v-model="email" type="email" class="form-control" id="email" placeholder="mail@email.com">
        </div>
        <div class="mb-3">
          <label for="password" class="form-label">Password</label>
          <input v-model="password" type="password" class="form-control" id="password" placeholder="">
        </div>
        <div class="mb-3">
          <label for="birthday" class="form-label">Birthday</label>
          <input v-model="birthday" type="date" class="form-control" id="birthday">
        </div>
        <div class="mb-3">
          <label for="gender">Gender</label>
          <select v-model="gender" class="form-select" aria-label="gender">
            <option :value="null" selected>Gender</option>
            <option v-for="gender in genderStore.genders" :key="gender.id" :value="gender.id">
              {{ gender.name }}
            </option>
          </select>
        </div>
        <div>
          <button type="submit" class="btn btn-warning w-100">Sign Up</button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
/* Centering styles */
.d-flex {
  background-color: black; /* Optional: light background for the page */
}

.card {
  border-radius: 10px; /* Optional: rounded corners for the card */
  background-color: orange;
}
</style>
