import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

export interface LinkEditorProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultUrl?: string
  defaultText?: string
  defaultIsNewTab?: boolean
  onSave: (url: string, text?: string, isNewTab?: boolean) => void
}

export const LinkEditBlock = React.forwardRef<HTMLDivElement, LinkEditorProps>(
  ({ onSave, defaultIsNewTab, defaultUrl, defaultText, className }, ref) => {
    const formRef = React.useRef<HTMLDivElement>(null)
    const [url, setUrl] = React.useState(defaultUrl || '')
    const [text, setText] = React.useState(defaultText || '')
    const [isNewTab, setIsNewTab] = React.useState(defaultIsNewTab || false)

    const handleSave = React.useCallback(
      (e: React.FormEvent) => {
        e.preventDefault()
        if (formRef.current) {
          const isValid = Array.from(formRef.current.querySelectorAll('input')).every(input => input.checkValidity())

          if (isValid) {
            onSave(url, text, isNewTab)
          } else {
            formRef.current.querySelectorAll('input').forEach(input => {
              if (!input.checkValidity()) {
                input.reportValidity()
              }
            })
          }
        }
      },
      [onSave, url, text, isNewTab]
    )

    React.useImperativeHandle(ref, () => formRef.current as HTMLDivElement)

    return (
      <div ref={formRef}>
        <div className={cn('space-y-4', className)}>
          <div className="space-y-1">
            <Label>URL</Label>
            <Input type="url" required placeholder="Enter URL" value={url} onChange={e => setUrl(e.target.value)} />
          </div>

          <div className="space-y-1">
            <Label>Display Text (optional)</Label>
            <Input type="text" placeholder="Enter display text" value={text} onChange={e => setText(e.target.value)} />
          </div>

          <div className="flex items-center space-x-2">
            <Label>Open in New Tab</Label>
            <Switch checked={isNewTab} onCheckedChange={setIsNewTab} />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" onClick={handleSave}>
              Save
            </Button>
          </div>
        </div>
      </div>
    )
  }
)

LinkEditBlock.displayName = 'LinkEditBlock'

export default LinkEditBlock
