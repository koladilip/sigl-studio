import { ChangeEvent } from 'react'
import './CodeEditor.css'

interface CodeEditorProps {
  value: string
  onChange: (value: string) => void
}

export default function CodeEditor({ value, onChange }: CodeEditorProps) {
  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value)
  }

  return (
    <div className="code-editor-container">
      <textarea
        className="code-editor"
        value={value}
        onChange={handleChange}
        spellCheck={false}
        placeholder="Enter SIGL code here..."
      />
      <div className="code-editor-info">
        Lines: {value.split('\n').length} | Characters: {value.length}
      </div>
    </div>
  )
}

