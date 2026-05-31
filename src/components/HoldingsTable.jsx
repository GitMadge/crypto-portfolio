export default function HoldingsTable({ holdings, onEdit, onDelete }) {
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
            <th className="px-4 py-3 font-medium">CoinGecko ID</th>
            <th className="px-4 py-3 font-medium text-right">Quantity</th>
            <th className="px-4 py-3 font-medium text-right">Avg Buy Price</th>
            <th className="px-4 py-3 font-medium"></th>
          </tr>
        </thead>
        <tbody>
          {holdings.map(h => (
            <tr key={h.id} className="border-b border-gray-800 last:border-0 hover:bg-gray-800/40">
              <td className="px-4 py-3">
                <span className="font-medium text-white">{h.name}</span>
                <span className="ml-2 text-xs text-gray-400">{h.symbol}</span>
              </td>
              <td className="px-4 py-3 font-mono text-xs text-gray-400">{h.coinId}</td>
              <td className="px-4 py-3 text-right text-gray-200">{h.quantity}</td>
              <td className="px-4 py-3 text-right text-gray-200">
                ${h.avgBuyPrice.toLocaleString()}
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
          ))}
        </tbody>
      </table>
    </div>
  )
}
