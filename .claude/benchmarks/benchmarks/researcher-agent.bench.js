const { createSuite } = require('../suite');

/**
 * Researcher Agent Benchmarks
 */

const suite = createSuite('Researcher Agent Performance');

/**
 * Documentation fetching benchmark
 */
suite.add(
  'Documentation Fetching Speed',
  async () => {
    const docUrls = [
      'https://react.dev/reference',
      'https://nextjs.org/docs',
      'https://tailwindcss.com/docs',
      'https://nodejs.org/api'
    ];

    const results = [];

    for (const url of docUrls) {
      const startTime = Date.now();

      // Mock HTTP request
      await new Promise(resolve => setTimeout(resolve, 25));

      const mockDoc = {
        url,
        size: Math.floor(Math.random() * 50000) + 10000,
        sections: Math.floor(Math.random() * 20) + 5
      };

      results.push(mockDoc);
    }

    return {
      documentsfetched: results.length,
      totalSize: results.reduce((sum, d) => sum + d.size, 0)
    };
  },
  { iterations: 30 }
);

/**
 * Web search performance benchmark
 */
suite.add(
  'Web Search Performance',
  async () => {
    const queries = [
      'React hooks best practices',
      'Node.js performance optimization',
      'TypeScript advanced patterns',
      'GraphQL vs REST API'
    ];

    const searchResults = [];

    for (const query of queries) {
      const startTime = Date.now();

      // Mock search API call
      await new Promise(resolve => setTimeout(resolve, 30));

      const results = Array.from({ length: 10 }, (_, i) => ({
        title: `Result ${i + 1}`,
        url: `https://example.com/result-${i}`,
        snippet: `Snippet for ${query}`,
        relevance: Math.random()
      }));

      searchResults.push({
        query,
        results: results.length,
        topRelevance: Math.max(...results.map(r => r.relevance))
      });
    }

    return {
      queriesExecuted: searchResults.length,
      totalResults: searchResults.reduce((sum, s) => sum + s.results, 0)
    };
  },
  { iterations: 20 }
);

/**
 * Information extraction benchmark
 */
suite.add(
  'Information Extraction Accuracy',
  async () => {
    const mockHtmlContent = `
      <article>
        <h1>Best Practices for React</h1>
        <section>
          <h2>Component Design</h2>
          <p>Use functional components with hooks...</p>
          <code>const Component = () => { ... }</code>
        </section>
        <section>
          <h2>State Management</h2>
          <p>Consider using Context API...</p>
        </section>
      </article>
    `;

    // Mock extraction process
    await new Promise(resolve => setTimeout(resolve, 15));

    const extracted = {
      title: 'Best Practices for React',
      sections: 2,
      codeSnippets: 1,
      links: 0,
      headings: ['Component Design', 'State Management']
    };

    return extracted;
  },
  { iterations: 40 }
);

/**
 * Multi-source aggregation benchmark
 */
suite.add(
  'Multi-Source Aggregation',
  async () => {
    const sources = [
      { name: 'Official Docs', weight: 1.0 },
      { name: 'Stack Overflow', weight: 0.8 },
      { name: 'GitHub Issues', weight: 0.7 },
      { name: 'Blog Posts', weight: 0.6 },
      { name: 'Reddit', weight: 0.5 }
    ];

    const aggregatedData = [];

    for (const source of sources) {
      // Mock data fetching from each source
      await new Promise(resolve => setTimeout(resolve, 20));

      const data = {
        source: source.name,
        items: Math.floor(Math.random() * 10) + 5,
        quality: source.weight * Math.random()
      };

      aggregatedData.push(data);
    }

    // Mock aggregation and ranking
    const totalItems = aggregatedData.reduce((sum, d) => sum + d.items, 0);
    const avgQuality = aggregatedData.reduce((sum, d) => sum + d.quality, 0) / aggregatedData.length;

    return {
      sourcesAggregated: sources.length,
      totalItems,
      avgQuality
    };
  },
  { iterations: 25 }
);

/**
 * API documentation parsing benchmark
 */
suite.add(
  'API Documentation Parsing',
  async () => {
    const mockApiDocs = {
      endpoints: Array.from({ length: 50 }, (_, i) => ({
        path: `/api/endpoint-${i}`,
        method: ['GET', 'POST', 'PUT', 'DELETE'][i % 4],
        parameters: Math.floor(Math.random() * 5),
        description: `Endpoint ${i} description`
      }))
    };

    // Mock parsing
    await new Promise(resolve => setTimeout(resolve, 30));

    const parsed = {
      totalEndpoints: mockApiDocs.endpoints.length,
      byMethod: {
        GET: mockApiDocs.endpoints.filter(e => e.method === 'GET').length,
        POST: mockApiDocs.endpoints.filter(e => e.method === 'POST').length,
        PUT: mockApiDocs.endpoints.filter(e => e.method === 'PUT').length,
        DELETE: mockApiDocs.endpoints.filter(e => e.method === 'DELETE').length
      }
    };

    return parsed;
  },
  { iterations: 30 }
);

/**
 * Code example extraction benchmark
 */
suite.add(
  'Code Example Extraction',
  async () => {
    const mockMarkdown = `
# React Hooks Guide

## useState Example
\`\`\`javascript
const [count, setCount] = useState(0);
\`\`\`

## useEffect Example
\`\`\`javascript
useEffect(() => {
  document.title = \`Count: \${count}\`;
}, [count]);
\`\`\`

## Custom Hook
\`\`\`javascript
function useCustomHook() {
  return { data: [] };
}
\`\`\`
`;

    // Mock extraction
    await new Promise(resolve => setTimeout(resolve, 10));

    const codeBlocks = mockMarkdown.match(/```[\s\S]*?```/g) || [];

    return {
      totalBlocks: codeBlocks.length,
      languages: ['javascript'],
      avgLength: codeBlocks.reduce((sum, block) => sum + block.length, 0) / codeBlocks.length
    };
  },
  { iterations: 50 }
);

/**
 * Semantic search benchmark
 */
suite.add(
  'Semantic Search',
  async () => {
    const query = 'how to optimize react performance';

    const documents = Array.from({ length: 100 }, (_, i) => ({
      id: i,
      content: `Document ${i} about React and performance`,
      embedding: Array.from({ length: 384 }, () => Math.random())
    }));

    // Mock semantic similarity calculation
    const queryEmbedding = Array.from({ length: 384 }, () => Math.random());

    const similarities = documents.map(doc => {
      // Mock cosine similarity
      let dotProduct = 0;
      for (let i = 0; i < 384; i++) {
        dotProduct += queryEmbedding[i] * doc.embedding[i];
      }
      return { id: doc.id, similarity: dotProduct };
    });

    similarities.sort((a, b) => b.similarity - a.similarity);

    return {
      documentsSearched: documents.length,
      topResults: similarities.slice(0, 10).length,
      avgSimilarity: similarities.slice(0, 10).reduce((sum, s) => sum + s.similarity, 0) / 10
    };
  },
  { iterations: 15 }
);

module.exports = suite.build();
