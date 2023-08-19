<script setup>
import {onMounted} from 'vue'
import {initCity} from './entry/index.js'

onMounted(() => {
  // 初始化三维场景
  initCity();
})
</script>

<template>
  <canvas id="webgl">浏览器不支持canvas，请切换浏览器重试</canvas>
</template>

<style scoped>

</style>
