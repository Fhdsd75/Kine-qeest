<template>
  <div class="profile-container mt-5">
    <main class="profile-details" v-if="authData">
      <h1>Страница данных профиля</h1>
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
        <!-- Вкладка профиля -->
        <div
            class="tab-pane fade show active"
            id="profile"
            role="tabpanel"
            aria-labelledby="profile-tab"
        >
          <!-- Если не в режиме редактирования, показываем статичные данные -->
          <div v-if="!isEditMode">
            <ul class="list-unstyled">
              <li><strong>Name:</strong> {{ userData.fio }}</li>
              <li><strong>Email:</strong> {{ userData.email }}</li>
              <li><strong>Birthday:</strong> {{ userData.birthday }}</li>
              <li><strong>Gender:</strong> {{ userData.gender.name }}</li>
            </ul>
            <div class="d-flex gap-2">
              <button @click="isEditMode = true" class="btn btn-primary">Edit</button>
              <button @click="deleteAccount" class="btn btn-danger">Delete Account</button>
            </div>
          </div>

          <!-- Если в режиме редактирования, показываем форму -->
          <div v-else>
            <form @submit.prevent="updateUser" class="d-flex flex-column gap-3">
              <div class="mb-3">
                <label for="fio" class="form-label">FIO</label>
                <input type="text" id="fio" v-model="userData.fio" class="form-control" />
              </div>

              <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input type="email" id="email" v-model="userData.email" class="form-control" />
              </div>

              <div class="mb-3">
                <label for="birthday" class="form-label">Birthday</label>
                <input type="date" id="birthday" v-model="userData.birthday" class="form-control" />
              </div>

              <div class="mb-3">
                <label for="gender" class="form-label">Gender</label>
                <select id="gender" v-model="userData.gender.id" class="form-select">
                  <option value="1">Male</option>
                  <option value="2">Female</option>
                </select>
              </div>

              <div class="d-flex gap-2">
                <button type="submit" class="btn btn-primary">Сохранить изменения</button>
                <button type="button" @click="isEditMode = false" class="btn btn-secondary">Отмена</button>
              </div>
            </form>
          </div>
        </div>

        <!-- Вкладка отзывов -->
        <div
            class="tab-pane fade"
            id="reviews"
            role="tabpanel"
            aria-labelledby="reviews-tab"
        >
          <div v-if="userReviews.length === 0">
            <p>No reviews available.</p>
          </div>
          <div v-else>
            <ul class="list-group">
              <li
                  class="list-group-item d-flex justify-content-between align-items-center"
                  v-for="review in userReviews"
                  :key="review.id"
              >
                <div>
                  <strong>Film:</strong> {{ review.film.name }}<br>
                  <strong>Review:</strong> {{ review.message }}<br>
                  <small class="text-muted">{{ formatDate(review.created_at) }}</small>
                </div>
                <button class="btn btn-sm btn-danger" @click="deleteReview(review.id)">Delete</button>
              </li>
            </ul>
          </div>
        </div>

        <!-- Вкладка оценок -->
        <div
            class="tab-pane fade"
            id="scores"
            role="tabpanel"
            aria-labelledby="scores-tab"
        >
          <div v-if="ratings.length === 0">
            <p>No scores available.</p>
          </div>
          <div v-else>
            <ul class="list-group">
              <li
                  class="list-group-item d-flex justify-content-between align-items-center"
                  v-for="rating in ratings"
                  :key="rating.id"
              >
                <div>
                  <strong>Film:</strong> {{ rating.film.name }}<br>
                  <strong>Score:</strong> {{ rating.score }}<br>
                  <small class="text-muted">{{ formatDate(rating.created_at) }}</small>
                </div>
                <button class="btn btn-sm btn-danger" @click="deleteRating(rating.id)">Delete</button>
              </li>
            </ul>
          </div>
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
  fio: '',
  email: '',
  birthday: '',
  gender: { name: '', id: 1 }
});

