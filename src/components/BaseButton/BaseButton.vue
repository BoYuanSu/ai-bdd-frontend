<script setup lang="ts">
defineEmits(["click"]);
</script>

<template>
  <button @click="$emit('click')"><slot /></button>
</template>
