"use server"

import { generateText } from "ai"

export async function generatePromptResponse(
  systemPrompt: string,
  userQuestion: string,
): Promise<{ response: string; error?: string }> {
  try {
    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: userQuestion,
        },
      ],
      temperature: 0.7,
    })

    return { response: text }
  } catch (error) {
    console.error("[v0] Error generating response:", error)
    return {
      response: "",
      error: error instanceof Error ? error.message : "Failed to generate response",
    }
  }
}
