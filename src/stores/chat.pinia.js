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

const useChats = defineStore('chats', {
    state: () => ({
        chats: [],
        chat: []
    }),
    actions: {
        getChat(id, callback = () => {}) {
            const core = useCore()
            core.loadingUrl.add(`chat/get_conversation/`)
            api({
                    url: `chat/get_conversation/${id}/`,
                    method: 'GET'
                })
                .then(({
                    data
                }) => {
                    this.chat = data
                    callback()

                })
                .catch(() => {})
                .finally(() => {
                    core.loadingUrl.delete('chat/get_conversation/')
                })
        },
        getChats() {
            const core = useCore()
            core.loadingUrl.add('chat/conversations/')
            api({
                    url: 'chat/conversations/',
                    method: 'GET'
                })
                .then(({
                    data
                }) => {
                    this.chats = data

                })
                .catch(() => {})
                .finally(() => {
                    core.loadingUrl.delete('chat/conversations/')
                })
        },
        addChats(data = {}, callback = () => {}) {
            const core = useCore()
            core.loadingUrl.add('chat/start_convo/')
            api({
                    url: 'chat/start_convo/',
                    method: 'POST',
                    data
                })
                .then(() => {
                    callback()
                })
                .catch(() => {

                    message.error('Что-то пошло не так!');
                })
                .finally(() => {
                    core.loadingUrl.delete('chat/start_convo/')
                })
        },
    }
})

export default useChats