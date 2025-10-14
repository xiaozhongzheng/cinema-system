<template>
  <div>{{ time }}秒</div>
</template>

<script setup lang='ts'>
import { ref, reactive,onMounted,onUnmounted } from 'vue'
let time = ref(60)
const fn = () => {
    setInterval(() => {
        time.value = time.value - 1
    },500)
}
onMounted(() => {
    fn()
})
</script>


<style lang='scss' scoped>

</style>