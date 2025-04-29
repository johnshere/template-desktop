<template>
    <div ref="wrap" class="echarts-wrap" :class="{ opacity }"></div>
</template>
<script setup lang="ts">
// @ts-nocheck
import * as echarts from 'echarts/core'
import {
    TitleComponent,
    type TitleComponentOption,
    TooltipComponent,
    type TooltipComponentOption,
    LegendComponent,
    type LegendComponentOption
} from 'echarts/components'
import { GraphChart, type GraphSeriesOption } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'
import type { PropType } from 'vue'

echarts.use([TitleComponent, TooltipComponent, LegendComponent, GraphChart, CanvasRenderer])

type EChartsOption = echarts.ComposeOption<
    TitleComponentOption | TooltipComponentOption | LegendComponentOption | GraphSeriesOption
>

export interface Node {
    label?: { show?: boolean }
    id: string
    name: string
    symbolSize?: number
    value: number
    category: number
}
export interface Link {
    source: string
    target: string
}

export interface Data {
    nodes: Node[]
    links: Link[]
    categories: { name: string }[]
}

const props = defineProps({
    data: { type: Object as PropType<Data>, required: true },
    edgeLength: {
        type: Array<number>,
        default: () => [170, 280]
    }
})
const emit = defineEmits<{
    (e: 'nodeClick', node: Node, params: any): void
    (e: 'edgeClick', link: Link, params: any): void
}>()

const wrap = ref<HTMLDivElement>()
let myChart: echarts.EChartsType
// 绘制

const opacity = ref(false)
let timer: NodeJS.Timeout
async function draw() {
    if (!props.data || !props.data.nodes || !props.data.links) return
    clearTimeout(timer)
    await new Promise(r => (timer = setTimeout(r, 100)))
    if (!wrap.value) {
        draw()
        return
    }
    console.log('draw graph')
    myChart = echarts.init(wrap.value)
    resize()
    await new Promise(r => setTimeout(r, 300))
    const graph = JSON.parse(JSON.stringify(props.data))
    if (graph.nodes.length > 7) {
        opacity.value = true
        setTimeout(() => (opacity.value = false), 2000)
    }

    // graph.nodes.forEach(function (node: Node) {
    //     node.label = {
    //         show: !!node.value
    //     }
    // })
    const option: EChartsOption = {
        // title: {
        //     text: 'Les Miserables',
        //     subtext: 'Default layout',
        //     top: 'bottom',
        //     left: 'right'
        // },
        tooltip: {},
        // legend: [
        //     {
        //         // selectedMode: 'single',
        //         data: graph.categories.map(function (a: { name: string }) {
        //             return a.name
        //         })
        //     }
        // ],
        animationDuration: 500,
        animationEasingUpdate: 'quinticInOut',
        series: [
            {
                name: '',
                type: 'graph',
                legendHoverLink: false,
                data: graph.nodes,
                links: graph.links,
                categories: graph.categories,
                roam: true,
                layout: 'force',
                force: {
                    // initLayout: 'circular',
                    edgeLength: props.edgeLength
                    // layoutAnimation: false
                },
                label: {
                    show: true,
                    position: 'inside',
                    formatter: (pas: any) => {
                        let name = pas.data.name.slice(0, 4)
                        if (pas.data.name.length > 4) {
                            name += '\n' + pas.data.name.slice(4, 8)
                        }
                        return name
                    }
                },
                lineStyle: {
                    color: 'source',
                    curveness: 0.3
                },
                emphasis: {
                    focus: 'adjacency',
                    lineStyle: {
                        width: 5
                    }
                },
                edgeLabel: {
                    show: true,
                    formatter: (pas: any) => (pas.data.value ? pas.data.value : '')
                },
                zoom: 1,
                scaleLimit: {
                    min: 0.4,
                    max: 3
                }
            }
        ]
    }
    myChart.setOption(option)
    myChart.on('click', params => {
        if (params.dataType === 'node') {
            emit('nodeClick', params.data as any, params)
        }
        if (params.dataType === 'edge') {
            emit('edgeClick', params.data as any, params)
        }
    })
}
watch(() => props.data, draw, { deep: true })
const resize = () => myChart.resize()
onMounted(() => {
    top?.addEventListener('resize', resize)
})
onUnmounted(() => {
    top?.removeEventListener('resize', resize)
})
</script>
<style lang="scss" scoped>
.echarts-wrap {
    width: 100%;
    height: 100%;
    &.opacity {
        opacity: 0;
    }
}
</style>
