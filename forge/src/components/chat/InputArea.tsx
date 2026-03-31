import { useState, useRef, useEffect } from 'react';
import { useChatStore } from '../../store/chatStore';
import { useRagStore } from '../../store/ragStore';
import { useSendMessage } from '../../hooks/useSendMessage';
import { Send, Square, FileText } from 'lucide-react';

export default function InputArea() {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isGenerating = useChatStore(s => s.isGenerating);
  const cancelGeneration = useChatStore(s => s.cancelGeneration);
  const ragEnabled = useRagStore(s => s.enabled);
  const ragDocs = useRagStore(s => s.docs);
  const send = useSendMessage();

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = '48px';
      el.style.height = Math.min(el.scrollHeight, 200) + 'px';
    }
  }, [text]);

  const handleSubmit = () => {
    if (!text.trim() || isGenerating) return;
    send(text);
    setText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
    if (e.key === 'Escape' && isGenerating) {
      cancelGeneration();
    }
  };

  return (
    <div className="px-5 py-3 border-t border-border bg-surface/80 backdrop-blur-sm">
      <div className="flex items-end gap-2">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            rows={1}
            className="w-full bg-surface2 border border-border rounded-lg px-4 py-3 pr-10 text-sm text-[var(--hex-text)] outline-none focus:border-accent resize-none min-h-[48px] max-h-[200px]"
          />
          {ragEnabled && ragDocs.length > 0 && (
            <div className="absolute top-2 right-2 flex items-center gap-1 bg-accent/20 text-accent text-[10px] px-1.5 py-0.5 rounded">
              <FileText size={10} />
              {ragDocs.length}
            </div>
          )}
        </div>
        {isGenerating ? (
          <button
            onClick={cancelGeneration}
            className="p-3 rounded-lg bg-danger text-white hover:bg-danger/80 transition-colors shrink-0"
          >
            <Square size={18} />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!text.trim()}
            className="p-3 rounded-lg bg-accent text-white hover:bg-accent/80 transition-colors disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
          >
            <Send size={18} />
          </button>
        )}
      </div>
    </div>
  );
}
