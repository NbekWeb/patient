<script setup>
import { ref, reactive, watch } from "vue";

import useMedical from "@/stores/medical.pinia";
import { storeToRefs } from "pinia";

import dayjs from "dayjs";
import { data } from "autoprefixer";

const props = defineProps({
  open: Boolean,
  id: {
    type: Number,
    default: -1,
  },
});

const medicalPinia = useMedical();
const { medicalAll, medicalOne } = storeToRefs(medicalPinia);

const emit = defineEmits(["update", "submit"]);

const submitting = ref(false);
const formRef = ref(null);

const formState = reactive({
  medical_illness: null,
  history: "",
  start_date: null,
});

const rules = {
  history: [{ required: true, message: "Введите медицинскую историю" }],
  medical_illness: [{ required: true, message: "Выберите заболевание" }],
  start_date: [{ required: true, message: "Выберите дату" }],
};

const handleSubmit = async () => {
  await formRef.value.validate();
  submitting.value = true;
  if (props.id == -1) {
    await medicalPinia.addMedical(
      {
        history: formState.history.trim(),
        medical_illness: formState.medical_illness,

        start_date: dayjs(formState.start_date).format("YYYY-MM-DD"),
      },
      () => {
        saved();
      }
    );
  } else {
    await medicalPinia.updateMedical(
      {
        history: formState.history.trim(),
        medical_illness: formState.medical_illness,
        start_date: dayjs(formState.start_date).format("YYYY-MM-DD"),
      },
      props.id,
      () => {
        saved();
      }
    );
  }
};

function saved() {
  submitting.value = false;
  formState.history = "";
  formState.medical_illness = null;
  formState.start_date = null;
  updated();
  medicalPinia.getMedicals();
}

function updated() {
  emit("update");
}

watch(
  () => props.open,
  (newVal) => {
    if (newVal && props.id !== -1) {
      medicalPinia.getMedical(props.id, () => {
        formState.history = medicalOne.value.history;
        formState.start_date = dayjs(medicalOne.value.start_date);
        formState.medical_illness = medicalOne.value.medical_illness.id;
      });
    }
  },
  { immediate: true }
);
</script>
<template>
  <a-modal
    @cancel="updated"
    :open="open"
    :title="id == -1 ? 'Добавить  история болезни' : 'Заменить история болезни'"
    :confirm-loading="submitting"
    @ok="handleSubmit"
  >
    <a-form
      ref="formRef"
      layout="vertical"
      class="my-5"
      :model="formState"
      :rules="rules"
      @submit.prevent="handleSubmit"
    >
      <a-form-item label="Медицинская история" name="history">
        <a-input
          v-model:value="formState.history"
          placeholder="Введите  история"
        />
      </a-form-item>
      <a-form-item label="Медицинское заболевание" name="medical_illness">
        <a-select
          v-model:value="formState.medical_illness"
          placeholder="Выберите заболевание"
        >
          <a-select-option
            v-for="medical in medicalAll"
            :key="medical.id"
            :value="medical.id"
          >
            {{ medical.name }}
          </a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item label="Дата" name="start_date">
        <a-date-picker
          class="w-full"
          v-model:value="formState.start_date"
          picker="date"
          placeholder="Начальная дата"
        />
      </a-form-item>
    </a-form>
    <template #footer>
      <div class="flex items-center justify-end gap-2">
        <a-button @click="updated" danger>Отмена</a-button>

        <a-button
          v-if="id == -1"
          type="primary"
          :loading="submitting"
          @click="handleSubmit"
          >Добавить</a-button
        >
        <a-button
          v-else
          type="primary"
          :loading="submitting"
          @click="handleSubmit"
          >Сохранить</a-button
        >
      </div>
    </template>
  </a-modal>
</template>
