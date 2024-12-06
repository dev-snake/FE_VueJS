<script setup lang="ts">
import { onBeforeUpdate, onUpdated, ref, watch } from 'vue'

const count = ref(0)
const inreament = () => {
  count.value++
}
onUpdated(() => {
  console.log('Component has updated ...', count.value)
})
onBeforeUpdate(() => {
  console.log('Before updated ...', count.value)
})
watch(count, (newValue, oldValue) => {
  console.log(`Count changed from ${oldValue} to ${newValue}`)
})
console.log(count.value)
</script>
<template>
  <main>
    <h1 class="">home view {{ count }}</h1>
    <div class="container justify-content-center">
      <button class="btn btn-primary" @click="inreament">click me</button>
    </div>
  </main>
</template>
