<template>
    <div class="default-layout">
        <header class="topbar">
            <div class="brand">BidAgent</div>
            <nav class="nav">
                <RouterLink to="/">首页</RouterLink>
                <RouterLink to="/auth/login">登录</RouterLink>
                <RouterLink to="/admin/dashboard">后台</RouterLink>
            </nav>
        </header>
        <main class="content">
            <RouterView />
        </main>
    </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.default-layout {
    display: grid;
    grid-template-rows: 60px 1fr;
    height: 100%;
}
.topbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 24px;
    background: #0f172a;
    color: #fff;
}
.brand {
    font-weight: 600;
    font-size: 18px;
}
.nav {
    display: flex;
    gap: 16px;
    a {
        color: #cbd5e1;
        text-decoration: none;
        &:hover,
        &.router-link-active {
            color: #fff;
        }
    }
}
.content {
    padding: 24px;
    overflow: auto;
}
</style>
