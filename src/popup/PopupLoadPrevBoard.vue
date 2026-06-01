<template>
  <vs-popup id="popup" :title="title" :active.sync="showPopup">
    <search-nav @handleSearch="handleClickSearch">
      <component v-if="searchComponent" :is="searchComponent" v-model="search" />
      <div v-else class="search-layout w-full grid col-gap-4 flex-wrap xl:flex ">
        <component
          v-for="(component, index) in stdSearchComponents"
          v-if="showSearchNavItem(component['options'])"
          :is="component['component']"
          :label="component['label']"
          :query="component['query']"
          :options="component['options']"
          :onClickSearch="handleClickSearch"
          v-model="search[component['value']]"
        />
      </div>
    </search-nav>
    <table>
      <colgroup>
        <col width="60" />
      </colgroup>
      <thead>
        <th v-if="multiSelect"><vs-checkbox
          @change="handleCheckAll"
          class="form-group__header-title title-checked"
          :value="allChecked"
        ></vs-checkbox></th>
        <th>No.</th>
        <th v-for="head in listFileData.getHead()" :key="`table_th_${head.name}`">
          {{ head.name }}
        </th>
      </thead>
      <tbody>
        <tr v-for="(item, item_i) in boardList" :key="`table_row_${item_i}`" @click="selectRowData(item)">
          <td v-if="multiSelect" @click.stop><vs-checkbox :value="getChecked(item.id)" @change="checkForm($event, item)"/></td>
          <td>{{ item.id }}</td>
          <td v-for="(head, head_i) in listFileData.getHead()" :key="`table_td_${head.name}`">{{ getColData(head_i, item) }}</td>
        </tr>
      </tbody>
    </table>
    <div class="vs-con-table mb-6">
      <div class="con-pagination-table vs-table--pagination">
        <k-pagination :total="page.lastPage ? page.lastPage : 1" :value="page.current" @change="handleChangePage" />
        <vs-button
          v-if="checkList.length > 0"
          class=""
          color="secondary"
          type="border"
          style="width: 150px; position: absolute;"
          @click="onClickUse"
        >불러오기</vs-button>
      </div>
    </div>
  </vs-popup>
</template>

<script>
import HttpRequest from "@/util/HttpRequest";

import KPagination from "@/components/kPagination/kPagination";
import SearchNav from "@/components/nav/SearchNav.vue";
import SearchNavStartEnd from "@/components/nav/SearchNavStartEnd.vue";
import SearchNavItemKeyword from "@/components/nav/SearchNavItemKeyword";
import SearchNavItemSelect from "@/components/nav/SearchNavItemSelect";

import normalSearchNav from "@/views/boards/components";
import singlePageList from "@/views/boards/single-page/listIndex";

import moment from "moment";
import searchComponent from "@/views/list/components/include";

