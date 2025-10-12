"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, ArrowLeft, Crown } from "lucide-react"
import type { Match } from "@/app/prompt/page"

type TournamentBracketProps = {
  matches: Match[]
  question: string
  onStartMatch: (match: Match, reviewMode?: boolean) => void
  onReset: () => void
}

export function TournamentBracket({ matches, question, onStartMatch, onReset }: TournamentBracketProps) {
  const maxRound = Math.max(...matches.map((m) => m.round))
  const rounds = Array.from({ length: maxRound }, (_, i) => i + 1)

  const winner = matches.find((m) => m.round === maxRound && m.winner !== null)?.winner

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <Button onClick={onReset} variant="ghost" className="gap-2 cursor-pointer">
          <ArrowLeft className="w-4 h-4" />
          Back to Setup
        </Button>
        <div className="flex items-center gap-2">
          <Trophy className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold">Tournament Bracket</h1>
        </div>
        <div className="w-32" />
      </div>

      <Card className="p-4 mb-8 bg-card border-border">
        <p className="text-sm text-muted-foreground mb-1">Test Question:</p>
        <p className="font-medium">{question}</p>
      </Card>

      {winner && (
        <Card className="p-6 mb-8 bg-primary/10 border-primary/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Crown className="w-12 h-12 text-primary" />
              <div>
                <h2 className="text-2xl font-bold mb-1">Tournament Winner!</h2>
                <p className="text-lg text-primary font-semibold">{winner.name}</p>
              </div>
            </div>
            <Button onClick={onReset} variant="outline" className="gap-2 bg-transparent cursor-pointer">
              <ArrowLeft className="w-4 h-4" />
              Start New Tournament
            </Button>
          </div>
        </Card>
      )}

      <div className="overflow-x-auto pb-4">
        <div className="flex gap-8 min-w-max">
          {rounds.map((round) => {
            const roundMatches = matches.filter((m) => m.round === round)

            return (
              <div key={round} className="flex-shrink-0" style={{ width: "320px" }}>
                <div className="mb-4">
                  <Badge variant="outline" className="text-sm">
                    {round === maxRound && roundMatches.length === 1 ? "Final" : `Round ${round}`}
                  </Badge>
                </div>

                <div className="space-y-4">
                  {roundMatches.map((match) => (
                    <Card
                      key={match.id}
                      className={`p-4 bg-card border-border transition-colors ${
                        match.winner ? "hover:border-primary/50 cursor-pointer" : ""
                      }`}
                      onClick={() => match.winner && onStartMatch(match, true)}
                    >
                      <div className="space-y-3">
                        <div
                          className={`p-3 rounded-lg border transition-all duration-300 ${
                            match.winner?.id === match.prompt1?.id
                              ? "bg-primary/20 border-primary animate-slide-in-winner"
                              : match.winner && match.winner.id !== match.prompt1?.id
                                ? "bg-secondary/50 border-border opacity-50"
                                : "bg-secondary border-border"
                          }`}
                        >
                          <p className="font-semibold text-sm">{match.prompt1?.name || "TBD"}</p>
                        </div>

                        <div className="text-center text-xs text-muted-foreground font-mono">VS</div>

                        <div
                          className={`p-3 rounded-lg border transition-all duration-300 ${
                            match.winner?.id === match.prompt2?.id
                              ? "bg-primary/20 border-primary animate-slide-in-winner"
                              : match.winner && match.winner.id !== match.prompt2?.id
                                ? "bg-secondary/50 border-border opacity-50"
                                : "bg-secondary border-border"
                          }`}
                        >
                          <p className="font-semibold text-sm">{match.prompt2?.name || "TBD"}</p>
                        </div>

                        {!match.winner && match.prompt1 && match.prompt2 && (
                          <Button onClick={() => onStartMatch(match)} className="w-full cursor-pointer" size="sm">
                            Compare
                          </Button>
                        )}

                        {match.winner && (
                          <div className="text-center">
                            <Badge className="bg-primary text-primary-foreground">Winner: {match.winner.name}</Badge>
                            <p className="text-xs text-muted-foreground mt-2">Click to review</p>
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
