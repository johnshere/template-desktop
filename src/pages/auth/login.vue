<template>
    <div class="login">
        <h2>登录</h2>
        <p class="hint">这是 auth layout 下的登录页。</p>
        <RouterLink class="back" to="/">← 返回首页</RouterLink>
    </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.login {
    h2 {
        margin: 0 0 16px;
        font-size: 22px;
    }
    .hint {
        color: #64748b;
        margin-bottom: 16px;
    }
    .back {
        color: #6366f1;
        text-decoration: none;
        font-size: 14px;
    }
}
</style>