const reviewCount = ref(0);
const ratingCount = ref(0);
const ratings = ref([]);
const userReviews = ref([]);
const isEditMode = ref(false); // Режим редактирования

const authData = computed(() => authStore.authData);

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

const fetchUserRatings = async () => {
  const token = authStore.authData?.token;
  const userId = authStore.authData?.id;

  if (!token || !userId) return;

  try {
    const res = await api.get(`/users/${userId}/ratings`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    ratings.value = res.data.ratings || [];
  } catch (error) {
    console.error("Ошибка получения оценок пользователя:", error);
  }
};

const deleteRating = async (ratingId: number) => {
  const token = authStore.authData?.token;
  const userId = authStore.authData?.id;

  if (!token || !userId) return;

  try {
    await api.delete(`/users/${userId}/ratings/${ratingId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    ratings.value = ratings.value.filter((r: any) => r.id !== ratingId);
  } catch (error) {
    console.error("Ошибка при удалении оценки:", error);
    alert("Не удалось удалить оценку. Попробуйте позже.");
  }
};

const fetchUserReviews = async () => {
  const token = authStore.authData?.token;
  const userId = authStore.authData?.id;

  if (!token || !userId) return;

  try {
    const res = await api.get(`/users/${userId}/reviews`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    userReviews.value = res.data.reviews || [];
  } catch (error) {
    console.error("Ошибка получения отзывов пользователя:", error);
  }
};

const deleteReview = async (reviewId: number) => {
  const token = authStore.authData?.token;
  const userId = authStore.authData?.id;

  if (!token || !userId) return;

  try {
    await api.delete(`/users/${userId}/reviews/${reviewId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    userReviews.value = userReviews.value.filter((r: any) => r.id !== reviewId);
  } catch (error) {
    console.error("Ошибка при удалении отзыва:", error);
    alert("Не удалось удалить отзыв. Попробуйте позже.");
  }
};

// Обновление данных пользователя через PUT /api/v1/users
const updateUser = async () => {
  const token = authStore.authData?.token;
  if (!token) return;

  try {
    const requestBody = {
      fio: userData.value.fio,
      email: userData.value.email,
      birthday: userData.value.birthday,
      gender_id: userData.value.gender.id
    };

    const res = await api.put(`/users`, requestBody, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.status === 200 && res.data.status === "success") {
      alert("Данные успешно обновлены!");
      // Обновляем данные профиля
      fetchUserData();
      // Выходим из режима редактирования
      isEditMode.value = false;
    }
  } catch (error) {
    console.error("Ошибка при обновлении данных пользователя:", error);
    alert("Не удалось обновить данные. Попробуйте позже.");
  }
};

// "Удаление" аккаунта. Если эндпоинт остается тем же, возможно здесь будет другая логика.
// Предположим, если на бэкенде удаление пользователя тоже через PUT /users с deleted: true
const deleteAccount = async () => {
  const token = authStore.authData?.token;
  if (!token) return;

  try {
    const res = await api.put(`/users`, { deleted: true }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.status === 200 && res.data.status === "success") {
      authStore.logout();
      router.push('/login');
    }
  } catch (error) {
    console.error("Ошибка при изменении статуса аккаунта:", error);
    alert("Не удалось удалить аккаунт. Попробуйте позже.");
  }
};

const navigateTo = (path: string) => {
  router.push(path);
};

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

onMounted(() => {
  if (authStore.isAuthenticated) {
    fetchUserData();
  }

  const tabs = document.getElementById('userTabs');
  if (tabs) {
    tabs.addEventListener('shown.bs.tab', (event: any) => {
      const newTabId = event.target.getAttribute('id');
      if (newTabId === 'scores-tab') {
        fetchUserRatings();
      }
      if (newTabId === 'reviews-tab') {
        fetchUserReviews();
      }
    });
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
