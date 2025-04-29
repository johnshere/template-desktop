/**
 * 需要剔除的属性
 */
export type EnumExcludeProp = 'prototype' | 'key' | 'name' | 'value' | 'getEnum' | 'getArray'
/**
 * 工具类型：提取静态属性类型
 */
export type EnumKeyType<T> = {
    [K in keyof T]: K extends EnumExcludeProp ? never : K
}[keyof T]
/**
 * 工具类型：提取静态属性的值类型
 */
export type EnumValueType<T> = {
    [K in keyof T]: T[K] extends { value: infer V } ? V : never
}[keyof T]

/**
 * 枚举基类
 * @description V-值类型，K-key类型
 */
export class Enum<V extends string | number = string | number, K = string> {
    constructor(public name: string, public value: V) {}
    EmptyValue = '0'
    isEqual(value: V | Enum<V, K>) {
        if (value instanceof Enum) {
            return String(this.value) === String(value.value)
        }
        if (value === null || value === undefined || value === '' || (typeof value === 'number' && isNaN(value))) {
            return String(this.value) === this.EmptyValue
        }
        return String(this.value) === String(value)
    }
    get key() {
        type R = K extends EnumExcludeProp ? never : K
        const _super = this.constructor as typeof Enum
        for (const key in _super) {
            const item = _super[key as keyof typeof _super]
            if (item instanceof Enum && item.isEqual(this.value)) {
                return key as R
            }
        }
        throw new Error(`${this.value} is not found in ${this.constructor.name}`)
    }
    static getEnum<T extends Enum<string | number, string>>(this: { new (...args: any[]): T }, value: string | number) {
        for (const key in this) {
            const item = (this as any)[key]
            if (item instanceof this && item.isEqual(value)) {
                return item as T
            }
        }
    }
    static getArray<T extends Enum<string | number, string>>(this: { new (...args: any[]): T }) {
        const arr: T[] = []
        for (const key in this) {
            const item = (this as any)[key]
            if (item instanceof this) {
                arr.push(item)
            }
        }
        return arr
    }
}
