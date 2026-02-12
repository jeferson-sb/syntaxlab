<script setup lang="ts">
import { treaty, edenFetch } from '@elysiajs/eden'
import type { App } from '@backend/app'
// import Button from '@/components/Button.vue'

const api = treaty<App>('http://localhost:3000')
const fetch = edenFetch<App>('http://localhost:3000')

</script>

<template>
  <div>
    <h1>hey</h1>    
    <!-- <Button>Click me</Button> -->
  </div>
</template>

<style scoped>

</style>
