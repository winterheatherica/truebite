const FIRST_AD_AFTER = 3
const AD_FREQUENCY = 7

export type FeedItem<T> = { kind: "item"; value: T } | { kind: "ad"; key: string }

export function withAds<T>(items: T[]): FeedItem<T>[] {
  const result: FeedItem<T>[] = []
  let adCount = 0
  items.forEach((value, i) => {
    result.push({ kind: "item", value })
    const oneBased = i + 1
    const shouldInsertAd =
      oneBased >= FIRST_AD_AFTER &&
      (oneBased - FIRST_AD_AFTER) % AD_FREQUENCY === 0
    if (shouldInsertAd) {
      adCount++
      result.push({ kind: "ad", key: `ad-${adCount}` })
    }
  })
  return result
}
