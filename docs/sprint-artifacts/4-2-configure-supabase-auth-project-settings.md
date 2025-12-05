# Story 4.2: Configure Supabase Auth Project Settings

Status: ready-for-dev

## Story

As a **system administrator**,
I want **Supabase Auth configured for the project**,
So that **authentication is ready for user implementation in Phase 2**.

## Acceptance Criteria

1. **Given** Supabase project exists
   **When** I configure Authentication settings in Supabase dashboard
   **Then** Email/password authentication is enabled

2. **Given** Auth settings are configured
   **When** I review the configuration
   **Then** the following settings are appropriately configured:
   - Email confirmation (enabled or disabled with documented rationale)
   - JWT expiration settings (reasonable defaults documented)
   - Redirect URLs for web app (localhost for dev, staging URL placeholder)

3. **Given** configuration is complete
   **When** I review documentation
   **Then** settings are documented in `docs/environment-setup.md`

4. **Given** future OAuth expansion may be needed
   **When** I document the configuration
   **Then** provider setup patterns are noted for future reference

## Tasks / Subtasks

- [ ] **Task 1: Access Supabase Auth Settings** (AC: #1)
  - [ ] Navigate to Supabase Dashboard → Authentication → Settings
  - [ ] Review current authentication provider settings
  - [ ] Document initial state before changes

- [ ] **Task 2: Enable Email/Password Authentication** (AC: #1)
  - [ ] Verify Email provider is enabled
  - [ ] Configure password requirements (minimum length, complexity)
  - [ ] Document chosen password policy

- [ ] **Task 3: Configure Email Confirmation** (AC: #2)
  - [ ] Decide: Enable or disable email confirmation for MVP
  - [ ] If disabled for dev: Document security implications
  - [ ] If enabled: Configure email templates (use Supabase defaults)
  - [ ] Document decision rationale

- [ ] **Task 4: Configure JWT Settings** (AC: #2)
  - [ ] Review JWT expiration defaults
  - [ ] Set appropriate token expiration (recommended: 1 hour access, 7 days refresh)
  - [ ] Document JWT configuration

- [ ] **Task 5: Configure Redirect URLs** (AC: #2)
  - [ ] Add localhost redirect URLs for development:
    - `http://localhost:3000/**` (web dev)
    - `http://localhost:4200/**` (alternative port)
  - [ ] Add placeholder for staging URL (update when staging deployed)
  - [ ] Document redirect URL patterns

- [ ] **Task 6: Document Provider Configuration** (AC: #4)
  - [ ] Note how to enable OAuth providers (Google, GitHub) for future
  - [ ] Document required environment variables per provider
  - [ ] Create provider enablement checklist

- [ ] **Task 7: Update environment-setup.md** (AC: #3)
  - [ ] Add "Supabase Auth Configuration" section to `docs/environment-setup.md`
  - [ ] Document all settings with screenshots or configuration values
  - [ ] Include troubleshooting tips for common auth issues

- [ ] **Task 8: Document RLS Interaction** (AC: #4)
  - [ ] Note which RLS policies interact with `auth.uid()`
  - [ ] Document how auth context flows to database policies
  - [ ] Reference security architecture from architecture.md

## Dev Notes

### Configuration Decisions Required

**⚠️ This story requires user input** (noted in sprint-status.yaml planning_notes):

| Decision | Options | Recommendation |
|----------|---------|----------------|
| Email confirmation | On / Off | **Off for dev** (faster testing), On for staging/prod |
| Password requirements | Weak / Standard / Strong | **Standard** (8+ chars, mixed case) |
| JWT expiration | Short / Medium / Long | **Medium** (1hr access, 7d refresh) |

### Supabase Dashboard Navigation

1. Go to: https://supabase.com/dashboard
2. Select your project
3. Navigate: Authentication → Settings
4. Providers tab: Configure email provider
5. URL Configuration: Set redirect URLs

### Environment Variables (Reference)

These should already exist from Epic 1 setup:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key (server only)
```

### Security Considerations

- Email confirmation OFF reduces security but improves dev velocity
- JWT expiration too short = user friction; too long = security risk
- Redirect URLs should be explicit, avoid wildcards in production

### Project Structure Notes

- No code changes required - configuration only
- Documentation updates to `docs/environment-setup.md`
- This story can run in parallel with 4-1 and 4-3

### References

- [Source: docs/architecture.md#Security-Architecture]
- [Source: docs/architecture.md#Integration-Architecture] - Supabase connection strategy
- [Source: docs/PRD.md#FR10] - Supabase client factories
- [Source: docs/epics.md#Story-4.2]
- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)

## Dev Agent Record

### Context Reference

- `docs/sprint-artifacts/4-2-configure-supabase-auth-project-settings.context.xml`

### Agent Model Used

<!-- To be filled by implementing agent -->

### Debug Log References

<!-- To be filled during implementation -->

### Completion Notes List

<!-- To be filled after implementation -->

### File List

<!-- To be filled after implementation -->

---

## Changelog

| Date | Author | Change |
|------|--------|--------|
| 2025-12-04 | PM Agent (Ridcully) | Initial story draft from Epic 4 |

