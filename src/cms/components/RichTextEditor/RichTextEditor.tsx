import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import Typography from '@tiptap/extension-typography';
import CharacterCount from '@tiptap/extension-character-count';
import { useEffect, useRef, useState, useCallback } from 'react';
import { getBody, setBody } from '../../utils/bodiesStorage';
import { uploadToCloudinary } from '../../utils/cloudinary';
import styles from './RichTextEditor.module.css';

interface RichTextEditorProps {
  slug: string;
  projectTitle: string;
  onClose: () => void;
}

export function RichTextEditor({ slug, projectTitle, onClose }: RichTextEditorProps) {
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved'>('idle');
  const imgInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({ allowBase64: false }),
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: 'Write your case study here. Use the toolbar above to format headings, images, lists, and more.' }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Highlight,
      Typography,
      CharacterCount,
    ],
    content: getBody(slug) ?? { type: 'doc', content: [{ type: 'paragraph' }] },
    onUpdate: ({ editor }) => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      setSaveState('idle');
      saveTimerRef.current = setTimeout(() => {
        setSaveState('saving');
        setBody(slug, editor.getJSON());
        setSaveState('saved');
      }, 700);
    },
  });

  useEffect(() => {
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (saveState === 'saved') {
      const t = setTimeout(() => setSaveState('idle'), 3000);
      return () => clearTimeout(t);
    }
  }, [saveState]);

  const handleImageUpload = useCallback(async (file: File) => {
    if (!editor) return;
    setUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      editor.chain().focus().setImage({ src: url }).run();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Image upload failed');
    } finally {
      setUploading(false);
    }
  }, [editor]);

  const setLink = useCallback(() => {
    if (!editor) return;
    const prev = editor.getAttributes('link').href as string;
    const url = window.prompt('Enter URL', prev);
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
    } else {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }
  }, [editor]);

  const wordCount = editor?.storage.characterCount.words() ?? 0;

  if (!editor) return null;

  return (
    <div className={styles.overlay}>
      {/* ── Header ── */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.headerLabel}>Case Study</span>
          <span className={styles.headerTitle}>{projectTitle}</span>
        </div>
        <div className={styles.headerRight}>
          {saveState === 'saving' && <span className={styles.saveStatus}>Saving…</span>}
          {saveState === 'saved'  && <span className={`${styles.saveStatus} ${styles.saved}`}>✓ Saved</span>}
          <span className={styles.wordCount}>{wordCount} words</span>
          <button className={styles.closeBtn} onClick={onClose} type="button">✕ Close</button>
        </div>
      </div>

      {/* ── Toolbar ── */}
      <div className={styles.toolbar} role="toolbar" aria-label="Editor formatting">
        <button type="button" className={editor.isActive('bold') ? styles.toolActive : ''} onClick={() => editor.chain().focus().toggleBold().run()} title="Bold"><strong>B</strong></button>
        <button type="button" className={editor.isActive('italic') ? styles.toolActive : ''} onClick={() => editor.chain().focus().toggleItalic().run()} title="Italic"><em>I</em></button>
        <button type="button" className={editor.isActive('strike') ? styles.toolActive : ''} onClick={() => editor.chain().focus().toggleStrike().run()} title="Strikethrough"><s>S</s></button>

        <div className={styles.toolDivider} aria-hidden="true" />

        <button type="button" className={editor.isActive('heading', { level: 1 }) ? styles.toolActive : ''} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>H1</button>
        <button type="button" className={editor.isActive('heading', { level: 2 }) ? styles.toolActive : ''} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</button>
        <button type="button" className={editor.isActive('heading', { level: 3 }) ? styles.toolActive : ''} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>H3</button>

        <div className={styles.toolDivider} aria-hidden="true" />

        <button type="button" className={editor.isActive('bulletList') ? styles.toolActive : ''} onClick={() => editor.chain().focus().toggleBulletList().run()} title="Bullet list">• List</button>
        <button type="button" className={editor.isActive('orderedList') ? styles.toolActive : ''} onClick={() => editor.chain().focus().toggleOrderedList().run()} title="Numbered list">1. List</button>

        <div className={styles.toolDivider} aria-hidden="true" />

        <button type="button" className={editor.isActive('blockquote') ? styles.toolActive : ''} onClick={() => editor.chain().focus().toggleBlockquote().run()} title="Quote">" Quote</button>
        <button type="button" className={editor.isActive('codeBlock') ? styles.toolActive : ''} onClick={() => editor.chain().focus().toggleCodeBlock().run()} title="Code block">&lt;/&gt;</button>
        <button type="button" className={editor.isActive('highlight') ? styles.toolActive : ''} onClick={() => editor.chain().focus().toggleHighlight().run()} title="Highlight">Highlight</button>

        <div className={styles.toolDivider} aria-hidden="true" />

        <button type="button" className={editor.isActive('link') ? styles.toolActive : ''} onClick={setLink} title="Add link">Link</button>
        <button type="button" onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Horizontal rule">— Rule</button>

        <div className={styles.toolDivider} aria-hidden="true" />

        <button
          type="button"
          className={styles.imageBtn}
          onClick={() => imgInputRef.current?.click()}
          disabled={uploading}
          title="Insert image from Cloudinary"
        >
          {uploading ? 'Uploading…' : '+ Image'}
        </button>
        <input
          ref={imgInputRef}
          type="file"
          accept="image/*"
          className={styles.fileInput}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void handleImageUpload(file);
            e.target.value = '';
          }}
        />
      </div>

      {/* ── Editor content ── */}
      <div className={styles.editorScroll}>
        <EditorContent editor={editor} className={styles.editorContent} />
      </div>
    </div>
  );
}
