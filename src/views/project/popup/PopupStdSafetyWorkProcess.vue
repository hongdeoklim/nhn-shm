<template>
  <vs-popup id="popupStdSafetyWorkProcess" title="MAOT 건설 D/B" :active.sync="popupActiveSync" >
    <vs-row class="mr-auto pb-0" style="align-items:flex-end">
      <vs-col v-if="size === 'mobile'" >
        <vs-col class="w-full flex flex-wrap mb-4" vs-align="center">
          <span class="w-3/12 " style="font-weight: 500;">현장명</span>
          <vs-select class="w-9/12 selectExample" autocomplete v-model="selectTypeA" @change="handleChangeTypeA">
            <vs-select-item :key="index" :value="item.id" :text="item.name" v-for=" (item, index) in typeAoption" />
          </vs-select>
        </vs-col>
        <vs-col class="w-full flex flex-wrap mb-4" vs-align="center">
          <span class="w-3/12 " style="font-weight: 500;">대상공종</span>
          <vs-select class="w-9/12 selectExample" autocomplete v-model="selectTypeB" @change="handleChangeTypeB">
            <vs-select-item :key="index" :value="item.id" :text="item.name" v-for=" (item, index) in typeBoption" />
          </vs-select>
        </vs-col>
        <vs-col class="w-full flex flex-wrap mb-4" vs-align="center">
          <span class="w-3/12 " style="font-weight: 500;">세부공종</span>
          <vs-select class="w-9/12 selectExample " autocomplete v-model="selectTypeC" @change="handleChangeTypeC">
            <vs-select-item :key="index" :value="item.id" :text="item.name" v-for=" (item, index) in typeCoption" />
          </vs-select>
        </vs-col>
        <vs-col class="w-full flex flex-wrap mb-4" vs-align="center">
          <span class="w-3/12 " style="font-weight: 500;">키워드</span>
          <ml-input class="w-9/12 " v-model="popupKeyword" @change="searchChangeKeyword"/>
        </vs-col>
        <vs-col class="flex flex-wrap mb-4" vs-align="center">
          <vs-button class="ml-auto" color="secondary" @click="handleSearch">검색</vs-button>
        </vs-col>
      </vs-col>

      <vs-col v-else>
        <vs-col class="flex flex-wrap" vs-align="center">
          <span class="mr-4" style="font-weight: 500;">현장명</span>
          <vs-select class="selectExample w-2/12" autocomplete v-model="selectTypeA" @change="handleChangeTypeA">
            <vs-select-item :key="index" :value="item.id" :text="item.name" v-for=" (item, index) in typeAoption" />
          </vs-select>
          <span class="mx-4" style="font-weight: 500;">대상공종</span>
          <vs-select class="selectExample w-2/12" autocomplete v-model="selectTypeB" @change="handleChangeTypeB">
            <vs-select-item :key="index" :value="item.id" :text="item.name" v-for=" (item, index) in typeBoption" />
          </vs-select>
          <span class="mx-4" style="font-weight: 500;">세부공종</span>
          <vs-select class="selectExample w-2/12" autocomplete v-model="selectTypeC" @change="handleChangeTypeC">
            <vs-select-item :key="index" :value="item.id" :text="item.name" v-for=" (item, index) in typeCoption" />
          </vs-select>
          <span class="mx-4" style="font-weight: 500;">키워드</span>
          <ml-input class="w-2/12" v-model="popupKeyword" @change="searchChangeKeyword"/>
          <vs-button class="ml-auto" color="secondary" @click="handleSearch">검색</vs-button>
        </vs-col>
      </vs-col>

    </vs-row>
    <vs-row class="p-0">
      <vs-col >

        <vs-table stripe
                  style="overflow-y: auto;"
                  ref="table"
                  :sst="true"
                  :max-items="table.perPage"
                  :data="table.list"
                  noDataText="'현장명' 을 선택하거나, 키워드 검색을 진행하여 주세요."
                  @selected="handleItemClickDetail">

          <template slot="thead">
            <vs-th class="w-1/12" style="min-width:100px" sort-key="title">{{$t('content.risk.assessment.stddoc.column.No')}}</vs-th>
            <vs-th class="w-1/12" style="min-width:100px" sort-key="no">{{$t('content.risk.assessment.stddoc.column.단위공정')}}</vs-th>
            <vs-th class="w-1/12" style="min-width:150px" sort-key="author">{{$t('content.risk.assessment.stddoc.column.위험요인')}}</vs-th>
            <vs-th class="w-1/12" style="min-width:100px" sort-key="author">{{$t('content.risk.assessment.stddoc.column.재해형태')}}</vs-th>
            <vs-th class="w-1/12" style="min-width:200px" sort-key="author">{{$t('content.risk.assessment.stddoc.column.안전보건대책')}}</vs-th>
            <vs-th class="w-1/12" style="min-width:100px" sort-key="author">{{$t('content.risk.assessment.stddoc.column.이미지')}}</vs-th>
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
            <k-pagination
              :total="(table.lastPage) ? table.lastPage : 1"
              :max-items="3"
              v-model="table.currentPage" @change="handleChangePage"></k-pagination>
          </div>
        </div>

      </vs-col>
    </vs-row>
  </vs-popup>
