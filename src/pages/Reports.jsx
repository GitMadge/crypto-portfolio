import { useState, useEffect } from 'react'
import {
  ResponsiveContainer,
  PieChart, Pie, Cell,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
} from 'recharts'
import { getHoldings } from '../utils/storage'
import { fetchPrices, fetchHistoricalPrices } from '../utils/prices'

const COLORS = ['#6366f1', '#8b5cf6', '#f59e0b', '#10b981', '#ec4899', '#3b82f6', '#f97316', '#14b8a6']

function formatUSD(n) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n)
}

function yAxisTick(v) {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`
  if (v >= 1_000) return `$${(v / 1_000).toFixed(0)}k`
  return `$${v.toFixed(0)}`
}

function PieTooltip({ active, payload, totalValue }) {
  if (!active || !payload?.length) return null
  const item = payload[0].payload
  return (
    <div className="rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm shadow-lg">
      <p className="font-medium text-white">{item.fullName} ({item.name})</p>
      <p className="text-gray-300">{formatUSD(item.value)}</p>
      <p className="text-gray-400">{((item.value / totalValue) * 100).toFixed(1)}%</p>
    </div>
  )
}

function LineTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm shadow-lg">
      <p className="text-gray-400">{label}</p>
      <p className="font-medium text-white">{formatUSD(payload[0].value)}</p>
    </div>
  )
}

export default function Reports() {
  const [holdings, setHoldings] = useState([])
  const [prices, setPrices] = useState({})
  const [historyData, setHistoryData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const h = getHoldings()
    setHoldings(h)

    if (h.length === 0) {
      setLoading(false)
      return
    }

    const coinIds = [...new Set(h.map(x => x.coinId))]

    Promise.all([
      fetchPrices(coinIds),
      ...coinIds.map(id => fetchHistoricalPrices(id, 30)),
    ])
      .then(([priceData, ...histories]) => {
        setPrices(priceData)

        // Align each coin's daily prices by date string
        const dayMap = {}
        coinIds.forEach((id, i) => {
          histories[i].forEach(([ts, price]) => {
            const day = new Date(ts).toISOString().split('T')[0]
            if (!dayMap[day]) dayMap[day] = {}
            dayMap[day][id] = price
          })
        })

        const chartData = Object.keys(dayMap)
          .sort()
          .map(day => ({
            date: new Date(day + 'T12:00:00').toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            }),
            value: Math.round(
              h.reduce((sum, holding) => sum + holding.quantity * (dayMap[day][holding.coinId] ?? 0), 0) * 100
            ) / 100,
          }))

        setHistoryData(chartData)
        setLoading(false)
      })
      .catch(() => {
        setError('Could not load chart data. Check your connection and try again.')
        setLoading(false)
      })
  }, [])

  if (!loading && holdings.length === 0) {
    return (
      <div className="py-20 text-center text-gray-500">
        No holdings yet. Add coins on the Portfolio page first.
      </div>
    )
  }

  const pieData = holdings
    .map(h => ({
      name: h.symbol,
      fullName: h.name,
      coinId: h.coinId,
      value: Math.round(h.quantity * (prices[h.coinId]?.usd ?? 0) * 100) / 100,
    }))
    .filter(d => d.value > 0)

  const totalValue = pieData.reduce((sum, d) => sum + d.value, 0)

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Reports</h2>

      {loading ? (
        <p className="text-gray-500">Loading chart data…</p>
      ) : error ? (
        <p className="text-red-400">{error}</p>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Donut pie chart */}
            <div className="rounded-lg border border-gray-800 bg-gray-900 p-6">
              <h3 className="mb-1 text-sm font-medium text-gray-400">Allocation</h3>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={110}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<PieTooltip totalValue={totalValue} />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1">
                {pieData.map((d, i) => (
                  <div key={d.name} className="flex items-center gap-1.5 text-xs text-gray-400">
                    <span className="h-2 w-2 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                    {d.name} ({((d.value / totalValue) * 100).toFixed(1)}%)
                  </div>
                ))}
              </div>
            </div>

            {/* 30-day line chart */}
            <div className="rounded-lg border border-gray-800 bg-gray-900 p-6">
              <h3 className="mb-1 text-sm font-medium text-gray-400">30-Day Portfolio Value</h3>
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={historyData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                  <XAxis
                    dataKey="date"
                    tick={{ fill: '#6b7280', fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    tick={{ fill: '#6b7280', fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={yAxisTick}
                    width={56}
                  />
                  <Tooltip content={<LineTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#6366f1"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4, fill: '#6366f1' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Per-coin breakdown */}
          <div className="overflow-hidden rounded-lg border border-gray-800 bg-gray-900">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800 text-left text-xs text-gray-400">
                  <th className="px-4 py-3 font-medium">Coin</th>
                  <th className="px-4 py-3 font-medium text-right">Value</th>
                  <th className="px-4 py-3 font-medium text-right">Allocation</th>
                  <th className="px-4 py-3 font-medium text-right">24h Change</th>
                </tr>
              </thead>
              <tbody>
                {pieData.map((d, i) => {
                  const change = prices[d.coinId]?.usd_24h_change
                  return (
                    <tr key={d.coinId} className="border-b border-gray-800 last:border-0">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span
                            className="h-2 w-2 rounded-full"
                            style={{ background: COLORS[i % COLORS.length] }}
                          />
                          <span className="font-medium">{d.fullName}</span>
                          <span className="text-xs text-gray-400">{d.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">{formatUSD(d.value)}</td>
                      <td className="px-4 py-3 text-right">
                        {((d.value / totalValue) * 100).toFixed(1)}%
                      </td>
                      <td
                        className={`px-4 py-3 text-right ${
                          change == null ? 'text-gray-600' : change >= 0 ? 'text-green-400' : 'text-red-400'
                        }`}
                      >
                        {change != null ? `${change >= 0 ? '+' : ''}${change.toFixed(2)}%` : '—'}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
