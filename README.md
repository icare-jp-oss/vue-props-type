## Vue Props Type.

The `Vue Props Type` helps to define the `props` type in `Vue.js`.

## Why

If you want to use composition-api, you need to write the following code.

```typescript
import { defineComponent } from '@vue/composition-api'

export type HogeHogeProps = {
  A: 'github' | 'qiita' | 'facebook'
  B: 0 | 1 | Date
  C: { label: string, value: string }
  D: string[]
  E: string | number
  F: (key: string, value: string) => void
}

export default defineComponent<HogeHogeProps>({
  name: 'HogeHoge',
  props: {
    A: {
      type: String,
      default: () => 'github'
    },
    B: {
      type: [Number, Date],
      required: true,
    },
    C: {
      type: Object,
      required: true,
    },
    D: {
      type: Array,
      required: true,
    },
    E: [String, Number],
    F: Function,
  },
  setup(props) {
    // props is type safe
  },
})
```

The `props object` passed to the `Option` and the `props type` of the type definition are defined separately, and they need to be maintained by hand if they are to be written honestly.
The challenge with this is that if you change the code of the `props object` and forget to modify the `props type`, the `HogeHogeProps type` or `props object` will lie.
Some people may be tempted to skip the `props type` type definition if there are too many items in the `props object`.
Some people may only write the type definition of the `props object` item they are accessing in the `setup`.
Here is an example.

```typescript
import { defineComponent } from '@vue/composition-api'

export type HogeHogeProps = {
  A: 'github' | 'qiita' | 'facebook'
}

export default defineComponent<HogeHogeProps>({
  name: 'HogeHoge',
  props: {
    A: {
      type: String,
      default: () => 'github'
    },
    B: {
      type: [Number, Date],
      required: true,
    },
    C: {
      type: Object,
      required: true,
    },
    D: {
      type: Array,
      required: true,
    },
    E: [String, Number],
    F: Function,
  },
  setup(props) {
    // Props type is { A: string }
    console.log(props.A)
  },
})
```

Moreover, in this example at least, we don't know what type of pattern `D`, `E` and `F` are.
How are they being accessed in the `template`?
If we want to know the pattern, we need to decipher it from there.
While our spirited reasoning consumes a lot of time, we get very little time by skipping out on type definitions.
Moreover, our results may not be consistent with the implementer's intentions.

Also, if you skip it, you will not be able to properly benefit from the `Typescript` ecosystem, and you will not get the benefit of the `Typescript` ecosystem. (e.g. `template` type checking, etc.). (e.g., type checking of `template`.
`Vue Props Type` aims to solve such problems simply and easily with the power of TypeScript.
Here's a sample using `Vue Props Type`.

```typescript
import { defineComponent } from '@vue/composition-api'
import { PropsType, PropType } from '@icare-jp/vue-props-type'

const propsType = {
  A: {
    type: String as PropType<'github' | 'qiita' | 'facebook'>,
    default: () => 'github'
  },
  B: {
    type: [Number, Date] as PropType<0 | 1 | Date>,
    required: true,
  },
  C: {
    type: Object as PropType<{ label: string, value: string }>,
    required: true,
  },
  D: {
    type: Array as PropType<string[]>,
    required: true
  },
  E: [String, Number],
  F: Function as (key: string, value: string) => void
}

export type HogeHogeProps = PropsType<typeof propsType>
// {
//   readonly A: string;
//   readonly B: number | DeepReadonly<Date>;
//   readonly C: DeepReadonly<{
//       label: string;
//       value: string;
//   }>;
//   readonly D: readonly string[];
//   readonly E: string | number;
//   readonly F: (key: string, value: string) => void;
// }

export default defineComponent<HogeHogeProps>({
  name: 'HogeHoge',
  props: propsType,
  setup(props) {
    // props is type safe
  },
})
```

This eases the management of `props` and reduces the stress of writing type definitions.
Also, `Vue.js forbids you to make changes to `props`.
That's why we set `props` to `readonly` by default.
If you have any problems with `readonly`, use `UnsafePropsType`.
If you have any problems, please use `UnsafePropsType` if you have any problems with `readonly`.
