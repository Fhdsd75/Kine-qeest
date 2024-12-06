<template>
  <div class="profile-container mt-5">
    <main class="profile-details" v-if="authData">
      <h1>Страница данных профиля</h1>
      <div class="user-info">
        <p><strong>FIO:</strong> {{ authData.fio || 'User Name' }}</p>
        <p><strong>Email:</strong> {{ userData.email || 'example@mail.com' }}</p>
        <p><strong>Birthday:</strong> {{ userData.birthday || '2000-01-01' }}</p>
        <p><strong>Gender:</strong> {{ userData.gender.name || 'Not Specified' }}</p>
        <p><strong>Reviews Count:</strong> {{ reviewCount || 0 }}</p>
        <p><strong>Ratings Count:</strong> {{ ratingCount || 0 }}</p>
      </div>
      <ul class="nav nav-tabs mt-4" id="userTabs" role="tablist">
        <li class="nav-item" role="presentation">
          <button
              class="nav-link active"
              id="profile-tab"
              data-bs-toggle="tab"
              data-bs-target="#profile"
              type="button"
              role="tab"
              aria-controls="profile"
              aria-selected="true"
          >
            My Profile
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button
              class="nav-link"
              id="reviews-tab"
              data-bs-toggle="tab"
              data-bs-target="#reviews"
              type="button"
              role="tab"
              aria-controls="reviews"
              aria-selected="false"
          >
            My Reviews
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button
              class="nav-link"
              id="scores-tab"
              data-bs-toggle="tab"
              data-bs-target="#scores"
              type="button"
              role="tab"
              aria-controls="scores"
              aria-selected="false"
          >
            My Scores
          </button>
        </li>
      </ul>

      <div class="tab-content mt-3" id="userTabsContent">
        <div
            class="tab-pane fade show active"
            id="profile"
            role="tabpanel"
            aria-labelledby="profile-tab"
        >
          <ul class="list-unstyled">
            <li><strong>Email:</strong> {{ userData.email }}</li>
            <li><strong>Birthday:</strong> {{ userData.birthday }}</li>
            <li><strong>Gender:</strong> {{ userData.gender.name }}</li>
          </ul>
          <div class="d-flex gap-2">
            <button @click="navigateTo('/edit')" class="btn btn-primary">Edit</button>
            <button class="btn btn-danger">Delete Account</button>
          </div>
        </div>

        <div
            class="tab-pane fade"
            id="reviews"
            role="tabpanel"
            aria-labelledby="reviews-tab"
        >
          <p>Hello.</p>
        </div>

        <div
            class="tab-pane fade"
            id="scores"
            role="tabpanel"
            aria-labelledby="scores-tab"
        >
          <p>No scores available.</p>
        </div>
      </div>
    </main>
    <p v-else>Loading...</p>
  </div>
</template>


<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "~/stores/auth";
import { api } from "~/api";

const authStore = useAuthStore();
const router = useRouter();

const userData = ref({
  email: '',
  birthday: '',
  gender: { name: '' }
});

const reviewCount = ref(0);
const ratingCount = ref(0);

// computed property for authData
const authData = computed(() => authStore.authData);

// Fetch user data
const fetchUserData = async () => {
  try {
    const res = await api.get(`/users/${authStore.authData?.id}`, {
      headers: {
        Authorization: `Bearer ${authStore.authData?.token}`,
      }
    });
    userData.value = res.data;
    reviewCount.value = res.data.reviewsCount || 0;
    ratingCount.value = res.data.scoresCount || 0;
  } catch (error) {
    console.error("Ошибка получения данных пользователя:", error);
  }
};

// Handle navigation
const navigateTo = (path: string) => {
  router.push(path);
};

onMounted(() => {
  if (authStore.isAuthenticated) {
    fetchUserData();
  }
});
</script>


<style scoped>
.profile-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.profile-details {
  margin-top: 20px;
}

.user-info p {
  font-size: 1rem;
  margin: 5px 0;
}

.btn-edit, .btn-primary, .btn-danger {
  margin-top: 10px;
  cursor: pointer;
}

.nav-tabs .nav-link {
  cursor: pointer;
}
</style>
