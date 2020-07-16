# Vue Props Type

`Vue Props Type`は`Vue.js`の`props`の型定義を助けます.

## Why

composition-apiを利用したコードを書く場合、以下のように書く必要があります.

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

`Option`に渡す`props object`と型定義の`Props type`は別々で定義されおり、素直に書く場合は、人の手により両方をメンテナンスする必用があります.
これには課題があり、もし`props object`のコードを変更し、`Props type`の修正を忘れた場合、`HogeHogeProps type`又は`props object`は嘘をつくことになります.
人によっては`props object`の項目が多い場合、`Props type`の型定義をサボりたくなるでしょう.
人によっては`setup`内でアクセスしている`props object`の項目の型定義しか書かない可能性もあります.
以下がその例です.

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

しかもこの例では少なくとも`D`と`E`と`F`がどんな模様の型なのか一切わかりません.
`template`の中でどのようにアクセスされているのでしょうか？
我々がその模様を知りたい場合、そこから読み解く必用があります.
我々の気合による推論で消費する時間は多いのに対して、型定義でサボって得られる時間はごくわずかです.
しかも我々の推論結果が実装者の意図とただしくない可能性があります.

また、サボった場合は、`Typescript`のエコシステムの恩恵を正しく受けれなくなるリスクがあります. (例: `template`の型検査等
`Vue Props Type`はTypeScriptの力によって、このような課題の解決をシンプル且つ簡単に解決することを目指します.
以下が`Vue Props Type`を使ったサンプルです.

```typescript
import { defineComponent } from '@vue/composition-api'
import { InsidePropsType, OutsidePropsType, PropType } from '@icare-jp/vue-props-type'

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
//   C: Readonly<{
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
//   readonly C: Readonly<{
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

`InsidePropsType` を使う事により、 `props` の管理を楽にし、型定義を書くストレスを軽減します.
また、 `Vue.js` は `props` へ変更を加える操作を禁止しています.
そのため、 `props` を標準で `readonly` にしています.
もし `readonly` にすることにより何かしらの問題が起こる場合は `UnsafePropsType` を利用してください.
また、 `required: true` と `default: () => any` も無い場合、 `undefined` を混ぜています.
また、 `default: () => any` がある場合は戻り値を抽出し、混ぜています.
それにより、より実行結果に近い、つまり真実に近い型を得られます.

また、用意されたコンポーネントを利用する側がtype safeに`props`を用意したい場合、以下のようなコードを手動で書き、用意しなければなりません.

```typescript
export type HogeHogeProps = {
  A?: string | undefined;
  B: 0 | Date | 1;
  C: Readonly<{
    label: string;
    value: string;
  }>;
  D: string[];
  E?: string | number | undefined;
  F?: ((key: string, value: string) => void) | undefined;
}
```

`InsideHogeHogeProps`と全く同じ様に`OutsidePropsType`を利用すれば、この型を自動で生成でき、型定義を書くストレスを軽減します.
些細な意見でも結構ですので、なにかありましたら気軽にissueを立てて申し立ててくださると幸いです.
