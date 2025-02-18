<script setup>
import { storeToRefs } from "pinia";
import useUser from "@/stores/user.pinia";
import useNotes from "@/stores/notes.pinia";
import dayjs from "dayjs";
import plus from "../icons/plus.vue";

import noteCard from "./note.vue";
import "dayjs/locale/ru";

import { ref, onMounted, reactive } from "vue";

dayjs.locale("ru");

const userPinia = useUser();
const notesPinia = useNotes();

const { user } = storeToRefs(userPinia);
const { notes, noteOne } = storeToRefs(notesPinia);

const open = ref(false);
const submitting = ref(false);
const formRef = ref(null);

const formState = reactive({
  notes: "",
  date: null,
});

const toggleOpen = () => {
  open.value = !open.value;
};

const handleSubmit = async () => {
  await formRef.value.validate();
  submitting.value = true;
  const [startDate, endDate] = formState.date || [];

  await notesPinia.addNotes(
    {
      notes: formState.notes.trim(),
      user: user.value?.id,
      start_date: dayjs(startDate).format("YYYY-MM-DD"),
      end_date: dayjs(endDate).format("YYYY-MM-DD"),
    },
    () => {
      saved();
    }
  );
};

function saved() {
  submitting.value = false;
  formState.notes = "";
  formState.date = null;
  open.value = false;
  notesPinia.getNotes();
}

const rules = {
  notes: [{ required: true, message: "Введите имя", trigger: "blur" }],
  date: [{ required: true, message: "Выберите дата", trigger: "change" }],
};

onMounted(() => {
  notesPinia.getNotes();
});
</script>
<template>
  <div class="flex flex-col bg-white gap-7 rounded-xl py-7 px-9 max-sm:p-5">
    <div class="flex items-center justify-between">
      <span class="text-xl font-semibold text-blue-700"> Мои заметки: </span>
      <a-button type="primary" danger @click="toggleOpen">
        <span class="text-lg xl:!hidden"><plus /></span>
        <span class="px-8 max-xl:!hidden">Добавить заметку</span>
      </a-button>
    </div>
    <div
      v-if="notes?.length > 0"
      class="grid grid-cols-3 gap-5 max-lg:grid-cols-2 max-sm:grid-cols-1"
    >
      <note-card :note="note" v-for="(note, i) in notes" :key="i" />
    </div>
    <a-empty description="Нет данных" v-else />
  </div>
  <a-modal
    v-model:open="open"
    title="Добавить заметку"
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
      <a-form-item label="Название заметки" name="notes">
        <a-input
          v-model:value="formState.notes"
          placeholder="Введите  заметки"
        />
      </a-form-item>
      <a-form-item label="Дата" name="date">
        <a-range-picker
          :placeholder="['Начальная дата', 'Конечная дата']"
          class="w-full"
          v-model:value="formState.date"
        />
      </a-form-item>
    </a-form>
    <template #footer>
      <div class="flex items-center justify-end gap-2">
        <a-button @click="toggleOpen" danger>Отмена</a-button>

        <a-button type="primary" :loading="submitting" @click="handleSubmit"
          >Добавить</a-button
        >
      </div>
    </template>
  </a-modal>
</template>
