<template>
  <div class="apply-form">
    <div class="member-type-switch">
      <h2 class="form-title">{{ isPersonal ? '个人会员申请' : '单位会员申请' }}</h2>
      <div class="switch-buttons">
        <el-button
          class="switch-btn"
          :class="{ active: isPersonal }"
          @click="switchMemberType('personal')"
        >
          个人会员
        </el-button>
        <el-button
          class="switch-btn"
          :class="{ active: !isPersonal }"
          @click="switchMemberType('organization')"
        >
          单位会员
        </el-button>
      </div>
    </div>

    <el-form
      v-if="isPersonal"
      ref="singleFormRef"
      :model="singleModel"
      :rules="singleRules"
      :validate-on-rule-change="false"
      label-position="top"
      status-icon
    >
      <div class="form-section">
        <h3 class="section-title">基本信息</h3>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="真实姓名" prop="name" required>
              <el-input v-model="singleModel.name" placeholder="请输入真实姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="性别" prop="gender" required>
              <el-select v-model="singleModel.gender" placeholder="请选择性别" style="width: 100%">
                <el-option label="男" value="男" />
                <el-option label="女" value="女" />
                <el-option label="未知" value="未知" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="证件类型" prop="idCardType" required>
              <el-select v-model="singleModel.idCardType" placeholder="请选择证件类型" style="width: 100%">
                <el-option label="身份证" value="身份证" />
                <el-option label="护照" value="护照" />
                <el-option label="其他" value="其他" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="证件号码" prop="idCardNumber" required>
              <el-input v-model="singleModel.idCardNumber" placeholder="请输入证件号码" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="出生日期" prop="birthDate" required>
              <el-date-picker
                v-model="singleModel.birthDate"
                type="date"
                placeholder="请选择出生日期"
                style="width: 100%"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="国家地区" prop="country" required>
              <el-input v-model="singleModel.country" placeholder="请输入国家地区" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="籍贯" prop="nativePlace" required>
              <el-input v-model="singleModel.nativePlace" placeholder="请输入籍贯" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="民族" prop="nationality" required>
              <el-input v-model="singleModel.nationality" placeholder="请输入民族" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="政治面貌" prop="politicalOutlook" required>
              <el-input v-model="singleModel.politicalOutlook" placeholder="请输入政治面貌" />
            </el-form-item>
          </el-col>
        </el-row>
      </div>

      <div class="form-section">
        <h3 class="section-title">联系方式</h3>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="通讯地址" prop="address" required>
              <el-input v-model="singleModel.address" placeholder="请输入通讯地址" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="邮政编码" prop="postalCode">
              <el-input v-model="singleModel.postalCode" placeholder="请输入邮政编码" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="行政地区代码" prop="areaCode" required>
              <el-input v-model="singleModel.areaCode" placeholder="请输入6位行政地区代码" maxlength="6" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="手机号码" prop="contactPhone" required>
              <el-input v-model="singleModel.contactPhone" placeholder="请输入手机号码" maxlength="11" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="固定电话" prop="landlinePhone">
              <el-input v-model="singleModel.landlinePhone" placeholder="请输入固定电话" />
            </el-form-item>
          </el-col>
        </el-row>
      </div>

      <div class="form-section">
        <h3 class="section-title">工作信息</h3>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="职称/身份" prop="jobTitle" required>
              <el-input v-model="singleModel.jobTitle" placeholder="请输入职称或身份" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属行业" prop="industry">
              <el-input v-model="singleModel.industry" placeholder="请输入所属行业" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="当前工作单位" prop="workUnit" required>
              <el-input v-model="singleModel.workUnit" placeholder="请输入当前工作单位" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工作部门" prop="workDepartment" required>
              <el-input v-model="singleModel.workDepartment" placeholder="请输入工作部门" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工作职务" prop="position" required>
              <el-input v-model="singleModel.position" placeholder="请输入工作职务" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工作内容" prop="workContent">
              <el-input v-model="singleModel.workContent" type="textarea" placeholder="请输入工作内容" :rows="3" />
            </el-form-item>
          </el-col>
        </el-row>
      </div>

      <div class="form-section">
        <h3 class="section-title">教育经历</h3>
        <div
          v-for="(exp, index) in singleModel.educationExperiences"
          :key="index"
          class="experience-item"
        >
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item
                  :label="'学历/学位'"
                  :prop="`educationExperiences.${index}.degree`"
                  :rules="{ required: true, message: '请输入学历/学位', trigger: 'submit' }"
                >
                <el-input v-model="exp.degree" placeholder="请输入学历或学位" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                  :label="'毕业院校'"
                  :prop="`educationExperiences.${index}.school`"
                  :rules="{ required: true, message: '请输入毕业院校', trigger: 'submit' }"
                >
                <el-input v-model="exp.school" placeholder="请输入毕业院校" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                :label="'专业'"
                :prop="`educationExperiences.${index}.major`"
                :rules="{ required: true, message: '请输入专业', trigger: 'submit' }"
              >
                <el-input v-model="exp.major" placeholder="请输入专业" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="'入学时间'" :prop="`educationExperiences.${index}.startDate`">
                <el-date-picker
                  v-model="exp.startDate"
                  type="date"
                  placeholder="请选择入学时间"
                  style="width: 100%"
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="'毕业时间'" :prop="`educationExperiences.${index}.endDate`">
                <el-date-picker
                  v-model="exp.endDate"
                  type="date"
                  placeholder="请选择毕业时间"
                  style="width: 100%"
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-button
            v-if="singleModel.educationExperiences.length > 1"
            class="btn-remove"
            type="danger"
            plain
            @click="removeEducationExperience(index)"
          >
            删除
          </el-button>
        </div>
        <el-button class="btn-add" type="primary" plain @click="addEducationExperience">
          添加教育经历
        </el-button>
      </div>

      <div class="form-section">
        <h3 class="section-title">工作经历</h3>
        <div
          v-for="(exp, index) in singleModel.workExperiences"
          :key="index"
          class="experience-item"
        >
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item
                :label="'工作单位'"
                :prop="`workExperiences.${index}.company`"
                :rules="{ required: true, message: '请输入工作单位', trigger: 'submit' }"
              >
                <el-input v-model="exp.company" placeholder="请输入工作单位" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                :label="'工作部门'"
                :prop="`workExperiences.${index}.department`"
                :rules="{ required: true, message: '请输入工作部门', trigger: 'submit' }"
              >
                <el-input v-model="exp.department" placeholder="请输入工作部门" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                :label="'职称/职务'"
                :prop="`workExperiences.${index}.jobTitle`"
                :rules="{ required: true, message: '请输入职称/职务', trigger: 'submit' }"
              >
                <el-input v-model="exp.jobTitle" placeholder="请输入职称或职务" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                :label="'工作状态'"
                :prop="`workExperiences.${index}.status`"
                :rules="{ required: true, message: '请选择工作状态', trigger: 'submit' }"
              >
                <el-select v-model="exp.status" placeholder="请选择工作状态" style="width: 100%">
                  <el-option label="在职" value="在职" />
                  <el-option label="离职" value="离职" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="'工作内容'" :prop="`workExperiences.${index}.workContent`">
                <el-input v-model="exp.workContent" type="textarea" placeholder="请输入工作内容" :rows="3" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="'入职时间'" :prop="`workExperiences.${index}.startDate`">
                <el-date-picker
                  v-model="exp.startDate"
                  type="date"
                  placeholder="请选择入职时间"
                  style="width: 100%"
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="'离职时间'" :prop="`workExperiences.${index}.endDate`">
                <el-date-picker
                  v-model="exp.endDate"
                  type="date"
                  placeholder="请选择离职时间"
                  style="width: 100%"
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-button
            v-if="singleModel.workExperiences.length > 1"
            class="btn-remove"
            type="danger"
            plain
            @click="removeWorkExperience(index)"
          >
            删除
          </el-button>
        </div>
        <el-button class="btn-add" type="primary" plain @click="addWorkExperience">
          添加工作经历
        </el-button>
      </div>

      <div class="form-section">
        <h3 class="section-title">学术信息</h3>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="最高学历" prop="highestEducation" required>
              <el-input v-model="singleModel.highestEducation" placeholder="请输入最高学历" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所学专业" prop="major">
              <el-input v-model="singleModel.major" placeholder="请输入所学专业" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="人工智能研究方向" prop="researchDirection" required>
              <el-input
                v-model="singleModel.researchDirection"
                type="textarea"
                placeholder="请输入人工智能研究方向"
                :rows="4"
                maxlength="500"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="发表论文及出版著作" prop="publication">
              <el-input
                v-model="singleModel.publication"
                type="textarea"
                placeholder="请输入发表论文及出版著作（2000字以内）"
                :rows="4"
                maxlength="2000"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="曾获荣誉情况" prop="honors">
              <el-input
                v-model="singleModel.honors"
                type="textarea"
                placeholder="请输入曾获荣誉情况（500字以内）"
                :rows="4"
                maxlength="500"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="主持项目经历" prop="projectExperience">
              <el-input
                v-model="singleModel.projectExperience"
                type="textarea"
                placeholder="请输入主持项目经历（500字以内）"
                :rows="4"
                maxlength="500"
                show-word-limit
              />
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </el-form>

    <el-form
      v-else
      ref="companyFormRef"
      :model="companyModel"
      :rules="companyRules"
      :validate-on-rule-change="false"
      label-position="top"
      status-icon
    >
      <div class="form-section">
        <h3 class="section-title">基础信息</h3>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="单位名称" prop="unitName" required>
              <el-input v-model="companyModel.unitName" placeholder="请输入单位全称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="单位类别" prop="unitCategory">
              <el-input v-model="companyModel.unitCategory" placeholder="请输入单位类别" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属行业" prop="industry">
              <el-input v-model="companyModel.industry" placeholder="请输入所属行业" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="行政地区代码" prop="areaCode" required>
              <el-input v-model="companyModel.areaCode" placeholder="请输入6位行政地区代码" maxlength="6" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="通讯地址" prop="address" required>
              <el-input v-model="companyModel.address" placeholder="请输入通讯地址" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮政编码" prop="postalCode">
              <el-input v-model="companyModel.postalCode" placeholder="请输入邮政编码" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="单位官网" prop="website">
              <el-input v-model="companyModel.website" placeholder="请输入单位官网" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="成立时间" prop="establishedDate">
              <el-date-picker
                v-model="companyModel.establishedDate"
                type="date"
                placeholder="请选择成立时间"
                style="width: 100%"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="注册资本（万元）" prop="registeredCapital">
              <el-input-number v-model="companyModel.registeredCapital" placeholder="请输入注册资本" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="融资轮次" prop="financingRound">
              <el-input v-model="companyModel.financingRound" placeholder="请输入融资轮次" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="法定代表人" prop="legalRepresentative">
              <el-input v-model="companyModel.legalRepresentative" placeholder="请输入法定代表人" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="统一社会信用代码" prop="unifiedSocialCreditCode">
              <el-input v-model="companyModel.unifiedSocialCreditCode" placeholder="请输入18位统一社会信用代码" maxlength="18" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="职工总人数" prop="totalEmployees">
              <el-input-number v-model="companyModel.totalEmployees" placeholder="请输入职工总人数" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="业务范围" prop="businessScope">
              <el-input
                v-model="companyModel.businessScope"
                type="textarea"
                placeholder="请输入业务范围（最多200字）"
                :rows="3"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </div>

      <div class="form-section">
        <h3 class="section-title">附件信息</h3>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="营业执照" prop="businessLicenseUrl" required>
              <el-row :gutter="10" align="middle">
                <el-col :span="22">
                  <el-upload
                class="upload-demo"
                action="/api/upload"
                :on-success="(response: { data?: { url?: string } }, uploadFile: { name: string }) => handleBusinessLicenseUpload(response, uploadFile)"
                :on-error="handleUploadError"
                :auto-upload="true"
                :limit="1"
                :file-list="businessLicenseFileList"
              >
                    <el-button type="primary">点击上传</el-button>
                    <template #tip>
                      <div class="el-upload__tip">
                        只能上传jpg/png文件，且不超过5MB
                      </div>
                    </template>
                  </el-upload>
                  <el-input
                    v-if="companyModel.businessLicenseUrl"
                    v-model="companyModel.businessLicenseUrl"
                    placeholder="营业执照URL"
                    readonly
                    style="margin-top: 8px"
                  />
                </el-col>
              </el-row>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="资格证书" prop="qualifications">
              <div class="attachment-list">
                <div 
                  v-for="(item, index) in (companyModel.qualifications || [])" 
                  :key="index" 
                  class="compact-attachment-item"
                >
                  <div class="action-group">
                    <el-upload
                      class="upload-trigger"
                      action="/api/upload"
                      :on-success="(res: any, file: any) => handleAttachmentUpload('qualifications', index, res, file)"
                      :show-file-list="false"
                      :limit="1"
                    >
                      <el-button 
                        type="primary" 
                        class="primary-action" 
                        :icon="Upload"
                      >
                        {{ item.fileUrl ? '重新上传' : '上传附件' }}
                      </el-button>
                    </el-upload>

                    <el-button 
                      type="danger" 
                      plain 
                      class="danger-action" 
                      :icon="Delete"
                      @click="removeAttachment('qualifications', index)"
                    />
                  </div>

                  <div v-if="item.fileName" class="file-name-info" :title="item.fileName">
                    <el-icon class="file-icon"><Document /></el-icon>
                    <span class="name-text">{{ item.fileName }}</span>
                  </div>
                </div>
              </div>

              <el-button 
                type="primary" 
                plain 
                class="add-item-btn" 
                :icon="Plus" 
                @click="addAttachment('qualifications')"
              >
                添加资格证书
              </el-button>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="荣誉证书" prop="honors">
              <div class="attachment-list">
                <div
                  v-for="(item, index) in (companyModel.honors || [])"
                  :key="index"
                  class="compact-attachment-item"
                >
                  <div class="action-group">
                    <el-upload
                      class="upload-trigger"
                      action="/api/upload"
                      :on-success="(res: any, file: any) => handleAttachmentUpload('honors', index, res, file)"
                      :show-file-list="false"
                      :limit="1"
                    >
                      <el-button
                        type="primary"
                        class="primary-action"
                        :icon="Upload"
                      >
                        {{ item.fileUrl ? '重新上传' : '上传附件' }}
                      </el-button>
                    </el-upload>

                    <el-button
                      type="danger"
                      plain
                      class="danger-action"
                      :icon="Delete"
                      @click="removeAttachment('honors', index)"
                    />
                  </div>

                  <div v-if="item.fileName" class="file-name-info" :title="item.fileName">
                    <el-icon class="file-icon"><Document /></el-icon>
                    <span class="name-text">{{ item.fileName }}</span>
                  </div>
                </div>
              </div>

              <el-button
                type="primary"
                plain
                class="add-item-btn"
                :icon="Plus"
                @click="addAttachment('honors')"
              >
                添加荣誉证书
              </el-button>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="其他附件" prop="others">
              <div class="attachment-list">
                <div
                  v-for="(item, index) in (companyModel.others || [])"
                  :key="index"
                  class="compact-attachment-item"
                >
                  <div class="action-group">
                    <el-upload
                      class="upload-trigger"
                      action="/api/upload"
                      :on-success="(res: any, file: any) => handleAttachmentUpload('others', index, res, file)"
                      :show-file-list="false"
                      :limit="1"
                    >
                      <el-button
                        type="primary"
                        class="primary-action"
                        :icon="Upload"
                      >
                        {{ item.fileUrl ? '重新上传' : '上传附件' }}
                      </el-button>
                    </el-upload>

                    <el-button
                      type="danger"
                      plain
                      class="danger-action"
                      :icon="Delete"
                      @click="removeAttachment('others', index)"
                    />
                  </div>

                  <div v-if="item.fileName" class="file-name-info" :title="item.fileName">
                    <el-icon class="file-icon"><Document /></el-icon>
                    <span class="name-text">{{ item.fileName }}</span>
                  </div>
                </div>
              </div>

              <el-button
                type="primary"
                plain
                class="add-item-btn"
                :icon="Plus"
                @click="addAttachment('others')"
              >
                添加其他附件
              </el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </div>

      <div class="form-section">
        <h3 class="section-title">单位简介</h3>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="单位简介" prop="unitIntro">
              <el-input v-model="companyModel.unitIntro" type="textarea" placeholder="请输入单位简介" :rows="5" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="AI相关产业介绍" prop="aiIndustryIntro">
              <el-input v-model="companyModel.aiIndustryIntro" type="textarea" placeholder="请输入在人工智能行业的相关情况" :rows="5" />
            </el-form-item>
          </el-col>
        </el-row>
      </div>

      <div class="form-section">
        <h3 class="section-title">单位负责人信息</h3>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="负责人姓名" prop="leaderName">
              <el-input v-model="companyModel.leaderName" placeholder="请输入负责人姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="负责人职务" prop="leaderTitle">
              <el-input v-model="companyModel.leaderTitle" placeholder="请输入负责人职务" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="负责人手机号" prop="leaderPhone">
              <el-input v-model="companyModel.leaderPhone" placeholder="请输入负责人手机号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="负责人邮箱" prop="leaderEmail">
              <el-input v-model="companyModel.leaderEmail" placeholder="请输入负责人邮箱" />
            </el-form-item>
          </el-col>
        </el-row>
      </div>

      <div class="form-section">
        <h3 class="section-title">联系人信息</h3>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="联系人姓名" prop="contactName" required>
              <el-input v-model="companyModel.contactName" placeholder="请输入联系人姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系人性别" prop="contactGender">
              <el-select v-model="companyModel.contactGender" placeholder="请选择性别" style="width: 100%">
                <el-option label="男" value="男" />
                <el-option label="女" value="女" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系人职务" prop="contactJobTitle">
              <el-input v-model="companyModel.contactJobTitle" placeholder="请输入联系人职务" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系人职称" prop="contactTitle">
              <el-input v-model="companyModel.contactTitle" placeholder="请输入联系人职称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系人手机" prop="contactMobile" required>
              <el-input v-model="companyModel.contactMobile" placeholder="请输入联系人手机" maxlength="11" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系人邮箱" prop="contactEmail" required>
              <el-input v-model="companyModel.contactEmail" placeholder="请输入联系人邮箱" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系人部门" prop="contactDept">
              <el-input v-model="companyModel.contactDept" placeholder="请输入联系人部门" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="办公电话" prop="contactOfficePhone">
              <el-input v-model="companyModel.contactOfficePhone" placeholder="请输入办公电话" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系人传真" prop="contactFax">
              <el-input v-model="companyModel.contactFax" placeholder="请输入联系人传真" />
            </el-form-item>
          </el-col>
        </el-row>
      </div>

      <div class="form-section">
        <h3 class="section-title">其他信息</h3>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="加入其他科技社团情况" prop="otherSocieties">
              <el-input v-model="companyModel.otherSocieties" type="textarea" placeholder="请输入加入其他科技社团情况" :rows="3" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="对学会发展意见建议" prop="suggestions">
              <el-input v-model="companyModel.suggestions" type="textarea" placeholder="请输入对学会发展的意见建议" :rows="3" />
            </el-form-item>
          </el-col>
        </el-row>
      </div>

      <div class="form-section">
        <h3 class="section-title">其他信息</h3>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="加入的其他学会/协会" prop="otherSocieties">
              <el-input v-model="companyModel.otherSocieties" placeholder="请输入加入的其他学会或协会" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="建议与意见" prop="suggestions">
              <el-input v-model="companyModel.suggestions" type="textarea" placeholder="请输入对学会的建议与意见" :rows="4" />
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </el-form>

    <div class="step-actions">
      <el-button @click="$emit('prev')" :disabled="loading">上一步</el-button>
      <el-button type="primary" @click="handleSubmit" :disabled="loading" :loading="loading">
        {{ loading ? '提交中...' : '提交申请' }}
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch, computed, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { Upload, Delete, Plus, Document } from '@element-plus/icons-vue'
import type { SingleMemberFormModel, CompanyMemberFormModel, EducationExperience, WorkExperience } from '@/types/apply'
import { SINGLE_MEMBER_FORM_CONFIG, COMPANY_MEMBER_FORM_CONFIG } from '@/config/apply'
import { submitSingleMemberApplication, submitCompanyMemberApplication } from '@/api/member'

