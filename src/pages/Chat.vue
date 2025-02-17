<script setup>
import { ref, onMounted } from "vue";
import useChats from "@/stores/chat.pinia";
import userIcon from "@/components/icons/user.vue";
import send from "@/components/icons/send.vue";
import card from "@/components/chat/card.vue";

const chatsPinia = useChats();

onMounted(() => {
  // chatsPinia.addChats();
});
</script>
<template>
  <div class="text-blue-700">
    <card />
    <div class="flex flex-col gap-6 max-sm:gap-4">
      <div class="flex items-center gap-3 text-sm">
        <router-link :to="{ name: 'main' }" class="text-blue-700"
          >Главная</router-link
        >
        <span>/</span>
        <router-link :to="{ name: 'chat' }" class="text-blue-700"
          >Сообщества</router-link
        >
      </div>
      <h2 class="text-4xl font-semibold">Сообщества</h2>
      <div class="flex flex-col text-blue-700 gap-3.5">
        <div class="flex items-center gap-6 pb-3.5 border-blue-700/20">
          <!-- :class="i + 1 != guest?.user_follow?.length && 'border-b'"
          v-for="(follower, i) in guest?.user_follow"
          :key="i" -->
          <div class="relative w-17 h-17 min-w-17">
            <a-avatar
              v-if="!false"
              class="flex items-center w-full h-full text-4xl text-blue-700 hover:cursor-pointer hover:qopacity-60"
            >
              <user-icon class="" />
            </a-avatar>
            <!-- <img
              v-else
              :src="follower?.follow.avatar"
              class="w-full h-full rounded-full"
            /> -->
          </div>
          <div class="flex flex-col flex-grow gap-1 overflow-hidden">
            <span class="flex-grow text-lg font-semibold truncate">
              <!-- {{ follower?.follow?.first_name }} -->
              <!-- {{ follower?.follow?.last_name }} -->
              Nodirbek Najmiddinov
            </span>
            <span class="text-sm">
              <!-- {{ getAge(follower?.follow?.birth_date) }} -->
              21 года
            </span>
          </div>
          <a-button type="link" class="p-0">
            <send class="text-2xl" />
          </a-button>
        </div>
      </div>
    </div>
  </div>
</template>
