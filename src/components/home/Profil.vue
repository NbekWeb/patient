<script setup>
import { ref, reactive, onMounted } from "vue";
import useUser from "@/stores/user.pinia";
import { storeToRefs } from "pinia";
import userIcon from "../icons/user.vue";
import uploadIcon from "../icons/upload.vue";
import deleteIcon from "../icons/delete.vue";

import { message } from "ant-design-vue";
import dayjs from "dayjs";
import { defineEmits } from "vue";

const emit = defineEmits(["cancel"]);

const userPinia = useUser();
const { user } = storeToRefs(userPinia);

const formState = reactive({
  first_name: "",
  last_name: "",
  birth_date: null,
  avatar: null,
  upload: null,
  email: "",
});

const new_password = ref("");
const fileInput = ref(null);
const formRef = ref();

const triggerFileInput = () => {
  fileInput.value.click();
};

const rules = {
  first_name: [{ required: true, message: "Введите имя", trigger: "blur" }],
  last_name: [{ required: true, message: "Введите фамилию", trigger: "blur" }],
  birth_date: [
    { required: true, message: "Выберите дату рождения", trigger: "change" },
  ],
};

const save = async () => {
  try {
    await formRef.value.validate();
    if (!!formState.upload) {
      userPinia.updateUser(
        {
          ...formState,
          username: user.value.username,
          email: user.value.email,
        },
        () => {
          if (new_password.value) {
            userPinia.updatePassword({ new_password: new_password.value });
          }
          handleCancel();
        }
      );
    } else {
      const data = {
        first_name: formState.first_name,
        last_name: formState.last_name,
        birth_date: formState.birth_date,
        username: user.value.username,
        email: user.value.email,
      };
      if (!formState.avatar) {
        data.avatar = null;
      }
      userPinia.updateUser({ ...data }, () => {
        if (new_password.value) {
          userPinia.updatePassword({ new_password: new_password.value });
        }
        handleCancel();
      });
    }
  } catch (error) {
    message.error("Пожалуйста, заполните форму корректно!");
  }
};

const handleCancel = () => {
  emit("cancel");
};

const deleteAvatar = () => {
  formState.avatar = null;
  formState.upload = null;
};

const handleAvatarChange = (event) => {
  const file = event.target.files[0];
  if (file && file.type.startsWith("image/")) {
    formState.avatar = file;
    formState.upload = URL.createObjectURL(file);
  } else {
    message.error("Please select a valid image file.");
  }
};

onMounted(() => {
  formState.first_name = `${user.value.first_name}`;
  formState.last_name = `${user.value.last_name}`;
  formState.avatar = user.value.avatar;
  formState.birth_date = dayjs(user.value.birth_date, "YYYY-MM-DD");
});
</script>
<template>
  <div class="flex gap-5 mt-5 max-sm:flex-col">
    <div class="relative w-28 h-28 group max-sm:mx-auto">
      <a-avatar
        class="flex items-center w-full h-full text-blue-700 hover:cursor-pointer group-hover:opacity-40"
        v-if="!formState.upload && !formState.avatar"
      >
        <user-icon class="text-5xl" />
      </a-avatar>
      <img
        v-else
        :src="formState.upload ? formState.upload : formState.avatar"
        class="object-cover w-full h-full rounded-full group-hover:opacity-40"
      />
      <div
        class="absolute items-center justify-center hidden w-full h-full gap-2 text-lg -translate-x-1/2 -translate-y-1/2 rounded-full top-1/2 left-1/2 bg-black/30 group-hover:flex tr-3"
      >
        <span
          v-if="formState.avatar || formState.upload"
          class="text-red-500/60 hover:cursor-pointer tr-3 hover:text-red-500"
          @click="deleteAvatar"
        >
          <delete-icon />
        </span>
        <span
          class="text-black/60 hover:cursor-pointer tr-3 hover:text-black"
          @click="triggerFileInput"
        >
          <upload-icon />
        </span>
      </div>
      <input
        type="file"
        ref="fileInput"
        accept="image/*"
        @change="handleAvatarChange"
        class="absolute bottom-0 right-0 hidden"
      />
    </div>
    <a-form
      class="flex-grow"
      layout="vertical"
      :model="formState"
      :rules="rules"
      ref="formRef"
      @finish="save"
    >
      <a-form-item label="Имя" name="first_name">
        <a-input v-model:value="formState.first_name" placeholder="Имя" />
      </a-form-item>
      <a-form-item label="Фамилия" name="last_name">
        <a-input v-model:value="formState.last_name" placeholder="Логин" />
      </a-form-item>
      <a-form-item label="Дата рождения" name="birth_date">
        <a-date-picker
          class="w-full"
          v-model:value="formState.birth_date"
          picker="date"
          placeholder="Дата рождения"
        />
      </a-form-item>
      <a-form-item label="Новый пароль">
        <a-input
          type="password"
          v-model:value="new_password"
          placeholder="Пароль"
        />
      </a-form-item>
      <div class="flex justify-end gap-5 max-sm:justify-between">
        <a-form-item>
          <a-button
            @click="handleCancel"
            danger
            class="flex justify-center w-full text-base font-bold"
            >Отменить</a-button
          >
        </a-form-item>
        <a-form-item>
          <a-button
            type="primary"
            danger
            html-type="submit"
            class="flex justify-center w-full text-base font-bold"
            >Сохранить</a-button
          >
        </a-form-item>
      </div>
    </a-form>
  </div>
</template>
