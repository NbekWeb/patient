<script setup>
import { ref } from "vue";

const open = ref(false);

const toggle = () => {
  open.value = !open.value;
};

defineProps({
  title: String,
  content: String,
});
</script>
<template>
  <div
    @click="toggle"
    class="flex hover:cursor-pointer py-6 px-4 text-sm text-blue-700 flex-col items-center bg-white rounded-xl gap-3.5 "
  >
    <span class="text-lg font-semibold">{{ title }}</span>
    <span class="text-center limit-2">
      {{ content }}
    </span>
    <a-modal v-model:open="open" :title="title">
      <span class="text-sm text-blue-700">{{ content }} </span>
      <template #footer></template>
    </a-modal>
  </div>
</template>
