<script setup>
import { storeToRefs } from "pinia";
import useFollowers from "@/stores/followers.pinia";
import { ref, onMounted, reactive } from "vue";

import userIcon from "@/components/icons/user.vue";
import dayjs from "dayjs";

const followersPinia = useFollowers();

const { followers } = storeToRefs(followersPinia);

const getAge = (age) => {
  return dayjs().diff(dayjs(age, "YYYY-MM-DD"), "year");
};

const unfollow = (id) => {
  followersPinia.deleteFollowers(id, () => {
    followersPinia.getFollowers();
  });
};
</script>
<template>
  <div
    class="flex flex-col h-full gap-6 bg-white py-7 px-9 rounded-xl max-sm:p-5"
  >
    <div class="flex items-center justify-between">
      <span class="text-xl font-semibold text-blue-700"> Мои подписки: </span>
    </div>

    <template v-if="followers.length > 0">
      <div class="flex flex-col text-blue-700 gap-3.5">
        <div
          class="flex items-center gap-6 pb-3.5 border-blue-700/20"
          :class="i+1 != followers.length && 'border-b'"
          v-for="(follower, i) in followers"
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
</template>
