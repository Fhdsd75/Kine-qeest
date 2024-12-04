import {defineStore} from "pinia";
import {api} from "~/api/index.js";

export const useAuthStore = defineStore("auth", () => {
    const authData = ref(null);
    const authCookie =  useCookie("auth");
    const signin = async (data) => {
        try {
            const res = await api.post("/auth/signin", data);
            authData.value = res.data;
        } catch (e) {
            console.error(e);
        }
    }
    const signup = async (data) => {
        try {
            const res = await api.post("/auth/signup", data);
            authData.value = res.data;
            saveAuthData();
        } catch (e) {
            console.error(e);
        }
    }
    const saveAuthData = () =>{
        if (authCookie.value) {
            authCookie.value = btoa(JSON.stringify(authData.value));
        }
    }
    const readAuthData = () =>{
        if (authCookie.value){
            authData.value = JSON.parse(atob(authCookie.value));
        }
    }
    readAuthData()
    return {
        authData,
        signup,
        signin,
    }
})