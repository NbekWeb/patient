<script setup>
import { reactive, onMounted, ref, computed } from "vue";
import { message } from "ant-design-vue";
import { RouterLink, useRouter, useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import useAuth from "@/stores/auth.pinia";
import useCore from "@/stores/core.pinia";
import refresh from "../icons/refresh.vue";

const formState = reactive({
  identifier: "",
  password: "",
  captcha_value: "",
  remember: false,
});

const router = useRouter();
const route = useRoute();

const formRef = ref();
const callback_url = computed(() => {
  if (typeof window !== "undefined") {
    return new URL(route.fullPath, window.location.origin).href;
  }
  return "";
});

const auth = useAuth();
const core = useCore();

const { loadingUrl } = storeToRefs(core);
const { captcha } = storeToRefs(auth);

const rules = {
  identifier: [
    { required: true, message: "Введите ваш логин или email", trigger: "blur" },
  ],
  captcha_value: [
    { required: true, message: "Введите капча", trigger: ["blur", "change"] },
  ],
  password: [{ required: true, message: "Введите пароль", trigger: "blur" }],
};

const handleSubmit = async () => {
  try {
    await formRef.value.validate();
    auth.postLogin(
      { ...formState, captcha_key: captcha.value.captcha_key },
      () => {
        message.success("Успешный вход!");
        router.push({ name: "home" });
      }
    );
  } catch (error) {
    message.error("Пожалуйста, заполните форму корректно!");
  }
};

onMounted(() => {
  const token = localStorage.getItem("access_token");
  if (!!token) {
    router.push({ name: "home" });
  }
  auth.getCaptcha(() => {
    auth.postLoginVk(
      { callback_url: callback_url.value },
      () => {
        message.success("Успешный вход!");
        router.push({ name: "home" });
      },
      () => {
        router.push({ name: "login" });
      }
    );
  });
});
</script>
<template>
  <a-spin :spinning="loadingUrl.has('auth/captcha')">
    <h3 class="flex justify-center text-3xl font-semibold text-blue-700 mb-7">
      Вход
    </h3>

    <a-form
      layout="vertical"
      :model="formState"
      :rules="rules"
      ref="formRef"
      @finish="handleSubmit"
    >
      <a-form-item label="Ваш логин или email" name="identifier">
        <a-input
          v-model:value="formState.identifier"
          placeholder="Логин или email"
        />
      </a-form-item>
      <a-form-item name="password">
        <template #label>
          <span
            >Пароль
            <span class="underline opacity-60">Забыли пароль?</span></span
          >
        </template>
        <a-input
          type="password"
          v-model:value="formState.password"
          placeholder="Пароль"
        />
      </a-form-item>
      <img :src="captcha?.captcha_image_url" class="w-full rounded-xl" />

      <div class="flex items-center gap-5 my-4">
        <a-form-item class="!mb-0 flex-grow" name="captcha_value">
          <a-input
            placeholder="Капча"
            v-model:value="formState.captcha_value"
          />
        </a-form-item>
        <span
          class="flex h-full text-2xl text-blue-700 hover:cursor-pointer"
          @click="
            () => {
              auth.getCaptcha();
            }
          "
        >
          <refresh />
        </span>
      </div>
      <a-form-item name="remember">
        <a-checkbox v-model:checked="formState.remember"
          >Запомнить этот компютер</a-checkbox
        >
      </a-form-item>
      <a-form-item>
        <a-button
          type="primary"
          danger
          html-type="submit"
          class="flex justify-center w-full text-base font-bold"
          >Войти</a-button
        >
      </a-form-item>
    </a-form>
    <div class="flex flex-col gap-4 mt-6">
      <router-link
        :to="{ name: 'regis' }"
        class="flex justify-center text-sm !text-blue-700 !underline opacity-60 hover:opacity-100 tr-3"
      >
        Создать новый аккаунт</router-link
      >

      <div class="text-base font-bold text-blue-700 flex gap-3.5 items-center">
        <span class="flex-grow flex h-[1px] bg-blue-700 opacity-20"></span>
        <span>или</span>
        <span class="flex-grow flex h-[1px] bg-blue-700 opacity-20"></span>
      </div>
      <a-button class="flex justify-center w-full">
        <div
          class="py-1.5 flex gap-3.5 h-full items-center font-bold text-blue-700"
        >
          <img src="@/assets/img/logo.png" class="h-full" />
          Войти с помощью Госуслуги
        </div>
      </a-button>
      <a-button class="flex justify-center w-full" type="primary">
        <div
          class="py-1.5 flex gap-3.5 h-full items-center font-bold text-white"
        >
          <img src="@/assets/img/wk.png" class="h-4" />
          Войти с помощью Вконтакте
        </div>
      </a-button>
    </div>
  </a-spin>
</template>
<style scoped></style>
