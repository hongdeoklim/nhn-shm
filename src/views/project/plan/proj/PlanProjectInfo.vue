<template>
  <vx-card>
    <vs-row>
      <vs-col class="mb-6 flex" vs-align="center">
        <h5><i class="dot"></i>현장 상세</h5>
        <div class="ml-auto">
          <vs-button class="mr-4" @click="handleItemClickModified">현장 정보 수정</vs-button>
        </div>
      </vs-col>
    </vs-row>
    <vs-row style="margin-bottom: 150px;">
      <vs-col class="w-1/2">
        <vs-row class="flex mb-4" vs-align="center">
          <h5 class="vx-col sm:w-2/12">계약코드</h5>
          <ml-input class="vx-col sm:w-8/12 w-full " placeholder="계약코드" v-model="form.contract_code"/>
        </vs-row>
        <vs-row class="flex mb-4" vs-align="center">
          <h5 class="flex vx-col sm:w-2/12">현장명</h5>
          <ml-input class="vx-col sm:w-8/12 w-full " placeholder="현장명" v-model="form.field_name"/>
        </vs-row>
        <vs-row class="flex mb-4" vs-align="center">
          <h5 class="flex vx-col sm:w-2/12">지역</h5>
          <ml-input class="vx-col sm:w-8/12 w-full " placeholder="지역" v-model="form.field_location"/>
        </vs-row>
      </vs-col>
      <vs-col class="w-1/2">
        <vs-row class="flex mb-4" vs-align="center">
          <h5 class="flex vx-col sm:w-2/12">안전담당부서</h5>

          <vs-col class="sm:w-8/12 w-full ">
            <ml-input class="w-full" v-model="form.work_general_string" />
          </vs-col>
        </vs-row>
        <vs-row class="flex mb-4" vs-align="center">
          <h5 class="flex vx-col sm:w-2/12">안전보건부서장</h5>
          <vs-col class="sm:w-8/12 w-full ">
            <member-selector v-model="form.field_chief"/>
          </vs-col>
        </vs-row>
        <vs-row class="flex mb-4" vs-align="center">
          <h5 class="flex vx-col sm:w-2/12">안전보건담당자</h5>
          <vs-col class="sm:w-8/12 w-full ">
            <member-selector v-model="form.safety_chief"/>
          </vs-col>
        </vs-row>
      </vs-col>
    </vs-row>
    <vs-row>
      <vs-col class="flex">
        <div>
          <h5 class="flex vx-col sm:w-2/12" style="white-space: nowrap">현장조감도</h5>
          <vs-upload ref="vs_upload_1" :action="fileUpLoad.action" :headers="fileUpLoad.headers"
                     @change="handleChangeFile1" @on-success="handleSuccessFile1Upload" @on-delete="handleDeleteFile1"
                     automatic file-name="file_data" :show-upload-button="false" limit="5"></vs-upload>
        </div>
        <div>
          <h5 class="flex vx-col sm:w-2/12" style="white-space: nowrap">현장약도</h5>
          <vs-upload ref="vs_upload_2" :action="fileUpLoad.action" :headers="fileUpLoad.headers"
                     @change="handleChangeFile2" @on-success="handleSuccessFile2Upload" @on-delete="handleDeleteFile2"
                     automatic file-name="file_data" :show-upload-button="false" limit="5"></vs-upload>
        </div>
        <div>
          <h5 class="flex vx-col sm:w-2/12" style="white-space: nowrap">현장사진</h5>
          <vs-upload ref="vs_upload_3" :action="fileUpLoad.action" :headers="fileUpLoad.headers"
                     @change="handleChangeFile3" @on-success="handleSuccessFile3Upload" @on-delete="handleDeleteFile3"
                     automatic file-name="file_data" :show-upload-button="false" limit="5"></vs-upload>
        </div>
      </vs-col>
    </vs-row>


    <popup-plan-project
      :popupActive="popupActive"
      :value="selectPlanProject"

      @popupActiveSync="popupActiveSync"
      @register="registerPlanManagerment"
      @update="registerPlanManagerment"
      @delete="registerPlanManagerment"
    ></popup-plan-project>

    <popup-project-setting v-model="showPopupProjectSetting"/>

  </vx-card>
</template>

<script>
import config from '/public/config'
import VueCookie from 'vue-cookie'
import PopupPlanProject from '@/views/project/popup/PopupPlanProject'
import DateSelector from '@/components/selector/DateSelector'
import PopupProjectSetting from '@/views/project/PopupProjectSetting'
import MemberSelector from '@/components/selector/MemberSelector'
import CompanySelector from '@/components/selector/CompanySelector'

