import { emitGenerator } from '../src/index'

test('success emit for single', () => {
  let count = 0
  const context = {
    listeners: {
      hello: () => {
        count++
      },
    },
  } as const
  const emit = emitGenerator<typeof context['listeners']>(context.listeners)
  expect(count).toBe(0)
  emit('hello')
  expect(count).toBe(1)
})

test('success emit for multiple', () => {
  let count = 0
  const context = {
    listeners: {
      hello: [
        () => {
          count++
        },
        () => {
          count += 2
        },
        () => 4649,
      ],
    },
  } as const
  const emit = emitGenerator<{ hello: [() => void, () => 1] }>(context.listeners)
  expect(count).toBe(0)
  emit('hello')
  expect(count).toBe(3)
})

test('success emit undefined event', () => {
  let count = 0
  const emit = emitGenerator<any>({
    hello: () => {
      count++
    },
  })
  expect(count).toBe(0)
  emit('hello', 123)
  expect(count).toBe(1)
  emit('fuga', 456) // no error
})
