import type { PageNode, PageNodeTreeNode } from '@/types/lowcode'

function sortSiblings(nodes: PageNode[]): PageNode[] {
  return [...nodes].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
}

/** 平铺 nodes → 带 children 的树；孤儿节点跳过并 warn */
export function buildNodeTree(flatNodes: PageNode[]): PageNodeTreeNode[] {
  if (!flatNodes.length) return []

  const byId = new Map(flatNodes.map((node) => [node.id, node]))
  const childrenMap = new Map<number | 'root', PageNode[]>()

  for (const node of flatNodes) {
    if (node.parentId == null) {
      const roots = childrenMap.get('root') ?? []
      roots.push(node)
      childrenMap.set('root', roots)
      continue
    }

    if (!byId.has(node.parentId)) {
      console.warn(
        `[lowcode] orphan node skipped: id=${node.id}, parentId=${node.parentId}`
      )
      continue
    }

    const siblings = childrenMap.get(node.parentId) ?? []
    siblings.push(node)
    childrenMap.set(node.parentId, siblings)
  }

  function toTreeNode(node: PageNode): PageNodeTreeNode {
    const children = sortSiblings(childrenMap.get(node.id) ?? []).map(toTreeNode)
    return { ...node, children }
  }

  return sortSiblings(childrenMap.get('root') ?? []).map(toTreeNode)
}

/** 取第一个根节点；多根时 warn */
export function pickRootNode(flatNodes: PageNode[]): PageNodeTreeNode | null {
  const roots = buildNodeTree(flatNodes)
  if (roots.length > 1) {
    console.warn('[lowcode] multiple root nodes:', roots.map((node) => node.id))
  }
  return roots[0] ?? null
}
