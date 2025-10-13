"use server"


import { db } from '@/db'
import { prompts } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { OpenAI } from 'langchain/llms/openai'
import { PromptTemplate} from 'langchain/prompts'
import { ChatPromptTemplate } from "@langchain/core/prompts";

export const askAI = async (prompt, question) => {
  const input = await getLangPrompt(prompt, question)
  const model = new OpenAI({ temperature: 0, modelName: 'gpt-3.5-turbo' })
  const output = await model.call(input)
  console.log(output)
  return { response: output }
}

const getLangPrompt = async (prompt, question) => {
 
  const chatPromptTemplate = ChatPromptTemplate.fromMessages([
    ["system", "Adhere to this background information no matter what! {prompt}"],
    ["user", "I want to ask {question}?"],
  ]);

  // Invoke the template with your question/inputs
  const formattedChatPrompt = await chatPromptTemplate.format({
    prompt, question
  });
  
  return formattedChatPrompt;

}

export async function createPrompt(data) {
  try {
    await db.insert(prompts).values({
      id: data.id,
      content: data.content,
      response: data.response,
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

export async function clearAllPrompts() {
  await db.delete(prompts);
  console.log('All items cleared from the users table.');
}

