import { NextRequest, NextResponse } from 'next/server'
import { buildSnaggySystemPrompt } from '@/lib/snaggyContext'

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()
    const systemPrompt = buildSnaggySystemPrompt()

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'system', content: systemPrompt }, ...messages],
        temperature: 0.72,
        max_tokens: 720,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Groq API error details:', errorData)
      throw new Error(`Groq API error: ${JSON.stringify(errorData)}`)
    }

    const data = await response.json()
    const message = data.choices[0]?.message?.content || 'Sorry, I could not generate a response.'

    return NextResponse.json({ message })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json({ error: 'Failed to process chat request' }, { status: 500 })
  }
}
