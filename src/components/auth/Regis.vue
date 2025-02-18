<script setup>
import { reactive, onMounted, ref } from "vue";
import { message } from "ant-design-vue";
import { RouterLink, useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import useAuth from "@/stores/auth.pinia";
import useCore from "@/stores/core.pinia";
import refresh from "../icons/refresh.vue";

const auth = useAuth();
const core = useCore();
const router = useRouter();

const { loadingUrl } = storeToRefs(core);
const { captcha } = storeToRefs(auth);

const formRef = ref();

const formState = reactive({
  email: "",
  username: "",
  password: "",
  password_confirm: "",
  birth_date: null,
  is_agree: false,
  first_name: "",
  last_name: "",
  captcha_value: "",
});

// const formState = reactive({
//   email: "nbekdevsa@gmail.com",
//   username: "nbeksa1",
//   password: "Nbek2003",
//   password_confirm: "Nbek2003",
//   birth_date: '2020-02-02',
//   is_agree: true,
//   first_name: "Нодирбек ",
//   last_name: "Наджмиддинов",
//   captcha_value: "SNWZ",
// });

const validatePasswordConfirm = (_, value) => {
  if (!value) {
    return Promise.reject("Подтвердите пароль");
  }
  if (value !== formState.password) {
    return Promise.reject("Пароли не совпадают");
  }
  return Promise.resolve();
};

const redirectToVK = () => {
  window.location.href =
    "https://oauth.vk.com/authorize?client_id=52982778&redirect_uri=https://patient-opal.vercel.app/auth/vk/login/callback/&display=page&scope=email&response_type=code&v=5.131";
};
const rules = {
  email: [
    { required: true, message: "Введите ваш  email", trigger: "blur" },
    {
      type: "email",
      message: "Введите корректный email",
      trigger: ["blur"],
    },
  ],
  first_name: [{ required: true, message: "Введите имя", trigger: "blur" }],
  last_name: [{ required: true, message: "Введите фамилию", trigger: "blur" }],
  username: [
    { required: true, message: "Введите ваш логин ", trigger: "blur" },
  ],
  password: [{ required: true, message: "Введите пароль", trigger: "blur" }],
  password_confirm: [{ validator: validatePasswordConfirm, trigger: "blur" }],
  birth_date: [
    { required: true, message: "Выберите дату рождения", trigger: "change" },
  ],
  is_agree: [
    {
      validator: (_, value) =>
        value ? Promise.resolve() : Promise.reject("Необходимо согласие"),
      trigger: ["blur", "change"],
    },
  ],
  captcha_value: [
    { required: true, message: "Введите капча", trigger: ["blur", "change"] },
  ],
};

const handleSubmit = async () => {
  try {
    await formRef.value.validate();
    auth.postRegis(
      { ...formState, captcha_key: captcha.value.captcha_key },
      () => {
        auth.postLogin(
          {
            identifier: formState.username,
            captcha_value: formState.captcha_value,
            captcha_key: captcha.value.captcha_key,
            password: formState.password,
          },
          () => {
            router.push({ name: "home" });
          }
        );
      }
    );
  } catch (error) {
    message.error("Пожалуйста, заполните форму корректно!");
  }
};

onMounted(() => {
  auth.getCaptcha();
});
</script>
<template>
  <a-spin
    :spinning="
      loadingUrl.has('auth/captcha') ||
      loadingUrl.has('auth/login') ||
      loadingUrl.has('auth/regis')
    "
  >
    <h3 class="flex justify-center text-3xl font-semibold text-blue-700 mb-7">
      Регистрация
    </h3>
    <a-form
      layout="vertical"
      :model="formState"
      :rules="rules"
      ref="formRef"
      @finish="handleSubmit"
    >
      <a-form-item label="Email" name="email">
        <a-input v-model:value="formState.email" placeholder="Email" />
      </a-form-item>

      <a-form-item label="Логин" name="username">
        <a-input v-model:value="formState.username" placeholder="Логин" />
      </a-form-item>
      <a-form-item label="Имя" name="first_name">
        <a-input v-model:value="formState.first_name" placeholder="Имя" />
      </a-form-item>
      <a-form-item label="Фамилия" name="last_name">
        <a-input v-model:value="formState.last_name" placeholder="Фамилия" />
      </a-form-item>

      <a-form-item label="Дата рождения" name="date">
        <a-date-picker
          class="w-full"
          v-model:value="formState.birth_date"
          picker="date"
          placeholder="Дата рождения"
        />
      </a-form-item>
      <a-form-item name="password" label="Пароль">
        <a-input
          type="password"
          v-model:value="formState.password"
          placeholder="Пароль"
        />
      </a-form-item>
      <a-form-item label="Подтвердите пароль" name="password_confirm">
        <a-input
          type="password"
          v-model:value="formState.password_confirm"
          placeholder="Подтвердите пароль"
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

      <a-form-item name="is_agree">
        <a-checkbox v-model:checked="formState.is_agree">
          Я согласен с условиями использования и политикой конфиденциальности
        </a-checkbox>
      </a-form-item>
      <a-form-item>
        <a-button
          type="primary"
          danger
          html-type="submit"
          class="flex justify-center w-full text-base font-bold"
          >Регистрация</a-button
        >
      </a-form-item>
    </a-form>
    <div class="flex flex-col gap-4 mt-6">
      <router-link
        :to="{ name: 'login' }"
        class="flex justify-center text-sm text-blue-700 underline opacity-60 hover:opacity-100 tr-3"
        >Войти в аккаунт</router-link
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
      <a-button
        @click="redirectToVK"
        class="flex justify-center w-full"
        type="primary"
      >
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
