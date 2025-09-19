"use client"

import { useState, useCallback, useRef, useEffect } from "react"

interface UseTextToSpeechReturn {
  isPlaying: boolean
  isPaused: boolean
  isSupported: boolean
  speak: (text: string) => void
  pause: () => void
  resume: () => void
  stop: () => void
  setRate: (rate: number) => void
  setVoice: (voice: SpeechSynthesisVoice | null) => void
  voices: SpeechSynthesisVoice[]
  currentVoice: SpeechSynthesisVoice | null
  rate: number
}

export function useTextToSpeech(): UseTextToSpeechReturn {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [currentVoice, setCurrentVoice] = useState<SpeechSynthesisVoice | null>(null)
  const [rate, setRate] = useState(1)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      setIsSupported(true)

      const loadVoices = () => {
        const availableVoices = speechSynthesis.getVoices()
        setVoices(availableVoices)

        // Set default voice (prefer English voices)
        const englishVoice =
          availableVoices.find((voice) => voice.lang.startsWith("en") && voice.default) ||
          availableVoices.find((voice) => voice.lang.startsWith("en")) ||
          availableVoices[0]

        setCurrentVoice(englishVoice || null)
      }

      loadVoices()
      speechSynthesis.addEventListener("voiceschanged", loadVoices)

      return () => {
        speechSynthesis.removeEventListener("voiceschanged", loadVoices)
      }
    }
  }, [])

  const speak = useCallback(
    (text: string) => {
      if (!isSupported) return

      // Stop any current speech
      speechSynthesis.cancel()

      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = rate

      if (currentVoice) {
        utterance.voice = currentVoice
      }

      utterance.onstart = () => {
        setIsPlaying(true)
        setIsPaused(false)
      }

      utterance.onend = () => {
        setIsPlaying(false)
        setIsPaused(false)
      }

      utterance.onerror = () => {
        setIsPlaying(false)
        setIsPaused(false)
      }

      utterance.onpause = () => {
        setIsPaused(true)
      }

      utterance.onresume = () => {
        setIsPaused(false)
      }

      utteranceRef.current = utterance
      speechSynthesis.speak(utterance)
    },
    [isSupported, currentVoice, rate],
  )

  const pause = useCallback(() => {
    if (isSupported && isPlaying && !isPaused) {
      speechSynthesis.pause()
    }
  }, [isSupported, isPlaying, isPaused])

  const resume = useCallback(() => {
    if (isSupported && isPlaying && isPaused) {
      speechSynthesis.resume()
    }
  }, [isSupported, isPlaying, isPaused])

  const stop = useCallback(() => {
    if (isSupported) {
      speechSynthesis.cancel()
      setIsPlaying(false)
      setIsPaused(false)
    }
  }, [isSupported])

  const setVoice = useCallback((voice: SpeechSynthesisVoice | null) => {
    setCurrentVoice(voice)
  }, [])

  const setRateValue = useCallback((newRate: number) => {
    setRate(Math.max(0.1, Math.min(2, newRate)))
  }, [])

  return {
    isPlaying,
    isPaused,
    isSupported,
    speak,
    pause,
    resume,
    stop,
    setRate: setRateValue,
    setVoice,
    voices,
    currentVoice,
    rate,
  }
}
