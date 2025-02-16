<script setup>
import { ref } from "vue";
import { storeToRefs } from "pinia";
import useDemografic from "@/stores/demografic.pinia";
import pen from "../icons/pen.vue";
import plus from "../icons/plus.vue";
import { message } from "ant-design-vue";

const demograficPinia = useDemografic();
const { demografic, dataDemo } = storeToRefs(demograficPinia);

const isModalOpen = ref(false);
const submitting = ref(false);
const formState = ref({
  city: "",
  region: "",
  position: "",
  ethnicity: "",
  type_health_insurance: "",
  biography: "",
});

const rules = {
  city: [
    { required: true, message: "Пожалуйста, введите город", trigger: "blur" },
  ],
  region: [
    { required: true, message: "Пожалуйста, введите регион", trigger: "blur" },
  ],
  position: [
    {
      required: true,
      message: "Пожалуйста, введите образование",
      trigger: "blur",
    },
  ],
  ethnicity: [
    {
      required: true,
      trigger: "blur",
      message: "Пожалуйста, введите этническую принадлежность",
    },
  ],
  type_health_insurance: [
    {
      required: true,
      trigger: "blur",
      message: "Пожалуйста, введите вид медицинской страховки",
    },
  ],
  biography: [
    {
      required: true,
      trigger: "blur",
      message: "Пожалуйста, введите биографию",
    },
  ],
};

const showModal = () => {
  isModalOpen.value = !isModalOpen.value;
  if (isModalOpen && demografic.value.length > 0) {
    formState.value.city = demografic.value[0].city;
    formState.value.region = demografic.value[0].region;
    formState.value.position = demografic.value[0].position;
    formState.value.ethnicity = demografic.value[0].ethnicity;
    formState.value.type_health_insurance =
      demografic.value[0].type_health_insurance;
    formState.value.biography = demografic.value[0].biography;
  }
};

const handleOk = async () => {
  if (!demografic.value.length) {
    demograficPinia.addDemografic({ ...formState.value }, () => {
      showModal();
      demograficPinia.getDemografic();
    });
  } else {
    demograficPinia.updateDemografic(
      { ...formState.value },
      demografic.value[0].id,
      () => {
        showModal();
        demograficPinia.getDemografic();
      }
    );
  }
};
</script>

<template>
  <div
    class="h-full text-sm text-blue-700 bg-white rounded-xl py-7 px-9 max-sm:p-5"
  >
    <div class="flex items-center justify-between mb-6">
      <span class="text-xl font-semibold">Демографические данные:</span>
      <span
        v-if="demografic.length"
        class="text-xl text-blue-700/60 hover:text-blue-700 hover:cursor-pointer tr-3"
        @click="showModal"
      >
        <pen />
      </span>
      <a-button v-else type="primary" danger @click="showModal">
        <plus />
      </a-button>
    </div>

    <div v-if="demografic.length" class="grid grid-cols-3 gap-4 max-sm:grid-cols-2 ">
      <template v-for="(item, i) in dataDemo" :key="i">
        <div class="font-semibold ">{{ item.name }}:</div>
        <div class="col-span-2 max-sm:col-span-1">{{ item.value }}</div>
      </template>
    </div>

    <div v-else class="flex items-center justify-center flex-grow">
      <a-empty description="Нет данных" />
    </div>

    <a-modal
      v-model:open="isModalOpen"
      :title="demografic.length ? 'Редактирование данных' : 'Добавить данных'"
      @ok="handleOk"
    >
      <a-form :model="formState" :rules="rules" layout="vertical">
        <a-form-item label="Страна" name="city">
          <a-input
            v-model:value="formState.city"
            placeholder="Введите cтрана"
          />
        </a-form-item>
        <a-form-item label="Город" name="region">
          <a-input
            v-model:value="formState.region"
            placeholder="Введите город"
          />
        </a-form-item>
        <a-form-item label="Образование" name="position">
          <a-input
            v-model:value="formState.position"
            placeholder="Введите образование"
          />
        </a-form-item>
        <a-form-item label="Этническая принадлежность" name="ethnicity">
          <a-input
            v-model:value="formState.ethnicity"
            placeholder="Введите этническую принадлежность"
          />
        </a-form-item>
        <a-form-item
          label="Вид медицинской страховки"
          name="type_health_insurance"
        >
          <a-input
            v-model:value="formState.type_health_insurance"
            placeholder="Введите вид страховки"
          />
        </a-form-item>
        <a-form-item label="Биография" name="biography">
          <a-input
            v-model:value="formState.biography"
            placeholder="Введите биографию"
          />
        </a-form-item>
      </a-form>
      <template #footer>
        <div class="flex items-center justify-end gap-2">
          <a-button @click="updated" danger>Отмена</a-button>

          <a-button
            v-if="!demografic.length"
            type="primary"
            :loading="submitting"
            @click="handleOk"
            >Добавить</a-button
          >
          <a-button
            v-else
            type="primary"
            :loading="submitting"
            @click="handleOk"
            >Сохранить</a-button
          >
        </div>
      </template>
    </a-modal>
  </div>
</template>
