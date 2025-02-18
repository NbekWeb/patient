<script setup>
import useUser from "@/stores/user.pinia";
import { storeToRefs } from "pinia";
import userIcon from "@/components/icons/user.vue";

const userPinia = useUser();
const { user } = storeToRefs(userPinia);

const props = defineProps({
  item: Object,
});
</script>
<template>
  <div class="flex items-center justify-between gap-4 text-[#292A29]">
    <div class="self-end w-15 h-15 min-w-15">
      <a-avatar
        class="flex items-center justify-center w-full h-full"
        v-if="!item?.sender?.avatar"
      >
        <userIcon class="text-3xl text-blue-700" />
      </a-avatar>
      <img :src="item?.sender?.avatar" v-else class="w-full h-full rounded-full" />
      
    </div>
    <div
      :class="
        user.username == item?.sender?.username
          ? 'bg-[#FECA341A]'
          : 'bg-[#292A2908]'
      "
      class="flex items-center justify-between flex-grow gap-5 p-3 rounded-xl min-h-15"
    >
      <div class="flex flex-col gap-1 text-sm">
        <span class="text-base font-bold opacity-50">
          {{
            user.username == item?.sender?.username
              ? "Вы"
              : item?.sender?.username
          }}
        </span>
        <span class="break-words">{{ item?.text }}</span>
      </div>
      <span class="self-end text-xs opacity-60">{{ item?.formattedTime }}</span>
    </div>
  </div>
</template>
