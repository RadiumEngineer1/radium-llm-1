import { useModelStore } from '../../store/modelStore';
import { useChatStore } from '../../store/chatStore';
import IconButton from '../ui/IconButton';
import { Trash2, Download } from 'lucide-react';

export default function ChatHeader() {
  const selectedModel = useModelStore(s => s.selectedModel);
  const { messages, clearChat } = useChatStore();
  const isAbom = selectedModel.startsWith('abomination');

  const exportChat = () => {
    const md = messages
      .map(m => `**${m.role}:**\n${m.content}`)
      .join('\n\n---\n\n');
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `forge-chat-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-surface/80 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        {isAbom && (
          <span className="text-[9px] font-mono text-danger/40 tracking-wider">CLASSIFIED //</span>
        )}
        <span
          className="text-accent tracking-wider"
          style={{ fontFamily: "'Black Ops One', cursive", fontSize: isAbom ? '18px' : '14px' }}
        >
          {selectedModel || 'No model'}
        </span>
        {isAbom && (
          <span className="text-[9px] font-mono text-danger/40 tracking-wider">// ACTIVE</span>
        )}
      </div>
      <div className="flex items-center gap-1">
        <IconButton onClick={exportChat} tooltip="Export chat" disabled={messages.length === 0}>
          <Download size={15} />
        </IconButton>
        <IconButton onClick={clearChat} tooltip="Clear chat" disabled={messages.length === 0}>
          <Trash2 size={15} />
        </IconButton>
      </div>
    </div>
  );
}
