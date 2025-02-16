<script setup>
import pen from "../icons/pen.vue";
import dots from "../icons/dots.vue";
import Delete from "../icons/delete.vue";
import "dayjs/locale/ru";
import dayjs from "dayjs";

import { storeToRefs } from "pinia";
import useUser from "@/stores/user.pinia";
import useNotes from "@/stores/notes.pinia";
import { ref, reactive, onMounted } from "vue";

dayjs.locale("ru");

const userPinia = useUser();
const notesPinia = useNotes();

const { user } = storeToRefs(userPinia);

const props = defineProps({
  note: Object,
  guest: {
    type: Boolean,
    default: true,
  },
});

const formState = reactive({
  notes: "",
  date: null,
});

const open = ref(false);
const submitting = ref(false);
const visible = ref(false);
const formRef = ref(null);

const rules = {
  notes: [{ required: true, message: "Введите имя", trigger: "blur" }],
  date: [{ required: true, message: "Выберите дата", trigger: "change" }],
};

function close() {
  visible.value = false;
}

const toggleOpen = () => {
  open.value = !open.value;
};

const handleSubmit = async () => {
  await formRef.value.validate();
  submitting.value = true;
  const [startDate, endDate] = formState.date || [];

  await notesPinia.updateNote(
    {
      notes: formState.notes.trim(),
      user: user.value?.id,
      start_date: dayjs(startDate).format("YYYY-MM-DD"),
      end_date: dayjs(endDate).format("YYYY-MM-DD"),
    },
    props.note.id,
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

onMounted(() => {
  formState.notes = props.note.notes;
  formState.date = [dayjs(props.note.start_date), dayjs(props.note.end_date)];
});
</script>
<template>
  <div
    class="flex justify-between py-6 border rounded-xl border-blue-700/20 px-7"
  >
    <div class="flex text-sm flex-col gap-2.5 text-blue-700">
      <span class="text-lg font-semibold"> {{ note.notes }} </span>
      <span
        >{{ dayjs(note.start_date).format("D MMMM") }} -
        {{ dayjs(note.end_date).format("D MMMM") }}</span
      >
    </div>
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
                notesPinia.deleteNote(note.id);
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
    <a-modal
      v-model:open="open"
      title="Заменить заметку"
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
            >Сохранить</a-button
          >
        </div>
      </template>
    </a-modal>
  </div>
</template>
