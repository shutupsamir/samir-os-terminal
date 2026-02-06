'use client'

import { useState, KeyboardEvent, useEffect, useRef } from 'react'

interface CommandInputProps {
  onSubmit: (command: string) => void
}

export function CommandInput({ onSubmit }: CommandInputProps) {
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    function handleKeyDown(e: globalThis.KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && input.trim()) {
      onSubmit(input.trim())
      setHistory(prev => [...prev, input.trim()])
      setHistoryIndex(-1)
      setInput('')
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (history.length > 0) {
        const newIndex = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1)
        setHistoryIndex(newIndex)
        setInput(history[newIndex])
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1
        if (newIndex >= history.length) {
          setHistoryIndex(-1)
          setInput('')
        } else {
          setHistoryIndex(newIndex)
          setInput(history[newIndex])
        }
      }
    } else if (e.key === 'Escape') {
      inputRef.current?.blur()
    }
  }

  return (
    <div className="flex items-center gap-2 px-4 py-3 border-t border-[#333] bg-pb-bg">
      <span className="text-[#00ff00]">$</span>
      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a command... (Cmd+K to focus)"
        className="flex-1 bg-transparent text-gray-300 outline-none placeholder:text-gray-700 font-mono text-sm"
        autoFocus
      />
    </div>
  )
}
