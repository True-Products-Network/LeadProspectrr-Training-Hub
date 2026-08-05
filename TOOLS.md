# TOOLS.md - Local Notes

Skills define _how_ tools work. This file is for _your_ specifics — the stuff that's unique to your setup.

## What Goes Here

Things like:

- Camera names and locations
- SSH hosts and aliases
- Preferred voices for TTS
- Speaker/room names
- Device nicknames
- Anything environment-specific

## Examples

```markdown
### Cameras

- living-room → Main area, 180° wide angle
- front-door → Entrance, motion-triggered

### SSH

- home-server → 192.168.1.100, user: admin

### TTS

- Preferred voice: "Nova" (warm, slightly British)
- Default speaker: Kitchen HomePod
```

## Why Separate?

Skills are shared. Your setup is yours. Keeping them apart means you can update skills without losing your notes, and share skills without leaking your infrastructure.

---

Add whatever helps you do your job. This is your cheat sheet.

## TypeScript Best Practices (Next.js Strict Mode)

When writing TypeScript code for this project:

1. **Always define interfaces** for database query results before using them
2. **Use explicit types** for all `.map()`, `.filter()`, `.forEach()` callback parameters  
3. **Type Supabase queries** with `.returns<Interface[]>()`
4. **Test build locally** with `npm run build` before pushing to catch type errors

### Example Pattern

```typescript
// Define interfaces at top of file
interface ContactAssociation {
  association_id: string;
}

// Type the query result
const { data } = await supabase
  .from("table")
  .select("field")
  .returns<ContactAssociation[]>();

// Explicit types for callbacks
const ids = data.map((item: ContactAssociation) => item.field);
```

## Project Repositories

**Property Management Portal** (Primary)
- Path: `/root/.openclaw/workspace/Property-Management-Portal`
- Repo: `https://github.com/True-Products-Network/Property-Management-Portal.git`
- Vercel: Live deployment target
- Stack: Next.js 16, Supabase, Tailwind, shadcn/ui

**Other Repos (DO NOT PUSH HERE unless explicitly asked):**
- `speaker-impact-engine` → Talkadot project
- `focus-calendar` → Focus Calendar project

**Always verify current directory before committing:**
```bash
pwd && git remote -v
```

## Recent Work Log (August 2026)

### Aug 5, 2026
- **GHL Integration UI**: Added Tested badge, blue Test Connection button, red Disconnect button
- **User Management Fix**: Now shows actual users from `users` table (not contacts), added Role column, fixed search input styling covering "S"
- **Commits**: `7c79089`, `ef0059f`, `3518e77`

### Aug 4, 2026
- **Multi-Tenant Platform**: Core complete (Platform Console, Plans, Entitlements)
- **GHL Sync Layer**: Implemented with field mapper, queue system, conflict resolver
- **Association-Level GHL**: Each association can have its own GHL location

## Related

- [Agent workspace](/concepts/agent-workspace)