const props = defineProps<{
  modelValue: SingleMemberFormModel | CompanyMemberFormModel
  memberType: 'personal' | 'organization'
}>()

const emit = defineEmits<{
  'update:modelValue': [SingleMemberFormModel | CompanyMemberFormModel]
  prev: []
  success: []
  memberTypeChange: ['personal' | 'organization']
}>()

const isPersonal = computed(() => props.memberType === 'personal')
const single= COMPANY_MEMBER_FORM_CONFIG
const loading = ref(false)
const singleFormRef = ref<FormInstance>()
const companyFormRef = ref<FormInstance>()

const validatePhone = (_rule: unknown, value: string, callback: (error?: Error) => void) => {
  if (!value) {
    callback(new Error('请输入手机号码'))
    return
  }
  if (!/^1[3-9]\d{9}$/.test(value)) {
    callback(new Error('请输入正确的手机号码'))
    return
  }
  callback()
}

const validateLandline = (_rule: unknown, value: string, callback: (error?: Error) => void) => {
  if (value && !/^\d{3,4}-?\d{7,8}$/.test(value)) {
    callback(new Error('请输入正确的固定电话号码'))
    return
  }
  callback()
}

const validateAreaCode = (_rule: unknown, value: string, callback: (error?: Error) => void) => {
  if (!value) {
    callback(new Error('请输入行政地区代码'))
    return
  }
  if (!/^\d{6}$/.test(value)) {
    callback(new Error('行政地区代码必须为6位数字'))
    return
  }
  callback()
}

