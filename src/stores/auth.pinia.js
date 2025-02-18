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

const useAuth = defineStore('auth', {
    state: () => ({
        captcha: {}
    }),
    actions: {
        getCaptcha(callback = () => {}) {
            const core = useCore()
            core.loadingUrl.add('auth/captcha')
            api({
                    url: 'account/captcha/generate/',
                    method: 'GET'
                })
                .then(({
                    data
                }) => {
                    this.captcha = data
                    callback()
                })
                .catch(() => {
                    message.error('Ошибка при загрузке капчи');
                })
                .finally(() => {
                    core.loadingUrl.delete('auth/captcha')
                })
        },
        postRegis(data, callback) {

            const core = useCore()
            core.loadingUrl.add('auth/regis')
            api({
                    url: 'account/signup/',
                    method: 'POST',
                    data: {
                        ...data,
                        "birth_date": dayjs(data.birth_date).format("YYYY-MM-DD")
                    }
                })
                .then(() => {
                    message.success('Пользователь успешно создан!');
                    callback()
                })
                .catch((error) => {
                    const errors = error.response.data;
                    if (errors.username) {
                        message.error(errors.username[0]);
                    } else if (errors.email) {
                        message.error(errors.email[0]);
                    } else if (errors.captcha) {
                        message.error('Неверный код капча!');
                    } else {
                        message.error('Что-то пошло не так!');
                    }
                })
                .finally(() => {
                    core.loadingUrl.delete('auth/regis')
                })
        },
        postLogin(data, callback) {
            const core = useCore()
            core.loadingUrl.add('auth/login')
            api({
                    url: 'account/signin/',
                    method: 'POST',
                    data
                })
                .then(({
                    data
                }) => {

                    localStorage.setItem('access_token', data.access)
                    callback()
                })
                .catch((error) => {
                    if (error?.response?.status == 401) {

                        message.error('Неверный пароль или логин!');
                    } else if (error?.response?.status == 400) {

                        message.error('Неверный код капча!');
                    } else {
                        message.error('Что-то пошло не так!');
                    }
                })
                .finally(() => {
                    core.loadingUrl.delete('auth/login')
                })
        },
        postLoginVk(data, callback, erorCallback) {
            const core = useCore()
            core.loadingUrl.add('account/auth/check/vk/')
            api({
                    url: 'account/auth/check/vk/',
                    method: 'POST',
                    data
                })
                .then(({
                    data
                }) => {


                    this.postVk({
                        access_token: data.access_token
                    }, callback, erorCallback)

                })
                .catch((error) => {
                    erorCallback()
                    message.error('Что-то пошло не так!');
                })
                .finally(() => {
                    core.loadingUrl.delete('account/auth/check/vk/')
                })
        },
        postVk(data, callback, erorCallback) {
            const core = useCore()
            core.loadingUrl.add('account/auth/vk/')
            api({
                    url: 'account/auth/vk/',
                    method: 'POST',
                    data
                })
                .then(({
                    data
                }) => {

                    localStorage.setItem('access_token', data.access_token)
                    callback()
                })
                .catch((error) => {
                    erorCallback()
                    message.error('Что-то пошло не так!');
                })
                .finally(() => {
                    core.loadingUrl.delete('account/auth/check/vk/')
                })
        },
    }
})


export default useAuth