import { describe, it, expect } from 'vitest';
import { mdToHtml } from '../src/md-to-html.js';

describe('mdToHtml', () => {

  describe('headings', () => {
    it('converts h1', () => {
      expect(mdToHtml('# Title')).toBe('<h1>Title</h1>');
    });

    it('converts h2', () => {
      expect(mdToHtml('## Title')).toBe('<h2>Title</h2>');
    });

    it('converts h3', () => {
      expect(mdToHtml('### Title')).toBe('<h3>Title</h3>');
    });

    it('handles heading with inline formatting', () => {
      expect(mdToHtml('# Hello *world*')).toBe('<h1>Hello <em>world</em></h1>');
    });
  });

  describe('bold', () => {
    it('converts bold text', () => {
      expect(mdToHtml('This is **bold** text')).toBe('<p>This is <strong>bold</strong> text</p>');
    });

    it('handles multiple bold segments', () => {
      expect(mdToHtml('**a** and **b**')).toBe('<p><strong>a</strong> and <strong>b</strong></p>');
    });
  });

  describe('italic', () => {
    it('converts italic text', () => {
      expect(mdToHtml('This is *italic* text')).toBe('<p>This is <em>italic</em> text</p>');
    });

    it('handles multiple italic segments', () => {
      expect(mdToHtml('*a* and *b*')).toBe('<p><em>a</em> and <em>b</em></p>');
    });
  });

  describe('inline code', () => {
    it('converts inline code', () => {
      expect(mdToHtml('Use the `foo()` function')).toBe('<p>Use the <code>foo()</code> function</p>');
    });

    it('preserves special chars inside code spans', () => {
      expect(mdToHtml('`*not italic*`')).toBe('<p><code>*not italic*</code></p>');
    });
  });

  describe('links', () => {
    it('converts a link', () => {
      expect(mdToHtml('[OpenFox](https://openfox.ai)')).toBe('<p><a href="https://openfox.ai">OpenFox</a></p>');
    });

    it('handles links with inline code in text', () => {
      expect(mdToHtml('[`code`](https://x.com)')).toBe('<p><a href="https://x.com"><code>code</code></a></p>');
    });
  });

  describe('nested inline formatting', () => {
    it('handles italic inside bold', () => {
      expect(mdToHtml('**foo *bar* baz**')).toBe('<p><strong>foo <em>bar</em> baz</strong></p>');
    });

    it('handles bold italic with ***', () => {
      expect(mdToHtml('***text***')).toBe('<p><em><strong>text</strong></em></p>');
    });

    it('handles link with bold text', () => {
      expect(mdToHtml('[**bold** link](https://x.com)')).toBe('<p><a href="https://x.com"><strong>bold</strong> link</a></p>');
    });

    it('handles link with italic text', () => {
      expect(mdToHtml('[*italic* link](https://x.com)')).toBe('<p><a href="https://x.com"><em>italic</em> link</a></p>');
    });
  });

  describe('unordered lists', () => {
    it('converts a single-item list', () => {
      expect(mdToHtml('- item')).toBe('<ul>\n<li>item</li>\n</ul>');
    });

    it('converts a multi-item list', () => {
      expect(mdToHtml('- a\n- b\n- c')).toBe('<ul>\n<li>a</li>\n<li>b</li>\n<li>c</li>\n</ul>');
    });

    it('handles inline formatting in list items', () => {
      expect(mdToHtml('- **bold** item')).toBe('<ul>\n<li><strong>bold</strong> item</li>\n</ul>');
    });
  });

  describe('paragraphs', () => {
    it('wraps plain text in a paragraph', () => {
      expect(mdToHtml('Hello world')).toBe('<p>Hello world</p>');
    });

    it('handles multiple paragraphs', () => {
      const input = 'First paragraph.\n\nSecond paragraph.';
      const expected = '<p>First paragraph.</p>\n<p>Second paragraph.</p>';
      expect(mdToHtml(input)).toBe(expected);
    });
  });

  describe('edge cases', () => {
    it('returns empty string for empty input', () => {
      expect(mdToHtml('')).toBe('');
    });

    it('handles multiple blank lines', () => {
      expect(mdToHtml('a\n\n\nb')).toBe('<p>a</p>\n<p>b</p>');
    });

    it('handles text with angle brackets', () => {
      expect(mdToHtml('x < y && y > z')).toBe('<p>x < y && y > z</p>');
    });

    it('handles consecutive headings', () => {
      const input = '# A\n\n## B';
      expect(mdToHtml(input)).toBe('<h1>A</h1>\n<h2>B</h2>');
    });

    it('renders bold next to italic', () => {
      expect(mdToHtml('**bold** *italic*')).toBe('<p><strong>bold</strong> <em>italic</em></p>');
    });
  });

  describe('mixed document', () => {
    it('renders a full document', () => {
      const input = '# My Page\n\nHello *world*.\n\n- item 1\n- item 2';
      const expected = '<h1>My Page</h1>\n<p>Hello <em>world</em>.</p>\n<ul>\n<li>item 1</li>\n<li>item 2</li>\n</ul>';
      expect(mdToHtml(input)).toBe(expected);
    });
  });

});
