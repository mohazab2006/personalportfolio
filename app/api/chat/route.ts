import { NextRequest, NextResponse } from 'next/server'
import { buildSnaggySystemPrompt } from '@/lib/snaggyContext'

/**
 * Groq retires models periodically (llama-3.3-70b-versatile was pulled), so the model is
 * configurable. Override with GROQ_MODEL in the environment without touching code.
 */
const MODEL = process.env.GROQ_MODEL?.trim() || 'openai/gpt-oss-120b'

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
        model: MODEL,
        messages: [{ role: 'system', content: systemPrompt }, ...messages],
        temperature: 0.58,
        // gpt-oss is a reasoning model: keep thinking short, and leave headroom so reasoning
        // tokens never eat the whole budget and return an empty answer.
        ...(MODEL.startsWith('openai/gpt-oss') ? { reasoning_effort: 'low' } : {}),
        max_completion_tokens: 900,
      }),
    })

    // Free-plan rate limit (tokens/min or requests/day). Not an error on our side: tell the
    // client how long to wait so Snaggy can say so plainly instead of "connection dropped".
    if (response.status === 429) {
      const retryAfter = Math.ceil(Number(response.headers.get('retry-after')) || 30)
      console.warn(`Groq rate limited; retry after ${retryAfter}s`)
      return NextResponse.json(
        { error: 'rate_limited', retryAfter },
        { status: 429, headers: { 'Retry-After': String(retryAfter) } }
      )
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('Groq API error details:', errorData)
      throw new Error(`Groq API error: ${JSON.stringify(errorData)}`)
    }

    const data = await response.json()
    const raw: string = data.choices[0]?.message?.content || 'Sorry, I could not generate a response.'
    // Safety net for a plain-text terminal: strip any markdown the model slips in.
    const message = raw
      .replace(/\*\*(.+?)\*\*/g, '$1')
      .replace(/__(.+?)__/g, '$1')
      .replace(/(^|\s)\*(\S.*?\S|\S)\*(?=\s|[.,!?]|$)/g, '$1$2')
      .replace(/^#{1,6}\s+/gm, '')
      .replace(/^\s*[-*•]\s+/gm, '')
      .replace(/`([^`]+)`/g, '$1')
      .trim()

    return NextResponse.json({ message })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json({ error: 'Failed to process chat request' }, { status: 500 })
  }
}
