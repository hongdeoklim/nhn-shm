<template>
  <vs-popup class="popupSearchJobClassification" :title="title" :active.sync="showPopup">
    <div>
      <div class="flex flex-row w-full gap-5 p-5 items-end" style="border-bottom:1px solid #e0e0e0">
        <div class="grid grid-cols-12 w-full gap-x-5 gap-y-3">
          <div class="col-span-3 flex items-center">
            <div class="label-text mr-4">대분류</div>
            <vs-select v-model="selectedNo1" autocomplete class="w-full flex-1">
              <vs-select-item text="전체" value="" />
              <vs-select-item v-for="item in getClass1Options" :key="item.no_1" :text="item.name_1" :value="item.no_1" />
            </vs-select>
          </div>

          <div class="col-span-3 flex items-center">
            <div class="label-text mr-4">중분류</div>
            <vs-select v-model="selectedNo2" autocomplete class="w-full flex-1">
              <vs-select-item text="전체" value="" />
              <vs-select-item v-for="item in getClass2Options" :key="item.no_2" :text="item.name_2" :value="item.no_2" />
            </vs-select>
          </div>

          <div class="col-span-3 flex items-center">
            <div class="label-text mr-4">소분류</div>
            <vs-select v-model="selectedNo3" autocomplete class="w-full flex-1">
              <vs-select-item text="전체" value="" />
              <vs-select-item v-for="item in getClass3Options" :key="item.no_3" :text="item.name_3" :value="item.no_3" />
            </vs-select>
          </div>

          <div class="col-span-3 flex items-center">
            <div class="label-text mr-4">세분류</div>
            <vs-select v-model="selectedNo4" autocomplete class="w-full flex-1">
              <vs-select-item text="전체" value="" />
              <vs-select-item v-for="item in getClass4Options" :key="item.no_4" :text="item.name_4" :value="item.no_4" />
            </vs-select>
          </div>
          <div class="col-span-12 flex items-center">
            <div class="label-text mr-4">키워드</div>
            <ml-input ref="inputKeyword" class="w-full flex-1" v-model="search.keyword" @keyup.enter="handleClickSearch"/>
          </div>
        </div>
        <div class="text-right flex-none">
          <vs-button color="secondary" @click="handleClickSearch">검색</vs-button>
        </div>
      </div>

<!--      테이블 시작-->
      <vs-row>
        <vs-col style="max-height:500px; overflow-y:auto;">

          <vs-table stripe
                    ref="table"
                    :sst="true"
                    :max-items="page.perPage"
                    :data="classificationList"
                    noDataText="데이터가 없습니다"
                    @selected="handleItemClickDetail"
          >

            <template slot="thead">
              <vs-th class="" style="width: 50%"><span class="w-full h-full">분류번호</span></vs-th>
              <vs-th class=""><span class="w-full h-full">세세분류</span></vs-th>
            </template>

            <template slot-scope="{data}">
              <vs-tr v-for="(classification, index) in data" :key="index"
                     :class="(selectedTableItem && selectedTableItem.id === classification.id) ? 'active' : '' "
                     :data="classification">

                <vs-td>{{ classification.no_5 }}</vs-td>
                <vs-td>{{ classification.name_5 }}</vs-td>

              </vs-tr>
            </template>

          </vs-table>

          <div class="vs-con-table">
            <div class="con-pagination-table vs-table--pagination">
              <k-pagination
                :total="getLastPage ? getLastPage : 0"
                v-model="page.current" @change="handleChangePage"></k-pagination>
            </div>
          </div>

        </vs-col>

        <vs-col class="mt-4 flex" vs-align="center" vs-justify="flex-end">
          <vs-button class="mr-4 " color="#EDEDED" text-color="black" type="filled" @click="handleClickClose">닫기
          </vs-button>
          <vs-button class="" color="secondary" @click="handleClickSelect">선택</vs-button>
        </vs-col>

      </vs-row>
    </div>
  </vs-popup>
</template>


<script>

import KPagination from '@/components/kPagination/kPagination'
import moment from "moment";
import Vue from "vue";

