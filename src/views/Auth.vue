<script setup>
import { RouterView } from "vue-router";
</script>
<template>
  <div class="flex items-center justify-center w-full min-h-screen bg-blue-100">
    <div
      class="max-sm:!min-w-full max-sm:!w-full auth flex flex-col p-6 bg-white rounded-xl my-5 max-sm:my-0"
    >
      <RouterView />
    </div>
  </div>
</template>
<style scoped>
.auth {
  min-width: 376px;
  width: 376px;
}
</style>
