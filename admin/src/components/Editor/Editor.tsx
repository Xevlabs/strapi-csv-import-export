import './style.css';

import React, { useEffect, useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';

export type EditorProps = {
  content?: string | { data: string };
  language?: string;
  readOnly?: boolean;
  onChange?: (value: string, viewUpdate?: unknown) => void;
  style?: React.CSSProperties;
};

export const Editor: React.FC<EditorProps> = ({
  content = '',
  language = 'csv',
  readOnly = false,
  onChange,
  style,
}) => {
  const [codeMirrorContent, setCodeMirrorContent] = useState('');

  useEffect(() => {
    if (typeof content === 'object') {
      setCodeMirrorContent(content.data);
    } else {
      setCodeMirrorContent(content);
    }
  }, [content, language]);

  return (
    <CodeMirror
      className="plugin-ie-editor"
      basicSetup={{ lineNumbers: true }}
      style={style}
      height="40vh"
      theme="dark"
      value={codeMirrorContent}
      onChange={onChange}
      editable={!readOnly}
    />
  );
};
