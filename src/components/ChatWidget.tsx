import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Loader2 } from 'lucide-react'
import { sendMessage, type Message, type Business } from '../lib/gemini'
import { supabase } from '../lib/supabase'

type Props = {
  business: Business
  color?: string
  businessId?: string
}

export function ChatWidget({ business, color = '#7B61FF', businessId }: Props) {
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

      // Detect lead intent
      const leadKeywords = ['book', 'appointment', 'schedule', 'emergency', 'price', 'cost', 'how much', 'available', 'quote']
      const isLead = leadKeywords.some(k => userMsg.toLowerCase().includes(k))

      if (isLead) {
        await supabase
          .from('conversations')
          .update({ is_lead: true })
          .eq('id', convId)
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

      // Save to Supabase
      let convId = conversationId
      if (!convId) {
        convId = await createConversation()
        if (convId) setConversationId(convId)
      }
      if (convId) {
        await saveMessages(convId, text, reply)
      }

    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "Sorry, I had a quick issue. Please try again!"
      }])
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
    <div className="fixed bottom-5 right-5 z-50">
      {isOpen && (
        <div
          className="mb-3 w-80 rounded-2xl shadow-2xl border border-gray-200 bg-white flex flex-col overflow-hidden"
          style={{ height: '480px' }}
        >
          <div
            className="flex items-center justify-between px-4 py-3 flex-shrink-0"
            style={{ background: color }}
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-300 animate-pulse" />
              <span className="text-white font-semibold text-sm">{business.bot_name}</span>
              <span className="text-white/70 text-xs">· Online</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white transition-colors">
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-xs rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'text-white rounded-br-sm'
                      : 'bg-white text-gray-800 border border-gray-200 rounded-bl-sm shadow-sm'
                  }`}
                  style={msg.role === 'user' ? { background: color } : {}}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                  <div className="flex gap-1 items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 border-t border-gray-100 bg-white flex-shrink-0">
            <div className="flex gap-2 items-end">
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Type a message…"
                rows={1}
                className="flex-1 resize-none rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-purple-300 max-h-28"
                style={{ lineHeight: '1.5' }}
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 disabled:opacity-40 transition-opacity"
                style={{ background: color }}
              >
                {isLoading
                  ? <Loader2 size={16} className="text-white animate-spin" />
                  : <Send size={14} className="text-white" />
                }
              </button>
            </div>
            <p className="text-center text-gray-400 text-xs mt-1.5">Powered by Desklo</p>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full shadow-lg flex items-center justify-center ml-auto transition-transform hover:scale-105 active:scale-95"
        style={{ background: color }}
        aria-label="Open chat"
      >
        {isOpen ? <X size={22} className="text-white" /> : <MessageCircle size={22} className="text-white" />}
      </button>
    </div>
  )
}