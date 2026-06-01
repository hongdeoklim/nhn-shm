<template>
  <vs-popup id="popupRegAdmin" title="점검결과" :active.sync="popupActiveSync" >


    <vs-row>
      <vs-col><h5><i class="dot"></i>점검결과 입력</h5></vs-col>
    </vs-row>

    <vs-row class="w-full pl-8 pr-8 pt-0 pb-0">
      <vs-row class="w-full border-top flex pt-4 pb-4" style="background-color: #f9f9f9;" vs-align="center">
        <vs-col class="w-2/12 title" style="text-align: center">구분</vs-col>
        <vs-col class="w-10/12 title">
          <vs-row>
            <vs-col class="w-4/12 title" style="text-align: center">안전조치 및 확인사항</vs-col>
            <vs-col class="w-4/12 title" style="text-align: center">점검결과</vs-col>
            <vs-col class="w-4/12 title" style="text-align: center">조치사항</vs-col>
          </vs-row>
        </vs-col>
      </vs-row>
    </vs-row>

    <vs-row class="w-full pl-8 pr-8 pt-0 pb-0" vs-align="center">
      <vs-row class="w-full border-top pt-2 pb-2" vs-align="center">
        <vs-col class="w-2/12 title" style="text-align: center">작업계획서</vs-col>
        <vs-col class="w-10/12 title">
          <vs-row v-for="(data, wi) in form.workPlan" :key="wi">
            <vs-col class="w-4/12 px-1"><ml-input class="w-full mb-1" :readonly="true" v-model="data.check_list"/></vs-col>
            <vs-col class="w-4/12 px-1"><ml-input class="w-full mb-1" v-model="data.check_result"/></vs-col>
            <vs-col class="w-4/12 px-1"><ml-input class="w-full mb-1" v-model="data.action"/></vs-col>
          </vs-row>
        </vs-col>
      </vs-row>
    </vs-row>

    <vs-row class="w-full pl-8 pr-8 pt-0 pb-0" vs-align="center">
      <vs-row class="w-full border-top pt-2 pb-2" vs-align="center">
        <vs-col class="w-2/12 title" style="text-align: center">운전자격<br/>적정여부</vs-col>
        <vs-col class="w-10/12 title">
          <vs-row v-for="(data, di) in form.driver" :key="di">
            <vs-col class="w-4/12 px-1"><ml-input class="w-full mb-1" :readonly="true" v-model="data.check_list"/></vs-col>
            <vs-col class="w-4/12 px-1"><ml-input class="w-full mb-1" v-model="data.check_result"/></vs-col>
            <vs-col class="w-4/12 px-1"><ml-input class="w-full mb-1" v-model="data.action"/></vs-col>
          </vs-row>
        </vs-col>
      </vs-row>
    </vs-row>

    <vs-row class="w-full pl-8 pr-8 pt-0 pb-0" vs-align="center">
      <vs-row class="w-full border-top border-bottom pt-2 pb-2" vs-align="center">
        <vs-col class="w-2/12 title" style="text-align: center">안전장치설치<br/>및 사용상태</vs-col>
        <vs-col class="w-10/12 title">
          <vs-row v-for="(data, si) in form.safetyDevice" :key="si">
            <vs-col class="w-4/12 px-1"><ml-input class="w-full mb-1" :readonly="true" v-model="data.check_list"/></vs-col>
            <vs-col class="w-4/12 px-1"><ml-input class="w-full mb-1" v-model="data.check_result"/></vs-col>
            <vs-col class="w-4/12 px-1"><ml-input class="w-full mb-1" v-model="data.action"/></vs-col>
          </vs-row>
        </vs-col>
      </vs-row>
    </vs-row>

    <vs-row>
      <vs-col><h5><i class="dot"></i>근로자의견 입력</h5></vs-col>
    </vs-row>

    <vs-col class="flex flex-wrap mb-4 pl-4 pr-4" >
      <vs-row class="w-1/2  mb-4 flex" vs-align="center">
        <vs-col class="w-4/12 title pl-4">조치일</vs-col>
        <vs-col class="w-8/12 pr-4"><date-selector class="w-full" v-model="form.actionDate"/></vs-col>
      </vs-row>
      <vs-row class="w-1/2  mb-4 flex" vs-align="center">
        <vs-col class="w-4/12 title pl-4">조치결과</vs-col>
        <vs-col class="w-8/12 pr-4"><ml-input class="w-full" v-model="form.actionResult"/></vs-col>
      </vs-row>

      <vs-row class="w-1/2  mb-8 flex" vs-align="center">
        <vs-col class="w-4/12 title pl-4">조치전<br/>(사진)</vs-col>
        <vs-col class="w-8/12 pr-4"><file-uploader class="w-full" v-model="form.before" :readonly="board.readonly"></file-uploader></vs-col>
      </vs-row>
      <vs-row class="w-1/2  mb-8 flex" vs-align="center">
        <vs-col class="w-4/12 title pl-4">조치후<br/>(사진)</vs-col>
        <vs-col class="w-8/12 pr-4"><file-uploader class="w-full" v-model="form.after" :readonly="board.readonly"></file-uploader></vs-col>
      </vs-row>


      <vs-row class="mb-8" v-if="registerable">
        <vs-col class="flex" vs-justify="center">
          <vs-button class="mr-2" color="secondary" @click="handleClickUpload">저장</vs-button>
        </vs-col>
      </vs-row>
    </vs-col>

  </vs-popup>
