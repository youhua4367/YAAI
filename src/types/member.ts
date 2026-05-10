/**
 * 用户注册参数
 * @description 用户注册时需要提交的参数，包含用户名、密码、手机号、邮箱、验证码等信息
 */
export interface RegisterParams {
  username: string
  password: string
  confirmPassword: string
  email: string
  phone: string
  code: string
  acceptAgreement: boolean
}

/**
 * 用户登录参数
 * @description 用户登录时需要提交的参数，phone和email至少填一个
 */
export interface LoginParams {
  phone?: string
  email?: string
  password: string
}

/**
 * 更新用户信息参数
 * @description 更新用户信息时需要提交的参数
 * @property id - 用户ID
 * @property username - 用户名
 * @property phone - 手机号码
 * @property email - 电子邮箱
 * @property status - 用户状态：0-待申请，1-待缴费，2-已缴费
 */
export interface UpdateUserParams {
  id: number
  username: string
  phone: string
  email: string
  status: number
}

/**
 * 取消会员申请参数
 * @description 取消会员申请时需要提交的参数
 */
export interface CancelApplyParams {
  memberId: number
}

/**
 * 教育经历请求参数
 * @description 会员教育经历信息
 */
export interface MemberEducationRequest {
  degree: string
  school: string
  major: string
  startDate?: string
  endDate?: string
  sortOrder?: number
}

/**
 * 工作经历请求参数
 * @description 会员工作经历信息
 */
export interface MemberWorkExperienceRequest {
  company: string
  department: string
  jobTitle: string
  workContent?: string
  status: string
  startDate?: string
  endDate?: string
  sortOrder?: number
}

/**
 * 个人会员申请请求参数
 * @description 个人会员申请时需要提交的完整参数，包含基本信息、个人信息、工作信息、教育背景、学术信息等
 */
export interface SingleMemberApplyRequest {
  // 基本信息
  type: string
  committeeId: number
  categoryId: number
  joinMethod: string
  auditStatus: string
  membershipStatus: string
  interestCommittees?: number[]
  recommender?: string
  img?: string

  // 个人基本信息
  name: string
  gender: string
  idCardType: string
  idCardNumber: string
  birthDate: string
  country: string
  nativePlace: string
  nationality: string
  politicalOutlook: string
  address: string
  postalCode?: string
  contactPhone: string
  landlinePhone?: string

  // 工作信息
  jobTitle: string
  industry?: string
  workUnit: string
  workDepartment: string
  position: string
  workContent?: string

  // 教育背景
  highestEducation: string
  major?: string
  educationExperiences: MemberEducationRequest[]

  // 工作经历
  workExperiences: MemberWorkExperienceRequest[]

  // 学术信息
  researchDirection: string
  publication?: string
  honors?: string
  projectExperience?: string

  // 其他信息
  areaCode: string
  reviewActivities?: number[]
}

/**
 * 附件请求参数
 * @description 文件附件信息，用于上传营业执照、资格证书等
 */
export interface AttachmentRequest {
  fileName: string
  fileUrl: string
}

/**
 * 单位会员申请请求参数
 * @description 单位会员申请时需要提交的完整参数，包含单位基本信息、负责人信息、联系人信息等
 */
export interface CompanyMemberApplyRequest {
  // 基础信息
  type: string
  committeeId: number
  categoryId: number
  joinMethod: string
  auditStatus: string
  membershipStatus: string
  interestCommittees?: number[]
  recommender?: string

  // 附件信息
  businessLicenseUrl: string
  qualifications?: AttachmentRequest[]
  honors?: AttachmentRequest[]
  others?: AttachmentRequest[]

  // 单位基本信息
  unitName: string
  unitCategory?: string
  industry?: string
  areaCode: string
  address: string
  postalCode?: string
  website?: string
  establishedDate?: string
  registeredCapital?: number
  financingRound?: string
  legalRepresentative?: string
  unifiedSocialCreditCode?: string
  businessScope?: string
  unitIntro?: string
  aiIndustryIntro?: string

  // 单位负责人信息
  leaderName?: string
  leaderTitle?: string
  leaderPhone?: string
  leaderEmail?: string

  // 联系人信息
  contactName: string
  contactDept?: string
  contactOfficePhone?: string
  contactMobile: string
  contactEmail: string
  totalEmployees?: number
  contactGender?: string
  contactTitle?: string
  contactJobTitle?: string
  contactFax?: string

  // 其他信息
  otherSocieties?: string
  suggestions?: string
}

// 类型别名导出
export type { RegisterParams as ApplyAccountFormModel }

export type { SingleMemberApplyRequest as SingleMemberFormModel }

export type { CompanyMemberApplyRequest as CompanyMemberFormModel }

export type { MemberEducationRequest as EducationExperience }

export type { MemberWorkExperienceRequest as WorkExperience }

export type { AttachmentRequest as Attachment }

export type ApplyProfileFormModel = SingleMemberApplyRequest | CompanyMemberApplyRequest
