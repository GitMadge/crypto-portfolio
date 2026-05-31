import { useState, useEffect } from 'react'
import { getHoldings, addHolding, updateHolding, deleteHolding } from './utils/storage'
import AddHoldingForm from './components/AddHoldingForm'
import HoldingsTable from './components/HoldingsTable'

function App() {
  const [holdings, setHoldings] = useState([])
  const [editingHolding, setEditingHolding] = useState(null)

  useEffect(() => {
    setHoldings(getHoldings())
  }, [])

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
    <div className="min-h-screen bg-gray-950 text-white">
      <header className="border-b border-gray-800 px-6 py-4">
        <h1 className="text-xl font-semibold tracking-tight">Crypto Portfolio</h1>
      </header>
      <main className="mx-auto max-w-5xl space-y-6 px-6 py-8">
        <AddHoldingForm
          editingHolding={editingHolding}
          onAdd={handleAdd}
          onUpdate={handleUpdate}
          onCancelEdit={() => setEditingHolding(null)}
        />
        <HoldingsTable
          holdings={holdings}
          onEdit={setEditingHolding}
          onDelete={handleDelete}
        />
      </main>
    </div>
  )
}

export default App
