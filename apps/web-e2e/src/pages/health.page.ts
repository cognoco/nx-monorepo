/**
 * Health Page Object
 *
 * Encapsulates all selectors and interactions for the /health page.
 * Used by E2E tests to maintain clean separation between test logic and page structure.
 */
import { Page, Locator, expect } from '@playwright/test';

export class HealthPage {
  readonly page: Page;

  // Page elements
  readonly pageTitle: Locator;
  readonly pingButton: Locator;
  readonly healthList: Locator;
  readonly healthCheckItems: Locator;
  readonly healthCount: Locator;

  // State elements
  readonly loadingState: Locator;
  readonly errorState: Locator;
  readonly errorMessage: Locator;
  readonly emptyState: Locator;
  readonly pingError: Locator;

  constructor(page: Page) {
    this.page = page;

    // Page elements
    this.pageTitle = page.locator('[data-testid="page-title"]');
    this.pingButton = page.locator('[data-testid="ping-button"]');
    this.healthList = page.locator('[data-testid="health-list"]');
    this.healthCheckItems = page.locator('[data-testid="health-check-item"]');
    this.healthCount = page.locator('[data-testid="health-count"]');

    // State elements
    this.loadingState = page.locator('[data-testid="loading-state"]');
    this.errorState = page.locator('[data-testid="error-state"]');
    this.errorMessage = page.locator('[data-testid="error-message"]');
    this.emptyState = page.locator('[data-testid="empty-state"]');
    this.pingError = page.locator('[data-testid="ping-error"]');
  }

  /**
   * Navigate to the health page
   */
  async goto() {
    await this.page.goto('/health');
  }

  /**
   * Wait for the page to finish loading (loading state disappears)
   */
  async waitForLoad() {
    await this.loadingState.waitFor({ state: 'hidden', timeout: 10000 });
  }

  /**
   * Click the ping button to create a new health check
   */
  async ping() {
    await this.pingButton.click();
  }

  /**
   * Click ping and wait for the new record to appear
   * Returns the count after the ping
   */
  async pingAndWaitForRecord(): Promise<number> {
    const initialCount = await this.getHealthCheckCount();
    await this.ping();

    // Wait for button to return to ready state (loading state may be too fast to observe)
    await expect(this.pingButton).toContainText('Ping', { timeout: 10000 });

    // Wait for new record to appear
    await expect(this.healthCheckItems).toHaveCount(initialCount + 1, {
      timeout: 10000,
    });

    return initialCount + 1;
  }

  /**
   * Get the current count of health check records displayed
   */
  async getHealthCheckCount(): Promise<number> {
    // If empty state is visible, count is 0
    if (await this.emptyState.isVisible()) {
      return 0;
    }

    // If health list is visible, count the items
    if (await this.healthList.isVisible()) {
      return await this.healthCheckItems.count();
    }

    return 0;
  }

  /**
   * Check if the page is in loading state
   */
  async isLoading(): Promise<boolean> {
    return await this.loadingState.isVisible();
  }

  /**
   * Check if the page is showing an error
   */
  async hasError(): Promise<boolean> {
    return await this.errorState.isVisible();
  }

  /**
   * Get the error message text
   */
  async getErrorMessage(): Promise<string> {
    return (await this.errorMessage.textContent()) ?? '';
  }

  /**
   * Check if the page is showing empty state
   */
  async isEmpty(): Promise<boolean> {
    return await this.emptyState.isVisible();
  }

  /**
   * Check if the health list is visible with records
   */
  async hasRecords(): Promise<boolean> {
    return await this.healthList.isVisible();
  }

  /**
   * Get the ID from a specific health check item (0-indexed)
   */
  async getHealthCheckId(index: number): Promise<string> {
    const item = this.healthCheckItems.nth(index);
    const idText = await item.locator('text=ID:').textContent();
    // Extract just the ID value (format: "ID: uuid-here")
    return idText?.replace('ID: ', '').trim() ?? '';
  }

  /**
   * Verify the page title is correct
   */
  async verifyPageTitle() {
    await expect(this.pageTitle).toHaveText('Health Check Records');
  }

  /**
   * Block API requests to simulate server down scenario
   */
  async blockApiRequests() {
    await this.page.route('**/api/health**', (route) => route.abort());
  }

  /**
   * Unblock API requests (restore normal behavior)
   */
  async unblockApiRequests() {
    await this.page.unroute('**/api/health**');
  }
}
