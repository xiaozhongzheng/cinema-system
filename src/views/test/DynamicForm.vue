<template>
  <el-form 
    :model="formData" 
    :rules="rules" 
    ref="partyForm" 
    label-width="120px"
  >
    <!-- 党组织基本信息 -->
    <el-card class="form-section">
      <div slot="header">
        <span>党组织基本信息</span>
      </div>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="党组织名称" prop="partyOrg.name">
            <el-input v-model="formData.partyOrg.name"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="党组织类型" prop="partyOrg.type">
            <el-select v-model="formData.partyOrg.type">
              <el-option label="党委" value="committee"></el-option>
              <el-option label="党支部" value="branch"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      
      <el-form-item label="成立日期" prop="partyOrg.establishDate">
        <el-date-picker
          v-model="formData.partyOrg.establishDate"
          type="date"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
      </el-form-item>
    </el-card>

    <!-- 党员信息 -->
    <el-card class="form-section">
      <div slot="header">
        <span>党员信息</span>
        <el-button
          @click="addMember"
          type="primary"
          size="small"
          icon="el-icon-plus"
          style="float: right"
        >添加党员</el-button>
      </div>
      
      <div v-if="formData.partyOrg.members.length === 0" class="empty-tip">
        暂无党员信息
      </div>
      
      <div 
        v-for="(member, mIndex) in formData.partyOrg.members" 
        :key="member.key || mIndex"
        class="member-item"
      >
        <el-divider v-if="mIndex > 0"></el-divider>
        
        <el-form-item
          :label="`党员 ${mIndex + 1}`"
         
        >
          <el-row :gutter="20" type="flex">
            <el-col :span="6">
              <el-form-item
                :prop="`partyOrg.members.${mIndex}.name`"
                :rules="memberRules.name"
                label-width="0"
              >
                <el-input v-model="member.name" placeholder="姓名"></el-input>
              </el-form-item>
            </el-col>
            
            <el-col :span="6">
              <el-form-item
                :prop="`partyOrg.members.${mIndex}.partyId`"
                :rules="memberRules.partyId"
                label-width="0"
              >
                <el-input v-model="member.partyId" placeholder="党员编号"></el-input>
              </el-form-item>
            </el-col>
            
            <el-col :span="6">
              <el-form-item
                :prop="`partyOrg.members.${mIndex}.position`"
                :rules="memberRules.position"
                label-width="0"
              >
                <el-select v-model="member.position" placeholder="党内职务">
                  <el-option label="书记" value="secretary"></el-option>
                  <el-option label="委员" value="committee"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            
            <el-col :span="6">
              <el-button
                @click="removeMember(mIndex)"
                type="danger"
                icon="el-icon-delete"
                circle
                size="mini"
              ></el-button>
              
              <el-button
                @click="addEducation(mIndex)"
                type="text"
                icon="el-icon-plus"
              >添加教育经历</el-button>
            </el-col>
          </el-row>
          
          <!-- 教育经历 -->
          <div 
            v-for="(edu, eIndex) in member.education" 
            :key="eIndex"
            class="sub-item"
          >
            <el-form-item
              label="教育经历"
              :prop="`partyOrg.members.${mIndex}.education.${eIndex}.school`"
              :rules="educationRules.school"
            >
              <el-row :gutter="20" type="flex">
                <el-col :span="8">
                  <el-input v-model="edu.school" placeholder="学校名称"></el-input>
                </el-col>
                <el-col :span="8">
                  <el-select v-model="edu.degree" placeholder="学历">
                    <el-option label="本科" value="bachelor"></el-option>
                    <el-option label="硕士" value="master"></el-option>
                  </el-select>
                </el-col>
                <el-col :span="8">
                  <el-button
                    @click="removeEducation(mIndex, eIndex)"
                    type="danger"
                    icon="el-icon-delete"
                    circle
                    size="mini"
                  ></el-button>
                </el-col>
              </el-row>
            </el-form-item>
          </div>
        </el-form-item>
      </div>
    </el-card>
    
    <!-- 提交按钮 -->
    <el-form-item>
      <el-button type="primary" @click="submitForm">提交</el-button>
      <el-button @click="resetForm">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  data() {
    return {
      formData: {
        partyOrg: {
          name: '',
          type: '',
          establishDate: '',
          members: [],
          activityRecords: []
        }
      },
      rules: {
        'partyOrg.name': [{ required: true, message: '请输入党组织名称' }],
        'partyOrg.type': [{ required: true, message: '请选择党组织类型' }],
        'partyOrg.establishDate': [{ required: true, message: '请选择成立日期' }]
      },
      memberRules: {
        name: [{ required: true, message: '请输入党员姓名' }],
        partyId: [
          { required: true, message: '请输入党员编号' },
          { pattern: /^\d{8}$/, message: '编号必须为8位数字' }
        ],
        position: [{ required: true, message: '请选择党内职务' }]
      },
      educationRules: {
        school: [{ required: true, message: '请输入学校名称' }]
      }
    }
  },
  methods: {
    // 添加党员
    addMember() {
      this.formData.partyOrg.members.push({
        key: Date.now(),
        name: '',
        partyId: '',
        position: '',
        education: []
      })
    },
    
    // 删除党员
    removeMember(index) {
      this.formData.partyOrg.members.splice(index, 1)
    },
    
    // 添加教育经历
    addEducation(memberIndex) {
      this.formData.partyOrg.members[memberIndex].education.push({
        school: '',
        degree: ''
      })
    },
    
    // 删除教育经历
    removeEducation(memberIndex, eduIndex) {
      this.formData.partyOrg.members[memberIndex].education.splice(eduIndex, 1)
    },
    
    // 提交表单
    submitForm() {
      this.$refs.partyForm.validate(valid => {
        if (valid) {
          // 提交逻辑
          console.log('提交数据:', JSON.parse(JSON.stringify(this.formData)))
          this.$message.success('提交成功')
        } else {
          this.$message.error('请检查表单')
        }
      })
    },
    
    // 重置表单
    resetForm() {
      this.$refs.partyForm.resetFields()
    },
    
    // 回显数据方法
    setFormData(data) {
      // 深拷贝数据
      this.formData = JSON.parse(JSON.stringify(data))
      // 为动态添加的字段设置唯一key
      if (this.formData.partyOrg.members) {
        this.formData.partyOrg.members.forEach(member => {
          member.key = member.key || Date.now()
          if (member.education) {
            member.education.forEach(edu => {
              edu.key = edu.key || Date.now()
            })
          }
        })
      }
    }
  },
  mounted() {
    // 示例：模拟回显数据
    const mockData = {
      partyOrg: {
        name: 'XX市第一党支部',
        type: 'branch',
        establishDate: '2020-01-15',
        members: [
          {
            name: '张三',
            partyId: '20210001',
            position: 'secretary',
            education: [
              {
                school: 'XX大学',
                degree: 'bachelor'
              }
            ]
          },
          {
            name: '李四',
            partyId: '20210002',
            position: 'committee',
            education: []
          }
        ],
        activityRecords: [
          {
            title: '党史学习教育',
            date: '2023-07-01'
          }
        ]
      }
    }
    this.setFormData(mockData)
  }
}
</script>

<style scoped>
.form-section {
  margin-bottom: 20px;
}
.member-item {
  padding: 15px;
  background: #f9f9f9;
  border-radius: 4px;
  margin-bottom: 10px;
}
.sub-item {
  padding: 10px;
  margin: 10px 0;
  background: #f0f0f0;
  border-radius: 4px;
}
.empty-tip {
  color: #999;
  text-align: center;
  padding: 20px 0;
}
</style>