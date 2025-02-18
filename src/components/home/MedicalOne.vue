<script setup>
import dayjs from "dayjs";

import pen from "../icons/pen.vue";
import Delete from "../icons/delete.vue";
import dots from "../icons/dots.vue";

import { ref, reactive, onMounted } from "vue";
import MedicalModal from "./MedicalModal.vue";

import useMedical from "@/stores/medical.pinia";
import "dayjs/locale/ru";

dayjs.locale("ru");

const medicalPinia = useMedical();

const visible = ref(false);
const open = ref(false);

const toggleOpen = () => {
  open.value = !open.value;
};

const close = () => {
  visible.value = !visible.value;
};

defineProps({
  data: Object,
  guest: {
    type: Boolean,
    default: true,
  },
});
</script>
<template>
  <div class="flex items-center justify-between gap-10">
    <span class="">
      {{ data.history }}
      {{ dayjs(data.start_date).format("DD-MMMM,YYYY") }}
    </span>
    <a-popover
      v-if="guest"
      title=""
      trigger="click"
      placement="bottom"
      v-model:open="visible"
    >
      <template #content>
        <div class="flex flex-col items-center gap-1">
          <span
            @click="
              () => {
                toggleOpen();
                close();
              }
            "
            class="flex text-lg text-blue-700/60 hover:text-blue-700 hover:cursor-pointer tr-3"
          >
            <pen />
          </span>
          <a-button
            @click="
              () => {
                medicalPinia.deleteMedical(data.id);
                close();
              }
            "
            type="link"
            danger
            class="!px-0 text-lg"
          >
            <Delete />
          </a-button>
        </div>
      </template>
      <span
        class="flex text-lg hover:cursor-pointer text-blue-700/60 hover:text-blue-700 tr-3 max-h-max"
      >
        <dots />
      </span>
    </a-popover>

    <MedicalModal :open="open" @update="toggleOpen" :id="data.id" />
  </div>
</template>
