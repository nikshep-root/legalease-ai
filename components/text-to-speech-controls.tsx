"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, Square, Volume2, Settings } from "lucide-react"
import { useTextToSpeech } from "@/hooks/use-text-to-speech"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface TextToSpeechControlsProps {
  text: string
  title?: string
}

export function TextToSpeechControls({ text, title = "Listen to Summary" }: TextToSpeechControlsProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const {
    isPlaying,
    isPaused,
    isSupported,
    speak,
    pause,
    resume,
    stop,
    setRate,
    setVoice,
    voices,
    currentVoice,
    rate,
  } = useTextToSpeech()

  if (!isSupported) {
    return (
      <Card className="border-muted">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Volume2 className="w-4 h-4" />
            <span className="text-sm">Text-to-speech is not supported in your browser</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  const handlePlayPause = () => {
    if (isPlaying) {
      if (isPaused) {
        resume()
      } else {
        pause()
      }
    } else {
      speak(text)
    }
  }

  return (
    <Card className="border-primary/20 bg-card">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg text-card-foreground">
          <Volume2 className="w-5 h-5 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Main Controls */}
        <div className="flex items-center gap-2">
          <Button
            onClick={handlePlayPause}
            variant={isPlaying ? "secondary" : "default"}
            size="sm"
            className="flex items-center gap-2 font-medium"
          >
            {isPlaying && !isPaused ? (
              <>
                <Pause className="w-4 h-4" />
                Pause
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                {isPaused ? "Resume" : "Play"}
              </>
            )}
          </Button>

          {isPlaying && (
            <Button onClick={stop} variant="outline" size="sm">
              <Square className="w-4 h-4" />
            </Button>
          )}

          <Collapsible open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
            </CollapsibleTrigger>
          </Collapsible>
        </div>

        {/* Settings Panel */}
        <Collapsible open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
          <CollapsibleContent className="space-y-4 pt-2 border-t border-border">
            {/* Voice Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Voice</label>
              <Select
                value={currentVoice?.name || ""}
                onValueChange={(value) => {
                  const voice = voices.find((v) => v.name === value) || null
                  setVoice(voice)
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a voice" />
                </SelectTrigger>
                <SelectContent>
                  {voices
                    .filter((voice) => voice.lang.startsWith("en"))
                    .map((voice) => (
                      <SelectItem key={voice.name} value={voice.name}>
                        {voice.name} ({voice.lang})
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            {/* Speed Control */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-medium">Speed</label>
                <span className="text-sm text-muted-foreground">{rate.toFixed(1)}x</span>
              </div>
              <Slider
                value={[rate]}
                onValueChange={([value]) => setRate(value)}
                min={0.5}
                max={2}
                step={0.1}
                className="w-full"
              />
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Status */}
        {isPlaying && (
          <div className="text-sm text-muted-foreground flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            {isPaused ? "Paused" : "Playing"}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