const validateEmail = (_rule: unknown, value: string, callback: (error?: Error) => void) => {
  if (!value) {
    callback(new Error('请输入联系人邮箱'))
    return
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    callback(new Error('请输入正确的邮箱地址'))
    return
  }
  callback()
}

const singleRules: FormRules<SingleMemberFormModel> = {
  name: [{ required: true, message: '请输入真实姓名', trigger: 'submit' }],
  gender: [{ required: true, message: '请选择性别', trigger: 'submit' }],
  idCardType: [{ required: true, message: '请选择证件类型', trigger: 'submit' }],
  idCardNumber: [{ required: true, message: '请输入证件号码', trigger: 'submit' }],
  birthDate: [{ required: true, message: '请选择出生日期', trigger: 'submit' }],
  country: [{ required: true, message: '请输入国家地区', trigger: 'submit' }],
  nativePlace: [{ required: true, message: '请输入籍贯', trigger: 'submit' }],
  nationality: [{ required: true, message: '请输入民族', trigger: 'submit' }],
  politicalOutlook: [{ required: true, message: '请输入政治面貌', trigger: 'submit' }],
  address: [{ required: true, message: '请输入通讯地址', trigger: 'submit' }],
  contactPhone: [{ validator: validatePhone, trigger: 'submit' }],
  landlinePhone: [{ validator: validateLandline, trigger: 'submit' }],
  jobTitle: [{ required: true, message: '请输入职称/身份', trigger: 'submit' }],
  workUnit: [{ required: true, message: '请输入当前工作单位', trigger: 'submit' }],
  workDepartment: [{ required: true, message: '请输入工作部门', trigger: 'submit' }],
  position: [{ required: true, message: '请输入工作职务', trigger: 'submit' }],
  highestEducation: [{ required: true, message: '请输入最高学历', trigger: 'submit' }],
  researchDirection: [{ required: true, message: '请输入人工智能研究方向', trigger: 'submit' }],
  areaCode: [{ validator: validateAreaCode, trigger: 'submit' }]
}

