import {
  Account,
  CoValue,
  CoValueClass,
  DepthsIn,
  ID,
  subscribeToCoValue,
} from "jazz-tools"

export function waitForCoValue<T extends CoValue>(
  coMap: CoValueClass<T>,
  valueId: ID<T>,
  account: Account,
  predicate: (value: T) => boolean,
  depth: DepthsIn<T>,
) {
  return new Promise<T>((resolve) => {
    function subscribe() {
      const unsubscribe = subscribeToCoValue(
        coMap,
        valueId,
        account,
        depth,
        (value) => {
          if (predicate(value)) {
            resolve(value)
            unsubscribe()
          }
        },
        () => {
          unsubscribe()
          setTimeout(subscribe, 100)
        },
      )
    }

    subscribe()
  })
}
