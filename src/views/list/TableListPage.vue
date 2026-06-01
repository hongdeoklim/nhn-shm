<template>
  <div class="table-list-page">
    <!--
    2024.08.16 농협
    필터를 여러개 적용하기 위한 폼
    -->
    <search-filter v-if="filterSetting && filterSetting.length > 0"
                   :filter-setting.sync="filterSetting"
                   @update:filter-setting="updateFilterSetting"
                   @on-search="handleFilterSetting"
                   @on-search-keyword="handleFilterKeyword"/>

    <search-nav v-else-if="showNav" @handleSearch="onClickSearch">
      <slot name="search">
        <div class="search-layout w-full grid col-gap-4 flex-wrap xl:flex ">
          <component
              v-for="(component, index) in stdSearchComponents" :key="index"
              v-if="showSearchNavItem(component['options'])"
              :is="component['component']"
              :label="component['label']"
              :query="component['query']"
              :options="component['options']"
              :onClickSearch="onClickSearch"
              v-model="nav.value[component['value']]"
          />
        </div>
      </slot>
    </search-nav>
    <div class="flex" v-if="selectList">
      <vs-tabs
          v-model="selectTab"
          class="mr-auto"
      >
        <vs-tab label="검색 결과"/>
        <vs-tab :label="`선택된 문서 (${selectList.length})`" />
      </vs-tabs>
      <div class="ml-auto flex" style="gap: 0.5rem;">
        <vs-button v-if="selectTab === 0" color="secondary" style="min-width: 180px;" @click="onSelectAll">전체선택</vs-button>
        <vs-button :color="selectList.length > 0 ? 'secondary' : 'gray'" style="min-width: 180px;" @click="onClickPrint">선택된 문서 인쇄</vs-button>
      </div>
    </div>
    <div class="flex justify-between w-full">
      <div v-if="totalCountVisible" class="flex items-center pl-2 xl:pl-0" style="font-size: 18px;">
        <span class="mr-2" style="font-weight: 700;">{{ totalCountLabel }}</span>
        <span>{{ total }}{{ totalCountUnit }}</span>
      </div>
      <div v-else></div>
      <div class="flex gap-4 text-right px-4 xl:px-0">
        <!-- <vs-button v-if="download" class="mr-4" color="secondary" type="border" @click="onClickDownload">{{ $t("button.Excel 다운로드") }} </vs-button> -->
        <vs-button v-if="multiPrint" class="mr-4 mb-4 py-0 pl-6" color="secondary" type="border" @click="onClickMultiPrint">
          <div class="flex items-center">
            <feather-icon icon="PrinterIcon" svgClasses="h-6 w-6" class="mr-1" />
            <span class="my-3">선택 후 인쇄</span>
          </div>
        </vs-button>
        <vs-button v-if="approval && permission.c" color="secondary" type="border" @click="onClickApprovalLine" class="mb-4 flex-1 xl:flex-none">{{ $t("button.결재선 지정") }} </vs-button>
        <vs-button v-if="create && permission.c" color="secondary" @click="onClickNew" class="mb-4 flex-1 xl:flex-none">{{ createBtnLabel }} </vs-button>
      </div>
    </div>

    <vx-card :class="cardClass">
      <vs-table
          class="pb-wide"
          color="success"
          style="min-width:100%; width:auto;"

          ref="table"
          :sst="true"
          :data="parsedListForTable"
          no-data-text=""
          @sort="onClickSort"
          @selected="onClickDetail"
      >

        <!--헤더-->
        <template slot="thead">
          <vs-th v-if="baseColumn" sort-key="No" style="width: 60px; min-width: 60px; text-align: center"><span class="w-full text-center">No.</span></vs-th>
          <vs-th v-for="head in heads" :key="`table_header_${head.name}`" class="page-head" :class="head.class" :style="{ ...head.style, width: `${(approval ? 90 : 96) / heads.length}%` }" style="text-align: center" :sort-key="head.keyName">
            <span class="w-full">{{ head.name }}</span>
          </vs-th>
          <vs-th v-if="baseColumn && boardSlug && approval" sort-key="결재상태" style="min-width: 100px; width: 100px; text-align: center"><span class="w-full text-center">결재상태</span></vs-th>
          <vs-th v-if="baseColumn && moveProject" style="min-width: 200px; width: 200px"><span class="w-full text-center">보기</span></vs-th>
        </template>

        <!--본문영역-->
        <template slot-scope="{ data }">
          <vs-tr v-if="loading">
            <vs-td :colspan="heads.length + (baseColumn ? 1 : 0)" class="text-center">
              <div class="w-full p-5 flex items-center justify-center" style="min-height: 100px">
                <feather-icon icon="LoaderIcon" class="mr-2 rotate-icon" />
                데이터를 불러오는 중입니다.
              </div>
            </vs-td>
          </vs-tr>
          <vs-tr v-else
                 v-for="(tr, ri) in data"
                 :data="tr"
                 :key="ri"
                 :style="fontSize ? { fontSize } : {}"
                 :class="selectList && tr.raw && selectList.findIndex((item) => item.id === tr.raw.id) >= 0 ? 'selectItem' : ''"
          >
            <vs-td v-if="baseColumn" class="text-center">
              {{ tr["No"] }}
            </vs-td>

            <vs-td
                v-for="(head, ci) in heads"
                :key="`table_list_${ri}_${ci}_${head.name}`"
                class="text-center"
                :style="{ ...head.style, width: `${(approval ? 90 : 96) / heads.length}%` }"
            >
              <div v-if="typeof tr[head.name] === 'object'">
                <div v-if="tr[head.name] && tr[head.name].type === 'file'">
                  <a download target="_blank" :href="img.path" v-for="(img, index) in tr[head.name].files" :key="index" @click.stop>
                    <vs-icon icon-pack="feather" icon="icon-file" />
                  </a>
                </div>
                <div v-else-if="tr[head.name] && tr[head.name].type === 'image'">
                  <a download target="_blank" :href="tr[head.name].url" @click.stop>
                    <vs-image style="width: 120px; height: 120px" :src="tr[head.name].url" />
                  </a>
                </div>
                <div v-else-if="tr[head.name] && tr[head.name].type === 'image-center'">
                  <a download target="_blank" :href="tr[head.name].url" style="display: flex; align-items: center; justify-content: center" @click.stop>
                    <vs-image style="width: 120px; height: 120px" :src="tr[head.name].url" />
                  </a>
                </div>
                <div v-else-if="tr[head.name] && tr[head.name].type === 'pre'">
                  <div style="white-space: pre-line; text-align: left">{{ tr[head.name].value }}</div>
                </div>
                <div v-else-if="tr[head.name] && tr[head.name].type === 'pre-center'">
                  <div style="white-space: pre-line; text-align: center">{{ tr[head.name].value }}</div>
                </div>
                <div v-else-if="tr[head.name] && tr[head.name].type === 'member'">
                  <div class="w-full" style="text-align: center">{{ getMemberName(tr[head.name].memberId) }}</div>
                </div>
                <div v-else-if="tr[head.name] && tr[head.name].type === 'html'">
                  <div class="w-full text-left" v-html="tr[head.name].html" />
                </div>
                <div v-else-if="tr[head.name]">
                  <span :class="tr[head.name].type">{{ tr[head.name].value }}</span>
                  <span v-if="tr[head.name].type === 'up' || tr[head.name].type === 'down'" style="display: inline-flex; padding-top: 2px; width: 20px; height: 20px; max-height: 20px">
                    <vs-image class="w-full" :src="require(`@/assets/images/icon/Icon-arrow_${tr[head.name].type}.png`)" />
                  </span>
                </div>
              </div>
              <div v-else style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap;" :title="tr[head.name] ? tr[head.name] : '　'">
                {{ tr[head.name] ? tr[head.name] : '　'}}
              </div>
            </vs-td>

            <vs-td v-if="baseColumn && boardSlug && approval" class="text-center">
              {{ tr["결재상태"] }}
            </vs-td>

            <vs-td v-if="baseColumn && moveProject" class="text-center" @click.stop>
              <div class="flex justify-center" @click.stop>
                <vs-button
                    type="border"
                    icon="open_in_new"
                    class="mr-1"
                    @click.stop="
                    () => {
                      onClickDetail(tr, '_blank');
                    }
                  "
                ></vs-button>
                <vs-button
                    type="border"
                    @click.stop="
                    () => {
                      onClickDetail(tr, 'self');
                    }
                  "
                >{{ $t("button.바로가기") }}
                </vs-button>
              </div>
            </vs-td>
          </vs-tr>
        </template>
      </vs-table>

      <div v-if="!loading && parsedListForTable.length === 0">
        <div>
          <div class="w-full p-5 flex items-center justify-center" style="min-height: 100px;">
            <feather-icon icon="AlertTriangleIcon" class="mr-2"/>
            표시할 데이터가 없습니다.
          </div>
        </div>
      </div>

      <!--페이지네이션-->
      <div class="vs-con-table" v-if="selectTab === 0">
        <div class="con-pagination-table vs-table--pagination">
          <k-pagination :total="lastPage" :max-items="5" v-model="page" @change="onChangePage"></k-pagination>
        </div>
      </div>
    </vx-card>

    <popup-approval-process v-if="approval" :show-popup="popup.approval" @closePopup="onClickClose" />
    <popup-excel-download v-if="download" v-model="popup.excel" :list="excelList" :title="title" />
  </div>
