<script setup>
import { ref, onMounted } from "vue";
import userIcon from "@/components/icons/user.vue";
import send from "@/components/icons/send.vue";
import dayjs from "dayjs";

import { useRouter } from "vue-router";
import useUser from "@/stores/user.pinia";
import { storeToRefs } from "pinia";

const userPinia = useUser();
const { user } = storeToRefs(userPinia);
const router = useRouter();

const props = defineProps({
  data: Object,
});

const chat = ref({});

const getAge = (age) => {
  return dayjs().diff(dayjs(age, "YYYY-MM-DD"), "year");
};
const goChat = (id) => {
  router.push({ name: "chat-item", params: { id } });
};

onMounted(() => {
  if (user.value.username != props.data.initiator.username) {
    chat.value = { ...props.data.initiator };
  } else {
    chat.value = { ...props.data.receiver };
  }
});
</script>
<template>
  <div
    class="flex items-center gap-6 p-5 bg-white border rounded-xl border-blue-700/20"
  >
    <div class="relative w-17 h-17 min-w-17">
      <a-avatar
        v-if="!chat?.avatar"
        class="flex items-center w-full h-full text-4xl text-blue-700"
      >
        <user-icon class="" />
      </a-avatar>
      <img v-else :src="chat?.avatar" class="w-full h-full rounded-full" />
    </div>
    <div class="flex flex-col flex-grow gap-1 overflow-hidden">
      <span class="flex-grow text-lg font-semibold truncate">
        {{ chat?.first_name }}
        {{ chat?.last_name }}
      </span>
      <span class="text-sm">
        {{ getAge(chat?.birth_date) }}
        года
      </span>
    </div>
    <a-button type="link" class="p-0" @click="goChat(data.id)">
      <send class="text-2xl" />
    </a-button>
  </div>
</template>