</template>

<script>
import DateSelector from '../../../components/selector/DateSelector'
import FileUploader from '../../../components/FileUploader'

export default {
  name: 'PopupEquipmentResult',
  props: {
    popupActive: Boolean,
    value:Object,
    registerable: Boolean
  },
  components: {
    FileUploader,
    DateSelector
  },
  watch: {
    value (value) {
      this.selectPlanDetail = value
      this.initData()
    },
    popupActiveSync(value) {
      const body = document.querySelector('body');
      if (value) {
        body.style.overflow = 'hidden'
      } else {
        body.style.overflow = 'auto'
      }
    },

  },
  data () {
    return {
      postId:'',
      selectPlanDetail:{},
      postList:{},
      table: {
        list: [],
        perPage: 7,
        keyword: ''
      },
      checkList: 2,

      // TODO : 글쓰기 정보 및 권한
      board: {
        slug: 'periodical_risk',
        statusCode: '', // 문서 상태코드
        writer: {}, //작성자 정보
        turnApprovalId: 0, // 결재자 ID
        readonly: false, // 읽기전용인가
        isWriter: true, // 작성자인가
        savable: true, // 임시저장이 가능하나
        isCompleteApproval: false, // 결재완료된 문서인가
        isTurnApproval: false, // 결재할 차례인가
        approvalLine: [], // 결재라인
        commentList: [] // 댓글리스트
      },

      form: {
        workPlan:[[], []],
        driver:[[]],
        safetyDevice:[[], []],

        actionDate:'',
        actionResult:'',
        before:{},
        after:{},

        boardId: '',
        boardSlug: '',
        check_com: '',
        check_date: '',
        control_num: '',
        inspection_com: '',
        inspection_date: '',
        manufacturer: '',
        model_name: '',
        name: '',
        postId: '',
        type: '',

        preview:{
          boardId: '',
          postId: '',
          boardSlug: '',
          check_com: '',
          check_date: '',
          control_num: '',
          inspection_com: '',
          inspection_date: '',
          manufacturer: '',
          model_name: '',
          name: '',
          type: '',
          actionDate:''
        }
      }
    }
  },
  computed: {
    popupActiveSync: {
      get () {
        return this.popupActive
      },
      set () {
        this.handleCloseSelf()
      }
    }
  },
  created () {

  },
  methods: {

    initData () {
      this.form = this.selectPlanDetail
    },

    handleClickUpload () {
      this.$emit('handleClickUploadDetail', this.form)
      this.handleCloseSelf()
    },

    handleCloseSelf () {
      this.$emit('popupActiveSync', false)
    }
  }
}

</script>

<style>

  #popupRegAdmin > .vs-popup {
    width:1024px !important;
  }
  #popupRegAdmin > .vs-popup > .vs-popup--content {
    width:100%;
    padding:0;
    margin:0;
  }
  #popupRegAdmin > .vs-popup > .vs-popup--content > .vs-row{
    padding:24px;

  }

</style>

<style scoped>

  .table-layout {
    border: 1px solid #cdcdcd;
  }
  .table-layout .trow {
    border-bottom: 1px solid #cdcdcd;
  }
  .table-layout .tcol {
    border-right: 1px solid #cdcdcd;
  }
</style>
