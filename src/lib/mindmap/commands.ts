/**
 * Mind map specific command handlers.
 * Returns { handled: boolean, response?: string } so page.tsx can delegate.
 */

interface MapActions {
  focusProject: (slug: string) => void
  expandAll: () => void
  collapseAll: () => void
  toggleProject: (slug: string) => void
  selectNode: (id: string | null) => void
  projectSlugs: string[]
}

interface CommandResult {
  handled: boolean
  response?: string
}

export function handleMapCommand(cmd: string, args: string[], actions: MapActions): CommandResult {
  switch (cmd) {
    case 'focus': {
      if (args.length === 0) return { handled: true, response: 'Usage: focus <project-slug>' }
      const slug = args[0]
      if (!actions.projectSlugs.includes(slug)) {
        return { handled: true, response: `Unknown project: ${slug}. Available: ${actions.projectSlugs.join(', ')}` }
      }
      actions.focusProject(slug)
      return { handled: true, response: `Focused on ${slug}` }
    }

    case 'expand': {
      if (args[0] === 'all') {
        actions.expandAll()
        return { handled: true, response: 'All projects expanded' }
      }
      if (args.length === 0) return { handled: true, response: 'Usage: expand <project-slug|all>' }
      const slug = args[0]
      if (!actions.projectSlugs.includes(slug)) {
        return { handled: true, response: `Unknown project: ${slug}` }
      }
      actions.toggleProject(slug)
      return { handled: true, response: `Toggled ${slug}` }
    }

    case 'collapse': {
      if (args[0] === 'all' || args.length === 0) {
        actions.collapseAll()
        return { handled: true, response: 'All projects collapsed' }
      }
      const slug = args[0]
      actions.toggleProject(slug)
      return { handled: true, response: `Toggled ${slug}` }
    }

    case 'reset': {
      actions.collapseAll()
      actions.selectNode(null)
      return { handled: true, response: 'Map reset to default view' }
    }

    default:
      return { handled: false }
  }
}
