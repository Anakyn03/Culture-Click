import { useRef } from 'react'

/**
 * The one tab strip in the app — the place page's sections and the review section's three
 * views. Both had their own copy of the same roving-tabindex keyboard handling and pill
 * styling, which drifted every time one of them was restyled.
 *
 * Accessibility is the reason this is a component rather than a class string: a real tablist
 * needs `role="tab"`, `aria-selected`, `aria-controls`, a roving `tabIndex` (only the active
 * tab is in the tab order) and arrow-key movement. Getting that wrong is invisible until
 * someone uses a keyboard.
 *
 * @param {Array<{id: string, label: string, count?: number}>} tabs
 * @param {string} value        the active tab id
 * @param {(id: string) => void} onChange
 * @param {string} idPrefix     ids are `${idPrefix}-${tab.id}`, with panels `panel-${tab.id}`
 * @param {string} [className]  extra layout classes for the strip itself
 */
export default function Tabs({ tabs, value, onChange, idPrefix, label, className = '' }) {
  const stripRef = useRef(null)

  function onKeyDown(e) {
    const keys = ['ArrowRight', 'ArrowLeft', 'Home', 'End']
    if (!keys.includes(e.key)) return
    e.preventDefault()

    const index = tabs.findIndex((t) => t.id === value)
    let next = index
    if (e.key === 'ArrowRight') next = (index + 1) % tabs.length
    if (e.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length
    if (e.key === 'Home') next = 0
    if (e.key === 'End') next = tabs.length - 1

    const nextId = tabs[next].id
    onChange(nextId)

    // The newly active tab is the only one in the tab order, so it must take focus with the
    // arrow key — otherwise the next Tab press would leave the strip entirely.
    stripRef.current?.querySelector(`#${idPrefix}-${nextId}`)?.focus()
  }

  return (
    <div
      ref={stripRef}
      role="tablist"
      aria-label={label}
      onKeyDown={onKeyDown}
      className={`thin-scroll flex gap-1.5 overflow-x-auto ${className}`}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === value
        return (
          <button
            key={tab.id}
            role="tab"
            type="button"
            id={`${idPrefix}-${tab.id}`}
            aria-selected={isActive}
            aria-controls={`panel-${tab.id}`}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onChange(tab.id)}
            className={`flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2 text-[0.82rem] font-bold transition-colors ${
              isActive
                ? 'bg-indigo text-white dark:bg-gold dark:text-indigo'
                : 'bg-sand text-charcoal/70 hover:text-charcoal'
            }`}
          >
            {tab.label}
            {tab.count != null && (
              <span
                className={`rounded-full px-1.5 text-[0.7rem] ${
                  isActive ? 'bg-white/20' : 'bg-black/10 dark:bg-white/10'
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

/** The wrapper every panel wants: correct role/wiring, so panels can't be mislabelled. */
export function TabPanel({ id, idPrefix, children, className = '' }) {
  return (
    <section
      id={`panel-${id}`}
      role="tabpanel"
      aria-labelledby={`${idPrefix}-${id}`}
      className={className}
    >
      {children}
    </section>
  )
}