export default {

  name: 'popupSearchJobClassification',
  components: {KPagination},
  props: {
    value: Boolean,
    selectId: [String, Number],
    title: {
      type: String,
      default: '한국표준직업분류 항목표(건설)'
    }
  },
  computed: {
    projectId () {
      return parseInt(this.$route.params.proj_id)
    },
    filteredList () {
      return this.allClassifications.filter((item, index, self) => {
        return index === self.findIndex((t) => {
          if (this.selectedNo1) {
            if (this.selectedNo1 !== item.no_1) {
              return false
            }
          }
          if (this.selectedNo2) {
            if (this.selectedNo2 !== item.no_2) {
              return false
            }
          }
          if (this.selectedNo3) {
            if (this.selectedNo3 !== item.no_3) {
              return false
            }
          }
          if (this.selectedNo4) {
            if (this.selectedNo4 !== item.no_4) {
              return false
            }
          }
          if (this.keyword) {
            if (item.name_5.indexOf(this.keyword) < 0) {
              return false
            }
          }

          return t.no_5 === item.no_5
        });
      });
    },

    classificationList () {
      const filteredList = this.filteredList

      const fromIdx = this.page.perPage * (this.page.current - 1);
      const toIdx = fromIdx + this.page.perPage;

      const list = [];

      let idx = 0;
      for (const item of filteredList) {
        if (idx >= fromIdx && idx < toIdx) {
          list.push(item);
        }

        idx += 1;
      }

      return list;
    },
    getClass1Options () {
      return this.filteredList.filter((item, index, self) => {
        return index === self.findIndex((t) => t.no_1 === item.no_1);
      })
    },
    getClass2Options () {
      return this.filteredList.filter((item, index, self) => {
        return index === self.findIndex((t) => t.no_2 === item.no_2);
      })
    },
    getClass3Options () {
      return this.filteredList.filter((item, index, self) => {
        return index === self.findIndex((t) => t.no_3 === item.no_3);
      })
    },
    getClass4Options () {
      return this.filteredList.filter((item, index, self) => {
        return index === self.findIndex((t) => t.no_4 === item.no_4);
      })
    },
    getLastPage() {
      const list = this.filteredList
      return Math.ceil(list.length / this.page.perPage)
    }
  },
  watch: {
    value (data) {
      this.showPopup = data
      if (this.oldSelectedTableItem && this.oldSelectedTableItem.id) {
        this.selectedTableItem = this.oldSelectedTableItem
      }

      // 팝업이 열리면, 검색어 입력창에 포커스가 오도록 한다
      if (data) {
        const self = this;
        Vue.nextTick().then(function () {
          self.$refs.inputKeyword.$el.querySelector('input').focus();
        });
      }
    },
    selectId (id) {
      this.oldSelectedTableItemId = id
      if (this.allClassifications && this.allClassifications.length > 0) {
        for (const classification of this.allClassifications) {
          if (classification.no_5 === this.oldSelectedTableItemId) {
            try {
              this.oldSelectedTableItem = classification
              this.selectedTableItem = classification
            } catch (e) {
              //
            }
            break
          }
        }
      }
    },
    showPopup (value) {
      const body = document.querySelector('body');
      if (value) {
        body.style.overflow = 'hidden'
      } else {
        body.style.overflow = 'auto'
      }
      this.selectedTableItem = this.oldSelectedTableItem

      this.$emit('input', value)
      this.loadJobClassifications()
    },
  },
  data () {
    return {
      id: null,
      showPopup: false,

      allClassifications: [],

      selectedNo1: '',
      selectedNo2: '',
      selectedNo3: '',
      selectedNo4: '',

      keyword: '',

      oldSelectedTableItemId: 0,
      oldSelectedTableItem: {},
      selectedTableItem: {},

      // 페이징
      page: {
        current: 1,
        lastPage: 1,
        perPage: 5
      },

      // 겅색
      search: {
        keyword: '' // 검색어
      },
      tabIndex: 0,

      // 선택된 탭과 연결된 FieldType의 code 값
      selectedFieldCode: '',
    }
  },


  mounted () {
    const backButtonRouteGuard = this.$router.beforeEach((to, from, next) => {
      if (this.showPopup) {
        this.showPopup = false
        next(false); return
      }
      next(true)
    })
    this.$once('hook:destroyed', () => {
      backButtonRouteGuard()
    })
  },

  async created () {
    this.showPopup = this.value
    this.oldSelectedTableItemId = this.selectId
    if (this.fieldTypes && this.fieldTypes.length > 0) {
      this.selectedFieldCode = this.fieldTypes[0].field_code
    }
    // await this.loadJobClassifications()
  },

  methods: {
    getFormattedDate(dateStr) {
      const dateMoment = moment(dateStr);
      if (dateMoment.isValid()) {
        return dateMoment.format('YYYY-MM-DD');
      } else {
        return '';
      }
    },
    async loadJobClassifications () {
      if (!this.showPopup) return

      this.allClassifications = await this.$store.dispatch('project/LOAD_JOB_CLASSIFICATION_LIST', {});
      this.page.lastPage = Math.ceil(this.allClassifications.length / this.page.perPage);
    },

    onClickTab (fieldCode) {
      if (fieldCode) {
        this.selectedFieldCode = fieldCode
      }

      this.page.current = 1
      this.selectedTableItem = {}

      this.loadJobClassifications()
    },

    handleClickClose () {
      this.$emit('input', false)
      this.$emit('handleClickClose')
    },

    handleClickSearch () {
      this.keyword = this.search.keyword
    },

    handleChangePage () {
      this.loadJobClassifications()
    },

    handleItemClickDetail (data) {
      if (this.selectedTableItem === data) {
        this.selectedTableItem = {}
      } else {
        this.selectedTableItem = data
      }
    },

    handleClickSelect () {
      this.$emit('input', false)
      this.$emit('handleClickSelect', this.selectedTableItem)
    }
  }
}

</script>


<style>

#popupSearchCompany > .vs-popup {
  width: 860px !important;
}

#popupSearchCompany > .vs-popup > .vs-popup--content {
  width: 100%;
  padding: 0;
  margin: 0;
}

#popupSearchCompany > .vs-popup > .vs-popup--content > .vs-row {
  padding: 24px;

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

.vs-con-table.stripe .tr-values.active {
  background: rgb(102, 112, 203) !important;
  color: #fff;
  font-width: bold;
}

th, td {
  text-align: center !important;
}
th .vs-table-text {
  justify-content: center;
}
.textCenter {
  text-align: center;
}
</style>

<style>
  .popupSearchJobClassification > .vs-popup {
    width:1200px !important;
    max-width:100% !important;
  }

  .popupSearchJobClassification .vs-tabs--content {
    min-height: inherit !important;
  }
</style>
