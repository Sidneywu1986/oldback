import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { Bold, Italic, Underline, Strikethrough, Heading1, Heading2, Heading3, List, ListOrdered, Quote, Link2, ImageIcon, Undo, Redo } from 'lucide-react';
export interface RichTextEditorProps {
 value: string;
 onChange: (content: string) => void;
 placeholder?: string;
}
export default function RichTextEditor({ value, onChange, placeholder = '开始编辑...' }: RichTextEditorProps) {
 const editor = useEditor({
 extensions: [
 StarterKit,
 Image.configure({
 inline: true,
 }),
 Link.configure({
 openOnClick: false,
 }),
 Placeholder.configure({
 placeholder,
 }),
 ],
 content: value,
 onUpdate: ({ editor }) => {
 onChange(editor.getHTML());
 },
 });
 const ToolbarButton = ({ onClick, isActive, disabled, children, title }: {
 onClick: () => void;
 isActive?: boolean;
 disabled?: boolean;
 children: React.ReactNode;
 title: string;
 }) => (<button onClick={onClick} disabled={disabled} title={title} className={`p-2 rounded-md transition-colors duration-200 ${isActive
 ? 'bg-primary-red/10 text-primary-red'
 : 'text-[#615d59] hover:bg-[rgba(0,0,0,0.05)] hover:text-[rgba(0,0,0,0.95)]'} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
 {children}
 </button>);
 const Divider = () =><div className="w-px h-6 bg-[rgba(0,0,0,0.1)] mx-1"/>;
 if (!editor) {
 return null;
 }
 return (<div className="border border-[rgba(0,0,0,0.1)] rounded-xl overflow-hidden">
 <div className="flex items-center gap-1 px-4 py-2 bg-warm-white border-b border-[rgba(0,0,0,0.1)] flex-wrap">
 <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')} title="加粗">
 <Bold className="w-4 h-4"/>
 </ToolbarButton>
 <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')} title="斜体">
 <Italic className="w-4 h-4"/>
 </ToolbarButton>
 <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} isActive={editor.isActive('underline')} title="下划线">
 <Underline className="w-4 h-4"/>
 </ToolbarButton>
 <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} isActive={editor.isActive('strike')} title="删除线">
 <Strikethrough className="w-4 h-4"/>
 </ToolbarButton>

 <Divider />

 <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} isActive={editor.isActive('heading', { level: 1 })} title="标题1">
 <Heading1 className="w-4 h-4"/>
 </ToolbarButton>
 <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editor.isActive('heading', { level: 2 })} title="标题2">
 <Heading2 className="w-4 h-4"/>
 </ToolbarButton>
 <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} isActive={editor.isActive('heading', { level: 3 })} title="标题3">
 <Heading3 className="w-4 h-4"/>
 </ToolbarButton>

 <Divider />

 <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')} title="无序列表">
 <List className="w-4 h-4"/>
 </ToolbarButton>
 <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')} title="有序列表">
 <ListOrdered className="w-4 h-4"/>
 </ToolbarButton>
 <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive('blockquote')} title="引用">
 <Quote className="w-4 h-4"/>
 </ToolbarButton>

 <Divider />

 <ToolbarButton onClick={() => editor.chain().focus().extendMarkRange('link').unsetLink().run()} isActive={editor.isActive('link')} title="取消链接">
 <Link2 className="w-4 h-4"/>
 </ToolbarButton>

 <Divider />

 <ToolbarButton onClick={() => {
 const url = window.prompt('请输入图片URL');
 if (url) {
 editor.chain().focus().setImage({ src: url }).run();
 }
 }} title="插入图片">
 <ImageIcon className="w-4 h-4"/>
 </ToolbarButton>

 <Divider />

 <ToolbarButton onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="撤销">
 <Undo className="w-4 h-4"/>
 </ToolbarButton>
 <ToolbarButton onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="重做">
 <Redo className="w-4 h-4"/>
 </ToolbarButton>
 </div>

 <div className="p-4 min-h-[200px] bg-white">
 <EditorContent editor={editor} className="prose prose-sm max-w-none focus:outline-none"/>
 </div>
 </div>);
}

