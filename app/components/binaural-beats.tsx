'use client'

import React from 'react'
import { useEffect, useRef, useState } from 'react'
import * as Slider from '@radix-ui/react-slider'
import * as ToggleGroup from '@radix-ui/react-toggle-group'
import { Play, Pause } from 'lucide-react'

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
  const gainNode = useRef<GainNode | null>(null)

  useEffect(() => {
    return () => {
      audioContext.current?.close()
    }
  }, [])

  const togglePlay = () => {
    if (!audioContext.current) {
      audioContext.current = new AudioContext()
      gainNode.current = audioContext.current.createGain()
      gainNode.current.connect(audioContext.current.destination)
    }

    if (!state.isPlaying) {
      const ctx = audioContext.current
      const gain = gainNode.current
      
      if (!ctx || !gain) return

      oscillatorLeft.current = ctx.createOscillator()
      oscillatorRight.current = ctx.createOscillator()
      
      const merger = ctx.createChannelMerger(2)
      
      oscillatorLeft.current.connect(merger, 0, 0)
      oscillatorRight.current.connect(merger, 0, 1)
      merger.connect(gain)

      oscillatorLeft.current.frequency.value = state.baseFreq
      oscillatorRight.current.frequency.value = state.baseFreq + state.frequency

      gain.gain.value = Math.pow(10, state.volume / 20)

      oscillatorLeft.current.start()
      oscillatorRight.current.start()
    } else {
      oscillatorLeft.current?.stop()
      oscillatorRight.current?.stop()
      oscillatorLeft.current = null
      oscillatorRight.current = null
    }

    setState(prev => ({ ...prev, isPlaying: !prev.isPlaying }))
  }

  const updateFrequency = (value: number) => {
    setState(prev => ({ ...prev, frequency: value }))
    if (oscillatorRight.current) {
      oscillatorRight.current.frequency.value = state.baseFreq + value
    }
  }

  const updateBaseFrequency = (value: number) => {
    setState(prev => ({ ...prev, baseFreq: value }))
    if (oscillatorLeft.current && oscillatorRight.current) {
      oscillatorLeft.current.frequency.value = value
      oscillatorRight.current.frequency.value = value + state.frequency
    }
  }

  const updateVolume = (value: number) => {
    setState(prev => ({ ...prev, volume: value }))
    if (gainNode.current) {
      gainNode.current.gain.value = Math.pow(10, value / 20)
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6 space-y-8 bg-card rounded-lg shadow-lg">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-foreground mb-2">Binaural Beats Generator</h1>
        <p className="text-muted-foreground">Create your own binaural beats for focus and relaxation</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Beat Frequency: {state.frequency} Hz</label>
          <Slider.Root
            className="relative flex items-center select-none touch-none w-full h-5"
            value={[state.frequency]}
            max={30}
            min={1}
            step={1}
            onValueChange={([value]) => updateFrequency(value)}
          >
            <Slider.Track className="bg-secondary relative grow rounded-full h-[3px]">
              <Slider.Range className="absolute bg-primary rounded-full h-full" />
            </Slider.Track>
            <Slider.Thumb
              className="block w-5 h-5 bg-primary shadow-lg rounded-full hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </Slider.Root>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Base Frequency: {state.baseFreq} Hz</label>
          <Slider.Root
            className="relative flex items-center select-none touch-none w-full h-5"
            value={[state.baseFreq]}
            max={500}
            min={20}
            step={1}
            onValueChange={([value]) => updateBaseFrequency(value)}
          >
            <Slider.Track className="bg-secondary relative grow rounded-full h-[3px]">
              <Slider.Range className="absolute bg-primary rounded-full h-full" />
            </Slider.Track>
            <Slider.Thumb
              className="block w-5 h-5 bg-primary shadow-lg rounded-full hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </Slider.Root>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Volume: {state.volume} dB</label>
          <Slider.Root
            className="relative flex items-center select-none touch-none w-full h-5"
            value={[state.volume]}
            max={0}
            min={-60}
            step={1}
            onValueChange={([value]) => updateVolume(value)}
          >
            <Slider.Track className="bg-secondary relative grow rounded-full h-[3px]">
              <Slider.Range className="absolute bg-primary rounded-full h-full" />
            </Slider.Track>
            <Slider.Thumb
              className="block w-5 h-5 bg-primary shadow-lg rounded-full hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </Slider.Root>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Presets</label>
          <ToggleGroup.Root
            className="grid grid-cols-2 md:grid-cols-5 gap-2"
            type="single"
            value={state.preset}
            onValueChange={(value: keyof typeof PRESETS) => {
              if (value) {
                setState(prev => ({ ...prev, preset: value, frequency: PRESETS[value].freq }))
                if (oscillatorRight.current) {
                  oscillatorRight.current.frequency.value = state.baseFreq + PRESETS[value].freq
                }
              }
            }}
          >
            {Object.entries(PRESETS).map(([key, { name }]) => (
              <ToggleGroup.Item
                key={key}
                value={key}
                className="bg-secondary text-secondary-foreground hover:bg-secondary/80 px-3 py-2 rounded-md text-sm font-medium data-[state=on]:bg-primary data-[state=on]:text-primary-foreground transition-colors"
              >
                {name}
              </ToggleGroup.Item>
            ))}
          </ToggleGroup.Root>
        </div>

        <button
          onClick={togglePlay}
          className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md font-medium transition-colors"
        >
          {state.isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          {state.isPlaying ? 'Stop' : 'Start'}
        </button>

        <div className="text-sm text-muted-foreground space-y-2">
          <h2 className="font-medium text-foreground">Instructions</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Use headphones for the best experience</li>
            <li>Start with a preset or adjust manually</li>
            <li>Keep volume at a comfortable level</li>
            <li>Give your brain time to adjust (5-10 minutes)</li>
          </ul>
        </div>
      </div>
    </div>
  )
} 