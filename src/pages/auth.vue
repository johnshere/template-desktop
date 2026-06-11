<template>
    <div class="auth-layout">
        <div class="auth-card">
            <RouterView />
        </div>
    </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.auth-layout {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    background: linear-gradient(135deg, #0ea5e9, #6366f1);
}
.auth-card {
    width: 360px;
    padding: 32px;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}
</style>