export default {
  name: "PopupLoadPrevBoard",
  components: {
    KPagination,
    SearchNav,
    SearchNavStartEnd,
    SearchNavItemKeyword,
    SearchNavItemSelect,
  },
  props: {
    title: {
      type: String,
      default: "이전 문서 불러오기",
    },
    setBoardId: Number,
    multiSelect: Boolean,
    value: { type: Boolean, default: false },
  },
  data() {
    return {
      showPopup: this.value,
      // 페이징
      page: {
        current: 1,
        lastPage: 1,
        perPage: 10,
      },
      // 검색
      search: {
        loading: false,
      },
      boardList: [],

      // boardList[i].checked 로 처리하려고 했으나, checkbox가 작동하지 않는 문제가 있어서 checkList를 따로 만들었다.
      checkList: [],
    };
  },
  created() {
    this.boardList = []
  },
  computed: {
    projectId() {
      return parseInt(this.$route.params.proj_id);
    },
    boardId() {
      return this.setBoardId ? this.setBoardId : parseInt(this.$route.params.boardId);
    },
    listFileData() {
      return singlePageList[`${this.boardId}_list`];
    },
    searchComponent() {
      return normalSearchNav[`NormalSearchNav${this.boardId}`];
    },
    allChecked () {
      for (const data of this.boardList) {
        if (!this.getChecked(data.id)) {
          return false;
        }
      }
      return true;
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
  },
  watch: {
    value: {
      handler(value) {
        this.showPopup = value;
        if (value) {
          this.loadBoardList();
          this.page.current = 1;
        }
      },
    },
    showPopup(value) {
      const body = document.querySelector("body");
      if (value) {
        body.style.overflow = "hidden";
      } else {
        body.style.overflow = "auto";
      }
      this.$emit("input", value);
    },
  },
  methods: {
    onClickUse () {
      this.showPopup = false;
      this.$emit("selectRowData", this.checkList);
    },
    getChecked (id) {
      return this.checkList.map(value => value.id).indexOf(id) >= 0;
    },
    checkForm ($event, post) {
      const checked = $event.target.checked;
      if (checked) {
        const item = {id: post.id, content: this.getContent(post)};
        this.checkList.push(item);
      } else {
        this.checkList.splice(this.checkList.map(value => value.id).indexOf(post.id), 1);
      }
    },
    handleCheckAll ($event) {
      const checked = $event.target.checked;
      if (checked) {
        for (const post of this.boardList) {
          if (!this.getChecked(post.id)) {
            const item = {id: post.id, content: this.getContent(post)};
            this.checkList.push(item);
          }
        }
      } else {
        this.checkList = [];
      }
    },
    handleClickSearch() {
      this.page.current = 1;
      this.loadBoardList();
    },
    handleChangePage(page) {
      this.page.current = page;
      this.loadBoardList();
    },
    initSearchConditions () {
      const func = singlePageList[`${this.boardId}_list`] && singlePageList[`${this.boardId}_list`].getConditions
      if (func) {
        this.search.conditions = func({value: this.search});
      }
    },

    async loadBoardList() {
      if (!this.showPopup) return;

      // 데이터를 읽기 전 페이지 이동시 반복적으로 api를 호출하는 것을 막기위해 추가
      if (this.search.loading) return
      this.search.loading = true

      const projectId = this.projectId;

      this.initSearchConditions();
      const conditions = this.nav && this.nav.conditions ? this.nav.conditions : [];
      const boardId = this.boardId;
      const page = this.page.current;
      const perPage = this.page.perPage;

      let params = {
        projectId,
        boardId,
        page,
        perPage,
        orderTarget: "created_at",
        orderDirection: "desc",
        conditions,
      };

      // 날짜 검색
      if (!!this.search && !!this.search.created_at) {
        // 검색하는 날짜의 타겟을 불러온다
        const _ = { value: { created_at: {} } };
        this.listFileData.getSearchKeyValue(_);

        if (boardId === 161) {
          params = { ...params, dateTarget: _.dateTarget, dateBegin: this.search.inputB_4.sDate, dateEnd: this.search.inputB_4.eDate };
        } else {
          params = { ...params, dateTarget: _.dateTarget, dateBegin: this.search.created_at.sDate, dateEnd: this.search.created_at.eDate };
        }
      }

      // 검색 조건
      if (this.listFileData.getSearchKeyword({ value: this.search }) && this.listFileData.getSearchKeyword({ value: this.search }).length > 0) {
        const keyword = this.listFileData.getSearchKeyword({ value: this.search }).map((_keyword) => {
          return _keyword.replace("[:default_skw]", this.search.searchKeyword).replace("[:default_disaster]", this.search.disasterType);
        });
        params = { ...params, keyword };

      }

      new Promise((resolve, reject) => {
        HttpRequest.get(`/api/v1/board/post/${boardId}`, { params })
          .then((response) => {
            const { current_page, last_page, data } = response;
            this.boardList = data;
            this.page.current = current_page;
            this.page.lastPage = last_page;

            for (const data of this.boardList) {
              data.checked = false;
            }
          })
          .catch((err) => reject(err));
      });

      this.search.loading = false;
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
      while (part = parts.shift()) {
        if (typeof obj[part] !== "object") obj[part] = {};
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

    getColData(index, data) {
      return this.listFileData.getCol(index, data, {
        getContent: this.getContent,
        getCreatedDate: this.getCreatedDate,
        getCompanyName: this.getCompanyName,
        getContentTargetList: this.getContentTargetList,
        onNameBlur: this.onNameBlur,
        getContentRiskList: this.getContentRiskList,
        getContentStringList: this.getContentStringList,
        comma: this.comma,
      });
    },

    selectRowData(data) {
      if (this.multiSelect) return
      this.showPopup = false;
      this.$emit("selectRowData", this.getContent(data));
    },

    // ======================= DATA FORMAT =========================

    getContentStringList(list) {
      let result = "";
      for (const data of list) {
        if (!result.includes(data)) {
          result += `${data},`;
        }
      }
      return result.substring(0, result.length - 1);
    },
    getContentRiskList(list) {
      let result = "";
      for (const data of list) {
        if (!result.includes(data.input_3)) {
          result += `${data.input_3},`;
        }
      }
      const newData = result.substring(0, result.length - 1);
      return newData.length <= 19 ? newData : `${newData.substring(0, 19)}...`;
    },
    comma(str) {
      return `${str}`.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    onNameBlur(name) {
      const length = name.length;
      if (2 < length) {
        const first = name[0];
        const last = name[name.length - 1];
        let star = "";
        for (let index = 0; index < length - 2; index++) {
          star += "*";
        }
        name = first + star + last;
      } else if (length === 2) {
        const first = name[0];
        name = `${first}*`;
      }
      return name;
    },
    getContentTargetList(list) {
      let result = "";
      for (const data of list) {
        if (!result.includes(data.target)) {
          result += `${data.target},`;
        }
      }
      return result.substring(0, result.length - 1);
    },
    getCompanyName(comId) {
      for (const com of this.companyList) {
        if (com.id === comId) {
          return com.com_name;
        }
      }
    },
    getCreatedDate(data) {
      if (data === "") return "";
      return moment(data).format("YYYY-MM-DD");
    },
    getContent(data) {
      if (data.post_content) {
        const content = JSON.parse(data.post_content);
        return content.body;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
#popup::v-deep {
  .vs-popup {
    width: 90% !important;
    @media print, screen and (min-width: theme("screens.xl")) {
      width: 70% !important;
    }
  }
}
table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  border: 2px solid #f8f8f8;

  th,
  td {
    text-align: center;
    padding: 10px;
    transition: all 0.3s ease;
  }

  tr {
    cursor: pointer;
    &:nth-child(2n-1) {
      background-color: #f9f9f9;
    }
    &:hover {
      z-index: 200;

      td {
        -webkit-transform: translateY(-4px);
        transform: translateY(-4px);
      }
    }
  }
}
</style>
