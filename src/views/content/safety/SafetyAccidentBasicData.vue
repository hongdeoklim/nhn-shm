<template>
  <div>
    <!--  상단 검색바-->
    <search-nav @handleSearch="handleSearch">
      <search-nav-item-select :label="$t('search.년도')" :list="nav.yearList" v-model="nav.year" />
    </search-nav>

    <vx-card class="mt-10 tableContainer">
      <div class="mb-6">
        <span class="pr-2" style="color:#7E72F2;"> &bull;</span>
        {{$t('content.safety.accident.basicdata.안전관리율 기초자료.title')}}
      </div>
      <table>
        <thead>
        <tr>
          <th>{{$t('content.safety.accident.basicdata.안전관리율 기초자료.table.현장명')}}</th>
          <th>{{$t('content.safety.accident.basicdata.안전관리율 기초자료.table.년간억제목표(%)')}}</th>
          <th>{{$t('content.safety.accident.basicdata.안전관리율 기초자료.table.노무비율(%)')}}</th>
          <th>{{$t('content.safety.accident.basicdata.안전관리율 기초자료.table.평균임금(원)')}}</th>
          <th>{{$t('content.safety.accident.basicdata.안전관리율 기초자료.table.비고')}}</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <th>{{$t('content.safety.accident.basicdata.안전관리율 기초자료.table.전체')}}</th>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <th>{{$t('content.safety.accident.basicdata.안전관리율 기초자료.table.토목')}}</th>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <th>{{$t('content.safety.accident.basicdata.안전관리율 기초자료.table.건축')}}</th>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <th>{{$t('content.safety.accident.basicdata.안전관리율 기초자료.table.화공플랜트')}}</th>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <th>{{$t('content.safety.accident.basicdata.안전관리율 기초자료.table.산업플랜트')}}</th>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <th>{{$t('content.safety.accident.basicdata.안전관리율 기초자료.table.기타')}}</th>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        </tbody>
      </table>


      <div class="mt-10 mb-6">
        <span class="pr-2" style="color:#7E72F2;"> &bull;</span>
        {{$t('content.safety.accident.basicdata.부분별 매출액.title')}}
      </div>
      <table>
        <thead>
        <tr>
          <th colspan="2">{{$t('content.safety.accident.basicdata.부분별 매출액.table.현장명')}}</th>
          <th>{{$t('content.safety.accident.basicdata.부분별 매출액.table.1월')}}</th>
          <th>{{$t('content.safety.accident.basicdata.부분별 매출액.table.2월')}}</th>
          <th>{{$t('content.safety.accident.basicdata.부분별 매출액.table.3월')}}</th>
          <th>{{$t('content.safety.accident.basicdata.부분별 매출액.table.4월')}}</th>
          <th>{{$t('content.safety.accident.basicdata.부분별 매출액.table.5월')}}</th>
          <th>{{$t('content.safety.accident.basicdata.부분별 매출액.table.6월')}}</th>
          <th>{{$t('content.safety.accident.basicdata.부분별 매출액.table.7월')}}</th>
          <th>{{$t('content.safety.accident.basicdata.부분별 매출액.table.8월')}}</th>
          <th>{{$t('content.safety.accident.basicdata.부분별 매출액.table.9월')}}</th>
          <th>{{$t('content.safety.accident.basicdata.부분별 매출액.table.10월')}}</th>
          <th>{{$t('content.safety.accident.basicdata.부분별 매출액.table.11월')}}</th>
          <th>{{$t('content.safety.accident.basicdata.부분별 매출액.table.12월')}}</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <th rowspan="4">{{$t('content.safety.accident.basicdata.부분별 매출액.table.아차')}}</th>
          <th>{{$t('content.safety.accident.basicdata.부분별 매출액.table.Infra')}}</th>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <th>{{$t('content.safety.accident.basicdata.부분별 매출액.table.건축주택')}}</th>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <th>{{$t('content.safety.accident.basicdata.부분별 매출액.table.플랜트')}}</th>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <th>{{$t('content.safety.accident.basicdata.부분별 매출액.table.에너지')}}</th>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <th rowspan="4">{{$t('content.safety.accident.basicdata.부분별 매출액.table.산재')}}</th>
          <th>{{$t('content.safety.accident.basicdata.부분별 매출액.table.Infra')}}</th>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <th>{{$t('content.safety.accident.basicdata.부분별 매출액.table.건축주택')}}</th>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <th>{{$t('content.safety.accident.basicdata.부분별 매출액.table.플랜트')}}</th>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <th>{{$t('content.safety.accident.basicdata.부분별 매출액.table.에너지')}}</th>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        </tbody>
      </table>
    </vx-card>
  </div>
</template>

<script>
import DateSelector from '@/components/selector/DateSelector'
import SearchNav from '@/components/nav/SearchNav'
import SearchNavItemDate from '@/components/nav/SearchNavItemDate'
import SearchNavItemKeyword from '@/components/nav/SearchNavItemKeyword'
import SearchNavItemSelect from '@/components/nav/SearchNavItemSelect'

export default {
  name: 'SafetyAccidentBasicData',
  components: {
    SearchNavItemSelect,
    SearchNavItemKeyword,
    SearchNavItemDate,
    SearchNav,
    DateSelector
  },
  data () {
    return {
      nav: {
        year: '',
        yearList: [
          {text: '2021', value: 2021},
          {text: '2020', value: 2020},
          {text: '2019', value: 2019}
        ]
      }
    }
  },
  methods: {
    handleSearch () {

    }
  }
}
</script>

<style scoped>
.tableContainer table {
  width: 100%;
  border-collapse: collapse;
}

.tableContainer td, .tableContainer th {
  height: 50px;
}

.tableContainer th {
  background-color: #ededed;
}

.tableContainer table, .tableContainer tr, .tableContainer td, .tableContainer th {
  border: 1px solid #cdcdcd;
  text-align: center;
}
</style>
