<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from "vue";
import WebSocketService from "@/utils/websocket";
import { useRoute, useRouter } from "vue-router";
import useChats from "@/stores/chat.pinia";

import send from "@/components/icons/send.vue";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

import itemCard from "./item.vue";

import { storeToRefs } from "pinia";
import "dayjs/locale/ru";

dayjs.locale("ru");
dayjs.extend(utc);
dayjs.extend(timezone);
const route = useRoute();
const chatPinia = useChats();

const { chat } = storeToRefs(chatPinia);

const userToken = localStorage.getItem("access_token");

const chatMessages = ref([]);
const msg = ref("");
let wsService = null;

const onMessage = () => {
  chatPinia.getChat(route.params.id, () => {
    setTimeout(() => {
      scrollToBottom();
    }, 300);
  });
};

watch(
  () => route.params.id,
  (newId) => {
    if (!userToken) {
      return;
    }

    wsService = new WebSocketService(newId, userToken, onMessage);
    wsService.connect();
    chatPinia.getChat(newId, () => {
      scrollToBottom();
    });
  },
  { immediate: true }
);

const sendMessage = () => {
  const message = { message: msg.value };
  msg.value = "";
  wsService.sendMessage(message);
};

const groupedChats = computed(() => {
  const groups = {};
  chat?.value?.forEach((item) => {
    const localDateKey = dayjs.utc(item.timestamp).local().format("YYYY-MM-DD");
    if (!groups[localDateKey]) {
      groups[localDateKey] = [];
    }
    groups[localDateKey].push({
      ...item,
      formattedTime: dayjs.utc(item.timestamp).local().format("HH:mm"),
    });
  });
  return groups;
});

const formatDate = (date) => {
  const createdAt = dayjs(date);
  if (createdAt.isSame(dayjs(), "day")) return "Сегодня";
  if (createdAt.isSame(dayjs().subtract(1, "day"), "day")) return "Вчера";
  return createdAt.format("D-MMMM");
};

const chatContainerRef = ref(null);

function scrollToBottom() {
  if (chatContainerRef.value) {
    chatContainerRef.value.scrollTo({
      top: chatContainerRef.value.scrollHeight,
      behavior: "smooth",
    });
  }
}

onUnmounted(() => {
  if (wsService) wsService.close();
});
</script>

<template>
  <div
    class="max-h-[calc(100vh-326px)] overflow-y-hidden h-[calc(100vh-326px)] max-sm:max-h-[calc(100vh-345px)]"
  >
    <div
      class="flex flex-col justify-between min-h-full gap-5 overflow-y-auto text-blue-700 bg-white border p-7 rounded-xl max-sm:p-3 max-sm:gap-0"
    >
      <template v-if="chat.length > 0">
        <div
          ref="chatContainerRef"
          class="max-h-[calc(100vh-470px)] overflow-y-auto blue-scrollbar pr-4 max-sm:pr-2 max-sm:max-h-[calc(100vh-435px)] "
        >
          <div v-for="(items, i) in groupedChats" :key="i" class="">
            <div class="flex items-center gap-3 mb-5 text-blue-700/60">
              <span class="flex-grow min-h-[1px] bg-blue-700/20"></span>
              <span>{{ formatDate(i) }}</span>
              <span class="flex-grow min-h-[1px] bg-blue-700/20"></span>
            </div>
            <div class="flex flex-col gap-5">
              <itemCard :item="item" v-for="item in items" :key="item.id" />
            </div>
          </div>
        </div>
      </template>
      <span v-else></span>
      <div
        class="flex gap-5 p-3 border rounded-xl border-blue-700/20 max-sm:py-1 max-sm:px-2"
      >
        <input
          @keyup.enter="msg && sendMessage()"
          type="text"
          v-model="msg"
          placeholder="Напишите сообщение"
          class="flex-grow text-blue-700 border-none outline-none"
        />

        <a-button type="link" :disabled="!msg" @click="sendMessage" class="p-0">
          <send class="text-2xl" />
        </a-button>
      </div>
    </div>
  </div>
</template>