</template>


<script>

import KPagination from '@/components/kPagination/kPagination'
export default {
  name: 'PopupStdSafetyWorkProcess',
  props: {
    popupActive: Boolean,
    size: String
  },
  components: {
    KPagination
  },
  data () {
    return {
      table:{
        list:[],
        currentPage: 1,
        perPage: 5,
        lastPage: 1,
        keyword: ''
      },
      selectTypeA:0,
      selectTypeB:0,
      selectTypeC:0,
      popupKeyword:'',
      typeAoption: [],
      typeBoption: [],
      typeCoption: []
    }
  },
  watch: {
    popupActiveSync(value) {
      const body = document.querySelector('body');
      if (value) {
        body.style.overflow = 'hidden'
      } else {
        body.style.overflow = 'auto'
      }
    },
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
  mounted () {
    const backButtonRouteGuard = this.$router.beforeEach((to, from, next) => {
      if (this.popupActive) {
        this.handleCloseSelf()
        next(false); return
      }
      next(true)
    })
    this.$once('hook:destroyed', () => {
      backButtonRouteGuard()
    })
  },

  async created () {
    await this.loadType1()
    await this.loadDocument()
  },
  methods:{

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
      if (sector_id && mid_class_id) {
        await this.$store.dispatch('project/HSE_LOAD_STDW_UNITCLASS', {sector_id, mid_class_id})
        this.typeCoption = this.$store.state.project.hseStdwUnitClassList
      }

    },

    async loadDocument () {
      const sector_id = this.selectTypeA // 표준작업절차 부문ID
      const mid_class_id = this.selectTypeB // 대공종 옵션의 ID 값을 전달한다.
      const unit_class_id = this.selectTypeC // 단위공정 옵션 ID
      const keyword = this.popupKeyword // 키워드
      const page = this.table.currentPage // 페이지번호
      const perPage = this.table.perPage // 페이지 리스트

      if (sector_id || mid_class_id || unit_class_id || keyword) {
        await this.$store.dispatch('project/HSE_LOAD_STD_WORK', {sector_id, mid_class_id, unit_class_id, keyword, page, perPage})
        this.table.list = this.$store.state.project.hseStdWorkList.data
        this.table.lastPage = this.$store.state.project.hseStdWorkList.last_page
      }

    },

    getContent (data) {
      if (data.post) {
        const content = data.post
        return content
      }
    },

    handleCloseSelf () {
      this.$emit('popupActiveSync', false)
    },

    handleSearch () {
      this.table.currentPage = 1
      this.loadDocument()
    },

    searchChangeKeyword () {
      this.loadDocument()
    },

    async handleChangeTypeA (id) {
      this.typeBoption = []
      this.typeCoption = []

      this.selectTypeB = ''
      this.selectTypeC = ''
      this.table.currentPage = 1
      await this.loadType2(id)
      await this.loadDocument()
    },

    async handleChangeTypeB (id) {
      this.typeCoption = []
      this.selectTypeC = ''
      this.table.currentPage = 1
      await this.loadType3(id)
      await this.loadDocument()
    },

    async handleChangeTypeC (id) {
      this.table.currentPage = 1
      await this.loadDocument()
    },

    handleItemClickDetail (data) {
      this.$emit('handleItemClickDetail', data)
    },

    handleChangePage (page) {
      this.loadDocument()
    }
  }
}

</script>


<style>

#popupStdSafetyWorkProcess > .vs-popup {
  width:1600px !important;
  max-width:100% !important;
}
#popupStdSafetyWorkProcess > .vs-popup > .vs-popup--content {
  width:100%;
  padding:0;
  margin:0;
}
#popupStdSafetyWorkProcess > .vs-popup > .vs-popup--content > .vs-row{
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
