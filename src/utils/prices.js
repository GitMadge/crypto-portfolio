export async function fetchPrices(coinIds) {
  if (coinIds.length === 0) return {}
  const ids = coinIds.join(',')
  const res = await fetch(
    `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`
  )
  if (!res.ok) throw new Error(`CoinGecko responded with ${res.status}`)
  return res.json()
}