const companyRules: FormRules<CompanyMemberFormModel> = {
  unitName: [{ required: true, message: '请输入单位名称', trigger: 'submit' }],
  areaCode: [{ required: true, message: '请输入行政地区代码', trigger: 'submit' }],
  address: [{ required: true, message: '请输入通讯地址', trigger: 'submit' }],
  businessLicenseUrl: [{ required: true, message: '请输入营业执照URL', trigger: 'submit' }],
  contactName: [{ required: true, message: '请输入联系人姓名', trigger: 'submit' }],
  contactMobile: [{ validator: validatePhone, trigger: 'submit' }],
  contactEmail: [{ validator: validateEmail, trigger: 'submit' }]
}

const createDefaultEducationExperience = (): EducationExperience => ({
  degree: '',
  school: '',
  major: '',
  startDate: '',
  endDate: '',
  sortOrder: 0
})

const createDefaultWorkExperience = (): WorkExperience => ({
  company: '',
  department: '',
  jobTitle: '',
  workContent: '',
  status: '',
  startDate: '',
  endDate: '',
  sortOrder: 0
})

const createDefaultSingleModel = (): SingleMemberFormModel => ({
  type: 'personal',
  committeeId: 0,
  categoryId: 0,
  joinMethod: '',
  auditStatus: '',
  membershipStatus: '',
  interestCommittees: [],
  recommender: '',
  img: '',
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
  educationExperiences: [createDefaultEducationExperience()],
  workExperiences: [createDefaultWorkExperience()],
  researchDirection: '',
  publication: '',
  honors: '',
  projectExperience: '',
  areaCode: '',
  reviewActivities: []
})

