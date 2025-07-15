import axios from "axios";
import { defineStore } from "pinia";
import { ref } from "vue";

export const usrTokenStore = defineStore('usrToken', () => {
    const token = ref('')
    const user_id = ref('')
    const isAuthenticated = ref(false)

    function initializeStore() {
        if (localStorage.getItem('token')) {
            token.value = localStorage.getItem('token')
            user_id.value = localStorage.getItem('user_id')
            isAuthenticated.value = true
            axios.defaults.headers.common['Authorization'] = 'Token ' + localStorage.getItem('token')
        } else {
            // token.value = ''
            // user_id.value = ''
            isAuthenticated.value = false
        }
    }
    
    function setToken(tkn, usrID) {
        token.value = tkn
        user_id.value = usrID
        localStorage.setItem('token', tkn)
        localStorage.setItem('user_id', usrID)
        isAuthenticated.value = true
        axios.defaults.headers.common['Authorization'] = 'Token ' + tkn
    }

    function removeToken() {
        token.value = ''
        user_id.value = ''
        localStorage.removeItem('token')
        localStorage.removeItem('user_id')
        isAuthenticated.value = false
        axios.defaults.headers.common['Authorization'] = ''
    }

    return {token, user_id, isAuthenticated, initializeStore, setToken, removeToken}
})