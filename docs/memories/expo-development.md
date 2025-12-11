# Expo Development Reference

> **Purpose**: Technical reference for Expo/React Native mobile development
> **Audience**: AI agents, developers
> **Governance**: Supports Epic 6 (Mobile Walking Skeleton) and future mobile development

---

## Context7 Library IDs for Documentation

Use these library IDs with the Context7 MCP server for cross-verification:

| Library ID | Snippets | Score | Best For |
|------------|----------|-------|----------|
| `/llmstxt/expo_dev_llms_txt` | 7,050 | 91 | **Primary** - General Expo docs |
| `/websites/expo_dev_versions_v54_0_0` | 2,560 | 83.1 | SDK 54 specific docs |
| `/expo/expo` | 4,532 | 85.1 | Source code examples |
| `/websites/docs_expo_dev-versions-latest-sdk-notifications` | 179 | 87.3 | Push notifications |
| `/facebook/react-native` | 734 | 54.3 | React Native core (non-Expo) |

### Usage Example

```
mcp__plugin_dev-core_Context7_MCP__get-library-docs
  context7CompatibleLibraryID: "/llmstxt/expo_dev_llms_txt"
  topic: "expo-router navigation"
```

---

## EAS CLI Command Reference

EAS (Expo Application Services) is CLI-driven. There is no REST API.

### Build Commands

| Command | Purpose |
|---------|---------|
| `eas build` | Build iOS/Android binaries |
| `eas build:configure` | Set up build configuration |
| `eas build:list` | View build history |
| `eas build:cancel` | Cancel in-progress build |

### Submission Commands

| Command | Purpose |
|---------|---------|
| `eas submit` | Submit to app stores |
| `eas submit:configure` | Configure submission settings |

### Update Commands (OTA)

| Command | Purpose |
|---------|---------|
| `eas update` | Publish JavaScript updates |
| `eas update:configure` | Configure update settings |
| `eas update:list` | View update history |
| `eas update:rollback` | Revert to previous update |

### Branch/Channel Management

| Command | Purpose |
|---------|---------|
| `eas branch:create` | Create a new branch |
| `eas branch:list` | List all branches |
| `eas channel:edit` | Configure channel settings |

### Webhooks

| Command | Purpose |
|---------|---------|
| `eas webhook:create` | Set up build event webhooks |

Webhook security uses HMAC-SHA1 signing with `expo-signature` header.

---

## Expo MCP Server Tools

When the Expo MCP Server is available, these tools are provided:

### Server Tools (Always available)

| Tool | Purpose | Example |
|------|---------|---------|
| `search_documentation` | Search live Expo docs | "expo-router deep linking" |
| `add_library` | Install with correct versions | Adds expo-camera with compatible version |
| `learn` | Get topic how-to guides | "learn expo-router" |
| `generate_agents_md` | Generate AGENTS.md | Project onboarding |
| `generate_claude_md` | Generate CLAUDE.md | Claude Code setup |

### Local Tools (Requires dev server with `EXPO_UNSTABLE_MCP_SERVER=1`)

| Tool | Purpose |
|------|---------|
| `automation_take_screenshot` | Screenshot running app |
| `automation_tap` | Tap at coordinates |
| `automation_tap_by_testid` | Tap by testID |
| `automation_find_view_by_testid` | Find view by testID |
| `open_devtools` | Open React Native DevTools |
| `expo_router_sitemap` | Generate router sitemap |

---

## Version Compatibility Notes

### Current SDK: 54

- React Native: 0.81
- React: 19.1.0
- Requires: `expo` package at latest version

### Common Version Pitfalls

1. **expo-router imports**: Use `expo-router` (not `@expo/router`)
2. **Camera API**: SDK 54 uses new camera API; old tutorials are outdated
3. **Notifications**: Token retrieval requires `projectId` parameter
4. **File system**: `expo-file-system` API changed in recent SDKs

### Safe Dependency Installation

**Always use Expo MCP's `add_library` or:**

```bash
npx expo install <package-name>
```

**Never use:**
```bash
npm install <package-name>  # May install incompatible version
pnpm add <package-name>     # May install incompatible version
```

---

## Monorepo Integration Patterns

### Package Structure (apps/mobile)

```
apps/
  mobile/                    # Expo app
    app/                     # Expo Router pages (file-based routing)
      _layout.tsx            # Root layout
      index.tsx              # Home screen
      (tabs)/                # Tab group
        _layout.tsx          # Tab navigator
        home.tsx
        settings.tsx
    src/
      components/            # React Native components
      hooks/                 # Custom hooks
    app.json                 # Expo configuration
    eas.json                 # EAS Build configuration
    metro.config.js          # Metro bundler config
    tsconfig.json
```

### Shared Package Usage

Mobile app should import from shared packages:

```typescript
import { healthCheckSchema } from '@nx-monorepo/schemas';
import { createApiClient } from '@nx-monorepo/api-client';
```

### Metro Configuration for Monorepo

Expo in Nx monorepo requires Metro config that understands workspace structure. See Nx Expo plugin documentation.

---

## Troubleshooting

### Build Failures

1. **Version mismatch**: Run `npx expo install --check` to verify compatibility
2. **Metro cache**: Clear with `npx expo start --clear`
3. **Node modules**: Delete `node_modules` and reinstall

### Development Server Issues

1. **Port conflict**: Use `npx expo start --port 8082`
2. **Metro not finding packages**: Check `metro.config.js` watchFolders
3. **TypeScript errors**: Ensure `tsconfig.json` extends workspace base

### EAS Build Issues

1. **Credentials**: Run `eas credentials` to manage signing
2. **Environment variables**: Check `eas.json` env configuration
3. **Build logs**: Use `eas build:view` for detailed logs

---

## References

- [Official Expo MCP Documentation](https://docs.expo.dev/eas/ai/mcp/)
- [Expo Router Documentation](https://docs.expo.dev/router/introduction/)
- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [Nx Expo Plugin](https://nx.dev/nx-api/expo)
