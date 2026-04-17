type LexicalNode = {
  type: string;
  tag?: string;
  format?: number | string;
  text?: string;
  children?: LexicalNode[];
  url?: string;
  listType?: string;
  value?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

type LexicalRoot = {
  root?: {
    children?: LexicalNode[];
  };
};

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatText(text: string, format: number): string {
  let result = escapeHtml(text);
  if (format & 1) result = `<strong>${result}</strong>`;
  if (format & 2) result = `<em>${result}</em>`;
  if (format & 4) result = `<s>${result}</s>`;
  if (format & 8) result = `<u>${result}</u>`;
  if (format & 16) result = `<code>${result}</code>`;
  return result;
}

function serializeNode(node: LexicalNode): string {
  if (node.type === 'text') {
    return formatText(node.text || '', (node.format as number) || 0);
  }

  if (node.type === 'linebreak') {
    return '<br />';
  }

  if (node.type === 'link') {
    const children = (node.children || []).map(serializeNode).join('');
    const url = node.fields?.url || node.url || '#';
    return `<a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">${children}</a>`;
  }

  const children = (node.children || []).map(serializeNode).join('');

  switch (node.type) {
    case 'heading':
      return `<${node.tag}>${children}</${node.tag}>`;
    case 'paragraph':
      return `<p>${children}</p>`;
    case 'list':
      return node.listType === 'number'
        ? `<ol>${children}</ol>`
        : `<ul>${children}</ul>`;
    case 'listitem':
      return `<li>${children}</li>`;
    case 'quote':
      return `<blockquote>${children}</blockquote>`;
    default:
      return children;
  }
}

/**
 * Serialize Lexical rich text JSON to HTML string.
 */
export function serializeRichText(content: LexicalRoot | null | undefined): string {
  if (!content?.root?.children) return '';
  return content.root.children.map(serializeNode).join('');
}

function extractNodeText(node: LexicalNode): string {
  if (node.type === 'text') return node.text || '';
  if (node.type === 'linebreak') return '\n';
  return (node.children || []).map(extractNodeText).join('');
}

/**
 * Extract plain text from Lexical rich text JSON, useful for previews.
 */
export function extractPlainText(
  content: LexicalRoot | null | undefined,
  maxLength?: number,
): string {
  if (!content?.root?.children) return '';
  const text = content.root.children.map(extractNodeText).join(' ').replace(/\s+/g, ' ').trim();
  if (maxLength && text.length > maxLength) {
    return text.slice(0, maxLength).trimEnd() + '…';
  }
  return text;
}
