import type { AttachmentRequest, CompanyMemberApplyFormModel, CompanyMemberApplyRequest } from '@/types/member'

/** 提交申请时的默认入会元数据（单位会员） */
export const DEFAULT_COMPANY_APPLY_META = {
  type: '单位会员',
  committeeId: 1,
  categoryId: 1, // 理事长单位，根据实际情况调整
  joinMethod: '主动申请',
  auditStatus: '待审核',
  membershipStatus: '正常'
} as const

export function createEmptyAttachment(): AttachmentRequest {
  return { fileName: '', fileUrl: '' }
}

export function createEmptyCompanyMemberApplyForm(): CompanyMemberApplyFormModel {
  return {
    committeeId: null,
    // 单位基本信息
    unitName: '',
    unitCategory: '',
    industry: '',
    areaCode: '',
    address: '',
    postalCode: '',
    website: '',
    establishedDate: '',
    registeredCapital: null,
    financingRound: '',
    legalRepresentative: '',
    unifiedSocialCreditCode: '',
    businessScope: '',
    unitIntro: '',
    aiIndustryIntro: '',

    // 单位负责人信息
    leaderName: '',
    leaderTitle: '',
    leaderPhone: '',
    leaderEmail: '',

    // 联系人信息
    contactName: '',
    contactDept: '',
    contactOfficePhone: '',
    contactMobile: '',
    contactEmail: '',
    totalEmployees: null,
    contactGender: '',
    contactTitle: '',
    contactJobTitle: '',
    contactFax: '',

    // 其他信息
    otherSocieties: '',
    suggestions: '',
    recommender: '',

    // 附件
    businessLicenseUrl: '',
    qualifications: [createEmptyAttachment()],
    honors: [createEmptyAttachment()],
    others: [createEmptyAttachment()]
  }
}

function trimOrUndefined(value: string | undefined): string | undefined {
  const text = value?.trim()
  return text || undefined
}

export function formToCompanyMemberApplyRequest(
  form: CompanyMemberApplyFormModel
): CompanyMemberApplyRequest {
  return {
    ...DEFAULT_COMPANY_APPLY_META,
    committeeId: form.committeeId ?? 1, // 优先使用表单中的委员会 ID
    interestCommittees: [],
    recommender: trimOrUndefined(form.recommender),

    // 附件
    businessLicenseUrl: form.businessLicenseUrl.trim(),
    qualifications: form.qualifications
      .filter((item) => item.fileUrl.trim())
      .map((item) => ({
        fileName: item.fileName.trim(),
        fileUrl: item.fileUrl.trim()
      })),
    honors: form.honors
      .filter((item) => item.fileUrl.trim())
      .map((item) => ({
        fileName: item.fileName.trim(),
        fileUrl: item.fileUrl.trim()
      })),
    others: form.others
      .filter((item) => item.fileUrl.trim())
      .map((item) => ({
        fileName: item.fileName.trim(),
        fileUrl: item.fileUrl.trim()
      })),

    // 单位基本信息
    unitName: form.unitName.trim(),
    unitCategory: trimOrUndefined(form.unitCategory),
    industry: trimOrUndefined(form.industry),
    areaCode: form.areaCode.trim(),
    address: form.address.trim(),
    postalCode: trimOrUndefined(form.postalCode),
    website: trimOrUndefined(form.website),
    establishedDate: trimOrUndefined(form.establishedDate),
    registeredCapital: form.registeredCapital ?? undefined,
    financingRound: trimOrUndefined(form.financingRound),
    legalRepresentative: trimOrUndefined(form.legalRepresentative),
    unifiedSocialCreditCode: trimOrUndefined(form.unifiedSocialCreditCode),
    businessScope: trimOrUndefined(form.businessScope),
    unitIntro: trimOrUndefined(form.unitIntro),
    aiIndustryIntro: trimOrUndefined(form.aiIndustryIntro),

    // 单位负责人信息
    leaderName: trimOrUndefined(form.leaderName),
    leaderTitle: trimOrUndefined(form.leaderTitle),
    leaderPhone: trimOrUndefined(form.leaderPhone),
    leaderEmail: trimOrUndefined(form.leaderEmail),

    // 联系人信息
    contactName: form.contactName.trim(),
    contactDept: trimOrUndefined(form.contactDept),
    contactOfficePhone: trimOrUndefined(form.contactOfficePhone),
    contactMobile: form.contactMobile.trim(),
    contactEmail: form.contactEmail.trim(),
    totalEmployees: form.totalEmployees ?? undefined,
    contactGender: trimOrUndefined(form.contactGender),
    contactTitle: trimOrUndefined(form.contactTitle),
    contactJobTitle: trimOrUndefined(form.contactJobTitle),
    contactFax: trimOrUndefined(form.contactFax),

    // 其他信息
    otherSocieties: trimOrUndefined(form.otherSocieties),
    suggestions: trimOrUndefined(form.suggestions)
  }
}
