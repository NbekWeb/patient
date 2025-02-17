<script setup>
import { RouterView } from "vue-router";
</script>
<template>
  <div class="text-blue-700">
    <div class="flex flex-col gap-6 max-sm:gap-4">
      <div class="flex flex-col gap-6 max-sm:gap-4">
        <div class="flex items-center gap-3 text-sm">
          <router-link :to="{ name: 'main' }" class="text-blue-700"
            >Главная</router-link
          >
          <span>/</span>
          <router-link :to="{ name: 'chat' }" class="text-blue-700"
            >Сообщества</router-link
          >
        </div>
        <h2 class="text-4xl font-semibold">Сообщества</h2>
      </div>

      <router-view />
    </div>
  </div>
</template>
