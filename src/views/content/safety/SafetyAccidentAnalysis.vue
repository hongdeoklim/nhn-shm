<template>
  <div>
    <!--  상단 검색바-->
    <search-nav @handleSearch="handleSearch">
      <search-nav-item-select :label="$t('search.대상기간')" v-model="nav.year" :list="nav.yearList" />년
      <search-nav-item-select v-model="nav.month" :list="nav.monthList" /><span class="mr-4">월</span>
      <search-nav-item-project :label="$t('search.현장명')" v-model="nav.projectId" />
    </search-nav>

    <div class="mr-2 mb-4 flex" style="justify-content: flex-end">
      <vs-button type="border" color="secondary" @click="excelDownFunc">{{$t('button.Excel 다운로드')}}</vs-button>
    </div>

    <div>
      <ul class="tabList">
        <li :class="tab === 'disease_type' ? 'active' : ''" @click="()=>{selectTab('disease_type')}">
          <a class="w-full h-full" href="javascript:;" >{{$t('content.safety.accident.analysis.tab.발생형태')}}</a>
        </li>
        <li :class="tab === 'workType' ? 'active' : ''" @click="()=>{selectTab('workType')}">
          <a href="javascript:;" >{{$t('content.safety.accident.analysis.tab.직종')}}</a>
        </li>
        <li :class="tab === 'monthly' ? 'active' : ''" @click="()=>{selectTab('monthly')}">
          <a href="javascript:;" >{{$t('content.safety.accident.analysis.tab.월')}}</a>
        </li>
        <li :class="tab === 'dotw' ? 'active' : ''" @click="()=>{selectTab('dotw')}">
          <a href="javascript:;" >{{$t('content.safety.accident.analysis.tab.요일')}}</a>
        </li>
        <li :class="tab === 'time' ? 'active' : ''" @click="()=>{selectTab('time')}">
          <a href="javascript:;" >{{$t('content.safety.accident.analysis.tab.시간')}}</a>
        </li>
        <li :class="tab === 'price' ? 'active' : ''" @click="()=>{selectTab('price')}">
          <a href="javascript:;" >{{$t('content.safety.accident.analysis.tab.사업금액')}}</a>
        </li>
        <li :class="tab === 'disease_site' ? 'active' : ''" @click="()=>{selectTab('disease_site')}">
          <a href="javascript:;" >{{$t('content.safety.accident.analysis.tab.상해부위')}}</a>
        </li>
        <li :class="tab === 'harmful' ? 'active' : ''" @click="()=>{selectTab('harmful')}">
          <a href="javascript:;" >{{$t('content.safety.accident.analysis.tab.기인물')}}</a>
        </li>
      </ul>
    </div>
    <div>

      <table v-if="tab === 'disease_type'" class="accidentTable">
        <thead>
        <tr>
          <th>{{$t('content.safety.accident.analysis.table.구분')}}</th>
          <th>{{$t('content.safety.accident.analysis.table.추락')}}</th>
          <th>{{$t('content.safety.accident.analysis.table.전도')}}</th>
          <th>{{$t('content.safety.accident.analysis.table.충돌')}}</th>
          <th>{{$t('content.safety.accident.analysis.table.낙하/비래')}}</th>
          <th>{{$t('content.safety.accident.analysis.table.붕괴/도괴')}}</th>
          <th>{{$t('content.safety.accident.analysis.table.협착')}}</th>
          <th>{{$t('content.safety.accident.analysis.table.감전')}}</th>
          <th>{{$t('content.safety.accident.analysis.table.무리한동작')}}</th>
          <th>{{$t('content.safety.accident.analysis.table.지병')}}</th>
          <th>{{$t('content.safety.accident.analysis.table.화상')}}</th>
          <th>{{$t('content.safety.accident.analysis.table.매몰/질식')}}</th>
          <th>{{$t('content.safety.accident.analysis.table.교통사고')}}</th>
          <th>{{$t('content.safety.accident.analysis.table.기타')}}</th>
          <th>{{$t('content.safety.accident.analysis.table.계')}}</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <th>{{$t('content.safety.accident.analysis.table.구분')}}</th>
          <td>{{table.disease_type.human_downfall}}</td>
          <td>{{table.disease_type.plane_fall}}</td>
          <td>{{table.disease_type.crash}}</td>
          <td>{{table.disease_type.stuff_downfail}}</td>
          <td>{{table.disease_type.collapse}}</td>
          <td>{{table.disease_type.narrow}}</td>
          <td>{{table.disease_type.electric_shock}}</td>
          <td>{{table.disease_type.overwork_motion}}</td>
          <td>{{table.disease_type.chronic}}</td>
          <td>{{table.disease_type.burns}}</td>
          <td>{{table.disease_type.choke}}</td>
          <td>{{table.disease_type.traffic}}</td>
          <td>{{table.disease_type.etc}}</td>
          <td>{{table.disease_type.total}}</td>
        </tr>
        <tr>
          <th>{{$t('content.safety.accident.analysis.table.점유율(%)')}}</th>
          <td>{{getRatio(table.disease_type.human_downfall, table.disease_type.total)}}</td>
          <td>{{getRatio(table.disease_type.plane_fall, table.disease_type.total)}}</td>
          <td>{{getRatio(table.disease_type.crash, table.disease_type.total)}}</td>
          <td>{{getRatio(table.disease_type.stuff_downfail, table.disease_type.total)}}</td>
          <td>{{getRatio(table.disease_type.collapse, table.disease_type.total)}}</td>
          <td>{{getRatio(table.disease_type.narrow, table.disease_type.total)}}</td>
          <td>{{getRatio(table.disease_type.electric_shock, table.disease_type.total)}}</td>
          <td>{{getRatio(table.disease_type.overwork_motion, table.disease_type.total)}}</td>
          <td>{{getRatio(table.disease_type.chronic, table.disease_type.total)}}</td>
          <td>{{getRatio(table.disease_type.burns, table.disease_type.total)}}</td>
          <td>{{getRatio(table.disease_type.choke, table.disease_type.total)}}</td>
          <td>{{getRatio(table.disease_type.traffic, table.disease_type.total)}}</td>
          <td>{{getRatio(table.disease_type.etc, table.disease_type.total)}}</td>
          <td>100</td>
        </tr>
        </tbody>
      </table>
      <table v-if="tab === 'workType'" class="accidentTable">
        <thead>
        <tr>
          <th>{{$t('content.safety.accident.analysis.table.구분')}}</th>
          <th>{{$t('content.safety.accident.analysis.table.추락')}}</th>
          <th>{{$t('content.safety.accident.analysis.table.전도')}}</th>
          <th>{{$t('content.safety.accident.analysis.table.충돌')}}</th>
          <th>{{$t('content.safety.accident.analysis.table.낙하/비래')}}</th>
          <th>{{$t('content.safety.accident.analysis.table.붕괴/도괴')}}</th>
          <th>{{$t('content.safety.accident.analysis.table.협착')}}</th>
          <th>{{$t('content.safety.accident.analysis.table.감전')}}</th>
          <th>{{$t('content.safety.accident.analysis.table.무리한동작')}}</th>
          <th>{{$t('content.safety.accident.analysis.table.지병')}}</th>
          <th>{{$t('content.safety.accident.analysis.table.화상')}}</th>
          <th>{{$t('content.safety.accident.analysis.table.매몰/질식')}}</th>
          <th>{{$t('content.safety.accident.analysis.table.교통사고')}}</th>
          <th>{{$t('content.safety.accident.analysis.table.기타')}}</th>
          <th>{{$t('content.safety.accident.analysis.table.계')}}</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <th>{{$t('content.safety.accident.analysis.table.구분')}}</th>
          <td>6</td>
          <td>7</td>
          <td>4</td>
          <td>5</td>
          <td>0</td>
          <td>7</td>
          <td>0</td>
          <td>1</td>
          <td>1</td>
          <td>1</td>
          <td>0</td>
          <td>0</td>
          <td>2</td>
          <td>34</td>
        </tr>
        <tr>
          <th>{{$t('content.safety.accident.analysis.table.점유율(%)')}}</th>
          <td>17.65</td>
          <td>20.59</td>
          <td>11.76</td>
          <td>14.71</td>
          <td>0</td>
          <td>20.59</td>
          <td>0</td>
          <td>2.94</td>
          <td>2.94</td>
          <td>2.94</td>
          <td>0</td>
          <td>0</td>
          <td>5.08</td>
          <td>100</td>
        </tr>
        </tbody>
      </table>
      <table v-if="tab === 'monthly'" class="accidentTable">
        <thead>
        <tr>
          <th>{{$t('content.safety.accident.analysis.table.구분')}}</th>
          <th>{{$t('content.safety.accident.analysis.table.추락')}}</th>
          <th>{{$t('content.safety.accident.analysis.table.전도')}}</th>
          <th>{{$t('content.safety.accident.analysis.table.충돌')}}</th>
          <th>{{$t('content.safety.accident.analysis.table.낙하/비래')}}</th>
          <th>{{$t('content.safety.accident.analysis.table.붕괴/도괴')}}</th>
          <th>{{$t('content.safety.accident.analysis.table.협착')}}</th>
          <th>{{$t('content.safety.accident.analysis.table.감전')}}</th>
          <th>{{$t('content.safety.accident.analysis.table.무리한동작')}}</th>
          <th>{{$t('content.safety.accident.analysis.table.지병')}}</th>
          <th>{{$t('content.safety.accident.analysis.table.화상')}}</th>
          <th>{{$t('content.safety.accident.analysis.table.매몰/질식')}}</th>
          <th>{{$t('content.safety.accident.analysis.table.교통사고')}}</th>
          <th>{{$t('content.safety.accident.analysis.table.기타')}}</th>
          <th>{{$t('content.safety.accident.analysis.table.계')}}</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <th>{{$t('content.safety.accident.analysis.table.구분')}}</th>
          <td>6</td>
          <td>7</td>
          <td>4</td>
          <td>5</td>
          <td>0</td>
          <td>7</td>
          <td>0</td>
          <td>1</td>
          <td>1</td>
          <td>1</td>
          <td>0</td>
          <td>0</td>
          <td>2</td>
          <td>34</td>
        </tr>
        <tr>
          <th>{{$t('content.safety.accident.analysis.table.점유율(%)')}}</th>
          <td>17.65</td>
          <td>20.59</td>
          <td>11.76</td>
          <td>14.71</td>
          <td>0</td>
          <td>20.59</td>
          <td>0</td>
          <td>2.94</td>
          <td>2.94</td>
          <td>2.94</td>
          <td>0</td>
          <td>0</td>
          <td>5.08</td>
          <td>100</td>
        </tr>
        </tbody>
      </table>
      <table v-if="tab === 'dotw'" class="accidentTable">
        <thead>
        <tr>
          <th>{{$t('content.safety.accident.analysis.table.구분')}}</th>
          <th>{{$t('content.safety.accident.analysis.table.추락')}}</th>
          <th>{{$t('content.safety.accident.analysis.table.전도')}}</th>
          <th>{{$t('content.safety.accident.analysis.table.충돌')}}</th>
          <th>{{$t('content.safety.accident.analysis.table.낙하/비래')}}</th>
          <th>{{$t('content.safety.accident.analysis.table.붕괴/도괴')}}</th>
          <th>{{$t('content.safety.accident.analysis.table.협착')}}</th>
          <th>{{$t('content.safety.accident.analysis.table.감전')}}</th>
          <th>{{$t('content.safety.accident.analysis.table.무리한동작')}}</th>
          <th>{{$t('content.safety.accident.analysis.table.지병')}}</th>
          <th>{{$t('content.safety.accident.analysis.table.화상')}}</th>
          <th>{{$t('content.safety.accident.analysis.table.매몰/질식')}}</th>
          <th>{{$t('content.safety.accident.analysis.table.교통사고')}}</th>
          <th>{{$t('content.safety.accident.analysis.table.기타')}}</th>
          <th>{{$t('content.safety.accident.analysis.table.계')}}</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <th>{{$t('content.safety.accident.analysis.table.구분')}}</th>
          <td>6</td>
          <td>7</td>
          <td>4</td>
          <td>5</td>
          <td>0</td>
          <td>7</td>
          <td>0</td>
          <td>1</td>
          <td>1</td>
          <td>1</td>
          <td>0</td>
          <td>0</td>
          <td>2</td>
          <td>34</td>
        </tr>
        <tr>
          <th>{{$t('content.safety.accident.analysis.table.점유율(%)')}}</th>
          <td>17.65</td>
          <td>20.59</td>
          <td>11.76</td>
          <td>14.71</td>
          <td>0</td>
          <td>20.59</td>
          <td>0</td>
          <td>2.94</td>
          <td>2.94</td>
          <td>2.94</td>
          <td>0</td>
          <td>0</td>
          <td>5.08</td>
          <td>100</td>
        </tr>
        </tbody>
      </table>
      <table v-if="tab === 'time'" class="accidentTable">
        <thead>
        <tr>
          <th>{{$t('content.safety.accident.analysis.table.구분')}}</th>
          <th>{{$t('content.safety.accident.analysis.table.추락')}}</th>
          <th>{{$t('content.safety.accident.analysis.table.전도')}}</th>
          <th>{{$t('content.safety.accident.analysis.table.충돌')}}</th>
          <th>{{$t('content.safety.accident.analysis.table.낙하/비래')}}</th>
          <th>{{$t('content.safety.accident.analysis.table.붕괴/도괴')}}</th>
          <th>{{$t('content.safety.accident.analysis.table.협착')}}</th>
          <th>{{$t('content.safety.accident.analysis.table.감전')}}</th>
          <th>{{$t('content.safety.accident.analysis.table.무리한동작')}}</th>
          <th>{{$t('content.safety.accident.analysis.table.지병')}}</th>
          <th>{{$t('content.safety.accident.analysis.table.화상')}}</th>
          <th>{{$t('content.safety.accident.analysis.table.매몰/질식')}}</th>
          <th>{{$t('content.safety.accident.analysis.table.교통사고')}}</th>
          <th>{{$t('content.safety.accident.analysis.table.기타')}}</th>
          <th>{{$t('content.safety.accident.analysis.table.계')}}</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <th>{{$t('content.safety.accident.analysis.table.구분')}}</th>
          <td>6</td>
          <td>7</td>
          <td>4</td>
          <td>5</td>
          <td>0</td>
          <td>7</td>
          <td>0</td>
          <td>1</td>
          <td>1</td>
          <td>1</td>
          <td>0</td>
          <td>0</td>
          <td>2</td>
          <td>34</td>
        </tr>
        <tr>
          <th>{{$t('content.safety.accident.analysis.table.점유율(%)')}}</th>
          <td>17.65</td>
          <td>20.59</td>
          <td>11.76</td>
          <td>14.71</td>
          <td>0</td>
          <td>20.59</td>
          <td>0</td>
          <td>2.94</td>
          <td>2.94</td>
          <td>2.94</td>
          <td>0</td>
          <td>0</td>
          <td>5.08</td>
          <td>100</td>
        </tr>
        </tbody>
      </table>
      <table v-if="tab === 'age'" class="accidentTable">
        <thead>
        <tr>
          <th>{{$t('content.safety.accident.analysis.table.구분')}}</th>
          <th>{{$t('content.safety.accident.analysis.table.추락')}}</th>
          <th>{{$t('content.safety.accident.analysis.table.전도')}}</th>
          <th>{{$t('content.safety.accident.analysis.table.충돌')}}</th>
          <th>{{$t('content.safety.accident.analysis.table.낙하/비래')}}</th>
          <th>{{$t('content.safety.accident.analysis.table.붕괴/도괴')}}</th>
          <th>{{$t('content.safety.accident.analysis.table.협착')}}</th>
          <th>{{$t('content.safety.accident.analysis.table.감전')}}</th>
          <th>{{$t('content.safety.accident.analysis.table.무리한동작')}}</th>
          <th>{{$t('content.safety.accident.analysis.table.지병')}}</th>
          <th>{{$t('content.safety.accident.analysis.table.화상')}}</th>
          <th>{{$t('content.safety.accident.analysis.table.매몰/질식')}}</th>
          <th>{{$t('content.safety.accident.analysis.table.교통사고')}}</th>
          <th>{{$t('content.safety.accident.analysis.table.기타')}}</th>
          <th>{{$t('content.safety.accident.analysis.table.계')}}</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <th>{{$t('content.safety.accident.analysis.table.구분')}}</th>
          <td>6</td>
          <td>7</td>
          <td>4</td>
          <td>5</td>
          <td>0</td>
          <td>7</td>
          <td>0</td>
          <td>1</td>
          <td>1</td>
          <td>1</td>
          <td>0</td>
          <td>0</td>
          <td>2</td>
          <td>34</td>
        </tr>
        <tr>
          <th>{{$t('content.safety.accident.analysis.table.점유율(%)')}}</th>
          <td>17.65</td>
          <td>20.59</td>
          <td>11.76</td>
          <td>14.71</td>
          <td>0</td>
          <td>20.59</td>
          <td>0</td>
          <td>2.94</td>
          <td>2.94</td>
          <td>2.94</td>
          <td>0</td>
          <td>0</td>
          <td>5.08</td>
          <td>100</td>
        </tr>
        </tbody>
      </table>
      <table v-if="tab === 'price'" class="accidentTable">
        <thead>
        <tr>
          <th>{{$t('content.safety.accident.analysis.table.구분')}}</th>
          <th>{{$t('content.safety.accident.analysis.table.추락')}}</th>
          <th>{{$t('content.safety.accident.analysis.table.전도')}}</th>
          <th>{{$t('content.safety.accident.analysis.table.충돌')}}</th>
          <th>{{$t('content.safety.accident.analysis.table.낙하/비래')}}</th>
          <th>{{$t('content.safety.accident.analysis.table.붕괴/도괴')}}</th>
          <th>{{$t('content.safety.accident.analysis.table.협착')}}</th>
          <th>{{$t('content.safety.accident.analysis.table.감전')}}</th>
          <th>{{$t('content.safety.accident.analysis.table.무리한동작')}}</th>
          <th>{{$t('content.safety.accident.analysis.table.지병')}}</th>
          <th>{{$t('content.safety.accident.analysis.table.화상')}}</th>
          <th>{{$t('content.safety.accident.analysis.table.매몰/질식')}}</th>
          <th>{{$t('content.safety.accident.analysis.table.교통사고')}}</th>
          <th>{{$t('content.safety.accident.analysis.table.기타')}}</th>
          <th>{{$t('content.safety.accident.analysis.table.계')}}</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <th>{{$t('content.safety.accident.analysis.table.구분')}}</th>
          <td>6</td>
          <td>7</td>
          <td>4</td>
          <td>5</td>
          <td>0</td>
          <td>7</td>
          <td>0</td>
          <td>1</td>
          <td>1</td>
          <td>1</td>
          <td>0</td>
          <td>0</td>
          <td>2</td>
          <td>34</td>
        </tr>
        <tr>
          <th>{{$t('content.safety.accident.analysis.table.점유율(%)')}}</th>
          <td>17.65</td>
          <td>20.59</td>
          <td>11.76</td>
          <td>14.71</td>
          <td>0</td>
          <td>20.59</td>
          <td>0</td>
          <td>2.94</td>
          <td>2.94</td>
          <td>2.94</td>
          <td>0</td>
          <td>0</td>
          <td>5.08</td>
          <td>100</td>
        </tr>
        </tbody>
      </table>
      <table v-if="tab === 'disease_site'" class="accidentTable">
        <thead>
        <tr>
          <th>{{$t('content.safety.accident.analysis.table.구분')}}</th>
          <th>{{$t('content.safety.accident.analysis.table.추락')}}</th>
          <th>{{$t('content.safety.accident.analysis.table.전도')}}</th>
          <th>{{$t('content.safety.accident.analysis.table.충돌')}}</th>
          <th>{{$t('content.safety.accident.analysis.table.낙하/비래')}}</th>
          <th>{{$t('content.safety.accident.analysis.table.붕괴/도괴')}}</th>
          <th>{{$t('content.safety.accident.analysis.table.협착')}}</th>
          <th>{{$t('content.safety.accident.analysis.table.감전')}}</th>
          <th>{{$t('content.safety.accident.analysis.table.무리한동작')}}</th>
          <th>{{$t('content.safety.accident.analysis.table.지병')}}</th>
          <th>{{$t('content.safety.accident.analysis.table.화상')}}</th>
          <th>{{$t('content.safety.accident.analysis.table.매몰/질식')}}</th>
          <th>{{$t('content.safety.accident.analysis.table.교통사고')}}</th>
          <th>{{$t('content.safety.accident.analysis.table.기타')}}</th>
          <th>{{$t('content.safety.accident.analysis.table.계')}}</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <th>{{$t('content.safety.accident.analysis.table.구분')}}</th>
          <td>6</td>
          <td>7</td>
          <td>4</td>
          <td>5</td>
          <td>0</td>
          <td>7</td>
          <td>0</td>
          <td>1</td>
          <td>1</td>
          <td>1</td>
          <td>0</td>
          <td>0</td>
          <td>2</td>
          <td>34</td>
        </tr>
        <tr>
          <th>{{$t('content.safety.accident.analysis.table.점유율(%)')}}</th>
          <td>17.65</td>
          <td>20.59</td>
          <td>11.76</td>
          <td>14.71</td>
          <td>0</td>
          <td>20.59</td>
          <td>0</td>
          <td>2.94</td>
          <td>2.94</td>
          <td>2.94</td>
          <td>0</td>
          <td>0</td>
          <td>5.08</td>
          <td>100</td>
        </tr>
        </tbody>
      </table>
      <table v-if="tab === 'harmful'" class="accidentTable">
        <thead>
        <tr>
          <th>{{$t('content.safety.accident.analysis.table.구분')}}</th>
          <th>{{$t('content.safety.accident.analysis.table.추락')}}</th>
          <th>{{$t('content.safety.accident.analysis.table.전도')}}</th>
          <th>{{$t('content.safety.accident.analysis.table.충돌')}}</th>
          <th>{{$t('content.safety.accident.analysis.table.낙하/비래')}}</th>
          <th>{{$t('content.safety.accident.analysis.table.붕괴/도괴')}}</th>
          <th>{{$t('content.safety.accident.analysis.table.협착')}}</th>
          <th>{{$t('content.safety.accident.analysis.table.감전')}}</th>
          <th>{{$t('content.safety.accident.analysis.table.무리한동작')}}</th>
          <th>{{$t('content.safety.accident.analysis.table.지병')}}</th>
          <th>{{$t('content.safety.accident.analysis.table.화상')}}</th>
          <th>{{$t('content.safety.accident.analysis.table.매몰/질식')}}</th>
          <th>{{$t('content.safety.accident.analysis.table.교통사고')}}</th>
          <th>{{$t('content.safety.accident.analysis.table.기타')}}</th>
          <th>{{$t('content.safety.accident.analysis.table.계')}}</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <th>{{$t('content.safety.accident.analysis.table.구분')}}</th>
          <td>6</td>
          <td>7</td>
          <td>4</td>
          <td>5</td>
          <td>0</td>
          <td>7</td>
          <td>0</td>
          <td>1</td>
          <td>1</td>
          <td>1</td>
          <td>0</td>
          <td>0</td>
          <td>2</td>
          <td>34</td>
        </tr>
        <tr>
          <th>{{$t('content.safety.accident.analysis.table.점유율(%)')}}</th>
          <td>17.65</td>
          <td>20.59</td>
          <td>11.76</td>
          <td>14.71</td>
          <td>0</td>
          <td>20.59</td>
          <td>0</td>
          <td>2.94</td>
          <td>2.94</td>
          <td>2.94</td>
          <td>0</td>
          <td>0</td>
          <td>5.08</td>
          <td>100</td>
        </tr>
        </tbody>
      </table>

    </div>
    <div>
      <vs-card class="mt-5">
        <e-charts autoresize :options="graph_disease_type" theme="ovilia-green"
                  auto-resize/>
      </vs-card>
    </div>

    <popup-excel-download
      v-model="showExcelDownload"
      :list="excelList"
      title="산업재해/무재해"/>

  </div>
