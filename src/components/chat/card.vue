<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import WebSocketService from "@/utils/websocket";

const convoId = "123"; // Replace with dynamic convo ID
const userToken = localStorage.getItem("access_token"); // Get token from localStorage
const chatMessages = ref([]);
let wsService = null;

onMounted(() => {
  if (!userToken) {
    console.error("No access token found!");
    return;
  }
  wsService = new WebSocketService(convoId, userToken);
  wsService.connect();
});

const sendMessage = () => {
  const message = { text: "Hello!", sender: "user" };
  wsService.sendMessage(message);
};

onUnmounted(() => {
  if (wsService) wsService.close();
});
</script>

<template>
  <div>
    <button @click="sendMessage">Send Message</button>
  </div>
</template>
