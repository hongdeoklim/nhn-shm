<template>
  <div>
    <div class="chip-container">
      <div style="position: absolute; left: 0; right: 0; top: 0; bottom: 0; cursor: pointer" @click.prevent.stop="showPopup = true">
        <!-- 입력폼 전체가 클릭될 수 있도록 배경에 깔리는 더미 div-->
      </div>
      <div class="chips">
        <vs-chip v-for="chip in chips" :key="chip.id" closable color="#7E72F2" class="chip m-0" @click="removeChip(chip)">
          {{ chip.name }}
        </vs-chip>
      </div>
      <div class="popup-icon" @click="showPopup = true">
        <feather-icon icon="UsersIcon" />
      </div>
    </div>
    <vs-popup title="사용자 검색" :active.sync="showPopup" id="alertUserSelectPopup">
      <search-nav @handleSearch="handleSearch">
        <search-nav-item-select :label="$t('search.검색조건')" v-model="search.type" :list="searchTypes" />
        <search-nav-item-keyword :label="$t('search.키워드')" v-model="search.keyword" @keyup-event="handleSearch" />
      </search-nav>
      <div>
        <table>
          <colgroup>
            <col width="40" />
          </colgroup>
          <thead>
            <tr>
              <th><vs-checkbox :value="allCheck" @click.native="onClickAllCheck" /></th>
              <th>{{ feildTitle }}</th>
              <th>소속명</th>
              <th>부서명</th>
              <th>이름</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in userList" :key="user.id" @click.prevent="onMemberRow({ id: user.id, name: user.name })">
              <td><vs-checkbox v-model="checkIds" :vs-value="user.id" @change="(e) => onChangeCheckbox(e, { id: user.id, name: user.name })" /></td>
              <td>{{ getFieldName(user.fields) }}</td>
              <td>{{ !!user.company ? user.company.com_name : "" }}</td>
              <td>{{ user.section }}</td>
              <td>{{ user.name }}</td>
            </tr>
          </tbody>
        </table>
        <div class="vs-con-table">
          <div class="con-pagination-table vs-table--pagination">
            <k-pagination :total="page.lastPage ? page.lastPage : 0" v-model="page.current" @change="handleChangePage" />
          </div>
        </div>
      </div>

      <div class="flex items-center justify-end mt-4">
        <vs-button class="mr-4" color="#EDEDED" text-color="black" type="filled" @click="handleClickClose">닫기 </vs-button>
        <vs-button color="secondary" @click="handleClickSelect">선택</vs-button>
      </div>
    </vs-popup>
  </div>
</template>

<script>
import SearchNav from "@/components/nav/SearchNav";
import SearchNavItemKeyword from "@/components/nav/SearchNavItemKeyword";
import SearchNavItemSelect from "@/components/nav/SearchNavItemSelect";
import KPagination from "@/components/kPagination/kPagination";

import config from "/public/config";

