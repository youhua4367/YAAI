import request from '@/utils/request'
import type { Result } from '@/types/result'
import type { PageNodeTreeResult } from '@/types/lowcode'

/** 页面版本节点树 `GET /page-versions/{versionId}/node-tree` */
export function fetchPageNodeTree(
  versionId: number
): Promise<Result<PageNodeTreeResult>> {
  return request.get(`/page-versions/${versionId}/node-tree`)
}
