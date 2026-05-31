import { useState, useEffect } from 'react'

const emptyForm = { name: '', symbol: '', coinId: '', quantity: '', avgBuyPrice: '' }

export default function AddHoldingForm({ editingHolding, onAdd, onUpdate, onCancelEdit }) {
  const [form, setForm] = useState(emptyForm)

  useEffect(() => {
    if (editingHolding) {
      setForm({
        name: editingHolding.name,
        symbol: editingHolding.symbol,
        coinId: editingHolding.coinId,
        quantity: String(editingHolding.quantity),
        avgBuyPrice: String(editingHolding.avgBuyPrice),
      })
    } else {
      setForm(emptyForm)
    }
  }, [editingHolding])

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    const holding = {
      name: form.name.trim(),
      symbol: form.symbol.trim().toUpperCase(),
      coinId: form.coinId.trim().toLowerCase(),
      quantity: parseFloat(form.quantity),
      avgBuyPrice: parseFloat(form.avgBuyPrice),
    }
    if (editingHolding) {
      onUpdate(editingHolding.id, holding)
    } else {
      onAdd(holding)
    }
    setForm(emptyForm)
  }

  const isEditing = !!editingHolding

  const inputClass =
    'w-full rounded-md bg-gray-800 border border-gray-700 px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500'

  return (
    <div className="rounded-lg border border-gray-800 bg-gray-900 p-6">
      <h2 className="mb-5 text-base font-semibold">
        {isEditing ? 'Edit Holding' : 'Add Holding'}
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-400">Coin Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Bitcoin"
              required
              className={inputClass}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-400">Symbol</label>
            <input
              name="symbol"
              value={form.symbol}
              onChange={handleChange}
              placeholder="BTC"
              required
              className={inputClass}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-400">
              CoinGecko ID
              <span className="ml-1 text-gray-600">(e.g. bitcoin)</span>
            </label>
            <input
              name="coinId"
              value={form.coinId}
              onChange={handleChange}
              placeholder="bitcoin"
              required
              className={inputClass}
            />
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
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <button
            type="submit"
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
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
