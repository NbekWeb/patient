<script setup>
import { useRoute, useRouter } from "vue-router";
import { watch, computed, onMounted } from "vue";
import { storeToRefs } from "pinia";
import useUser from "@/stores/user.pinia";
import useCore from "@/stores/core.pinia";
import useMedical from "@/stores/medical.pinia";
import useFollowers from "@/stores/followers.pinia";
import useChats from "@/stores/chat.pinia";

import MedicalOne from "@/components/home/MedicalOne.vue";
import note from "@/components/home/note.vue";
import dayjs from "dayjs";

import userIcon from "@/components/icons/user.vue";
import "dayjs/locale/ru";

dayjs.locale("ru");

const router = useRouter();
const route = useRoute();
const userPinia = useUser();
const followersPinia = useFollowers();
const core = useCore();
const chatsPinia = useChats();
const medicalPinia = useMedical();

const { loadingUrl } = storeToRefs(core);
const { guest, user } = storeToRefs(userPinia);
const { medicalAll } = storeToRefs(medicalPinia);

const age = computed(() => {
  if (guest.value.birth_date) {
    return dayjs().diff(dayjs(guest.value.birth_date, "YYYY-MM-DD"), "year");
  }
  return null;
});

const getAge = (age) => {
  return dayjs().diff(dayjs(age, "YYYY-MM-DD"), "year");
};

const formatDate = (date) => {
  const createdAt = dayjs(date);
  if (createdAt.isSame(dayjs(), "day")) return "Сегодня";
  if (createdAt.isSame(dayjs().subtract(1, "day"), "day")) return "Вчера";
  return createdAt.format("D-MMMM");
};

const follow = () => {
  followersPinia.addFollowers({ follow: guest.value.id }, () => {
    chatsPinia.addChats({ username: guest.value.username }, () => {
      router.push({ name: "home" });
    });
  });
};

const goNews = () => {
  router.push({ name: "blog" });
};

watch(
  () => route.params.id,
  (newId) => {
    userPinia.getGuest(newId);
  },
  { immediate: true }
);

const findIllness = (id) => {
  const illness = medicalAll.value.find((item) => item.id === id);
  return illness ? illness.name : null;
};

onMounted(() => {
  medicalPinia.getAllMedicals();
});
</script>

