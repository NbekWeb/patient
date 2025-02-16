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

const useInterest = defineStore('interest', {
    state: () => ({
        interest: [],
        interestOne: {}
    }),
    actions: {
        getInterest() {
            const core = useCore()
            core.loadingUrl.add('users/interests/')
            api({
                    url: 'users/interests/',
                    method: 'GET'
                })
                .then(({
                    data
                }) => {
                    this.interest = data


                })
                .catch(() => {})
                .finally(() => {
                    core.loadingUrl.delete('users/interests/')
                })
        },
        addInterest(data, callback) {
            const core = useCore()
            core.loadingUrl.add('users/interests/')
            api({
                    url: 'users/interests/',
                    method: 'POST',
                    data
                })
                .then(() => {

                    message.success('Интерес добавлен!');

                    callback()
                })
                .catch(() => {

                    message.error('Что-то пошло не так!');
                })
                .finally(() => {
                    core.loadingUrl.delete('users/interests/')
                })
        },
        updateInterest(data, id, callback) {
            const core = useCore()
            core.loadingUrl.add('users/interests/')
            api({
                    url: `users/interests/${id}/`,
                    method: 'PUT',
                    data
                })
                .then(() => {
                    callback()
                    message.success('Интерес изменён!');

                })
                .catch(() => {

                    message.error('Что-то пошло не так!');
                })
                .finally(() => {
                    core.loadingUrl.delete('users/interests/')
                })
        },
        getInterestId(id, callback) {
            const core = useCore()
            core.loadingUrl.add('users/interests/')
            api({
                    url: `users/interests/${id}/`,
                    method: 'GET',

                })
                .then(({
                    data
                }) => {
                    this.interestOne = data
                    callback()
                })
                .catch(() => {

                    message.error('Что-то пошло не так!');
                })
                .finally(() => {
                    core.loadingUrl.delete('users/interests/')
                })
        },
        deleteInterest(id) {
            const core = useCore()
            core.loadingUrl.add('users/interests/')
            api({
                    url: `users/interests/${id}/`,
                    method: 'DELETE',
                })
                .then(() => {

                    message.success('Интерес удалён!');

                    this.getInterest()
                })
                .catch(() => {

                    message.error('Что-то пошло не так!');
                })
                .finally(() => {
                    core.loadingUrl.delete('users/interests/')
                })
        },
    }
})

export default useInterest