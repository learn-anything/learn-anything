import { useLocation, useParams } from "blade/hooks"
import type { Links } from "blade/types"
import { use } from "blade/server/hooks"

const styles = `
body {
  min-height: 100vh;
  margin: 0;
  font-family: "Inter", "SF Pro Display", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

.links-page-shell {
  --page-background: #f8fafc;
  --page-foreground: #0f172a;
  --card-background: #ffffff;
  --card-border: rgba(15, 23, 42, 0.1);
  --muted-foreground: #475569;
  --accent: #0f172a;
  background: var(--page-background);
  color: var(--page-foreground);
  min-height: 100vh;
}

@media (prefers-color-scheme: dark) {
  .links-page-shell {
    --page-background: #020617;
    --page-foreground: #e2e8f0;
    --card-background: rgba(15, 23, 42, 0.55);
    --card-border: rgba(148, 163, 184, 0.2);
    --muted-foreground: #94a3b8;
    --accent: #cbd5f5;
  }
}

.links-page-shell[data-theme="light"] {
  --page-background: #f8fafc;
  --page-foreground: #0f172a;
  --card-background: #ffffff;
  --card-border: rgba(15, 23, 42, 0.1);
  --muted-foreground: #475569;
  --accent: #0f172a;
}

.links-page-shell[data-theme="dark"] {
  --page-background: #020617;
  --page-foreground: #e2e8f0;
  --card-background: rgba(15, 23, 42, 0.55);
  --card-border: rgba(148, 163, 184, 0.2);
  --muted-foreground: #94a3b8;
  --accent: #cbd5f5;
}

.links-page {
  margin: 0 auto;
  max-width: 720px;
  padding: 2rem 1.5rem 3rem;
  background: var(--page-background);
  color: var(--page-foreground);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.links-page__intro {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

@media (min-width: 640px) {
  .links-page__intro {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}

.links-page__theme {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.links-page__theme p {
  margin: 0;
  font-size: 0.85rem;
  color: var(--muted-foreground);
}

.links-page__theme-picker {
  display: inline-flex;
  align-items: center;
  gap: 0.2rem;
  border: 1px solid var(--card-border);
  border-radius: 999px;
  padding: 0.2rem;
  background: rgba(148, 163, 184, 0.12);
  margin: 0;
}

.links-page__theme-picker legend {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.links-page__theme-picker a {
  text-decoration: none;
  font-size: 0.85rem;
  padding: 0.35rem 0.85rem;
  border-radius: 999px;
  color: var(--muted-foreground);
  transition: background 150ms ease, color 150ms ease;
}

.links-page__theme-picker a[aria-current="true"] {
  background: var(--accent);
  color: var(--page-background);
}

.links-page section {
  background: var(--card-background);
  border: 1px solid var(--card-border);
  border-radius: 16px;
  padding: 1.25rem 1.5rem;
  box-shadow: 0 10px 25px rgba(15, 23, 42, 0.05);
}

.links-page h1 {
  font-size: clamp(1.75rem, 2vw, 2.25rem);
  margin-bottom: 0.5rem;
}

.links-page p {
  color: var(--muted-foreground);
  margin: 0.25rem 0;
}

.links-page ol {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.links-page li {
  padding: 0.75rem 1rem;
  border: 1px dashed var(--card-border);
  border-radius: 12px;
  background: rgba(148, 163, 184, 0.08);
}

.links-page button,
.links-page a.primary-action {
  font-size: 0.95rem;
  padding: 0.75rem 1.25rem;
  border-radius: 999px;
  border: none;
  cursor: pointer;
  background: var(--accent);
  color: var(--page-background);
  transition: opacity 150ms ease, transform 150ms ease;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  text-decoration: none;
}

.links-page button:hover,
.links-page a.primary-action:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.links-page a.secondary-action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  padding: 0.6rem 1rem;
  border-radius: 999px;
  border: 1px solid var(--card-border);
  color: var(--page-foreground);
  text-decoration: none;
  transition: border 150ms ease, color 150ms ease;
}

.links-page a.secondary-action:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.links-page__composer {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.links-page__composer-fields {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
}

.links-page__composer-fields label {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  font-size: 0.85rem;
  color: var(--muted-foreground);
}

.links-page__composer-fields input {
  border-radius: 10px;
  border: 1px solid var(--card-border);
  padding: 0.6rem 0.85rem;
  background: rgba(148, 163, 184, 0.05);
  color: var(--page-foreground);
}

.links-page__composer-actions {
  display: flex;
  flex-direction: row;
  gap: 0.75rem;
  align-items: center;
}
`

