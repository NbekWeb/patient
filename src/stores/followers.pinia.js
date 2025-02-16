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

const useFollowers = defineStore('followers', {
    state: () => ({
        followers: [],
        follower: {},
    }),
    actions: {
        getFollowers() {
            const core = useCore()
            core.loadingUrl.add('users/followers/')
            api({
                    url: 'users/followers/',
                    method: 'GET'
                })
                .then(({
                    data
                }) => {
                    this.followers = data

                })
                .catch(() => {})
                .finally(() => {
                    core.loadingUrl.delete('users/followers/')
                })
        },

        addFollowers(data, callback) {
            const core = useCore()
            core.loadingUrl.add('users/followers/')
            api({
                    url: `users/followers/`,
                    method: 'POST',
                    data
                })
                .then(() => {
                    callback()
                    message.success('Вы подписались!');

                })
                .catch(() => {

                    message.error('Что-то пошло не так!');
                })
                .finally(() => {
                    core.loadingUrl.delete('users/followers/')
                })
        },
        deleteFollowers(id, callback) {
            const core = useCore()
            core.loadingUrl.add('users/followers/')
            api({
                    url: `users/followers/${id}/`,
                    method: 'DELETE',

                })
                .then(() => {
                    callback()
                    message.success('Вы отписались!');

                })
                .catch(() => {

                    message.error('Что-то пошло не так!');
                })
                .finally(() => {
                    core.loadingUrl.delete('users/followers/')
                })
        },
        addFollower1s(data, callback) {
            const core = useCore()
            core.loadingUrl.add('users/followers/')
            api({
                    url: `users/followers/${id}/`,
                    method: 'POST',
                    data
                })
                .then(() => {
                    callback()
                    message.success('Демографические данные изменён!');

                })
                .catch(() => {

                    message.error('Что-то пошло не так!');
                })
                .finally(() => {
                    core.loadingUrl.delete('users/followers/')
                })
        },
    }

})


export default useFollowers