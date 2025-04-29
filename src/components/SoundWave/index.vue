<template>
    <div class="container">
        <span v-for="i in count" :key="'dec' + i" :style="'--d:' + (count - i + 1)"></span>
        <span style="--d: 0"></span>
        <span v-for="i in count" :key="'aes' + i" :style="'--d:' + i"></span>
    </div>
</template>
<script setup lang="ts">
const props = defineProps({
    count: {
        type: Number,
        default: 6
    }
})
</script>
<style lang="scss" scoped>
.container {
    display: flex;
    justify-content: space-around;
    align-items: center;
    position: relative;
    --b: 30px;

    @keyframes loading {
        0% {
            background-image: linear-gradient(to right, #fa709a 0%, #fee140 100%);
            height: 20%;
            border-radius: calc(var(--b) * 0.1);
        }
        50% {
            background-image: linear-gradient(to top, #d299c2 0%, #fef9d7 100%);
            height: 100%;
            border-radius: calc(var(--b) * 0.5);
        }
        100% {
            background-image: linear-gradient(to top, #a8edea 0%, #fed6e3 100%);
            height: 20%;
            border-radius: calc(var(--b) * 0.1);
        }
    }
    span {
        background: linear-gradient(to top, #d299c2 0%, #fef9d7 100%);
        width: 4px;
        height: 20%;
        border-radius: calc(var(--b) * 0.1);
        margin-right: 4px;
        animation: loading 2s infinite linear;
        animation-delay: calc(0.15s * var(--d));
        &:last-child {
            margin-right: 0px;
        }
    }
}
</style>
