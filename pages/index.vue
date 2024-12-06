<template>
  <div class="row mt-2">
    <!-- Фильтры -->
    <div class="col-md-4">
      <select v-model="category" @change="filter" class="form-select" aria-label="Select genre">
        <option :value="null" selected>Select genre</option>
        <option v-for="cat in categoryStore.categories" :key="cat.id" :value="cat.id">
          {{ cat.name }} {{ cat.filmCount }}
        </option>
      </select>
    </div>
    <div class="col-md-4">
      <select v-model="country" @change="filter" class="form-select" aria-label="Select country">
        <option :value="null" selected>All Countries</option>
        <option v-for="c in countryStore.countries" :key="c.id" :value="c.id">
          {{ c.name }}
        </option>
      </select>
    </div>
    <div class="col-md-2">
      <select v-model="sort" @change="filter" class="form-select" aria-label="Sort by">
        <option value="name">Name</option>
        <option value="year">Year</option>
        <option value="rating">Rating</option>
      </select>
    </div>
    <div class="col-md-2">
      <button type="button" class="btn btn-outline-warning" @click="reset">Reset</button>
    </div>
  </div>

  <!-- Список фильмов -->
  <div v-if="!filmStore.isLoading" class="row row-cols-1 row-cols-md-3 g-4 mt-2">
    <div class="col" v-for="film in filmStore.films" :key="film.id">
      <div class="card h-100">
        <!-- Раздел изображения -->
        <img
            :src="film.link_img || placeholderImage"
            @error="onImageError($event)"
            class="card-img-top"
            :alt="`Image for ${film.name}`"
        />
        <div class="card-body">
          <h5 class="card-title">{{ film.name }}</h5>
          <p class="card-text">Rating: {{ Number(film.ratingAvg).toFixed(1) }}</p>
          <p class="card-text">Duration: {{ film.duration }} min.</p>
          <p class="card-text">
            Categories:
            <span v-for="(category, index) in film.categories" :key="category.id">
              {{ category.name }}<span v-if="index < film.categories.length - 1">, </span>
            </span>
          </p>
        </div>
        <!-- Кнопка "Смотреть" -->
        <router-link :to="`/film/${film.id}`" class="btn btn-warning">Смотреть</router-link>
      </div>
    </div>
  </div>

  <!-- Спиннер загрузки -->
  <div v-else class="d-flex justify-content-center mt-4">
    <div class="spinner-border" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>

  <!-- Пагинация -->
  <nav class="mt-4 d-flex justify-content-center" aria-label="Page navigation example">
    <ul class="pagination">
      <li class="page-item" :class="{ disabled: filmStore.currentPage === 1 }">
        <a class="page-link" @click.prevent="goto(filmStore.currentPage - 1)" aria-label="Previous">
          <span aria-hidden="true">&laquo;</span>
        </a>
      </li>
      <li
          v-for="num in filmStore.countPage"
          :key="num"
          :class="['page-item', { active: filmStore.currentPage === num }]"
          @click.prevent="goto(num)"
      >
        <a class="page-link" href="#">{{ num }}</a>
      </li>
      <li class="page-item" :class="{ disabled: filmStore.currentPage === filmStore.countPage }">
        <a class="page-link" @click.prevent="goto(filmStore.currentPage + 1)" aria-label="Next">
          <span aria-hidden="true">&raquo;</span>
        </a>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useFilmStore } from '~/stores/film';
import { useCategoryStore } from '~/stores/category';
import { useCountryStore } from '~/stores/country';

// Инициализация хранилищ
const categoryStore = useCategoryStore();
const filmStore = useFilmStore();
const countryStore = useCountryStore();

// Реактивные переменные для фильтров
const category = ref(null);
const country = ref(null);
const sort = ref('name');

// Путь к placeholder изображению
const placeholderImage = 'https://steamuserimages-a.akamaihd.net/ugc/2065509824831692471/0F26586B8158B3411409A334D8485B0E9742DDD3/?imw=512&amp;imh=287&amp;ima=fit&amp;impolicy=Letterbox&amp;imcolor=%23000000&amp;letterbox=true'; // Замените на путь к вашему placeholder

// Функция фильтрации
const filter = () => {
  filmStore.addCategoryToParams(category.value);
  filmStore.addCountryToParams(country.value);
  filmStore.addSortToParams(sort.value);
  filmStore.currentPage = 1;
  filmStore.fetchFilms();
};

// Функция сброса фильтров
const reset = () => {
  category.value = null;
  country.value = null;
  sort.value = 'name';
  filter();
};

// Функция перехода по страницам
const goto = (page: number) => {
  page = page < 1 ? 1 : page;
  page = page > filmStore.countPage ? filmStore.countPage : page;
  if (page <= filmStore.countPage && page > 0) {
    filmStore.currentPage = page;
    filmStore.fetchFilms();
  }
};


const onImageError = (event: Event) => {
  const target = event.target as HTMLImageElement;
  target.src = placeholderImage;
};


filter();

watch(
    () => [category.value, country.value, sort.value],
    () => {
      filmStore.setPage(1);
      filter();
    }
);
const routes = [
  {
    path: '/film/:id',
    name: 'FilmDetails',
    component: () => import('~/pages/film/[id].vue'),
  },
];
</script>

<style scoped>
.card-img-top {
  height: 500px;
  object-fit: cover;
}

.card {
  background-color: orange;
}

.pagination .page-item.disabled .page-link {
  pointer-events: none;
  opacity: 0.5;
}
</style>
