<script setup lang="ts">
import {useAuthStore} from "~/stores/auth";
import {useRouter} from "#vue-router";

const email = ref("");
const password = ref("");

const authStore = useAuthStore();
const router = useRouter()
const login = async () => {
  try {
    await authStore.signin({
          email: email.value,
          password: password.value,
        },
    );
    router.push("/");
  } catch (e){
    console.error(e);
  }

}


</script>

<template>
  <div class="row">

    <div class="col w-75">
      <form action="" @submit.prevent="login">
        <h1>Login</h1>
        <div class="mb-3">
          <label for="email" class="form-label">E-Mail</label>
          <input v-model="email" type="email" class="form-control" id="email" placeholder="mail@email.com">
        </div>
        <div class="mb-3">
          <label for="password" class="form-label">Password</label>
          <input v-model="password" type="password" class="form-control" id="password" placeholder="">
        </div>
        <div>
          <button type="submit" class="btn btn-primary">Sign In</button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>

</style>