</template>

<script>
import DateSelector from '@/components/selector/DateSelector'
import ECharts from 'vue-echarts/components/ECharts'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legend'
import 'echarts/lib/chart/bar'
import SearchNav from '@/components/nav/SearchNav'
import SearchNavItemDate from '@/components/nav/SearchNavItemDate'
import SearchNavItemSelect from '@/components/nav/SearchNavItemSelect'
import SearchNavItemKeyword from '@/components/nav/SearchNavItemKeyword'
import SearchNavItemProject from '@/components/nav/SearchNavItemProject'
import PopupExcelDownload from '@/popup/PopupExcelDownload'


export default {
  name: 'SafetyAccidentAnalysis',
  components: {
    PopupExcelDownload,
    SearchNavItemProject,
    SearchNavItemKeyword,
    SearchNavItemSelect,
    SearchNavItemDate,
    SearchNav,
    DateSelector,
    ECharts
  },


  computed: {
    excelList () {
      const list = []

      list.push({
        '종류': this.$t('content.safety.accident.analysis.tab.발생형태'),
        '구분': '구분',
        '추락': this.table.disease_type.human_downfall,
        '전도': this.table.disease_type.plane_fall,
        '충돌': this.table.disease_type.crash,
        '낙하/비래': this.table.disease_type.stuff_downfail,
        '붕괴/도괴': this.table.disease_type.collapse,
        '협착': this.table.disease_type.narrow,
        '감전': this.table.disease_type.electric_shock,
        '무리한동작': this.table.disease_type.overwork_motion,
        '지병': this.table.disease_type.chronic,
        '화상': this.table.disease_type.burns,
        '매몰/질식': this.table.disease_type.choke,
        '교통사고': this.table.disease_type.traffic,
        '기타': this.table.disease_type.etc,
        '계': this.table.disease_type.total
      })

      list.push({
        '종류': this.$t('content.safety.accident.analysis.tab.발생형태'),
        '구분': '점유율(%)',
        '추락': this.getRatio(this.table.disease_type.human_downfall, this.table.disease_type.total),
        '전도': this.getRatio(this.table.disease_type.plane_fall, this.table.disease_type.total),
        '충돌': this.getRatio(this.table.disease_type.crash, this.table.disease_type.total),
        '낙하/비래': this.getRatio(this.table.disease_type.stuff_downfail, this.table.disease_type.total),
        '붕괴/도괴': this.getRatio(this.table.disease_type.collapse, this.table.disease_type.total),
        '협착': this.getRatio(this.table.disease_type.narrow, this.table.disease_type.total),
        '감전': this.getRatio(this.table.disease_type.electric_shock, this.table.disease_type.total),
        '무리한동작': this.getRatio(this.table.disease_type.overwork_motion, this.table.disease_type.total),
        '지병': this.getRatio(this.table.disease_type.chronic, this.table.disease_type.total),
        '화상': this.getRatio(this.table.disease_type.burns, this.table.disease_type.total),
        '매몰/질식': this.getRatio(this.table.disease_type.choke, this.table.disease_type.total),
        '교통사고': this.getRatio(this.table.disease_type.traffic, this.table.disease_type.total),
        '기타': this.getRatio(this.table.disease_type.etc, this.table.disease_type.total),
        '계': '100'
      })
      list.push({
        '종류': '', '구분': '', '추락': '', '전도': '', '충돌': '', '낙하/비래': '', '붕괴/도괴': '', '협착': '',
        '감전': '', '무리한동작': '', '지병': '', '화상': '', '매몰/질식': '', '교통사고': '', '기타': '', '계': ''
      })


      list.push({
        '종류': '직종', '구분': '구분', '추락': '', '전도': '', '충돌': '', '낙하/비래': '', '붕괴/도괴': '', '협착': '',
        '감전': '', '무리한동작': '', '지병': '', '화상': '', '매몰/질식': '', '교통사고': '', '기타': '', '계': ''
      })
      list.push({
        '종류': '직종', '구분': '점유율(%)', '추락': '', '전도': '', '충돌': '', '낙하/비래': '', '붕괴/도괴': '', '협착': '',
        '감전': '', '무리한동작': '', '지병': '', '화상': '', '매몰/질식': '', '교통사고': '', '기타': '', '계': ''
      })
      list.push({
        '종류': '', '구분': '', '추락': '', '전도': '', '충돌': '', '낙하/비래': '', '붕괴/도괴': '', '협착': '',
        '감전': '', '무리한동작': '', '지병': '', '화상': '', '매몰/질식': '', '교통사고': '', '기타': '', '계': ''
      })
//------------------
      list.push({
        '종류': '월', '구분': '구분', '추락': '', '전도': '', '충돌': '', '낙하/비래': '', '붕괴/도괴': '', '협착': '',
        '감전': '', '무리한동작': '', '지병': '', '화상': '', '매몰/질식': '', '교통사고': '', '기타': '', '계': ''
      })
      list.push({
        '종류': '월', '구분': '점유율(%)', '추락': '', '전도': '', '충돌': '', '낙하/비래': '', '붕괴/도괴': '', '협착': '',
        '감전': '', '무리한동작': '', '지병': '', '화상': '', '매몰/질식': '', '교통사고': '', '기타': '', '계': ''
      })
      list.push({
        '종류': '', '구분': '', '추락': '', '전도': '', '충돌': '', '낙하/비래': '', '붕괴/도괴': '', '협착': '',
        '감전': '', '무리한동작': '', '지병': '', '화상': '', '매몰/질식': '', '교통사고': '', '기타': '', '계': ''
      })
//------------------
      list.push({
        '종류': '요일', '구분': '구분', '추락': '', '전도': '', '충돌': '', '낙하/비래': '', '붕괴/도괴': '', '협착': '',
        '감전': '', '무리한동작': '', '지병': '', '화상': '', '매몰/질식': '', '교통사고': '', '기타': '', '계': ''
      })
      list.push({
        '종류': '요일', '구분': '점유율(%)', '추락': '', '전도': '', '충돌': '', '낙하/비래': '', '붕괴/도괴': '', '협착': '',
        '감전': '', '무리한동작': '', '지병': '', '화상': '', '매몰/질식': '', '교통사고': '', '기타': '', '계': ''
      })
      list.push({
        '종류': '', '구분': '', '추락': '', '전도': '', '충돌': '', '낙하/비래': '', '붕괴/도괴': '', '협착': '',
        '감전': '', '무리한동작': '', '지병': '', '화상': '', '매몰/질식': '', '교통사고': '', '기타': '', '계': ''
      })
//------------------
      list.push({
        '종류': '시간', '구분': '구분', '추락': '', '전도': '', '충돌': '', '낙하/비래': '', '붕괴/도괴': '', '협착': '',
        '감전': '', '무리한동작': '', '지병': '', '화상': '', '매몰/질식': '', '교통사고': '', '기타': '', '계': ''
      })
      list.push({
        '종류': '시간', '구분': '점유율(%)', '추락': '', '전도': '', '충돌': '', '낙하/비래': '', '붕괴/도괴': '', '협착': '',
        '감전': '', '무리한동작': '', '지병': '', '화상': '', '매몰/질식': '', '교통사고': '', '기타': '', '계': ''
      })
      list.push({
        '종류': '', '구분': '', '추락': '', '전도': '', '충돌': '', '낙하/비래': '', '붕괴/도괴': '', '협착': '',
        '감전': '', '무리한동작': '', '지병': '', '화상': '', '매몰/질식': '', '교통사고': '', '기타': '', '계': ''
      })
//------------------
      list.push({
        '종류': '사업금액', '구분': '구분', '추락': '', '전도': '', '충돌': '', '낙하/비래': '', '붕괴/도괴': '', '협착': '',
        '감전': '', '무리한동작': '', '지병': '', '화상': '', '매몰/질식': '', '교통사고': '', '기타': '', '계': ''
      })
      list.push({
        '종류': '사업금액', '구분': '점유율(%)', '추락': '', '전도': '', '충돌': '', '낙하/비래': '', '붕괴/도괴': '', '협착': '',
        '감전': '', '무리한동작': '', '지병': '', '화상': '', '매몰/질식': '', '교통사고': '', '기타': '', '계': ''
      })
      list.push({
        '종류': '', '구분': '', '추락': '', '전도': '', '충돌': '', '낙하/비래': '', '붕괴/도괴': '', '협착': '',
        '감전': '', '무리한동작': '', '지병': '', '화상': '', '매몰/질식': '', '교통사고': '', '기타': '', '계': ''
      })
//------------------
      list.push({
        '종류': '상해부위', '구분': '구분', '추락': '', '전도': '', '충돌': '', '낙하/비래': '', '붕괴/도괴': '', '협착': '',
        '감전': '', '무리한동작': '', '지병': '', '화상': '', '매몰/질식': '', '교통사고': '', '기타': '', '계': ''
      })
      list.push({
        '종류': '상해부위', '구분': '점유율(%)', '추락': '', '전도': '', '충돌': '', '낙하/비래': '', '붕괴/도괴': '', '협착': '',
        '감전': '', '무리한동작': '', '지병': '', '화상': '', '매몰/질식': '', '교통사고': '', '기타': '', '계': ''
      })
      list.push({
        '종류': '', '구분': '', '추락': '', '전도': '', '충돌': '', '낙하/비래': '', '붕괴/도괴': '', '협착': '',
        '감전': '', '무리한동작': '', '지병': '', '화상': '', '매몰/질식': '', '교통사고': '', '기타': '', '계': ''
      })
//------------------
      list.push({
        '종류': '기인물', '구분': '구분', '추락': '', '전도': '', '충돌': '', '낙하/비래': '', '붕괴/도괴': '', '협착': '',
        '감전': '', '무리한동작': '', '지병': '', '화상': '', '매몰/질식': '', '교통사고': '', '기타': '', '계': ''
      })
      list.push({
        '종류': '기인물', '구분': '점유율(%)', '추락': '', '전도': '', '충돌': '', '낙하/비래': '', '붕괴/도괴': '', '협착': '',
        '감전': '', '무리한동작': '', '지병': '', '화상': '', '매몰/질식': '', '교통사고': '', '기타': '', '계': ''
      })

      return list
    }
  },
  data () {
    return {
      // 검색 네비게이션
      nav: {
        projectId:'',
        keyword: '',
        year: '',
        yearList:[],
        month: '',
        monthList:[
          {text:'전체', value:''},
          {text:'1', value:'1'},
          {text:'2', value:'2'},
          {text:'3', value:'3'},
          {text:'4', value:'4'},
          {text:'5', value:'5'},
          {text:'6', value:'6'},
          {text:'7', value:'7'},
          {text:'8', value:'8'},
          {text:'9', value:'9'},
          {text:'10', value:'10'},
          {text:'11', value:'11'},
          {text:'12', value:'12'}
        ],
        dateTarget: 'content$preview.disaster_date'
      },

      tab:'disease_type',
      table:{
        disease_type:{
          human_downfall: 0,
          plane_fall: 0,
          crash: 0,
          stuff_downfail: 0,
          collapse: 0,
          narrow: 0,
          electric_shock: 0,
          overwork_motion: 0,
          chronic: 0,
          burns: 0,
          choke: 0,
          traffic: 0,
          etc: 0,
          total: 0
        }
      },

      graph_disease_type: {
        legend: {
          left: 'center',
          bottom: 'bottom'
        },
        tooltip: {},
        dataset: {
          // Provide data.
          source: [
            ['구분', '건수'],
            ['human_downfall', 0],
            ['plane_fall', 0],
            ['crash', 0],
            ['stuff_downfail', 0],
            ['collapse', 0],
            ['narrow', 0],
            ['electric_shock', 0],
            ['overwork_motion', 0],
            ['chronic', 0],
            ['burns', 0],
            ['choke', 0],
            ['traffic', 0],
            ['etc', 0]
          ]
        },
        grid: {
          top: '15%',
          left: '5%',
          right: '3%'
        },
        xAxis: {
          type: 'category',
          axisLabel: {
            formatter (value) {
              return value
            }
          }
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            color: '#BFC9D1',
            formatter (value) {
              return `${value}건`
            }
          },
          axisLine: {
            show: true
          }
        },
        series: [
          {
            type: 'bar',
            color: '#7367F0'
          }
        ]
      },

      showExcelDownload: false,
    }
  },
  created () {
    let nowYear = new Date().getFullYear()
    this.nav.yearList.push({text:'전체',  value:''})
    for (let i = 0; i < 50; i++) {
      this.nav.yearList.push({text:`${nowYear}`,  value:nowYear})
      nowYear--
    }

    this.loadPostList()
  },
  methods: {
    // 현장 개요 불러오기
    async loadPostList () {
      const projectId = this.nav.projectId
      const boardId = 22
      const boardSlug = 'industrial_accident'
      const page = 1
      const perPage = 10000

      const year = this.nav.year
      const month = this.nav.month
      const dateTarget = this.nav.dateTarget
      let dateBegin = ''
      let dateEnd = ''

      if (year) dateBegin = this.getFirstDateWithSearchDate(year, month)
      if (year) dateEnd = this.getLastDateWithSearchDate(year, month)


      await this.$store.dispatch('board/LOAD_POST_LIST', {
        projectId,
        boardId,
        page,
        perPage,
        dateTarget, dateBegin, dateEnd
      })

      this.table.disease_type = {
        human_downfall: 0,
        plane_fall: 0,
        crash: 0,
        stuff_downfail: 0,
        collapse: 0,
        narrow: 0,
        electric_shock: 0,
        overwork_motion: 0,
        chronic: 0,
        burns: 0,
        choke: 0,
        traffic: 0,
        etc: 0,
        total: 0
      }

      const list = this.$store.state.board.postListInfo.data
      for (const data of list) {
        const preview = this.getPreview(data)
        const num = Number(this.table.disease_type[preview.disease_type])
        this.table.disease_type[preview.disease_type] = num + 1
        this.table.disease_type.total = Number(this.table.disease_type.total) + 1
      }

      for (let i = 1; i < this.graph_disease_type.dataset.source.length; i++) {
        const key = this.graph_disease_type.dataset.source[i][0]
        this.graph_disease_type.dataset.source[i][1] = this.table.disease_type[key]
      }

      this.graph_disease_type.xAxis.axisLabel.formatter = (value) => {
        return this.getDiseaseType(value)
      }
    },

    getFirstDateWithSearchDate (year, month) {
      if (year > 0 && month > 0) {
        return new Date(`${year}-${month}-01`).format('yyyy-MM-dd')
      } else if (year > 0 && month === '') {
        return new Date(`${year}-01-01`).format('yyyy-MM-dd')
      }

      return ''
    },

    getLastDateWithSearchDate (year, month) {
      if (year > 0 && month > 0) {
        let last = new Date(year, month)
        last = new Date(last - 1)
        return new Date(`${year}-${month}-${last.getDate()}`).format('yyyy-MM-dd')
      } else if (year > 0 && month === '') {
        return new Date(`${year}-12-31`).format('yyyy-MM-dd')
      }

      return ''
    },

    getPreview (data) {
      if (data.preview) {
        const preview = JSON.parse(data.preview)
        return preview
      }
    },

    getRatio (value, all) {
      if (all > 0) {
        const dig = 100 // 소수점 두자리까지
        return Math.floor(value * 100 * dig / all) / dig
      } else {
        return 0.00
      }
    },

    getDiseaseType (type_key) {
      const type = []
      type['human_downfall'] = this.$t('content.safety.accident.analysis.table.추락')
      type['plane_fall'] = this.$t('content.safety.accident.analysis.table.전도')
      type['crash'] = this.$t('content.safety.accident.analysis.table.충돌')
      type['stuff_downfail'] = this.$t('content.safety.accident.analysis.table.낙하/비래')
      type['collapse'] = this.$t('content.safety.accident.analysis.table.붕괴/도괴')
      type['narrow'] = this.$t('content.safety.accident.analysis.table.협착')
      type['electric_shock'] = this.$t('content.safety.accident.analysis.table.감전')
      type['overwork_motion'] = this.$t('content.safety.accident.analysis.table.무리한동작')
      type['chronic'] = this.$t('content.safety.accident.analysis.table.지병')
      type['burns'] = this.$t('content.safety.accident.analysis.table.화상')
      type['choke'] = this.$t('content.safety.accident.analysis.table.매몰/질식')
      type['traffic'] = this.$t('content.safety.accident.analysis.table.교통사고')
      type['etc'] = this.$t('content.safety.accident.analysis.table.기타')

      return type[type_key]
    },
    selectTab (tab) {
      this.tab = tab
    },

    handleSearch () {
      this.loadPostList()
    },

    async excelDownFunc () {
      this.showExcelDownload = true
    },
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

  cursor: pointer;
}
.tabList li a {
  color: #757575;
}

.tabList li.active {
  border: 1px solid #1E0D61;
  border-bottom: none;
  color: #1E0D61;
}
.tabList li.active a{
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
