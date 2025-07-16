<script setup>
import router from '@/router';
import { usrTokenStore } from '@/stores/userToken';
import axios from 'axios';
import { Tooltip } from 'bootstrap';
import { onMounted, ref } from 'vue';
// import { useRouter } from 'vue-router';

const todos = ref([])
const vTodo = ref('')
const editing = ref({
    item: {},
    // completed: false,
    status: false
})
const usrToken = usrTokenStore()
// const router = useRouter()

function removeItem(id) {
    axios
        .delete(`/retrive-update-destroy/${id}/`)
        .then(res => {
            let idx = todos.value.findIndex((todo) => todo.id == id)
            if (idx) {
                todos.value.splice(idx, 1)
            }
        })
        .catch(err => {
            console.log(err)
        })
}

function edit(item) {
    editing.value.item = item
    editing.value.item.completed = false
    editing.value.status = true
}

function addTodo() {
    axios
        .post('/list-create-todo/', {
            'title': vTodo.value,
            'user': usrToken.user_id
        })
        .then(res => {
            console.log(res.data)
            todos.value.unshift(res.data)
            vTodo.value = ''
            // router.push('/todo')
        })
        .catch(err => {
            console.log(err)
        })
}

function update() {
    axios
        // .patch(`/retrive-update-destroy/${editing.value.item.id}/`, {
        //     'title': editing.value.item.title,
        //     'finished': editing.value.item.finished
        // })
        .patch(`/retrive-update-destroy/${editing.value.item.id}/`, editing.value.item)
        .then(res => {
            console.log(res.data)
            editing.value.status = false
            vTodo.value = ''
            // router.push('/todo')
        })
        .catch(err => {
            console.log(err)
        })
}

function changeStatus(item) {
    editing.value.item = item
    editing.value.item.completed = !item.completed
    update()
}

function logout() {
    axios
        .post('/auth/token/logout/')
        .then(res => {
            usrToken.removeToken()
            router.push('/')
        })
        .catch(err => {
            console.log(err)
        })
}

onMounted(() => {
    axios
        .get('/list-create-todo/')
        .then(res => {
            console.log(res.data)
            todos.value = res.data
        })
        .catch(err => {
            console.log(err)
        })
})
</script>

<template>
  <div class="todo">
    <div class="container">
        <div class="row py-4 d-flex flex-column align-items-center justify-content-center middle-content">
            <div class="col-md-12 my-4">
                <form v-if="!editing.status" @submit.prevent="addTodo" class="d-flex flex-row" action="" method="post">
                    <input class="form-control" type="text" name="title" placeholder="What do you wanna do today?" v-model="vTodo" required>
                    <button class="btn ms-2 btn-primary">ADD</button>
                </form>
                <form v-else @submit.prevent="update" class="d-flex flex-row" action="" method="post">
                    <input class="form-control" type="text" name="title" placeholder="What do you wanna do today?" v-model="editing.item.title" required>
                    <button class="btn ms-2 btn-primary">UPDATE</button>
                </form>
            </div>

            <div v-if="todos.length" class="col-md-12">
                <table class="table">
                    <thead>
                        <tr>
                        <th scope="col">TITLE</th>
                        <th scope="col">COMPLETED</th>
                        <th scope="col">EDIT</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="todo in todos" :key="todo.id">
                            <!-- <td>{{ todo.title }}</td> -->
                            <td :class="{done: todo.completed}">{{ todo.title }}</td>
                            <td>
                                <div class="form-check" v-if="todo.completed">
                                    <input class="form-check-input" type="checkbox" checked :id="todo.id" @change="changeStatus(todo)">
                                </div>
                                <div v-else class="form-check">
                                    <input class="form-check-input" type="checkbox" :id="todo.id" @change="changeStatus(todo)">
                                </div>
                            </td>
                            <td>
                                <svg @click="edit(todo)" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                                    <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                                    <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                                </svg>
                                <svg @click="removeItem(todo.id)" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                                    <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
                                </svg>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="col-md-12">
                <div class="form-group my-2 d-grid gap-2">
                    <button @click="logout" type="submit" class="btn btn-secondary">Logout yout TODO account</button>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

<style scoped>
    svg {
        cursor: pointer !important;
    }

    .middle-content {
        height: 100vh;
    }

    .done {
        text-decoration: line-through;
    }
</style>