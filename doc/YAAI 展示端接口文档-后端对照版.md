# YAAI 展示端接口文档（与后端源码对照）

> **字段级请求/响应说明以同目录 `YAAI 展示端接口文档.md` 为准**（含 TS 可用的完整属性名附录）；本文仅作路径与差异速查。  
> 本文档根据 `yaai-backend` 中 `cn.edu.ynu.controller` 下 Controller **实际映射**整理，供展示端 / 门户 / 管理端联调使用。  
> 与旧版长文档的主要差异：**无全局 `/api` 前缀**（文件上传模块除外）、**统一响应体字段类型与成功时文案**；**新闻 / 新闻分类 / 轮播 / 菜单 / 站点配置 / 页面与页面编辑器** 已改为 **REST 资源路径**（`/news`、`/news-categories`、`/banners`、`/menus`、`/site-configs`、`/pages` 等），旧版 `queryById`、`queryAll` 式路径已移除。  
> 最后更新时间：2026-05-08

---

## 0. 环境与路径说明

| 项目 | 说明 |
|------|------|
| 默认端口 | `server.port` 在 `application.yml` 中为 **9876**（无 `context-path` 时为根路径 `/`） |
| 接口前缀 | 绝大多数 Controller 映射为 **`/news`、`/member/`、`/banners`、`/menus` 等**，**不带 `/api`** |
| 例外 | `FileController` 使用前缀 **`/api`**（上传、删除、静态文件代理访问） |
| 联调提示 | 若生产环境经 **Nginx / 网关** 统一加了 `/api` 前缀，请在网关层拼接；**以后端实际部署 URL 为准** |
| OpenAPI | `springdoc`：`/v3/api-docs`；Knife4j 已开启 |

---

## 目录

