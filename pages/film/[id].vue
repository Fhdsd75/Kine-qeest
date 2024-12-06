<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import {useAuthStore} from "~/stores/auth";
import axios from "axios";

// ID фильма из маршрута
const route = useRoute();
const filmId = route.params.id;
const authStore = useAuthStore()

// Реактивные данные
const film = ref(null);
const reviews = ref([]);
const newReview = ref(""); // Поле для ввода отзыва
const activeTab = ref("trailer"); // Вкладки: трейлер или детали фильма

const apiBaseUrl = "https://kinotower.polytech.kz/api/v1";

// Форматирование даты для отображения
const formatDate = (date: string) => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(date).toLocaleDateString(undefined, options);
};

// Загрузка данных фильма
const fetchFilmData = async () => {
  try {
    const response = await axios.get(`${apiBaseUrl}/films/${filmId}`);
    film.value = {
      ...response.data,
      ratingAvg: parseFloat(response.data.ratingAvg) || 0,
      genres: response.data.categories.map((cat: any) => cat.name),
      trailerLink: response.data.link_video || "",
    };
  } catch (error) {
    console.error("Ошибка загрузки данных фильма:", error);
  }
};

// Загрузка отзывов
const fetchFilmReviews = async () => {
  try {
    const response = await axios.get(`${apiBaseUrl}/films/${filmId}/reviews`);
    reviews.value = response.data.reviews || [];
  } catch (error) {
    console.error("Ошибка загрузки отзывов:", error);
  }
};

// Отправка отзыва
const submitReview = async () => {
  if (!newReview.value.trim()) {
    alert("Отзыв не может быть пустым!");
    return;
  }

  try {
    const token = userStore.authData?.token;
    const userId = userStore.authData?.id;

    if (!token || !userId) {
      alert("Вы должны войти в систему, чтобы оставить отзыв.");
      return;
    }

    // Вывод токена для отладки
    console.log("Токен:", token);

    // Отправка POST-запроса
    await axios.post(
        `${apiBaseUrl}/users/${userId}/reviews`,
        {
          film_id: filmId,
          message: newReview.value,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
    );

    newReview.value = ""; // Очистка поля ввода
    await fetchFilmReviews(); // Обновление списка отзывов
    alert("Отзыв успешно добавлен!");
  } catch (error) {
    console.error("Ошибка отправки отзыва:", error.response?.data || error.message);
    alert("Не удалось отправить отзыв. Попробуйте позже.");
  }
};

/////////////////////////////////////////////////////////////
import { useAuthStore } from '~/stores/auth';
const userStore = useAuthStore();

// Выводим токен и ID пользователя для проверки
console.log('Токен пользователя:', userStore.authData?.token);
console.log('ID пользователя:', userStore.authData?.id);


// Загрузка данных при монтировании
onMounted(async () => {
  await fetchFilmData();
  await fetchFilmReviews();
});
</script>

<template>
  <div v-if="film" class="layout container mt-4">
    <!-- Вкладки -->
    <div class="content-buttons mb-3">
      <button
          class="btn btn-outline-primary me-2"
          :class="{ active: activeTab === 'trailer' }"
          @click="activeTab = 'trailer'"
      >
        Трейлер
      </button>
      <button
          class="btn btn-outline-primary"
          :class="{ active: activeTab === 'details' }"
          @click="activeTab = 'details'"
      >
        Детали
      </button>
    </div>

    <!-- Трейлер -->
    <div v-if="activeTab === 'trailer'" class="row">
      <div class="col-md-9">
        <div class="video-container border mb-3">
          <iframe :src="film.trailerLink" class="w-100 h-100" frameborder="0" allowfullscreen></iframe>
        </div>
      </div>
      <div class="col-md-3 d-flex flex-column align-items-center">
        <h5>Рейтинг</h5>
        <div class="rating-stars">
          <span v-for="n in 5" :key="n" class="star">
            <i class="bi" :class="n <= Math.round(film.ratingAvg) ? 'bi-star-fill' : 'bi-star'"></i>
          </span>
        </div>
      </div>
    </div>

    <!-- Детали фильма -->
    <div v-if="activeTab === 'details'" class="film-details my-4">
      <h3>{{ film.name }}</h3>
      <ul class="film-info list-unstyled d-flex flex-wrap">
        <li class="me-3">Длительность: {{ film.duration }} мин</li>
        <li class="me-3">Страна: {{ film.country.name }}</li>
        <li class="me-3">Год: {{ film.year_of_issue }}</li>
        <li class="me-3">Возраст: {{ film.age }}+</li>
        <li class="me-3">Жанры: {{ film.genres.join(", ") }}</li>
      </ul>
    </div>

    <!-- Добавление отзыва -->
    <div class="add-review mt-4">
      <h5>Добавить отзыв</h5>
      <textarea
          v-model="newReview"
          class="form-control mb-3"
          placeholder="Ваш отзыв"
          rows="3"
      ></textarea>
      <button @click="submitReview" class="btn btn-primary">Отправить</button>
    </div>

    <!-- Список отзывов -->
    <div class="reviews mt-4">
      <h5>Отзывы</h5>
      <div v-if="reviews.length === 0">Нет отзывов.</div>
      <div v-else>
        <div v-for="review in reviews" :key="review.id" class="review-item border p-3 mb-2">
          <p><strong>{{ review.user?.fio || "Аноним" }}</strong></p>
          <p>{{ review.message }}</p>
          <small class="text-muted">{{ formatDate(review.created_at) }}</small>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="container mt-5">
    <p class="text-center text-muted">Фильм не найден.</p>
  </div>
</template>

<style scoped>
.content-buttons .btn {
  border-radius: 0;
  background-color: #3c3c3c;
  color: #f8f9fa;
  border: none;
}
.content-buttons .btn.active {
  background-color: gold;
  color: #1c1c1c;
}
.video-container {
  height: 400px;
}
.rating-stars .star {
  font-size: 2rem;
  color: gold;
}
.review-item {
  background-color: #3c3c3c;
  color: #f8f9fa;
}
</style>
