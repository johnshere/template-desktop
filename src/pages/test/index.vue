<template>
    <div class="test">
        <h1>这是一个测试页面</h1>
        <button @click="router.push('/')">返回首页</button>
    </div>
</template>
<script lang="ts" setup>
import { useRouter } from 'vue-router'
const router = useRouter()
const route = useRoute()
onMounted(() => {
    console.log('id', route.query.id)
})
</script>
<style scoped>
.test {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
}
</style>
