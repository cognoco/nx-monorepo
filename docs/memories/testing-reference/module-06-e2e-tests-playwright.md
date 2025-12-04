## E2E Tests (Playwright)

- Full browser-based user journey tests
- Located in `apps/web-e2e/src/`
- Test complete flows: page load → interaction → data persistence
- Run in CI with headless browsers

### Page Object Pattern

E2E tests use the Page Object pattern to separate test logic from page structure:

```
apps/web-e2e/src/
├── pages/              # Page Objects
│   └── health.page.ts  # HealthPage class
└── health.spec.ts      # Tests using HealthPage
```

**Page Object Example**:
```typescript
// apps/web-e2e/src/pages/health.page.ts
export class HealthPage {
  readonly page: Page;
  readonly pingButton: Locator;
  readonly healthList: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pingButton = page.locator('[data-testid="ping-button"]');
    this.healthList = page.locator('[data-testid="health-list"]');
  }

  async goto() { await this.page.goto('/health'); }
  async ping() { await this.pingButton.click(); }
}
```

### Data-TestId Conventions

Use `data-testid` attributes for stable E2E test selectors. These are decoupled from CSS classes and DOM structure, making tests resilient to UI changes.

**Naming pattern**: `{feature}-{element}` or `{element}-{state}`

**Standard test IDs**:
| Test ID | Purpose |
|---------|---------|
| `page-title` | Main page heading |
| `{action}-button` | Interactive buttons (e.g., `ping-button`) |
| `{feature}-list` | Container for list items (e.g., `health-list`) |
| `{feature}-item` | Individual list items (e.g., `health-check-item`) |
| `{feature}-count` | Count displays (e.g., `health-count`) |
| `loading-state` | Loading indicator |
| `error-state` | Error container |
| `error-message` | Error message text |
| `empty-state` | Empty state container |

**React component example**:
```tsx
<button data-testid="ping-button" onClick={handlePing}>
  {pinging ? 'Pinging...' : 'Ping'}
</button>
<div data-testid="health-list">
  {healthChecks.map(check => (
    <div key={check.id} data-testid="health-check-item">...</div>
  ))}
</div>
```

### Test Example

```typescript
// apps/web-e2e/src/health.spec.ts
test('should create health check record', async ({ page }) => {
  const healthPage = new HealthPage(page);
  await healthPage.goto();
  await healthPage.waitForLoad();

  const initialCount = await healthPage.getHealthCheckCount();
  await healthPage.pingAndWaitForRecord();

  expect(await healthPage.getHealthCheckCount()).toBe(initialCount + 1);
});
```

---
