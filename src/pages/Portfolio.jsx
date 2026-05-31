import { useState, useEffect } from 'react'
import { getHoldings, addHolding, updateHolding, deleteHolding } from '../utils/storage'
import { fetchPrices } from '../utils/prices'
import AddHoldingForm from '../components/AddHoldingForm'
import HoldingsTable from '../components/HoldingsTable'
import SummaryCard from '../components/SummaryCard'

export default function Portfolio() {
  const [holdings, setHoldings] = useState([])
  const [editingHolding, setEditingHolding] = useState(null)
  const [prices, setPrices] = useState({})
  const [pricesLoading, setPricesLoading] = useState(false)
  const [pricesError, setPricesError] = useState(null)

  useEffect(() => {
    setHoldings(getHoldings())
  }, [])

  useEffect(() => {
    const coinIds = [...new Set(holdings.map(h => h.coinId))]
    if (coinIds.length === 0) {
      setPrices({})
      return
    }
    setPricesLoading(true)
    setPricesError(null)
    fetchPrices(coinIds)
      .then(data => {
        setPrices(data)
        setPricesLoading(false)
      })
      .catch(() => {
        setPricesError('Could not load live prices. Check your connection.')
        setPricesLoading(false)
      })
  }, [holdings])

  function handleAdd(holding) {
    setHoldings(addHolding(holding))
  }

  function handleUpdate(id, changes) {
    setHoldings(updateHolding(id, changes))
    setEditingHolding(null)
  }

  function handleDelete(id) {
    setHoldings(deleteHolding(id))
  }

  return (
    <div className="space-y-6">
      {holdings.length > 0 && <SummaryCard holdings={holdings} prices={prices} />}
      <AddHoldingForm
        editingHolding={editingHolding}
        onAdd={handleAdd}
        onUpdate={handleUpdate}
        onCancelEdit={() => setEditingHolding(null)}
      />
      {pricesError && <p className="text-sm text-red-400">{pricesError}</p>}
      <HoldingsTable
        holdings={holdings}
        prices={prices}
        pricesLoading={pricesLoading}
        onEdit={setEditingHolding}
        onDelete={handleDelete}
      />
    </div>
  )
}
