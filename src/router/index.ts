import type { App } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw, RouteRecordSingleViewWithChildren, RouterOptions } from 'vue-router'
import { useGuards } from './guards'
import { isMicroApp, toLine } from '@/libs'
import { name } from '@/../package.json'
// import { ElMessageBox } from 'element-plus'

const error = (message: string) => {
    // ElMessageBox.alert(message, '错误', { type: 'error', showClose: false, showConfirmButton: false })
    throw new Error(message)
}

// 布局集合
const layoutFiles: any = import.meta.glob(`@/layouts/*/index.vue`, { eager: true })
const layouts = [] as RouteRecordSingleViewWithChildren[]
const layoutReg = /\/src\/layouts\/(.*)\/index\.vue/
for (const layoutPath in layoutFiles) {
    const $layout = layoutFiles[layoutPath].default
    if (!$layout) continue
    const name = layoutReg.exec(layoutPath)![1]
    layouts.push({
        path: $layout.path || '',
        name,
        component: $layout,
        children: []
    })
}

// 匹配到的文件默认是懒加载的，通过动态导入实现，并会在构建时分离为独立的 chunk。如果你倾向于直接引入所有的模块（例如依赖于这些模块中的副作用首先被应用），你可以传入 { eager: true } 作为第二个参数：
const views: any = import.meta.glob(`@/views/**/index.vue`, { eager: true })
const viewReg = /\/src\/views\/(.*)\/index\.vue/

// 动态加载路由
for (const componentPath in views) {
    // 找到example的组件，并加载
    const $component = views[componentPath].default
    // 默认首页必须得
    if ($component) {
        const { title, hidden, pathMatch } = $component
        if (hidden) continue
        if (title === undefined || title === null) {
            error(`view组件(${componentPath})的title必须存在`)
            break
        }
        const layoutName = $component.layout?.toLowerCase() || 'main'
        const layout = layouts.find(l => (l.name as string).toLowerCase() === layoutName)!
        const layoutChildren = layout.children

        let paths = viewReg.exec(componentPath)![1].split('/')
        paths = paths.map(p => toLine(p, '-'))
        if (paths.concat().shift()?.toLowerCase() === layout.path.toLowerCase()) paths.shift()
        layoutChildren.push({
            path: paths.join('/') + (pathMatch || ''),
            name: layoutName + '-' + paths.join('-'),
            component: $component,
            meta: { title }
        })
    }
}

// 根路由
const Root: RouteRecordRaw = {
    path: '',
    name: 'Root',
    component: layouts.find(lay => lay.name === 'Empty')!.component,
    children: layouts
}

export const routes = [Root]

export const setupRouter = async (app: App) => {
    let base = name
    if (location.href.includes('micro-app')) {
        base = (location.pathname + location.hash).split(name).shift()! + name
    }
    const router = createRouter({ history: createWebHistory(base), routes })
    console.log('routes', routes)

    useGuards(router)
    app.use(router)
}