const createDefaultCompanyModel = (): CompanyMemberFormModel => ({
  type: 'organization',
  committeeId: 0,
  categoryId: 0,
  joinMethod: '',
  auditStatus: '',
  membershipStatus: '',
  interestCommittees: [],
  recommender: '',
  businessLicenseUrl: '',
  qualifications: [],
  honors: [],
  others: [],
  unitName: '',
  unitCategory: '',
  industry: '',
  areaCode: '',
  address: '',
  postalCode: '',
  website: '',
  establishedDate: '',
  registeredCapital: 0,
  financingRound: '',
  legalRepresentative: '',
  unifiedSocialCreditCode: '',
  businessScope: '',
  unitIntro: '',
  aiIndustryIntro: '',
  leaderName: '',
  leaderTitle: '',
  leaderPhone: '',
  leaderEmail: '',
  contactName: '',
  contactDept: '',
  contactOfficePhone: '',
  contactMobile: '',
  contactEmail: '',
  totalEmployees: 0,
  contactGender: '',
  contactTitle: '',
  contactJobTitle: '',
  contactFax: '',
  otherSocieties: '',
  suggestions: ''
})

const singleModel = reactive<SingleMemberFormModel>(createDefaultSingleModel())
const companyModel = reactive<CompanyMemberFormModel>(createDefaultCompanyModel())
const businessLicenseFileList = ref<any[]>([])

