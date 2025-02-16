<script setup>
import { storeToRefs } from "pinia";
import useUser from "@/stores/user.pinia";
import useInterest from "@/stores/interest.pinia";

import plus from "../icons/plus.vue";
import pen from "../icons/pen.vue";
import Delete from "../icons/delete.vue";
import dots from "../icons/dots.vue";

import { ref, onMounted, reactive } from "vue";

const userPinia = useUser();
const interestPinia = useInterest();

const { user } = storeToRefs(userPinia);
const { interest, interestOne } = storeToRefs(interestPinia);

const open = ref(false);
const activePopover = ref(-1);
const submitting = ref(false);
const edit = ref(-1);
const formRef = ref(null);

const formState = reactive({
  interest: "",
});

const togglePopover = (id) => {
  activePopover.value = activePopover.value === id ? -1 : id;
};

const rules = {
  interest: [
    { required: true, message: "Пожалуйста, введите интерес", trigger: "blur" },
  ],
};

function saved() {
  submitting.value = false;
  formState.interest = "";
  open.value = false;
  interestPinia.getInterest();
}

const handleSubmit = async () => {
  await formRef.value.validate();
  submitting.value = true;
  if (edit.value !== -1) {
    await interestPinia.updateInterest(
      {
        name: formState.interest.trim(),
        user: user.value?.id,
      },
      edit.value,
      () => {
        edit.value = -1;
        saved();
      }
    );
  } else {
    await interestPinia.addInterest(
      {
        name: formState.interest.trim(),
        user: user.value?.id,
      },
      () => {
        saved();
      }
    );
  }
};

const toggleOpen = (id = -1) => {
  open.value = !open.value;
  edit.value = id;
  formState.interest = "";
  if (edit.value != -1) {
    interestPinia.getInterestId(id, () => {
      formState.interest = interestOne.value?.name;
    });
  } else {
    formState.interest = "";
  }
};

onMounted(() => {
  interestPinia.getInterest();
});
</script>
<template>
  <div class="flex flex-col h-full bg-white py-7 px-9 rounded-xl gap-7 max-sm:p-5">
    <div class="flex items-center justify-between">
      <span class="text-xl font-semibold text-blue-700"> Мои интересы </span>
      <a-button type="primary" danger @click="toggleOpen(-1)">
        <div class="flex items-center gap-2">
          <span class="text-lg xl:!hidden">
            <plus />
          </span>
          <span class="text-base max-xl:!hidden "> Добавить </span>
        </div>
      </a-button>
    </div>
    <div
      v-if="interest?.length > 0"
      class="flex flex-wrap items-center gap-3.5 text-sm text-blue-700"
    >
      <div
        class="flex items-center gap-10 px-4 py-2 border rounded-2xl border-blue-700/20"
        v-for="(item, i) of interest"
        :key="i"
      >
        <span> {{ item.name }} </span>
        <a-popover
          :open="activePopover === item.id"
          title=""
          trigger="click"
          placement="bottom"
        >
          <template #content>
            <div class="flex flex-col items-center gap-2">
              <span
                type="link"
                class="flex text-lg text-blue-700/60 hover:text-blue-700 hover:cursor-pointer tr-3"
                @click="
                  () => {
                    toggleOpen(item.id);
                    activePopover = -1;
                  }
                "
              >
                <pen />
              </span>
              <a-button
                type="link"
                danger
                class="!px-0 text-lg"
                @click="
                  () => {
                    interestPinia.deleteInterest(item.id);
                    activePopover = -1;
                  }
                "
              >
                <Delete />
              </a-button>
            </div>
          </template>
          <span
            @click="togglePopover(item.id)"
            class="flex text-lg hover:cursor-pointer text-blue-700/60 hover:text-blue-700 tr-3"
          >
            <dots />
          </span>
        </a-popover>
      </div>
    </div>
    <div v-else class="flex items-center justify-center flex-grow">
      <a-empty description="Нет данных" />
    </div>
  </div>
  <a-modal
    v-model:open="open"
    :title="!edit ? 'Заменить интересы' : 'Добавить интересы'"
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
      <a-form-item label="" name="interest">
        <a-input
          v-model:value="formState.interest"
          placeholder="Название интереса"
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
