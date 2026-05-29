/** `GET /page-versions/{versionId}/node-tree` 节点（camelCase） */
export interface PageNode {
  id: number
  pageVersionId?: number | null
  templateId?: number | null
  fragmentId?: number | null
  parentId: number | null
  nodeType: 'container' | 'component' | string
  componentKey: string | null
  nodeName?: string | null
  slotName?: string | null
  sortOrder?: number | null
  depth?: number | null
  colSpan?: number | null
  rowSpan?: number | null
  dataBindingId?: number | null
  propsJson: string | null
  styleJson: string | null
  layoutJson: string | null
  eventJson?: string | null
  visibleRuleJson?: string | null
  status?: boolean
}

export interface PageVersionMeta {
  id: number
  pageId: number
  versionNo?: number | null
  status?: 'draft' | 'published' | string
}

/** envelope 内 `page_version` 键为 snake_case */
export interface PageNodeTreeResult {
  nodes: PageNode[]
  page_version?: PageVersionMeta
}

export interface PageNodeTreeNode extends PageNode {
  children: PageNodeTreeNode[]
}
