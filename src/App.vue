<script setup>
import { RouterLink, RouterView } from "vue-router";
import theme from "@/utils/theme.js";
</script>

<template>
  <a-config-provider :theme="theme">
    <router-view />
  </a-config-provider>
</template>
