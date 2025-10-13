"use server"

import { openai } from '@ai-sdk/openai';
import { generateText } from "ai"
import { db } from '@/db'
import { prompts } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function generatePromptResponse(
  systemPrompt: string,
  userQuestion: string,
): Promise<{ response: string; error?: string }> {
  try {
    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
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

export async function createPrompt(data) {
  try {
    await db.insert(prompts).values({
      content: data.content,
      response: data.response,
      //userId: validatedData.userId,
    })
    return { success: true, message: 'Prompt created successfully' }
  } catch (error) {
    console.error('Error creating prompt:', error)
    return {
      success: false,
      message: 'An error occurred while creating the prompt',
      error: 'Failed to create prompt',
    }
  }
}

export async function getPrompt(id) {
  try {
    const result = await db.query.prompts.findFirst({
      where: eq(prompts.id, id),
      // with: {
      //   user: true,
      // },
    })
    return result;
  } catch (error) {
    console.error(`Error fetching prompt ${id}:`, error)
    return {
      success: false,
      message: 'An error occurred while getting the prompt',
      error: 'Failed to get the prompt',
    }
  }
}
