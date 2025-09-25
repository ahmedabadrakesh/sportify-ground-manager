import React, { useMemo } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export const RichTextEditor = ({
  value,
  onChange,
  placeholder = "Enter text...",
  className,
  disabled = false,
}: RichTextEditorProps) => {
  // Configure toolbar with comprehensive formatting options
  const modules = useMemo(() => ({
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      ['link'],
      [{ 'align': [] }],
      ['clean'] // Remove formatting button
    ],
  }), []);

  const formats = [
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'indent',
    'link', 'align'
  ];

  return (
    <div className={cn("rich-text-editor", className)}>
      <ReactQuill
        theme="snow"
        value={value || ''}
        onChange={onChange}
        placeholder={placeholder}
        modules={modules}
        formats={formats}
        readOnly={disabled}
        style={{
          backgroundColor: 'hsl(var(--background))',
        }}
      />
      <style dangerouslySetInnerHTML={{
        __html: `
        .rich-text-editor .ql-toolbar {
          border-top: 1px solid hsl(var(--border));
          border-left: 1px solid hsl(var(--border));
          border-right: 1px solid hsl(var(--border));
          border-bottom: none;
          border-radius: 6px 6px 0 0;
          background: hsl(var(--background));
        }
        
        .rich-text-editor .ql-container {
          border-bottom: 1px solid hsl(var(--border));
          border-left: 1px solid hsl(var(--border));
          border-right: 1px solid hsl(var(--border));
          border-top: none;
          border-radius: 0 0 6px 6px;
          background: hsl(var(--background));
          color: hsl(var(--foreground));
          font-size: 14px;
        }
        
        .rich-text-editor .ql-editor {
          min-height: 120px;
          padding: 12px;
          color: hsl(var(--foreground));
        }
        
        .rich-text-editor .ql-editor.ql-blank::before {
          color: hsl(var(--muted-foreground));
          font-style: normal;
        }
        
        .rich-text-editor .ql-toolbar .ql-stroke {
          stroke: hsl(var(--foreground));
        }
        
        .rich-text-editor .ql-toolbar .ql-fill {
          fill: hsl(var(--foreground));
        }
        
        .rich-text-editor .ql-toolbar button:hover .ql-stroke {
          stroke: hsl(var(--primary));
        }
        
        .rich-text-editor .ql-toolbar button:hover .ql-fill {
          fill: hsl(var(--primary));
        }
        
        .rich-text-editor .ql-toolbar button.ql-active .ql-stroke {
          stroke: hsl(var(--primary));
        }
        
        .rich-text-editor .ql-toolbar button.ql-active .ql-fill {
          fill: hsl(var(--primary));
        }
        
        .rich-text-editor .ql-editor a {
          color: hsl(var(--primary));
        }
        
        .rich-text-editor .ql-editor strong {
          font-weight: bold;
        }
        
        .rich-text-editor .ql-editor em {
          font-style: italic;
        }
        
        .rich-text-editor .ql-editor u {
          text-decoration: underline;
        }
        `
      }} />
    </div>
  );
};