<template>
  <a-spin :spinning="loadingUrl.has('get/user')">
    <div class="flex flex-col gap-10 max-lg:gap-6">
      <div class="flex flex-col gap-6 bg-white rounded-xl py-7 px-9 max-sm:p-5">
        <div
          class="grid grid-cols-2 pb-5 border-b max-lg:pb-0 border-blue-700/20 max-lg:border-none max-md:flex max-md:justify-between"
        >
          <div class="flex items-center gap-6">
            <div class="relative w-28 h-28">
              <a-avatar
                class="flex items-center w-full h-full text-5xl text-blue-700 hover:cursor-pointer"
                v-if="!guest.avatar"
              >
                <user-icon class="" />
              </a-avatar>
              <img
                v-else
                :src="guest.avatar"
                class="object-cover w-full h-full rounded-full"
              />
            </div>

            <div class="flex flex-col gap-2 text-sm text-blue-700">
              <span class="text-2xl font-semibold"
                >{{ guest.first_name }}<br />
                {{ guest.last_name }}</span
              >
              <div class="flex items-center justify-between">
                <span>{{ age }} года</span>
              </div>
            </div>
          </div>
          <div class="flex justify-end max-md:hidden">
            <a-button type="primary" danger @click="follow">
              <span class="px-8">Подписаться</span>
            </a-button>
          </div>
        </div>
        <div
          class="grid grid-cols-2 gap-4 md:hidden max-sm:flex-col max-sm:flex"
        >
          <a-button type="primary" @click="goNews" class="flex justify-center">
            <span class="">Новости</span>
          </a-button>
          <a-button
            type="primary"
            @click="follow"
            danger
            class="flex justify-center"
          >
            <span class="px-8">Подписаться</span>
          </a-button>
        </div>
        <div class="flex items-center justify-between">
          <div class="flex flex-wrap items-center gap-4">
            <span class="text-base font-semibold text-blue-700"
              >Мои заболевания:</span
            >

            <template v-if="guest?.user_medical_history?.length > 0">
              <span
                v-for="item in guest.user_medical_history"
                :key="item.id"
                class="flex items-center h-10 px-6 text-base text-blue-700 border rounded-full border-blue-700/20"
              >
                {{ findIllness(item.medical_illness) }}
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
        <div>
          <div
            class="h-full text-sm text-blue-700 bg-white rounded-xl py-7 px-9 max-sm:p-5"
          >
            <div class="flex items-center justify-between mb-6">
              <span class="text-xl font-semibold">Моя история болезни:</span>
            </div>
            <div class="flex flex-col gap-3">
              <template v-if="!!guest?.user_medical_history?.length">
                <MedicalOne
                  :guest="false"
                  v-for="medical in guest?.user_medical_history"
                  :key="medical.id"
                  :data="medical"
                />
              </template>
              <div v-else class="flex items-center justify-center w-full">
                <a-empty description="Нет данных" />
              </div>
            </div>
          </div>
        </div>
        <div
          class="h-full text-sm text-blue-700 bg-white rounded-xl py-7 px-9 max-sm:p-5"
        >
          <div class="flex items-center justify-between mb-6">
            <span class="text-xl font-semibold">Демографические данные:</span>
          </div>

          <div
            v-if="guest?.user_demographic_data?.length"
            class="grid grid-cols-3 gap-4 max-sm:grid-cols-2"
          >
            <div class="font-semibold">Страна:</div>
            <div class="col-span-2 max-sm:col-span-1">
              {{ guest?.user_demographic_data?.[0]?.city }}
            </div>
            <div class="font-semibold">Город:</div>
            <div class="col-span-2 max-sm:col-span-1">
              {{ guest?.user_demographic_data?.[0]?.region }}
            </div>
            <div class="font-semibold">Образование:</div>
            <div class="col-span-2 max-sm:col-span-1">
              {{ guest?.user_demographic_data?.[0]?.position }}
            </div>
            <div class="font-semibold">Этническая принадлежность:</div>
            <div class="col-span-2 max-sm:col-span-1">
              {{ guest?.user_demographic_data?.[0]?.ethnicity }}
            </div>
            <div class="font-semibold">Вид медицинской страховки:</div>
            <div class="col-span-2 max-sm:col-span-1">
              {{ guest?.user_demographic_data?.[0]?.type_health_insurance }}
            </div>
            <div class="font-semibold">Биография:</div>
            <div class="col-span-2 max-sm:col-span-1">
              {{ guest?.user_demographic_data?.[0]?.biography }}
            </div>
          </div>

          <div v-else class="flex items-center justify-center flex-grow">
            <a-empty description="Нет данных" />
          </div>
        </div>
      </div>
      <div class="flex flex-col bg-white gap-7 rounded-xl py-7 px-9 max-sm:p-5">
        <div class="flex items-center justify-between">
          <span class="text-xl font-semibold text-blue-700"> Мои заметки </span>
        </div>
        <div
          v-if="guest?.user_notes?.length > 0"
          class="grid grid-cols-3 gap-5 max-lg:grid-cols-2 max-sm:grid-cols-1"
        >
          <note
            :note="note"
            v-for="(note, i) in guest?.user_notes"
            :key="i"
            :guest="false"
          />
        </div>
        <a-empty description="Нет данных" v-else />
      </div>
      <div class="grid grid-cols-2 gap-6 max-lg:grid-cols-1">
        <div
          class="flex flex-col h-full bg-white py-7 px-9 rounded-xl gap-7 max-sm:p-5"
        >
          <div class="flex items-center justify-between">
            <span class="text-xl font-semibold text-blue-700">
              Мои интересы
            </span>
          </div>
          <div
            v-if="guest?.user_insterest?.length > 0"
            class="flex flex-wrap items-center gap-3.5 text-sm text-blue-700"
          >
            <div
              class="flex items-center gap-10 px-4 py-2 border rounded-2xl border-blue-700/20"
              v-for="(item, i) of guest?.user_insterest"
              :key="i"
            >
              <span> {{ item.name }} </span>
            </div>
          </div>
          <div v-else class="flex items-center justify-center flex-grow">
            <a-empty description="Нет данных" />
          </div>
        </div>
        <div
          class="flex flex-col h-full gap-6 bg-white py-7 px-9 rounded-xl max-sm:p-5"
        >
          <div class="flex items-center justify-between">
            <span class="text-xl font-semibold text-blue-700">
              Мои подписки:
            </span>
          </div>

          <template v-if="guest?.user_follow?.length > 0">
            <div class="flex flex-col text-blue-700 gap-3.5">
              <div
                class="flex items-center gap-6 pb-3.5 border-blue-700/20"
                :class="i + 1 != guest?.user_follow?.length && 'border-b'"
                v-for="(follower, i) in guest?.user_follow"
                :key="i"
              >
                <div class="relative w-17 h-17 min-w-17">
                  <a-avatar
                    v-if="!follower?.follow?.avatar"
                    class="flex items-center w-full h-full text-4xl text-blue-700 hover:cursor-pointer hover:qopacity-60"
                  >
                    <user-icon class="" />
                  </a-avatar>
                  <img
                    v-else
                    :src="follower?.follow.avatar"
                    class="w-full h-full rounded-full"
                  />
                </div>
                <div class="flex flex-col flex-grow gap-1 overflow-hidden">
                  <span class="flex-grow text-lg font-semibold truncate">
                    {{ follower?.follow?.first_name }}
                    {{ follower?.follow?.last_name }}
                  </span>
                  <span class="text-sm"
                    >{{ getAge(follower?.follow?.birth_date) }} года</span
                  >
                </div>
                <a-button @click="unfollow(follower.id)"> Отписаться </a-button>
              </div>
            </div>
          </template>
          <div v-else class="flex items-center justify-center flex-grow">
            <a-empty description="Нет данных" />
          </div>
        </div>
      </div>
      <div
        v-if="!!guest?.user_disease_history_daily?.length"
        class="flex flex-col bg-white border rounded-xl border-blue-700/20 px-9 py-7 max-sm:p-5 gap-7 max-sm:gap-5"
      >
        <div class="flex flex-col gap-3 text-sm text-blue-700">
          <span
            >Истории профиля {{ guest?.first_name }}
            {{ guest?.last_name }}</span
          >
        </div>

        <div
          class="flex flex-col p-5 border rounded-xl border-blue-700/20 gap-7 max-sm:gap-5"
          v-for="item in guest?.user_disease_history_daily"
          :key="item.id"
        >
          <div class="flex items-center gap-3 text-blue-700/60">
            <span class="flex-grow min-h-[1px] bg-blue-700/20"></span>
            <span>{{ formatDate(item.created_at) }}</span>
            <span class="flex-grow min-h-[1px] bg-blue-700/20"></span>
          </div>
          <div class="flex items-center gap-6 max-sm:gap-3">
            <div class="relative w-17 h-17 min-w-17">
              <a-avatar
                v-if="!guest?.avatar"
                class="flex items-center w-full h-full text-4xl text-blue-700"
              >
                <userIcon class="" />
              </a-avatar>
              <img
                v-else
                :src="guest?.avatar"
                class="w-full h-full rounded-full"
              />
            </div>
            <div
              class="flex flex-col gap-1 text-sm text-blue-700 max-sm:flex-grow max-sm:gap-2"
            >
              <div class="flex items-center justify-between max-sm:flex-grow">
                <span class="text-lg font-semibold">
                  {{ guest?.username }}
                </span>
                <span class="text-xs text-blue-700/60 sm:hidden">
                  {{ item.created_at }}
                </span>
              </div>

              <span>
                {{ item.name }}
              </span>
            </div>
            <span
              class="flex self-end justify-end flex-grow text-xs text-blue-700/60 max-sm:hidden"
            >
              {{ item.created_at }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </a-spin>
</template>
