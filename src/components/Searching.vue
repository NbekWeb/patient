<script setup>
import search from "@/components/icons/search.vue";
import { storeToRefs } from "pinia";
import useUser from "@/stores/user.pinia";
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";

const userPinia = useUser();
const router = useRouter();

const menuRef = ref(null);
const inputRef = ref(null);
const last_name = ref("");
const open = ref(false);
const { searching } = storeToRefs(userPinia);

let debounceTimer = null;

function opened() {
  open.value = true;
}

const handleSearch = () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    if (last_name.value) {
      opened();
      userPinia.searchUser({ last_name: last_name.value });
    }
  }, 300);
};
function handleClickOutside(event) {
  const menuEl = menuRef.value?.$el || menuRef.value;
  const inputEl = inputRef.value?.$el || inputRef.value;

  if (
    menuEl &&
    !menuEl.contains(event.target) &&
    inputEl &&
    !inputEl.contains(event.target)
  ) {
    open.value = false;
  }
}

function goUser(id) {
  router.push({ name: "user", params: { id } });
  last_name.value = "";
}

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<template>
  <div class="relative">
    <a-input
      ref="inputRef"
      v-model:value="last_name"
      @input="handleSearch"
      @focus="opened"
      @click="opened"
      placeholder="Поиск по сайту"
      class="min-w-80"
    >
      <template #suffix> <search /> </template>
    </a-input>
    <a-menu
      ref="menuRef"
      class="absolute w-full top-12"
      v-if="last_name && open"
    >
      <template v-if="searching.length > 0">
        <a-menu-item
          :key="i"
          v-for="(item, i) in searching"
          @click="goUser(item.id)"
        >
          {{ item.last_name }}
          {{ item.first_name }}
          <span class="pl-2 text-blue-700 "> @{{ item.username }} </span>
        </a-menu-item>
      </template>
      <a-menu-item disabled v-else> Нет данных </a-menu-item>
    </a-menu>
  </div>
</template>
