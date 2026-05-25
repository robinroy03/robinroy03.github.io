"use client"

import { useEffect, useCallback } from "react"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"

const STORAGE_KEY = "robinroy-notes"

interface TextEditorProps {
  onExit: () => void
}

export function TextEditor({ onExit }: TextEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: typeof window !== "undefined" ? (localStorage.getItem(STORAGE_KEY) || "") : "",
    editorProps: {
      attributes: {
        class: "outline-none min-h-full prose prose-invert max-w-none text-white/90 text-base leading-relaxed",
      },
    },
  })

  const save = useCallback(() => {
    if (editor) {
      localStorage.setItem(STORAGE_KEY, editor.getHTML())
    }
  }, [editor])

  useEffect(() => {
    const interval = setInterval(save, 2000)
    return () => clearInterval(interval)
  }, [save])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        save()
        onExit()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [save, onExit])

  return (
    <div className="fixed inset-0 z-50 bg-neutral-950 flex flex-col">
      <div className="flex items-center justify-between px-6 py-3 border-b border-white/10">
        <span className="text-white/40 text-xs font-mono">notes — autosaved</span>
        <button
          onClick={() => { save(); onExit() }}
          className="text-white/40 hover:text-white/80 transition-colors text-xs font-mono underline decoration-dotted underline-offset-4"
        >
          close
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-8 py-6">
        <EditorContent editor={editor} className="h-full" />
      </div>
    </div>
  )
}
