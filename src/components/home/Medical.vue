<script setup>
import pen from "@/components/icons/pen.vue";
import plus from "@/components/icons/plus.vue";
import MedicalModal from "./MedicalModal.vue";
import MedicalOne from "./MedicalOne.vue";

import { ref, onMounted, reactive } from "vue";
import useMedical from "@/stores/medical.pinia";
import { storeToRefs } from "pinia";

const open = ref(false);

const medicalPinia = useMedical();
const { medicals } = storeToRefs(medicalPinia);

const toggleOpen = () => {
  open.value = !open.value;
};
</script>
<template>
  <div>
    <div
      class="h-full text-sm text-blue-700 bg-white rounded-xl py-7 px-9 max-sm:p-5"
    >
      <div class="flex items-center justify-between mb-6">
        <span class="text-xl font-semibold">Моя история болезни:</span>
        <a-button type="primary" danger @click="toggleOpen" class="max-xl:px-0">
          <span class="px-8 max-xl:px-3">
            <span class="max-xl:hidden">Добавить</span>
            <span class="text-lg xl:hidden">
              <plus />
            </span>
          </span>
        </a-button>
      </div>
      <div class="flex flex-col gap-3">
        <template v-if="medicals?.length">
          <MedicalOne
            v-for="medical in medicals"
            :key="medical.id"
            :data="medical"
          />
        </template>
        <div v-else class="flex items-center justify-center w-full">
          <a-empty description="Нет данных" />
        </div>
      </div>
    </div>

    <MedicalModal :open="open" @update="toggleOpen" />
  </div>
</template>
