# YAAI 展示端接口文档（含请求/响应字段 · 与后端一致）

> 本文档为展示端 / 门户 / 管理端联调用，**字段名与后端 Java Bean JSON 序列化结果一致**（默认驼峰，与 `cn.edu.ynu` 下实体、VO、Request 一致）。  
> **路径以当前后端源码为准**：多数接口**无** `/api` 前缀；仅文件模块为 `/api/...`。默认端口 **9876**，无 `context-path` 时从根路径访问。  
> **CMS / 内容资源**（新闻、分类、轮播、菜单、站点配置、页面与页面编辑）已改为 **REST 风格**（如 `GET /news`、`GET /news/{id}`、`/news-categories`、`/banners`、`/menus`、`/site-configs`、`/pages` 等）；旧版 `/news/queryById`、`/page/queryAll` 等**动词式路径已移除**。  
> 以后以此文件（`YNAI/doc` 下）为主维护。  
> 最后更新时间：2026-05-08

---

## 目录

- [通用说明](#通用说明)
- [数据结构附录](#数据结构附录)（前端写 TS 类型请对照此节）
- [1. 认证与会员](#1-认证与会员)
- [2. 用户](#2-用户)
- [3. 新闻资讯](#3-新闻资讯)
- [4. 新闻分类](#4-新闻分类)
- [5. 轮播图](#5-轮播图)
- [6. 专业委员会与成员](#6-专业委员会与成员)
- [7. 会员类别](#7-会员类别)
- [8. 页面、版本、模板与节点（页面编辑器）](#8-页面版本模板与节点页面编辑器)
- [9. 菜单](#9-菜单)
- [10. 站点配置](#10-站点配置)
- [11. 个人会员档案](#11-个人会员档案)
- [12. 订单与支付](#12-订单与支付)
- [13. 系统消息](#13-系统消息)
- [14. 会员关注 / 评审 / 角色](#14-会员关注--评审--角色)
- [15. 角色与权限（管理）](#15-角色与权限管理)
- [16. 操作日志](#16-操作日志)
- [17. 文件上传](#17-文件上传)

---

## 通用说明

### 统一响应 `Result<T>`

| 字段名 | JSON 类型 | 说明 |
|--------|-----------|------|
| code | string | 成功为 `SUCCESS`；失败为业务错误码，如 `INCORRECT_PASSWORD` |
| success | boolean | 是否成功 |
| message | string | 成功时多为 `SUCCESS`；失败为错误描述 |
| data | 任意 | 业务数据；无则为 `null` |

成功示例：

```json
{
  "code": "SUCCESS",
  "success": true,
  "message": "SUCCESS",
  "data": null
}
```

### 分页 `IPage<T>`（MyBatis-Plus）

`data` 为对象时常见字段：

| 字段名 | 类型 | 说明 |
|--------|------|------|
| records | array | 当前页数据 |
| total | number | 总条数 |
| size | number | 每页条数 |
| current | number | 当前页 |
| pages | number | 总页数 |

### 日期时间

- `LocalDate` → JSON 字符串，如 `"2026-05-08"`
- `LocalDateTime` → JSON 字符串，如 `"2026-05-08T10:30:00"`（具体格式以前端收到的为准）

### 订单状态枚举 `OrderStatus`

序列化名一般为枚举常量名：`UNPAID`、`PAID`、`CANCELLED`（若与前端不一致，以实际响应为准）。

### 前端 TypeScript 对接（推荐）

HTTP 响应体（axios 的 `response.data`）根结构固定为：

```ts
interface Result<T> {
  code: string;       // 成功多为 "SUCCESS"
  success: boolean;
  message: string;    // 成功多为 "SUCCESS"
  data: T;            // 业务数据；无内容时为 null
}
```

**从第 3 节起**，每个业务模块都附有 **完整 JSON 示例**（含 `code/success/message/data`），`data` 内字段名与后端序列化一致，可直接抄写成 `interface NewsCategory { ... }` 再写成 `Result<NewsCategory[]>` 等。

---

## 数据结构附录

以下表可直接映射为 TypeScript `interface` / `type`，**属性名请勿改写**。

### `News`

| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | number | 主键 |
| categoryId | number | 分类 ID |
| title | string | 标题 |
| summary | string \| null | 摘要 |
| content | string \| null | 正文 |
| coverImage | string \| null | 封面图 URL |
| publishTime | string \| null | 发布时间（ISO 日期时间） |
| source | string \| null | 来源 |
| author | string \| null | 作者 |
| status | boolean | `true` 已发布，`false` 草稿/隐藏 |
| isTop | boolean | 是否置顶 |
| viewCount | number \| null | 浏览量 |
| createdAt | string \| null | 创建时间 |
| updatedAt | string \| null | 更新时间 |

### `NewsCategory`

| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | number | 主键 |
| parentId | number \| null | 父分类 ID |
| name | string | 名称 |
| code | string | 编码 |
| sortOrder | number \| null | 排序 |
| status | boolean | 是否启用 |
| createdAt | string \| null | |
| updatedAt | string \| null | |

### `Banner`

| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | number | |
| groupCode | string | 分组编码 |
| title | string \| null | 标题 |
| subtitle | string \| null | 副标题 |
| imageUrl | string \| null | 图片 URL |
| linkUrl | string \| null | 跳转链接 |
| sortOrder | number \| null | 排序 |
| status | boolean | 是否启用 |
| startTime | string \| null | 生效开始 |
| endTime | string \| null | 生效结束 |
| createdAt | string \| null | |
| updatedAt | string \| null | |

### `Committee`

| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | number | |
| name | string | 委员会名称 |
| category | string \| null | 委员会分类 |
| description | string \| null | 简介 |
| establishedDate | string \| null | 成立日期（日期） |
| chairmanId | number \| null | 主任委员用户/会员 ID（冗余） |
| status | boolean | 是否启用 |
| createdAt | string \| null | |
| updatedAt | string \| null | |

### `CommitteeMemberVO`

| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | number | 关联记录 ID |
| memberId | number | 会员 ID |
| memberName | string \| null | 会员姓名（部分接口可能未填充） |
| committeeId | number | 委员会 ID |
| committeeName | string \| null | 委员会名称（部分接口可能未填充） |
| role | string \| null | 在委员会中角色 |
| joinedAt | string \| null | 加入日期 |
| status | string \| null | 任职状态 |
| resignDate | string \| null | 卸任日期 |
| createdAt | string \| null | |
| updatedAt | string \| null | |

### `Page`

| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | number | |
| name | string \| null | 后台页面名称 |
| code | string \| null | 后台编码 |
| path | string \| null | 前台路径 |
| pageType | string \| null | 页面类型 |
| title | string \| null | 页面标题 |
| currentVersionId | number \| null | 当前发布版本 ID（`page_version.id`） |
| seoTitle | string \| null | |
| seoKeywords | string \| null | |
| seoDescription | string \| null | |
| status | boolean | 是否启用 |
| createdAt | string \| null | |
| updatedAt | string \| null | |

> 后端实体类名为 `Pages`，JSON 字段名与上表一致。

### `PageVersion`

| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | number | 版本主键 |
| pageId | number | 所属页面 ID |
| versionNo | number \| null | 版本号 |
| versionName | string \| null | 版本名称 |
| sourceType | string \| null | 来源类型（如 template） |
| sourceId | number \| null | 来源模板或来源版本 ID |
| status | string \| null | `draft` / `published` / `archived` |
| isLocked | boolean \| null | 是否锁定 |
| remark | string \| null | 备注 |
| createdBy | string \| null | 创建人 |
| createdAt | string \| null | |
| updatedAt | string \| null | |

### `PageNode`（替代旧版「页面模块 PageBlock」的树形节点）

| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | number | |
| pageVersionId | number \| null | 所属页面版本（版本树节点） |
| templateId | number \| null | 所属模板（模板树节点） |
| fragmentId | number \| null | 所属可复用片段 |
| parentId | number \| null | 父节点 |
| nodeType | string \| null | 如 `component` |
| componentKey | string \| null | 组件键 |
| nodeName | string \| null | 节点名称 |
| slotName | string \| null | 插槽名 |
| sortOrder | number \| null | 同层排序 |
| depth | number \| null | 深度 |
| colSpan | number \| null | 列占比 |
| rowSpan | number \| null | 行占比 |
| dataBindingId | number \| null | 数据绑定 ID |
| refFragmentId | number \| null | 引用片段 ID |
| propsJson | string \| null | 业务属性 JSON |
| styleJson | string \| null | 样式 JSON |
| layoutJson | string \| null | 布局 JSON |
| eventJson | string \| null | 事件 JSON |
| visibleRuleJson | string \| null | 显示规则 JSON |
| status | boolean \| null | |
| remark | string \| null | |
| createdAt | string \| null | |
| updatedAt | string \| null | |

### `PageBlock`（**已废弃**，无对应 Controller）

旧版「按区域拉模块」模型已由 **`PageNode` 节点树** + 版本/模板/片段替代；联调请以第 8 节 REST 路径为准。

### `PageSection`（库表实体，**当前无** `/pageSection` 接口）

| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | number | 区域 ID（历史库表；新编辑器以 `PageNode` 为准） |
| pageId | number | 所属页面 ID |
| sectionCode | string \| null | 区域编码 |
| sectionName | string \| null | 区域名称 |
| layoutType | string \| null | 布局类型 |
| columns | number \| null | 默认列数 |
| sortOrder | number \| null | 顺序 |
| status | boolean | |
| propsJson | string \| null | 区域配置 JSON |
| createdAt | string \| null | |
| updatedAt | string \| null | |

### `Menu`

| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | number | |
| parentId | number \| null | 父菜单 ID |
| name | string \| null | 显示名称 |
| code | string \| null | 菜单编码 |
| urlType | string \| null | `page` / `external` 等 |
| pageId | number \| null | 站内页面 ID |
| externalUrl | string \| null | 外链 |
| sortOrder | number \| null | |
| status | boolean | 是否显示 |
| createdAt | string \| null | |
| updatedAt | string \| null | |

### `SiteConfig`

| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | number | |
| configKey | string | |
| configValue | string \| null | |
| remark | string \| null | |
| createdAt | string \| null | |
| updatedAt | string \| null | |

### `MemberCategory`

| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | number | |
| name | string | 类别名称 |
| type | string \| null | 大类：个人/单位等 |
| sortOrder | number \| null | |
| annualFee | number \| null | 年费（BigDecimal → number） |
| createdAt | string \| null | |
| updatedAt | string \| null | |

### `UserDetailVO`

| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | number | |
| username | string \| null | |
| phone | string \| null | |
| email | string \| null | |
| status | number \| null | 0 待申请，1 待缴费，2 已缴费 |
| createdAt | string \| null | |
| updatedAt | string \| null | |

### `MemberSingleVO`

| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | number | 个人档案记录 ID |
| name | string \| null | |
| gender | string \| null | |
| idCardType | string \| null | |
| idCardNumber | string \| null | |
| birthDate | string \| null | |
| country | string \| null | |
| nativePlace | string \| null | |
| nationality | string \| null | |
| politicalOutlook | string \| null | |
| address | string \| null | |
| postalCode | string \| null | |
| contactPhone | string \| null | |
| landlinePhone | string \| null | |
| email | string \| null | |
| img | string \| null | 照片 URL |
| jobTitle | string \| null | |
| industry | string \| null | |
| workUnit | string \| null | |
| workDepartment | string \| null | |
| position | string \| null | |
| workContent | string \| null | |
| highestEducation | string \| null | |
| major | string \| null | |
| researchDirection | string \| null | |
| publication | string \| null | |
| honors | string \| null | |
| projectExperience | string \| null | |
| recommender | string \| null | |
| other | string \| null | |
| memberId | number \| null | 关联会员 ID |
| areaCode | string \| null | 行政区划代码 |
| createdAt | string \| null | |
| updatedAt | string \| null | |

### `MemberEducationVO`

| 字段名 | 类型 |
|--------|------|
| id | number |
| memberId | number |
| degree | string |
| school | string |
| major | string |
| startDate | string \| null |
| endDate | string \| null |
| sortOrder | number \| null |
| createdAt | string \| null |
| updatedAt | string \| null |

### `MemberWorkExperienceVO`

| 字段名 | 类型 |
|--------|------|
| id | number |
| memberId | number |
| company | string |
| department | string \| null |
| jobTitle | string \| null |
| workContent | string \| null |
| startDate | string \| null |
| endDate | string \| null |
| status | string |
| sortOrder | number \| null |
| createdAt | string \| null |
| updatedAt | string \| null |

### `Order`（实体，嵌在 `OrderCreateVO` 等处）

| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | number \| null | |
| memberId | number \| null | |
| memberCategoryId | number \| null | |
| amount | number \| null | |
| outTradeNo | string \| null | 商户订单号 |
| date | string \| null | 订单日（日期） |
| paymentMethod | string \| null | 支付方式 |
| status | string | 见 [OrderStatus](#通用说明) |
| payUrl | string \| null | |
| expireTime | string \| null | |
| transactionId | string \| null | |
| closeReason | string \| null | |
| createdAt | string \| null | |
| paidAt | string \| null | |
| closedAt | string \| null | |
| updatedAt | string \| null | |

### `OrderVO`

在 `Order` 基础上，业务层 VO 另含：

| 字段名 | 类型 | 说明 |
|--------|------|------|
| expired | boolean \| null | 是否已过期 |

（其余字段同 `Order` 表，名称一致。）

### `OrderCreateVO`

| 字段名 | 类型 | 说明 |
|--------|------|------|
| order | object | 见 [`Order`](#order实体嵌在-ordercreatevo-等处) |
| payUrl | string \| null | 支付二维码 URL |
| amount | number \| null | 金额 |
| categoryName | string \| null | 会员类别名称 |

### `SysMessage`

| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | number | |
| userId | number | |
| messageType | string \| null | 如 `system` / `audit` / `payment` |
| messageContent | string \| null | |
| status | string \| null | `unread` / `read` |
| createdAt | string \| null | |
| updatedAt | string \| null | |

### `ReviewTypeVO`

| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | number | |
| name | string \| null | |
| code | string \| null | |
| sortOrder | number \| null | |
| status | boolean \| null | 启用/禁用 |
| createdAt | string \| null | |
| updatedAt | string \| null | |

### `Role`

| 字段名 | 类型 |
|--------|------|
| id | number |
| name | string \| null |
| code | string \| null |
| description | string \| null |
| sortOrder | number \| null |
| status | boolean \| null |
| createdAt | string \| null |
| updatedAt | string \| null |

### `Permission`

| 字段名 | 类型 |
|--------|------|
| id | number |
| name | string \| null |
| code | string \| null |
| module | string \| null |
| description | string \| null |
| createdAt | string \| null |

### `RoleDetailVO`

| 字段名 | 类型 | 说明 |
|--------|------|------|
| role | object | [`Role`](#role) |
| permissions | array | [`Permission`](#permission) 列表 |

### `PermissionVO`

与 `Permission` 字段相同（`id,name,code,module,description`），无 `createdAt` 在部分查询中可能裁剪，以响应为准。

### `MemberAttachmentVO`

| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | number \| null | |
| memberId | number \| null | |
| attachmentType | string \| null | `business_license` / `qualification` / `honor` / `other` 等 |
| fileUrl | string \| null | |
| fileName | string \| null | |
| sortOrder | number \| null | |
| createdAt | string \| null | |

### `SingleMemberAuditVO`

| 字段名 | 类型 | 说明 |
|--------|------|------|
| memberId | number | |
| type | string \| null | 会员类型 |
| memberNo | string \| null | 会员编号 |
| categoryId | number \| null | |
| joinMethod | string \| null | |
| auditStatus | string \| null | |
| membershipStatus | string \| null | |
| accountEmail | string \| null | |
| userId | number \| null | |
| createdAt | string \| null | |
| committeeId | number \| null | |
| committeeName | string \| null | |
| committeeRole | string \| null | |
| joinedAt | string \| null | |
| singleId | number \| null | 个人档案记录 ID |
| name | string \| null | |
| gender | string \| null | |
| idCardType | string \| null | |
| idCardNumber | string \| null | |
| birthDate | string \| null | |
| country | string \| null | |
| nativePlace | string \| null | |
| nationality | string \| null | |
| politicalOutlook | string \| null | |
| address | string \| null | |
| postalCode | string \| null | |
| contactPhone | string \| null | |
| landlinePhone | string \| null | |
| email | string \| null | |
| img | string \| null | |
| jobTitle | string \| null | |
| industry | string \| null | |
| workUnit | string \| null | |
| workDepartment | string \| null | |
| position | string \| null | |
| workContent | string \| null | |
| highestEducation | string \| null | |
| major | string \| null | |
| researchDirection | string \| null | |
| publication | string \| null | |
| honors | string \| null | |
| projectExperience | string \| null | |
| areaCode | string \| null | |
| recommender | string \| null | |
| other | string \| null | |
| educationList | array | [`MemberEducationVO`](#membereducationvo)[] |
| workExperienceList | array | [`MemberWorkExperienceVO`](#memberworkexperiencevo)[] |
| interestCommitteeNames | array | string[] |
| reviewTypeNames | array | string[] |

### `CompanyMemberAuditVO`

除与 `SingleMemberAuditVO` 相同的会员/委员会头段外，另含：

| 字段名 | 类型 |
|--------|------|
| unitId | number \| null |
| unitName | string \| null |
| unitCategory | string \| null |
| industry | string \| null |
| areaCode | string \| null |
| address | string \| null |
| postalCode | string \| null |
| website | string \| null |
| establishedDate | string \| null |
| registeredCapital | number \| null |
| financingRound | string \| null |
| legalRepresentative | string \| null |
| unifiedSocialCreditCode | string \| null |
| businessScope | string \| null |
| unitIntro | string \| null |
| aiIndustryIntro | string \| null |
| leaderName | string \| null |
| leaderTitle | string \| null |
| leaderPhone | string \| null |
| leaderEmail | string \| null |
| contactName | string \| null |
| contactDept | string \| null |
| contactOfficePhone | string \| null |
| contactMobile | string \| null |
| contactEmail | string \| null |
| contactGender | string \| null |
| contactTitle | string \| null |
| contactJobTitle | string \| null |
| contactFax | string \| null |
| totalEmployees | number \| null |
| otherSocieties | string \| null |
| suggestions | string \| null |
| recommender | string \| null |
| interestCommitteeNames | string[] \| null |
| businessLicenseUrl | string \| null |
| qualificationList | [`MemberAttachmentVO`](#memberattachmentvo)[] \| null |
| honorList | [`MemberAttachmentVO`](#memberattachmentvo)[] \| null |
| otherList | [`MemberAttachmentVO`](#memberattachmentvo)[] \| null |

### `OperationLog`

| 字段名 | 类型 |
|--------|------|
| id | number |
| operationType | string \| null |
| tableName | string \| null |
| recordId | string \| null |
| newData | string \| null |
| operator | string \| null |
| operateTime | string \| null |
| method | string \| null |
| requestParams | string \| null |
| description | string \| null |

### `AttachmentRequest`（JSON 请求体子对象）

| 字段名 | 类型 | 必填 |
|--------|------|------|
| fileName | string | ✅ |
| fileUrl | string | ✅ |

### `MemberEducationRequest`（申请体子项）

| 字段名 | 类型 |
|--------|------|
| degree | string |
| school | string |
| major | string |
| startDate | string \| null |
| endDate | string \| null |
| sortOrder | number \| null |

### `MemberWorkExperienceRequest`（申请体子项）

| 字段名 | 类型 |
|--------|------|
| company | string |
| department | string |
| jobTitle | string |
| workContent | string \| null |
| status | string |
| startDate | string \| null |
| endDate | string \| null |
| sortOrder | number \| null |

---

## 1. 认证与会员

基路径：`/member/`（注意类映射带尾部 `/`，实际请求 `/member/register` 等）。

### 1.1 用户注册

**接口路径**: `POST /member/register`  
**Content-Type**: `application/json`

#### 请求体（`RegisterRequest`）

| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| username | string | ✅ | 最大 50 字符 |
| phone | string | ✅ | `^1[3-9]\d{9}$` |
| email | string | ✅ | 邮箱 |
| password | string | ✅ | 8–32 位，含字母与数字 |
| confirmPassword | string | ✅ | 须与 password 一致 |
| code | string | ✅ | 邮箱验证码 |
| acceptAgreement | boolean | ✅ | 须 `true` |

#### 响应示例（注册成功，`data` 无业务体）

```json
{
  "code": "SUCCESS",
  "success": true,
  "message": "SUCCESS",
  "data": null
}
```

失败时：`success` 为 `false`，`code` 如 `INCORRECT_VERIFICATION_CODE`、`EMAIL_ALREADY_EXISTS` 等，`message` 为说明文案。

---

### 1.2 用户登录

**接口路径**: `POST /member/login`  
**Content-Type**: `application/json`

#### 请求体（`LoginRequest`）

| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| phone | string | ❌ | 与 email 至少其一 |
| email | string | ❌ | 与 phone 至少其一 |
| password | string | ✅ | |

登录成功为 Sa-Token 写 cookie/header（token 名 `yaai`）。

#### 响应示例

```json
{
  "code": "SUCCESS",
  "success": true,
  "message": "SUCCESS",
  "data": null
}
```

---

### 1.3 用户登出

**接口路径**: `POST /member/logout`  
无请求体。响应同 [1.1](#11-用户注册) 包装，`data` 为 `null`。

---

### 1.4 发送验证码

**接口路径**: `POST /member/sendCode`  

#### 请求参数（Query 或表单）

| 字段名 | 类型 | 必填 |
|--------|------|------|
| email | string | ✅ |

响应 `data` 为 `null`。

---

### 1.5 个人会员申请

**接口路径**: `POST /member/apply/single`  
**Content-Type**: `application/json`

#### 请求体（`SingleMemberApplyRequest`）

| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| type | string | ✅ | 会员类型 |
| committeeId | number | ✅ | 申请加入的委员会 |
| categoryId | number | ✅ | `member_category.id` |
| joinMethod | string | ✅ | |
| auditStatus | string | ✅ | |
| membershipStatus | string | ✅ | |
| interestCommittees | number[] | ❌ | 关注委员会 ID |
| recommender | string | ❌ | |
| img | string | ❌ | 头像 URL |
| name | string | ✅ | |
| gender | string | ✅ | |
| idCardType | string | ✅ | |
| idCardNumber | string | ✅ | |
| birthDate | string | ✅ | 日期 |
| country | string | ✅ | |
| nativePlace | string | ✅ | |
| nationality | string | ✅ | |
| politicalOutlook | string | ✅ | |
| address | string | ✅ | |
| postalCode | string | ❌ | |
| contactPhone | string | ✅ | |
| landlinePhone | string | ❌ | |
| jobTitle | string | ✅ | |
| industry | string | ❌ | |
| workUnit | string | ✅ | |
| workDepartment | string | ✅ | |
| position | string | ✅ | |
| workContent | string | ❌ | |
| highestEducation | string | ✅ | |
| major | string | ❌ | |
| educationExperiences | array | ✅ | [`MemberEducationRequest`](#membereducationrequest-申请体子项)[] |
| workExperiences | array | ✅ | [`MemberWorkExperienceRequest`](#memberworkexperiencerequest-申请体子项)[] |
| researchDirection | string | ✅ | |
| publication | string | ❌ | |
| honors | string | ❌ | |
| projectExperience | string | ❌ | |
| areaCode | string | ✅ | 行政区划代码 |
| reviewActivities | number[] | ❌ | 评审类型 ID |

响应 `data` 为 `null`。

---

### 1.6 单位会员申请

**接口路径**: `POST /member/apply/company`  
**Content-Type**: `application/json`

#### 请求体（`CompanyMemberApplyRequest`）

| 字段名 | 类型 | 必填 |
|--------|------|------|
| type | string | ✅ |
| committeeId | number | ✅ |
| categoryId | number | ✅ |
| joinMethod | string | ✅ |
| auditStatus | string | ✅ |
| membershipStatus | string | ✅ |
| interestCommittees | number[] | ❌ |
| recommender | string | ❌ |
| businessLicenseUrl | string | ✅ |
| qualifications | [`AttachmentRequest`](#attachmentrequest-json-请求体子对象)[] | ❌ |
| honors | [`AttachmentRequest`](#attachmentrequest-json-请求体子对象)[] | ❌ |
| others | [`AttachmentRequest`](#attachmentrequest-json-请求体子对象)[] | ❌ |
| unitName | string | ✅ |
| unitCategory | string | ❌ |
| industry | string | ❌ |
| areaCode | string | ✅ |
| address | string | ✅ |
| postalCode | string | ❌ |
| website | string | ❌ |
| establishedDate | string | ❌ |
| registeredCapital | number | ❌ |
| financingRound | string | ❌ |
| legalRepresentative | string | ❌ |
| unifiedSocialCreditCode | string | ❌ |
| businessScope | string | ❌ |
| unitIntro | string | ❌ |
| aiIndustryIntro | string | ❌ |
| leaderName | string | ❌ |
| leaderTitle | string | ❌ |
| leaderPhone | string | ❌ |
| leaderEmail | string | ❌ |
| contactName | string | ✅ |
| contactDept | string | ❌ |
| contactOfficePhone | string | ❌ |
| contactMobile | string | ✅ |
| contactEmail | string | ✅ |
| contactGender | string | ❌ |
| contactTitle | string | ❌ |
| contactJobTitle | string | ❌ |
| contactFax | string | ❌ |
| totalEmployees | number | ❌ |
| otherSocieties | string | ❌ |
| suggestions | string | ❌ |

响应 `data` 为 `null`。

---

### 1.7 取消申请

**接口路径**: `POST /member/cancel/apply`

| 参数 | 类型 | 必填 |
|------|------|------|
| memberId | number | ✅ |

---

### 1.8 待审核列表（管理）

| 接口 | 方法 | 路径 | data |
|------|------|------|------|
| 个人待审核 | GET | `/member/audit/single/list?current=&size=` | `IPage<SingleMemberAuditVO>`，records 项见 [SingleMemberAuditVO](#singlememberauditvo) |
| 单位待审核 | GET | `/member/audit/company/list?current=&size=` | `IPage<CompanyMemberAuditVO>`，见 [CompanyMemberAuditVO](#companymemberauditvo) |

---

### 1.9 审核（管理）

| 接口 | 方法 | 路径 | 参数 |
|------|------|------|------|
| 通过 | POST | `/member/audit/pass` | `memberId` |
| 拒绝 | POST | `/member/audit/reject` | `memberId` |

---

## 2. 用户

基路径：`/user`

### 2.1 查询所有用户名

**接口路径**: `GET /user/queryAllUsernames`

```json
{
  "code": "SUCCESS",
  "success": true,
  "message": "SUCCESS",
  "data": ["张三", "李四"]
}
```

---

### 2.2 根据 ID 查询用户

**接口路径**: `GET /user/queryById?id=`

```json
{
  "code": "SUCCESS",
  "success": true,
  "message": "SUCCESS",
  "data": {
    "id": 1,
    "username": "张三",
    "phone": "13800138000",
    "email": "zhang@example.com",
    "status": 2,
    "createdAt": "2026-05-01T10:00:00",
    "updatedAt": "2026-05-08T12:00:00"
  }
}
```

---

### 2.3 删除用户（管理）

**接口路径**: `POST /user/deleteById?id=`  
成功时 `data` 为 `null`，外壳同本文档「统一响应 `Result<T>`」成功示例。

---

## 3. 新闻资讯

基路径：`/news`（`NewsController`）

| 接口 | 方法 | 路径 | 说明 |
|------|------|------|------|
| 分页列表 | GET | `/news` | Query：`current`（默认 1）、`size`（默认 10）、可选 `categoryId`、`title`、`status`、`isTop`；`data` 为 **`IPage<News>`**（含 `records`、`total`、`size`、`current`、`pages`） |
| 详情（含浏览量 +1） | GET | `/news/{id}` | 路径参数 **`id`**；进入详情前会先 **`incrementViewCount`**，再返回 `News` |
| 新建 | POST | `/news` | Body：`News`（`@Valid`） |
| 更新 | PUT | `/news/{id}` | Body：`News`，路径 `id` 写入实体 |
| 删除 | DELETE | `/news/{id}` | `data` 为被删主键 **`Long`** |

### 3.1 列表响应示例（`GET /news`，`data` 为分页）

```json
{
  "code": "SUCCESS",
  "success": true,
  "message": "SUCCESS",
  "data": {
    "records": [
      {
        "id": 1,
        "categoryId": 1,
        "title": "标题示例",
        "summary": "摘要",
        "content": "<p>正文 HTML</p>",
        "coverImage": "/static/xxx/cover.jpg",
        "publishTime": "2026-05-08T09:00:00",
        "source": "学会",
        "author": "编辑部",
        "status": true,
        "isTop": false,
        "viewCount": 100,
        "createdAt": "2026-05-01T10:00:00",
        "updatedAt": "2026-05-08T12:00:00"
      }
    ],
    "total": 1,
    "size": 10,
    "current": 1,
    "pages": 1
  }
}
```

### 3.2 单条响应示例（`GET /news/{id}`）

```json
{
  "code": "SUCCESS",
  "success": true,
  "message": "SUCCESS",
  "data": {
    "id": 1,
    "categoryId": 1,
    "title": "标题示例",
    "summary": "摘要",
    "content": "<p>正文</p>",
    "coverImage": "/static/xxx/cover.jpg",
    "publishTime": "2026-05-08T09:00:00",
    "source": "学会",
    "author": "编辑部",
    "status": true,
    "isTop": false,
    "viewCount": 101,
    "createdAt": "2026-05-01T10:00:00",
    "updatedAt": "2026-05-08T12:00:00"
  }
}
```

### 3.3 写操作响应

- `POST /news`、`PUT /news/{id}`：`data` 为 **`News`**。  
- `DELETE /news/{id}`：`data` 为 **`number`**（删除的 id）。

---

## 4. 新闻分类

基路径：`/news-categories`（`NewsCategoryController`）

| 接口 | 方法 | 路径 | 说明 |
|------|------|------|------|
| 列表 | GET | `/news-categories` | 可选 Query：`name`、`code`、`status`；`data` 为 **`{ items: NewsCategory[], total: number }`** |
| 详情 | GET | `/news-categories/{id}` | |
| 新建 | POST | `/news-categories` | Body：`NewsCategory` |
| 更新 | PUT | `/news-categories/{id}` | Body：`NewsCategory` |
| 删除 | DELETE | `/news-categories/{id}` | `data` 为 **`Long`** |

> 旧版 `/newsCategory/queryAll`、`queryByParentId` 等**已移除**；筛选请用列表 Query 或在前端基于 `parentId` 自行组树（若实体含该字段）。

### 4.1 列表响应示例（`GET /news-categories`）

```json
{
  "code": "SUCCESS",
  "success": true,
  "message": "SUCCESS",
  "data": {
    "items": [
      {
        "id": 1,
        "parentId": null,
        "name": "学会动态",
        "code": "association_news",
        "sortOrder": 1,
        "status": true,
        "createdAt": "2026-05-01T10:00:00",
        "updatedAt": "2026-05-08T12:00:00"
      }
    ],
    "total": 1
  }
}
```

### 4.2 单条响应示例（`GET /news-categories/{id}`）

```json
{
  "code": "SUCCESS",
  "success": true,
  "message": "SUCCESS",
  "data": {
    "id": 1,
    "parentId": null,
    "name": "学会动态",
    "code": "association_news",
    "sortOrder": 1,
    "status": true,
    "createdAt": "2026-05-01T10:00:00",
    "updatedAt": "2026-05-08T12:00:00"
  }
}
```

---

## 5. 轮播图

基路径：`/banners`（`BannerController`）

| 接口 | 方法 | 路径 | 说明 |
|------|------|------|------|
| 列表 | GET | `/banners` | 可选 Query：`groupCode`、`status`；`data` 为 **`{ items: Banner[], total: number }`** |
| 当前有效 | GET | `/banners/active/{groupCode}` | 路径参数 **`groupCode`**；`data` 为 **`Banner[]`** |
| 详情 | GET | `/banners/{id}` | |
| 新建 | POST | `/banners` | Body：`Banner` |
| 更新 | PUT | `/banners/{id}` | Body：`Banner` |
| 删除 | DELETE | `/banners/{id}` | `data` 为 **`Long`** |

### 5.1 列表响应示例（`GET /banners`）

```json
{
  "code": "SUCCESS",
  "success": true,
  "message": "SUCCESS",
  "data": {
    "items": [
      {
        "id": 1,
        "groupCode": "home_banner",
        "title": "首页轮播",
        "subtitle": "副标题",
        "imageUrl": "/static/xxx/banner.jpg",
        "linkUrl": "https://example.com",
        "sortOrder": 1,
        "status": true,
        "startTime": "2026-01-01T00:00:00",
        "endTime": "2026-12-31T23:59:59",
        "createdAt": "2026-05-01T10:00:00",
        "updatedAt": "2026-05-08T12:00:00"
      }
    ],
    "total": 1
  }
}
```

### 5.2 生效列表（`GET /banners/active/{groupCode}`，`data` 为数组）

```json
{
  "code": "SUCCESS",
  "success": true,
  "message": "SUCCESS",
  "data": [
    {
      "id": 1,
      "groupCode": "home_banner",
      "title": "首页轮播",
      "subtitle": "副标题",
      "imageUrl": "/static/xxx/banner.jpg",
      "linkUrl": "https://example.com",
      "sortOrder": 1,
      "status": true,
      "startTime": "2026-01-01T00:00:00",
      "endTime": "2026-12-31T23:59:59",
      "createdAt": "2026-05-01T10:00:00",
      "updatedAt": "2026-05-08T12:00:00"
    }
  ]
}
```

### 5.3 单条响应示例（`GET /banners/{id}`）

```json
{
  "code": "SUCCESS",
  "success": true,
  "message": "SUCCESS",
  "data": {
    "id": 1,
    "groupCode": "home_banner",
    "title": "首页轮播",
    "subtitle": "副标题",
    "imageUrl": "/static/xxx/banner.jpg",
    "linkUrl": "https://example.com",
    "sortOrder": 1,
    "status": true,
    "startTime": "2026-01-01T00:00:00",
    "endTime": "2026-12-31T23:59:59",
    "createdAt": "2026-05-01T10:00:00",
    "updatedAt": "2026-05-08T12:00:00"
  }
}
```

---

## 6. 专业委员会与成员

### 6.1 委员会 `/committee`

| 接口 | 方法 | 路径 |
|------|------|------|
| 仅名称列表 | GET | `/committee/queryAllNames` |
| 全部详情 | GET | `/committee/queryAll` |
| 按 ID | GET | `/committee/queryById?id=` |
| 增删改 | POST | `/committee/insert`、`/committee/update`、`/committee/deleteById?id=` |

#### `queryAllNames` 响应示例（`data` 为 `string[]`）

```json
{
  "code": "SUCCESS",
  "success": true,
  "message": "SUCCESS",
  "data": ["人工智能专业委员会", "计算机视觉专业委员会"]
}
```

#### `queryAll` / `queryById` 响应示例（`Committee` / `Committee[]`）

```json
{
  "code": "SUCCESS",
  "success": true,
  "message": "SUCCESS",
  "data": {
    "id": 1,
    "name": "人工智能专业委员会",
    "category": "专业委员会",
    "description": "简介文字",
    "establishedDate": "2020-01-01",
    "chairmanId": 10,
    "status": true,
    "createdAt": "2026-05-01T10:00:00",
    "updatedAt": "2026-05-08T12:00:00"
  }
}
```

### 6.2 委员会成员 `/committee-member`

| 接口 | 方法 | 路径 |
|------|------|------|
| 按会员 | GET | `/committee-member/queryByMemberId?memberId=` |
| 按委员会 | GET | `/committee-member/queryByCommitteeId?committeeId=` |
| 增删改 | POST | `insert` / `updateById` / `deleteById` / `deleteByMemberId` |

#### 单条 `queryByMemberId`（`data` 为 `CommitteeMemberVO`）

部分字段若后端未赋值可能为 `null`。

```json
{
  "code": "SUCCESS",
  "success": true,
  "message": "SUCCESS",
  "data": {
    "id": 1,
    "memberId": 100,
    "memberName": null,
    "committeeId": 1,
    "committeeName": null,
    "role": "副主任委员",
    "joinedAt": "2020-06-01",
    "status": "正常",
    "resignDate": null,
    "createdAt": "2026-05-01T10:00:00",
    "updatedAt": "2026-05-08T12:00:00"
  }
}
```

#### `queryByCommitteeId`（`data` 为数组）

```json
{
  "code": "SUCCESS",
  "success": true,
  "message": "SUCCESS",
  "data": [
    {
      "id": 1,
      "memberId": 100,
      "memberName": null,
      "committeeId": 1,
      "committeeName": null,
      "role": "委员",
      "joinedAt": "2020-06-01",
      "status": "正常",
      "resignDate": null,
      "createdAt": "2026-05-01T10:00:00",
      "updatedAt": "2026-05-08T12:00:00"
    }
  ]
}
```

---

## 7. 会员类别

基路径：`/category`

| 接口 | 方法 | 路径 |
|------|------|------|
| 全部 | GET | `/category/queryAll` |
| 按 ID | GET | `/category/queryById?id=` |
| 按 type 查名称 | GET | `/category/queryNamesByType?type=` |

### 列表 `queryAll`（`data` 为 `MemberCategory[]`）

```json
{
  "code": "SUCCESS",
  "success": true,
  "message": "SUCCESS",
  "data": [
    {
      "id": 1,
      "name": "个人会员",
      "type": "个人",
      "sortOrder": 1,
      "annualFee": 500.0,
      "createdAt": "2026-05-01T10:00:00",
      "updatedAt": "2026-05-08T12:00:00"
    }
  ]
}
```

### `queryNamesByType`（`data` 为 `string[]`）

```json
{
  "code": "SUCCESS",
  "success": true,
  "message": "SUCCESS",
  "data": ["理事长单位", "普通会员单位"]
}
```

---

## 8. 页面、版本、模板与节点（页面编辑器）

> 旧版 **`/page`、`/pageBlock`** 已移除。页面主体实体为 **`Pages`**（表 `page`），配套 **`PageVersion` / `PageTemplate` / `PageNode` / `ReusableFragment` / `ComponentDef` / `DataBinding`**。字段见附录。

### 8.1 页面 `/pages`（`PagesController`）

| 接口 | 方法 | 路径 | 说明 |
|------|------|------|------|
| 分页列表 | GET | `/pages` | Query：`current`、`size`、`name`、`code`、`path`、`pageType`、`status`；`data` 为 **`IPage<Pages>`** |
| 详情 | GET | `/pages/{id}` | |
| 当前发布版本 | GET | `/pages/{id}/current-version` | `data` 为 **`PageVersion`**（无发布版本时以后端为准，可能 `null` 或业务错误） |
| 新建 | POST | `/pages` | Body：`Pages` |
| 更新 | PUT | `/pages/{id}` | Body：`Pages` |
| 删除 | DELETE | `/pages/{id}` | `data` 为 **`Long`** |

#### 单条页面示例（`GET /pages/{id}`，`data` 含 `currentVersionId` 等）

```json
{
  "code": "SUCCESS",
  "success": true,
  "message": "SUCCESS",
  "data": {
    "id": 1,
    "name": "首页",
    "code": "home",
    "path": "/home",
    "pageType": "landing",
    "title": "云南人工智能学会",
    "status": true,
    "currentVersionId": 10,
    "seoTitle": "SEO 标题",
    "seoKeywords": "关键词",
    "seoDescription": "描述",
    "createdAt": "2026-05-01T10:00:00",
    "updatedAt": "2026-05-08T12:00:00"
  }
}
```

### 8.2 页面版本 `/pages/{pageId}/versions`（`PageVersionController`）

| 接口 | 方法 | 路径 | 说明 |
|------|------|------|------|
| 分页列表 | GET | `/pages/{pageId}/versions` | Query：`current`、`size` |
| 详情 | GET | `/pages/{pageId}/versions/{id}` | |
| 新建 | POST | `/pages/{pageId}/versions` | Body：`PageVersion` |
| 从模板创建 | POST | `/pages/{pageId}/versions/from-template` | Query：`templateId`（必填）、`versionName`、`remark` |
| 发布 | POST | `/pages/{pageId}/versions/{id}/publish` | `data` 为 **`Map`**（具体键以后端为准） |
| 锁定 / 解锁 | POST | `.../versions/{id}/lock`、`.../unlock` | |
| 复制 | POST | `/pages/{pageId}/versions/{id}/clone` | Query：可选 `versionName` |
| 删除 | DELETE | `/pages/{pageId}/versions/{id}` | `data` 为 **`Long`** |

### 8.3 页面模板 `/page-templates`（`PageTemplateController`）

| 接口 | 方法 | 路径 |
|------|------|------|
| 分页列表 | GET | `/page-templates`（Query：`current`、`size`、`name`、`code`、`status`） |
| 详情 | GET | `/page-templates/{id}` |
| 新建 | POST | `/page-templates` |
| 更新 | PUT | `/page-templates/{id}` |
| 删除 | DELETE | `/page-templates/{id}` |

### 8.4 可复用片段 `/reusable-fragments`（`ReusableFragmentController`）

| 接口 | 方法 | 路径 |
|------|------|------|
| 分页列表 | GET | `/reusable-fragments`（Query：`current`、`size`、`name`、`code`、`fragmentType`、`status`） |
| 详情 | GET | `/reusable-fragments/{id}` |
| 新建 | POST | `/reusable-fragments` |
| 更新 | PUT | `/reusable-fragments/{id}` |
| 删除 | DELETE | `/reusable-fragments/{id}` |

### 8.5 页面节点树（`PageNodeController`，根路径无前缀）

**读树**

| 方法 | 路径 |
|------|------|
| GET | `/page-versions/{versionId}/node-tree` |
| GET | `/page-templates/{id}/node-tree` |
| GET | `/reusable-fragments/{id}/node-tree` |

**整树保存**（Body 为 **`{ "nodes": [ ... ] }`**，`SaveNodeTreeWrapper`；单条节点字段支持 **驼峰或 snake_case**，见 `SaveNodeTreeRequest`）

| 方法 | 路径 |
|------|------|
| PUT | `/page-versions/{versionId}/node-tree` |
| PUT | `/page-templates/{id}/node-tree` |
| PUT | `/reusable-fragments/{id}/node-tree` |

**单节点**

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/page-versions/{versionId}/nodes` | Body：`PageNode`，新增到该版本 |
| PUT | `/page-nodes/{id}` | Body：`PageNode`（更新内容字段） |
| POST | `/page-nodes/{id}/move` | Query：可选 `parent_id`、`slot_name`、`sort_order` |
| DELETE | `/page-nodes/{id}` | |
| POST | `/page-nodes/{id}/copy` | Query：可选 `parent_id`、`slot_name`、`sort_order` |

### 8.6 组件定义 `/component-defs`（`ComponentDefController`）

| 接口 | 方法 | 路径 |
|------|------|------|
| 分页列表 | GET | `/component-defs`（Query：`current`、`size`、`componentName`、`componentKey`、`componentType`、`status`） |
| 详情 | GET | `/component-defs/{id}` |
| 新建 | POST | `/component-defs` |
| 更新 | PUT | `/component-defs/{id}` |
| 启停 | DELETE | `/component-defs/{id}/status?status=` | **非物理删除**；`status` 为 `boolean` |

### 8.7 数据绑定 `/data-bindings`（`DataBindingController`）

| 接口 | 方法 | 路径 |
|------|------|------|
| 分页列表 | GET | `/data-bindings`（Query：`current`、`size`、`name`、`bindingType`、`status`） |
| 详情 | GET | `/data-bindings/{id}` |
| 新建 | POST | `/data-bindings` |
| 更新 | PUT | `/data-bindings/{id}` |
| 删除 | DELETE | `/data-bindings/{id}` |
| 预览 | POST | `/data-bindings/{id}/preview` | `data` 为 **`Map`** |

> 数据绑定里若配置「请求路径」，请使用**当前版** REST 路径（例如新闻列表为 **`GET /news`**），勿再写 `/news/queryPublished`。

---

## 9. 菜单

基路径：`/menus`（`MenuController`）

| 接口 | 方法 | 路径 | 说明 |
|------|------|------|------|
| 列表 | GET | `/menus` | 可选 Query：`name`、`code`、`status`；`data` 为 **`{ items: Menu[], total: number }`**（平铺列表，前端按 `parentId` 组树） |
| 详情 | GET | `/menus/{id}` | |
| 新建 | POST | `/menus` | Body：`Menu` |
| 更新 | PUT | `/menus/{id}` | Body：`Menu` |
| 移动 | POST | `/menus/{id}/move` | Body：`MenuMoveRequest`：`parentId`（可 null 表示顶级）、`sortOrder` |
| 删除 | DELETE | `/menus/{id}` | `data` 为 **`Long`** |

#### 单条 `Menu` 响应示例（`GET /menus/{id}`）

```json
{
  "code": "SUCCESS",
  "success": true,
  "message": "SUCCESS",
  "data": {
    "id": 1,
    "parentId": null,
    "name": "首页",
    "code": "home",
    "urlType": "page",
    "pageId": 1,
    "externalUrl": null,
    "sortOrder": 1,
    "status": true,
    "createdAt": "2026-05-01T10:00:00",
    "updatedAt": "2026-05-08T12:00:00"
  }
}
```

---

## 10. 站点配置

基路径：`/site-configs`（`SiteConfigController`）

| 接口 | 方法 | 路径 | 说明 |
|------|------|------|------|
| 全部 | GET | `/site-configs` | `data` 为 **`{ items: SiteConfig[], total: number }`** |
| 仅值 | GET | `/site-configs/value/{configKey}` | `data` 为 **`string`**（配置值） |
| 按 ID | GET | `/site-configs/{id}` | |
| 新建 | POST | `/site-configs` | Body：`SiteConfig` |
| 更新 | PUT | `/site-configs/{id}` | Body：`SiteConfig` |
| 删除 | DELETE | `/site-configs/{id}` | `data` 为 **`Long`** |
| 批量 | PUT | `/site-configs/batch` | Body：**`Map<String, String>`**（key → value，不存在则创建） |

#### 单条 `SiteConfig`（`GET /site-configs/{id}`）

```json
{
  "code": "SUCCESS",
  "success": true,
  "message": "SUCCESS",
  "data": {
    "id": 1,
    "configKey": "site_name",
    "configValue": "YAAI",
    "remark": "网站名称",
    "createdAt": "2026-05-01T10:00:00",
    "updatedAt": "2026-05-08T12:00:00"
  }
}
```

#### 仅配置值（`GET /site-configs/value/{configKey}`）

```json
{
  "code": "SUCCESS",
  "success": true,
  "message": "SUCCESS",
  "data": "YAAI"
}
```

---

## 11. 个人会员档案

### 11.1 `/member-single`

| 接口 | 方法 | 路径 |
|------|------|------|
| 按会员 ID | GET | `/member-single/queryByMemberId?memberId=` |
| 按记录 ID | GET | `/member-single/queryById?id=` |
| 新增 / 更新 / 删除 | POST | `insert`、`updateById`、`deleteById`、`deleteByMemberId` |

#### `queryByMemberId` / `queryById` 响应示例（`data` 为 `MemberSingleVO`）

```json
{
  "code": "SUCCESS",
  "success": true,
  "message": "SUCCESS",
  "data": {
    "id": 1,
    "name": "张三",
    "gender": "男",
    "idCardType": "身份证",
    "idCardNumber": "110101199001011234",
    "birthDate": "1990-01-01",
    "country": "中国",
    "nativePlace": "云南",
    "nationality": "汉族",
    "politicalOutlook": "群众",
    "address": "昆明市",
    "postalCode": "650000",
    "contactPhone": "13800138000",
    "landlinePhone": null,
    "email": "zhang@example.com",
    "img": "/static/user-photos/xxx.jpg",
    "jobTitle": "教授",
    "industry": "人工智能",
    "workUnit": "某某大学",
    "workDepartment": "计算机学院",
    "position": "系主任",
    "workContent": null,
    "highestEducation": "博士",
    "major": "计算机",
    "researchDirection": "机器学习",
    "publication": null,
    "honors": null,
    "projectExperience": null,
    "recommender": null,
    "other": null,
    "memberId": 100,
    "areaCode": "530102",
    "createdAt": "2026-05-01T10:00:00",
    "updatedAt": "2026-05-08T12:00:00"
  }
}
```

无记录等业务错误时：`success` 为 `false`，`data` 多为 `null`，`code` 为业务错误码字符串。

### 11.2 `/member-education`

| 接口 | 方法 | 路径 |
|------|------|------|
| 列表 | GET | `/member-education/queryByMemberId?memberId=` |
| 单条 | GET | `/member-education/queryById?id=` |

#### 列表响应示例（`data` 为 `MemberEducationVO[]`）

```json
{
  "code": "SUCCESS",
  "success": true,
  "message": "SUCCESS",
  "data": [
    {
      "id": 1,
      "memberId": 100,
      "degree": "博士",
      "school": "清华大学",
      "major": "计算机",
      "startDate": "2010-09-01",
      "endDate": "2015-06-30",
      "sortOrder": 1,
      "createdAt": "2026-05-01T10:00:00",
      "updatedAt": "2026-05-08T12:00:00"
    }
  ]
}
```

### 11.3 `/member-work-experience`

#### 列表响应示例（`data` 为 `MemberWorkExperienceVO[]`）

```json
{
  "code": "SUCCESS",
  "success": true,
  "message": "SUCCESS",
  "data": [
    {
      "id": 1,
      "memberId": 100,
      "company": "某某科技",
      "department": "研发部",
      "jobTitle": "工程师",
      "workContent": null,
      "startDate": "2015-07-01",
      "endDate": null,
      "status": "在职",
      "sortOrder": 1,
      "createdAt": "2026-05-01T10:00:00",
      "updatedAt": "2026-05-08T12:00:00"
    }
  ]
}
```

---

## 12. 订单与支付

基路径：`/member/`

| 接口 | 方法 | 路径 | 请求参数 |
|------|------|------|----------|
| 创建订单 | POST | `/member/payment/create` | `memberId`，`paymentMethod` |
| 订单列表 | GET | `/member/order/list?memberId=` | |
| 订单详情 | GET | `/member/order/detail?outTradeNo=` | |
| 支付回调 | POST | `/member/payment/callback` | `outTradeNo`，`transactionId` |

### `payment/create` 响应示例（`data` 为 `OrderCreateVO`）

`order` 为订单实体；`status` 一般为枚举名 `UNPAID` / `PAID` / `CANCELLED`（以实际 JSON 为准）。

```json
{
  "code": "SUCCESS",
  "success": true,
  "message": "SUCCESS",
  "data": {
    "order": {
      "id": 1,
      "memberId": 100,
      "memberCategoryId": 1,
      "amount": 500.0,
      "outTradeNo": "ORD2026050800001",
      "date": "2026-05-08",
      "paymentMethod": "alipay",
      "status": "UNPAID",
      "payUrl": "https://pay.example.com/qr/xxx",
      "expireTime": "2026-05-09T10:00:00",
      "transactionId": null,
      "closeReason": null,
      "createdAt": "2026-05-08T10:00:00",
      "paidAt": null,
      "closedAt": null,
      "updatedAt": "2026-05-08T10:00:00"
    },
    "payUrl": "https://pay.example.com/qr/xxx",
    "amount": 500.0,
    "categoryName": "个人会员"
  }
}
```

### `order/list` / `order/detail`（`data` 为 `OrderVO[]` 或 `OrderVO`）

在 `Order` 字段基础上增加 `expired`：

```json
{
  "code": "SUCCESS",
  "success": true,
  "message": "SUCCESS",
  "data": {
    "id": 1,
    "memberId": 100,
    "memberCategoryId": 1,
    "amount": 500.0,
    "outTradeNo": "ORD2026050800001",
    "date": "2026-05-08",
    "paymentMethod": "alipay",
    "status": "UNPAID",
    "payUrl": "https://pay.example.com/qr/xxx",
    "transactionId": null,
    "paidAt": null,
    "closeReason": null,
    "closedAt": null,
    "expireTime": "2026-05-09T10:00:00",
    "createdAt": "2026-05-08T10:00:00",
    "updatedAt": "2026-05-08T10:00:00",
    "expired": false
  }
}
```

---

## 13. 系统消息

基路径：`/sys-message`（需登录）

| 接口 | 方法 | 路径 |
|------|------|------|
| 分页 | GET | `/sys-message/queryByUserId?current=1&size=10` | **无需传 userId**，后端用 **`StpUtil.getLoginIdAsLong()`** 取当前用户 |
| 已读 | POST | `/sys-message/markAsRead?messageId=` |
| 未读数 | GET | `/sys-message/getUnreadCount` | 同上，基于当前登录用户 |

### 分页响应示例（`data` 为 `IPage`，内含 `records` 为 `SysMessage[]`）

```json
{
  "code": "SUCCESS",
  "success": true,
  "message": "SUCCESS",
  "data": {
    "records": [
      {
        "id": 1,
        "userId": 10,
        "messageType": "system",
        "messageContent": "您的申请已通过",
        "status": "unread",
        "createdAt": "2026-05-08T10:00:00",
        "updatedAt": "2026-05-08T10:00:00"
      }
    ],
    "total": 100,
    "size": 10,
    "current": 1,
    "pages": 10
  }
}
```

### `getUnreadCount`（`data` 为数字）

```json
{
  "code": "SUCCESS",
  "success": true,
  "message": "SUCCESS",
  "data": 5
}
```

---

## 14. 会员关注 / 评审 / 角色

### 14.1 关注 `/member-interest`

`queryCommitteeIds` 响应示例（`data` 为 `number[]`）：

```json
{
  "code": "SUCCESS",
  "success": true,
  "message": "SUCCESS",
  "data": [1, 2, 3]
}
```

写操作成功时 `data` 为 `null`（外壳同「统一响应 `Result<T>`」成功示例）。

### 14.2 评审关联 `/member-review`

`GET /member-review/queryTypeIds?memberId=` → `data` 为 `number[]`，形状同 14.1 数组示例。

### 14.3 会员角色 `/member-role`

`GET /member-role/queryRoleIds?memberId=` → `data` 为 `number[]`。

### 14.4 评审类型 `/review-type`

#### 列表 `queryAll`（`data` 为 `ReviewTypeVO[]`）

```json
{
  "code": "SUCCESS",
  "success": true,
  "message": "SUCCESS",
  "data": [
    {
      "id": 1,
      "name": "论文审稿",
      "code": "paper_review",
      "sortOrder": 1,
      "status": true,
      "createdAt": "2026-05-01T10:00:00",
      "updatedAt": "2026-05-08T12:00:00"
    }
  ]
}
```

---

## 15. 角色与权限（管理）

### `GET /role/queryAll`（`data` 为 `Role[]`）

```json
{
  "code": "SUCCESS",
  "success": true,
  "message": "SUCCESS",
  "data": [
    {
      "id": 1,
      "name": "管理员",
      "code": "admin",
      "description": "系统管理员",
      "sortOrder": 1,
      "status": true,
      "createdAt": "2026-05-01T10:00:00",
      "updatedAt": "2026-05-08T12:00:00"
    }
  ]
}
```

### `GET /role/queryById?id=`（`data` 为 `RoleDetailVO`）

```json
{
  "code": "SUCCESS",
  "success": true,
  "message": "SUCCESS",
  "data": {
    "role": {
      "id": 1,
      "name": "管理员",
      "code": "admin",
      "description": "系统管理员",
      "sortOrder": 1,
      "status": true,
      "createdAt": "2026-05-01T10:00:00",
      "updatedAt": "2026-05-08T12:00:00"
    },
    "permissions": [
      {
        "id": 1,
        "name": "新闻发布",
        "code": "news:publish",
        "module": "news",
        "description": "发布新闻",
        "createdAt": "2026-05-01T10:00:00"
      }
    ]
  }
}
```

### `GET /permission/queryById?id=`（`data` 为 `PermissionVO`）

```json
{
  "code": "SUCCESS",
  "success": true,
  "message": "SUCCESS",
  "data": {
    "id": 1,
    "name": "新闻发布",
    "code": "news:publish",
    "module": "news",
    "description": "发布新闻"
  }
}
```

---

## 16. 操作日志

### `GET /log/queryById?id=`（`data` 为 `OperationLog`）

```json
{
  "code": "SUCCESS",
  "success": true,
  "message": "SUCCESS",
  "data": {
    "id": 1,
    "operationType": "INSERT",
    "tableName": "news",
    "recordId": "1",
    "newData": "{\"title\":\"...\"}",
    "operator": "admin",
    "operateTime": "2026-05-08T10:00:00",
    "method": "NewsController.insert",
    "requestParams": "{}",
    "description": "新增新闻"
  }
}
```

---

## 17. 文件上传

基路径：`/api`

### 17.1 上传 `POST /api/upload`

**`multipart/form-data`**：`file`（文件）、**`type`**（场景标识，如 `user-photos`、`news-images`，与 `FileController` 参数名一致）。

成功时 **`data` 为字符串**（文件 URL）：

```json
{
  "code": "SUCCESS",
  "success": true,
  "message": "SUCCESS",
  "data": "/static/user-photos/2026/05/08/xxx.jpg"
}
```

### 17.2 访问文件

`GET /api/static/{scene}/**` → 二进制流，**不是** `Result` 包装。

### 17.3 删除 `DELETE /api/delete?fileUrl=`

```json
{
  "code": "SUCCESS",
  "success": true,
  "message": "SUCCESS",
  "data": true
}
```

---

## 附：与旧版「仅路径」文档的关系

- 若网关为接口统一加了前缀（如 `/api`），请在 axios `baseURL` 中配置，**不要改动**本文档中的字段名。  
- 更简路径总览可对照 `YAAI 展示端接口文档-后端对照版.md`；**字段以本文档与后端源码为准**。
