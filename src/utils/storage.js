const KEY = 'holdings'

export function getHoldings() {
  return JSON.parse(localStorage.getItem(KEY) || '[]')
}

export function saveHoldings(holdings) {
  localStorage.setItem(KEY, JSON.stringify(holdings))
}

export function addHolding(holding) {
  const holdings = getHoldings()
  const updated = [...holdings, { ...holding, id: crypto.randomUUID() }]
  saveHoldings(updated)
  return updated
}

export function updateHolding(id, changes) {
  const updated = getHoldings().map(h => (h.id === id ? { ...h, ...changes } : h))
  saveHoldings(updated)
  return updated
}

export function deleteHolding(id) {
  const updated = getHoldings().filter(h => h.id !== id)
  saveHoldings(updated)
  return updated
}
