<script setup>
import { usrTokenStore } from '@/stores/userToken';
import axios from 'axios';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const username = ref('')
const password = ref('')
const password2 = ref('')
const errors = ref({
    username: '',
    password: '',
    password2: '',
})

const router = useRouter()

const usrToken = usrTokenStore()

function isValidForm() {
    let valid = true
    if (!username.value) {
        errors.value.username = 'Username cannot be blank.'
    } else {
        errors.value.username = ''
    }
    if (!password.value) {
        errors.value.password = 'Password cannot be blank.'
    } else {
        errors.value.password = ''
    }
    if (password.value && password2.value && password.value != password2.value) {
        errors.value.password2 = 'Password mismatch'
    } else {
        errors.value.password2 = ''
    }
    if (errors.value.username || errors.value.password || errors.value.password2) {
        valid = false
    }
    return valid
}

function submitForm() {
    if (isValidForm()) {
        console.log(username.value,' : ' , password.value)
    } else {
        console.log('form is not valid.')
        return
    }
    axios
        .post('/auth/users/', {
            'username': username.value,
            'password': password.value
        })
        .then(res => {
            console.log(res.data)
            router.push('/')
        })
        .catch(err => {
            console.log(err)
            if (err.response.data['username']) {
                errors.value.password2 = err.response.data['username']
            } else {
                errors.value.password2 = ''
            }
        })
}
</script>

<template>
    <div class="container">
        <div class="row py-4 d-flex flex-column align-items-center justify-content-center middle-content">
            <div class="col-md-8">
                <h3 class="text-muted text-monospace">Create your own account</h3>
                <hr>
            </div>
            <div class="col-md-8">
                <form @submit.prevent="submitForm">
                    <div class="form-group my-2">
                        <input class="form-control" type="username" placeholder="Enter username" name="username" v-model="username">
                        <small v-if="errors.username" class="text-danger">{{ errors.username }}</small>
                    </div>
                    <div class="form-group my-2">
                        <input class="form-control" type="password" placeholder="Enter password" name="password" v-model="password">
                        <small v-if="errors.password" class="text-danger">{{ errors.password }}</small>
                    </div>
                    <div class="form-group my-2">
                        <input class="form-control" type="password" placeholder="Repeat password" name="password2" v-model="password2">
                        <small v-if="errors.password2" class="text-danger">{{ errors.password2 }}</small>
                    </div>

                    <div class="form-group my-2 d-grid gap-2">
                        <button type="submit" class="btn btn-primary">Signup to the system</button>
                    </div>
                    
                    <div class="form-group my-2 d-grid gap-2">
                        <p>
                            Already have an account? Please 
                            <RouterLink class="text-decoration-none" to="/">CLICK</RouterLink> to login.
                        </p>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<style lang="css" scoped>
    .middle-content {
        height: 100vh;
    }
</style>
