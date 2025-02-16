import {
    defineStore
} from "pinia";
import {
    api
} from "@/utils/api.js";
import useCore from '@/stores/core.pinia.js'


const useBlog = defineStore('blog', {
    state: () => ({
        blogs: [],
        blog: {},
    }),
    actions: {
        getBlogs(params) {
            const core = useCore()
            core.loadingUrl.add('blogs/list/')
            api({
                    url: 'blogs/list/',
                    method: 'GET',
                    params
                })
                .then(({
                    data
                }) => {
                    this.blogs = data


                })
                .catch(() => {})
                .finally(() => {
                    core.loadingUrl.delete('blogs/list/')
                })
        },
        getBlog(id) {
            const core = useCore()
            core.loadingUrl.add('blogs/list/id')
            api({
                    url: `blogs/list/${id}/`,
                    method: 'GET'
                })
                .then(({
                    data
                }) => {
                    this.directory = data

                })
                .catch(() => {})
                .finally(() => {
                    core.loadingUrl.delete('blogs/list/id')
                })
        }
    }
})


export default useBlog