1. [统一响应格式](#1-统一响应格式)
2. [认证与会员](#2-认证与会员-member)
3. [用户](#3-用户-user)
4. [新闻资讯](#4-新闻资讯-news)
5. [新闻分类](#5-新闻分类-newscategory)
6. [轮播图](#6-轮播图-banner)
7. [专业委员会](#7-专业委员会-committee)
8. [委员会成员](#8-委员会成员-committee-member)
9. [会员类别](#9-会员类别-category)
10. [页面、版本、模板与节点](#10-页面版本模板与节点)
11. [菜单](#11-菜单-menus)
12. [站点配置](#12-站点配置-site-configs)
13. [个人会员档案](#13-个人会员档案-member-single--member-education--member-work-experience)
14. [订单与支付](#14-订单与支付-member)
15. [系统消息](#15-系统消息-sys-message)
16. [会员关注委员会](#16-会员关注委员会-member-interest)
17. [评审类型](#17-评审类型-review-type)
18. [会员评审关联](#18-会员评审关联-member-review)
19. [角色与权限](#19-角色与权限-role--permission)
20. [会员角色](#20-会员角色-member-role)
21. [操作日志](#21-操作日志-log)
22. [文件上传与静态访问](#22-文件上传与静态访问-api)

---

## 1. 统一响应格式

后端统一包装类：`cn.edu.ynu.common.entity.Result<T>`。

| 字段名 | 类型 | 说明 |
|--------|------|------|
| code | String | 成功时为枚举名 **`SUCCESS`**；失败时为业务错误码字符串（如 `INCORRECT_VERIFICATION_CODE`） |
| success | Boolean | `true` / `false` |
| message | String | 成功时当前实现为 **`SUCCESS`**（与 `code` 相同）；失败时为错误描述文案 |
| data | 泛型 T | 业务数据，可能为 `null` |

#### 成功示例

```json
{
  "code": "SUCCESS",
  "success": true,
  "message": "SUCCESS",
  "data": {}
}
```

#### 失败示例（示意）

```json
{
  "code": "INCORRECT_PASSWORD",
  "success": false,
  "message": "密码错误",
  "data": null
}
```

**前端注意**：不要假设 `code` 为数字 `200`；应使用 **`success === true`** 或 **`code === "SUCCESS"`** 判断成功（与门户 `request` 拦截器保持一致）。

MyBatis-Plus 分页 `IPage` 在 JSON 中通常包含：`records`、`total`、`size`、`current`、`pages`。

---

## 2. 认证与会员 (`/member/`)

类：`MemberController`，类上 `@RequestMapping("/member/")`（注意末尾 `/`）。

### 2.1 用户注册

**接口路径**: `POST /member/register`  
**Content-Type**: `application/json`

#### 请求体 `RegisterRequest`

| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| username | String | ✅ | 最大 50 字符 |
| phone | String | ✅ | `^1[3-9]\d{9}$` |
| email | String | ✅ | 邮箱格式 |
| password | String | ✅ | 8–32 位，须含字母与数字 |
| confirmPassword | String | ✅ | 须与 password 一致（服务端会校验） |
| code | String | ✅ | 邮箱验证码 |
| acceptAgreement | Boolean | ✅ | 须为 `true` |

### 2.2 用户登录

**接口路径**: `POST /member/login`  
**Content-Type**: `application/json`

#### 请求体 `LoginRequest`

| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| phone | String | ❌ | 与 email 至少填一个（服务端校验） |
| email | String | ❌ | 与 phone 至少填一个 |
| password | String | ✅ | 密码 |

成功时返回 `Result.success()`（`data` 为 `null`），登录态由 **Sa-Token** 写入（token 名：`yaai`，见 `application.yml`）。

### 2.3 用户登出

**接口路径**: `POST /member/logout`  
无请求体。

### 2.4 发送验证码

**接口路径**: `POST /member/sendCode`  
**Content-Type**: `application/x-www-form-urlencoded` 或带 `email` 查询参数（方法为 `@RequestParam String email`）

| 参数 | 类型 | 必填 |
|------|------|------|
| email | String | ✅ |

### 2.5 个人会员申请

**接口路径**: `POST /member/apply/single`  
**Content-Type**: `application/json`  
**请求体**: `SingleMemberApplyRequest`（字段较多，与旧文档结构类似，以源码及校验注解为准）

### 2.6 单位会员申请

**接口路径**: `POST /member/apply/company`  
**Content-Type**: `application/json`  
**请求体**: `CompanyMemberApplyRequest`

### 2.7 取消申请

**接口路径**: `POST /member/cancel/apply`  

| 参数 | 类型 | 必填 |
|------|------|------|
| memberId | Long | ✅ |

### 2.8 管理端：待审核列表（分页）

| 接口 | 方法 | 路径 |
|------|------|------|
| 待审核个人会员 | GET | `/member/audit/single/list?current=1&size=10` |
| 待审核单位会员 | GET | `/member/audit/company/list?current=1&size=10` |

返回 `data` 为 `IPage<SingleMemberAuditVO>` / `IPage<CompanyMemberAuditVO>`。

### 2.9 管理端：审核

| 接口 | 方法 | 路径 | 参数 |
|------|------|------|------|
| 审核通过 | POST | `/member/audit/pass` | `memberId` |
| 审核不通过 | POST | `/member/audit/reject` | `memberId` |

### 2.10 订单与支付（见第 14 节）

---

## 3. 用户 (`/user`)

类：`UserController`。

> **说明**：后端 **不存在** 旧文档中的 `PUT /api/user/update`；用户更新需扩展接口或由其他模块实现。

| 接口 | 方法 | 路径 | 说明 |
|------|------|------|------|
| 查询所有用户名 | GET | `/user/queryAllUsernames` | 返回 `List<String>` |
| 根据 ID 查询用户 | GET | `/user/queryById?id=` | 返回 `UserDetailVO`（无密码） |
| 删除用户 | POST | `/user/deleteById?id=` | 管理端 |

---

## 4. 新闻资讯 (`/news`)

类：`NewsController`，`@RequestMapping("/news")`。

实体 `News`：`publishTime`、`status`（**Boolean**）、`summary`、`coverImage`、`source`、`author`、`isTop`、`viewCount` 等。

| 接口 | 方法 | 路径 | 说明 |
|------|------|------|------|
| 分页列表 | GET | `/news` | Query：`current`、`size`、`categoryId`、`title`、`status`、`isTop`；`data` 为 **`IPage<News>`** |
| 详情 | GET | `/news/{id}` | **先 `incrementViewCount` 再返回实体** |
| 新建 | POST | `/news` | Body: `News` |
| 更新 | PUT | `/news/{id}` | Body: `News` |
| 删除 | DELETE | `/news/{id}` | `data` 为 `Long` |

---

## 5. 新闻分类 (`/news-categories`)

类：`NewsCategoryController`，`@RequestMapping("/news-categories")`。

| 接口 | 方法 | 路径 | 说明 |
|------|------|------|------|
| 列表 | GET | `/news-categories` | Query：`name`、`code`、`status`；`data` 为 **`{ items, total }`** |
| 详情 | GET | `/news-categories/{id}` | |
| 新建 | POST | `/news-categories` | Body: `NewsCategory` |
| 更新 | PUT | `/news-categories/{id}` | |
| 删除 | DELETE | `/news-categories/{id}` | |

---

## 6. 轮播图 (`/banners`)

类：`BannerController`，`@RequestMapping("/banners")`。

| 接口 | 方法 | 路径 | 说明 |
|------|------|------|------|
| 列表 | GET | `/banners` | Query：`groupCode`、`status`；`data` 为 **`{ items, total }`** |
| 当前有效 | GET | `/banners/active/{groupCode}` | `data` 为 `List<Banner>` |
| 详情 | GET | `/banners/{id}` | |
| 新建 | POST | `/banners` | |
| 更新 | PUT | `/banners/{id}` | |
| 删除 | DELETE | `/banners/{id}` | |

---

## 7. 专业委员会 (`/committee`)

类：`CommitteeController`。

| 接口 | 方法 | 路径 | 说明 |
|------|------|------|------|
| 仅名称列表 | GET | `/committee/queryAllNames` | `List<String>` |
| 全部详情 | GET | `/committee/queryAll` | `List<Committee>` |
| 按 ID | GET | `/committee/queryById?id=` | |
| 新增 | POST | `/committee/insert` | Body: `CommitteeInsertRequest` |
| 更新 | POST | `/committee/update` | Body: `CommitteeUpdateRequest` |
| 删除 | POST | `/committee/deleteById?id=` | |

实体 `Committee`：`name`、`category`、`description`、`establishedDate`、`chairmanId`、`status`、`createdAt`、`updatedAt`。

---

## 8. 委员会成员 (`/committee-member`)

类：`CommitteeMemberController`。

| 接口 | 方法 | 路径 |
|------|------|------|
| 按会员 ID 查询 | GET | `/committee-member/queryByMemberId?memberId=` | 返回 `CommitteeMemberVO`；无记录时服务端抛业务异常 |
| 按委员会 ID 列表 | GET | `/committee-member/queryByCommitteeId?committeeId=` | `List<CommitteeMemberVO>` |
| 新增 | POST | `/committee-member/insert` | Body: `CommitteeMemberInsertRequest` |
| 按记录 ID 更新 | POST | `/committee-member/updateById` | Body: `CommitteeMemberUpdateRequest` |
| 按记录 ID 删除 | POST | `/committee-member/deleteById?id=` |
| 按会员 ID 删除关联 | POST | `/committee-member/deleteByMemberId?memberId=` |

---

## 9. 会员类别 (`/category`)

类：`MemberCategoryController`（非 `/memberCategory`）。

| 接口 | 方法 | 路径 |
|------|------|------|
| 查询全部 | GET | `/category/queryAll` |
| 按 ID | GET | `/category/queryById?id=` |
| 按 type 查名称列表 | GET | `/category/queryNamesByType?type=` | 返回 `List<String>` |
| 新增 | POST | `/category/insert` | Body: `MemberCategoryInsertRequest` |
| 更新 | POST | `/category/updateById` | Body: `MemberCategoryUpdateRequest` |
| 删除 | POST | `/category/deleteById?id=` |

实体 `MemberCategory`：`name`、`type`、`sortOrder`、`annualFee` 等。

---

## 10. 页面、版本、模板与节点

旧版 **`PageController` / `PageBlockController`（`/page`、`/pageBlock`）已移除**，由下列控制器替代（详见主文档第 8 节）。

| 类 | 基路径 | 摘要 |
|----|--------|------|
| `PagesController` | `/pages` | CRUD；`GET /pages/{id}/current-version` |
| `PageVersionController` | `/pages/{pageId}/versions` | 版本 CRUD、`from-template`、`publish`、`lock`、`unlock`、`clone` |
| `PageTemplateController` | `/page-templates` | 模板 CRUD |
| `ReusableFragmentController` | `/reusable-fragments` | 片段 CRUD |
| `PageNodeController` | （无前缀） | `GET/PUT .../node-tree`；`POST/PUT/DELETE .../page-nodes/...` |
| `ComponentDefController` | `/component-defs` | CRUD；**启停** `DELETE /{id}/status?status=` |
| `DataBindingController` | `/data-bindings` | CRUD；`POST /{id}/preview` |

实体 **`Pages`** 含 **`currentVersionId`**；布局内容由 **`PageNode`** 树挂在版本 / 模板 / 片段上。

---

## 11. 菜单 (`/menus`)

类：`MenuController`，`@RequestMapping("/menus")`。实体 `Menu`：`parentId`、`name`、`code`、`urlType`、`pageId`、`externalUrl`、`sortOrder`、`status` 等。

| 接口 | 方法 | 路径 |
|------|------|------|
| 列表 | GET | `/menus` | `data`：`{ items, total }` |
| 详情 | GET | `/menus/{id}` | |
| 新建 | POST | `/menus` | |
| 更新 | PUT | `/menus/{id}` | |
| 移动 | POST | `/menus/{id}/move` | Body：`MenuMoveRequest` |
| 删除 | DELETE | `/menus/{id}` | |

---

## 12. 站点配置 (`/site-configs`)

类：`SiteConfigController`，`@RequestMapping("/site-configs")`。

| 接口 | 方法 | 路径 |
|------|------|------|
| 全部 | GET | `/site-configs` | `data`：`{ items, total }` |
| 仅值 | GET | `/site-configs/value/{configKey}` | `data`：`String` |
| 按 ID | GET | `/site-configs/{id}` | |
| 新建 | POST | `/site-configs` | |
| 更新 | PUT | `/site-configs/{id}` | |
| 删除 | DELETE | `/site-configs/{id}` | |
| 批量 | PUT | `/site-configs/batch` | Body：`Map<String,String>` |

---

## 13. 个人会员档案 (`/member-single`、`/member-education`、`/member-work-experience`)

### 13.1 `MemberSingleController` → `/member-single`

| 接口 | 方法 | 路径 |
|------|------|------|
| 新增 | POST | `/member-single/insert` | Body: `MemberSingleInsertRequest` |
| 按会员 ID 查询 | GET | `/member-single/queryByMemberId?memberId=` | `MemberSingleVO` |
| 按记录 ID 查询 | GET | `/member-single/queryById?id=` | |
| 更新 | POST | `/member-single/updateById` | Body: `MemberSingleUpdateRequest`（**非 PUT**） |
| 删除 | POST | `/member-single/deleteById?id=`、`/deleteByMemberId?memberId=` |

### 13.2 `MemberEducationController` → `/member-education`

| 接口 | 方法 | 路径 |
|------|------|------|
| 新增 | POST | `/member-education/insert` | Body: `MemberEducationInsertRequest` |
| 列表 / 单条 | GET | `/member-education/queryByMemberId`、`/queryById` |
| 更新 | POST | `/member-education/updateById` | Body: `MemberEducationUpdateRequest`（**非 PUT /update**） |
| 删除 | POST | `/member-education/deleteById`、`/deleteByMemberId` |

返回 VO 含 `createdAt`、`updatedAt` 等。

### 13.3 `MemberWorkExperienceController` → `/member-work-experience`

| 接口 | 方法 | 路径 |
|------|------|------|
| 新增 | POST | `/member-work-experience/insert` | Body: `MemberWorkExperienceInsertRequest` |
| 列表 / 单条 | GET | `/member-work-experience/queryByMemberId`、`/queryById` |
| 更新 | POST | `/member-work-experience/updateById` | Body: `MemberWorkExperienceUpdateRequest` |
| 删除 | POST | `/member-work-experience/deleteById`、`/deleteByMemberId` |

---

## 14. 订单与支付 (`/member/`)

类：`MemberController` 中订单相关方法。

| 接口 | 方法 | 路径 | 说明 |
|------|------|------|------|
| 创建缴费订单 | POST | `/member/payment/create` | 参数：`memberId`、`paymentMethod`；`data` 为 `OrderCreateVO`（含 `order`、`payUrl`、`amount`、`categoryName`） |
| 订单列表 | GET | `/member/order/list?memberId=` | `List<OrderVO>` |
| 按商户订单号查询 | GET | **`/member/order/detail?outTradeNo=`** | **注意：不是** `queryByOutTradeNo` |
| 支付回调（模拟） | POST | `/member/payment/callback` | 参数：`outTradeNo`、`transactionId` |

`OrderVO` 中 `status` 类型为枚举 `OrderStatus`（JSON 中一般为字符串或对象，依序列化配置而定）。

---

## 15. 系统消息 (`/sys-message`)

类：`SysMessageController`。  
**依赖登录**：`queryByUserId`、`getUnreadCount` 使用 `StpUtil.getLoginIdAsLong()` 取当前用户。

| 接口 | 方法 | 路径 |
|------|------|------|
| 分页消息列表 | GET | `/sys-message/queryByUserId?current=1&size=10` | `data` 为 `IPage<SysMessage>` |
| 标记已读 | POST | `/sys-message/markAsRead?messageId=` |
| 未读数量 | GET | `/sys-message/getUnreadCount` | `data` 为 `Long` |

实体 `SysMessage`：`userId`、`messageType`、`messageContent`、`status`（`unread`/`read`）、时间字段。

---

## 16. 会员关注委员会 (`/member-interest`)

类：`MemberInterestController`。

| 接口 | 方法 | 路径 |
|------|------|------|
| 批量添加关注 | POST | `/member-interest/add` | Body: `MemberInterestAddRequest`（`memberId`、`committeeIds`） |
| 查询关注的委员会 ID | GET | `/member-interest/queryCommitteeIds?memberId=` | `List<Long>` |
| 取消单项 | POST | `/member-interest/deleteInterest?memberId=&committeeId=` |
| 清空 | POST | `/member-interest/deleteAll?memberId=` |

---

## 17. 评审类型 (`/review-type`)

类：`ReviewTypeController`。

| 接口 | 方法 | 路径 |
|------|------|------|
| 查询所有 | GET | `/review-type/queryAll` | `List<ReviewTypeVO>` |
| 按 ID / code | GET | `/review-type/queryById`、`/queryByCode` | |
| 新增 | POST | `/review-type/insert` | Body: `ReviewTypeInsertRequest` |
| 更新 | POST | `/review-type/updateById` | Body: `ReviewTypeUpdateRequest` |
| 删除 | POST | `/review-type/deleteById?id=` | |

---

## 18. 会员评审关联 (`/member-review`)

类：`MemberReviewController`。

| 接口 | 方法 | 路径 |
|------|------|------|
| 批量添加 | POST | `/member-review/add` | Body: `MemberReviewAddRequest`（`memberId`、`typeIds`） |
| 查询类型 ID 列表 | GET | `/member-review/queryTypeIds?memberId=` | `List<Long>` |
| 删除单项 | POST | `/member-review/deleteReviewType?memberId=&typeId=` |
| 清空 | POST | `/member-review/deleteAll?memberId=` | |

---

## 19. 角色与权限 (`/role`、`/permission/`)

### 19.1 `RoleController` → `/role`

| 接口 | 方法 | 路径 |
|------|------|------|
| 查询所有角色 | GET | `/role/queryAll` | `List<Role>` |
| 角色详情（含权限） | GET | `/role/queryById?id=` | `RoleDetailVO` |
| 新增 / 更新 / 删除 | POST | `/role/insert`、`/update`、`/delete?id=` | |

### 19.2 `PermissionController` → `/permission/`

类上为 `@RequestMapping("/permission/")`（**带尾部斜杠**）。

| 接口 | 方法 | 路径 |
|------|------|------|
| 查询所有 | GET | `/permission/queryAll` |
| 按 ID | GET | `/permission/queryById?id=` | `PermissionVO` |
| 新增 | POST | `/permission/insert` | Body: `PermissionInsertRequest` |
| 更新 | POST | `/permission/updateById` | Body: `PermissionUpdateRequest` |
| 删除 | POST | `/permission/deleteById?id=` | |

---

## 20. 会员角色 (`/member-role`)

类：`MemberRoleController`。

| 接口 | 方法 | 路径 |
|------|------|------|
| 分配角色 | POST | `/member-role/assign` | Body: `MemberRoleAssignRequest` |
| 查询角色 ID 列表 | GET | `/member-role/queryRoleIds?memberId=` | `List<Long>` |
| 删除单项 | POST | `/member-role/deleteRole?memberId=&roleId=` |
| 清空 | POST | `/member-role/deleteAll?memberId=` | |

---

## 21. 操作日志 (`/log`)

类：`LogController`。

| 接口 | 方法 | 路径 |
|------|------|------|
| 查询所有 | GET | `/log/queryAll` | `List<OperationLog>` |
| 按 ID | GET | `/log/queryById?id=` | |
| 删除 | POST | `/log/delete?id=` | |

---

## 22. 文件上传与静态访问 (`/api`)

类：`FileController`，**仅此模块使用 `/api` 前缀**。

| 接口 | 方法 | 路径 | 说明 |
|------|------|------|------|
| 上传 | POST | **`/api/upload`** | `multipart/form-data`：`file`、`type`（场景，如 `user-photos`）；`data` 为文件访问 URL 字符串 |
| 访问文件 | GET | **`/api/static/{scene}/**`** | 通过代理映射到存储；`scene` 为路径段 |
| 删除 | DELETE | **`/api/delete?fileUrl=`** | `data` 为 `Boolean` 或错误信息 |

静态 URL 与 `application.yml` 中 `app.storage.*.url-prefix`（如 `/static/avatars/`）及上传返回路径需一并核对。

---

## 附录：与旧版文档对照摘要

| 旧文档 | 后端实际 |
|--------|----------|
| 统一加 `/api/...` | 仅 `/api/upload`、`/api/static/...`、`/api/delete`；其余多为根路径 |
| `code` 为 200 | `code` 为字符串，`SUCCESS` 或业务错误码 |
| `message` 为「操作成功」 | 成功时多为 `"SUCCESS"`（与 `Result.success` 实现一致） |
| `PUT /api/user/update` | **不存在** |
| `GET .../order/queryByOutTradeNo` | **`GET /member/order/detail?outTradeNo=`** |
| `PUT .../member-education/update` 等 | **`POST .../updateById`** |
| 新闻 `publishDate`、`status` 字符串 | **`publishTime`**、`status` **Boolean** |
| 菜单 `path`、`icon` | 实体为 **`urlType`、`pageId`、`externalUrl`、`code`** 等 |
| 站点配置 `configType` | 实体 **无该字段** |
| 会员类别路径 | **`/category`** |
| 新闻列表 `/news/queryPublished` 等 | **`GET /news`** 分页 + Query |
| 新闻分类 `/newsCategory/...` | **`/news-categories`** REST |
| 轮播 `/banner/...` | **`/banners`** REST |
| 菜单 `/menu/...` | **`/menus`** REST |
| 站点配置 `/siteConfig/...` | **`/site-configs`** REST |
| 页面 `/page`、`/pageBlock` | **`/pages`、版本、模板、`PageNode` 等**（见第 10 节） |

---

*文档生成依据：`yaai-backend` 源码树 `src/main/java/cn/edu/ynu/controller` 与 `common.entity.Result`、主要实体类。*
