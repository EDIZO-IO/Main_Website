---
name: production-data-integrity
description: >-
  Systematic runbook and audit guide for identifying, eliminating, and replacing
  all mock, fake, placeholder, and hardcoded data with live database models,
  real backend API endpoints, and production-grade state handling.
  Use when the user asks to "ready for production", "remove mock data", "connect frontend to real backend",
  "eliminate hardcoded data", "audit for fake data", "prep for launch", "stop using placeholder data",
  or "clean up sample data".
---

# Production Data Integrity & Mock Elimination Runbook

This skill defines the mandatory protocol for auditing, eliminating, and replacing all mock, sample, and hardcoded data across full-stack applications to ensure 100% production readiness and data integrity.

---

## 1. Zero-Mock Policy & Guiding Principles

1. **Never Present Mock Data as Live**: Never fabricate sample data, fake API responses, or placeholder content and present it as if it were real or working.
2. **True Empty States Over Fake Defaults**: If a database table or endpoint returns an empty array `[]`, render an authentic empty state (e.g. *"No projects currently published"*) or skeleton loader rather than falling back to hardcoded dummy arrays.
3. **Database as Single Source of Truth**: All dynamic business content (services, projects, testimonials, catalog items, team members, contact settings) must reside in database tables.
4. **Environment-Driven Configuration**: No hardcoded production URLs or database credentials. Always rely on environment variables (`.env`, `VITE_API_URL`, `process.env.PORT`).

---

## 2. Five-Phase Mock Elimination Workflow

### Phase 1: Static Data Detection, Audit & Triage

#### A. Automated Audit Commands
Run ripgrep / grep commands across client source code to locate potential mock arrays and dummy constants:

```bash
# 1. Search for common mock/fallback variable identifiers
rg -n "(const|let|var)\s+(mock\w*|fallback\w*|default[A-Z]\w*|sample\w*|dummy\w*)\s*=" client/src/

# 2. Search for inline array definitions disguised as database tables
rg -n "const\s+\w+\s*=\s*\[\s*\{\s*(id|title|name|email|rating)\s*:" client/src/

# 3. Search for placeholder strings, lorem ipsum, or fake contact info
rg -i -n "(lorem ipsum|john@example|jane@example|\+1 555|placeholder\.com)" client/src/
```

#### B. Triage Test
Before modifying a file, determine if the data is a violation or legitimate:
- **Decision Test**: *"Would a non-developer, content manager, or admin ever need to add, edit, or remove this item without deploying code?"*
  - **YES → VIOLATION**: Must be migrated to a database table and loaded via an authenticated REST/GraphQL API.
  - **NO (Static System Config)**: Fixed UI constants like navigation route definitions, UI icon mappings, or theme token options remain in code.
  - **TEST FIXTURE**: Files located in `__tests__/`, `*.test.jsx`, or `*.spec.ts` are legitimate test fixtures and must **NOT** be broken.

---

### Phase 2: Schema Definition & Database Migration
1. Verify corresponding database tables exist with proper column types (`VARCHAR`, `TEXT`, `JSON`, `BOOLEAN`, `TIMESTAMP`).
2. Add foreign keys, explicit `NOT NULL` constraints, unique indexes, and audit timestamps (`created_at`, `updated_at`).
3. Ensure sensitive fields (passwords, tokens, PII) are hashed or isolated.

---

### Phase 3: Backend API Architecture (Avoid "Mocking the Mock")
1. **Never Mock Inside the Controller**: Do not replace a frontend mock array with a hardcoded `res.json([...])` inside an Express route. Every route must query MySQL/PostgreSQL using connection pools.
2. **Parameterized Queries**: Always use parameterized queries (e.g. `pool.query('SELECT * FROM table WHERE status = ?', ['active'])`) to block SQL injection.
3. **Response Sanitization**: Strip internal server columns, stack traces, and database connection errors before returning JSON.

---

### Phase 4: Frontend API Binding & Race-Condition Safe Effects

1. Replace all static initial states (`useState(mockArray)`) with empty arrays (`useState([])`) and an active loading flag (`useState(true)`).
2. Use `AbortController` in `useEffect` to avoid state updates on unmounted components and race conditions:

```jsx
// ❌ WRONG: Falling back to mock data when API returns empty
const [data, setData] = useState([]);
useEffect(() => {
  fetch('/api/projects')
    .then(r => r.json())
    .then(res => setData(res.length ? res : mockProjects)); // NEVER DO THIS
}, []);

// ✅ CORRECT: Pure dynamic binding with AbortController, loading skeletons, and real empty states
const [data, setData] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
  const controller = new AbortController();
  
  const fetchLive = async () => {
    try {
      setLoading(true);
      const API_URL = import.meta.env.VITE_API_URL || '';
      const res = await fetch(`${API_URL}/api/projects`, { signal: controller.signal });
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      const json = await res.json();
      setData(Array.isArray(json) ? json : []);
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error("API fetch error:", err);
        setError("Unable to load live data.");
      }
    } finally {
      setLoading(false);
    }
  };

  fetchLive();
  return () => controller.abort();
}, []);
```

3. **Delete Dead Fixture Files**: When a static mock file is replaced by an API endpoint, completely delete the dead mock file (e.g. `src/data/mockProjects.js`) rather than leaving unused code in the repository.

---

### Phase 5: Production Data Seeding & Deployment
1. Write structured, idempotent SQL scripts to seed authentic initial data into database tables:
```sql
INSERT INTO site_settings (key_name, value) 
VALUES ('company_name', 'EDIZO Tech Solutions')
ON DUPLICATE KEY UPDATE value=VALUES(value);
```
2. Test end-to-end write flows (e.g., submitting contact inquiries, applications, or requests) and verify rows are persisted directly in database tables.

---

## 3. Common Pitfalls to Avoid

| Pitfall | Problem | Solution |
| :--- | :--- | :--- |
| **"Mocking the Mock"** | Hardcoding static data in Express controllers (`res.json([...])`) instead of querying the database. | Connect the route to MySQL connection pools (`pool.query`). |
| **Partial Migrations** | Updating the homepage but leaving the dedicated `/projects` or `/testimonials` pages with stale mock arrays. | Audit all routes and subcomponents across the application. |
| **Silent Empty Failures** | `if (data.length === 0) return null;` silently hiding an entire section without notifying the user. | Render clean, designed empty states (e.g. *"No reviews published yet"*). |
| **Breaking Test Suites** | Deleting mock objects used inside `*.test.js` or unit test files. | Use triage rules to separate client presentation from automated test suites. |

---

## 4. Production Readiness Verification Checklist

- [ ] Zero static mock arrays disguised as live data in frontend components.
- [ ] Database connection pool configured with connection limits and error handlers.
- [ ] Dead fixture and mock data files deleted from `src/` directory.
- [ ] All client forms (Contact, Application, Lead Capture) write to live database tables.
- [ ] No hardcoded passwords, tokens, or local credentials in client bundles (`dist/`).
- [ ] Build verification (`npm run build`) succeeds with 0 lint and compilation errors.
