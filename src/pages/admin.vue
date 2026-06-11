<template>
    <div class="admin-layout">
        <aside class="sidebar">
            <div class="brand">BidAgent 后台</div>
            <nav>
                <RouterLink to="/admin/dashboard">仪表盘</RouterLink>
                <RouterLink to="/">← 回前台</RouterLink>
            </nav>
        </aside>
        <main class="content">
            <RouterView />
        </main>
    </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.admin-layout {
    display: grid;
    grid-template-columns: 200px 1fr;
    height: 100%;
}
.sidebar {
    background: #1e293b;
    color: #fff;
    padding: 16px;
    .brand {
        margin-bottom: 16px;
        font-weight: 600;
    }
    nav {
        display: flex;
        flex-direction: column;
        gap: 4px;
        a {
            color: #cbd5e1;
            text-decoration: none;
            padding: 6px 8px;
            border-radius: 4px;
            font-size: 14px;
            &:hover,
            &.router-link-active {
                background: #334155;
                color: #fff;
            }
        }
    }
}
.content {
    padding: 24px;
    overflow: auto;
}
</style>
