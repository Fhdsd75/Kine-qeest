// stores/auth.js
import { defineStore } from "pinia";
import { api } from "~/api/index.js"; // Предположим, что api — это axios или другой клиент
import { ref, computed } from "vue";
import { useCookie } from "#app";

export const useAuthStore = defineStore("auth", () => {
    const authData = ref(null);
    const authCookie = useCookie("auth");

    // Логика для входа (делаем запрос на API и получаем данные пользователя)
    const signin = async (data) => {
        try {
            const res = await api.post("/auth/signin", data);  // Здесь логика авторизации
            authData.value = res.data;
            saveAuthData();
            await fetchUserData(res.data.id); // Получаем данные пользователя после успешной авторизации
        } catch (e) {
            console.error(e);
            throw e; // Пробрасываем ошибку для обработки в компонентах
        }
    };

    // Логика для регистрации
    const signup = async (data) => {
        try {
            const res = await api.post("/auth/signup", data);  // Здесь логика регистрации
            authData.value = res.data;
            saveAuthData();
        } catch (e) {
            console.error(e);
            throw e;
        }
    };

    // Запрос данных пользователя по ID
// stores/auth.js
    const fetchUserData = async (userId) => {
        try {
            const response = await api.get(`/users/${userId}`); // Запрос к API с авторизацией
            console.log("User data:", response.data);
            authData.value = response.data; // Обновляем данные профиля
            saveAuthData();
        } catch (error) {
            if (error.response) {
                console.error("Failed to fetch user data:", error.response.data);
            } else {
                console.error("Network or other error:", error);
            }
        }
    };







    const signout = () => {
        authData.value = null;
        authCookie.value = null; // Удаляем cookie
    };

    const isAuthenticated = computed(() => !!authData.value);

    // Сохранение данных в cookie
    const saveAuthData = () => {
        if (authData.value) {
            authCookie.value = btoa(JSON.stringify(authData.value));  // Кодируем и сохраняем
        }
    };

    // Чтение данных из cookie
    const readAuthData = () => {
        if (authCookie.value) {
            authData.value = JSON.parse(atob(authCookie.value));  // Декодируем и загружаем
        }
    };

    readAuthData();

    return {
        authData,
        isAuthenticated,
        signin,
        signup,
        signout,
        fetchUserData,  // Оставляем функцию fetchUserData доступной для компонентов
    };
});
