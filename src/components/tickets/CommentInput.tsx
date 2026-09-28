import { useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { Send } from 'lucide-react'
import { users, userFullName } from '@/data/users'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { useStore } from '@/store/useStore'

interface CommentInputProps {
  ticketId: string
}

export function CommentInput({ ticketId }: CommentInputProps) {
  const addComment = useStore((s) => s.addComment)
  const [value, setValue] = useState('')
  const [suggestions, setSuggestions] = useState<typeof users>([])
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  function updateSuggestions(text: string, caret: number) {
    const uptoCaret = text.slice(0, caret)
    const match = uptoCaret.match(/@([\p{L}]*)$/u)
    if (!match) {
      setSuggestions([])
      return
    }
    const filter = match[1].toLowerCase()
    setSuggestions(users.filter((u) => u.firstName.toLowerCase().startsWith(filter)))
  }

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setValue(e.target.value)
    updateSuggestions(e.target.value, e.target.selectionStart ?? e.target.value.length)
  }

  function insertMention(firstName: string) {
    const el = textareaRef.current
    if (!el) return
    const caret = el.selectionStart ?? value.length
    const uptoCaret = value.slice(0, caret)
    const match = uptoCaret.match(/@([\p{L}]*)$/u)
    if (!match) return
    const start = caret - match[0].length
    const before = value.slice(0, start)
    const after = value.slice(caret)
    const next = `${before}@${firstName} ${after}`
    flushSync(() => {
      setValue(next)
      setSuggestions([])
    })
    const pos = before.length + firstName.length + 2
    el.focus()
    el.setSelectionRange(pos, pos)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!value.trim()) return
    addComment(ticketId, value)
    setValue('')
    setSuggestions([])
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <label htmlFor="comment-input" className="sr-only">
        Ajouter un commentaire
      </label>
      <textarea
        id="comment-input"
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        placeholder="Ajouter un commentaire… utilisez @ pour mentionner un collègue"
        className="min-h-[80px] w-full resize-y rounded border border-line bg-surface px-3 py-2 text-sm text-ink placeholder:text-ink-muted transition-colors duration-fast focus:border-terracotta focus:outline-none focus:ring-1 focus:ring-terracotta"
      />

      {suggestions.length > 0 && (
        <ul
          role="listbox"
          aria-label="Suggestions de mention"
          className="absolute bottom-full left-0 z-10 mb-1 w-56 overflow-hidden rounded-md border border-line bg-surface py-1 shadow-panel"
        >
          {suggestions.map((u) => (
            <li key={u.id}>
              <button
                type="button"
                onClick={() => insertMention(u.firstName)}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors duration-fast hover:bg-sunken"
              >
                <Avatar user={u} size="sm" />
                {userFullName(u)}
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-2 flex justify-end">
        <Button type="submit" variant="primary" size="sm" disabled={!value.trim()}>
          <Send className="h-3.5 w-3.5" />
          Commenter
        </Button>
      </div>
    </form>
  )
}
