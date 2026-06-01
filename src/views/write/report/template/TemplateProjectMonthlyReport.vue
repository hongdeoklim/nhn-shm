<template>
  <div style="background-color: white">
    <!-- 기본정보  -->
    <report-basic-info :isPrint="isPrint" :board="board" :readonly="board.readonly" v-model="form.reportBasicInfo"/>

    <!-- 안전관리비 -->
    <report-health-and-safety-management-cost :isPrint="isPrint" v-model="form.reportHealthAndSafetyManagementCost" :readonly="board.readonly" :fixed="fixed.reportHealthAndSafetyManagementCost"/>

    <!-- 안전장비 -->
    <report-safety-equipment :isPrint="isPrint" v-model="form.reportSafetyEquipment" :readonly="board.readonly" :fixed="fixed.reportSafetyEquipment"/>

    <!-- 파일첨부 -->
    <file-upload-module v-if="!isPrint" v-model="fileList" />
  </div>
</template>

<script>
import ReportBasicInfo from '@/views/write/report/components/ReportBasicInfo'
import ReportHealthAndSafetyManagementCost from '@/views/write/report/components/ReportHealthAndSafetyManagementCost'
import ReportSafetyEquipment from '@/views/write/report/components/ReportSafetyEquipment'
import FileUploadModule from '@/views/modules/FileUploadModule'
export default {
  name: 'TemplateProjectMonthlyReport',
  components: {
    FileUploadModule,
    ReportSafetyEquipment,
    ReportHealthAndSafetyManagementCost,
    ReportBasicInfo},
  props:{
    value: Object,
    board: Object,
    files: Array,
    isPrint: Boolean,
    header: Object,
    com_name: String,
  },
  watch: {
    value () {
      this.form = this.value
    },
    form: {
      deep:true,
      handler () {
        this.$emit('input', this.form, this.fileList)
      }
    },
    fileList: {
      deep: true,
      handler () {
        this.$emit('input', this.form, this.fileList)
      }
    },
    header: {
      deep: true,
      immediate: true,
      handler () {
        this.loadTotal()
      }
    }
  },
  computed: {
    userInfo () {
      return this.$store.state.auth.userInfo
    },
    isUpdateMode () {
      return this.$route.params.postId
    }
  },
  data () {
    return {
      form: {
        reportBasicInfo: {
          project_title: '',
          work_money_amount: '',
          work_period: '',
          field_general_id: '',
          safety_chief_id: '',
          progress_content: ''
        },
        reportHealthAndSafetyManagementCost: {
          safety_and_health_labor_cost: {amount:'', amount_used:'', accumulated_amount:'', run_rate:''},
          safety_and_health_education: {amount:'', amount_used:'', accumulated_amount:'', run_rate:''},
          risk_assessment: {amount:'', amount_used:'', accumulated_amount:'', run_rate:''},
          industrial_accident_compensation: {amount:'', amount_used:'', accumulated_amount:'', run_rate:''},
          safety_and_health_management_system: {amount:'', amount_used:'', accumulated_amount:'', run_rate:''},
          health_care: {amount:'', amount_used:'', accumulated_amount:'', run_rate:''},
          safety_and_health_integrated_management_system: {amount:'', amount_used:'', accumulated_amount:'', run_rate:''},
          installation_and_maintenance_of_musculoskeletal_prevention_facilities: {amount:'', amount_used:'', accumulated_amount:'', run_rate:''},
          musculoskeletal_service: {amount:'', amount_used:'', accumulated_amount:'', run_rate:''},
          eap_operation: {amount:'', amount_used:'', accumulated_amount:'', run_rate:''},
          accumulate: {amount:'', amount_used:'', accumulated_amount:'', run_rate:''}
        },
        reportSafetyEquipment: {
          safety_and_health_labor_cost: {amount:'', amount_used:'', accumulated_amount:'', run_rate:''},
          safety_and_health_education: {amount:'', amount_used:'', accumulated_amount:'', run_rate:''},
          accumulate: {amount:'', amount_used:'', accumulated_amount:'', run_rate:''}
        }
      },
      fixed: {
        reportHealthAndSafetyManagementCost: {
          safety_and_health_labor_cost: {accumulated_amount: 0},
          safety_and_health_education: {accumulated_amount: 0},
          risk_assessment: {accumulated_amount: 0},
          industrial_accident_compensation: {accumulated_amount: 0},
          safety_and_health_management_system: {accumulated_amount: 0},
          health_care: {accumulated_amount: 0},
          safety_and_health_integrated_management_system: {accumulated_amount: 0},
          installation_and_maintenance_of_musculoskeletal_prevention_facilities: {accumulated_amount: 0},
          musculoskeletal_service: {accumulated_amount: 0},
          eap_operation: {accumulated_amount: 0}
        },
        reportSafetyEquipment: {
          safety_and_health_labor_cost: {accumulated_amount: 0},
          safety_and_health_education: {accumulated_amount: 0}
        }
      },
      fileList:[]
    }
  },
  created () {
    this.initData()
    this.initFiles()
  },
  methods: {
    initFiles () {
      if (this.files) {
        this.fileList = this.files
      }
    },

    initData () {
      if (this.value) {
        if (this.value.reportBasicInfo) this.form.reportBasicInfo = this.value.reportBasicInfo
        if (this.value.reportHealthAndSafetyManagementCost) this.form.reportHealthAndSafetyManagementCost = this.value.reportHealthAndSafetyManagementCost
        if (this.value.reportSafetyEquipment) this.form.reportSafetyEquipment = this.value.reportSafetyEquipment
      }

    },

    async loadTotal () {
      this.fixed = {
        reportHealthAndSafetyManagementCost: {
          safety_and_health_labor_cost: {accumulated_amount: 0},
          safety_and_health_education: {accumulated_amount: 0},
          risk_assessment: {accumulated_amount: 0},
          industrial_accident_compensation: {accumulated_amount: 0},
          safety_and_health_management_system: {accumulated_amount: 0},
          health_care: {accumulated_amount: 0},
          safety_and_health_integrated_management_system: {accumulated_amount: 0},
          installation_and_maintenance_of_musculoskeletal_prevention_facilities: {accumulated_amount: 0},
          musculoskeletal_service: {accumulated_amount: 0},
          eap_operation: {accumulated_amount: 0}
        },
        reportSafetyEquipment: {
          safety_and_health_labor_cost: {accumulated_amount: 0},
          safety_and_health_education: {accumulated_amount: 0}
        }
      }

      const end_yyyy = this.header.year
      const end_MM = this.header.month
      const start_yyyy = end_yyyy
      const start_MM = 1

      if (`${end_MM}` === '1') {
        return
      }

      const projectId = this.$route.params.proj_id;
      const boardSlug = 'project_monthly_report' // first_risk(id:6)
      const page = 1
      const perPage = 10000
      await this.$store.dispatch('approval/LOAD_POST_ALL', {projectId, boardSlug, page, perPage}).then(value => {
        if (value && value.data) {
          const list = []
          for (const data of value.data) {
            if (data.user && data.document_status.code === 'approved') {
              const com_name = data.user.company.com_name
              if (this.com_name === com_name) {
                const content = JSON.parse(data.post_content)
                if (`${content.header.year}` === `${end_yyyy}`
                    && parseInt(`${content.header.month}`) < parseInt(`${end_MM}`) ) {
                  list.push(content)
                }
              }
            }
          }

          // 가져온 내용을 바탕으로 계산 시작
          this.fixed = {
            reportHealthAndSafetyManagementCost: {
              safety_and_health_labor_cost: {accumulated_amount: 0},
              safety_and_health_education: {accumulated_amount: 0},
              risk_assessment: {accumulated_amount: 0},
              industrial_accident_compensation: {accumulated_amount: 0},
              safety_and_health_management_system: {accumulated_amount: 0},
              health_care: {accumulated_amount: 0},
              safety_and_health_integrated_management_system: {accumulated_amount: 0},
              installation_and_maintenance_of_musculoskeletal_prevention_facilities: {accumulated_amount: 0},
              musculoskeletal_service: {accumulated_amount: 0},
              eap_operation: {accumulated_amount: 0}
            },
            reportSafetyEquipment: {
              safety_and_health_labor_cost: {accumulated_amount: 0},
              safety_and_health_education: {accumulated_amount: 0}
            }
          }
          for (const content of list) {
            const reportHealthAndSafetyManagementCost = content.summary.reportHealthAndSafetyManagementCost
            const reportSafetyEquipment = content.summary.reportSafetyEquipment
            this.sumCeportHealthAndSafetyManagementCost(reportHealthAndSafetyManagementCost)
            this.sumReportSafetyEquipment(reportSafetyEquipment)
          }

        }
      })
      // const beginAt = new Date(this.header.year, 0, 1).format('yyyy-MM-dd HH:mm:ss')
      // const endAt = new Date(this.header.year, this.header.month - 1, 0).format('yyyy-MM-dd HH:mm:ss')
      // this.$store.dispatch('summary/LOAD_SUMMARY', {
      //   projectId: this.projectId,
      //   boardId:3,
      //   beginAt,
      //   endAt,
      //   dateField: 'content$date' //content$date
      // }).then(value => {
      //   if (value.all) {
      //     const sum = value.all.sum
      //     const reportHealthAndSafetyManagementCost = sum.reportHealthAndSafetyManagementCost
      //     const reportSafetyEquipment = sum.reportSafetyEquipment
      //
      //     this.fixed = {
      //       reportHealthAndSafetyManagementCost: {
      //         safety_and_health_labor_cost: {accumulated_amount: reportHealthAndSafetyManagementCost['안전보건인건비']},
      //         safety_and_health_education: {accumulated_amount: reportHealthAndSafetyManagementCost['안전보건교육']},
      //         risk_assessment: {accumulated_amount: reportHealthAndSafetyManagementCost['위험성평가']},
      //         industrial_accident_compensation: {accumulated_amount: reportHealthAndSafetyManagementCost['업무상재해보상']},
      //         safety_and_health_management_system: {accumulated_amount: reportHealthAndSafetyManagementCost['안전보건경영시스템']},
      //         health_care: {accumulated_amount: reportHealthAndSafetyManagementCost['보건관리']},
      //         safety_and_health_integrated_management_system: {accumulated_amount: reportHealthAndSafetyManagementCost['안전보건통합관리시스템']},
      //         installation_and_maintenance_of_musculoskeletal_prevention_facilities: {accumulated_amount: reportHealthAndSafetyManagementCost['근골격계 예방시설 구축/유지']},
      //         musculoskeletal_service: {accumulated_amount: reportHealthAndSafetyManagementCost['근골격계용역']},
      //         eap_operation: {accumulated_amount: reportHealthAndSafetyManagementCost['EAP운영']},
      //       },
      //       reportSafetyEquipment: {
      //         safety_and_health_labor_cost: {accumulated_amount: reportSafetyEquipment['안전보건인건비']},
      //         safety_and_health_education: {accumulated_amount: reportSafetyEquipment['안전보건교육(관리감독자 교육 포함)']},
      //       }
      //     }
      //   }
      // }).catch(reason => {
      //   this.fixed = {
      //     reportHealthAndSafetyManagementCost: {
      //       safety_and_health_labor_cost: {accumulated_amount: 0},
      //       safety_and_health_education: {accumulated_amount: 0},
      //       risk_assessment: {accumulated_amount: 0},
      //       industrial_accident_compensation: {accumulated_amount: 0},
      //       safety_and_health_management_system: {accumulated_amount: 0},
      //       health_care: {accumulated_amount: 0},
      //       safety_and_health_integrated_management_system: {accumulated_amount: 0},
      //       installation_and_maintenance_of_musculoskeletal_prevention_facilities: {accumulated_amount: 0},
      //       musculoskeletal_service: {accumulated_amount: 0},
      //       eap_operation: {accumulated_amount: 0}
      //     },
      //     reportSafetyEquipment: {
      //       safety_and_health_labor_cost: {accumulated_amount: 0},
      //       safety_and_health_education: {accumulated_amount: 0}
      //     }
      //   }
      // })

    },

    sumCeportHealthAndSafetyManagementCost (b) {
      for (const data of b) {
        this.fixed.reportHealthAndSafetyManagementCost.safety_and_health_labor_cost.accumulated_amount += data['안전보건인건비'] ? parseInt(data['안전보건인건비']) : 0
        this.fixed.reportHealthAndSafetyManagementCost.safety_and_health_education.accumulated_amount += data['안전보건교육'] ? parseInt(data['안전보건교육']) : 0
        this.fixed.reportHealthAndSafetyManagementCost.risk_assessment.accumulated_amount += data['위험성평가'] ? parseInt(data['위험성평가']) : 0
        this.fixed.reportHealthAndSafetyManagementCost.industrial_accident_compensation.accumulated_amount += data['업무상재해보상'] ? parseInt(data['업무상재해보상']) : 0
        this.fixed.reportHealthAndSafetyManagementCost.safety_and_health_management_system.accumulated_amount += data['안전보건경영시스템'] ? parseInt(data['안전보건경영시스템']) : 0
        this.fixed.reportHealthAndSafetyManagementCost.health_care.accumulated_amount += data['보건관리'] ? parseInt(data['보건관리']) : 0
        this.fixed.reportHealthAndSafetyManagementCost.safety_and_health_integrated_management_system.accumulated_amount += data['안전보건통합관리시스템'] ? parseInt(data['안전보건통합관리시스템']) : 0
        this.fixed.reportHealthAndSafetyManagementCost.installation_and_maintenance_of_musculoskeletal_prevention_facilities.accumulated_amount += data['근골격계 예방시설 구축/유지'] ? parseInt(data['근골격계 예방시설 구축/유지']) : 0
        this.fixed.reportHealthAndSafetyManagementCost.musculoskeletal_service.accumulated_amount += data['근골격계용역'] ? parseInt(data['근골격계용역']) : 0
        this.fixed.reportHealthAndSafetyManagementCost.eap_operation.accumulated_amount += data['EAP운영'] ? parseInt(data['EAP운영']) : 0
      }
    },

    sumReportSafetyEquipment (b) {
      for (const data of b) {
        this.fixed.reportSafetyEquipment.safety_and_health_labor_cost.accumulated_amount += data['안전보건인건비'] ? parseInt(data['안전보건인건비']) : 0
        this.fixed.reportSafetyEquipment.safety_and_health_education.accumulated_amount += data['안전보건교육(관리감독자 교육 포함'] ? parseInt(data['안전보건교육(관리감독자 교육 포함']) : 0
      }
    }
  }
}
</script>

<style scoped>

</style>
