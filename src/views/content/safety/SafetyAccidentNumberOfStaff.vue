<template>
  <div>
    <!--  상단 검색바-->
    <vx-card class="mb-4 ">
      <div class="flex justify-between" style="align-items:center">
        <div class="flex justify-center">
          <div class="pr-3 self-center">대상기간</div>
          <date-selector class="popup-fixed" v-model="sdate"></date-selector>
          <div class="ml-5"></div>
          <div class="px-3 self-center">현장명</div>
          <ml-input class="mr-2" v-model="keyword"/>
          <vs-button class="flex" type="border">상세검색</vs-button>
        </div>
        <vs-button class="self-stretch" @click="handleSearch">검색</vs-button>
      </div>
    </vx-card>

    <div class="mt-12">
      <table class="accidentTable">
        <thead>
        <tr>
          <th></th>
          <th colspan="5">금일 합계</th>
          <th colspan="4">금일 비율</th>
          <th colspan="5">월 합계</th>
        </tr>
        <tr>
          <th>현장명</th>
          <th>전체</th>
          <th>TBM</th>
          <th>여성</th>
          <th>교령</th>
          <th>외국인</th>
          <th>TBM</th>
          <th>여성</th>
          <th>교령</th>
          <th>외국인</th>
          <th>전체</th>
          <th>TBM</th>
          <th>여성</th>
          <th>교령</th>
          <th>외국인</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <th>건축주택</th>
          <td>1,000</td>
          <td>1,000</td>
          <td>1,000</td>
          <td>1,000</td>
          <td>1,000</td>
          <td>10%</td>
          <td>10%</td>
          <td>10%</td>
          <td>10%</td>
          <td>1,000</td>
          <td>1,000</td>
          <td>1,000</td>
          <td>1,000</td>
          <td>1,000</td>
        </tr>

        <tr>
          <th>Infra</th>
          <td>1,000</td>
          <td>1,000</td>
          <td>1,000</td>
          <td>1,000</td>
          <td>1,000</td>
          <td>10%</td>
          <td>10%</td>
          <td>10%</td>
          <td>10%</td>
          <td>1,000</td>
          <td>1,000</td>
          <td>1,000</td>
          <td>1,000</td>
          <td>1,000</td>
        </tr>


        <tr>
          <th>건축주택</th>
          <td>1,000</td>
          <td>1,000</td>
          <td>1,000</td>
          <td>1,000</td>
          <td>1,000</td>
          <td>10%</td>
          <td>10%</td>
          <td>10%</td>
          <td>10%</td>
          <td>1,000</td>
          <td>1,000</td>
          <td>1,000</td>
          <td>1,000</td>
          <td>1,000</td>
        </tr>
        <tr>
          <th>에너지 & Oil</th>
          <td>1,000</td>
          <td>1,000</td>
          <td>1,000</td>
          <td>1,000</td>
          <td>1,000</td>
          <td>10%</td>
          <td>10%</td>
          <td>10%</td>
          <td>10%</td>
          <td>1,000</td>
          <td>1,000</td>
          <td>1,000</td>
          <td>1,000</td>
          <td>1,000</td>
        </tr>

        <tr>
          <th>에너지 & Oil</th>
          <td>1,000</td>
          <td>1,000</td>
          <td>1,000</td>
          <td>1,000</td>
          <td>1,000</td>
          <td>10%</td>
          <td>10%</td>
          <td>10%</td>
          <td>10%</td>
          <td>1,000</td>
          <td>1,000</td>
          <td>1,000</td>
          <td>1,000</td>
          <td>1,000</td>
        </tr>

        <tr>
          <th><b>전체합계</b></th>
          <td>1,000</td>
          <td>1,000</td>
          <td>1,000</td>
          <td>1,000</td>
          <td>1,000</td>
          <td>10%</td>
          <td>10%</td>
          <td>10%</td>
          <td>10%</td>
          <td>1,000</td>
          <td>1,000</td>
          <td>1,000</td>
          <td>1,000</td>
          <td>1,000</td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import DateSelector from '@/components/selector/DateSelector'
import ECharts from 'vue-echarts/components/ECharts'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legend'
import 'echarts/lib/chart/bar'


export default {
  name: 'SafetyAccidentNumberOfStaff',
  components : {
    DateSelector,
    ECharts
  },
  data () {
    return {}
  }
}
</script>

<style scoped>
.tabList {

}
.tabList li {
  float: left;
  margin-right: 5px;
  padding: 12px 0;
  width: 120px;
  background-color: #fff;
  text-align: center;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  border: solid 1px #cdcdcd;
  border-bottom: none;
  box-sizing: border-box;
  color: #757575;
}
.tabList li.active {
  border: 1px solid #1E0D61;
  border-bottom: none;
  color: #1E0D61;
}

.accidentTable {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}
.accidentTable, .accidentTable tr, .accidentTable th, .accidentTable td {
  border: 1px solid #cdcdcd;
  text-align: center;
  font-size: 14px;
  height: 50px;
}
.accidentTable th {
  background-color: #f0f0f0;
}
</style>
