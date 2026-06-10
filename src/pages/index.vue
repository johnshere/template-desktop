<template>
    <div class="home">
        <h1>BidAgent</h1>
        <p class="meta">{{ buildInfo }}</p>
    </div>
</template>

<script setup lang="ts">
const buildInfo = `v${import.meta.env.APP_VERSION} · ${import.meta.env.APP_BUILD_TIME}`
</script>

<style scoped lang="scss">
.home {
    padding: 24px;

    h1 {
        margin: 0 0 12px;
        font-size: 24px;
    }

    .meta {
        color: #64748b;
        font-size: 14px;
    }
}
</style>