export default {
  name: 'PlanProjectInfo',
  components: {
    CompanySelector,
    MemberSelector,
    PopupProjectSetting,
    DateSelector,
    PopupPlanProject
  },
  data () {
    return {
      popupActive: false,
      showPopupProjectSetting: false,
      project_work_type: [],

      oldForm: {},
      form: {
        project_id: '',
        contract_code: '', //계약코드
        field_name: '', // 현장이름
        field_chief: 0, // 안전보건부서장
        safety_chief: 0, // 안전보건담당자
        field_location: '', // 지역
        client: 0, // 관할부처
        work_type: 0, //사업구분
        work_general_string: '', //안전담당부서
        work_money_amount: 0, //사업금액
        date_work_start: '', //시작일
        date_complete_expected: '', //중간점검일
        date_complete: '', //종료일
        field_view: [],
        field_map: [],
        field_photo: []
      },

      // 파일 업로드 서버 정보
      fileUpLoad: {
        headers: '',
        action: `${config.BASE_API_URL}/api/v1/file`,
        files1: [], // 등록하고자 하는 파일 목록
        files2: [], // 등록하고자 하는 파일 목록
        files3: [], // 등록하고자 하는 파일 목록
        oldFile1Ids: [], // 기존에 등록한 파일Id 목록
        oldFile2Ids: [], // 기존에 등록한 파일Id 목록
        oldFile3Ids: [] // 기존에 등록한 파일Id 목록
      },

      planAllTableList: [],
      selectPlanProject: {}


    }
  },

  mounted () {
    const backButtonRouteGuard = this.$router.beforeEach((to, from, next) => {
      if (this.$refs.vs_upload_1.$children && this.$refs.vs_upload_1.$children.length > 0) {
        this.$refs.vs_upload_1.viewActive = false
        next(false)
      } else if (this.$refs.vs_upload_2.$children && this.$refs.vs_upload_2.$children.length > 0) {
        this.$refs.vs_upload_2.viewActive = false
        next(false)
      } else if (this.$refs.vs_upload_3.$children && this.$refs.vs_upload_3.$children.length > 0) {
        this.$refs.vs_upload_3.viewActive = false
        next(false)
      } else {
        next(true)
      }
    })
    this.$once('hook:destroyed', () => {
      backButtonRouteGuard()
    })
  },

  async created () {
    // file upload 시 사용되는 xmlrequest header
    this.fileUpLoad.headers = {
      Authorization: `Bearer ${VueCookie.get('token')}`,
    }

    await this.loadProject()
    await this.loadPlanManagement()
    await this.loadProjectWorkType()

  },
  methods: {
    async loadProject () {
      const project_id = this.$route.params.proj_id
      await this.$store.dispatch('project/LOAD_PROJECT', {project_id})
      const info = this.$store.state.project.projectInfo

      this.form.project_id = project_id
      this.form.contract_code = info.contract_code
      this.form.field_name = info.field_name
      this.form.field_chief = info.field_chief.id
      this.form.safety_chief = info.safety_chief.id
      this.form.field_location = info.field_location
      this.form.client = info.client.id
      this.form.work_type = info.work_type_id
      this.form.work_general_string = info.meta && JSON.parse(info.meta).work_general_string ? JSON.parse(info.meta).work_general_string : ''
      this.form.work_money_amount = info.work_money_amount
      this.form.date_work_start = info.date_work_start
      this.form.date_complete_expected = info.date_complete_expected
      this.form.date_complete = info.date_complete
      this.form.field_view = info.field_view
      this.form.field_map = info.field_map
      this.form.field_photo = info.field_photo

      // 첨부파일 가져오기
      for (const file of this.form.field_view) {
        this.fileUpLoad.oldFile1Ids.push(file.id)
        this.setVsUploadImage(this, 1, file.path, file.id)
      }
      for (const file of this.form.field_map) {
        this.fileUpLoad.oldFile2Ids.push(file.id)
        this.setVsUploadImage(this, 2, file.path, file.id)
      }
      for (const file of this.form.field_photo) {
        this.fileUpLoad.oldFile3Ids.push(file.id)
        this.setVsUploadImage(this, 3, file.path, file.id)
      }

      // 사업금액 콤바추가
      this.form.work_money_amount = this.form.work_money_amount.replace(/,/gi, '').replace(/\B(?=(\d{3})+(?!\d))/gi, ',')

      // 불러온데이터 저장
      this.oldForm = JSON.parse(JSON.stringify(this.form))
    },


    // 현장 개요 불러오기
    async loadPlanManagement () {
      const projectId = this.$route.params.proj_id
      const boardId = 15 // plan_management
      const page = 1
      const perPage = 100

      await this.$store.dispatch('board/LOAD_POST_LIST', {
        projectId,
        boardId,
        page,
        perPage
      })
      const postListInfo = this.$store.state.board.postListInfo

      this.planAllTableList = postListInfo.data
    },

    async loadProjectWorkType () {
      const page = 1, perPage = 10, keyword = ''
      await this.$store.dispatch('project/LOAD_PROJECT_WORKTYPE', {
        page,
        perPage,
        keyword
      })
      this.project_work_type = this.$store.state.project.projectWorkType
    },

    formCheck () {
      if (this.form.contract_code.trim().length <= 0) {
        alert('계약코드를 입력해주세요')
        return false
      } else if (this.form.field_name.trim().length <= 0) {
        alert('현장명을 입력해주세요')
        return false
      } else if (this.form.field_chief === '' || Number(this.form.field_chief) === 0) {
        alert('안전보건부서장을 선택해주세요')
        return false
      } else if (this.form.safety_chief === '' || Number(this.form.safety_chief) === 0) {
        alert('안전보건담당자를 선택해주세요')
        return false
      } else if (this.form.field_location.trim().length <= 0) {
        alert('지역을 입력해주세요')
        return false
      } else if (this.form.constructor === '' || Number(this.form.constructor) === 0) {
        alert('시공사를 선택해주세요')
        return false
      } else if (this.form.project_group === '' || Number(this.form.project_group) === 0) {
        alert('현장명을 선택해주세요')
        return false
      } else if (this.form.work_type === '' || Number(this.form.work_type) === 0) {
        alert('기업구분을 선택해주세요')
        return false
      } else if (this.form.work_general_string === '' || Number(this.form.work_general_string) === 0) {
        alert('안전담당부서을 입력해주세요')
        return false
      } else if (this.form.work_money_amount.trim().length <= 0) {
        alert('사업금액을 입력해주세요')
        return false
      } else if (this.form.date_work_start.trim().length <= 0) {
        alert('시작일을 선택해주세요')
        return false
      } else if (this.form.date_complete_expected.trim().length <= 0) {
        alert('중간점검일을 선택해주세요')
        return false
      } else if (new Date(this.form.date_complete_expected) - new Date(this.form.date_work_start) < 0) {
        alert('중간점검일은 시작일보다 빠를 수 없습니다')
        return false
      } else if (this.form.date_complete.trim().length <= 0) {
        alert('종료일을 선택해주세요')
        return false
      } else if (new Date(this.form.date_complete) - new Date(this.form.date_work_start) < 0) {
        alert('종료일은 시작일보다 빠를 수 없습니다')
        return false
      }

      return true
    },

    formChangeCheck () {
      if (this.form.contract_code !== this.oldForm.contract_code) return false
      else if (this.form.field_name !== this.oldForm.field_name) return false
      else if (this.form.field_chief !== this.oldForm.field_chief) return false
      else if (this.form.safety_chief !== this.oldForm.safety_chief) return false
      else if (this.form.field_location !== this.oldForm.field_location) return false

      else if (this.form.client !== this.oldForm.client) return false
      else if (this.form.constructor !== this.oldForm.constructor) return false
      else if (this.form.project_group !== this.oldForm.project_group) return false
      else if (this.form.work_type !== this.oldForm.work_type) return false
      else if (this.form.work_general_string !== this.oldForm.work_general_string) return false

      else if (this.form.work_money_amount !== this.oldForm.work_money_amount) return false
      else if (this.form.date_work_start !== this.oldForm.date_work_start) return false
      else if (this.form.date_complete_expected !== this.oldForm.date_complete_expected) return false
      else if (this.form.date_complete !== this.oldForm.date_complete) return false

      return true
    },

    async handleItemClickModified () {

      localStorage.removeItem(`/api/v1/project/${this.$route.params.proj_id}`)
      this.form.date_work_start = new Date(this.form.date_work_start).format('yyyy-MM-dd HH:mm:ss')
      this.form.date_complete_expected = new Date(this.form.date_complete_expected).format('yyyy-MM-dd HH:mm:ss')
      this.form.date_complete = new Date(this.form.date_complete).format('yyyy-MM-dd HH:mm:ss')
      this.form.field_view = this.getUploadFileList(this.fileUpLoad.files1, this.fileUpLoad.oldFile1Ids)
      this.form.field_map = this.getUploadFileList(this.fileUpLoad.files2, this.fileUpLoad.oldFile2Ids)
      this.form.field_photo = this.getUploadFileList(this.fileUpLoad.files3, this.fileUpLoad.oldFile3Ids)

      this.form.work_type = 1
      this.form.work_money_amount = this.form.work_money_amount.replace(/,/gi, '')
      this.form.meta = JSON.stringify({'work_general_string': this.form.work_general_string})

      if (this.formCheck()) {
        await this.$store.dispatch('project/UPDATE_PROJECT', this.form)
        alert('수정하였습니다.')
        document.location.reload()
      } else {
        this.form.work_money_amount = this.form.work_money_amount.replace(/,/gi, '').replace(/\B(?=(\d{3})+(?!\d))/gi, ',')
      }
    },

    getPreview (data) {
      if (data.preview) {
        const preview = JSON.parse(data.preview)
        return preview
      }
    },

    handleClickProjectSetting () {
      this.showPopupProjectSetting = true
    },

    // vs-upload에 초기 이미지 넣기
    setVsUploadImage (_t, num, src, uploadedFileId) {
      let orientation = 'h'
      const image = new Image()
      image.src = src
      image.onload = function () {
        if (this.width > this.height) {
          orientation = 'w'
        }

        const obj = {
          uploadedFileId,
          src: this.src,
          orientation,
          type: 'image',
          percent: null,
          error: false,
          remove: false
        }

        if (num === 1) {
          _t.$refs.vs_upload_1.srcs.push(JSON.parse(JSON.stringify(obj)))
          _t.$refs.vs_upload_1.filesx.push(JSON.parse(JSON.stringify(obj)))
        } else if (num === 2) {
          _t.$refs.vs_upload_2.srcs.push(JSON.parse(JSON.stringify(obj)))
          _t.$refs.vs_upload_2.filesx.push(JSON.parse(JSON.stringify(obj)))
        } else if (num === 3) {
          _t.$refs.vs_upload_3.srcs.push(JSON.parse(JSON.stringify(obj)))
          _t.$refs.vs_upload_3.filesx.push(JSON.parse(JSON.stringify(obj)))
        }


      }
    },

    getUploadFileList (list, oldlist) {
      // 첨부파일 처리
      let uploads = ''
      const upload = []

      // 새로 등록한 첨부파일
      if (list.length > 0) {
        for (const data of list) {
          if (data.uploadedFileId) {
            upload.push(data.uploadedFileId)
          }
        }
      }


      // 기존 등록된 첨부파일 중 삭제되지 않은 첨부파일 ID
      if (oldlist.length > 0) {
        for (const fileId of oldlist) {
          if (fileId) {
            upload.push(fileId)
          }
        }
      }

      uploads = JSON.stringify(upload)
      return uploads
    },

    addProjectPlan () {
      this.selectPlanProject = {}
      this.popupActive = true
    },
    popupActiveSync () {
      this.popupActive = false
    },

    handleChangeFile1 (path, files) {
      this.fileUpLoad.files1 = files
    },
    handleChangeFile2 (path, files) {
      this.fileUpLoad.files2 = files
    },
    handleChangeFile3 (path, files) {
      this.fileUpLoad.files3 = files
    },

    handleSuccessFile1Upload (event) {
      // response
      let response = event.currentTarget.response
      response = JSON.parse(response)
      const uploadedFileID = response.id

      const file = this.fileUpLoad.files1[this.fileUpLoad.files1.length - 1]
      file.uploadedFileId = uploadedFileID
    },
    handleSuccessFile2Upload (event) {
      // response
      let response = event.currentTarget.response
      response = JSON.parse(response)
      const uploadedFileID = response.id

      const file = this.fileUpLoad.files2[this.fileUpLoad.files2.length - 1]
      file.uploadedFileId = uploadedFileID
    },
    handleSuccessFile3Upload (event) {
      // response
      let response = event.currentTarget.response
      response = JSON.parse(response)
      const uploadedFileID = response.id

      const file = this.fileUpLoad.files3[this.fileUpLoad.files3.length - 1]
      file.uploadedFileId = uploadedFileID

    },

    handleDeleteFile1 (file) {
      if (file.src) {
        this.fileUpLoad.oldFile1Ids.remove(file.uploadedFileId)
      } else {
        this.fileUpLoad.files1.remove(file)
      }
    },
    handleDeleteFile2 (file) {
      if (file.src) {
        this.fileUpLoad.oldFile2Ids.remove(file.uploadedFileId)
      } else {
        this.fileUpLoad.files2.remove(file)
      }
    },
    handleDeleteFile3 (file) {
      if (file.src) {
        this.fileUpLoad.oldFile3Ids.remove(file.uploadedFileId)
      } else {
        this.fileUpLoad.files3.remove(file)
      }
    },
    registerPlanManagerment () {
      this.loadPlanManagement()
    },

    handleChangeMoeyAmount (value) {
      this.form.work_money_amount = value.replace(/,/gi, '').replace(/\B(?=(\d{3})+(?!\d))/gi, ',')
    },

    handleProjectPlanSelected (data) {
      this.selectPlanProject = data
      this.popupActive = true
    }
  }
}
</script>

<style scoped>

</style>