const switchMemberType = (type: 'personal' | 'organization') => {
  const newModel = type === 'personal' ? createDefaultSingleModel() : createDefaultCompanyModel()
  emit('update:modelValue', newModel)
  emit('memberTypeChange', type)
}

const handleBusinessLicenseUpload = (response: { data?: { url?: string } }, uploadFile: { name: string }) => {
  if (response && response.data && response.data.url) {
    companyModel.businessLicenseUrl = response.data.url
    businessLicenseFileList.value = [{
      name: uploadFile.name,
      url: response.data.url
    }]
    ElMessage.success('营业执照上传成功')
  } else {
    ElMessage.error('上传失败，请重试')
  }
}

const handleAttachmentUpload = (type: 'qualifications' | 'honors' | 'others', index: number, response: { data?: { url?: string } }, uploadFile: { name: string }) => {
  if (response && response.data && response.data.url) {
    if (!companyModel[type]) {
      companyModel[type] = []
    }
    companyModel[type][index].fileName = uploadFile.name
    companyModel[type][index].fileUrl = response.data.url
    ElMessage.success('文件上传成功')
  } else {
    ElMessage.error('上传失败，请重试')
  }
}

const handleUploadError = (error: unknown) => {
  console.error('上传失败:', error)
  ElMessage.error('上传失败，请重试')
}

