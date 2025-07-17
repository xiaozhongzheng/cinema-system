// 动态表单配置数据结构
export const partyFormConfig = {
  partyList: [
    {
      title: '党组织基本信息',
      fields: [
        {
          type: 'input',
          label: '党组织名称',
          prop: 'partyOrg.name',
          rules: [{ required: true, message: '必填项' }]
        },
        {
          type: 'select',
          label: '党组织类型',
          prop: 'partyOrg.type',
          options: [
            { value: 'partyCommittee', label: '党委' },
            { value: 'partyBranch', label: '党支部' },
            { value: 'partyGroup', label: '党小组' }
          ]
        },
        // {
        //   type: 'date-picker',
        //   label: '成立日期',
        //   prop: 'partyOrg.establishDate',
        //   valueFormat: 'yyyy-MM-dd'
        // }
      ]
    },
    {
      title: '党员信息',
      children: [
        {
          // 党员列表（动态数组）
          fieldType: 'array',
          prop: 'partyOrg.members',
          template: {
            fields: [
              {
                type: 'input',
                label: '姓名',
                prop: 'name',
                rules: [{ required: true }]
              },
              {
                type: 'input',
                label: '党员编号',
                prop: 'partyId',
                rules: [{ pattern: /^\d{8}$/, message: '8位数字编号' }]
              },
              {
                type: 'select',
                label: '党内职务',
                prop: 'position',
                options: [
                  { value: 'secretary', label: '书记' },
                  { value: 'member', label: '委员' },
                  { value: 'normal', label: '普通党员' }
                ]
              }
            ],
            children: [
              {
                title: '教育经历',
                fieldType: 'array',
                prop: 'education',
                template: {
                  fields: [
                    {
                      type: 'input',
                      label: '院校名称',
                      prop: 'school'
                    },
                    {
                      type: 'select',
                      label: '学历',
                      prop: 'degree',
                      options: [
                        { value: 'bachelor', label: '本科' },
                        { value: 'master', label: '硕士' }
                      ]
                    }
                  ]
                }
              }
            ]
          }
        }
      ]
    },
    {
      title: '组织生活',
      fields: [
        {
          type: 'checkbox-group',
          label: '组织活动类型',
          prop: 'partyOrg.activities',
          options: [
            { label: '三会一课', value: 'meeting' },
            { label: '主题党日', value: 'dayActivity' }
          ]
        }
      ],
      children: [
        {
          // 活动记录（动态数组）
          fieldType: 'array',
          prop: 'partyOrg.activityRecords',
          template: {
            fields: [
              {
                type: 'input',
                label: '活动主题',
                prop: 'title'
              },
              {
                type: 'date-picker',
                label: '活动日期',
                prop: 'date',
                valueFormat: 'yyyy-MM-dd'
              }
            ]
          }
        }
      ]
    }
  ]
}

// 对应的测试数据
export const partyFormData = {
  partyOrg: {
    name: 'XX市第一党支部',
    type: 'partyBranch',
    // establishDate: '2020-01-15',
    // members: [
    //   {
    //     name: '张三',
    //     partyId: '20210001',
    //     position: 'secretary',
    //     education: [
    //       {
    //         school: 'XX大学',
    //         degree: 'bachelor'
    //       }
    //     ]
    //   },
    //   {
    //     name: '李四',
    //     partyId: '20210002',
    //     position: 'member',
    //     education: []
    //   }
    // ],
    // activities: ['meeting', 'dayActivity'],
    // activityRecords: [
    //   {
    //     title: '党史学习教育',
    //     date: '2023-07-01'
    //   }
    // ]
  }
}