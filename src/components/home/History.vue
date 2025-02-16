<script setup>
import { storeToRefs } from "pinia";
import useHistory from "@/stores/history.pinia";
import { ref, reactive, onMounted } from "vue";
import dayjs from "dayjs";
import "dayjs/locale/ru";
import relativeTime from "dayjs/plugin/relativeTime";
import userIcon from "../icons/user.vue";
import send from "../icons/send.vue";

dayjs.locale("ru");
dayjs.extend(relativeTime);

const msg = ref("");

const historyPinia = useHistory();
const { history } = storeToRefs(historyPinia);

const formatDate = (date) => {
  const createdAt = dayjs(date);
  if (createdAt.isSame(dayjs(), "day")) return "Сегодня";
  if (createdAt.isSame(dayjs().subtract(1, "day"), "day")) return "Вчера";
  return createdAt.format("D-MMMM");
};

function sendMessage() {
  historyPinia.addHistory({ name: msg.value }, () => {
    msg.value = "";
    historyPinia.getHistory();
  });
}

onMounted(() => {
  historyPinia.getHistory();
});
</script>
<template>
  <div class="flex flex-col gap-10 max-lg:gap-6">
    <div
      v-if="!!history.length"
      class="flex flex-col bg-white border rounded-xl border-blue-700/20 px-9 py-7 max-sm:p-5 gap-7 max-sm:gap-5"
    >
      <span class="text-xl font-semibold text-blue-700">Мои истории</span>
      <div
        class="flex flex-col p-5 border rounded-xl border-blue-700/20 gap-7 max-sm:gap-5"
        v-for="item in history"
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
              v-if="!item?.user?.avatar"
              class="flex items-center w-full h-full text-4xl text-blue-700"
            >
              <userIcon class="" />
            </a-avatar>
            <img
              v-else
              :src="item?.user?.avatar"
              class="w-full h-full rounded-full"
            />
          </div>
          <div
            class="flex flex-col gap-1 text-sm text-blue-700 max-sm:flex-grow max-sm:gap-2"
          >
            <div class="flex items-center justify-between max-sm:flex-grow">
              <span class="text-lg font-semibold">
                {{ item?.user?.username }}
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
    <div
      class="flex flex-col bg-white border rounded-xl border-blue-700/20 px-9 py-7 max-sm:p-5 gap-7 max-sm:gap-5"
    >
      <div class="flex flex-col gap-3 text-sm text-blue-700">
        <span class="text-xl font-semibold">Поделитесь своей историей</span>
        <span>Ваша история будет видна на странице вашего профиля</span>
      </div>

      <div
        class="flex gap-5 px-6 py-3 border rounded-xl border-blue-700/20 max-sm:px-5"
      >
        <input
          type="text"
          v-model="msg"
          placeholder="Оставить комментарий"
          class="flex-grow text-blue-700 border-none outline-none"
        />

        <a-button type="link" :disabled="!msg" @click="sendMessage" class="p-0">
          <send class="text-2xl" />
        </a-button>
      </div>
    </div>
  </div>
</template>
