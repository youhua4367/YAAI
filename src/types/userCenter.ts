/**
 * 会员中心 / 用户模块 VO（与展示端接口文档字段对齐，部分字段以实际响应为准）
 */

export interface UserDetailVO {
  id: number
  username?: string | null
  phone?: string | null
  email?: string | null
  /** 0 待申请，1 待缴费，2 已缴费 */
  status?: number | null
  createdAt?: string | null
  updatedAt?: string | null
}

export interface MemberSingleVO {
  id: number
  name?: string | null
  gender?: string | null
  idCardType?: string | null
  idCardNumber?: string | null
  birthDate?: string | null
  country?: string | null
  nativePlace?: string | null
  nationality?: string | null
  politicalOutlook?: string | null
  address?: string | null
  postalCode?: string | null
  contactPhone?: string | null
  landlinePhone?: string | null
  email?: string | null
  img?: string | null
  jobTitle?: string | null
  industry?: string | null
  workUnit?: string | null
  workDepartment?: string | null
  position?: string | null
  workContent?: string | null
  highestEducation?: string | null
  major?: string | null
  researchDirection?: string | null
  publication?: string | null
  honors?: string | null
  projectExperience?: string | null
  recommender?: string | null
  other?: string | null
  memberId?: number | null
  areaCode?: string | null
  createdAt?: string | null
  updatedAt?: string | null
}

/** `POST /member-single/insert` 请求体（writable 字段） */
export interface MemberSingleInsertRequest {
  memberId: number
  name: string
  gender?: string | null
  idCardType?: string | null
  idCardNumber?: string | null
  birthDate?: string | null
  country?: string | null
  nativePlace?: string | null
  nationality?: string | null
  politicalOutlook?: string | null
  address?: string | null
  postalCode?: string | null
  contactPhone?: string | null
  landlinePhone?: string | null
  email?: string | null
  img?: string | null
  jobTitle?: string | null
  industry?: string | null
  workUnit?: string | null
  workDepartment?: string | null
  position?: string | null
  workContent?: string | null
  highestEducation?: string | null
  major?: string | null
  researchDirection?: string | null
  publication?: string | null
  honors?: string | null
  projectExperience?: string | null
  recommender?: string | null
  other?: string | null
  areaCode?: string | null
}

/** `POST /member-single/updateById` 请求体 */
export interface MemberSingleUpdateRequest extends MemberSingleInsertRequest {
  id: number
}

export interface MemberEducationVO {
  id: number
  memberId: number
  degree: string
  school: string
  major: string
  startDate?: string | null
  endDate?: string | null
  sortOrder?: number | null
  createdAt?: string | null
  updatedAt?: string | null
}

export interface MemberWorkExperienceVO {
  id: number
  memberId: number
  company: string
  department?: string | null
  jobTitle?: string | null
  workContent?: string | null
  startDate?: string | null
  endDate?: string | null
  status: string
  sortOrder?: number | null
  createdAt?: string | null
  updatedAt?: string | null
}

/** 会员委员会关系 */
export interface CommitteeMemberVO {
  id: number
  memberId: number
  memberName?: string | null
  committeeId: number
  committeeName?: string | null
  role?: string | null
  joinedAt?: string | null
  status?: string | null
  resignDate?: string | null
  createdAt?: string | null
  updatedAt?: string | null
}

/**
 * 单位会员详细信息 VO
 */
export interface CompanyMemberInfoVO {
  // 基本信息
  memberId: number
  type: string
  memberNo: string
  categoryId: number
  joinMethod: string
  auditStatus: string
  membershipStatus: string
  accountEmail: string
  userId: number
  createdAt: string
  expiryDate?: string | null

  // 委员会信息
  committeeId: number
  committeeName: string
  committeeRole: string
  joinedAt: string

  // 单位基本信息
  unitId: number
  unitName: string
  unitCategory: string
  industry: string
  areaCode: string
  address: string
  postalCode: string
  website: string
  establishedDate: string
  registeredCapital: number
  financingRound: string
  legalRepresentative: string
  unifiedSocialCreditCode: string
  businessScope?: string | null
  unitIntro?: string | null
  aiIndustryIntro?: string | null

  // 单位负责人信息
  leaderName: string
  leaderTitle?: string | null
  leaderPhone: string
  leaderEmail: string

  // 联系人信息
  contactName: string
  contactDept?: string | null
  contactOfficePhone?: string | null
  contactMobile: string
  contactEmail: string
  contactGender?: string | null
  contactTitle?: string | null
  contactJobTitle?: string | null
  contactFax?: string | null

  // 其他信息
  totalEmployees?: number | null
  otherSocieties?: string | null
  suggestions?: string | null
  recommender?: string | null
  interestCommitteeNames: string[]

  // 附件信息
  businessLicenseUrl: string
  qualificationList: AttachmentItem[]
  honorList: AttachmentItem[]
  otherList: AttachmentItem[]
}

/**
 * 附件项
 */
export interface AttachmentItem {
  id?: number
  fileName: string
  fileUrl: string
  uploadTime?: string
}

/** 订单（`Order` / `OrderVO`，含 `expired`） */
export interface OrderVO {
  id?: number | null
  memberId?: number | null
  memberCategoryId?: number | null
  amount?: number | null
  outTradeNo?: string | null
  date?: string | null
  paymentMethod?: string | null
  status: string
  payUrl?: string | null
  expireTime?: string | null
  transactionId?: string | null
  closeReason?: string | null
  createdAt?: string | null
  paidAt?: string | null
  closedAt?: string | null
  updatedAt?: string | null
  expired?: boolean | null
}

export interface OrderCreateVO {
  order: OrderVO
  payUrl?: string | null
  amount?: number | null
  categoryName?: string | null
}

export interface SysMessageVO {
  id: number
  userId: number
  messageType?: string | null
  messageContent?: string | null
  status?: string | null
  createdAt?: string | null
  updatedAt?: string | null
}
