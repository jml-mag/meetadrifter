"use client";

import React, { useEffect } from "react";
import Prism from "prismjs";
import "prismjs/themes/prism-twilight.css";

interface CodeBlockProps {
  code: string;
  language: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code, language }) => {
  useEffect(() => {
    Prism.highlightAll();
  }, []);

  return (
    <pre className="overflow-x-auto">
      <code className={`language-${language}`}>{code}</code>
    </pre>
  );
};

export default CodeBlock;
