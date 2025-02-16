<script setup>
import { RouterLink, useRouter } from "vue-router";
import { ref, onMounted } from "vue";
import Card from "@/components/catalog/card.vue";
import { storeToRefs } from "pinia";
import useDirectory from "@/stores/directory.pinia";

const router = useRouter();
const directoryPinia = useDirectory();

const catalogs = [
  {
    id: 0,
    title: "О компании",
    content: "Информация о компании, политике, исследованиях и многом другом",
  },
  {
    id: 1,
    title: "Веб-сайт",
    content: "Руководства для начала работы",
  },
  {
    id: 2,
    title: "Веб-сайт",
    content: "Руководства для начала работы",
  },
  {
    id: 3,
    title: "Учетная запись",
    content: "",
  },
  {
    id: 4,
    title: "Техническая поддержка",
    content: "",
  },
  {
    id: 5,
    title: "Кризисные ресурсы",
    content: "У вас кризис? Чем мы можем помочь? ...",
  },
];

const { directories } = storeToRefs(directoryPinia);

onMounted(() => {
  directoryPinia.getDirectories();
});
</script>
<template>
  <div>
    <div class="text-blue-700">
      <div class="flex flex-col gap-6">
        <div class="flex items-center gap-3 text-sm">
          <router-link :to="{ name: 'main' }" class="text-blue-700"
            >Главная</router-link
          >
          <span>/</span>
          <router-link :to="{ name: 'catalog' }" class="text-blue-700"
            >Справочник</router-link
          >
        </div>
        <h2 class="text-4xl font-semibold">Справочник</h2>

        <div class="grid grid-cols-3 gap-6 ">
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
