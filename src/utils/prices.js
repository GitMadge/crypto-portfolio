export async function fetchPrices(coinIds) {
  if (coinIds.length === 0) return {}
  const ids = coinIds.join(',')
  const res = await fetch(
    `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`
  )
  if (!res.ok) throw new Error(`CoinGecko responded with ${res.status}`)
  return res.json()
}

export async function searchCoins(query) {
  if (!query.trim()) return []
  const res = await fetch(
    `https://api.coingecko.com/api/v3/search?query=${encodeURIComponent(query)}`
  )
  if (!res.ok) throw new Error('Search failed')
  const data = await res.json()
  return (data.coins ?? []).slice(0, 8)
}

export async function fetchHistoricalPrices(coinId, days = 30) {
  const res = await fetch(
    `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${days}&interval=daily`
  )
  if (!res.ok) throw new Error(`Failed to fetch history for ${coinId}`)
  const data = await res.json()
  return data.prices // [[timestamp, price], ...]
}
