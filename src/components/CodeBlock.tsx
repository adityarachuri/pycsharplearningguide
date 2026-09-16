import React, { useState } from 'react';
import { Check, Copy, Code2 } from 'lucide-react';

const COPY_RESET_MS = 2000;

interface CodeBlockProps {
  language: string;
  code: string;
  title?: string;
  showLineNumbers?: boolean;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  language,
  code,
  title,
  showLineNumbers = true
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), COPY_RESET_MS);
    } catch {
      // Fallback
    }
  };

  // High-contrast, clean syntax highlighting tokenizer for Python and C#
  const highlightCode = (rawCode: string, lang: string) => {
    const lines = rawCode.split('\n');

    return lines.map((line, lineIndex) => {
      // Check for full-line comments
      if (line.trim().startsWith('#') || line.trim().startsWith('//')) {
        return (
          <div key={lineIndex} className="table-row">
            {showLineNumbers && (
              <span className="table-cell pr-4 text-right select-none text-slate-600 text-xs font-mono">
                {lineIndex + 1}
              </span>
            )}
            <span className="table-cell whitespace-pre text-slate-400 italic">{line}</span>
          </div>
        );
      }

      // Tokenize line using regex
      // Matches strings, keywords, numbers, decorators/attributes, and plain words
      const tokenRegex =
        /("[^"\\]*(?:\\.[^"\\]*)*"|'[^'\\]*(?:\\.[^'\\]*)*'|#.*|\/\/.*|@[a-zA-Z0-9_.]+|\b(?:def|class|return|import|from|as|if|elif|else|for|while|in|not|and|or|is|None|True|False|try|except|finally|raise|with|yield|lambda|async|await|match|case|pass|break|continue)\b|\b(?:public|private|protected|internal|class|interface|record|struct|enum|static|readonly|void|int|string|bool|float|double|decimal|var|new|return|using|if|else|switch|case|default|for|foreach|while|in|throw|try|catch|finally|async|await|Task|IEnumerable|List|Dictionary|Func|Action|null|true|false)\b|\b\d+(?:\.\d+)?\b)/g;

      const parts = [];
      let lastIndex = 0;
      let match: RegExpExecArray | null;

      while ((match = tokenRegex.exec(line)) !== null) {
        if (match.index > lastIndex) {
          parts.push(line.substring(lastIndex, match.index));
        }

        const token = match[0];
        if (token.startsWith('"') || token.startsWith("'")) {
          // String
          parts.push(
            <span key={match.index} className="text-emerald-300">
              {token}
            </span>
          );
        } else if (token.startsWith('#') || token.startsWith('//')) {
          // Comment
          parts.push(
            <span key={match.index} className="text-slate-400 italic">
              {token}
            </span>
          );
        } else if (token.startsWith('@')) {
          // Python decorator or C# attribute
          parts.push(
            <span key={match.index} className="text-amber-400 font-medium">
              {token}
            </span>
          );
        } else if (/^\d/.test(token)) {
          // Number
          parts.push(
            <span key={match.index} className="text-amber-300">
              {token}
            </span>
          );
        } else if (
          // Python keywords
          [
            'def', 'class', 'return', 'import', 'from', 'as', 'if', 'elif',
            'else', 'for', 'while', 'in', 'not', 'and', 'or', 'is', 'try',
            'except', 'finally', 'raise', 'with', 'yield', 'lambda', 'async',
            'await', 'match', 'case', 'pass', 'break', 'continue'
          ].includes(token) ||
          // C# keywords
          [
            'public', 'private', 'protected', 'internal', 'class', 'interface',
            'record', 'struct', 'enum', 'static', 'readonly', 'void', 'var',
            'new', 'return', 'using', 'if', 'else', 'switch', 'case', 'default',
            'for', 'foreach', 'while', 'throw', 'try', 'catch', 'finally',
            'async', 'await'
          ].includes(token)
        ) {
          parts.push(
            <span key={match.index} className="text-sky-400 font-semibold">
              {token}
            </span>
          );
        } else if (['None', 'True', 'False', 'null', 'true', 'false'].includes(token)) {
          parts.push(
            <span key={match.index} className="text-rose-400 font-semibold">
              {token}
            </span>
          );
        } else if (
          ['int', 'string', 'bool', 'float', 'double', 'decimal', 'Task', 'IEnumerable', 'List', 'Dictionary', 'Func', 'Action'].includes(token)
        ) {
          parts.push(
            <span key={match.index} className="text-teal-300 font-medium">
              {token}
            </span>
          );
        } else {
          parts.push(token);
        }

        lastIndex = tokenRegex.lastIndex;
      }

      if (lastIndex < line.length) {
        parts.push(line.substring(lastIndex));
      }

      return (
        <div key={lineIndex} className="table-row">
          {showLineNumbers && (
            <span className="table-cell pr-4 text-right select-none text-slate-600 text-xs font-mono">
              {lineIndex + 1}
            </span>
          )}
          <span className="table-cell whitespace-pre">{parts}</span>
        </div>
      );
    });
  };

  const getBadgeColor = () => {
    if (language === 'python') return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    if (language === 'csharp') return 'bg-purple-500/10 text-purple-300 border-purple-500/30';
    return 'bg-slate-800 text-slate-400 border-slate-700';
  };

  const getLanguageLabel = () => {
    if (language === 'python') return 'Python 3.14';
    if (language === 'csharp') return 'C# 12 / .NET 8';
    return 'Output';
  };

  return (
    <div className="my-3 overflow-hidden rounded-xl border border-slate-800 bg-slate-950 font-mono text-sm shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800/80 bg-slate-900/90 px-4 py-2 text-xs">
        <div className="flex items-center gap-2">
          <Code2 className="h-4 w-4 text-slate-400" />
          <span className="font-semibold text-slate-300">
            {title || (language === 'python' ? 'Pythonic Implementation' : 'C# Counterpart')}
          </span>
          <span className={`rounded-md border px-2 py-0.5 text-[11px] font-semibold ${getBadgeColor()}`}>
            {getLanguageLabel()}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 rounded-md bg-slate-800/80 px-2 py-1 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
          title="Copy code"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-emerald-400 text-[11px]">Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span className="text-[11px]">Copy</span>
            </>
          )}
        </button>
      </div>
      <div className="overflow-x-auto p-4 leading-relaxed text-slate-200">
        <div className="table w-full">{highlightCode(code, language)}</div>
      </div>
    </div>
  );
};

