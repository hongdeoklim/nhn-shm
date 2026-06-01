<template>
  <div>
    <vs-row class="mb-6">
      <vs-col class="flex " vs-justify="flex-end">
        <div class="mr-auto" style="display:grid; align-items: center;">
          <h3>계약정보</h3>
        </div>

        <div class="ml-auto">
          <vs-button class="ml-4" color="secondary" type="border" @click="onClickPrint">인쇄</vs-button>
        </div>
      </vs-col>
    </vs-row>

    <div id="print-report">
      <vs-row >
        <vs-col class="mb-4">
          <h5><i class="dot"></i>기본정보</h5>
        </vs-col>
        <vs-row class="w-full mb-4" style="display: grid; grid-template-columns: 1fr 1fr 1fr; column-gap:2rem; row-gap: 14px;">
          <vs-col class="flex" vs-align="center">
            <label class="w-4/12 title ">구분</label>
            <div class="w-8/12">
              <span v-if="isPrint" class="print-input">{{ projectInfo.field_name }}</span>
              <ml-input v-else class="w-full" :readonly="true" :value="projectInfo.field_name"/>
            </div>
          </vs-col>
          <vs-col class="flex" vs-align="center">
            <label class="w-4/12 title ">회사명</label>
            <div class="w-8/12">
              <span v-if="isPrint" class="print-input"></span>
              <ml-input v-else class="w-full" :readonly="true" />
            </div>
          </vs-col>
          <vs-col class="flex" vs-align="center">
            <label class="w-4/12 title ">계약코드</label>
            <div class="w-8/12">
              <span v-if="isPrint" class="print-input">{{ projectInfo.contract_code }}</span>
              <ml-input v-else class="w-full" :readonly="true" :value="projectInfo.contract_code"/>
            </div>
          </vs-col>
          <vs-col class="flex" vs-align="center">
            <label class="w-4/12 title ">담당부서</label>
            <div class="w-8/12">
              <span v-if="isPrint" class="print-input"></span>
              <ml-input v-else class="w-full" :readonly="true" />
            </div>
          </vs-col>
          <vs-col class="flex" vs-align="center">
            <label class="w-4/12 title ">팀장</label>
            <div class="w-8/12">
              <span v-if="isPrint" class="print-input"></span>
              <ml-input v-else class="w-full" :readonly="true" />
            </div>
          </vs-col>
          <vs-col class="flex" vs-align="center">
            <label class="w-4/12 title ">담당자</label>
            <div class="w-8/12">
              <span v-if="isPrint" class="print-input"></span>
              <ml-input v-else class="w-full" :readonly="true" />
            </div>
          </vs-col>
          <vs-col class="flex" vs-align="center">
            <label class="w-4/12 title ">이메일</label>
            <div class="w-8/12">
              <span v-if="isPrint" class="print-input"></span>
              <ml-input v-else class="w-full" :readonly="true" />
            </div>
          </vs-col>
          <vs-col class="flex" vs-align="center">
            <label class="w-4/12 title ">대표번호</label>
            <div class="w-8/12">
              <span v-if="isPrint" class="print-input"></span>
              <ml-input v-else class="w-full" :readonly="true" />
            </div>
          </vs-col>
          <vs-col class="flex" vs-align="center">
            <label class="w-4/12 title ">FAX</label>
            <div class="w-8/12">
              <span v-if="isPrint" class="print-input"></span>
              <ml-input v-else class="w-full" :readonly="true" />
            </div>
          </vs-col>

        </vs-row>
      </vs-row>
    </div>
  </div>
</template>

<script>
import PopupPlanProject from '@/views/project/popup/PopupPlanProject'
import DateSelector from '@/components/selector/DateSelector'
import PopupProjectSetting from '@/views/project/PopupProjectSetting'
import MemberSelector from '@/components/selector/MemberSelector'
import CompanySelector from '@/components/selector/CompanySelector'
import FileUploader from '@/components/FileUploader'

export default {
  components: {
    FileUploader,
    CompanySelector,
    MemberSelector,
    PopupProjectSetting,
    DateSelector,
    PopupPlanProject
  },
  props: {
    board: Object,
    value: Object
  },
  watch: {
    board: {
      immediate: true,
      deep: true,
      handler (/*value*/) {}
    },
    value: {
      important: true,
      deep: true,
      handler (value) {
        const keys = Object.keys(this.form)
        for (const key of keys) {
          if (value[key]) {
            this.form[key] = value[key]
          }
        }
      }
    },
    form: {
      immediate: true,
      deep: true,
      handler (value) {
        value.title = value.inputA_2
        this.$emit('input', value)
      }
    }
  },
  computed: {
    projectInfo () {
      return this.$store.state.project.projectInfo
    },
  },
  data () {
    return {
      isPrint: false,
      form: {},
    }
  },
  methods: {
    onClickPrint () {
      // 프린트
      this.isPrint = true

      setTimeout(() => {
        const g_oBeforeBody = document.getElementById('print-report').innerHTML
        // 프린트를 보이는 그대로 나오기위한 셋팅
        window.onbeforeprint = function () {
          document.body.style.backgroundColor = '#fff'
          document.body.innerHTML = `${g_oBeforeBody}`
        }
        window.print()
        location.reload()
      }, 300)
    },
  }
}
</script>

<style scoped>

</style>
