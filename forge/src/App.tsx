import { useEffect } from 'react';
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
import SystemStats from './components/sidebar/SystemStats';
import ThemeSelector from './components/sidebar/ThemeSelector';
import { useThemeStore } from './store/themeStore';
import ChatHeader from './components/chat/ChatHeader';
import MessageList from './components/chat/MessageList';
import InputArea from './components/chat/InputArea';
import ToastContainer from './components/ui/Toast';

export default function App() {
  const loadModels = useModelStore(s => s.loadModels);
  const isGenerating = useChatStore(s => s.isGenerating);
  const selectedModel = useModelStore(s => s.selectedModel);
  const isAbom = selectedModel.startsWith('abomination');
  const theme = useThemeStore(s => s.theme);

  // Apply theme on mount
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

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

  return (
    <div className={`flex h-screen w-screen bg-bg text-gray-200 ${isAbom ? 'abom-wingdings-cycle' : ''}`}>
      <Sidebar>
        <ThemeSelector />
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
        <div className="border-t border-border pt-3">
          <SystemStats />
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
