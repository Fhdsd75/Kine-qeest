<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useAuthStore } from "~/stores/auth";
import { useRouter } from "#vue-router";
import { useGenderStore } from "~/stores/gender";

const fio = ref("");
const email = ref("");
const password = ref("");
const birthday = ref("");
const gender = ref("");
const genderStore = useGenderStore();
const authStore = useAuthStore();
const router = useRouter();
const errorMessage = ref("");

const register = async () => {
  // Проверяем, что все поля заполнены
  if (!fio.value || !email.value || !password.value || !birthday.value || !gender.value) {
    errorMessage.value = "Please fill in all fields.";
    return;
  }

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
    errorMessage.value = "Registration failed. Please try again.";
    console.error(e);
  }
};

onMounted(async () => {
  try {
    await genderStore.fetchGenders();
  } catch (e) {
    errorMessage.value = "Failed to load genders.";
    console.error(e);
  }
});
</script>

<template>
  <div class="d-flex justify-content-center align-items-center vh-100">
    <div class="card p-4 shadow w-50">
      <form @submit.prevent="register">
        <h1 class="text-center mb-4">Registration</h1>
        <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>
        <div class="mb-3">
          <label for="fio" class="form-label">Full Name</label>
          <input v-model="fio" type="text" class="form-control" id="fio" placeholder="Ivanov Ivan Ivanovich">
        </div>
        <div class="mb-3">
          <label for="email" class="form-label">E-Mail</label>
          <input v-model="email" type="email" class="form-control" id="email" placeholder="mail@example.com">
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
          <select v-model="gender" class="form-select" aria-label="gender" id="gender">
            <option value="" disabled selected>Select Gender</option>
            <option v-for="genderOption in genderStore.genders" :key="genderOption.id" :value="genderOption.id">
              {{ genderOption.name }}
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
body {
  background-color: black;
}

.card {
  border-radius: 10px;
  background-color: orange;
}

.form-label {
  color: white;
}

.form-control,
.form-select {
  background-color: #333;
  color: white;
  border: none;
}

.form-control::placeholder {
  color: #bbb;
}

.btn-warning {
  background-color: gold;
  border: none;
}

.alert-danger {
  color: #fff;
  background-color: #dc3545;
  border: none;
}
</style>
