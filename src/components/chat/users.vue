<script setup>
import useChats from "@/stores/chat.pinia";
import { storeToRefs } from "pinia";


import user from "./user.vue";

const chatPinia = useChats();
const { chats } = storeToRefs(chatPinia);

import { ref, onMounted } from "vue";

onMounted(() => {
  chatPinia.getChats();
});
</script>

<template>
  <div
    class="grid grid-cols-3 gap-6 text-blue-700 max-xl:grid-cols-2 max-md:grid-cols-1 max-sm:gap-4"
  >
    <user v-for="chat in chats" :key="chat.id" :data="chat" />
  </div>
</template>
