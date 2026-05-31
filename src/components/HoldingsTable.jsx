function formatUSD(n) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n)
}

export default function HoldingsTable({ holdings, prices, pricesLoading, onEdit, onDelete }) {
  if (holdings.length === 0) {
    return (
      <div className="rounded-lg border border-gray-800 bg-gray-900 py-16 text-center text-gray-500">
        No holdings yet. Add your first coin above.
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-800 bg-gray-900">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-800 text-left text-xs text-gray-400">
            <th className="px-4 py-3 font-medium">Coin</th>
            <th className="px-4 py-3 font-medium text-right">Quantity</th>
            <th className="px-4 py-3 font-medium text-right">Avg Buy</th>
            <th className="px-4 py-3 font-medium text-right">Current Price</th>
            <th className="px-4 py-3 font-medium text-right">Value</th>
            <th className="px-4 py-3 font-medium text-right">P&amp;L</th>
            <th className="px-4 py-3 font-medium"></th>
          </tr>
        </thead>
        <tbody>
          {holdings.map(h => {
            const currentPrice = prices[h.coinId]?.usd
            const currentValue = currentPrice != null ? h.quantity * currentPrice : null
            const pnl = currentValue != null ? currentValue - h.quantity * h.avgBuyPrice : null
            const pnlPositive = pnl != null && pnl >= 0

            return (
              <tr key={h.id} className="border-b border-gray-800 last:border-0 hover:bg-gray-800/40">
                <td className="px-4 py-3">
                  <span className="font-medium text-white">{h.name}</span>
                  <span className="ml-2 text-xs text-gray-400">{h.symbol}</span>
                </td>
                <td className="px-4 py-3 text-right text-gray-200">{h.quantity}</td>
                <td className="px-4 py-3 text-right text-gray-200">{formatUSD(h.avgBuyPrice)}</td>
                <td className="px-4 py-3 text-right text-gray-200">
                  {pricesLoading ? (
                    <span className="text-gray-600">Loading…</span>
                  ) : currentPrice != null ? (
                    formatUSD(currentPrice)
                  ) : (
                    <span className="text-gray-600">N/A</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right text-gray-200">
                  {currentValue != null ? formatUSD(currentValue) : '—'}
                </td>
                <td className={`px-4 py-3 text-right font-medium ${pnl == null ? 'text-gray-600' : pnlPositive ? 'text-green-400' : 'text-red-400'}`}>
                  {pnl != null ? `${pnlPositive ? '+' : ''}${formatUSD(pnl)}` : '—'}
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => onEdit(h)}
                    className="mr-3 text-xs text-indigo-400 hover:text-indigo-300"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(h.id)}
                    className="text-xs text-red-400 hover:text-red-300"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
