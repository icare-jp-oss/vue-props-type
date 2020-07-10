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

type ToPrimitiveOrReturn<T> = T extends object
  ? T extends String
    ? string
    : T extends Number
    ? number
    : T extends Boolean
    ? boolean
    : T
  : T

type ToPrimitive<T> = T extends Promise<unknown>
  ? T
  : T extends ClassConstructor
  ? ToPrimitiveOrReturn<InstanceType<T>>
  : T extends Callback
  ? T
  : never

type Map2Primitive<T> = ToPrimitive<T extends ReadonlyArray<unknown> | unknown[] ? T[number] : T>

type GetParams<T> = { [K in keyof T]: T[K] }
type OverrideConstructor<T extends InstanceType<U>, U extends Constructor<any>> = GetParams<U> & Constructor<T> & FunctionalConstructor<T>

type ReadonlyFunctionalConstructor<T> = (...args: any) => Readonly<T>
type ReadonlyConstructor<T> = new (...args: any) => Readonly<T>
type ReadonlyArrayConstructor<T = any> = GetParams<ArrayConstructor> & ReadonlyConstructor<T> & ReadonlyFunctionalConstructor<T>

export type InsideUnsafePropsType<Props extends VueProps> = {
  [K in keyof Props]: Props[K] extends {
    default: FunctionalConstructor<infer U>
  }
    ? U | Map2Primitive<Props[K] extends Type1 ? Props[K]['type'] : Props[K]>
    : Props[K] extends { required: true }
    ? Map2Primitive<Props[K] extends Type1 ? Props[K]['type'] : Props[K]>
    : Map2Primitive<Props[K] extends Type1 ? Props[K]['type'] : Props[K]> | undefined
}
export type InsidePropsType<Props extends VueProps> = Readonly<InsideUnsafePropsType<Props>>
type _InsidePropsTypePropType<T> = T extends Array<any>
  ? OverrideConstructor<T, ArrayConstructor>
  : T extends ReadonlyArray<any>
  ? OverrideConstructor<T, ReadonlyArrayConstructor>
  : T extends Date
  ? GetParams<DateConstructor> & Constructor<T>
  : T extends symbol
  ? GetParams<SymbolConstructor> & FunctionalConstructor<T>
  : T extends BigInt
  ? GetParams<BigIntConstructor> & FunctionalConstructor<T>
  : T extends Record<string, unknown>
  ? OverrideConstructor<T, ObjectConstructor>
  : T extends string
  ? OverrideConstructor<T, StringConstructor>
  : T extends number
  ? OverrideConstructor<T, NumberConstructor>
  : T extends boolean
  ? OverrideConstructor<T, BooleanConstructor>
  : Constructor<T> & FunctionalConstructor<T>
export type PropType<T> = _InsidePropsTypePropType<T> | _InsidePropsTypePropType<T>[]

type PickKeys<T, U> = { [P in keyof T]: T[P] extends U ? P : never }[keyof T]
type FilterKeys<T, U> = { [P in keyof T]: T[P] extends U ? never : P }[keyof T]

type _OutsidePropsType<Props extends VueProps> = {
  [K in keyof Props]: Map2Primitive<Props[K] extends Type1 ? Props[K]['type'] : Props[K]>
}

export type OutsidePropsType<Props extends VueProps> = _OutsidePropsType<Pick<Props, PickKeys<Props, { required: true }>>> &
  Partial<_OutsidePropsType<Pick<Props, FilterKeys<Props, { required: true }>>>>