type QueryState = {
  [key: string]: string | undefined
  addLink?: string
  theme?: string
}

export default function Page() {
  const links = use.links.orderedBy({
    descending: ["ronin.createdAt"],
  }) as Links
  const location = useLocation()
  const routeParams = useParams<Record<string, string>>()
  const searchParams = new URLSearchParams(location.search)
  const queryState: QueryState = {
    ...routeParams,
    ...Object.fromEntries(searchParams.entries()),
  }
  const isComposerOpen = queryState.addLink === "true"
  const themePreference =
    queryState.theme === "dark"
      ? "dark"
      : queryState.theme === "light"
      ? "light"
      : null
  const newLinkHref = buildSearchHref(location, { addLink: "true" })
  const resetHref = buildSearchHref(location, { addLink: null })
  const lightThemeHref = buildSearchHref(location, { theme: "light" })
  const darkThemeHref = buildSearchHref(location, { theme: "dark" })
  const systemThemeHref = buildSearchHref(location, { theme: null })

  return (
    <>
      <style>{styles}</style>

      <div
        className="links-page-shell"
        data-theme={themePreference ?? undefined}
      >
        <main className="links-page">
          <section>
            <div className="links-page__intro">
              <div>
                <h1>Links</h1>
                <p>Review every link that has been added to the workspace.</p>
                <p>
                  Total links: <strong>{links.length}</strong>
                </p>
              </div>

              <div className="links-page__theme">
                <p>Theme</p>
                <fieldset
                  className="links-page__theme-picker"
                  aria-label="Theme selector"
                >
                  <legend>Theme selector</legend>
                  <a
                    href={systemThemeHref}
                    aria-current={themePreference === null ? "true" : undefined}
                  >
                    System
                  </a>
                  <a
                    href={lightThemeHref}
                    aria-current={
                      themePreference === "light" ? "true" : undefined
                    }
                  >
                    Light
                  </a>
                  <a
                    href={darkThemeHref}
                    aria-current={
                      themePreference === "dark" ? "true" : undefined
                    }
                  >
                    Dark
                  </a>
                </fieldset>
              </div>
            </div>
          </section>

          <section aria-live="polite">
            {links.length === 0 ? (
              <p>You haven't added any links yet.</p>
            ) : (
              <ol>
                {links.map((link) => (
                  <li key={link.id}>
                    <p>
                      Link ID: <code>{link.id}</code>
                    </p>
                    <p>Added on {formatAddedOn(link.ronin.createdAt)}</p>
                  </li>
                ))}
              </ol>
            )}
          </section>

          <section>
            {isComposerOpen ? (
              <div>
                <h2>New link composer</h2>
                <p>
                  The add link state is controlled by the <code>addLink</code>{" "}
                  search parameter so you can stay on this route.
                </p>
                <a className="secondary-action" href={resetHref}>
                  Exit composer
                </a>
              </div>
            ) : (
              <a className="primary-action" href={newLinkHref}>
                Add a new link
              </a>
            )}
          </section>

          {isComposerOpen && (
            <section className="links-page__composer" aria-live="polite">
              <h2>Link details</h2>
              <p>
                Fill out the details for your next link without leaving this
                page.
              </p>

              <div className="links-page__composer-fields">
                <label>
                  Title
                  <input placeholder="My favorite resource" name="title" />
                </label>

                <label>
                  URL
                  <input placeholder="https://example.com" name="url" />
                </label>
              </div>

              <div className="links-page__composer-actions">
                <button
                  type="button"
                  disabled
                  title="Wire up mutations to persist the link"
                >
                  Save link
                </button>
                <a className="secondary-action" href={resetHref}>
                  Cancel
                </a>
              </div>
            </section>
          )}
        </main>
      </div>
    </>
  )
}

function formatAddedOn(value: string) {
  try {
    return new Intl.DateTimeFormat("en", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value))
  } catch {
    return value
  }
}

function buildSearchHref(
  location: URL,
  updates: Record<string, string | null>
) {
  const params = new URLSearchParams(location.search)
  for (const [key, value] of Object.entries(updates)) {
    if (value === null) params.delete(key)
    else params.set(key, value)
  }
  const query = params.toString()
  return query ? `${location.pathname}?${query}` : location.pathname
}