watch(() => props.modelValue, (value) => {
  if (value && 'type' in value) {
    if (value.type === 'personal') {
      Object.assign(singleModel, value)
      if (!singleModel.educationExperiences || singleModel.educationExperiences.length === 0) {
        singleModel.educationExperiences = [createDefaultEducationExperience()]
      }
      if (!singleModel.workExperiences || singleModel.workExperiences.length === 0) {
        singleModel.workExperiences = [createDefaultWorkExperience()]
      }
    } else {
      Object.assign(companyModel, value)
    }
  }
}, { deep: true, immediate: true })

const addEducationExperience = () => {
  if (!singleModel.educationExperiences) {
    singleModel.educationExperiences = []
  }
  singleModel.educationExperiences.push({
    school: '',
    major: '',
    degree: '',
    startDate: '',
    endDate: ''
  })
}

const removeEducationExperience = (index: number) => {
  if (singleModel.educationExperiences) {
    singleModel.educationExperiences.splice(index, 1)
  }
}

const addWorkExperience = () => {
  if (!singleModel.workExperiences) {
    singleModel.workExperiences = []
  }
  singleModel.workExperiences.push({
    company: '',
    department: '',
    jobTitle: '',
    status: '在职',
    startDate: '',
    endDate: ''
  })
}

const removeWorkExperience = (index: number) => {
  if (singleModel.workExperiences) {
    singleModel.workExperiences.splice(index, 1)
  }
}

const addAttachment = (type: 'qualifications' | 'honors' | 'others') => {
  const newAttachment = {
    fileName: '',
    fileUrl: ''
  }
  if (!companyModel[type]) {
    companyModel[type] = []
  }
  companyModel[type].push(newAttachment)
}

const removeAttachment = (type: 'qualifications' | 'honors' | 'others', index: number) => {
  if (companyModel[type]) {
    companyModel[type].splice(index, 1)
  }
}

