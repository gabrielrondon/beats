'use client'

import { useEffect, useRef, useState } from 'react'

interface BinauralState {
  isPlaying: boolean
  frequency: number
  baseFreq: number
  volume: number
  preset: keyof typeof PRESETS
}

const PRESETS = {
  concentration: { freq: 14, name: 'Concentration (14Hz)' },
  relaxation: { freq: 10, name: 'Relaxation (10Hz)' },
  meditation: { freq: 6, name: 'Meditation (6Hz)' },
  'deep-meditation': { freq: 4, name: 'Deep Med (4Hz)' },
  sleep: { freq: 2, name: 'Sleep (2Hz)' }
} as const

export function BinauralBeats() {
  const [state, setState] = useState<BinauralState>({
    isPlaying: false,
    frequency: 14,
    baseFreq: 220,
    volume: -15,
    preset: 'concentration'
  })

  const audioContext = useRef<AudioContext | null>(null)
  const oscillatorLeft = useRef<OscillatorNode | null>(null)
  const oscillatorRight = useRef<OscillatorNode | null>(null)
  const gainNodeLeft = useRef<GainNode | null>(null)
  const gainNodeRight = useRef<GainNode | null>(null)
  const pannerLeft = useRef<StereoPannerNode | null>(null)
  const pannerRight = useRef<StereoPannerNode | null>(null)

  useEffect(() => {
    return () => {
      if (state.isPlaying) {
        oscillatorLeft.current?.stop()
        oscillatorRight.current?.stop()
      }
      oscillatorLeft.current?.disconnect()
      oscillatorRight.current?.disconnect()
      gainNodeLeft.current?.disconnect()
      gainNodeRight.current?.disconnect()
      pannerLeft.current?.disconnect()
      pannerRight.current?.disconnect()
      audioContext.current?.close()
    }
  }, [state.isPlaying])

  useEffect(() => {
    if (!state.isPlaying) return

    if (!audioContext.current) {
      audioContext.current = new AudioContext()
    }

    const ctx = audioContext.current

    // Create nodes
    oscillatorLeft.current = ctx.createOscillator()
    oscillatorRight.current = ctx.createOscillator()
    gainNodeLeft.current = ctx.createGain()
    gainNodeRight.current = ctx.createGain()
    pannerLeft.current = ctx.createStereoPanner()
    pannerRight.current = ctx.createStereoPanner()

    // Set frequencies
    oscillatorLeft.current.frequency.value = state.baseFreq
    oscillatorRight.current.frequency.value = state.baseFreq + state.frequency

    // Set volume
    gainNodeLeft.current.gain.value = Math.pow(10, state.volume / 20)
    gainNodeRight.current.gain.value = Math.pow(10, state.volume / 20)

    // Set panning
    pannerLeft.current.pan.value = -1
    pannerRight.current.pan.value = 1

    // Connect nodes
    oscillatorLeft.current
      .connect(gainNodeLeft.current)
      .connect(pannerLeft.current)
      .connect(ctx.destination)

    oscillatorRight.current
      .connect(gainNodeRight.current)
      .connect(pannerRight.current)
      .connect(ctx.destination)

    // Start oscillators
    oscillatorLeft.current.start()
    oscillatorRight.current.start()

    return () => {
      oscillatorLeft.current?.stop()
      oscillatorRight.current?.stop()
    }
  }, [state.isPlaying, state.frequency, state.baseFreq, state.volume])

  return (
    <div className="max-w-xl mx-auto bg-gray-50 rounded-lg shadow-sm p-8">
      <h1 className="text-2xl font-semibold text-center mb-8">Binaural Beats Generator</h1>
      
      {/* Frequency Slider */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Beat Frequency: {state.frequency} Hz
        </label>
        <input
          type="range"
          min="1"
          max="30"
          value={state.frequency}
          onChange={(e) => setState(prev => ({ ...prev, frequency: Number(e.target.value) }))}
          className="w-full h-1 bg-blue-200 rounded-lg appearance-none cursor-pointer"
        />
      </div>

      {/* Base Frequency Slider */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Base Frequency: {state.baseFreq} Hz
        </label>
        <input
          type="range"
          min="20"
          max="500"
          value={state.baseFreq}
          onChange={(e) => setState(prev => ({ ...prev, baseFreq: Number(e.target.value) }))}
          className="w-full h-1 bg-green-200 rounded-lg appearance-none cursor-pointer"
        />
      </div>

      {/* Volume Slider */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Volume: {state.volume} dB
        </label>
        <input
          type="range"
          min="-40"
          max="0"
          value={state.volume}
          onChange={(e) => setState(prev => ({ ...prev, volume: Number(e.target.value) }))}
          className="w-full h-1 bg-red-200 rounded-lg appearance-none cursor-pointer"
        />
      </div>

      {/* Preset Buttons */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {Object.entries(PRESETS).map(([key, preset]) => (
          <button
            key={key}
            onClick={() => setState(prev => ({ ...prev, frequency: preset.freq, preset: key as keyof typeof PRESETS }))}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
              ${state.preset === key 
                ? 'bg-blue-500 text-white' 
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'}`}
          >
            {preset.name}
          </button>
        ))}
      </div>

      {/* Start/Stop Button */}
      <button
        onClick={() => setState(prev => ({ ...prev, isPlaying: !prev.isPlaying }))}
        className={`w-32 mx-auto block px-4 py-2 rounded-lg text-sm font-medium transition-colors
          ${state.isPlaying
            ? 'bg-red-500 text-white hover:bg-red-600'
            : 'bg-blue-500 text-white hover:bg-blue-600'}`}
      >
        {state.isPlaying ? 'Stop' : 'Start'}
      </button>

      {/* Instructions */}
      <div className="mt-8 p-4 bg-white rounded-lg border border-gray-200">
        <h2 className="text-lg font-medium text-gray-900 mb-2">Instructions</h2>
        <ul className="text-sm text-gray-600 space-y-2">
          <li>• Use headphones for the best experience</li>
          <li>• Start with a preset or adjust manually</li>
          <li>• Keep volume at a comfortable level</li>
          <li>• Give your brain time to adjust (5-10 minutes)</li>
        </ul>
      </div>
    </div>
  )
} 