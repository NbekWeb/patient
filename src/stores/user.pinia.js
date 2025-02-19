import {
    defineStore
} from "pinia";
import {
    api
} from "@/utils/api.js";
import useCore from '@/stores/core.pinia.js'
import {
    message
} from 'ant-design-vue';

import dayjs from 'dayjs';

const useUser = defineStore('user', {
    state: () => ({
        user: {},
        searching: [],
        guest: {}

    }),
    actions: {
        getUser(callback = () => {}) {
            const core = useCore()
            core.loadingUrl.add('get/user')
            api({
                    url: 'account/user/',
                    method: 'GET'
                })
                .then(({
                    data
                }) => {
                    this.user = data
                    callback()
                })
                .catch(() => {})
                .finally(() => {
                    core.loadingUrl.delete('get/user')
                })
        },
        getGuest(id, callback = () => {}) {
            const core = useCore()
            core.loadingUrl.add('account/guest/user/')
            api({
                    url: `account/guest/user/${id}/`,
                    method: 'GET'
                })
                .then(({
                    data
                }) => {
                    this.guest = data
                    callback()
                })
                .catch(() => {})
                .finally(() => {
                    core.loadingUrl.delete('account/guest/user/')
                })
        },

        getChatUsers(callback) {
            const core = useCore()
            core.loadingUrl.add('chat/users/')
            api({
                    url: `chat/users/`,
                    method: 'GET',

                })
                .then(({
                    data
                }) => {
                    callback()
                })
                .catch(() => {

                    message.error('Что-то пошло не так!');
                })
                .finally(() => {
                    core.loadingUrl.delete('chat/users/')
                })
        },
        updateUser(data, callback) {
            const core = useCore()
            core.loadingUrl.add('account/user')
            const formData = new FormData();

            formData.append("first_name", data.first_name);
            formData.append("last_name", data.last_name);
            formData.append("email", data.email);
            formData.append("username", data.username)
            formData.append("birth_date", dayjs(data.birth_date).format("YYYY-MM-DD"));

            if (data.avatar) {
                formData.append("avatar", data.avatar);
            } else if (!data.avatar && !!this.user.avatar){
                formData.append("avatar", '');

            }
                api({
                    url: 'account/user/',
                    method: 'PUT',
                    data: formData,
                    headers: {
                        "Content-Type": "multipart/form-data", 
                    },
                })
                .then(({
                    data
                }) => {

                    this.user = data
                    message.success('Профиль успешно обновлен!');
                    callback()
                })
                .catch(() => {

                    message.error('Что-то пошло не так!');
                })
                .finally(() => {
                    core.loadingUrl.delete('auth/user')
                })
        },
        updatePassword(data) {
            const core = useCore()
            core.loadingUrl.add('account/update-password/')
            api({
                    url: 'account/update-password/',
                    method: 'PATCH',
                    data
                })
                .then(() => {
                    message.success('Пароль успешно изменена!');
                })
                .catch(() => {

                    message.error('Что-то пошло не так new!');
                })
                .finally(() => {
                    core.loadingUrl.delete('account/update-password/')
                })
        },
        updateActive(id, callback) {
            const core = useCore()
            core.loadingUrl.add('users/update-is-active/')
            api({
                    url: `users/update-is-active/${id}/`,
                    method: 'PUT',

                })
                .then(() => {
                    callback()
                    message.success('Видимость профиля изменена!');

                })
                .catch(() => {

                    message.error('Что-то пошло не так new!');
                })
                .finally(() => {
                    core.loadingUrl.delete('users/update-is-active/')
                })
        },
        searchUser(params) {
            const core = useCore()
            core.loadingUrl.add('chat/users/filter/')
            api({
                    url: 'chat/users/filter/',
                    method: 'GET',
                    params
                })
                .then(({
                    data
                }) => {
                    this.searching = data

                })
                .catch(() => {})
                .finally(() => {
                    core.loadingUrl.delete('chat/users/filter/')
                })
        },
    }
})


export default useUser