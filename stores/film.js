import {defineStore} from "pinia";
import {api} from "~/api/index.js";

export const useFilmStore = defineStore('film', () => {
    const films = ref([]);
    const isLoading = ref(false);
    const params = ref({
        page: 1,
        size: 10,
        sortBy: 'name',
        sortDir: 'asc',
        category: null,
        country: null,
    });

    const addCategoryToParams = (category) => {
        params.value.category = category;
    }
    const addCountryToParams = (country) => {
        params.value.country = country;
    }
    const addSortToParams = (sort) => {
        params.value.sortBy = sort;
    }

    const fetchFilms = async () => {
        isLoading.value = true;
        params.value.page = currentPage.value;
        const res = await api.get('/films',
            {params: params.value
            });
        films.value = res.data.films;
        isLoading.value = false;
        totalFilms.value = res.data.total;
    }
    const currentPage = ref(1)
    const totalFilms = ref(0)
    const countPage = computed(() => {
        return Math.ceil(totalFilms.value / params.value.size);
    })
    watch(currentPage, (value) => {
        params.value.page = value;

    })

    fetchFilms();
    return {
        films,
        isLoading,
        addCategoryToParams,
        addCountryToParams,
        addSortToParams,
        fetchFilms,
        countPage,
        currentPage,
        totalFilms,
    }
});