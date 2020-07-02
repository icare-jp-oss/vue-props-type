type FunctionalConstructor<T> = (...args: any) => T
type Constructor<T> = new (...args: any) => T
type ClassConstructor = Constructor<unknown>
type Callback = (...args: any) => unknown

type ValidType = ClassConstructor | Callback | Promise<unknown>

type Type1 = {
  type: ValidType | ValidType[] | readonly ValidType[]
  default?: FunctionalConstructor<unknown>
  required?: boolean
  validator?(value: unknown): boolean
}

type Type2 = Type1['type']

type VueProps = {
  [propsName: string]: Type1 | Type2
}

type ToPrimitive<T> = T extends Promise<unknown>
  ? T
  : T extends NumberConstructor | BooleanConstructor | StringConstructor | ClassConstructor
  ? InstanceType<T>
  : T extends Callback
  ? T
  : never

type Map2Primitive<T> = ToPrimitive<T extends ReadonlyArray<unknown> | unknown[] ? T[number] : T>

type GetParams<T> = { [K in keyof T]: T[K] }
type OverrideConstructor<T extends InstanceType<U>, U extends Constructor<any>> = GetParams<U> & Constructor<T> & FunctionalConstructor<T>

type ReadonlyFunctionalConstructor<T> = (...args: any) => Readonly<T>
type ReadonlyConstructor<T> = new (...args: any) => Readonly<T>
type ReadonlyArrayConstructor<T = any> = GetParams<ArrayConstructor> & ReadonlyConstructor<T> & ReadonlyFunctionalConstructor<T>

type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends Callback ? T[P] : DeepReadonly<T[P]>
}

export type UnsafePropsType<Props extends VueProps> = {
  [K in keyof Props]: Props[K] extends {
    default: FunctionalConstructor<infer U>
  }
    ? U | Map2Primitive<Props[K] extends Type1 ? Props[K]['type'] : Props[K]>
    : Props[K] extends { required: true }
    ? Map2Primitive<Props[K] extends Type1 ? Props[K]['type'] : Props[K]>
    : Map2Primitive<Props[K] extends Type1 ? Props[K]['type'] : Props[K]> | undefined
}
export type PropsType<Props extends VueProps> = DeepReadonly<UnsafePropsType<Props>>
type _PropType<T> = T extends string
  ? OverrideConstructor<T, StringConstructor>
  : T extends number
  ? OverrideConstructor<T, NumberConstructor>
  : T extends boolean
  ? OverrideConstructor<T, BooleanConstructor>
  : T extends Array<any>
  ? OverrideConstructor<T, ArrayConstructor>
  : T extends ReadonlyArray<any>
  ? OverrideConstructor<T, ReadonlyArrayConstructor>
  : T extends number
  ? OverrideConstructor<T, NumberConstructor>
  : T extends boolean
  ? OverrideConstructor<T, BooleanConstructor>
  : T extends Date
  ? GetParams<DateConstructor> & Constructor<T>
  : T extends symbol
  ? GetParams<SymbolConstructor> & FunctionalConstructor<T>
  : T extends BigInt
  ? GetParams<BigIntConstructor> & FunctionalConstructor<T>
  : T extends string
  ? OverrideConstructor<T, StringConstructor>
  : T extends Record<string, unknown>
  ? OverrideConstructor<T, ObjectConstructor>
  : never
export type PropType<T> = _PropType<T> | _PropType<T>[]
