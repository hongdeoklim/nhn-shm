<template>
<div>
  <vs-tabs>
    <vs-tab :label="$t('content.risk.assessment.stddoc.tab.MAOT 건설 D/B')">
      <vx-card class="mb-4 ">
        <vs-row class="mr-auto " style="align-items:flex-end">
          <vs-col>
            <vs-col class="flex" vs-align="center">
              <span class="mr-4" style="font-weight: 500;">{{$t('search.현장명')}}</span>
              <vs-select autocomplete class="mr-4" v-model="selectTypeA" @change="handleChangeTypeA">
                <vs-select-item :key="index" :value="item.id" :text="item.name" v-for=" (item, index) in typeAoption" />
              </vs-select>
              <span class="mr-4" style="font-weight: 500;">{{$t('search.대상공종')}}</span>
              <vs-select autocomplete class="mr-4" v-model="selectTypeB" @change="handleChangeTypeB">
                <vs-select-item :key="index" :value="item.id" :text="item.name" v-for=" (item, index) in typeBoption" />
              </vs-select>
              <span class="mr-4" style="font-weight: 500;">{{$t('search.세부공종')}}</span>
              <vs-select autocomplete class="mr-4" v-model="selectTypeC" @change="handleChangeTypeC">
                <vs-select-item :key="index" :value="item.id" :text="item.name" v-for=" (item, index) in typeCoption" />
              </vs-select>
              <span class="mr-4" style="font-weight: 500;">{{$t('search.키워드')}}</span>
              <ml-input class="shadow mr-2" icon-pack="feather" icon="icon-search" icon-after="true"  placeholder="Search" v-model="keyword"/>
              <vs-button class="ml-auto" color="secondary" @click="handleSearch">{{$t('search.검색')}}</vs-button>
            </vs-col>
          </vs-col>
        </vs-row>
      </vx-card>


      <vs-table stripe
                ref="table"
                :sst="true"
                :data="list"
                v-model="selected"
                noDataText="'현장명' 을 선택하거나, 키워드 검색을 진행하여 주세요.">
        <template slot="thead">
          <vs-th class="w-1/12" sort-key="title">{{$t('content.risk.assessment.stddoc.column.No')}}</vs-th>
          <vs-th class="w-1/12" sort-key="no">{{$t('content.risk.assessment.stddoc.column.단위공정')}}</vs-th>
          <vs-th class="w-1/12" sort-key="author">{{$t('content.risk.assessment.stddoc.column.위험요인')}}</vs-th>
          <vs-th class="w-1/12" sort-key="author">{{$t('content.risk.assessment.stddoc.column.재해형태')}}</vs-th>
          <vs-th class="w-1/12" sort-key="author">{{$t('content.risk.assessment.stddoc.column.안전보건대책')}}</vs-th>
          <vs-th class="w-1/12" sort-key="author">{{$t('content.risk.assessment.stddoc.column.이미지')}}</vs-th>
        </template>

        <template slot-scope="{data}">
          <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">

            <vs-td>{{tr.id}}</vs-td>
            <vs-td>{{tr.unit_task.name}}</vs-td>
            <vs-td style="white-space: pre-wrap;">{{tr.work_risk}}</vs-td>
            <vs-td style="white-space: pre-wrap;"></vs-td>
            <vs-td style="white-space: pre-wrap;">{{`${tr.work_flow}\n`}} {{tr.work_safety_measure}}</vs-td>
            <vs-td>
              <vs-image class="w-full h-full" :src="(tr.photos && tr.photos.length > 0) ? tr.photos[0].path : ''"/>
            </vs-td>

          </vs-tr>
        </template>

      </vs-table>

      <div class="vs-con-table">
        <div class="con-pagination-table vs-table--pagination">
          <k-pagination :total="(lastPage) ? lastPage : 1" v-model="page" @change="handleChangePage"></k-pagination>
        </div>
      </div>

    </vs-tab>
    <vs-tab :label="$t('content.risk.assessment.stddoc.tab.사고사례')">
      <vx-card class="mb-4 ">
        <vs-row class="mr-auto " style="align-items:flex-end">
          <vs-col>
            <vs-col class="flex" vs-align="center">
              <span class="mr-4" style="font-weight: 500;">{{$t('search.현장명')}}</span>
              <vs-select autocomplete class="mr-4" v-model="selectTypeA" @change="handleChangeTypeA">
                <vs-select-item :key="index" :value="item.id" :text="item.name" v-for=" (item, index) in typeAoption" />
              </vs-select>
              <span class="mr-4" style="font-weight: 500;">{{$t('search.대상공종')}}</span>
              <vs-select autocomplete class="mr-4" v-model="selectTypeB" @change="handleChangeTypeB">
                <vs-select-item :key="index" :value="item.id" :text="item.name" v-for=" (item, index) in typeBoption" />
              </vs-select>
              <span class="mr-4" style="font-weight: 500;">{{$t('search.세부공종')}}</span>
              <vs-select autocomplete class="mr-4" v-model="selectTypeC" @change="handleChangeTypeC">
                <vs-select-item :key="index" :value="item.id" :text="item.name" v-for=" (item, index) in typeCoption" />
              </vs-select>
              <span class="mr-4" style="font-weight: 500;">{{$t('search.키워드')}}</span>
              <ml-input class="shadow mr-2" icon-pack="feather" icon="icon-search" icon-after="true"  placeholder="Search" v-model="keyword"/>
              <vs-button class="ml-auto" color="secondary" @click="handleSearch">{{$t('search.검색')}}</vs-button>
            </vs-col>
          </vs-col>
        </vs-row>
      </vx-card>


      <vs-table stripe ref="table" :sst="true" :data="list" v-model="selected"
                noDataText="'현장명' 을 선택하거나, 키워드 검색을 진행하여 주세요.">
        <template slot="thead">
          <vs-th class="w-1/12" sort-key="title">{{$t('content.risk.assessment.stddoc.column.No')}}</vs-th>
          <vs-th class="w-1/12" sort-key="no">{{$t('content.risk.assessment.stddoc.column.단위공정')}}</vs-th>
          <vs-th class="w-1/12" sort-key="author">{{$t('content.risk.assessment.stddoc.column.위험요인')}}</vs-th>
          <vs-th class="w-1/12" sort-key="author">{{$t('content.risk.assessment.stddoc.column.재해형태')}}</vs-th>
          <vs-th class="w-1/12" sort-key="author">{{$t('content.risk.assessment.stddoc.column.안전보건대책')}}</vs-th>
          <vs-th class="w-1/12" sort-key="author">{{$t('content.risk.assessment.stddoc.column.이미지')}}</vs-th>
        </template>

        <template slot-scope="{data}">
          <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">

            <vs-td>{{tr.id}}</vs-td>
            <vs-td>{{tr.unit_task.name}}</vs-td>
            <vs-td style="white-space: pre-wrap;">{{tr.work_risk}}</vs-td>
            <vs-td style="white-space: pre-wrap;"></vs-td>
            <vs-td style="white-space: pre-wrap;">{{tr.work_safety_measure}}</vs-td>
            <vs-td>
              <vs-image class="w-full h-full" :src="(tr.photos && tr.photos.length > 0) ? tr.photos[0].path : ''"/>
            </vs-td>

          </vs-tr>
        </template>

      </vs-table>

      <div class="vs-con-table">
        <div class="con-pagination-table vs-table--pagination">
          <k-pagination :total="(lastPage) ? lastPage : 1" v-model="page" @change="handleChangePage"></k-pagination>
        </div>
      </div>

    </vs-tab>
    <vs-tab :label="$t('content.risk.assessment.stddoc.tab.Near Miss')">
      <vx-card class="mb-4 ">
        <vs-row class="mr-auto " style="align-items:flex-end">
          <vs-col>
            <vs-col class="flex" vs-align="center">
              <span class="mr-4" style="font-weight: 500;">{{$t('search.현장명')}}</span>
              <vs-select autocomplete class="mr-4" v-model="selectTypeA" @change="handleChangeTypeA">
                <vs-select-item :key="index" :value="item.id" :text="item.name" v-for=" (item, index) in typeAoption" />
              </vs-select>
              <span class="mr-4" style="font-weight: 500;">{{$t('search.대상공종')}}</span>
              <vs-select autocomplete class="mr-4" v-model="selectTypeB" @change="handleChangeTypeB">
                <vs-select-item :key="index" :value="item.id" :text="item.name" v-for=" (item, index) in typeBoption" />
              </vs-select>
              <span class="mr-4" style="font-weight: 500;">{{$t('search.세부공종')}}</span>
              <vs-select autocomplete class="mr-4" v-model="selectTypeC" @change="handleChangeTypeC">
                <vs-select-item :key="index" :value="item.id" :text="item.name" v-for=" (item, index) in typeCoption" />
              </vs-select>
              <span class="mr-4" style="font-weight: 500;">{{$t('search.키워드')}}</span>
              <ml-input class="shadow mr-2" icon-pack="feather" icon="icon-search" icon-after="true"  placeholder="Search" v-model="keyword"/>
              <vs-button class="ml-auto" color="secondary" @click="handleSearch">{{$t('search.검색')}}</vs-button>
            </vs-col>
          </vs-col>
        </vs-row>
      </vx-card>


      <vs-table stripe ref="table" :sst="true" :data="list" v-model="selected"
                noDataText="'현장명' 을 선택하거나, 키워드 검색을 진행하여 주세요.">
        <template slot="thead">
          <vs-th class="w-1/12" sort-key="title">{{$t('content.risk.assessment.stddoc.column.No')}}</vs-th>
          <vs-th class="w-1/12" sort-key="no">{{$t('content.risk.assessment.stddoc.column.단위공정')}}</vs-th>
          <vs-th class="w-1/12" sort-key="author">{{$t('content.risk.assessment.stddoc.column.위험요인')}}</vs-th>
          <vs-th class="w-1/12" sort-key="author">{{$t('content.risk.assessment.stddoc.column.재해형태')}}</vs-th>
          <vs-th class="w-1/12" sort-key="author">{{$t('content.risk.assessment.stddoc.column.안전보건대책')}}</vs-th>
          <vs-th class="w-1/12" sort-key="author">{{$t('content.risk.assessment.stddoc.column.이미지')}}</vs-th>
        </template>

        <template slot-scope="{data}">
          <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">

            <vs-td>{{tr.id}}</vs-td>
            <vs-td>{{tr.unit_task.name}}</vs-td>
            <vs-td style="white-space: pre-wrap;">{{tr.work_risk}}</vs-td>
            <vs-td style="white-space: pre-wrap;"></vs-td>
            <vs-td style="white-space: pre-wrap;">{{tr.work_safety_measure}}</vs-td>
            <vs-td>
              <vs-image class="w-full h-full" :src="(tr.photos && tr.photos.length > 0) ? tr.photos[0].path : ''"/>
            </vs-td>

          </vs-tr>
        </template>

      </vs-table>

      <div class="vs-con-table">
        <div class="con-pagination-table vs-table--pagination">
          <k-pagination :total="(lastPage) ? lastPage : 1" v-model="page" @change="handleChangePage"></k-pagination>
        </div>
      </div>

    </vs-tab>
    <vs-tab :label="$t('content.risk.assessment.stddoc.tab.교육자료')">
      <vx-card class="mb-4 ">
        <vs-row class="mr-auto " style="align-items:flex-end">
          <vs-col>
            <vs-col class="flex" vs-align="center">
              <span class="mr-4" style="font-weight: 500;">{{$t('search.현장명')}}</span>
              <vs-select autocomplete class="mr-4"  v-model="selectTypeA" @change="handleChangeTypeA">
                <vs-select-item :key="index" :value="item.id" :text="item.name" v-for=" (item, index) in typeAoption" />
              </vs-select>
              <span class="mr-4" style="font-weight: 500;">{{$t('search.대상공종')}}</span>
              <vs-select autocomplete class="mr-4" v-model="selectTypeB" @change="handleChangeTypeB">
                <vs-select-item :key="index" :value="item.id" :text="item.name" v-for=" (item, index) in typeBoption" />
              </vs-select>
              <span class="mr-4" style="font-weight: 500;">{{$t('search.세부공종')}}</span>
              <vs-select autocompleteclass="mr-4" v-model="selectTypeC" @change="handleChangeTypeC">
                <vs-select-item :key="index" :value="item.id" :text="item.name" v-for=" (item, index) in typeCoption" />
              </vs-select>
              <span class="mr-4" style="font-weight: 500;">{{$t('search.키워드')}}</span>
              <ml-input class="shadow mr-2" icon-pack="feather" icon="icon-search" icon-after="true"  placeholder="Search" v-model="keyword"/>
              <vs-button class="ml-auto" color="secondary" @click="handleSearch">{{$t('search.검색')}}</vs-button>
            </vs-col>
          </vs-col>
        </vs-row>
      </vx-card>


      <vs-table stripe ref="table" :sst="true" :data="list" v-model="selected"
                noDataText="'현장명' 을 선택하거나, 키워드 검색을 진행하여 주세요.">
        <template slot="thead">
          <vs-th class="w-1/12" sort-key="title">{{$t('content.risk.assessment.stddoc.column.No')}}</vs-th>
          <vs-th class="w-1/12" sort-key="no">{{$t('content.risk.assessment.stddoc.column.단위공정')}}</vs-th>
          <vs-th class="w-1/12" sort-key="author">{{$t('content.risk.assessment.stddoc.column.위험요인')}}</vs-th>
          <vs-th class="w-1/12" sort-key="author">{{$t('content.risk.assessment.stddoc.column.재해형태')}}</vs-th>
          <vs-th class="w-1/12" sort-key="author">{{$t('content.risk.assessment.stddoc.column.안전보건대책')}}</vs-th>
          <vs-th class="w-1/12" sort-key="author">{{$t('content.risk.assessment.stddoc.column.이미지')}}</vs-th>
        </template>

        <template slot-scope="{data}">
          <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">

            <vs-td>{{tr.id}}</vs-td>
            <vs-td>{{tr.unit_task.name}}</vs-td>
            <vs-td style="white-space: pre-wrap;">{{tr.work_risk}}</vs-td>
            <vs-td style="white-space: pre-wrap;"></vs-td>
            <vs-td style="white-space: pre-wrap;">{{tr.work_safety_measure}}</vs-td>
            <vs-td>
              <vs-image class="w-full h-full" :src="(tr.photos && tr.photos.length > 0) ? tr.photos[0].path : ''"/>
            </vs-td>


          </vs-tr>
        </template>

      </vs-table>

      <div class="vs-con-table">
        <div class="con-pagination-table vs-table--pagination">
          <k-pagination :total="(lastPage) ? lastPage : 1" v-model="page" @change="handleChangePage"></k-pagination>
        </div>
      </div>

    </vs-tab>
  </vs-tabs>
