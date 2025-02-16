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

const useNotes = defineStore('notes', {
    state: () => ({
        notes: [],
        noteOne: {}
    }),
    actions: {
        getNotes() {
            const core = useCore()
            core.loadingUrl.add('users/notes/')
            api({
                    url: 'users/notes/',
                    method: 'GET'
                })
                .then(({
                    data
                }) => {
                    this.notes = data

                })
                .catch(() => {})
                .finally(() => {
                    core.loadingUrl.delete('users/notes/')
                })
        },
        addNotes(data, callback) {
            const core = useCore()
            core.loadingUrl.add('users/notes/')
            api({
                    url: 'users/notes/',
                    method: 'POST',
                    data
                })
                .then(() => {

                    message.success('Заметки добавлен!');
                    callback()
                })
                .catch(() => {

                    message.error('Что-то пошло не так!');
                })
                .finally(() => {
                    core.loadingUrl.delete('users/notes/')
                })
        },
        updateNote(data, id, callback) {
            const core = useCore()
            core.loadingUrl.add('users/notes/')
            api({
                    url: `users/notes/${id}/`,
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
                    core.loadingUrl.delete('users/notes/')
                })
        },
        getNoteId(id, callback) {
            const core = useCore()
            core.loadingUrl.add('users/notes/')
            api({
                    url: `users/notes/${id}/`,
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
                    core.loadingUrl.delete('users/notes/')
                })
        },
        deleteNote(id) {
            const core = useCore()
            core.loadingUrl.add('users/notes/')
            api({
                    url: `users/notes/${id}/`,
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
                    core.loadingUrl.delete('users/notes/')
                })
        },
    }
})

export default useNotes