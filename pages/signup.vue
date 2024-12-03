<script setup lang="ts">

</script>

<template>
  <div class="row">

    <div class="col w-75">
      <form method="">
        <h1>Registration</h1>
        <div class="mb-3">
          <label for="fio" class="form-label">FIO</label>
          <input type="text" class="form-control" id="fio" placeholder="Ivanov Ivan Ivanovich">
        </div>
        <div class="mb-3">
          <label for="email" class="form-label">E-Mail</label>
          <input type="email" class="form-control" id="email" placeholder="mail@email.com">
        </div>
        <div class="mb-3">
          <label for="password" class="form-label">Password</label>
          <input type="password" class="form-control" id="password" placeholder="">
        </div>
        <div class="mb-3">
          <label for="birthday" class="form-label">Birthday</label>
          <input type="date" class="form-control" id="birthday">
        </div>
        <div class="mb-3">
          <label for="gender">Gender</label>
          <select class="form-select" aria-label="gender">
            <option selected>Gender</option>
            <option value="1">Male</option>
            <option value="2">Female</option>
            <option value="3">Other</option>
          </select>
        </div>
        <div>
          <button type="submit" class="btn btn-primary">Sign Up</button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>

</style>