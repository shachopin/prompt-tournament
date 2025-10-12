"use client"

import { useState } from "react"
import { TournamentSetup } from "@/components/tournament-setup"
import { TournamentBracket } from "@/components/tournament-bracket"
import { ComparisonView } from "@/components/comparison-view"

export type Prompt = {
  id: string
  name: string
  content: string
}

export type Match = {
  id: string
  round: number
  matchNumber: number
  prompt1: Prompt | null
  prompt2: Prompt | null
  winner: Prompt | null
}

export default function Home() {
  const [stage, setStage] = useState<"setup" | "bracket" | "comparison">("setup")
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [question, setQuestion] = useState("")
  const [matches, setMatches] = useState<Match[]>([])
  const [currentMatch, setCurrentMatch] = useState<Match | null>(null)
  const [isReviewMode, setIsReviewMode] = useState(false)

  const handleStartTournament = (newPrompts: Prompt[], inputQuestion: string) => {
    setPrompts(newPrompts)
    setQuestion(inputQuestion)

    // Create first round matches
    const firstRoundMatches: Match[] = []
    for (let i = 0; i < newPrompts.length; i += 2) {
      firstRoundMatches.push({
        id: `match-${i / 2}`,
        round: 1,
        matchNumber: i / 2,
        prompt1: newPrompts[i],
        prompt2: newPrompts[i + 1] || null,
        winner: null,
      })
    }

    setMatches(firstRoundMatches)
    setStage("bracket")
  }

  const handleStartMatch = (match: Match, reviewMode = false) => {
    setCurrentMatch(match)
    setIsReviewMode(reviewMode)
    setStage("comparison")
  }

  const handleSelectWinner = (winner: Prompt) => {
    if (!currentMatch) return

    // Update the match with the winner
    const updatedMatches = matches.map((m) => (m.id === currentMatch.id ? { ...m, winner } : m))
    setMatches(updatedMatches)

    // Check if round is complete
    const currentRoundMatches = updatedMatches.filter((m) => m.round === currentMatch.round)
    const allMatchesComplete = currentRoundMatches.every((m) => m.winner !== null)

    if (allMatchesComplete) {
      // Create next round matches
      const winners = currentRoundMatches.map((m) => m.winner!).filter(Boolean)

      if (winners.length > 1) {
        const nextRoundMatches: Match[] = []
        for (let i = 0; i < winners.length; i += 2) {
          nextRoundMatches.push({
            id: `match-${currentMatch.round}-${i / 2}`,
            round: currentMatch.round + 1,
            matchNumber: i / 2,
            prompt1: winners[i],
            prompt2: winners[i + 1] || null,
            winner: null,
          })
        }
        setMatches([...updatedMatches, ...nextRoundMatches])
      }
    }

    setStage("bracket")
    setCurrentMatch(null)
    setIsReviewMode(false)
  }

  const handleReset = () => {
    setStage("setup")
    setPrompts([])
    setQuestion("")
    setMatches([])
    setCurrentMatch(null)
    setIsReviewMode(false)
  }

  const handleBackFromReview = () => {
    setStage("bracket")
    setCurrentMatch(null)
    setIsReviewMode(false)
  }

  return (
    <main className="min-h-screen bg-background">
      {stage === "setup" && <TournamentSetup onStart={handleStartTournament} />}

      {stage === "bracket" && (
        <TournamentBracket
          matches={matches}
          question={question}
          onStartMatch={handleStartMatch}
          onReset={handleReset}
        />
      )}

      {stage === "comparison" && currentMatch && (
        <ComparisonView
          match={currentMatch}
          question={question}
          onSelectWinner={handleSelectWinner}
          onBack={handleBackFromReview}
          isReviewMode={isReviewMode}
        />
      )}
    </main>
  )
}