</div>
</template>

<script>
import KPagination from '@/components/kPagination/kPagination'
export default {
  name: 'RiskAssessmentStdDoc',
  components: {KPagination},
  data () {
    return {
      selectTypeA:0,
      selectTypeB:0,
      selectTypeC:0,
      keyword:'',
      typeAoption: [],
      typeBoption: [],
      typeCoption: [],
      selected:{},
      list:[],
      page:1,
      lastPage:1
    }
  },

  async created () {
    await this.loadType1()
    await this.loadDocument()
  },
  methods: {
    handleSearch () {
      this.page = 1
      this.loadDocument()
    },
    async loadType1 () {
      await this.$store.dispatch('project/HSE_LOAD_STDW_SECTOR')
      this.typeAoption = this.$store.state.project.hseStdwSectorList
    },

    async loadType2 () {
      const sector_id = this.selectTypeA
      await this.$store.dispatch('project/HSE_LOAD_STDW_MIDCLASS', {sector_id})
      this.typeBoption = this.$store.state.project.hseStdwMidClassList
    },

    async loadType3 () {
      const sector_id = this.selectTypeA
      const mid_class_id = this.selectTypeB
      await this.$store.dispatch('project/HSE_LOAD_STDW_UNITCLASS', {sector_id, mid_class_id})
      this.typeCoption = this.$store.state.project.hseStdwUnitClassList
    },

    async loadDocument () {
      const sector_id = this.selectTypeA // 표준작업절차 부문ID
      const mid_class_id = this.selectTypeB // 대공종 옵션의 ID 값을 전달한다.
      const unit_class_id = this.selectTypeC // 단위공정 옵션 ID
      const keyword = this.keyword // 키워드
      const page = this.page // 페이지번호
      const perPage = 20 // 페이지 리스트

      if (sector_id || mid_class_id || unit_class_id || keyword) {
        await this.$store.dispatch('project/HSE_LOAD_STD_WORK', {sector_id, mid_class_id, unit_class_id, keyword, page, perPage})
        const info = this.$store.state.project.hseStdWorkList
        this.list = this.$store.state.project.hseStdWorkList.data
        this.page = info.current_page
        this.lastPage = info.last_page
      }

    },

    async handleChangeTypeA (id) {
      this.page = 1
      await this.loadType2(id)
      await this.loadDocument()
    },

    async handleChangeTypeB (id) {
      this.page = 1
      await this.loadType3(id)
      await this.loadDocument()
    },

    async handleChangeTypeC (id) {
      this.page = 1
      await this.loadDocument()
    },

    handleChangePage (page) {
      this.page = page
      this.loadDocument()
    }
  }
}
</script>

<style scoped>

</style>
