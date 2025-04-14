import React, { useState, useEffect } from 'react';
import { FaRegCopy, FaCheck } from 'react-icons/fa';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';

// Remover todos os imports de componentes específicos
import './CodeBlock.css';

// Inicialização controlada do Prism - Definindo manualmente as linguagens
(function initPrism() {
  // Primeiro, garantir que as dependências base estão definidas
  if (!Prism.languages.clike) {
    Prism.languages.clike = {
      'comment': [
        {
          pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,
          lookbehind: true,
          greedy: true
        },
        {
          pattern: /(^|[^\\:])\/\/.*/,
          lookbehind: true,
          greedy: true
        }
      ],
      'string': {
        pattern: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
        greedy: true
      },
      'class-name': {
        pattern: /(\b(?:class|interface|extends|implements|trait|instanceof|new)\s+|\bcatch\s+\()[\w.\\]+/i,
        lookbehind: true,
        inside: {
          'punctuation': /[.\\]/
        }
      },
      'keyword': /\b(?:if|else|while|do|for|return|in|instanceof|function|new|try|throw|catch|finally|null|break|continue)\b/,
      'boolean': /\b(?:true|false)\b/,
      'function': /\w+(?=\()/,
      'number': /\b0x[\da-f]+\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e[+-]?\d+)?/i,
      'operator': /[<>]=?|[!=]=?=?|--?|\+\+?|&&?|\|\|?|[?*/~^%]/,
      'punctuation': /[{}[\];(),.:]/
    };
  }

  // Depois, definir markup para XML/HTML
  if (!Prism.languages.markup) {
    Prism.languages.markup = {
      'comment': /<!--[\s\S]*?-->/,
      'prolog': /<\?[\s\S]+?\?>/,
      'doctype': {
        pattern: /<!DOCTYPE(?:[^>"'[\]]|"[^"]*"|'[^']*')+(?:\[(?:[^<"']]|"[^"]*"|'[^']*'|<(?!!--)|<!--(?:[^-]|-(?!->))*-->)*\]\s*)?>/i,
        greedy: true
      },
      'tag': {
        pattern: /<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/i,
        greedy: true,
        inside: {
          'tag': {
            pattern: /^<\/?[^\s>\/]+/i,
            inside: {
              'punctuation': /^<\/?/,
              'namespace': /^[^\s>\/:]+:/
            }
          },
          'attr-value': {
            pattern: /=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/i,
            inside: {
              'punctuation': [
                /^=/,
                {
                  pattern: /^(\s*)["']|["']$/,
                  lookbehind: true
                }
              ]
            }
          },
          'punctuation': /\/?>/,
          'attr-name': {
            pattern: /[^\s>\/]+/,
            inside: {
              'namespace': /^[^\s>\/:]+:/
            }
          }
        }
      },
      'entity': [
        {
          pattern: /&[\da-z]{1,8};/i,
          alias: 'named-entity'
        },
        /&#x?[\da-f]{1,8};/i
      ]
    };
  }

  // Adicionar definição de Python se não existir
  if (!Prism.languages.python) {
    Prism.languages.python = {
      'comment': /#.*/,
      'string': {
        pattern: /(['"])(?:\\.|(?!\1)[^\\\n])*\1/,
        greedy: true
      },
      'keyword': /\b(?:False|None|True|and|as|assert|async|await|break|class|continue|def|del|elif|else|except|finally|for|from|global|if|import|in|is|lambda|nonlocal|not|or|pass|raise|return|try|while|with|yield)\b/,
      'builtin': /\b(?:__import__|abs|all|any|apply|ascii|bin|bool|buffer|bytearray|bytes|callable|chr|classmethod|compile|complex|delattr|dict|dir|divmod|enumerate|eval|exec|filter|float|format|frozenset|getattr|globals|hasattr|hash|help|hex|id|input|int|isinstance|issubclass|iter|len|list|locals|map|max|memoryview|min|next|object|oct|open|ord|pow|print|property|range|repr|reversed|round|set|setattr|slice|sorted|staticmethod|str|sum|super|tuple|type|vars|zip)\b/,
      'number': /(?:\b(?=\d)|\B(?=\.))(?:0[bo])?(?:(?:\d|0x[\da-f])[\da-f]*(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?j?\b/i,
      'operator': /[-+%=]=?|!=|\*\*?=?|\/\/?=?|<[<=>]?|>[=>]?|[&|^~]/,
      'punctuation': /[{}[\];(),.:]/
    };
  }

  // Adicionar definição de Java se não existir
  if (!Prism.languages.java) {
    Prism.languages.java = Prism.languages.extend('clike', {
      'keyword': /\b(?:abstract|continue|for|new|switch|assert|default|goto|package|synchronized|boolean|do|if|private|this|break|double|implements|protected|throw|byte|else|import|public|throws|case|enum|instanceof|return|transient|catch|extends|int|short|try|char|final|interface|static|void|class|finally|long|strictfp|volatile|const|float|native|super|while|var)\b/,
      'number': /\b0b[01]+\b|\b0x[\da-f]*\.?[\da-f]+\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e[+-]?\d+)?[dfl]?/i,
      'operator': {
        pattern: /(^|[^.])(?:<<=?|>>>?=?|->|([-+&|])\2|[?:~]|[-+*/%&|^!=<>]=?)/m,
        lookbehind: true
      }
    });
  }

  // Adicionar definição de JavaScript se não existir
  if (!Prism.languages.javascript) {
    Prism.languages.javascript = Prism.languages.extend('clike', {
      'keyword': /\b(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/,
      'number': /\b(?:0[xX][\dA-Fa-f]+|0[bB][01]+|0[oO][0-7]+|NaN|Infinity)\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:[Ee][+-]?\d+)?/,
      'function': /[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*\()/,
      'operator': /-[-=]?|\+[+=]?|!=?=?|<<?=?|>>?>?=?|=(?:==?|>)?|&[&=]?|\|[|=]?|\*\*?=?|\/=?|~|\^=?|%=?|\?|\.{3}/
    });
  }

  console.log('Prism inicializado com linguagens básicas (clike, markup, python, java, javascript)');
})();

const languageColors = {
  javascript: '#f7df1e',
  python: '#3572A5',
  java: '#b07219',
  cpp: '#f34b7d',
  csharp: '#178600',
  jsx: '#61dafb',
  tsx: '#3178c6',
  css: '#563d7c',
  json: '#292929',
  xml: '#e34c26',
  markup: '#e34c26',
  default: '#808080'
};

const CodeBlock = ({ code, language = 'javascript' }) => {
  const [copied, setCopied] = useState(false);
  const [formattedCode, setFormattedCode] = useState('');
  const [displayLanguage] = useState(language.toLowerCase());

  useEffect(() => {
    console.log('CodeBlock Effect - Code:', typeof code === 'string' ? code.substring(0, 20) + '...' : code);
    console.log('CodeBlock Effect - Language Prop:', language);
    
    // Normaliza a linguagem para o Prism usar internamente
    let normalizedLanguage = language.toLowerCase();
    
    // Mapeamento simples para linguagens comuns
    if (normalizedLanguage === 'js') normalizedLanguage = 'javascript';
    if (normalizedLanguage === 'py') normalizedLanguage = 'python';
    if (normalizedLanguage === 'cs') normalizedLanguage = 'csharp';
    if (normalizedLanguage === 'xml' || normalizedLanguage === 'html') normalizedLanguage = 'markup';
    if (normalizedLanguage === 'cpp') normalizedLanguage = 'clike'; // Fallback para C++ (temporário)

    console.log('CodeBlock Effect - Normalized Language:', normalizedLanguage);

    // Verifique se a linguagem existe, caso contrário, reverta para texto simples
    if (code && typeof code === 'string') {
      try {
        // Verifique se a linguagem está disponível
        if (Prism.languages[normalizedLanguage]) {
          const highlighted = Prism.highlight(
            code,
            Prism.languages[normalizedLanguage],
            normalizedLanguage
          );
          console.log('CodeBlock Effect - Highlighting successful');
          setFormattedCode(highlighted);
        } else {
          console.warn(`Linguagem ${normalizedLanguage} não disponível no Prism, usando fallback para texto`);
          // Tentar usar 'clike' como fallback para linguagens não suportadas
          if (Prism.languages.clike) {
            const highlighted = Prism.highlight(
              code,
              Prism.languages.clike,
              'clike'
            );
            setFormattedCode(highlighted);
          } else {
            // Exibir código como texto simples
            setFormattedCode(escapeHtml(code));
          }
        }
      } catch (error) {
        console.error('CodeBlock Effect - Erro ao formatar código:', error);
        // Fallback para texto simples
        setFormattedCode(escapeHtml(code));
      }
    } else {
      // Tratar caso não haja código ou não seja string
      setFormattedCode(code ? escapeHtml(String(code)) : '');
    }
  }, [code, language]);

  // Função para escapar HTML e garantir exibição segura
  const escapeHtml = (text) => {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Erro ao copiar código:', err);
    }
  };

  const getLanguageColor = () => {
    return languageColors[displayLanguage] || languageColors.default; 
  };

  console.log('CodeBlock Render - Formatted Code Length:', formattedCode.length);

  return (
    <div className="code-block">
      <div className="code-header">
        <div className="language-indicator">
          <span 
            className="language-dot" 
            style={{ backgroundColor: getLanguageColor() }}
          />
          <span className="code-language">{displayLanguage}</span>
        </div>
        <button 
          className={`copy-button ${copied ? 'copied' : ''}`}
          onClick={copyToClipboard}
        >
          {copied ? (
            <>
              <FaCheck /> Copiado!
            </>
          ) : (
            <>
              <FaRegCopy /> Copiar
            </>
          )}
        </button>
      </div>
      <div className="code-content">
        <pre>
          <code 
            dangerouslySetInnerHTML={{ __html: formattedCode }}
          />
        </pre>
      </div>
    </div>
  );
};

export default CodeBlock;