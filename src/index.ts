type VueOriginalListeners =
  | {
      [x: string]: Function | Function[]
    }
  | {
      readonly [x: string]: Function | readonly Function[]
    }

type VueListener = {
  [key: string]: ((...args: any[]) => any) | ((...args: any[]) => any)[]
}

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never

type Cons<T, U extends any[]> = ((arg1: T, ...args: U) => void) extends (...arg: infer V) => void ? V : never

type PickItem<T> = T extends Array<any> ? T[number] : T

type ToEmitFunc<K extends keyof any, F, R> = F extends (...args: infer T) => void ? (...args: Cons<K, T>) => R : never
type ReturnTypeForArrayOrDict<T> = T extends ((...args: unknown[]) => infer R)[] ? R[] : never

type EmitOf<T extends VueListener> = UnionToIntersection<
  {
    [K in keyof T]: ToEmitFunc<K, PickItem<T[K]>, ReturnTypeForArrayOrDict<T[K]>>
  }[keyof T]
>

function isPromiseInstance<T = any>(val: any): val is Promise<T> {
  return typeof val === 'object' && val.constructor.name === Promise.prototype.constructor.name
}

function toArray<T extends Array<any>>(value: any): T {
  return Array.isArray(value) ? value : ([value] as any)
}

export function emitGenerator<T extends VueListener, U extends VueOriginalListeners = VueOriginalListeners>(
  listeners: U | Readonly<U>,
): EmitOf<T> {
  function emit<P>(eventName: string, payload?: P) {
    const results = toArray<Function[]>(listeners[eventName])
      .filter((listener) => listener)
      .map((listener) => listener(payload))
    return results.find(isPromiseInstance) !== undefined ? Promise.all(results) : results
  }
  return emit as any
}
