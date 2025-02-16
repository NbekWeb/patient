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

const useMedical = defineStore('medical', {
    state: () => ({
        medicals: [],
        medicalAll: [],
        medicalOne: {},
    }),
    actions: {
        getMedicals() {
            const core = useCore()
            core.loadingUrl.add('users/medical-history/')
            api({
                    url: 'users/medical-history/',
                    method: 'GET'
                })
                .then(({
                    data
                }) => {
                    this.medicals = data

                })
                .catch(() => {})
                .finally(() => {
                    core.loadingUrl.delete('users/medical-history/')
                })
        },
        getAllMedicals() {
            const core = useCore()
            core.loadingUrl.add('users/medical/illness/')
            api({
                    url: 'users/medical/illness/',
                    method: 'GET'
                })
                .then(({
                    data
                }) => {
                    this.medicalAll = data

                })
                .catch(() => {})
                .finally(() => {
                    core.loadingUrl.delete('users/medical/illness/')
                })
        },
        getMedical(id, callback = () => {}) {
            const core = useCore()
            core.loadingUrl.add('users/medical-history/id')
            api({
                    url: `users/medical-history/${id}/`,
                    method: 'GET'
                })
                .then(({
                    data
                }) => {
                    this.medicalOne = data
                    callback()
                })
                .catch(() => {})
                .finally(() => {
                    core.loadingUrl.delete('users/medical-history/id')
                })
        },
        addMedical(data, callback) {
            const core = useCore()
            core.loadingUrl.add('users/medical-history/')
            api({
                    url: 'users/medical-history/',
                    method: 'POST',
                    data
                })
                .then(() => {

                    message.success('История болезни добавлена!');
                    callback()
                })
                .catch(() => {

                    message.error('Что-то пошло не так!');
                })
                .finally(() => {
                    core.loadingUrl.delete('users/medical-history/')
                })
        },
        updateMedical(data, id, callback) {
            const core = useCore()
            core.loadingUrl.add('users/medical-history/')
            api({
                    url: `users/medical-history/${id}/`,
                    method: 'PUT',
                    data
                })
                .then(() => {
                    callback()
                    message.success('История болезни изменён!');

                })
                .catch(() => {

                    message.error('Что-то пошло не так!');
                })
                .finally(() => {
                    core.loadingUrl.delete('users/medical-history/')
                })
        },
        deleteMedical(id) {
            const core = useCore()
            core.loadingUrl.add('users/medical-history/')
            api({
                    url: `users/medical-history/${id}/`,
                    method: 'DELETE',
                })
                .then(() => {

                    message.success('История болезни удалён!');

                    this.getMedicals()
                })
                .catch(() => {

                    message.error('Что-то пошло не так!');
                })
                .finally(() => {
                    core.loadingUrl.delete('users/medical-history/')
                })
        },
    }

})


export default useMedical