const handleSubmit = async () => {
  try {
    loading.value = true
    
    if (isPersonal.value) {
      const valid = await singleFormRef.value?.validate().catch(() => false)
      if (!valid) {
        // 3秒后自动清除校验警告
        setTimeout(() => {
          singleFormRef.value?.clearValidate()
        }, 3000)
        return
      }
      
      const submitData = {
        ...singleModel,
        type: '个人会员',
        committeeId: 1,
        categoryId: 2,
        joinMethod: '主动申请',
        auditStatus: '待审核',
        membershipStatus: '正常'
      }
      await submitSingleMemberApplication(submitData)
    } else {
      const valid = await companyFormRef.value?.validate().catch(() => false)
      if (!valid) {
        // 3秒后自动清除校验警告
        setTimeout(() => {
          companyFormRef.value?.clearValidate()
        }, 3000)
        return
      }
      
      const submitData = {
        ...companyModel,
        type: '单位会员',
        committeeId: 1,
        categoryId: 3,
        joinMethod: '主动申请',
        auditStatus: '待审核',
        membershipStatus: '正常'
      }
      await submitCompanyMemberApplication(submitData)
    }
    
    ElMessage.success('提交成功')
    emit('success')
  } catch (error) {
    console.error('提交申请失败:', error)
    ElMessage.error('提交申请失败，请重试')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* 容器与整体背景 */
.apply-form {
  padding: 32px;
  background-color: #f0f3f7; /* 经典的政务背景浅灰蓝 */
  min-height: 100%;
}

/* 顶部类型切换区域 */
.member-type-switch {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 32px;
}

.form-title {
  font-size: 26px;
  font-weight: 700;
  color: #1a365d; /* 深政务蓝 */
  margin-bottom: 20px;
  letter-spacing: 1px;
}

.switch-buttons {
  display: inline-flex;
  background: #e2e8f0;
  padding: 5px;
  border-radius: 10px;
  border: 1px solid #cbd5e1;
}

.switch-btn {
  margin: 0 !important;
  border: none !important;
  padding: 10px 32px !important;
  height: auto !important;
  font-weight: 500;
  color: #64748b;
  background: transparent !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.switch-btn.active {
  background: #ffffff !important;
  color: #0c4da2 !important;
  box-shadow: 0 4px 12px rgba(12, 77, 162, 0.15);
  border-radius: 8px !important;
}

/* 表单分区块美化 */
.form-section {
  background: #ffffff;
  border-radius: 12px;
  padding: 30px;
  margin-bottom: 24px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  position: relative;
  transition: transform 0.2s ease;
}

/* 区块标题：带装饰条的政务风格 */
.section-title {
  font-size: 18px;
  font-weight: 700;
  color: #334155;
  margin: 0 0 24px 0;
  padding-left: 14px;
  position: relative;
  display: flex;
  align-items: center;
}

.section-title::before {
  content: "";
  position: absolute;
  left: 0;
  width: 4px;
  height: 18px;
  background: linear-gradient(to bottom, #0c4da2, #3b82f6);
  border-radius: 2px;
}

/* 动态列表项（教育/工作经历） */
.experience-item {
  background: #f8fafc;
  border: 1px dashed #cbd5e1;
  border-radius: 10px;
  padding: 24px;
  margin-bottom: 20px;
  position: relative;
}

.experience-item:hover {
  background: #f1f5f9;
  border-color: #0c4da2;
}

/* 按钮样式重塑 */
.btn-add {
  width: 100%;
  height: 42px;
  border-style: dashed !important;
  background: #f8fafc !important;
  color: #0c4da2 !important;
  font-weight: 500;
  margin-top: 10px;
}

.btn-add:hover {
  background: #eff6ff !important;
  border-color: #0c4da2 !important;
}

.btn-remove {
  position: absolute;
  right: 16px;
  bottom: 16px;
  z-index: 10;
}

/* 附件上传区域 */
.attachment-list {
  display: flex;
  flex-direction: column;
  gap: 12px; /* 附件条目之间的间距 */
  margin-bottom: 16px;
}

/* 附件条目主容器 */
.compact-attachment-item {
  display: flex;
  align-items: center;
  gap: 16px; /* 操作组和文件名之间的间距 */
  background: #ffffff;
  padding: 8px 12px;
  border: 1px solid #e4e7ed;
  border-radius: 6px;
  transition: all 0.3s;
}

.compact-attachment-item:hover {
  border-color: #c0c4cc;
  background: #fdfdfd;
}

/* 核心：紧凑的操作功能组 */
.action-group {
  display: flex;
  /* 确保两个按钮高度一致且水平对齐 */
  align-items: stretch; 
}

/* 上传触发器 (去掉默认margin) */
.upload-trigger {
  display: inline-flex;
}

/* 修改上传按钮和删除按钮的样式，使其看起来像一个整体 */
.primary-action,
.danger-action {
  margin: 0 !important; /* 强制去掉所有默认间距 */
  height: 32px !important; /* 设定一个紧凑的高度 */
}

/* 左侧按钮（上传）：处理圆角，去掉右侧圆角 */
.primary-action {
  border-top-right-radius: 0 !important;
  border-bottom-right-radius: 0 !important;
  border-right: 1px solid rgba(255, 255, 255, 0.2) !important; /* 可选：增加一个微弱的分隔线 */
}

/* 右侧按钮（删除）：处理圆角，去掉左侧圆角 */
.danger-action {
  border-top-left-radius: 0 !important;
  border-bottom-left-radius: 0 !important;
  padding: 0 10px !important; /* 让删除图标更紧凑 */
}

/* 文件名展示区域 */
.file-name-info {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #606266;
  flex: 1; /* 占据剩余空间 */
  overflow: hidden; /* 防止超长文件名撑破布局 */
}

.file-icon {
  color: #909399;
}

.name-text {
  overflow: hidden;
  text-overflow: ellipsis; /* 长文件名显示省略号 */
  white-space: nowrap;
}

/* 添加按钮样式 */
.add-item-btn {
  height: 32px;
  border-style: dashed !important; /* 使用虚线边框，增强“添加”感 */
}

/* 覆盖 Element Plus 默认列表宽度 */
:deep(.el-upload-list) {
  width: 100%;
}

/* 表单内部组件对齐与间距 */
:deep(.el-form-item) {
  margin-bottom: 22px;
}

:deep(.el-form-item__label) {
  font-weight: 600 !important;
  color: #475569 !important;
  padding-bottom: 8px !important;
  line-height: 1.2 !important;
}

:deep(.el-input__wrapper),
:deep(.el-textarea__inner),
:deep(.el-select__wrapper) {
  box-shadow: 0 0 0 1px #d1d5db inset !important;
  border-radius: 6px !important;
  padding: 4px 12px;
}

:deep(.el-input__wrapper.is-focus),
:deep(.el-textarea__inner:focus) {
  box-shadow: 0 0 0 1px #0c4da2 inset !important;
}

/* 底部操作栏 */
.step-actions {
  display: flex;
  justify-content: center;
  gap: 20px;
  padding: 40px 0;
  border-top: 1px solid #e2e8f0;
}

.step-actions .el-button {
  padding: 12px 40px;
  height: auto;
  font-size: 16px;
  border-radius: 8px;
  font-weight: 500;
}

.step-actions .el-button--primary {
  background-color: #0c4da2;
  border-color: #0c4da2;
  box-shadow: 0 4px 12px rgba(12, 77, 162, 0.2);
}

/* 文本域计数器样式 */
:deep(.el-input__count) {
  background: transparent !important;
  bottom: -22px !important;
}

/* 响应式微调 */
@media (max-width: 768px) {
  .apply-form {
    padding: 16px;
  }
  .form-section {
    padding: 20px;
  }
  :deep(.el-col) {
    width: 100% !important; /* 移动端强制占满一行 */
  }
}
</style>
