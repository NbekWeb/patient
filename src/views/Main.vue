<script setup>
import { onMounted, onUnmounted, ref } from "vue";
import { RouterView, useRouter } from "vue-router";

import userIcon from "../components/icons/user.vue";
import upload from "@/components/icons/upload.vue";
import cheron from "@/components/icons/cheron.vue";
import menuIcon from "@/components/icons/menu.vue";

import useUser from "@/stores/user.pinia";
import { storeToRefs } from "pinia";
import Searching from "@/components/Searching.vue";

const userPinia = useUser();
const router = useRouter();

const { user } = storeToRefs(userPinia);

const navbar = [
  {
    name: "Главная",
    path: "home",
  },
  {
    name: "Сообщество",
    path: "community",
  },
  {
    name: "Блог",
    path: "blog",
  },
  {
    name: "Справочник",
    path: "catalog",
  },
];

const goNav = (name) => {
  router.push({ name });
  if (menuOpen.value) {
    menuOpen.value = false;
  }
};

const visible = ref(false);
const menuOpen = ref(false);

function logOut() {
  localStorage.removeItem("access_token");
  router.push({ name: "login" });
}

function handleScroll() {
  visible.value = false;
}

function closeMenu(event) {
  if (
    !event.target.closest(".mobile-menu") &&
    !event.target.closest(".menu-icon")
  ) {
    menuOpen.value = false;
  }
}

onMounted(() => {
  userPinia.getUser();
  document.addEventListener("click", closeMenu);
  document.addEventListener("scroll", handleScroll);
});
onUnmounted(() => {
  document.removeEventListener("click", closeMenu);
  document.removeEventListener("scroll", handleScroll);
});
</script>
<template>
  <div class="flex flex-col min-h-screen ">
    <div
      class="sticky top-0 w-full bg-white px-30 max-lg:px-10 max-sm:px-5 z-[999] max-xl:px-15 sm:h-15 flex sm:items-center max-sm:py-2.5 max-sm:flex-col gap-2.5"
    >
      <div class="flex items-center justify-between w-full">
        <div class="flex items-center gap-20 max-xl:gap-15 max-lg:gap-10">
          <div class="flex items-center gap-4">
            <span
              @click.stop="menuOpen = !menuOpen"
              class="text-xl text-blue-700 lg:hidden"
            >
              <menu-icon />
            </span>
            <router-link :to="{ name: 'home' }">
              <span class="flex text-xl font-semibold text-blue-700"
                >Logo
              </span>
            </router-link>
          </div>
          <Searching class="max-sm:hidden" />
        </div>
        <div
          class="fixed inset-y-0 left-0 bg-white shadow-lg transform transition-all duration-300 mobile-menu z-[1000] max-lg:w-[300px] max-sm:w-full lg:hidden"
          :class="menuOpen ? 'translate-x-0' : '-translate-x-full'"
        >
          <div class="flex flex-col h-full p-5">
            <button
              class="self-end text-xl text-blue-700"
              @click="menuOpen = false"
            >
              &times;
            </button>

            <nav class="flex flex-col gap-5 mt-5 text-blue-700">
              <span
                v-for="(item, i) of navbar"
                :key="i"
                @click="goNav(item.path)"
                class="text-lg font-medium hover:text-blue-900 hover:cursor-pointer"
              >
                {{ item.name }}
              </span>
            </nav>
          </div>
        </div>
        <div
          class="flex items-center text-sm text-blue-700 gap-7 max-lg:hidden"
        >
          <span
            @click="goNav(item.path)"
            class="font-medium opacity-80 hover:opacity-100 hover:cursor-pointer tr-3"
            v-for="(item, i) of navbar"
            :key="i"
          >
            {{ item.name }}
          </span>
        </div>

        <a-dropdown
          :trigger="['click']"
          v-model:open="visible"
          placement="bottom"
        >
          <template #overlay>
            <a-menu>
              <a-menu-item @click="logOut">
                <div
                  class="flex items-center gap-2 text-blue-700 main-popover hover:cursor-pointer"
                >
                  <span class="text-base font-medium">Выход</span>
                  <span class="flex text-xl text-red-500 transform rotate-90">
                    <upload />
                  </span>
                </div>
              </a-menu-item>
            </a-menu>
          </template>

          <div class="flex items-center gap-3 hover:cursor-pointer group">
            <div class="relative w-10 h-10">
              <a-avatar
                class="flex items-center w-full h-full text-xl text-blue-700 hover:cursor-pointer tr-3 hover:qopacity-60"
                v-if="!user.avatar"
              >
                <user-icon />
              </a-avatar>
              <img
                v-else
                :src="user.avatar"
                class="object-cover w-full h-full rounded-full"
              />
            </div>

            <span
              class="flex text-lg text-blue-700/60 group-hover:text-blue-700"
            >
              <cheron />
            </span>
          </div>
        </a-dropdown>
      </div>
      <searching class="sm:hidden" />
    </div>
    <div class="flex flex-col flex-grow overflow-y-auto blue-scrollbar">
      <div
        class="flex-grow py-10 bg-blue-100 px-30 max-sm:px-5 max-lg:px-10 max-xl:px-15 max-sm:py-6"
      >
        <router-view />
      </div>
      <div
        class="flex flex-wrap items-center justify-between gap-2.5 text-blue-700 bg-white px-30 max-sm:px-5 sm:h-15 max-lg:px-10 max-xl:px-15 max-sm:py-2.5"
      >
        <span class="flex text-xl font-semibold min-w-36">Logo </span>
        <span class="text-sm opacity-60"
          >(c) 2005-2025 LogoCompany. Все права защищены</span
        >
      </div>
    </div>
  </div>
</template>
