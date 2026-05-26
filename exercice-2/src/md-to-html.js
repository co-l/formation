function parseInline(text) {
  let result = '';
  let i = 0;

  while (i < text.length) {
    const remaining = text.slice(i);

    // code span
    const codeMatch = remaining.match(/^`([^`]+)`/);
    if (codeMatch) {
      result += `<code>${codeMatch[1]}</code>`;
      i += codeMatch[0].length;
      continue;
    }

    // link: [text](url)
    const linkMatch = remaining.match(/^\[([^\]]+)\]\(([^)]+)\)/);
    if (linkMatch) {
      const innerText = parseInline(linkMatch[1]);
      result += `<a href="${linkMatch[2]}">${innerText}</a>`;
      i += linkMatch[0].length;
      continue;
    }

    // bold italic ***
    if (remaining.startsWith('***')) {
      const end = remaining.indexOf('***', 3);
      if (end !== -1) {
        const inner = parseInline(remaining.slice(3, end));
        result += `<em><strong>${inner}</strong></em>`;
        i += end + 3;
        continue;
      }
    }

    // bold **
    if (remaining.startsWith('**')) {
      const end = remaining.indexOf('**', 2);
      if (end !== -1) {
        const inner = parseInline(remaining.slice(2, end));
        result += `<strong>${inner}</strong>`;
        i += end + 2;
        continue;
      }
    }

    // italic *
    if (remaining.startsWith('*')) {
      const end = remaining.indexOf('*', 1);
      if (end !== -1) {
        const inner = parseInline(remaining.slice(1, end));
        result += `<em>${inner}</em>`;
        i += end + 1;
        continue;
      }
    }

    result += text[i];
    i++;
  }

  return result;
}

function parseBlock(line) {
  // heading
  const headingMatch = line.match(/^(#{1,3})\s+(.+)$/);
  if (headingMatch) {
    const level = headingMatch[1].length;
    const content = parseInline(headingMatch[2]);
    return `<h${level}>${content}</h${level}>`;
  }

  // list item
  const listMatch = line.match(/^-\s+(.+)$/);
  if (listMatch) {
    const content = parseInline(listMatch[1]);
    return `<li>${content}</li>`;
  }

  // paragraph
  const content = parseInline(line);
  return `<p>${content}</p>`;
}

export function mdToHtml(md) {
  const lines = md.split('\n');
  const blocks = [];
  let currentBlock = [];
  let inList = false;

  for (const line of lines) {
    if (line.trim() === '') {
      if (currentBlock.length > 0) {
        blocks.push(currentBlock.join('\n'));
        currentBlock = [];
      }
      inList = false;
    } else {
      currentBlock.push(line);
    }
  }
  if (currentBlock.length > 0) {
    blocks.push(currentBlock.join('\n'));
  }

  const output = [];
  for (const block of blocks) {
    const blockLines = block.split('\n');

    const isList = blockLines.every(l => /^-\s/.test(l));

    if (isList) {
      const items = blockLines.map(l => parseBlock(l));
      output.push('<ul>');
      output.push(items.join('\n'));
      output.push('</ul>');
    } else {
      for (const line of blockLines) {
        output.push(parseBlock(line));
      }
    }
  }

  return output.join('\n');
}
