import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Loader2 } from 'lucide-react'
import { sendMessage, type Message, type Business } from '../lib/gemini'
import { supabase } from '../lib/supabase'

type Props = {
  business: Business
  color?: string
  businessId?: string
}

export function ChatWidget({ business, color = '#2563eb', businessId }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ block: 'nearest' })
    }
  }, [messages])

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        role: 'assistant',
        content: `Hi! 👋 I'm ${business.bot_name}, the virtual receptionist for ${business.name}. How can I help you today?`
      }])
    }
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 100)
  }, [isOpen])

  async function createConversation(): Promise<string | null> {
    if (!businessId) return null
    try {
      const { data } = await supabase
        .from('conversations')
        .insert({
          business_id: businessId,
          channel: 'chat',
          visitor_id: crypto.randomUUID(),
          is_after_hours: false,
          is_lead: false,
        })
        .select('id')
        .single()
      return data?.id ?? null
    } catch {
      return null
    }
  }

  async function saveMessages(convId: string, userMsg: string, botReply: string) {
    try {
      await supabase.from('messages').insert([
        { conversation_id: convId, role: 'user', content: userMsg },
        { conversation_id: convId, role: 'assistant', content: botReply },
      ])
      const leadKeywords = ['book', 'appointment', 'schedule', 'emergency', 'price', 'cost', 'how much', 'available', 'quote']
      const isLead = leadKeywords.some(k => userMsg.toLowerCase().includes(k))
      if (isLead) {
        await supabase.from('conversations').update({ is_lead: true }).eq('id', convId)
      }
    } catch (err) {
      console.error('Failed to save messages:', err)
    }
  }

  async function handleSend() {
    const text = input.trim()
    if (!text || isLoading) return
    setInput('')
    const userMsg: Message = { role: 'user', content: text }
    const updatedMessages = [...messages, userMsg]
    setMessages(updatedMessages)
    setIsLoading(true)
    try {
      const reply = await sendMessage(updatedMessages, business)
      setMessages(prev => [...prev, { role: 'assistant', content: reply }])
      let convId = conversationId
      if (!convId) {
        convId = await createConversation()
        if (convId) setConversationId(convId)
      }
      if (convId) await saveMessages(convId, text, reply)
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I had a quick issue. Please try again!" }])
    } finally {
      setIsLoading(false)
    }
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 50 }}>
      {isOpen && (
        <div style={{
          marginBottom: 12,
          width: 320,
          height: 480,
          borderRadius: 16,
          border: '0.5px solid #1e2a3a',
          background: '#0a0a0f',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: '0 24px 48px rgba(0,0,0,0.4)',
        }}>
          {/* HEADER */}
          <div style={{ background: color, padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#86efac' }} />
              <span style={{ color: '#fff', fontWeight: 600, fontSize: 13 }}>{business.bot_name}</span>
              <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>· Online</span>
            </div>
            <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center' }}>
              <X size={18} color="rgba(255,255,255,0.8)" />
            </button>
          </div>

          {/* MESSAGES */}
          <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 10, background: '#0a0a0f' }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: '80%',
                  borderRadius: 14,
                  padding: '10px 14px',
                  fontSize: 13,
                  lineHeight: 1.6,
                  background: msg.role === 'user' ? color : '#0d1117',
                  color: msg.role === 'user' ? '#fff' : '#cdd9e8',
                  border: msg.role === 'user' ? 'none' : '0.5px solid #1e2a3a',
                }}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{ background: '#0d1117', border: '0.5px solid #1e2a3a', borderRadius: 14, padding: '10px 14px', display: 'flex', gap: 4, alignItems: 'center' }}>
                  {[0, 150, 300].map((delay) => (
                    <span key={delay} style={{ width: 6, height: 6, borderRadius: '50%', background: '#8899aa', display: 'inline-block', animation: 'bounce 1s infinite', animationDelay: `${delay}ms` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* INPUT */}
          <div style={{ padding: 12, borderTop: '0.5px solid #1e2a3a', background: '#0d1117', flexShrink: 0 }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Type a message…"
                rows={1}
                style={{
                  flex: 1,
                  resize: 'none',
                  background: '#0a0a0f',
                  border: '0.5px solid #1e2a3a',
                  borderRadius: 10,
                  padding: '8px 12px',
                  fontSize: 13,
                  color: '#fff',
                  outline: 'none',
                  lineHeight: 1.5,
                  maxHeight: 112,
                }}
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: color,
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  opacity: (isLoading || !input.trim()) ? 0.4 : 1,
                }}
              >
                {isLoading
                  ? <Loader2 size={15} color="#fff" />
                  : <Send size={14} color="#fff" />
                }
              </button>
            </div>
            <p style={{ textAlign: 'center', fontSize: 11, color: '#8899aa', marginTop: 8 }}>Powered by Desklo</p>
          </div>
        </div>
      )}

      {/* TOGGLE BUTTON */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: 52,
          height: 52,
          borderRadius: '50%',
          background: color,
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginLeft: 'auto',
          boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
        }}
        aria-label="Open chat"
      >
        {isOpen ? <X size={20} color="#fff" /> : <MessageCircle size={20} color="#fff" />}
      </button>
    </div>
  )
}