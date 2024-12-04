<template>
  <div>
    <header>
      <nav class="navbar navbar-expand-lg bg-body-tertiary mb-3">
        <div class="container-fluid">
          <a class="navbar-brand" href="#">KinoTower</a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                  aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav">
              <li class="nav-item">
                <NuxtLink class="nav-link active" to="/">Home</NuxtLink>
              </li>
              </ul>
              <div class="ms-auto d-flex">
                <NuxtLink to="/signin"><button class="btn btn-sm btn-outline" type="button" >Sign In</button></NuxtLink>
                <NuxtLink to="/signup"><button class="btn btn-sm btn-outline" type="button" >Sign Up</button></NuxtLink>
            </div>
          </div>
        </div>
      </nav>
    </header>

    <main class="main my-4 mx-5">
      <NuxtPage />
    </main>

    <footer class="bg-dark text-white p-3 mt-3">
      <div class="container text-center">
        <p class="lead"> &copy;мотя 2024</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">

</script>