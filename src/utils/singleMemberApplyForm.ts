import type { MemberEducationRequest, MemberWorkExperienceRequest, SingleMemberApplyRequest } from '@/types/member'
import type { MemberEducationVO, MemberSingleVO, MemberWorkExperienceVO } from '@/types/userCenter'

/** 提交申请时的默认入会元数据（与后端联调约定，可按接口调整） */
export const DEFAULT_SINGLE_APPLY_META = {
  type: '个人会员',
  committeeId: 1,
  categoryId: 2,
  joinMethod: '主动申请',
  auditStatus: '待审核',
  membershipStatus: '正常'
} as const

export type PersonalMemberApplyFormModel = {
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
  postalCode: string
  contactPhone: string
  landlinePhone: string
  jobTitle: string
  industry: string
  workUnit: string
  workDepartment: string
  position: string
  workContent: string
  highestEducation: string
  major: string
  researchDirection: string
  publication: string
  honors: string
  projectExperience: string
  areaCode: string
  recommender: string
  img: string
  educationExperiences: MemberEducationRequest[]
  workExperiences: MemberWorkExperienceRequest[]
}

export function createEmptyEducation(): MemberEducationRequest {
  return { degree: '', school: '', major: '', startDate: '', endDate: '', sortOrder: 0 }
}

export function createEmptyWorkExperience(): MemberWorkExperienceRequest {
  return {
    company: '',
    department: '',
    jobTitle: '',
    workContent: '',
    status: '在职',
    startDate: '',
    endDate: '',
    sortOrder: 0
  }
}

export function createEmptyPersonalMemberApplyForm(): PersonalMemberApplyFormModel {
  return {
    name: '',
    gender: '',
    idCardType: '',
    idCardNumber: '',
    birthDate: '',
    country: '',
    nativePlace: '',
    nationality: '',
    politicalOutlook: '',
    address: '',
    postalCode: '',
    contactPhone: '',
    landlinePhone: '',
    jobTitle: '',
    industry: '',
    workUnit: '',
    workDepartment: '',
    position: '',
    workContent: '',
    highestEducation: '',
    major: '',
    researchDirection: '',
    publication: '',
    honors: '',
    projectExperience: '',
    areaCode: '',
    recommender: '',
    img: '',
    educationExperiences: [createEmptyEducation()],
    workExperiences: [createEmptyWorkExperience()]
  }
}

function trimOrUndefined(value: string | undefined): string | undefined {
  const text = value?.trim()
  return text || undefined
}

export function memberSingleToApplyForm(
  vo?: MemberSingleVO | null,
  education: MemberEducationVO[] = [],
  work: MemberWorkExperienceVO[] = []
): PersonalMemberApplyFormModel {
  const empty = createEmptyPersonalMemberApplyForm()
  if (!vo) return empty

  return {
    ...empty,
    name: vo.name ?? '',
    gender: vo.gender ?? '',
    idCardType: vo.idCardType ?? '',
    idCardNumber: vo.idCardNumber ?? '',
    birthDate: vo.birthDate?.slice(0, 10) ?? '',
    country: vo.country ?? '',
    nativePlace: vo.nativePlace ?? '',
    nationality: vo.nationality ?? '',
    politicalOutlook: vo.politicalOutlook ?? '',
    address: vo.address ?? '',
    postalCode: vo.postalCode ?? '',
    contactPhone: vo.contactPhone ?? '',
    landlinePhone: vo.landlinePhone ?? '',
    jobTitle: vo.jobTitle ?? '',
    industry: vo.industry ?? '',
    workUnit: vo.workUnit ?? '',
    workDepartment: vo.workDepartment ?? '',
    position: vo.position ?? '',
    workContent: vo.workContent ?? '',
    highestEducation: vo.highestEducation ?? '',
    major: vo.major ?? '',
    researchDirection: vo.researchDirection ?? '',
    publication: vo.publication ?? '',
    honors: vo.honors ?? '',
    projectExperience: vo.projectExperience ?? '',
    areaCode: vo.areaCode ?? '',
    recommender: vo.recommender ?? '',
    img: vo.img ?? '',
    educationExperiences: education.length
      ? education.map((item) => ({
          degree: item.degree ?? '',
          school: item.school ?? '',
          major: item.major ?? '',
          startDate: item.startDate?.slice(0, 10) ?? '',
          endDate: item.endDate?.slice(0, 10) ?? '',
          sortOrder: item.sortOrder ?? 0
        }))
      : [createEmptyEducation()],
    workExperiences: work.length
      ? work.map((item) => ({
          company: item.company ?? '',
          department: item.department ?? '',
          jobTitle: item.jobTitle ?? '',
          workContent: item.workContent ?? '',
          status: item.status ?? '在职',
          startDate: item.startDate?.slice(0, 10) ?? '',
          endDate: item.endDate?.slice(0, 10) ?? '',
          sortOrder: item.sortOrder ?? 0
        }))
      : [createEmptyWorkExperience()]
  }
}

export function formToSingleMemberApplyRequest(
  form: PersonalMemberApplyFormModel
): SingleMemberApplyRequest {
  return {
    ...DEFAULT_SINGLE_APPLY_META,
    interestCommittees: [],
    reviewActivities: [],
    recommender: trimOrUndefined(form.recommender),
    img: trimOrUndefined(form.img),
    name: form.name.trim(),
    gender: form.gender.trim(),
    idCardType: form.idCardType.trim(),
    idCardNumber: form.idCardNumber.trim(),
    birthDate: form.birthDate.trim(),
    country: form.country.trim(),
    nativePlace: form.nativePlace.trim(),
    nationality: form.nationality.trim(),
    politicalOutlook: form.politicalOutlook.trim(),
    address: form.address.trim(),
    postalCode: trimOrUndefined(form.postalCode),
    contactPhone: form.contactPhone.trim(),
    landlinePhone: trimOrUndefined(form.landlinePhone),
    jobTitle: form.jobTitle.trim(),
    industry: trimOrUndefined(form.industry),
    workUnit: form.workUnit.trim(),
    workDepartment: form.workDepartment.trim(),
    position: form.position.trim(),
    workContent: trimOrUndefined(form.workContent),
    highestEducation: form.highestEducation.trim(),
    major: trimOrUndefined(form.major),
    educationExperiences: form.educationExperiences.map((item, index) => ({
      degree: item.degree.trim(),
      school: item.school.trim(),
      major: item.major.trim(),
      startDate: trimOrUndefined(item.startDate),
      endDate: trimOrUndefined(item.endDate),
      sortOrder: item.sortOrder ?? index
    })),
    workExperiences: form.workExperiences.map((item, index) => ({
      company: item.company.trim(),
      department: item.department.trim(),
      jobTitle: item.jobTitle.trim(),
      workContent: trimOrUndefined(item.workContent),
      status: item.status.trim(),
      startDate: trimOrUndefined(item.startDate),
      endDate: trimOrUndefined(item.endDate),
      sortOrder: item.sortOrder ?? index
    })),
    researchDirection: form.researchDirection.trim(),
    publication: trimOrUndefined(form.publication),
    honors: trimOrUndefined(form.honors),
    projectExperience: trimOrUndefined(form.projectExperience),
    areaCode: form.areaCode.trim()
  }
}
