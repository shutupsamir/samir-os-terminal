'use client'

import { useState, useRef } from 'react'
import { CommandInput } from '@/components/input/command-input'

interface Toast {
  id: number
  message: string
  type: 'info' | 'success' | 'error'
}

interface TerminalOverlayProps {
  onCommand: (command: string) => void
  collapsed: boolean
  onToggle: () => void
}

export function TerminalOverlay({ onCommand, collapsed, onToggle }: TerminalOverlayProps) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const toastIdRef = useRef(0)

  function addToast(message: string, type: 'info' | 'success' | 'error' = 'info') {
    const id = ++toastIdRef.current
    setToasts(prev => [...prev.slice(-4), { id, message, type }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 4000)
  }

  function handleCommand(command: string) {
    addToast(`$ ${command}`, 'info')
    onCommand(command)
  }

  return (
    <>
      {/* Toast notifications */}
      <div className="fixed top-4 right-4 z-[60] space-y-2 pointer-events-none">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className="animate-node-appear pointer-events-auto px-4 py-2 rounded-lg text-xs font-mono max-w-xs"
            style={{
              background: 'rgba(13,13,13,0.9)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: toast.type === 'success' ? '#4ade80'
                : toast.type === 'error' ? '#f87171'
                : '#e0e0e0',
            }}
          >
            {toast.message}
          </div>
        ))}
      </div>

      {/* Terminal bar */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300"
        style={{ transform: collapsed ? 'translateY(calc(100% - 36px))' : 'translateY(0)' }}
      >
        {/* Collapse toggle */}
        <button
          onClick={onToggle}
          className="absolute -top-6 left-1/2 -translate-x-1/2 px-4 py-0.5 rounded-t-lg text-[10px] text-gray-500 hover:text-white transition-colors"
          style={{
            background: 'rgba(13,13,13,0.9)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderBottom: 'none',
          }}
        >
          {collapsed ? '\u25B2 Terminal' : '\u25BC Terminal'}
        </button>

        <div
          style={{
            background: 'rgba(10,10,10,0.95)',
            backdropFilter: 'blur(20px)',
            borderTop: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <div className="max-w-4xl mx-auto">
            <CommandInput onSubmit={handleCommand} />
          </div>
        </div>
      </div>
    </>
  )
}

// Export toast helper for external use
export type { Toast }
