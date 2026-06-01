<template>
  <div>
    <!-- 첫번째 색션 -->
    <vs-row>
      <vs-col vs-type="flex" vs-justify="left" vs-align="center" w="12">
        <h5>
          <i class="dot"></i> 징후감지(초기대응) + 비상대응 및 수습복구
        </h5>
      </vs-col>
    </vs-row>
    <vs-row class="my-4">
      <table class="mb-4 table-wrap">
        <tr>
          <th class="p-4 th-cell">번호</th>
          <th class="p-4 th-cell">비상조치 절차도 (예시)</th>
          <th class="p-4 th-cell">내용</th>
        </tr>
        <tr>
          <td class="p-4 td-cell" >1</td>
          <td class="p-4 td-cell" >징후 접수</td>
          <td class="p-4 td-cell" ></td>
        </tr>
        <tr>
          <td class="p-4 td-cell" >2</td>
          <td class="p-4 td-cell" >징후전파 및 보고</td>
          <td class="p-4 td-cell" ></td>
        </tr>
        <tr>
          <td class="p-4 td-cell" >3</td>
          <td class="p-4 td-cell" >징후 대응 조치</td>
          <td class="p-4 td-cell" ></td>
        </tr>
        <tr>
          <td class="p-4 td-cell" >4.1</td>
          <td class="p-4 td-cell" >상황판단</td>
          <td class="p-4 td-cell" >▶ 5. 상황 관리 or  6.1 통지본 운영 or 6.2 수습·복구 활동 or (확대·확산시) 6.3 지대본 운영으로 전개</td>
        </tr>
        <tr>
          <td class="p-4 td-cell" >4.2</td>
          <td class="p-4 td-cell" >사고발생</td>
          <td class="p-4 td-cell" >상황접수 > 상황전파 및 보고 > 재난상황실 운영 > 현장 출동 및 대응 ▶ 4.1 상황판단</td>
        </tr>
        <tr>
          <td class="p-4 td-cell" >5</td>
          <td class="p-4 td-cell" >상황 관리</td>
          <td class="p-4 td-cell" >▶ 10. 상황 종료</td>
        </tr>
        <tr>
          <td class="p-4 td-cell" >6.1</td>
          <td class="p-4 td-cell" >통지본 운영</td>
          <td class="p-4 td-cell" >> 6.2 수습·복구 활동 or (보고/지원요청시) 6.3 지대본 운영</td>
        </tr>
        <tr>
          <td class="p-4 td-cell" >6.2</td>
          <td class="p-4 td-cell" >수습·복구 활동</td>
          <td class="p-4 td-cell" >▶ 7. 수습·복구 완료 </td>
        </tr>
        <tr>
          <td class="p-4 td-cell" >6.3</td>
          <td class="p-4 td-cell" >(확대·확산시) 지대본 운영</td>
          <td class="p-4 td-cell" >>  6.2 수습·복구 활동 or (대처지시/요청지원시) 6.1 통지본 운영</td>
        </tr>
        <tr>
          <td class="p-4 td-cell" >7</td>
          <td class="p-4 td-cell" >수습·복구 완료 </td>
          <td class="p-4 td-cell" ></td>
        </tr>
        <tr>
          <td class="p-4 td-cell" >8</td>
          <td class="p-4 td-cell" >비상기구 해체</td>
          <td class="p-4 td-cell" ></td>
        </tr>
        <tr>
          <td class="p-4 td-cell" >9</td>
          <td class="p-4 td-cell" >상황 모니터링</td>
          <td class="p-4 td-cell" >▶ 10. 상황 종료</td>
        </tr>
        <tr>
          <td class="p-4 td-cell" >10</td>
          <td class="p-4 td-cell" ></td>
          <td class="p-4 td-cell" >상황종료</td>
        </tr>
      </table>
    </vs-row>
  </div>
</template>

<script>
import config from '/public/config'
import VueCookie from 'vue-cookie'
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
    isPrint: Boolean,
    board: Object,
    value: Object
  },
  watch: {
    board: {
      immediate: true,
      deep: true,
      handler (value) {

      }
    },
    value: {
      immediate: true,
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
        this.$emit('input', value)
      }
    }
  },
  data() {
    return {
      form: {},
    }
  },
}
</script>

<style scoped>
.table-wrap {
  width: 100%;
  border-spacing: 0;
  border-top: 1px solid #cdcdcd;
  border-left: 1px solid #cdcdcd;
}

.th-cell {
  white-space: nowrap;
  border-right: 1px solid #cdcdcd;
  border-bottom: 1px solid #cdcdcd;
  background-color: #f9f9f9;
  text-align: center;
  font-weight: 500;
  font-size: 14px;
}

.th-cell:nth-child(1) {
  max-width: 130px;
  width: 130px;
}

.th-cell:nth-child(2) {
  max-width: 390px;
  width: 390px;
}

.td-cell {
  font-weight: 500;
  white-space: nowrap;
  border-right: 1px solid #cdcdcd;
  border-bottom: 1px solid #cdcdcd
}

.td-cell:nth-child(1) {
  text-align: center;
}
</style>
