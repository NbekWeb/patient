import {
    defineStore
} from "pinia";
const useCore = defineStore("core", {
    state: () => ({
        loadingUrl: new Set([]),

    }),

});

export default useCore;