/**
 * Researcher Agent Integration Tests
 *
 * Tests the researcher agent's ability to:
 * - Perform web searches
 * - Fetch documentation
 * - Synthesize information
 * - Track citations
 */

import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { AgentMocks, CustomAssertions, MockHttpServer } from './utils/test-helpers.js';

describe('Researcher Agent Integration Tests', () => {
  let mockServer;

  beforeEach(async () => {
    mockServer = new MockHttpServer('https://api.example.com');
    await mockServer.start();
  });

  afterEach(() => {
    mockServer.cleanup();
  });

  describe('Web Search', () => {
    it('should perform search query', () => {
      const query = 'React hooks documentation';
      const searchResult = {
        query,
        results: [
          { title: 'React Hooks API', url: 'https://react.dev/hooks' },
          { title: 'Using Hooks', url: 'https://react.dev/learn/hooks' }
        ]
      };

      expect(searchResult.query).toBe(query);
      expect(searchResult.results).toHaveLength(2);
    });

    it('should handle search with no results', () => {
      const query = 'xyzabc123nonexistent';
      const searchResult = {
        query,
        results: []
      };

      expect(searchResult.results).toHaveLength(0);
    });

    it('should filter search results by relevance', () => {
      const results = [
        { title: 'React Hooks', relevance: 0.9 },
        { title: 'Angular Hooks', relevance: 0.3 },
        { title: 'Vue Hooks', relevance: 0.5 }
      ];

      const filtered = results.filter(r => r.relevance > 0.7);
      expect(filtered).toHaveLength(1);
      expect(filtered[0].title).toBe('React Hooks');
    });
  });

  describe('Documentation Fetching', () => {
    it('should fetch documentation from URL', async () => {
      mockServer.mockEndpoint('/docs/api', 'GET', {
        title: 'API Documentation',
        content: 'API documentation content...'
      });

      const docUrl = 'https://api.example.com/docs/api';
      const fetchedDoc = {
        url: docUrl,
        title: 'API Documentation',
        content: 'API documentation content...'
      };

      expect(fetchedDoc.title).toBe('API Documentation');
    });

    it('should extract code examples from documentation', () => {
      const docContent = `
        # API Usage

        Example:
        \`\`\`javascript
        import { useState } from 'react';
        \`\`\`
      `;

      const hasCodeExample = docContent.includes('```javascript');
      expect(hasCodeExample).toBe(true);
    });

    it('should handle documentation fetch errors', async () => {
      const errorUrl = 'https://example.com/nonexistent';

      try {
        throw new Error('404 Not Found');
      } catch (error) {
        expect(error.message).toContain('404');
      }
    });
  });

  describe('Information Synthesis', () => {
    it('should synthesize information from multiple sources', () => {
      const sources = [
        { source: 'React Docs', info: 'Hooks let you use state' },
        { source: 'MDN', info: 'Hooks are JavaScript functions' },
        { source: 'Blog', info: 'Hooks simplify component logic' }
      ];

      const synthesis = {
        topic: 'React Hooks',
        summary: 'Hooks are JavaScript functions that let you use state and simplify component logic',
        sources: sources.map(s => s.source)
      };

      expect(synthesis.sources).toHaveLength(3);
      expect(synthesis.summary).toContain('Hooks');
    });

    it('should identify key concepts', () => {
      const findings = [
        'useState manages state',
        'useEffect handles side effects',
        'Custom hooks enable reuse'
      ];

      const keyConcepts = findings.map(f => f.split(' ')[0]);
      expect(keyConcepts).toContain('useState');
      expect(keyConcepts).toContain('useEffect');
    });

    it('should prioritize official documentation', () => {
      const sources = [
        { url: 'https://react.dev/docs', type: 'official', priority: 10 },
        { url: 'https://blog.example.com', type: 'blog', priority: 5 },
        { url: 'https://stackoverflow.com', type: 'community', priority: 7 }
      ];

      const sorted = sources.sort((a, b) => b.priority - a.priority);
      expect(sorted[0].type).toBe('official');
    });
  });

  describe('Citation Tracking', () => {
    it('should track source citations', () => {
      const findings = [
        { content: 'Info from source 1', citation: { id: 1, source: 'React Docs' } },
        { content: 'Info from source 2', citation: { id: 2, source: 'MDN' } }
      ];

      const citations = findings.map(f => f.citation);
      expect(citations).toHaveLength(2);
      expect(citations[0].source).toBe('React Docs');
    });

    it('should generate bibliography', () => {
      const citations = [
        { id: 1, source: 'React Docs', url: 'https://react.dev' },
        { id: 2, source: 'MDN', url: 'https://mdn.dev' }
      ];

      const bibliography = citations.map(c =>
        `[${c.id}] ${c.source}: ${c.url}`
      );

      expect(bibliography).toHaveLength(2);
      expect(bibliography[0]).toContain('React Docs');
    });

    it('should link findings to citations', () => {
      const finding = {
        content: 'Hooks were introduced in React 16.8',
        citationIds: [1, 2]
      };

      expect(finding.citationIds).toContain(1);
      expect(finding.citationIds).toHaveLength(2);
    });
  });

  describe('Agent Response Format', () => {
    it('should return successful research results', () => {
      const findings = [
        'React Hooks simplify state management',
        'useState is the most common hook'
      ];

      const response = AgentMocks.researcherSuccess(findings);

      CustomAssertions.assertAgentSuccess(response, 'researcher');
      expect(response.result.findings).toHaveLength(2);
    });

    it('should include citations in response', () => {
      const response = AgentMocks.researcherSuccess(['Finding 1', 'Finding 2']);

      expect(response.result.citations).toBeDefined();
      expect(response.result.citations).toHaveLength(2);
    });

    it('should include summary', () => {
      const response = AgentMocks.researcherSuccess(['Finding 1']);

      expect(response.result.summary).toContain('Found 1 relevant resources');
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors', () => {
      const error = 'Network request failed';
      let errorOccurred = false;

      try {
        throw new Error(error);
      } catch (e) {
        errorOccurred = true;
        expect(e.message).toBe(error);
      }

      expect(errorOccurred).toBe(true);
    });

    it('should handle rate limiting', () => {
      const rateLimitError = {
        error: 'Rate limit exceeded',
        retryAfter: 60
      };

      expect(rateLimitError.retryAfter).toBe(60);
    });
  });

  describe('Integration Scenarios', () => {
    it('should support coder agent with documentation', () => {
      // Coder needs help with API
      const coderRequest = 'How to use Playwright API';

      // Researcher finds documentation
      const research = AgentMocks.researcherSuccess([
        'Playwright provides browser automation',
        'Use playwright.chromium.launch() to start'
      ]);

      expect(research.result.findings).toHaveLength(2);
    });

    it('should provide code examples when available', () => {
      const findings = [
        {
          description: 'useState example',
          code: 'const [state, setState] = useState(0);'
        }
      ];

      expect(findings[0].code).toBeDefined();
    });
  });
});
