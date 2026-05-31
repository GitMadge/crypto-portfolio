function formatUSD(n) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n)
}

export default function SummaryCard({ holdings, prices }) {
  const totalValue = holdings.reduce((sum, h) => {
    const price = prices[h.coinId]?.usd ?? 0
    return sum + h.quantity * price
  }, 0)

  const totalCost = holdings.reduce((sum, h) => sum + h.quantity * h.avgBuyPrice, 0)
  const totalPnl = totalValue - totalCost
  const pnlPositive = totalPnl >= 0

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="rounded-lg border border-gray-800 bg-gray-900 p-5">
        <p className="mb-1 text-xs text-gray-400">Total Value</p>
        <p className="text-2xl font-semibold">{formatUSD(totalValue)}</p>
      </div>
      <div className="rounded-lg border border-gray-800 bg-gray-900 p-5">
        <p className="mb-1 text-xs text-gray-400">Total Cost Basis</p>
        <p className="text-2xl font-semibold">{formatUSD(totalCost)}</p>
      </div>
      <div className="rounded-lg border border-gray-800 bg-gray-900 p-5">
        <p className="mb-1 text-xs text-gray-400">Total P&amp;L</p>
        <p className={`text-2xl font-semibold ${pnlPositive ? 'text-green-400' : 'text-red-400'}`}>
          {pnlPositive ? '+' : ''}{formatUSD(totalPnl)}
        </p>
      </div>
    </div>
  )
}
