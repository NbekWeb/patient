<script setup>
import { RouterLink, useRouter } from "vue-router";
import { ref, onMounted } from "vue";
import Card from "@/components/catalog/card.vue";
import { storeToRefs } from "pinia";
import useDirectory from "@/stores/directory.pinia";

const router = useRouter();
const directoryPinia = useDirectory();



const { directories } = storeToRefs(directoryPinia);

onMounted(() => {
  directoryPinia.getDirectories();
});
</script>
<template>
  <div class="">
    <div class="text-blue-700">
      <div class="flex flex-col gap-6 max-sm:gap-4">
        <div class="flex items-center gap-3 text-sm">
          <router-link :to="{ name: 'home' }" class="text-blue-700"
            >Главная</router-link
          >
          <span>/</span>
          <router-link :to="{ name: 'catalog' }" class="text-blue-700"
            >Справочник</router-link
          >
        </div>
        <h2 class="text-4xl font-semibold">Справочник</h2>

        <div class="grid grid-cols-3 gap-6 max-lg:grid-cols-2 max-md:grid-cols-1">
          <card
            v-for="catalog of directories"
            :key="catalog.id"
            :title="catalog.title"
            :content="catalog.description"
          />
        </div>
      </div>
    </div>
  </div>
</template>
