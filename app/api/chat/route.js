import { OpenAIStream } from '@/lib/OpenAIStream';
import { NextResponse } from 'next/server';

// break the app if the API key is missing
if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing Environment Variable OPENAI_API_KEY')
}

export const runtime = 'edge';

export async function POST(req) {
  const body = await req.json()

  const messages = [
    {
      role: 'system',
      content: ``,
    },
  ]
  messages.push(...body?.messages)

  const payload = {
    model: 'gpt-3.5-turbo',
    messages: messages,
    temperature: process.env.AI_TEMP ? parseFloat(process.env.AI_TEMP) : 0.7,
    max_tokens: process.env.AI_MAX_TOKENS
      ? parseInt(process.env.AI_MAX_TOKENS)
      : 200,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    stream: true,
    n: 1,
  }

  const stream = await OpenAIStream(payload)
  return new NextResponse(stream)
}