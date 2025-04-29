<template>
    <el-config-provider namespace="eu" :locale="zhCn">
        <RouterView />
    </el-config-provider>
</template>
<script lang="ts" setup>
import zhCn from 'element-plus/es/locale/lang/zh-cn'
if (location.href.includes('/ui/portal-sup/#/')) {
    const dom = document.body
    const color = '#ff6000'
    dom.style.setProperty('--eu-color-primary', color)
    dom.style.setProperty('--eu-color-primary-light-3', color + 'cc') //0.8
    dom.style.setProperty('--eu-color-primary-light-5', color + 'b2') //0.7
    dom.style.setProperty('--eu-color-primary-light-7', color + '7f') //0.5
    dom.style.setProperty('--eu-color-primary-light-8', color + '4d') //0.3
    dom.style.setProperty('--eu-color-primary-light-9', color + '1a') //0.1
    dom.style.setProperty('--eu-color-primary-dark-2', 'var(--eu-color-primary-light-3)')
}
</script>
<style lang="scss">
html,
body,
#deposit-app {
    height: 100%;
}
#micro-app-container #deposit-app {
    height: unset;
    position: absolute;
    top: 0;
    left: 0;
    right: -6px;
    bottom: -12px;
    overflow: hidden;
    background-color: #fff;
}
</style>
