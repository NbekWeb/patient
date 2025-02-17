<script setup>
import { ref, computed } from "vue";
import dayjs from "dayjs";
import "dayjs/locale/ru";

dayjs.locale("ru");

const props = defineProps({
  data: Object,
});

const open = ref(false);
const toggle = () => {
  open.value = !open.value;
};

const formattedDate = computed(() =>
  props.data?.created_at
    ? dayjs(props.data.created_at).format("D MMMM YYYY года")
    : ""
);
</script>
<template>
  <div
    class="grid grid-cols-2 text-blue-700 bg-white gap-9 rounded-xl max-md:grid-cols-1"
  >
    <!-- {{ data }} -->
    <img
      :src="data.images?.[0]?.image"
      class="w-full rounded-l-xl max-md:rounded-bl-none max-md:rounded-t-xl"
    />
    <div class="flex flex-col justify-between gap-3 py-6 text-sm max-2xl:py-4">
      <div class="flex flex-col gap-3.5 max-2xl:gap-2">
        <span>{{ formattedDate }}</span>
        <span class="text-2xl font-semibold max-xl:truncate">
          {{ data.title }}
        </span>
        <span class="limit-2 pr-2.5">
          {{ data.description }}
        </span>
      </div>
      <div class="flex">
        <a-button type="primary" danger @click="toggle"> Подробнее </a-button>
      </div>
    </div>
    <a-modal v-model:open="open" title="Блог">
      <template #footer></template>
      <div class="flex flex-col gap-3.5 text-blue-700 text-sm mt-3">
        <img :src="data.images?.[0]?.image" class="rounded-xl" />
        <span class="text-xl font-semibold">
          {{ data.title }}
        </span>
        <span> {{ data.description }}</span>
      </div>
    </a-modal>
  </div>
</template>
