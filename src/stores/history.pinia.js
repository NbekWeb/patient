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

const useHistory = defineStore('history', {
    state: () => ({
        history: [],
        historyOne: {}
    }),
    actions: {
        getHistory() {
            const core = useCore()
            core.loadingUrl.add('users/daily_history/')
            api({
                    url: 'users/daily_history/',
                    method: 'GET'
                })
                .then(({
                    data
                }) => {
                    this.history = data

                })
                .catch(() => {})
                .finally(() => {
                    core.loadingUrl.delete('users/daily_history/')
                })
        },
        addHistory(data, callback = () => {}) {
            const core = useCore()
            core.loadingUrl.add('users/daily_history/')
            api({
                    url: 'users/daily_history/',
                    method: 'POST',
                    data
                })
                .then(() => {

                    message.success('Отправить комментарий!');
                    callback()
                })
                .catch(() => {

                    message.error('Что-то пошло не так!');
                })
                .finally(() => {
                    core.loadingUrl.delete('users/daily_history/')
                })
        },
        updateHistory(data, id, callback) {
            const core = useCore()
            core.loadingUrl.add('users/daily_history/')
            api({
                    url: `users/daily_history/${id}/`,
                    method: 'PUT',
                    data
                })
                .then(() => {
                    callback()
                    message.success('Комментарий изменён!');

                })
                .catch(() => {

                    message.error('Что-то пошло не так!');
                })
                .finally(() => {
                    core.loadingUrl.delete('users/daily_history/')
                })
        },
        getHistoryId(id, callback) {
            const core = useCore()
            core.loadingUrl.add('users/daily_history/')
            api({
                    url: `users/daily_history/${id}/`,
                    method: 'GET',

                })
                .then(({
                    data
                }) => {
                    this.noteOne = data
                    callback()
                })
                .catch(() => {

                    message.error('Что-то пошло не так!');
                })
                .finally(() => {
                    core.loadingUrl.delete('users/daily_history/')
                })
        },
        deleteHistory(id) {
            const core = useCore()
            core.loadingUrl.add('users/daily_history/')
            api({
                    url: `users/daily_history/${id}/`,
                    method: 'DELETE',
                })
                .then(() => {

                    message.success('Заметки удалён!');

                    this.getHistory()
                })
                .catch(() => {

                    message.error('Что-то пошло не так!');
                })
                .finally(() => {
                    core.loadingUrl.delete('users/daily_history/')
                })
        },
    }
})

export default useHistory