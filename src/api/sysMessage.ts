import request from '@/utils/request'
import type { Result } from '@/types/result'
import type { IPage } from '@/types/page'
import type { SysMessageVO } from '@/types/userCenter'

/**
 * 当前用户系统消息分页（后端从登录态取 userId）
 * `GET /sys-message/queryByUserId?current=&size=`
 */
export function getSysMessagePage(params: {
  current?: number
  size?: number
}): Promise<Result<IPage<SysMessageVO>>> {
  return request.get('/sys-message/queryByUserId', {
    params: { current: params.current ?? 1, size: params.size ?? 10 }
  })
}

/** `POST /sys-message/markAsRead?messageId=` */
export function markSysMessageRead(messageId: number): Promise<Result<void>> {
  return request.post('/sys-message/markAsRead', null, { params: { messageId } })
}

/** `GET /sys-message/getUnreadCount` → `data` 为数字 */
export function getSysMessageUnreadCount(): Promise<Result<number>> {
  return request.get('/sys-message/getUnreadCount')
}
