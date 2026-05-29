import { X, Eye } from 'lucide-react';

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: string;
  title: string;
}

export default function PreviewModal({ isOpen, onClose, content, title }: PreviewModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative bg-white rounded-2xl shadow-notion-deep w-full max-w-3xl max-h-[90vh] overflow-hidden animate-slide-up">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(0,0,0,0.1)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-red/10 rounded-lg flex items-center justify-center">
              <Eye className="w-5 h-5 text-primary-red" />
            </div>
            <div>
              <h3 className="font-semibold text-[rgba(0,0,0,0.95)]">页面预览</h3>
              <p className="text-sm text-[#a39e98]">{title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-md text-[#a39e98] hover:text-[rgba(0,0,0,0.95)] hover:bg-[rgba(0,0,0,0.05)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-8 overflow-y-auto max-h-[calc(90vh-80px)] bg-warm-white">
          <div
            className="prose prose-sm max-w-none bg-white p-8 rounded-xl shadow-sm"
            dangerouslySetInnerHTML={{ __html: content || '<p>暂无内容</p>' }}
          />
        </div>
      </div>
    </div>
  );
}
