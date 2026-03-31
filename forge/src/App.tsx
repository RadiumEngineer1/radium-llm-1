import { useEffect, useState } from 'react';
import { useModelStore } from './store/modelStore';
import { useChatStore } from './store/chatStore';
import { checkHealth } from './lib/ollama';
import Sidebar from './components/layout/Sidebar';
import MainPanel from './components/layout/MainPanel';
import ModelSelector from './components/sidebar/ModelSelector';
import EmbedModelSelector from './components/sidebar/EmbedModelSelector';
import GenerationParams from './components/sidebar/GenerationParams';
import SystemPrompt from './components/sidebar/SystemPrompt';
import RagSection from './components/sidebar/RagSection';
import ChatHeader from './components/chat/ChatHeader';
import MessageList from './components/chat/MessageList';
import InputArea from './components/chat/InputArea';
import ToastContainer from './components/ui/Toast';

export default function App() {
  const loadModels = useModelStore(s => s.loadModels);
  const isGenerating = useChatStore(s => s.isGenerating);
  const selectedModel = useModelStore(s => s.selectedModel);
  const isAbom = selectedModel.startsWith('abomination');
  const [webdings, setWebdings] = useState(false);

  useEffect(() => {
    loadModels();
  }, [loadModels]);

  useEffect(() => {
    const interval = setInterval(async () => {
      if (isGenerating) return;
      const healthy = await checkHealth();
      const currentStatus = useModelStore.getState().status;

      if (healthy && currentStatus === 'offline') {
        loadModels();
      } else if (!healthy && currentStatus === 'online') {
        useModelStore.setState({
          status: 'offline',
          statusText: 'Ollama offline — run "ollama serve"',
        });
      }
    }, 12000);

    return () => clearInterval(interval);
  }, [isGenerating, loadModels]);

  // Rare webdings takeover — all text on screen becomes symbols
  useEffect(() => {
    if (!isAbom) return;
    const interval = setInterval(() => {
      if (Math.random() < 0.3) {
        setWebdings(true);
        setTimeout(() => setWebdings(false), 150 + Math.random() * 250);
      }
    }, 12000 + Math.random() * 20000);
    return () => clearInterval(interval);
  }, [isAbom]);

  return (
    <div
      className="flex h-screen w-screen bg-bg text-gray-200 transition-all duration-75"
      style={webdings ? {
        fontFamily: 'Wingdings, Webdings, Symbol, fantasy',
        filter: 'hue-rotate(180deg) brightness(1.3)',
      } : undefined}
    >
      <Sidebar>
        <ModelSelector />
        <EmbedModelSelector />
        <div className="border-t border-border pt-3">
          <GenerationParams />
        </div>
        <div className="border-t border-border pt-3">
          <SystemPrompt />
        </div>
        <div className="border-t border-border pt-3">
          <RagSection />
        </div>
      </Sidebar>

      <MainPanel>
        <ChatHeader />
        <MessageList />
        <InputArea />
      </MainPanel>

      <ToastContainer />
    </div>
  );
}
