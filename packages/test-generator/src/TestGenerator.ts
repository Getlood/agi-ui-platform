/**
 * Test Generator - Phase 5
 * Génération automatique de tests Playwright
 */

import { openai } from '@ai-sdk/openai';

export interface UISpec {
  type: string;
  components: any[];
  structure: any;
  metadata?: Record<string, any>;
}

export interface TestConfig {
  framework: 'playwright' | 'cypress' | 'jest';
  types: ('accessibility' | 'interaction' | 'visual' | 'performance')[];
  coverage: 'basic' | 'comprehensive' | 'exhaustive';
}

export class TestGenerator {
  /**
   * Générer des tests pour une UI
   */
  async generateTests(
    uiSpec: UISpec,
    config: TestConfig = {
      framework: 'playwright',
      types: ['accessibility', 'interaction'],
      coverage: 'comprehensive'
    }
  ): Promise<string> {
    const client = openai('gpt-4o');
    
    const response = await client.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: this.getSystemPrompt(config)
        },
        {
          role: 'user',
          content: `Génère des tests ${config.framework} pour cette interface:

${JSON.dumps(uiSpec, null, 2)}

Types de tests: ${config.types.join(', ')}
Couverture: ${config.coverage}`
        }
      ],
      temperature: 0.2
    });
    
    return response.choices[0].message.content;
  }
  
  /**
   * Générer le prompt système selon la configuration
   */
  private getSystemPrompt(config: TestConfig): string {
    let prompt = `Tu génères des tests ${config.framework} pour des interfaces utilisateur.\n\n`;
    
    if (config.types.includes('accessibility')) {
      prompt += `Tests d'accessibilité:
- Utiliser axe-core ou axe-playwright
- Vérifier WCAG 2.1 niveau AA minimum
- Tester la navigation au clavier
- Vérifier les rôles ARIA
- Tester les lecteurs d'écran\n\n`;
    }
    
    if (config.types.includes('interaction')) {
      prompt += `Tests d'interaction:
- Tester tous les boutons et liens
- Vérifier les formulaires (validation, soumission)
- Tester les modales et popups
- Vérifier les états (hover, focus, active)
- Tester les interactions complexes\n\n`;
    }
    
    if (config.types.includes('visual')) {
      prompt += `Tests visuels:
- Screenshots de référence
- Détection de régressions visuelles
- Tests responsive (mobile, tablet, desktop)
- Vérifier les animations
- Tester le dark mode si applicable\n\n`;
    }
    
    if (config.types.includes('performance')) {
      prompt += `Tests de performance:
- Mesurer le temps de chargement
- Vérifier Core Web Vitals (LCP, FID, CLS)
- Tester la vitesse de rendu
- Vérifier l'utilisation mémoire
- Tester sous charge\n\n`;
    }
    
    prompt += `Retourne du code TypeScript complet et prêt à l'emploi.
Inclus les imports nécessaires et les configurations.
Utilise les meilleures pratiques et patterns.
Ajoute des commentaires explicatifs.`;
    
    return prompt;
  }
  
  /**
   * Générer un test d'accessibilité
   */
  async generateAccessibilityTest(uiSpec: UISpec): Promise<string> {
    return `import { test, expect } from '@playwright/test';
import { injectAxe, checkA11y } from 'axe-playwright';

test.describe('Accessibility Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await injectAxe(page);
  });

  test('should pass WCAG 2.1 Level AA', async ({ page }) => {
    await checkA11y(page, null, {
      detailedReport: true,
      detailedReportOptions: {
        html: true,
      },
    });
  });

  test('should be keyboard navigable', async ({ page }) => {
    // Tester la navigation au clavier
    await page.keyboard.press('Tab');
    const focused = await page.evaluate(() => document.activeElement?.tagName);
    expect(focused).toBeTruthy();
  });

  test('should have proper ARIA labels', async ({ page }) => {
    const buttons = await page.locator('button').all();
    for (const button of buttons) {
      const ariaLabel = await button.getAttribute('aria-label');
      const text = await button.textContent();
      expect(ariaLabel || text).toBeTruthy();
    }
  });

  test('should have sufficient color contrast', async ({ page }) => {
    await checkA11y(page, null, {
      rules: {
        'color-contrast': { enabled: true },
      },
    });
  });
});`;
  }
  
  /**
   * Générer un test d'interaction
   */
  async generateInteractionTest(uiSpec: UISpec): Promise<string> {
    return `import { test, expect } from '@playwright/test';

test.describe('Interaction Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should handle form submission', async ({ page }) => {
    // Remplir le formulaire
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    
    // Soumettre
    await page.click('button[type="submit"]');
    
    // Vérifier la redirection ou le message
    await expect(page).toHaveURL(/dashboard/);
  });

  test('should validate required fields', async ({ page }) => {
    // Soumettre sans remplir
    await page.click('button[type="submit"]');
    
    // Vérifier les messages d'erreur
    const errorMessage = page.locator('.error-message');
    await expect(errorMessage).toBeVisible();
  });

  test('should open and close modal', async ({ page }) => {
    // Ouvrir la modale
    await page.click('button[data-testid="open-modal"]');
    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible();
    
    // Fermer la modale
    await page.click('button[aria-label="Close"]');
    await expect(modal).not.toBeVisible();
  });

  test('should handle button clicks', async ({ page }) => {
    const button = page.locator('button.primary');
    await button.click();
    
    // Vérifier l'action
    const result = page.locator('.result');
    await expect(result).toBeVisible();
  });
});`;
  }
  
  /**
   * Générer un test de performance
   */
  async generatePerformanceTest(uiSpec: UISpec): Promise<string> {
    return `import { test, expect } from '@playwright/test';

test.describe('Performance Tests', () => {
  test('should load in under 3 seconds', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(3000);
  });

  test('should have good Core Web Vitals', async ({ page }) => {
    await page.goto('/');
    
    // Mesurer LCP (Largest Contentful Paint)
    const lcp = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          resolve(lastEntry.renderTime || lastEntry.loadTime);
        }).observe({ entryTypes: ['largest-contentful-paint'] });
      });
    });
    
    expect(lcp).toBeLessThan(2500); // Good LCP < 2.5s
  });

  test('should have minimal CLS', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Mesurer CLS (Cumulative Layout Shift)
    const cls = await page.evaluate(() => {
      return new Promise((resolve) => {
        let clsValue = 0;
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              clsValue += (entry as any).value;
            }
          }
          resolve(clsValue);
        }).observe({ entryTypes: ['layout-shift'] });
        
        setTimeout(() => resolve(clsValue), 5000);
      });
    });
    
    expect(cls).toBeLessThan(0.1); // Good CLS < 0.1
  });

  test('should render efficiently', async ({ page }) => {
    await page.goto('/');
    
    // Mesurer le temps de rendu
    const metrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        domInteractive: navigation.domInteractive - navigation.fetchStart,
        domComplete: navigation.domComplete - navigation.fetchStart,
      };
    });
    
    expect(metrics.domInteractive).toBeLessThan(1500);
  });
});`;
  }
  
  /**
   * Générer une suite de tests complète
   */
  async generateTestSuite(uiSpec: UISpec): Promise<{
    accessibility: string;
    interaction: string;
    performance: string;
    visual: string;
  }> {
    return {
      accessibility: await this.generateAccessibilityTest(uiSpec),
      interaction: await this.generateInteractionTest(uiSpec),
      performance: await this.generatePerformanceTest(uiSpec),
      visual: await this.generateVisualTest(uiSpec),
    };
  }
  
  /**
   * Générer un test visuel
   */
  private async generateVisualTest(uiSpec: UISpec): Promise<string> {
    return `import { test, expect } from '@playwright/test';

test.describe('Visual Tests', () => {
  test('should match desktop screenshot', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveScreenshot('desktop.png');
  });

  test('should match mobile screenshot', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await expect(page).toHaveScreenshot('mobile.png');
  });

  test('should match tablet screenshot', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    await expect(page).toHaveScreenshot('tablet.png');
  });

  test('should handle dark mode', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');
    await expect(page).toHaveScreenshot('dark-mode.png');
  });
});`;
  }
}

// Export singleton
export const testGenerator = new TestGenerator();