</template>

<script>
/* eslint-disable */
import PopupExcelDownload from "@/popup/PopupExcelDownload";
import PopupApprovalProcess from "@/views/approval/PopupApprovalProcess";
import SearchNav from "@/components/nav/SearchNav";
import KPagination from "@/components/kPagination/kPagination";
import singlePageList from "@/views/boards/single-page/listIndex";
import searchComponent from "@/views/list/components/include";
import SearchFilter from "@/components/nav/SearchFilter.vue";

export default {
  name: "TableListPage",
  components: {
    SearchFilter,
    KPagination,
    SearchNav,
    PopupApprovalProcess,
    PopupExcelDownload,
  },
  props: {
    detail: Function,
    list: {
      required: false,
      type: Array,
    },
    // list 를 api 를 통해 불러오지 않고, props 의 list 를 사용하는지에 대한 여부
    useList: Boolean,
    baseColumn: {
      type: Boolean,
      default: true,
    },
    bodyStyle: {
      type: String,
      default: "card",
    },
    showNav: {
      type: Boolean,
      default: true,
    },
    download: {
      type: Boolean | String,
      default: true,
    },
    approval: {
      type: Boolean,
      default: true,
    },
    create: {
      type: Boolean,
      default: true,
    },
    createBtnLabel: {
      type: String,
      default: "신규작성",
    },
    moveProject: {
      type: Boolean,
      default: false,
    },
    moveDetail: {
      type: Boolean,
      default: true,
    },
    moveNew: {
      type: Boolean,
      default: true,
    },
    byCurrentLocation: {
      type: Boolean,
      default: false,
    },
    boardSlug: String,
    boardId: Number | String,
    routeC: String,
    routeU: String,

    fontSize: String,
    nav: Object,
    heads: Array,
    getCol: Function,
    perPage: {
      type: Number,
      default: () => {
        return 10;
      },
    },
    querySearchMode: {
      type: Boolean,
      default: false,
    },
    multiPrint: Boolean,
    selectList: Array,
    totalCountVisible: {
      type: Boolean,
      default: false,
    },
    totalCountLabel: {
      type: String,
      default: "표시된 문서 : ",
    },
    totalCountUnit: {
      type: String,
      default: "건",
    },
  },
  data() {
    return {
      searchComponent,
      popup: {
        excel: false,
        approval: false,
      },
      page: 1,  // 현재 페이지 번호
      total: 0, // 총 데이터 개수
      lastPage: 1,    // 마지막 페이지 번호
      sortKey: "",
      orderTarget: "created_at",
      orderBy: null,
      listAll: [],
      // 엑셀 다운로드를 위해서 전체 불러온 데이터
      listAllExcel: [],
      tableList: [],
      permission: {
        c: false,
        r: false,
        u: false,
        d: false,
      },
      selectTab: 0,

      // 마지막 api 호출시 사용한 옵션
      apiLastLoadOptions: null,
      filterSetting: [],
      filterKeyword: "",
      // 게시글 목록을 불러오고 있다면, true
      loading: false,
    };
  },
  watch: {
    list() {
      this.total = this.list.length;
      this.lastPage = Math.ceil(this.total / this.perPage);
      this.listAll = this.list;
    },
  },
  computed: {
    projectId() {
      return this.$route.params.proj_id;
    },
    cardClass() {
      if (this.bodyStyle === "none") {
        return "none-card";
      }
      return "";
    },
    title() {
      if (typeof this.download === "string") {
        return this.download;
      }
      return "unknown";
    },
    getPage () {
      const query = this.$route.query;
      if (query && query.pg) {
        try {
          return Number(query.pg) > 0 ? Number(query.pg) : 1
        } catch (e) {}
      }
      return 1;
    },
    stdSearchComponents() {
      if (singlePageList[`${this.boardId}_list`]) {
        const getComponents = singlePageList[`${this.boardId}_list`].components
        if (getComponents) {
          const stdSearchComponents = getComponents();
          if (stdSearchComponents && stdSearchComponents.length > 0) {
            for (const component of stdSearchComponents) {
              component.component = searchComponent[component['component']];
            }
          }
          return stdSearchComponents;
        }
      }
      return [];
    },
    /**
     * 테이블 본문에 해당하는 리스트를 작성해서 반환한다
     */
    parsedListForTable() {
      // 선택된 문서를 별도로 볼 수 있는 탭을 선택하면, 테이블의 리스트가 선택된 문서 리스트로 변경된다.
      const rawList = this.selectTab && this.selectTab === 1 ? this.selectList : this.listAll;
      const tableList = [];

      let idx = 1;
      for (const item of rawList) {
        const row = {};
        row.projId = item.project_id;
        row.postId = item.post_id || item.id;
        // if (this.boardSlug) {
        //   row["No"] = item.post_id;
        // } else {
        //   row["No"] = item.id;
        // }
        for (let ci = 0; ci < this.heads.length; ci++) {
          row[this.heads[ci].name] = this.getCol(ci, item);
        }
        if (this.boardSlug) {
          if (item.document_status) {
            row["결재상태"] = item.document_status.name;
          } else {
            row["결재상태"] = "-";
          }
        }
        row["raw"] = item;

        if (this.selectTab === 0) {
          row["No"] = (this.page - 1) * this.perPage + idx;
        } else {
          row["No"] = idx;
        }
        idx += 1;

        tableList.push(row);
      }


      // 대시보드 그래프에서 사용함
      if (this.list) {
        // 정렬
        tableList.sort((a, b) => {
          if (typeof a[this.sortKey] === "object") {
            if (this.orderBy === "desc") {
              return a[this.sortKey].value > b[this.sortKey].value ? -1 : a[this.sortKey].value < b[this.sortKey].value ? 1 : 0;
            } else if (this.orderBy === "asc") {
              return a[this.sortKey].value < b[this.sortKey].value ? -1 : a[this.sortKey].value > b[this.sortKey].value ? 1 : 0;
            }
          } else if (this.orderBy === "desc") {
            return a[this.sortKey] > b[this.sortKey] ? -1 : a[this.sortKey] < b[this.sortKey] ? 1 : 0;
          } else if (this.orderBy === "asc") {
            return a[this.sortKey] < b[this.sortKey] ? -1 : a[this.sortKey] > b[this.sortKey] ? 1 : 0;
          }
          return 1;
        });

        const list = []
        const firstNum = (this.page - 1) * this.perPage + 1
        let idx = 0;
        for (const data of tableList) {
          idx++;
          if (firstNum <= idx && idx <= this.page * this.perPage) {
            list.push(data)
          }
        }
        return list;
      }

      return tableList;
    },
    excelList() {
      const list = [];

      for (const tr of this.listAllExcel) {
        const obj = {};
        obj["projId"] = tr.project_id;
        obj["postId"] = tr.post_id || tr.id;
        if (this.boardSlug) {
          obj["No"] = tr.post_id;
        } else {
          obj["No"] = tr.id;
        }
        for (let ci = 0; ci < this.heads.length; ci++) {
          obj[this.heads[ci].name] = this.getCol(ci, tr);
        }
        if (this.boardSlug) {
          if (tr.document_status) {
            obj["결재상태"] = tr.document_status.name;
          } else {
            obj["결재상태"] = "-";
          }
        }
        obj["raw"] = tr;

        list.push(obj);
      }

      for (const item of list) {
        const keys = Object.keys(item);
        for (const key of keys) {
          if (item[key] && typeof item[key] === "object") {
            if (item[key].type === "member") {
              item[key] = this.getMemberName(item[key].memberId);
            }
          }
        }
      }

      list.sort((a, b) => {
        if (typeof a[this.sortKey] === "object") {
          if (this.orderBy === "desc") {
            return a[this.sortKey].value > b[this.sortKey].value ? -1 : a[this.sortKey].value < b[this.sortKey].value ? 1 : 0;
          } else if (this.orderBy === "asc") {
            return a[this.sortKey].value < b[this.sortKey].value ? -1 : a[this.sortKey].value > b[this.sortKey].value ? 1 : 0;
          }
        } else if (this.orderBy === "desc") {
          return a[this.sortKey] > b[this.sortKey] ? -1 : a[this.sortKey] < b[this.sortKey] ? 1 : 0;
        } else if (this.orderBy === "asc") {
          return a[this.sortKey] < b[this.sortKey] ? -1 : a[this.sortKey] > b[this.sortKey] ? 1 : 0;
        }

        return 1;
      });

      return list;
    },

    realList() {
      return this.excelList;
    },

    initSortData() {
      const _query_keys = ["_sort", "_order"]
      const query = this.$route.query;
      const query_sort = query[_query_keys[0]];
      const query_order = query[_query_keys[1]];
      const data = {
        sort: query_sort || "",
        order: query_order || "",
      }
      return data;
    },

    memberInfo() {
      return this.$store.state.member.memberInfo;
    },
    /**
     * 사용자가 현재 프로젝트에서 선택하고 있는 현장의 ID를 반환합니다.
     */
    selectedField() {
      const metaKey = `selected_field_${this.projectId}`;

      if (this.memberInfo && this.memberInfo.meta) {
        const metaValue = this.memberInfo.meta[metaKey];
        if (metaValue) {
          return JSON.parse(metaValue);
        }
      }

      return null;
    },
    // filterSetting() {
    //   if(singlePageList[`${this.boardId}_list`] && singlePageList[`${this.boardId}_list`].getFilters) {
    //     return singlePageList[`${this.boardId}_list`].getFilters();
    //   }
    //   return null;
    // }
    // filterSetting: {
    //   get() {
    //     if(singlePageList[`${this.boardId}_list`] && singlePageList[`${this.boardId}_list`].getFilters) {
    //       return [...singlePageList[`${this.boardId}_list`].getFilters()];
    //     }
    //     return null;
    //   },
    //   set(value) {
    //     if(singlePageList[`${this.boardId}_list`] && singlePageList[`${this.boardId}_list`].getFilters) {
    //       const filter = singlePageList[`${this.boardId}_list`].getFilters();
    //       if (filter) {
    //         filter.forEach((f) => {
    //           const v = value.find((v) => v.key === f.key);
    //           if(v) {
    //             this.$set(f, 'value', v.value);  // Vue의 반응성 시스템을 활용
    //           }
    //         });
    //       }
    //     }
    //   }
    // }
  },
  async created() {
    this.page = this.getPage;
    this.sortKey = this.initSortData.sort;
    this.orderBy = this.initSortData.order;

    /**
     * 만약 필터 정보가 없다면, 게시판의 필터 정보를 가져온다
     */
    if(!this.filterSetting || this.filterSetting.length === 0) {
      if(singlePageList[`${this.boardId}_list`] && singlePageList[`${this.boardId}_list`].getFilters) {
        const localFilterSetting = singlePageList[`${this.boardId}_list`].getFilters();

        // 쿼리에서 f_로 시작하는 필터 정보를 가져와서 적용한다
        const query = this.$route.query;

        let idx = 0;
        for(const filter of localFilterSetting) {
          const key = `f_${idx}`;
          if(query[key]) {
            try {
              filter.value = JSON.parse(query[key]);
            } catch (e) {
              // 무시
            }
          }
          idx++;
        }

        this.$set(this, 'filterSetting', localFilterSetting);
      }
    }

    // 게시판일 경우, 권한을 확인한다
    if (Number.isInteger(parseInt(this.boardId))) {
      let boards = this.$store.state.member.memberInfo.boards;
      if (!boards) {
        await this.$store.dispatch("member/LOAD_MEMBER_DETAIL");
        boards = this.$store.state.member.memberInfo.boards;
      }

      let board = boards.find((b) => parseInt(b.id) === parseInt(this.boardId));
      if (!!board && !!board.pivot) {
        if (board.pivot.project_id) {
          // 프로젝트에 맞는 권한이 있는지 다시 조사한다
          board = boards.find((b) => parseInt(b.pivot.board_id) === parseInt(this.boardId) && parseInt(b.pivot.project_id) === parseInt(this.projectId));
          this.permission = { ...board.pivot };
        } else {
          this.permission = { ...board.pivot };
        }
      }
    }
  },
  mounted() {
    // 이벤트버스를 통해서 검색어가 변경되었을 때, 리스트를 다시 불러온다
    if (this.$eventbus) {
      this.$eventbus.$on('keyword-search', (/*keyword*/) => {
        this.loadList();
      });
    }
  },
  methods: {

    initSort(){
      const {sortKey, orderBy} = this
      // 정렬 순서가 정해졌을 때에만 해당 컬럼의 정보를 추출한다
      if (orderBy) {
        this.orderDirection = orderBy;
        const target = this.getColumnKey(sortKey);
        if(target) {
          this.orderTarget = target;
        } else {
          // 만약 target이 없다면, 해당 컬럼의 정보를 찾아서 정렬한다
          const target = this.findKeyWithHead(sortKey);
          this.orderTarget = target || 'created_at';
        }
      }
      // 정렬이 해제될 때에는 기본 컬럼을 "created_at"으로 설정한다
      else {
        this.orderDirection = 'desc';
        this.orderTarget = 'created_at';
        if (singlePageList[`${this.boardId}_list`].getDefaultSort) {
          const sort = singlePageList[`${this.boardId}_list`].getDefaultSort();
          this.orderTarget = sort.target;
          this.orderDirection = sort.order;
        }
      }
    },
    initSearchKeyValue() {
      let keyValue = {};
      let keyword = [];

      if (this.boardId) {
        if (singlePageList[`${this.boardId}_list`]) {
          keyValue = singlePageList[`${this.boardId}_list`].getSearchKeyValue(this.nav);
          keyword = singlePageList[`${this.boardId}_list`].getSearchKeyword(this.nav);
        }

        if (keyword) {
          keyword = keyword.map((_keyword) => {
            const k = _keyword.replace("default_skw", `nav.page.p${this.$route.params.boardId}.searchKeyword`)
                .replace("default_disaster", `nav.page.p${this.$route.params.boardId}.disasterType`)
                .replace("default_field_name", `nav.page.p${this.$route.params.boardId}.fieldName`)
            return k;
          });
        }

        if(typeof this.nav !== 'undefined') {
          this.nav.page[`p${this.boardId}`] = keyValue;
          this.nav.keyword = keyword;
        }
      }
    },
    initSearchConditions () {
      const func = singlePageList[`${this.boardId}_list`] && singlePageList[`${this.boardId}_list`].getConditions
      if (func) {
        this.nav.conditions = func(this.nav);
      }
      // console.log('initSearchConditions', this.nav.conditions)
    },

    initFilterSettings () {
      let localCondition = [...this.nav.conditions || []];
      const keywordCondition = [];
      if (this.filterSetting && this.filterSetting.length > 0) {
        this.filterSetting.forEach((filter) => {
          // 1. 키워드가 있는 경우:
          if (this.filterKeyword) {
            keywordCondition.push({key: filter.key, operator: 'LIKE', value: `%${this.filterKeyword}%`, boolean: 'OR'});
          }

          // 2. 필터 설정된 경우:
          if(typeof filter.value === 'string' && filter.value.trim()) {
            localCondition.push({key: filter.key, operator: 'LIKE', value: `%${filter.value}%`});
          }
          else if(typeof filter.value === 'object') {
            /**
             * 날짜 범위 검색을 위한 필터링
             */
            if(filter.type === 'date-range') {
              // 만약 키 중에 sDate 값이 존재한다면
              if (filter.value.sDate) {
                localCondition.push({key: filter.key, operator: '>=', value: filter.value.sDate});
              }

              // 만약 키 중에 eDate 값이 존재한다면
              if (filter.value.eDate) {
                localCondition.push({key: filter.key, operator: '<=', value: filter.value.eDate});
              }
            }
            /**
             * 숫자 검색하는 필터링
             */
            else if(filter.type === 'number') {
              if (filter.value.number || filter.value.number === 0) {
                let operator = '=';
                if (filter.value.operator) {
                  operator = filter.value.operator;
                }
                localCondition.push({key: filter.key, operator, value: filter.value.number});
              }
            }
          }
        });


        // 키워드 조건을 추가하기 전에, 기존에 등록됐던 내용을 삭제한다
        localCondition = localCondition.filter((item) => {
          return !item.conditions;
        });
        if(this.filterKeyword && keywordCondition.length > 0) {
          localCondition.push({
            boolean: "AND",
            conditions: keywordCondition,
          });
        }

        this.nav.conditions = localCondition;
      }
    },

    getMemberName(memberId) {
      const list = this.$store.state.member.listAll;
      for (const member of list) {
        if (Number(`${member.id}`) === Number(`${memberId}`)) {
          return member.name;
        }
      }

      return "";
    },

    async loadList(forExcelDownload = false) {
      let projectId = this.$route.params.proj_id;
      if (this.nav && this.nav.projectId) {
        projectId = this.nav.projectId;
      }

      this.initSort();
      this.initSearchKeyValue();
      this.initSearchConditions();
      this.initFilterSettings();

      if (this.boardSlug) {
        await this.loadListApproval(projectId, forExcelDownload);
      } else {
        await this.loadListBoard(projectId, forExcelDownload);
      }
    },

    async loadListBoard(projectId, forExcelDownload = false) {

      const boardId = this.boardId;
      const conditions = this.nav && this.nav.conditions ? this.nav.conditions : [];
      if(!boardId) {
        return;
      }
      let page = this.page;
      let perPage = this.perPage;
      let orderTarget = this.orderTarget;
      let orderDirection = this.orderDirection;
      if (forExcelDownload) {
        page = 1;
        perPage = 10000;
        orderTarget = "id";
        orderDirection = "asc";
      }

      const companies = this.nav && this.nav.value && this.nav.value.companies && this.nav.value.companies.length > 0 ? this.nav.value.companies : [];
      const companyIds = [...companies];

      let dateTarget = "created_at";
      let dateBegin = "";
      let dateEnd = "";
      const keywords = [];

      if (this.nav && this.nav.dateTarget) {
        dateTarget = this.nav.dateTarget;
      }

      if (this.nav && this.nav.dateBegin) {
        dateBegin = this.getValue(this.$props, this.nav.dateBegin);
      }

      if (this.nav && this.nav.dateEnd) {
        dateEnd = this.getValue(this.$props, this.nav.dateEnd);
      }

      if (this.nav && this.nav.keyword && this.nav.keyword.length > 0) {
        try {
          this.nav.keyword.map((word) => {
            if (word.substr(0, 14) === "customKeyword_") {
              keywords.push(word.substr(14));
            } else {
              const methods = `${word}`.split("*");
              const key = methods[1].replace(/%*\[\:([^%]*)\]%*/, "$1");
              const value = this.getValue(this.$props, key);
              const query = methods[1].replace(/(%*)([^%]*)(%*)/, `$1${value}$3`);
              const keyword = `${methods[0]}*${query.trim()}`;

              //const key
              if (value) {
                keywords.push(keyword);
              }
            }
          });
        } catch (e) {}
      }

      const options = {
        projectId: projectId > 0 ? projectId : undefined,
        boardId,
        page,
        perPage,
        orderTarget,
        orderDirection,
        companyIds,

        dateTarget,
        dateBegin,
        dateEnd,

        conditions,
        keyword: keywords,
      }

      if (JSON.stringify(options) === JSON.stringify(this.apiLastLoadOptions)) {
        // 이전과 동일한 옵션으로 리스트를 불러옵니다.
        return;
      }

      this.loading = true;
      this.apiLastLoadOptions = JSON.parse(JSON.stringify(options));

      // 만약 memberInfo 데이터가 불려오지 않았다면, 불러온다
      if(!this.memberInfo.id) {
        await this.$store.dispatch("member/LOAD_MEMBER_DETAIL");
      }

      /**
       * 프로젝트가 선택되어 있고, 게시글 검색 조건에 현장이 지정되어 있지 않고, 사용자가 특정 현장을 선택한 상태일 경우
       * 필터링되는 현장의 정보를, 선택한 현장의 정보로 변경한다.
       */
      if(this.projectId && !options.fieldId && this.selectedField) {
        options.fieldId = this.selectedField.id;
      }

      const response = await this.$store.dispatch("board/LOAD_POST_LIST", options);

      if(forExcelDownload) {
        this.listAllExcel = response.data;
      } else {
        this.listAll = response.data;
        this.total = response.total;
        this.lastPage = response.last_page;
        this.page = (this.page > this.lastPage) ? this.lastPage : this.page

        this.$emit("load", this.listAll);
      }

      this.loading = false;
    },

    async loadListApproval(projectId, forExcelDownload = false) {
      this.loading = true;
      const boardSlug = this.boardSlug;
      const conditions = this.nav && this.nav.conditions ? this.nav.conditions : [];
      let page = this.page;
      let perPage = this.perPage;
      let orderTarget = this.orderTarget;
      let orderDirection = this.orderDirection;
      if (forExcelDownload) {
        page = 1;
        perPage = 10000;
        orderTarget = "id";
        orderDirection = "asc";
      }
      const dateTarget = [];
      const dateBegin = [];
      const dateEnd = [];
      const keywords = [];
      const companies = this.nav.value && this.nav.value.companies && this.nav.value.companies.length > 0 ? this.nav.value.companies : [];
      const companyIds = [...companies];

      if (this.nav.keyword && this.nav.keyword.length > 0) {
        try {
          this.nav.keyword.map((word) => {
            const methods = `${word}`.split("*");
            const key = methods[1].replace(/%*\[\:([^%]*)\]%*/, "$1");
            const value = this.getValue(this.$props, key);
            const query = methods[1].replace(/(%*)([^%]*)(%*)/, `$1${value}$3`);
            const keyword = `${methods[0]}*${query.trim()}`;
            //const key
            if (value) {
              keywords.push(keyword);
            }
          });
        } catch (e) {}
      }

      if (this.nav.dateTarget) {
        if (typeof this.nav.dateTarget === "string") {
          dateTarget.push(this.nav.dateTarget);
        } else {
          dateTarget.push(...this.nav.dateTarget);
        }
      }

      if (this.nav.dateBegin && this.nav.dateBegin.length > 0) {
        if (typeof this.nav.dateBegin === "string") {
          dateBegin.push(this.getValue(this.$props, this.nav.dateBegin));
        } else {
          this.nav.dateBegin.map((key) => {
            dateBegin.push(this.getValue(this.$props, key));
          });
        }
      }

      if (this.nav.dateEnd && this.nav.dateEnd.length > 0) {
        if (typeof this.nav.dateEnd === "string") {
          dateEnd.push(this.getValue(this.$props, this.nav.dateEnd));
        } else {
          this.nav.dateEnd.map((key) => {
            dateEnd.push(this.getValue(this.$props, key));
          });
        }
      }

      const options = {
        boardSlug,
        projectId,
        page,
        perPage,
        dateTarget,
        dateBegin,
        dateEnd,
        keyword: keywords,
        orderTarget,
        orderDirection,
        companyIds,
        conditions,
      }

      if (JSON.stringify(options) === JSON.stringify(this.apiLastLoadOptions)) {
        // 이전과 동일한 옵션으로 리스트를 불러옵니다.
        return;
      }
      this.apiLastLoadOptions = JSON.parse(JSON.stringify(options));

      const response =  await this.$store.dispatch("approval/LOAD_POST_ALL", options);


      if(forExcelDownload) {
        this.listAllExcel = response.data;
      } else {
        this.listAll = response.data;
        this.total = response.total;
        this.lastPage = response.last_page;
        // this.listAll = [...JSON.parse(JSON.stringify(this.$store.state.approval.list))];
        // this.total = this.$store.state.approval.postListInfo.total;
        this.$emit("load", this.listAll);
      }

      this.loading = false;
    },

    getValue(obj, keyPath) {
      const keys = `${keyPath}`.split(".");
      let value = obj;
      for (const key of keys) {
        value = value[key] ? value[key] : "";
      }
      return value;
    },

    onClickSearch() {
      this.page = 1;
      this.selectTab = 0;

      if (this.querySearchMode) {
        this.onSearchMovePage()
      } else {
        this.loadList();
      }
    },
    // 정렬해야 하는 데이터 컬럼 정보를 불러온다
    getColumnKey(column) {
      const params = { value : { searchType: column } };

      if (this.boardId) {
        const target = singlePageList[`${this.boardId}_list`].getSearchKeyword(params);

        // 만약 target이 배열이고, 개수가 1개 이상이어야 다음으로 진행할 수 있다
        if (Array.isArray(target) && target.length > 0) {
          // target을 * 문자로 잘라서, 첫번째 내용을 this.orderTarget에 입력한다
          return target[0].split("*")[0];
        }
      }

      return null;
    },
    onClickSort(sortKey, orderBy) {
      this.sortKey = sortKey;
      this.orderBy = orderBy;

      if(sortKey === null) {
        return;
      }
      this.loadList();
    },
    async onChangePage(page) {
      this.page = page;
      if (this.querySearchMode) {
        this.onSearchMovePage()
      } else {
        await this.loadList();
      }
    },
    async onClickExcelDownload() {
      await this.loadList(true);

      this.popup.excel = true;
    },
    onClickApprovalLine() {
      this.popup.approval = true;
    },
    onClickNew() {
      if (this.moveNew) {
        const boardId = this.boardId;
        const query = this.$route.query;
        this.$router.push({
          name: this.routeC,
          params: { boardId },
          query,
        });
      } else {
        this.$emit("new");
      }
    },
    onClickClose() {
      const keys = Object.keys(this.popup);
      keys.map((key) => {
        this.popup[key] = false;
      });
    },
    onClickDetail(value, target) {
      if (!value.postId) return;

      let proj_id = this.projectId;
      if (this.byCurrentLocation) proj_id = this.projectId;

      const boardId = this.boardId;
      const boardSlug = this.boardSlug;
      const postId = value.postId;

      // ✅ query 객체를 안전하게 복사해서 수정
      const query = {
        ...this.$route.query,
        pg: this.page,
        _sort: this.sortKey,
        _order: this.orderBy
      };

      // 현재 URL에 query 반영 (페이지 이동 없이)
      this.$router.replace({
        path: this.$route.path,
        query
      });

      // 세부 페이지 이동을 위한 route 정보 구성
      const route = {
        name: this.routeU,
        params: {
          proj_id,
          boardId,
          boardSlug,
          postId
        },
        query
      };

      // 페이지 이동 처리
      if (this.moveProject) {
        if (target === "self") {
          if (route.params.boardId === 50) {
            this.$router.push({ name: route.name, params: { proj_id, postId, tab: "info" } });
          } else {
            this.$router.push(route);
          }
        } else if (target === "_blank") {
          if (route.params.boardId === 50) {
            window.open(`/project/${proj_id}/plan/partners/info/${postId}`, "_blank");
          } else {
            const routeData = this.$router.resolve(route);
            window.open(routeData.href, "_blank");
          }
        }
      } else if (this.moveDetail) {
        this.$router.push(route);
      }

      this.$emit("detail", value, target, route);
    },

    // nav.value 를 세팅하기 전에 호출되어, 값이 초기화되는 문제가 있다.
    onSearchMovePage() {
      // url query 문 생성
      let search = JSON.parse(JSON.stringify(this.nav.value))
      const query = JSON.parse(JSON.stringify(this.$route.query))
      query['pg'] = this.page
      query['_sort'] = this.sortKey;
      query['_order'] = this.orderBy;

      const searchKeys = Object.keys(search)
      if (searchKeys.length > 0) {
        for (const key of searchKeys) {
          if (key === 'searchKeyword') {
            if (search.searchKeyword) {
              query['keyword'] = search.searchKeyword.trim()
            }
          } else if (key === 'companies') {
            if (search.companies && search.companies.length > 0 ){
              query['companies'] = search.companies
            }
          } else if (key === 'yearMonth') {
            if (search.yearMonth.year) {
              query['year'] = search.yearMonth.year
            }

            if (search.yearMonth.month) {
              query['month'] = search.yearMonth.month
            }
          } else {
            if (search[key]) {
              if (typeof search[key] === 'object') {
                /**
                 * 날짜 범위 형식의 쿼리 파라미터 등록
                 */
                if(search[key].type === 'date-range') {
                  if (search[key].sDate && search[key].sDate.trim()) {
                    query['sd'] = search[key].sDate.trim()
                  }

                  if (search[key].eDate && search[key].eDate.trim()) {
                    query['ed'] = search[key].eDate.trim()
                  }
                }
                /**
                 * 숫자 범위 형식의 쿼리 파라미터 등록
                 */
                else if(search[key].type === 'number') {
                  if (search[key].number || search[key].number === 0) {
                    query['n'] = search[key].number;
                    let operator = '=';
                    if (search[key].operator) {
                      operator = search[key].operator;
                    }
                    query['op'] = operator;
                  }
                } else {
                  query[key] = search[key]
                }
              } else {
                query[key] = search[key]
              }
            }
          }
        }
      }

      let filterIdx = 0;
      for(const filter of this.filterSetting) {
        if(filter.value) {
          const queryKey = `f_${filterIdx}`

          if(typeof filter.value === 'object') {
            let isEmpty = true;
            for(const key in filter.value) {
              if(filter.value[key] || filter.value[key] === 0) {
                isEmpty = false;
                break;
              }
            }
            if(isEmpty) {
              // 쿼리에서 해당 키를 제거한다
              delete query[queryKey];

              filterIdx++;
              continue;
            }
          }

          query[queryKey] = JSON.stringify(filter.value);
        } else {
          // 쿼리에서 해당 키를 제거한다
          delete query[`f_${filterIdx}`];
        }

        filterIdx ++;
      }

      if (this.isJsonEmpty(search)) {
        // search (nav.value) 가 비어 있는 경우는 컴포너트가 생성되지 않은 경우 이므로, 컴포넌트의  query 데이터를 사용하여, search 데이터를 미리 넣어준다.
        if (this.stdSearchComponents && this.stdSearchComponents.length > 0) {
          const obj = {};
          for (const component of this.stdSearchComponents) {
            const _component_query = component.query;

            if (_component_query) {
              const keys = Object.keys(_component_query);
              for (const key of keys) {
                const data = _component_query[key];
                this.stringToObj(data, this.$route.query[key] || '', obj)
              }
            }
          }
          search = obj;
        }
      }

      // 기존 코드가 생성한 query 데이터를 제거한다
      if (this.stdSearchComponents && this.stdSearchComponents.length > 0) {
        const _urlQuery = query;
        if (_urlQuery) {
          const _queryKeys = Object.keys(_urlQuery);
          for (const key of _queryKeys) {
            delete query[key]
          }
        }
      }

      // 컴포넌트의 query 데이터를 사용하여, URL 쿼리에 데이터를 넣어준다.
      if (this.stdSearchComponents && this.stdSearchComponents.length > 0) {
        for (const component of this.stdSearchComponents) {
          const _queryObject = component.query;
          if (_queryObject) {
            const _queryKeys = Object.keys(_queryObject);
            for (const key of _queryKeys) {
              if (_queryKeys.length === 1) {
                query[key] = this.findJsonDataWithDottedPath(search, `${component.value}`);
              } else {
                query[key] = this.findJsonDataWithDottedPath(search, `${component.value}.${_queryObject[key]}`);
              }
            }
          }
        }
      }

      // 쿼리의 빈값을 제거한다
      const queryKeys = Object.keys(query)
      for (const key of queryKeys) {
        if (!query[key]) {
          delete query[key]
        }
      }

      this.onMoveNormalPage('list', query)
    },

    isJsonEmpty (json) {
      return Object.keys(json).length === 0;
    },

    // dotted path를 통해서 json 데이터를 찾는다
    // ex> findJsonDataWithDottedPath({a: {b: {c: 1}}}, 'a.b.c') => 1
    findJsonDataWithDottedPath (json, path) {
      try {
        const _keys = Object.keys(json)
        if (_keys.length === 0) {
          return '';
        }
        const paths = path.split('.')
        let result = json
        for (const p of paths) {
          result = result[p]
        }
        return result
      } catch (err) {
        return ''
      }
    },
    stringToObj(path, value, obj) {
      const parts = path.split(".");
      const last = parts.pop();
      let part;
      while(part = parts.shift()) {
        if( typeof obj[part] != "object") obj[part] = {};
        obj = obj[part]; // update "pointer"
      }
      obj[last] = value;
    },

    showSearchNavItem(options) {
      if (options && options.visibleKeyValue) {
        for (const keyValue of options.visibleKeyValue) {
          const key = Object.keys(keyValue)[0];
          const value = keyValue[key];
          const navValue = this.findJsonDataWithDottedPath(this.nav.value, key);
          if (navValue !== value) {
            if (Array.isArray(navValue) && navValue.toString() === value) {
              return true;
            }
          } else {
            return true;
          }
        }
        return false;
      }
      return true;
    },

    findKeyWithHead (sortKey) {
      if (singlePageList[`${this.boardId}_list`]) {
        const heads = singlePageList[`${this.boardId}_list`].getHead().map(e => {return {[e.name] : e.key}});
        // 배열의 객체들을 하나의 객체로 합치기
        const types = Object.assign({}, ...heads);
        return `content$${types[sortKey]}`;
      }
    },

    onMoveNormalPage(type, query) {
      const proj_id = `${this.projectId}`;
      const boardId = `${this.boardId}`;
      if (type === "list") {
        this.$router.push({ name: "list|tab", params: { proj_id, boardId }, query }).catch(async (e) => {
          if (e.toString().indexOf('NavigationDuplicated') >= 0) {
            await this.loadList();
          }
        });
      }
    },

    onClickMultiPrint() {
      this.$emit("clickMultiPrint")
    },

    onSelectAll () {
      if (this.parsedListForTable && this.parsedListForTable.length > 0) {
        this.$emit("selectAll", this.parsedListForTable)
      }
    },
    onClickPrint () {
      if (this.selectList && this.selectList.length > 0) {
        this.$emit("selectPrint")
      }
    },
    updateFilterSetting(data) {
      this.filterSetting = data;
    },
    handleFilterSetting(data) {
      this.filterSetting = data;
      this.onSearchMovePage();
    },
    handleFilterKeyword(data) {
      this.filterKeyword = data;
      this.onSearchMovePage();
    },
  },
};
</script>

<style lang="scss" scoped>
.table-list-page {
  .page-head {
    min-width: 180px !important;
  }
}
</style>
<style lang="scss">
.none-card {
  box-shadow: none;
  border-radius: 0px;
  display: inline-block;

  .vx-card__body {
    padding: 0px !important;
  }
}

span.up {
  color: #28c76f;
}
span.down {
  color: #ea5455;
}
.vs-table--tbody-table tr:nth-child(2n) {
  background-color: #f9f9f9;
}


.selectItem:nth-child(even) {
  background-color: #7E72F238 !important;
}
.selectItem:nth-child(odd) {
  background-color: #7E72F226 !important;
}
.table-list-page table{
  table-layout: fixed !important;
}
.table-list-page .vs-con-table table {
  width: auto;
  min-width: 100%;
}

.rotate-icon {
  animation: rotate 2s linear infinite;
}
</style>
