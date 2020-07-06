# Vue Props Type (Translated by DeepL

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
import { InsidePropsType, PropType } from '@icare-jp/vue-props-type'

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
    required: true,
  },
  E: [String, Number],
  F: Function as (key: string, value: string) => void
} as const

export type HogeHogeProps = OutsidePropsType<typeof propsType>
// {
//   A?: string | undefined;
//   B: 0 | Date | 1;
//   C: DeepReadonly<{
//     label: string;
//     value: string;
//   }>;
//   D: string[];
//   E?: string | number | undefined;
//   F?: ((key: string, value: string) => void) | undefined;
// }

type InsideHogeHogeProps = InsidePropsType<typeof propsType>
// {
//   readonly A: string;
//   readonly B: 0 | Date | 1;
//   readonly C: DeepReadonly<{
//     label: string;
//     value: string;
//   }>;
//   readonly D: readonly string[];
//   readonly E: string | number | undefined;
//   readonly F: ((key: string, value: string) => void) | undefined;
// }

export default defineComponent<InsideHogeHogeProps>({
  name: 'HogeHoge',
  props: propsType,
  setup(props) {
    // props is type safe
  },
})
```

The `InsidePropsType` eases the management of `props` and allows you to define the type to ease the stress of writing a `Vue.js'.
Also, Vue.js forbids any modification to the `props`, so `props` is set to `readonly` by default.
For this reason, `props` is set to `readonly` by default.
If you have some problems with `readonly`, please try to use the `UnsafePropsType`.
Also, if neither `required: true` nor `default: () => any` are present, then ` undefined` is mixed in.
Also, if `default: () => any` is present, the return value is extracted and mixed in.
It gives a closer approximation to the execution result, and therefore to the truth.

Also, the user of the prepared components can set the type safe to `props` and use the `props` as the return value for the If you want to, you have to write and prepare the following code manually.

```typescript
export type HogeHogeProps = {
  A?: string | undefined;
  B: 0 | Date | 1;
  C: DeepReadonly<{
    label: string;
    value: string;
  }>;
  D: string[];
  E?: string | number | undefined;
  F?: ((key: string, value: string) => void) | undefined;
}
```

Using `OutsidePropsType` in exactly the same way as `InsideHogeHogeProps`, you can generate this type automatically and reduce the stress of writing type definitions.
Please feel free to raise an issue if you have any comments, even if they are trivial.
