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

const useDemografic = defineStore('demografic', {
    state: () => ({
        demografic: [],
        dataDemo: []
    }),
    actions: {
        getDemografic() {
            const core = useCore()
            core.loadingUrl.add('users/demographics/')
            api({
                    url: 'users/demographics/',
                    method: 'GET'
                })
                .then(({
                    data
                }) => {
                    this.demografic = data
                    if (this.demografic.length > 0) {

                        this.dataDemo = [{
                                name: "Страна",
                                value: this.demografic?. [0].city,
                            },
                            {
                                name: "Город",
                                value: this.demografic?. [0]?.region,
                            },
                            {
                                name: "Образование",
                                value: this.demografic?. [0]?.position,
                            },
                            {
                                name: "Этническая принадлежность",
                                value: this.demografic?. [0]?.ethnicity,
                            },
                            {
                                name: "Вид медицинской страховки",
                                value: this.demografic?. [0]?.type_health_insurance,
                            },
                            {
                                name: "Биография",
                                value: this.demografic?. [0]?.biography,
                            },
                        ]
                    }
                })
                .catch(() => {})
                .finally(() => {
                    core.loadingUrl.delete('users/demographics/')
                })
        },

        addDemografic(data, callback) {
            const core = useCore()
            core.loadingUrl.add('users/demographics/')
            api({
                    url: 'users/demographics/',
                    method: 'POST',
                    data
                })
                .then(() => {

                    message.success('Демографические данные болезни добавлена!');
                    callback()
                })
                .catch((e) => {
                    if (e.response && e.response.data && e.response.data.biography && e.response.data.biography.length) {
                        message.error(e.response.data.biography[0]);
                    } else {
                        message.error('Что-то пошло не так!');
                    }
                })
                .finally(() => {
                    core.loadingUrl.delete('users/demographics/')
                })
        },
        updateDemografic(data, id, callback) {
            const core = useCore()
            core.loadingUrl.add('users/demographics/')
            api({
                    url: `users/demographics/${id}/`,
                    method: 'PUT',
                    data
                })
                .then(() => {
                    callback()
                    message.success('Демографические данные изменён!');

                })
                .catch((e) => {
                    if (e.response && e.response.data && e.response.data.biography && e.response.data.biography.length) {
                        message.error(e.response.data.biography[0]);
                    } else {
                        message.error('Что-то пошло не так!');
                    }

                })
                .finally(() => {
                    core.loadingUrl.delete('users/demographics/')
                })
        },
    }

})


export default useDemografic