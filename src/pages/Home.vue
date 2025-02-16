<script setup>
import { ref, onMounted, computed } from "vue";

import pen from "../components/icons/pen.vue";
import Profil from "../components/home/Profil.vue";
import Interest from "../components/home/Interest.vue";
import Subscribe from "../components/home/Subscribe.vue";
import Notes from "../components/home/Notes.vue";
import Medical from "@/components/home/Medical.vue";
import Demografic from "@/components/home/Demografic.vue";
import userIcon from "../components/icons/user.vue";

import { storeToRefs } from "pinia";
import useUser from "@/stores/user.pinia";
import useCore from "@/stores/core.pinia";
import useMedical from "@/stores/medical.pinia";
import useDemografic from "@/stores/demografic.pinia";
import useFollowers from "@/stores/followers.pinia";

import dayjs from "dayjs";
import router from "@/router";
import History from "@/components/home/History.vue";

const userPinia = useUser();
const core = useCore();
const demograficPinia = useDemografic();
const medicalPinia = useMedical();
const followersPinia = useFollowers();

const { loadingUrl } = storeToRefs(core);
const { user } = storeToRefs(userPinia);
const { medicals } = storeToRefs(medicalPinia);

const open = ref(false);

const goNews = () => {
  router.push({ name: "blog" });
};
const toggleOpen = () => {
  open.value = !open.value;
};

const changeType = () => {
  if (!user.value.is_activate) {
    userPinia.updateActive(1, () => {
      userPinia.getUser();
    });
  } else {
    userPinia.updateActive(0, () => {
      userPinia.getUser();
    });
  }
};

const typeProfil = computed(() => {
  return user.value.is_activate;
});

const age = computed(() => {
  if (user.value.birth_date) {
    return dayjs().diff(dayjs(user.value.birth_date, "YYYY-MM-DD"), "year");
  }
  return null;
});

onMounted(() => {
  medicalPinia.getMedicals();
  medicalPinia.getAllMedicals();
  demograficPinia.getDemografic();
  followersPinia.getFollowers();
});
</script>
<template>
  <a-spin
    :spinning="
      loadingUrl.has('get/user') ||
      loadingUrl.has('users/medical/illness/') ||
      loadingUrl.has('users/followers/') ||
      loadingUrl.has('users/medical-history') ||
      loadingUrl.has('users/demographics/') ||
      loadingUrl.has('users/interests/')
    "
  >
    <a-modal v-model:open="open" title="Редактировать профиль">
      <template #footer></template>
      <Profil @cancel="toggleOpen" v-if="open" />
    </a-modal>

    <div class="flex flex-col gap-10 max-lg:gap-6">
      <div class="flex flex-col gap-6 bg-white rounded-xl py-7 px-9 max-sm:p-5">
        <div
          class="grid grid-cols-2 pb-5 border-b max-lg:pb-0 border-blue-700/20 max-lg:border-none max-md:flex max-md:justify-between"
        >
          <div class="flex items-center gap-6">
            <div class="relative w-28 h-28">
              <a-avatar
                class="flex items-center w-full h-full text-5xl text-blue-700 hover:cursor-pointer"
                v-if="!user.avatar"
              >
                <user-icon class="" />
              </a-avatar>
              <img
                v-else
                :src="user.avatar"
                class="object-cover w-full h-full rounded-full"
              />
            </div>

            <div class="flex flex-col gap-2 text-sm text-blue-700">
              <span class="text-2xl font-semibold"
                >{{ user.first_name }}<br />
                {{ user.last_name }}</span
              >
              <div class="flex items-center justify-between">
                <span>{{ age }} года</span>
                <span
                  @click="toggleOpen"
                  class="flex text-xl sm:hidden text-blue-700/60 hover:text-blue-700 hover:cursor-pointer tr-3"
                >
                  <pen />
                </span>
              </div>
            </div>
          </div>
          <div
            class="flex flex-col items-end justify-between h-full pb-5 max-sm:hidden"
          >
            <span
              @click="toggleOpen"
              class="flex text-xl text-blue-700/60 hover:text-blue-700 hover:cursor-pointer tr-3"
            >
              <pen />
            </span>
            <div class="flex items-center gap-6 max-md:hidden">
              <a-checkbox v-model:checked="typeProfil" @change="changeType"
                >Видимость профиля</a-checkbox
              >
              <div class="hidden">
                <a-button type="primary" danger>
                  <span class="px-8">Подписаться</span>
                </a-button>
              </div>
            </div>
          </div>
        </div>
        <div
          class="grid grid-cols-2 gap-4 md:hidden max-sm:flex-col max-sm:flex"
        >
          <a-checkbox v-model:checked="typeProfil" @change="changeType"
            >Видимость профиля</a-checkbox
          >
          <a-button type="primary" @click="goNews" class="flex justify-center">
            <span class="">Новости</span>
          </a-button>
        </div>
        <div class="flex items-center justify-between">
          <div class="flex flex-wrap items-center gap-4">
            <span class="text-base font-semibold text-blue-700"
              >Мои заболевания:</span
            >
            <template v-if="medicals.length > 0">
              <span
                v-for="item in medicals"
                :key="item.id"
                class="flex items-center h-10 px-6 text-base text-blue-700 border rounded-full border-blue-700/20"
              >
                {{ item.medical_illness.name }}
              </span>
            </template>
          </div>
          <div class="max-md:!hidden">
            <a-button type="primary" @click="goNews">
              <span class="px-8">Новости</span>
            </a-button>
          </div>
        </div>
      </div>
      <div class="grid grid-cols-2 gap-6 max-lg:flex max-lg:flex-col">
        <Medical class="h-full" />

        <demografic class="h-full" />
      </div>
      <Notes />
      <div class="grid grid-cols-2 gap-6 max-lg:grid-cols-1">
        <Interest />
        <subscribe />
      </div>
      <History />
    </div>
  </a-spin>
</template>
