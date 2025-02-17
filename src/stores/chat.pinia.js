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
        chat: {}
    }),
    actions: {
        getChats() {
            const core = useCore()
            core.loadingUrl.add('chat/start_convo/')
            api({
                    url: 'chat/start_convo/',
                    method: 'GET'
                })
                .then(({
                    data
                }) => {
                    this.notes = data

                })
                .catch(() => {})
                .finally(() => {
                    core.loadingUrl.delete('chat/start_convo/')
                })
        },
        addChats(data = {}, callback = () => {}) {
            const core = useCore()
            core.loadingUrl.add('chat/start_convo/')
            api({
                    url: 'chat/start_convo/',
                    method: 'POST',
                    data: {
                        username: 'nbek1'
                    }
                })
                .then(() => {

                    message.success('Заметки добавлен!');
                    callback()
                })
                .catch(() => {

                    message.error('Что-то пошло не так!');
                })
                .finally(() => {
                    core.loadingUrl.delete('chat/start_convo/')
                })
        },
        updateNote(data, id, callback) {
            const core = useCore()
            core.loadingUrl.add('chat/start_convo/')
            api({
                    url: `chat/start_convo/${id}/`,
                    method: 'PUT',
                    data
                })
                .then(() => {
                    callback()
                    message.success('Заметки изменён!');

                })
                .catch(() => {

                    message.error('Что-то пошло не так!');
                })
                .finally(() => {
                    core.loadingUrl.delete('chat/start_convo/')
                })
        },
        getNoteId(id, callback) {
            const core = useCore()
            core.loadingUrl.add('chat/start_convo/')
            api({
                    url: `chat/start_convo/${id}/`,
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
                    core.loadingUrl.delete('chat/start_convo/')
                })
        },
        deleteNote(id) {
            const core = useCore()
            core.loadingUrl.add('chat/start_convo/')
            api({
                    url: `chat/start_convo/${id}/`,
                    method: 'DELETE',
                })
                .then(() => {

                    message.success('Заметки удалён!');

                    this.getNotes()
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