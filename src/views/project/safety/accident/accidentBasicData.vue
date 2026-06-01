<template>
  <div>
    <!--  상단 검색바-->
    <search-nav @handleSearch="handleSearch">
      <search-nav-item-select label="년도" :list="nav.yearList" v-model="nav.year" />
    </search-nav>

    <vx-card class="mt-10 tableContainer">
      <div class="mb-6">
        <span class="pr-2" style="color:#7E72F2;"> &bull;</span>
        안전관리율 기초자료
      </div>
      <table>
        <thead>
        <tr>
          <th>현장명</th>
          <th>년간억제목표(%)</th>
          <th>노무비율(%)</th>
          <th>평균임금(원)</th>
          <th>비고</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <th>전체</th>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <th>토목</th>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <th>건축</th>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <th>화공플랜트</th>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <th>산업플랜트</th>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <th>기타</th>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        </tbody>
      </table>


      <div class="mt-10 mb-6">
        <span class="pr-2" style="color:#7E72F2;"> &bull;</span>
        부분별 매출액
      </div>
      <table>
        <thead>
        <tr>
          <th colspan="2">현장명</th>
          <th>1월</th>
          <th>2월</th>
          <th>3월</th>
          <th>4월</th>
          <th>5월</th>
          <th>6월</th>
          <th>7월</th>
          <th>8월</th>
          <th>9월</th>
          <th>10월</th>
          <th>11월</th>
          <th>12월</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <th rowspan="4">아차</th>
          <th>Infra</th>
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
          <th>건축주택</th>
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
          <th>플랜트</th>
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
          <th>에너지</th>
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
          <th rowspan="4">산재</th>
          <th>Infra</th>
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
          <th>건축주택</th>
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
          <th>플랜트</th>
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
          <th>에너지</th>
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
  name: 'AccidentBasicData',
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
