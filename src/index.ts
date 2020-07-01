type ClassConstructor = new (...args: any[]) => unknown
type Callback = (...args: any[]) => unknown

type ValidType = ClassConstructor | Callback | Promise<unknown>

type Type1 = {
  type: ValidType | ValidType[]
  default?: unknown
  required?: boolean
  validator?(value: unknown): boolean
}

type Type2 = Type1['type']

type VueProps = {
  [propsName: string]: Type1 | Type2
}

type ToPrimitive<T> = T extends ObjectConstructor
  ? { [key: string]: unknown }
  : T extends StringConstructor
  ? string
  : T extends NumberConstructor
  ? number
  : T extends BooleanConstructor
  ? boolean
  : T extends ArrayConstructor
  ? unknown[]
  : T extends ClassConstructor
  ? InstanceType<T>
  : T extends Promise<unknown>
  ? T
  : T extends Callback
  ? T
  : never

type Map2Primitive<T> = ToPrimitive<T extends ClassConstructor[] ? T[number] : T>

export type PropsType<Props extends VueProps> = {
  [K in keyof Props]: Map2Primitive<Props[K] extends Type1 ? Props[K]['type'] : Props[K]>
}
