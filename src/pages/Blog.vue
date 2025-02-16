<script setup>
import { RouterLink, useRouter } from "vue-router";
import { ref, onMounted } from "vue";
import Card from "@/components/blog/card.vue";
import { storeToRefs } from "pinia";
import useBlog from "@/stores/blog.pinia";
import useMedical from "@/stores/medical.pinia";
import useCore from "@/stores/core.pinia";

const blogPinia = useBlog();
const medicalPinia = useMedical();
const core = useCore();

const { blogs } = storeToRefs(blogPinia);
const { medicalAll } = storeToRefs(medicalPinia);
const { loadingUrl } = storeToRefs(core);

const current = ref(1);
const medical_illness = ref("");
const page_size = ref(10);
const router = useRouter();

const changeMedical = (val) => {
  medical_illness.value = val;
  getBlog();
};

const type = ref("popular");

function getBlog() {
  const params = {
    page_size: page_size.value,
    page: current.value,
    medical_illness: medical_illness.value,
  };
  if (type.value == "popular") {
    params.popular = true;
    params.old = false;
  } else {
    params.popular = false;
    params.old = true;
  }
  blogPinia.getBlogs(params);
}

onMounted(() => {
  getBlog();
  medicalPinia.getAllMedicals();
});
</script>
<template>
  <a-spin :spinning="loadingUrl.has('blogs/list/')">
    <div class="text-blue-700">
      <div class="flex flex-col gap-6">
        <div class="flex items-center gap-3 text-sm">
          <router-link :to="{ name: 'main' }" class="text-blue-700"
            >Главная</router-link
          >
          <span>/</span>
          <router-link :to="{ name: 'blog' }" class="text-blue-700"
            >Блог</router-link
          >
        </div>
        <h2 class="text-4xl font-semibold">Блог</h2>
        <div class="flex flex-col gap-3.5">
          <span class="text-lg font-semibold">Популярные теги:</span>
          <div class="flex gap-3.5 flex-wrap text-sm">
            <span
              @click="changeMedical('')"
              class="flex px-4 py-2 border rounded-full hover:cursor-pointer border-blue-700/20 tr-3 hover:border-blue-700 hover:bg-blue-700 hover:text-white"
              :class="
                !medical_illness && 'border-blue-700 bg-blue-700 text-white'
              "
            >
              Все
            </span>
            <span
              @click="changeMedical(item.id)"
              v-for="item in medicalAll"
              :key="item.id"
              class="flex px-4 py-2 border rounded-full tr-3 hover:border-blue-700 hover:bg-blue-700 hover:text-white border-blue-700/20 hover:cursor-pointer"
              :class="
                medical_illness == item.id &&
                'border-blue-700 bg-blue-700 text-white'
              "
            >
              {{ item.name }}
            </span>
          </div>
        </div>
        <div class="flex justify-end">
          <div class="flex flex-col gap-3.5">
            <span class="">Сортировка</span>
            <a-select v-model:value="type" class="w-40" @change="getBlog">
              <a-select-option value="popular">Популярные</a-select-option>
              <a-select-option value="news">Новости</a-select-option>
            </a-select>
          </div>
        </div>
        <template v-if="blogs.count != 0">
          <div class="flex flex-col gap-7">
            <card v-for="blog in blogs?.results" :key="blog.id" :data="blog" />
          </div>
        </template>
        <div v-else class="flex items-center justify-center flex-grow">
          <a-empty description="Нет данных" />
        </div>
        <div class="flex justify-center mt-6">
          <a-pagination
            v-model:current="current"
            :total="blogs.count"
            :page-size="page_size"
            :showSizeChanger="false"
            :hideOnSinglePage="true"
            @change="getBlog"
          />
        </div>
      </div>
    </div>
  </a-spin>
</template>