export const DualCodeView: React.FC<{
  csharpCode: string;
  pythonCode: string;
  csharpTitle?: string;
  pythonTitle?: string;
  mentalShiftNotes?: string;
}> = ({
  csharpCode,
  pythonCode,
  csharpTitle = 'C# .NET Enterprise Code',
  pythonTitle = 'Pythonic Equivalent',
  mentalShiftNotes
}) => {
  const [activeTab, setActiveTab] = useState<'split' | 'python' | 'csharp'>('split');

  return (
    <div className="my-4 rounded-xl border border-slate-800 bg-slate-900/50 p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Side-by-Side Rosetta Comparison
        </div>
        <div className="flex rounded-lg bg-slate-950 p-1 text-xs border border-slate-800">
          <button
            onClick={() => setActiveTab('split')}
            className={`rounded px-3 py-1 font-medium transition-colors ${
              activeTab === 'split' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Split View
          </button>
          <button
            onClick={() => setActiveTab('python')}
            className={`rounded px-3 py-1 font-medium transition-colors ${
              activeTab === 'python' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Python Only
          </button>
          <button
            onClick={() => setActiveTab('csharp')}
            className={`rounded px-3 py-1 font-medium transition-colors ${
              activeTab === 'csharp' ? 'bg-purple-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            C# Only
          </button>
        </div>
      </div>

      {activeTab === 'split' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <CodeBlock language="csharp" code={csharpCode} title={csharpTitle} />
          <CodeBlock language="python" code={pythonCode} title={pythonTitle} />
        </div>
      ) : activeTab === 'python' ? (
        <CodeBlock language="python" code={pythonCode} title={pythonTitle} />
      ) : (
        <CodeBlock language="csharp" code={csharpCode} title={csharpTitle} />
      )}

      {mentalShiftNotes && (
        <div className="mt-3 rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 text-xs leading-relaxed text-amber-200/90">
          <strong className="font-semibold text-amber-300">Architect's Mental Shift: </strong>
          {mentalShiftNotes}
        </div>
      )}
    </div>
  );
};
