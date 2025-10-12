"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Plus, Trash2, Trophy } from "lucide-react"
//import type { Prompt } from "@/app/page"



function isPowerOfTwo(n) {
  // A number must be positive to be a power of two (2^0 = 1, 2^1 = 2, etc.)
  // Also, 0 is not considered a power of two in this context.
  if (n <= 0) {
    return false;
  }

  // A power of two in binary has only one bit set (e.g., 1 (0001), 2 (0010), 4 (0100), 8 (1000)).
  // Subtracting 1 from a power of two flips all bits from the rightmost set bit to the right (e.g., 8 (1000) - 1 = 7 (0111)).
  // Performing a bitwise AND operation between a power of two and (that number - 1) will result in 0.
  // For example: 8 (1000) & 7 (0111) = 0.
  // Any other positive number will not result in 0 (e.g., 6 (0110) & 5 (0101) = 4 (0100)).
  return (n & (n - 1)) === 0;
}

export function TournamentSetup({ onStart = (...args) => {console.log(args)} }) {
  const [question, setQuestion] = useState("")
  const [prompts, setPrompts] = useState([
    { id: "1", name: "Prompt 1", content: "" },
    { id: "2", name: "Prompt 2", content: "" },
    { id: "3", name: "Prompt 3", content: "" },
    { id: "4", name: "Prompt 4", content: "" },
  ])

  const addPrompt = () => {
    const newId = (prompts.length + 1).toString()
    setPrompts([...prompts, { id: newId, name: `Prompt ${newId}`, content: "" }])
  }

  const removePrompt = (id: string) => {
    if (prompts.length <= 2) return
    setPrompts(prompts.filter((p) => p.id !== id))
  }

  const updatePrompt = (id: string, field: "name" | "content", value: string) => {
    setPrompts(prompts.map((p) => (p.id === id ? { ...p, [field]: value } : p)))
  }

  const handleStart = () => {
    if (!question.trim()) {
      alert("Please enter a test question")
      return
    }

    const validPrompts = prompts.filter((p) => p.content.trim())
    if (validPrompts.length < 2) {
      alert("Please enter at least 2 prompts")
      return
    }

    // Ensure even number of prompts for tournament bracket
    if (!isPowerOfTwo(validPrompts.length)) {
      alert("Please enter an even number of prompts (2, 4, 8, 16, etc.)")
      return
    }

    onStart(validPrompts, question)
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Trophy className="w-10 h-10 text-primary" />
          <h1 className="text-4xl font-bold text-balance">Prompt Tournament</h1>
        </div>
        <p className="text-muted-foreground text-lg text-balance">
          Compare prompts head-to-head to find the best performer
        </p>
      </div>

      <Card className="p-6 mb-8 bg-card border-border">
        <Label htmlFor="question" className="text-base font-semibold mb-2 block">
          Test Question
        </Label>
        <p className="text-sm text-muted-foreground mb-3">This question will be used to evaluate all prompts</p>
        <Textarea
          id="question"
          placeholder="Enter the question that all prompts will be tested against..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="min-h-24 bg-background border-border"
        />
      </Card>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Prompts ({prompts.length})</h2>
          <Button onClick={addPrompt} variant="outline" size="sm" className="gap-2 bg-transparent cursor-pointer">
            <Plus className="w-4 h-4" />
            Add Prompt
          </Button>
        </div>

        <div className="grid gap-4">
          {prompts.map((prompt, index) => (
            <Card key={prompt.id} className="p-4 bg-card border-border">
              <div className="flex items-start gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-mono text-sm font-semibold">
                      {index + 1}
                    </div>
                    <Input
                      placeholder="Prompt name"
                      value={prompt.name}
                      onChange={(e) => updatePrompt(prompt.id, "name", e.target.value)}
                      className="flex-1 bg-background border-border"
                    />
                  </div>
                  <Textarea
                    placeholder="Enter your prompt here..."
                    value={prompt.content}
                    onChange={(e) => updatePrompt(prompt.id, "content", e.target.value)}
                    className="min-h-32 bg-background border-border font-mono text-sm"
                  />
                </div>
                {prompts.length > 2 && (
                  <Button
                    onClick={() => removePrompt(prompt.id)}
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-destructive cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div className="flex justify-center">
        <Button onClick={handleStart} size="lg" className="gap-2 px-8 cursor-pointer">
          <Trophy className="w-5 h-5" />
          Start Tournament
        </Button>
      </div>
    </div>
  )
}
