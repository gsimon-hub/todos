<script setup>
import { usrTokenStore } from '@/stores/userToken';
import axios from 'axios';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const username = ref('')
const password = ref('')
const errors = ref({
    username: '',
    password: '',
    wrong_credentials: '',
})

const usrToken = usrTokenStore()
const router = useRouter()

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
    if (errors.value.username || errors.value.password) {
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
        .post('/login/', {
            'username': username.value,
            'password': password.value
        })
        .then(res => {
            console.log(res.data)
            if (errors.value.wrong_credentials) {
                errors.value.wrong_credentials = ''
            }
            usrToken.setToken(res.data['token'], res.data['user_id'])
            // axios.defaults.headers.common['Authorization'] = 'Token ' + res.data['token']
            router.push('/todo')
        })
        .catch(err => {
            console.log(err.response.data.non_field_errors)
            if(err.response.data.non_field_errors) {
                errors.value.wrong_credentials = err.response.data.non_field_errors.join('')
            } else {
                errors.value.wrong_credentials = ''
            }
        })
}
</script>

<template>
    <div class="container">
        <div class="row py-4 d-flex flex-column align-items-center justify-content-center middle-content">
            <div class="col-md-8">
                <h3 class="text-muted text-monospace">Login to your account</h3>
                <hr>
            </div>
            <div class="col-md-8">
                <form @submit.prevent="submitForm">
                    <div v-if="errors.wrong_credentials" class="form-group my-2">
                        <small class="text-danger">{{ errors.wrong_credentials }}</small>
                    </div>
                    <div class="form-group my-2">
                        <input class="form-control" type="username" placeholder="Enter username" name="username" v-model="username">
                        <small v-if="errors.username" class="text-danger">{{ errors.username }}</small>
                    </div>
                    <div class="form-group my-2">
                        <input class="form-control" type="password" placeholder="Enter password" name="password" v-model="password">
                        <small v-if="errors.password" class="text-danger">{{ errors.password }}</small>
                    </div>

                    <div class="form-group my-2 d-grid gap-2">
                        <button type="submit" class="btn btn-primary">Login to the system</button>
                    </div>

                    <div class="form-group my-2 d-grid gap-2">
                        <p>
                            Don't have an account? Please 
                            <RouterLink class="text-decoration-none" to="/signup">CLICK</RouterLink> to create one.
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
