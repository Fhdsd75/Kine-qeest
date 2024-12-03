import {defineStore} from "pinia";
import {api} from "~/api/index.js";

export const useCategoryStore = defineStore("category", () => {
    const categories = ref ([])
    const fetchCategories = async() => {
        const res = await api.get("/categories");
        categories.value = res.data.categories;
    }

    fetchCategories();

    return {
        categories,
    fetchCategories,
    };
})