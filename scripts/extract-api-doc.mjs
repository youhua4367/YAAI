import fs from 'fs'

let raw = fs.readFileSync('doc/api.md', 'utf8').trim()
if (raw.startsWith('```')) {
  raw = raw.replace(/^```[a-z]*\n?/, '').replace(/\n?```$/, '')
}
const spec = JSON.parse(raw)

/** 展示端需要的「方法 + 路径」白名单（不含后台管理类增删改） */
const endpointWhitelist = new Set([
  'GET /news',
  'GET /news/{id}',
  'GET /news-categories',
  'GET /banners',
  'GET /banners/active/{groupCode}',
  'GET /banners/{id}',
  'POST /member/sendCode',
  'POST /member/register',
  'POST /member/login',
  'POST /member/logout',
  'POST /member/apply/single',
  'POST /member/apply/company',
  'POST /member/cancel/apply',
  'POST /member/payment/create',
  'GET /member/order/list',
  'GET /member/order/detail',
  'GET /user/queryById',
  'GET /member-single/queryByMemberId',
  'GET /member-single/queryById',
  'GET /member-education/queryByMemberId',
  'GET /member-work-experience/queryByMemberId',
  'GET /sys-message/queryByUserId',
  'POST /sys-message/markAsRead',
  'GET /sys-message/getUnreadCount'
])

function refName(schema) {
  if (!schema) return ''
  if (schema.$ref) return schema.$ref.split('/').pop()
  if (schema.type === 'array' && schema.items?.$ref) {
    return schema.items.$ref.split('/').pop() + '[]'
  }
  return schema.type || ''
}

const schemas = spec.components?.schemas || {}
const out = []

for (const [path, methods] of Object.entries(spec.paths || {})) {
  for (const [method, op] of Object.entries(methods)) {
    if (!['get', 'post', 'put', 'delete', 'patch'].includes(method)) continue
    const key = `${method.toUpperCase()} ${path}`
    if (!endpointWhitelist.has(key)) continue
    const params = (op.parameters || []).map((p) => ({
      name: p.name,
      in: p.in,
      required: !!p.required,
      desc: p.description || '',
      schema: refName(p.schema)
    }))
    let body = ''
    const rb = op.requestBody?.content?.['application/json']?.schema
    if (rb) body = refName(rb)
    const r200 =
      op.responses?.['200']?.content?.['*/*']?.schema ||
      op.responses?.['200']?.content?.['application/json']?.schema
    out.push({
      path,
      method: method.toUpperCase(),
      summary: op.summary || '',
      description: op.description || '',
      tag: (op.tags || [])[0] || '',
      params,
      body,
      response: refName(r200)
    })
  }
}

// sort by tag then path
out.sort((a, b) => a.tag.localeCompare(b.tag) || a.path.localeCompare(b.path))

function schemaProps(name) {
  const s = schemas[name]
  if (!s?.properties) return []
  return Object.entries(s.properties).map(([k, v]) => ({
    field: k,
    type: refName(v) || v.type || '',
    desc: v.description || ''
  }))
}

function unwrapResult(respName) {
  if (!respName.startsWith('Result')) return { wrapper: respName, data: respName }
  const inner = respName.replace(/^Result/, '')
  if (!inner || inner === 'Result') return { wrapper: 'Result', data: 'void（无业务体）' }
  if (inner.startsWith('List')) return { wrapper: 'Result', data: inner.replace(/^List/, '') + '[]' }
  if (inner.startsWith('IPage')) return { wrapper: 'Result', data: inner + '（分页，含 records/total 等）' }
  return { wrapper: 'Result', data: inner }
}

/** 核心实体字段附录 */
const appendixSchemas = ['News', 'NewsCategory', 'Banner', 'UserDetailVO', 'MemberSingleVO', 'OrderVO', 'SysMessage']

const lines = []
lines.push('# YAAI 展示端所需接口说明')
lines.push('')
lines.push('> 依据 `doc/api.md`（OpenAPI 3.0）筛选展示端已封装或计划使用的接口，供前端联调。')
lines.push('> 与 `doc/前端已实现接口封装说明.md` 分工：本文档侧重**后端契约**（参数、模型）；后者侧重 **`src/api/` 封装与调用约定**。')
lines.push(`> 服务地址（开发）：\`${spec.servers?.[0]?.url || 'http://localhost:9876'}\``)
lines.push('')
lines.push('## 通用说明')
lines.push('')
lines.push('| 项目 | 说明 |')
lines.push('|------|------|')
lines.push('| 响应包装 | 多数接口返回 `Result<T>`：`success`、`message`、`data` |')
lines.push('| 分页 | 新闻列表等使用 `current`、`size`；部分列表为 `IPage`（`records`、`total` 等） |')
lines.push('| 鉴权 | 登录后接口需携带 Token（与 Sa-Token 配置一致） |')
lines.push('')

