"use client";

import React, { useEffect, useRef } from "react";
import hljs from "highlight.js/lib/core";
import typescript from "highlight.js/lib/languages/typescript";
import "highlight.js/styles/github-dark.css"; // Use the same theme as in LessonPage

interface CodeBlockProps {
  code: string;
  language: string;
}

/**
 * CodeBlock Component
 * --------------------
 * Renders a block of code with syntax highlighting.
 *
 * @param {CodeBlockProps} props - The component props containing the code and its language.
 * @returns {JSX.Element} The rendered code block with syntax highlighting.
 */
const CodeBlock: React.FC<CodeBlockProps> = ({ code, language }) => {
  const codeRef = useRef<HTMLElement>(null);

  // Register languages once
  useEffect(() => {
    hljs.registerLanguage("typescript", typescript);
  }, []);

  // Highlight the code after component mounts or updates
  useEffect(() => {
    if (codeRef.current) {
      hljs.highlightElement(codeRef.current);
    }
  }, [code, language]);

  return (
    <div className="p-1 bg-black">
      <pre className="overflow-x-auto bg-gray-800">
        <code ref={codeRef} className={`language-${language}`}>
          {code}
        </code>
      </pre>
    </div>
  );
};

export default CodeBlock;
