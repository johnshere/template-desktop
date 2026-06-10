<template>
    <div class="test">
        <h1>这是一个测试页面</h1>
        <button @click="router.push('/')">返回首页</button>
    </div>
</template>

<script lang="ts" setup>
// vue-router 5: 传入路由名让 typed routes 窄化 params 类型
const router = useRouter()
const route = useRoute('/test/[id]')

onMounted(() => {
    console.log('id', route.params.id)
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