let lastTag = ''
for (const api of out) {
  if (api.tag !== lastTag) {
    lastTag = api.tag
    lines.push(`## ${lastTag}`)
    lines.push('')
  }
  lines.push(`### ${api.method} \`${api.path}\``)
  if (api.summary) lines.push(`**摘要**：${api.summary}  `)
  if (api.description) lines.push(`**说明**：${api.description}  `)
  lines.push('')
  if (api.params.length) {
    lines.push('| 参数 | 位置 | 必填 | 类型/说明 | 描述 |')
    lines.push('|------|------|------|-----------|------|')
    for (const p of api.params) {
      lines.push(`| ${p.name} | ${p.in} | ${p.required ? '是' : '否'} | ${p.schema} | ${p.desc} |`)
    }
    lines.push('')
  }
  if (api.body) {
    lines.push(`**请求体**：\`${api.body}\``)
    const props = schemaProps(api.body)
    if (props.length) {
      lines.push('')
      lines.push('| 字段 | 类型 | 说明 |')
      lines.push('|------|------|------|')
      for (const p of props.slice(0, 40)) {
        lines.push(`| ${p.field} | ${p.type} | ${p.desc} |`)
      }
      if (props.length > 40) lines.push('| … | … | 字段较多，见 OpenAPI Schema |')
      lines.push('')
    }
  }
  if (api.response) {
    const { data } = unwrapResult(api.response)
    lines.push(`**响应**：\`Result<${data || api.response}>\``)
    const dataSchema = data || api.response.replace(/^Result/, '')
    const props = schemaProps(dataSchema)
    if (props.length && props.length < 30) {
      lines.push('')
      lines.push('`data` 主要字段：')
      lines.push('')
      lines.push('| 字段 | 类型 | 说明 |')
      lines.push('|------|------|------|')
      for (const p of props) {
        lines.push(`| ${p.field} | ${p.type} | ${p.desc} |`)
      }
      lines.push('')
    }
  }
  lines.push('---')
  lines.push('')
}

// frontend mapping section
lines.push('## 前端封装对照（`src/api/`）')
lines.push('')
lines.push('| 模块 | 函数 | 方法 | 路径 |')
lines.push('|------|------|------|------|')
const map = [
  ['news.ts', 'getNewsPage / fetchNewsListByCategoryId', 'GET', '/news'],
  ['news.ts', 'getNewsById', 'GET', '/news/{id}'],
  ['newsCategory.ts', 'fetchEnabledNewsCategories', 'GET', '/news-categories?status=true'],
  ['banner.ts', 'getBanners', 'GET', '/banners'],
  ['banner.ts', 'getActiveBanners', 'GET', '/banners/active/{groupCode}'],
  ['banner.ts', 'getBannerById', 'GET', '/banners/{id}'],
  ['common.ts', 'sendCode', 'POST', '/member/sendCode'],
  ['member.ts', 'register', 'POST', '/member/register'],
  ['member.ts', 'login', 'POST', '/member/login'],
  ['member.ts', 'logout', 'POST', '/member/logout'],
  ['member.ts', 'submitSingleMemberApplication', 'POST', '/member/apply/single'],
  ['member.ts', 'submitCompanyMemberApplication', 'POST', '/member/apply/company'],
  ['member.ts', 'cancelApplication', 'POST', '/member/cancel/apply'],
  ['member.ts', 'createPaymentOrder', 'POST', '/member/payment/create'],
  ['member.ts', 'getMemberOrderList', 'GET', '/member/order/list'],
  ['member.ts', 'getMemberOrderDetail', 'GET', '/member/order/detail'],
  ['user.ts', 'getUserById', 'GET', '/user/queryById'],
  ['user.ts', 'updateUser', 'PUT', '/user/update（OpenAPI 未收录，以前端封装为准）'],
  ['memberArchive.ts', 'getMemberSingleByMemberId', 'GET', '/member-single/queryByMemberId'],
  ['memberArchive.ts', 'getMemberEducationByMemberId', 'GET', '/member-education/queryByMemberId'],
  ['memberArchive.ts', 'getMemberWorkExperienceByMemberId', 'GET', '/member-work-experience/queryByMemberId'],
  ['sysMessage.ts', 'getSysMessagePage', 'GET', '/sys-message/queryByUserId'],
  ['sysMessage.ts', 'markSysMessageRead', 'POST', '/sys-message/markAsRead'],
  ['sysMessage.ts', 'getSysMessageUnreadCount', 'GET', '/sys-message/getUnreadCount']
]
for (const row of map) lines.push(`| ${row[0]} | ${row[1]} | ${row[2]} | ${row[3]} |`)

lines.push('')
lines.push('## 附录：核心数据模型字段')
lines.push('')
for (const name of appendixSchemas) {
  const props = schemaProps(name)
  if (!props.length) continue
  lines.push(`### ${name}`)
  lines.push('')
  lines.push('| 字段 | 类型 | 说明 |')
  lines.push('|------|------|------|')
  for (const p of props) {
    lines.push(`| ${p.field} | ${p.type} | ${p.desc} |`)
  }
  lines.push('')
}

lines.push('## 说明')
lines.push('')
lines.push('- 本文档由 `doc/api.md`（OpenAPI）自动筛选生成，仅含**展示端**会用到的读接口与会员/消息写接口。')
lines.push('- 后台管理接口（新闻/轮播增删改、审核列表等）未列入；完整定义见 `doc/api.md`。')
lines.push('- `PUT /user/update` 在前端 `src/api/user.ts` 已封装，当前 OpenAPI 导出中未包含，联调时以后端实际为准。')

fs.writeFileSync('doc/YAAI展示端所需接口.md', lines.join('\n'), 'utf8')
console.log('Wrote', out.length, 'endpoints to doc/YAAI展示端所需接口.md')
