/** 区块标题：优先 node-tree 的 nodeName，其次 propsJson.title */
export function resolveSectionTitle(
  nodeName?: string | null,
  title?: string | null
): string {
  return nodeName?.trim() || title?.trim() || ''
}
