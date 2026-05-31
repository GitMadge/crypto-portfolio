import { useState, useEffect, useRef } from 'react'
import { searchCoins } from '../utils/prices'

const inputClass =
  'w-full rounded-md bg-gray-800 border border-gray-700 px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500'

export default function CoinSearch({ onSelect, initialCoin }) {
  const [query, setQuery] = useState(initialCoin?.name ?? '')
  const [results, setResults] = useState([])
  const [searching, setSearching] = useState(false)
  const [open, setOpen] = useState(false)
  const containerRef = useRef(null)
  const timerRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function handleInputChange(e) {
    const value = e.target.value
    setQuery(value)
    onSelect(null)

    clearTimeout(timerRef.current)
    if (!value.trim()) {
      setResults([])
      setOpen(false)
      return
    }
    timerRef.current = setTimeout(async () => {
      setSearching(true)
      try {
        const coins = await searchCoins(value)
        setResults(coins)
        setOpen(true)
      } catch {
        setResults([])
      } finally {
        setSearching(false)
      }
    }, 400)
  }

  function handleSelect(coin) {
    setQuery(coin.name)
    setResults([])
    setOpen(false)
    onSelect({ id: coin.id, name: coin.name, symbol: coin.symbol.toUpperCase() })
  }

  return (
    <div ref={containerRef} className="relative">
      <input
        value={query}
        onChange={handleInputChange}
        onFocus={() => results.length > 0 && setOpen(true)}
        onKeyDown={e => e.key === 'Enter' && e.preventDefault()}
        placeholder="Search coin (e.g. Bitcoin)"
        required
        className={inputClass}
      />
      {searching && (
        <span className="absolute right-3 top-2.5 text-xs text-gray-500">Searching…</span>
      )}
      {open && results.length > 0 && (
        <div className="absolute top-full z-20 mt-1 w-full overflow-hidden rounded-md border border-gray-700 bg-gray-800 shadow-xl">
          {results.map(coin => (
            <button
              key={coin.id}
              type="button"
              onMouseDown={() => handleSelect(coin)}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-gray-700"
            >
              {coin.thumb && (
                <img src={coin.thumb} alt="" className="h-5 w-5 rounded-full" />
              )}
              <span className="font-medium text-white">{coin.name}</span>
              <span className="text-xs text-gray-400">{coin.symbol.toUpperCase()}</span>
              {coin.market_cap_rank && (
                <span className="ml-auto text-xs text-gray-600">#{coin.market_cap_rank}</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
