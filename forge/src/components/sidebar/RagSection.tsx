import { useRagStore } from '../../store/ragStore';
import Toggle from '../ui/Toggle';
import Dropzone from './Dropzone';
import DocList from './DocList';

export default function RagSection() {
  const { enabled, toggleEnabled } = useRagStore();

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs text-muted uppercase tracking-wider">RAG</h3>
        <Toggle label="" checked={enabled} onChange={toggleEnabled} />
      </div>
      <Dropzone />
      <div className="mt-2">
        <DocList />
      </div>
    </div>
  );
}
