import {
    defineStore
} from "pinia";
import {
    api
} from "@/utils/api.js";
import useCore from '@/stores/core.pinia.js'


const useDirectory = defineStore('directory', {
    state: () => ({
        directories: [],
        directory: {},
    }),
    actions: {
        getDirectories() {
            const core = useCore()
            core.loadingUrl.add('blogs/directories/')
            api({
                    url: 'blogs/directories/',
                    method: 'GET'
                })
                .then(({
                    data
                }) => {
                    this.directories = data

                })
                .catch(() => {})
                .finally(() => {
                    core.loadingUrl.delete('blogs/directories/')
                })
        },
        getDirectory(id) {
            const core = useCore()
            core.loadingUrl.add('blogs/directory/')
            api({
                    url: `blogs/directories/${id}/`,
                    method: 'GET'
                })
                .then(({
                    data
                }) => {
                    this.directory = data

                })
                .catch(() => {})
                .finally(() => {
                    core.loadingUrl.delete('blogs/directory/')
                })
        }
    }
})


export default useDirectory