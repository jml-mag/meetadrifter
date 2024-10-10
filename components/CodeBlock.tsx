"use client";

import React, { useEffect, useRef } from "react";
import hljs from "highlight.js/lib/core";
import typescript from "highlight.js/lib/languages/typescript";
import "highlight.js/styles/github-dark.css"; // Syntax highlighting theme

/**
 * Props interface for the CodeBlock component.
 */
interface CodeBlockProps {
  /**
   * The code string to be highlighted.
   */
  code: string;

  /**
   * The programming language of the code, which determines the syntax highlighting rules.
   */
  language: string;
}

/**
 * CodeBlock Component
 * --------------------
 * Renders a block of code with syntax highlighting.
 * The component uses Highlight.js to apply syntax highlighting based on the specified programming language.
 * 
 * @param {CodeBlockProps} props - The component props containing the code and its language.
 * @returns {JSX.Element} The rendered code block with syntax highlighting.
 */
const CodeBlock: React.FC<CodeBlockProps> = ({ code, language }) => {
  const codeRef = useRef<HTMLElement>(null);

  // Register TypeScript language once during the component's first render
  useEffect(() => {
    hljs.registerLanguage("typescript", typescript);
  }, []);

  // Highlight the code block whenever the code or language changes
  useEffect(() => {
    if (codeRef.current) {
      hljs.highlightElement(codeRef.current);
    }
  }, [code, language]);

  return (
    <section className="p-1 bg-black" aria-label="Code block with syntax highlighting">
      <pre className="overflow-x-auto bg-gray-800 rounded-md">
        <code ref={codeRef} className={`language-${language}`}>
          {code}
        </code>
      </pre>
    </section>
  );
};

export default CodeBlock;
