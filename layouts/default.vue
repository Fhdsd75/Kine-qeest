<template>
  <div class="layout">
    <header class="fixed-header">
      <nav class="navbar navbar-expand-lg">
        <div class="container-fluid">
          <a class="navbar-brand" href="#">KinoQesst</a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                  aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav">
              <li class="nav-item">
                <NuxtLink class="nav-link" to="/">Home</NuxtLink>
              </li>
            </ul>
            <div class="ms-auto d-flex">
              <NuxtLink to="/signin">
                <button class="btn btn-sm btn-outline-light mx-2" type="button">Sign In</button>
              </NuxtLink>
              <NuxtLink to="/signup">
                <button class="btn btn-sm btn-outline-light" type="button">Sign Up</button>
              </NuxtLink>
            </div>
          </div>
        </div>
      </nav>
    </header>

    <main class="main-content">
      <NuxtPage />
    </main>

    <footer class="footer">
      <div class="container text-center">
        <p class="lead"> &copy; KinoQesst 2024</p>
      </div>
    </footer>
  </div>
</template>

<style>
/* GLOBAL STYLES */

/* Global black background */
body {
  background-color: black !important;
  color: white !important; /* For contrast */
  margin: 0;
}

/* Fixed header styles */
.fixed-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  background-color: grey !important; /* Solid grey background */
  border-bottom: 1px solid #444;
}

/* Navbar brand and links */
.navbar .navbar-brand {
  color: gold !important; /* Gold color for logo */
  font-weight: bold;
}

.navbar .nav-link {
  color: gold !important; /* Gold for links */
  font-weight: bold;
  text-transform: uppercase;
}

.navbar .nav-link:hover {
  color: white !important; /* White on hover */
}

/* Buttons */
.btn-outline-light {
  color: white !important; /* White text */
  border-color: gold !important; /* Gold border */
}

.btn-outline-light:hover {
  background-color: gold !important; /* Gold background on hover */
  color: black !important; /* Black text on hover */
}

/* Main content styles */
.main-content {
  flex: 1;
  margin-top: 4.5rem; /* Space for fixed header */
}

/* Footer styles */
.footer {
  margin-top: auto;
  background-color: grey; /* Matches body background */
  color: white; /* White text for footer */
  padding: 1rem;
}
</style>
