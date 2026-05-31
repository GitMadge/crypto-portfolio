import { useState, useEffect } from 'react'
import { fetchPrices } from '../utils/prices'
import CoinSearch from './CoinSearch'

function today() {
  return new Date().toISOString().split('T')[0]
}

function formatUSD(n) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n)
}

const emptyForm = { quantity: '', avgBuyPrice: '', purchaseDate: today() }

const inputClass =
  'w-full rounded-md bg-gray-800 border border-gray-700 px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500'

export default function AddHoldingForm({ editingHolding, onAdd, onUpdate, onCancelEdit }) {
  const [selectedCoin, setSelectedCoin] = useState(null)
  const [currentPrice, setCurrentPrice] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [resetKey, setResetKey] = useState(0)

  useEffect(() => {
    if (editingHolding) {
      setSelectedCoin({ id: editingHolding.coinId, name: editingHolding.name, symbol: editingHolding.symbol })
      setForm({
        quantity: String(editingHolding.quantity),
        avgBuyPrice: String(editingHolding.avgBuyPrice),
        purchaseDate: editingHolding.purchaseDate || today(),
      })
      fetchPrices([editingHolding.coinId])
        .then(data => setCurrentPrice(data[editingHolding.coinId]?.usd ?? null))
        .catch(() => setCurrentPrice(null))
    } else {
      setSelectedCoin(null)
      setCurrentPrice(null)
      setForm(emptyForm)
    }
  }, [editingHolding])

  function handleCoinSelect(coin) {
    setSelectedCoin(coin)
    setCurrentPrice(null)
    if (coin) {
      fetchPrices([coin.id])
        .then(data => setCurrentPrice(data[coin.id]?.usd ?? null))
        .catch(() => setCurrentPrice(null))
    }
  }

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!selectedCoin) return
    const holding = {
      name: selectedCoin.name,
      symbol: selectedCoin.symbol,
      coinId: selectedCoin.id,
      quantity: parseFloat(form.quantity),
      avgBuyPrice: parseFloat(form.avgBuyPrice),
      purchaseDate: form.purchaseDate,
    }
    if (editingHolding) {
      onUpdate(editingHolding.id, holding)
    } else {
      onAdd(holding)
      setResetKey(k => k + 1)
    }
    setSelectedCoin(null)
    setCurrentPrice(null)
    setForm(emptyForm)
  }

  const isEditing = !!editingHolding
  const coinSearchKey = isEditing ? editingHolding.id : `new-${resetKey}`
  const initialCoin = isEditing
    ? { id: editingHolding.coinId, name: editingHolding.name, symbol: editingHolding.symbol }
    : null

  return (
    <div className="rounded-lg border border-gray-800 bg-gray-900 p-6">
      <h2 className="mb-5 text-base font-semibold">
        {isEditing ? 'Edit Holding' : 'Add Holding'}
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <div className="col-span-2 flex flex-col gap-1 lg:col-span-1">
            <label className="text-xs text-gray-400">Coin</label>
            <CoinSearch key={coinSearchKey} initialCoin={initialCoin} onSelect={handleCoinSelect} />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-400">Quantity</label>
            <input
              name="quantity"
              type="number"
              min="0"
              step="any"
              value={form.quantity}
              onChange={handleChange}
              placeholder="0.5"
              required
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-400">Avg Buy Price (USD)</label>
            <input
              name="avgBuyPrice"
              type="number"
              min="0"
              step="any"
              value={form.avgBuyPrice}
              onChange={handleChange}
              placeholder="60000"
              required
              className={inputClass}
            />
            {currentPrice != null && (
              <button
                type="button"
                onClick={() => setForm(prev => ({ ...prev, avgBuyPrice: String(currentPrice) }))}
                className="self-start text-xs text-indigo-400 hover:text-indigo-300"
              >
                Use current price ({formatUSD(currentPrice)})
              </button>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-400">Purchase Date</label>
            <input
              name="purchaseDate"
              type="date"
              value={form.purchaseDate}
              onChange={handleChange}
              max={today()}
              required
              className={inputClass}
            />
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <button
            type="submit"
            disabled={!selectedCoin}
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isEditing ? 'Update Holding' : 'Add Holding'}
          </button>
          {isEditing && (
            <button
              type="button"
              onClick={onCancelEdit}
              className="rounded-md border border-gray-700 px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-800"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
