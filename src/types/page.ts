/** 与后端 `IPage<T>` / 文档分页结构一致（如 `GET /sys-message/queryByUserId`） */
export interface IPage<T> {
  records: T[]
  total: number
  size: number
  current: number
  pages: number
}