export default {
  name: "AlertUserSelector",
  components: {
    SearchNav,
    SearchNavItemKeyword,
    SearchNavItemSelect,
    KPagination,
  },
  props: {
    value: { type: Array, default: () => [] },
    fieldName: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      showPopup: false,

      checkIds: this.value.map((v) => v.id),
      checkData: JSON.parse(JSON.stringify(this.value)),
      chips: JSON.parse(JSON.stringify(this.value)),
      search: { type: "name", keyword: "" },
      page: {
        current: 1,
        lastPage: 1,
        perPage: 5,
      },
    };
  },
  computed: {
    userList() {
      const list = JSON.parse(JSON.stringify(this.$store.state.member.list));

      // list에서 다음 id 값들은 제외한다 (nh5000! ~ nh5004!)
      const exceptIds = [312, 313, 314, 315, 316];
      list.forEach((v, i) => {
        if (exceptIds.includes(v.id)) {
          list.splice(i, 1);
        }
      });

      return list;
    },
    allCheck() {
      if (0 < this.userList.length) {
        return this.userList.reduce((_prev, _ul) => _prev && this.checkIds.includes(_ul.id), true);
      } else return false;
    },
    feildTitle() {
      let _fieldTitle = "사업장명";
      switch (config.HOST_NAME) {
        case "nhsafe.maot.co.kr":
        case "dev-nhsafe.maot.co.kr":
          _fieldTitle = "현장명";
          break;
      }
      return _fieldTitle;
    },
    searchTypes() {
      return [
        { value: "name", text: "이름" },
        { value: "field", text: this.feildTitle },
        { value: "company", text: "소속명" },
        { value: "section", text: "부서명" },
      ];
    },
  },
  watch: {
    value: {
      handler(value) {
        this.chips = value;
      },
    },
    chips: {
      immediate: true,
      deep: true,
      handler(value) {
        this.$emit("input", value);
      },
    },
    showPopup(value) {
      const body = document.querySelector('body');
      if (value) {
        body.style.overflow = 'hidden'
      } else {
        body.style.overflow = 'auto'
      }

      if (value) {
        this.page = {
          current: 1,
          lastPage: 1,
          perPage: 5,
        };
        this.search = { type: "name", keyword: "" };
        this.loadUsers();
      }
    },
  },
  mounted() {
    const backButtonRouteGuard = this.$router.beforeEach((to, from, next) => {
      if (this.showPopup) {
        this.showPopup = false;
        next(false);
        return;
      }
      next(true);
    });
    this.$once("hook:destroyed", () => {
      backButtonRouteGuard();
    });

    // 첫번째 검색 조건을 선택시킨다
    this.search.type = this.searchTypes[0].value;
  },
  methods: {
    handleSearch() {
      if (!!this.search.type || !!this.search.keyword) {
        this.page = {
          current: 1,
          lastPage: 1,
          perPage: 5,
        };
        this.loadUsers();
      }
    },
    async loadUsers() {
      const { current, lastPage, perPage } = this.page;
      const { type, keyword } = this.search;

      const params = { searchType: "and", page: current, perPage, projectId: this.$route.params.proj_id };
      switch (type) {
        case "field":
          params.field = keyword;
          break;
        case "company":
          params.company = keyword;
          break;
        case "section":
          params.section = keyword;
          break;
        case "name":
          params.name = keyword;
          break;
      }

      // 키워드가 입력됐으면, 기본 설정을 취소한다
      if (type !== "field" || keyword === "") {
        if (this.fieldName) params.field = this.fieldName;
      }

      await this.$store.dispatch("member/LOAD_MEMBERS", params);

      const listInfo = this.$store.state.member.listInfo;
      this.page.lastPage = listInfo.last_page;
    },
    handleChangePage(page) {
      this.page.current = page;
      this.loadUsers();
    },
    onClickAllCheck() {
      const listIds = this.userList.map((ul) => ul.id);
      if (this.allCheck) {
        console.log("onClickAllCheck", this.checkData);
        this.checkData = this.checkData.filter((cd) => !listIds.includes(cd.id));
        this.checkIds = this.checkData.map((cd) => cd.id);
      } else {
        const clean = this.checkData.filter((cd) => !listIds.includes(cd.id));
        const newData = this.userList.map((ul) => {
          return { id: ul.id, name: ul.name };
        });

        this.checkData = [...clean, ...newData];
        this.checkIds = this.checkData.map((cd) => cd.id);
      }
    },
    onChangeCheckbox(e, data) {
      if (e.includes(data.id)) this.checkData.push(data);
      else this.checkData = this.checkData.filter((cd) => cd.id !== data.id);
    },
    onMemberRow(data) {
      if (this.checkData.find((cd) => cd.id === data.id)) {
        console.log("onMemberRow", this.checkData);
        this.checkData = this.checkData.filter((cd) => cd.id !== data.id);
      } else {
        this.checkData.push(data);
      }
      this.checkIds = this.checkData.map((cd) => cd.id);
    },
    handleClickClose() {
      console.log("handleClickClose");
      this.checkData = JSON.parse(JSON.stringify(this.chips));
      this.checkIds = this.chips.map((_c) => _c.id);
      this.showPopup = false;
    },
    handleClickSelect() {
      console.log("handleClickSelect");
      this.chips = JSON.parse(JSON.stringify(this.checkData));
      this.showPopup = false;
    },
    removeChip(data) {
      this.chips = this.chips.filter((chip) => chip.id !== data.id);
      this.checkData = JSON.parse(JSON.stringify(this.chips));
      this.checkIds = this.chips.map((_c) => _c.id);
    },
    getFieldName(fields) {
      if (fields) {
        const names = fields.map((_f) => _f.field_name);
        return names.join(", ");
      } else return "";
    },
  },
};
</script>

<style lang="scss" scoped>
.chip-container {
  position: relative;
  width: 100%;
  min-height: 40px;

  display: flex;
  justify-content: space-between;

  background: #ffffff;
  border: 1px solid #cdcdcd;
  border-radius: 5px;

  padding: 6px 10px;

  .chips {
    display: flex;
    flex-wrap: wrap;
    gap: 6px 4px;

    .chip::v-deep {
      font-style: normal;
      font-weight: 500;
      font-size: 14px;
      line-height: 20px;

      border-radius: 4px;
      .btn-close {
        background: none;
        i {
          font-size: 8px;
        }
      }
    }
  }

  .popup-icon {
    min-height: 100%;
    display: flex;
    border-left: solid 1px #cdcdcd;
    padding-left: 10px;
    user-select: none;
    cursor: pointer;
  }
}

#alertUserSelectPopup::v-deep {
  .vs-popup {
    width: 90%;
  }

  @media screen and (min-width: theme("screens.xl")) {
    .vs-popup {
      width: 70%;
    }
  }
}

table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  border: 2px solid #f9f9f9;

  th,
  td {
    font-size: 14px;
    text-align: center;

    padding: 10px;

    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }

  thead,
  tr {
    th:first-child,
    td:first-child {
      padding: 10px 0;
    }
  }

  tbody {
    tr:nth-child(2n -1) {
      background: #f9f9f9;
    }
  }
}
</style>
