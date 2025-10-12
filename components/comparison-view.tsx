"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Loader2, Eye } from "lucide-react"
import { useState, useEffect } from "react"
import type { Match, Prompt } from "@/app/prompt/page"
import { generatePromptResponse } from "@/app/prompt/actions"

type ComparisonViewProps = {
  match: Match
  question: string
  onSelectWinner: (winner: Prompt) => void
  onBack: () => void
  isReviewMode?: boolean
}

export function ComparisonView({ match, question, onSelectWinner, onBack, isReviewMode = false }: ComparisonViewProps) {
  const [selectedWinner, setSelectedWinner] = useState<Prompt | null>(null)
  const [response1, setResponse1] = useState<string>("")
  const [response2, setResponse2] = useState<string>("")
  const [loading1, setLoading1] = useState(true)
  const [loading2, setLoading2] = useState(true)
  const [error1, setError1] = useState<string>("")
  const [error2, setError2] = useState<string>("")

  useEffect(() => {
    const fetchResponses = async () => {
      if (!match.prompt1 || !match.prompt2) return

      // Fetch both responses in parallel
      const [result1, result2] = await Promise.all([
        generatePromptResponse(match.prompt1.content, question),
        generatePromptResponse(match.prompt2.content, question),
      ])

      setResponse1(result1.response)
      setError1(result1.error || "")
      setLoading1(false)

      setResponse2(result2.response)
      setError2(result2.error || "")
      setLoading2(false)
    }

    fetchResponses()
  }, [match, question])

  if (!match.prompt1 || !match.prompt2) return null

  const handleSelectWinner = (winner: Prompt) => {
    setSelectedWinner(winner)
    setTimeout(() => {
      onSelectWinner(winner)
    }, 1200)
  }

  const isWinner = (prompt: Prompt) =>
    isReviewMode ? match.winner?.id === prompt.id : selectedWinner?.id === prompt.id
  const isLoser = (prompt: Prompt) =>
    isReviewMode
      ? match.winner !== null && match.winner.id !== prompt.id
      : selectedWinner !== null && selectedWinner.id !== prompt.id

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <Button onClick={onBack} variant="ghost" className="gap-2 mb-4 cursor-pointer">
          <ArrowLeft className="w-4 h-4" />
          Back to Bracket
        </Button>

        <div className="text-center mb-6">
          <Badge variant="outline" className="mb-3">
            {isReviewMode && <Eye className="w-3 h-3 inline mr-1" />}
            Round {match.round} - Match {match.matchNumber + 1}
            {isReviewMode && " (Review)"}
          </Badge>
          <h1 className="text-3xl font-bold mb-2">{isReviewMode ? "Match Review" : "Choose the Better Response"}</h1>
          <p className="text-muted-foreground">
            {isReviewMode
              ? "Reviewing the completed match and responses"
              : "Which prompt produces a better result for this question?"}
          </p>
        </div>

        <Card className="p-4 bg-card border-border">
          <p className="text-sm text-muted-foreground mb-1">Test Question:</p>
          <p className="font-medium">{question}</p>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card
          className={`p-6 bg-card border-border transition-all duration-300 ${
            isWinner(match.prompt1)
              ? "animate-glow-pulse border-primary animate-slide-in-winner"
              : isLoser(match.prompt1)
                ? "animate-knockout"
                : "hover:border-primary/50"
          }`}
        >
          <div className="mb-4">
            <h2 className="text-xl font-bold mb-2">{match.prompt1.name}</h2>
            <Badge variant="secondary">Prompt A</Badge>
            {isReviewMode && isWinner(match.prompt1) && (
              <Badge className="ml-2 bg-primary text-primary-foreground">Winner</Badge>
            )}
          </div>

          <div className="mb-4">
            <p className="text-sm text-muted-foreground mb-2">Prompt Content:</p>
            <div className="p-3 bg-secondary rounded-lg border border-border">
              <pre className="text-xs font-mono whitespace-pre-wrap text-pretty">{match.prompt1.content}</pre>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-sm text-muted-foreground mb-2">AI Response:</p>
            <div className="p-4 bg-background rounded-lg border border-border min-h-[200px]">
              {loading1 ? (
                <div className="flex items-center justify-center h-[200px]">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
              ) : error1 ? (
                <div className="text-destructive text-sm">
                  <p className="font-semibold mb-1">Error:</p>
                  <p>{error1}</p>
                </div>
              ) : (
                <p className="text-sm whitespace-pre-wrap text-pretty leading-relaxed">{response1}</p>
              )}
            </div>
          </div>

          {!isReviewMode && (
            <Button
              onClick={() => handleSelectWinner(match.prompt1!)}
              className="w-full cursor-pointer"
              size="lg"
              disabled={selectedWinner !== null || loading1 || loading2}
            >
              {isWinner(match.prompt1) ? "Winner!" : "Select This Prompt"}
            </Button>
          )}
        </Card>

        <Card
          className={`p-6 bg-card border-border transition-all duration-300 ${
            isWinner(match.prompt2)
              ? "animate-glow-pulse border-primary animate-slide-in-winner"
              : isLoser(match.prompt2)
                ? "animate-knockout"
                : "hover:border-primary/50"
          }`}
        >
          <div className="mb-4">
            <h2 className="text-xl font-bold mb-2">{match.prompt2.name}</h2>
            <Badge variant="secondary">Prompt B</Badge>
            {isReviewMode && isWinner(match.prompt2) && (
              <Badge className="ml-2 bg-primary text-primary-foreground">Winner</Badge>
            )}
          </div>

          <div className="mb-4">
            <p className="text-sm text-muted-foreground mb-2">Prompt Content:</p>
            <div className="p-3 bg-secondary rounded-lg border border-border">
              <pre className="text-xs font-mono whitespace-pre-wrap text-pretty">{match.prompt2.content}</pre>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-sm text-muted-foreground mb-2">AI Response:</p>
            <div className="p-4 bg-background rounded-lg border border-border min-h-[200px]">
              {loading2 ? (
                <div className="flex items-center justify-center h-[200px]">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
              ) : error2 ? (
                <div className="text-destructive text-sm">
                  <p className="font-semibold mb-1">Error:</p>
                  <p>{error2}</p>
                </div>
              ) : (
                <p className="text-sm whitespace-pre-wrap text-pretty leading-relaxed">{response2}</p>
              )}
            </div>
          </div>

          {!isReviewMode && (
            <Button
              onClick={() => handleSelectWinner(match.prompt2!)}
              className="w-full cursor-pointer"
              size="lg"
              disabled={selectedWinner !== null || loading1 || loading2}
            >
              {isWinner(match.prompt2) ? "Winner!" : "Select This Prompt"}
            </Button>
          )}
        </Card>
      </div>

      <div className="mt-8 text-center">
        <p className="text-sm text-muted-foreground">
          {isReviewMode
            ? "This match has been completed. You can review the responses and see which prompt won."
            : "Compare the actual AI responses and choose which prompt produces better results"}
        </p>
      </div>
    </div>
  )
}
