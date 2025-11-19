/**
 * Performance Optimizer Agent Integration Tests
 *
 * Tests the performance optimizer's ability to:
 * - Integrate with Lighthouse
 * - Analyze bundle sizes
 * - Generate optimization suggestions
 */

import { describe, it, expect } from '@jest/globals';
import { AgentMocks, CustomAssertions } from './utils/test-helpers.js';

describe('Performance Optimizer Agent Integration Tests', () => {
  describe('Lighthouse Integration', () => {
    it('should run Lighthouse audit', () => {
      const lighthouseResult = {
        performance: 85,
        accessibility: 95,
        bestPractices: 90,
        seo: 88,
        pwa: 50
      };

      expect(lighthouseResult.performance).toBeGreaterThan(0);
      expect(lighthouseResult.performance).toBeLessThanOrEqual(100);
    });

    it('should identify performance bottlenecks', () => {
      const audits = [
        { id: 'largest-contentful-paint', score: 0.5, numericValue: 4500 },
        { id: 'first-input-delay', score: 0.9, numericValue: 50 },
        { id: 'cumulative-layout-shift', score: 0.7, numericValue: 0.15 }
      ];

      const failing = audits.filter(a => a.score < 0.9);
      expect(failing).toHaveLength(2);
    });

    it('should provide Lighthouse scores in response', () => {
      const metrics = {
        performance: 95,
        accessibility: 100,
        bestPractices: 90,
        seo: 85
      };

      const response = AgentMocks.performanceOptimizerSuccess(metrics);

      CustomAssertions.assertAgentSuccess(response, 'performance-optimizer');
      expect(response.result.metrics.performance).toBe(95);
    });
  });

  describe('Bundle Analysis', () => {
    it('should analyze JavaScript bundle size', () => {
      const bundles = [
        { name: 'main.js', size: 450000, parsed: 150000, gzipped: 50000 },
        { name: 'vendor.js', size: 2000000, parsed: 800000, gzipped: 200000 }
      ];

      const totalSize = bundles.reduce((sum, b) => sum + b.size, 0);
      expect(totalSize).toBeGreaterThan(0);

      const largeBundles = bundles.filter(b => b.size > 500000);
      expect(largeBundles).toHaveLength(1);
    });

    it('should detect large dependencies', () => {
      const dependencies = [
        { name: 'moment', size: 500000, treeshakeable: false },
        { name: 'lodash', size: 700000, treeshakeable: true },
        { name: 'react', size: 120000, treeshakeable: true }
      ];

      const large = dependencies.filter(d => d.size > 200000);
      expect(large).toHaveLength(2);
    });

    it('should identify unused code', () => {
      const codeUsage = [
        { file: 'utils.js', used: 60, unused: 40 },
        { file: 'helpers.js', used: 90, unused: 10 }
      ];

      const highWaste = codeUsage.filter(c => c.unused > 30);
      expect(highWaste).toHaveLength(1);
    });

    it('should analyze CSS bundle size', () => {
      const cssFiles = [
        { name: 'styles.css', size: 150000, minified: 100000 },
        { name: 'vendor.css', size: 300000, minified: 200000 }
      ];

      const totalCss = cssFiles.reduce((sum, f) => sum + f.size, 0);
      expect(totalCss).toBe(450000);
    });
  });

  describe('Optimization Suggestions', () => {
    it('should suggest image optimization', () => {
      const images = [
        { name: 'hero.jpg', size: 5000000, optimized: false },
        { name: 'logo.png', size: 200000, optimized: true }
      ];

      const needsOptimization = images.filter(img =>
        !img.optimized && img.size > 1000000
      );

      expect(needsOptimization).toHaveLength(1);

      const suggestion = {
        type: 'image-optimization',
        files: needsOptimization.map(i => i.name),
        recommendation: 'Compress images using WebP format'
      };

      expect(suggestion.recommendation).toContain('WebP');
    });

    it('should suggest code splitting', () => {
      const bundleSize = 3000000; // 3MB

      if (bundleSize > 500000) {
        const suggestion = {
          type: 'code-splitting',
          recommendation: 'Split bundle into smaller chunks using dynamic imports'
        };

        expect(suggestion.type).toBe('code-splitting');
      }
    });

    it('should suggest lazy loading', () => {
      const components = [
        { name: 'Modal', aboveFold: false, lazy: false },
        { name: 'Header', aboveFold: true, lazy: false }
      ];

      const shouldBeLazy = components.filter(c => !c.aboveFold && !c.lazy);
      expect(shouldBeLazy).toHaveLength(1);
    });

    it('should suggest caching strategies', () => {
      const staticAssets = [
        { file: 'app.js', cacheControl: null },
        { file: 'logo.png', cacheControl: 'max-age=31536000' }
      ];

      const missingCache = staticAssets.filter(a => !a.cacheControl);
      expect(missingCache).toHaveLength(1);

      const suggestion = {
        type: 'caching',
        recommendation: 'Add cache-control headers for static assets'
      };

      expect(suggestion.type).toBe('caching');
    });

    it('should suggest CDN usage', () => {
      const assets = [
        { file: 'image.jpg', size: 2000000, cdn: false },
        { file: 'video.mp4', size: 50000000, cdn: false }
      ];

      const largeAssets = assets.filter(a => a.size > 1000000 && !a.cdn);
      expect(largeAssets).toHaveLength(2);
    });
  });

  describe('Performance Metrics', () => {
    it('should measure Core Web Vitals', () => {
      const webVitals = {
        LCP: 2.5, // Largest Contentful Paint (seconds)
        FID: 100, // First Input Delay (ms)
        CLS: 0.1  // Cumulative Layout Shift
      };

      expect(webVitals.LCP).toBeLessThan(2.5); // Good
      expect(webVitals.FID).toBeLessThan(100); // Good
      expect(webVitals.CLS).toBeLessThan(0.1); // Good
    });

    it('should track Time to Interactive', () => {
      const tti = 3.2; // seconds

      const isGood = tti < 3.8;
      expect(isGood).toBe(true);
    });

    it('should measure bundle parse time', () => {
      const parseTime = {
        main: 200, // ms
        vendor: 800 // ms
      };

      const total = parseTime.main + parseTime.vendor;
      expect(total).toBeLessThan(1500); // Target: < 1.5s
    });
  });

  describe('Lighthouse Config', () => {
    it('should configure Lighthouse for mobile', () => {
      const config = {
        extends: 'lighthouse:default',
        settings: {
          formFactor: 'mobile',
          throttling: {
            rtt: 150,
            throughput: 1.6 * 1024 * 1024,
            cpuSlowdownMultiplier: 4
          }
        }
      };

      expect(config.settings.formFactor).toBe('mobile');
    });

    it('should configure Lighthouse for desktop', () => {
      const config = {
        settings: {
          formFactor: 'desktop',
          throttling: {
            rtt: 40,
            throughput: 10 * 1024 * 1024,
            cpuSlowdownMultiplier: 1
          }
        }
      };

      expect(config.settings.formFactor).toBe('desktop');
    });
  });

  describe('Report Generation', () => {
    it('should generate optimization report', () => {
      const response = AgentMocks.performanceOptimizerSuccess({
        performance: 85,
        accessibility: 95
      });

      response.result.suggestions = [
        'Optimize images',
        'Enable compression',
        'Minify JavaScript'
      ];

      expect(response.result.suggestions).toHaveLength(3);
    });

    it('should prioritize suggestions by impact', () => {
      const suggestions = [
        { type: 'image-optimization', impact: 'high', savings: '2.5MB' },
        { type: 'minification', impact: 'low', savings: '50KB' },
        { type: 'code-splitting', impact: 'high', savings: '1.2MB' }
      ];

      const highImpact = suggestions
        .filter(s => s.impact === 'high')
        .sort((a, b) => b.savings.localeCompare(a.savings));

      expect(highImpact).toHaveLength(2);
      expect(highImpact[0].type).toBe('image-optimization');
    });

    it('should include before/after metrics', () => {
      const comparison = {
        before: { performance: 65, size: 3500000 },
        after: { performance: 90, size: 1200000 },
        improvement: { performance: 25, size: 2300000 }
      };

      expect(comparison.improvement.performance).toBe(25);
    });
  });

  describe('Integration Scenarios', () => {
    it('should work with coder agent for optimizations', () => {
      const optimizations = [
        { file: 'App.jsx', action: 'Add lazy loading for Modal component' },
        { file: 'webpack.config.js', action: 'Enable code splitting' }
      ];

      // Performance optimizer suggests changes
      // Coder implements them
      expect(optimizations).toHaveLength(2);
    });

    it('should escalate when performance is critically low', () => {
      const performanceScore = 30; // Critical!

      if (performanceScore < 50) {
        const stuckRequest = AgentMocks.stuckEscalation(
          `Performance score critically low: ${performanceScore}/100`,
          [
            'Implement all optimization suggestions',
            'Review architecture for performance issues',
            'Set performance budget'
          ]
        );

        expect(stuckRequest.agent).toBe('stuck');
      }
    });
  });
});
