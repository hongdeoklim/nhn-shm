<template>
  <vs-popup class="popupSearchField" title="현장 정보" :active.sync="showPopup">
    <div class="popupContainer">
      <h5 class="mb-3" style="font-size: 17px"><i class="dot"></i> 현장 개요</h5>

      <div class="fieldInfoContainer mb-8">
        <div>
          <span>현장명 : </span>
          <span>{{ fieldData ? fieldData.field_name || '-' : '-' }}</span>
        </div>
        <div>
          <span>주소 : </span>
          <span>{{ fieldData ? fieldData.address || '-' : '-' }}</span>
        </div>
        <div class="flex">
          <div style="margin-right: 21px;">
            <span>착공일 : </span>
            <span>{{ fieldData ? fieldData.start_work_at || '-' : '-' }}</span>
          </div>
          <div>
            <span class="field-info-label">준공일 : </span>
            <span>{{ fieldData ? fieldData.be_completed_at || '-' : '-' }}</span>
          </div>
        </div>
        <div>
          <span>사업금액 : </span>
          <span>{{ depositAmount }}원</span>
        </div>
        <div>
          <span>산업안전보건관리비 계상금액(합계) : </span>
          <span>{{ amountSumup }}원</span>
        </div>
      </div>

      <template v-if="selectedFieldDirectorList && selectedFieldDirectorList.length > 0">
        <h5 class="mb-3" style="font-size: 17px"><i class="dot"></i> 관리책임자</h5>

        <table class="directorTable w-full mb-8">
          <thead>
          <tr>
            <th style="width: 20%">소속명</th>
            <th style="width: 20%">직책</th>
            <th style="width: 20%">성명</th>
            <th style="width: 20%">서명</th>
            <th style="width: 20%">비고</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="item of selectedFieldDirectorList" :key="JSON.stringify(item)">
            <td>{{ item.target }}</td>
            <td>{{ item.type }}</td>
            <td>{{ item.name }}</td>
            <td>
              <img :src="item.sign" style="max-width: 158px; max-height: 70px;"/>
            </td>
            <td>{{ item.note }}</td>
          </tr>
          </tbody>
        </table>
      </template>

      <!-- 참여 인원 정보 -->
      <div class="flex justify-between items-center">
        <h5 class="mb-3" style="font-size: 17px"><i class="dot"></i> 시스템 사용자 정보</h5>
        <div>
          <search-nav-item-keyword size="large" placeholder="검색 키워드" v-model="searchKeyword"/>
        </div>
      </div>
      <div>
        <table class="userTable w-full">
          <thead>
          <tr>
            <th>No.</th>
            <th>구분</th>
            <th>업체명</th>
            <th>사용자명</th>
            <th>사용자 ID(등록번호)</th>
            <th>휴대폰번호</th>
            <th>권한정보</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(user, indextr) of userTableList" :key="user.id">
            <td>{{ indextr + 1 + userTablePage * userTablePerPage - userTablePerPage }}</td>
            <td>{{ (user.company && user.company.com_type) || '-' }}</td>
            <td>{{ user.department || '-' }}</td>
            <td>{{ user.name || '-' }}</td>
            <td>{{ user.username }}</td>
            <td>{{ user.phone || '-' }}</td>
            <td class="flex items-center justify-center">
              <span>{{ user.join_project ? '참여' : '미참여' }}</span>
            </td>
          </tr>
          </tbody>
        </table>
        <div class="vs-con-table">
          <div class="con-pagination-table vs-table--pagination">
            <k-pagination
              :total="userTableLastPage || 0"
              v-model="userTablePage" @change="handleChangePage"></k-pagination>
          </div>
        </div>
      </div>
    </div>
  </vs-popup>
</template>
<script>
import TableCustom from "@/components/TableCustom.vue";
import CompanyUserAuthModule from "@/views/_BS/components/CompanyUserAuthModule.vue";
import SearchNavItemKeyword from "@/components/nav/SearchNavItemKeyword.vue";
import KPagination from "@/components/kPagination/kPagination.vue";

export default {
  name: "FieldDetailPopup",
  components: {KPagination, SearchNavItemKeyword, CompanyUserAuthModule, TableCustom},
  props: {
    active: {
      type: Boolean,
      required: true,
    },
    fieldId: {
      type: Number,
      required: false,
    },
  },
  data() {
    return {
      showPopup: this.active,
      fieldData: null,
      companyList: [],
      userList: [],
      joinUsers: [],
      searchKeyword: '',
      userTablePage: 1,
      userTablePerPage: 5,
    }
  },
  created() {
    this.loadField(this.fieldId);
  },
  watch: {
    active(value) {
      this.showPopup = value;
      this.userTablePage = 1;
    },
    showPopup(value) {
      this.$emit('update:active', value);
    },
    fieldId(value) {
      this.loadField(value);
    },
  },
  computed: {
    // 숫자만을 남기고, 천단위 기호(,)를 달아서 반환한다
    depositAmount() {
      if (this.fieldData && this.fieldData.deposit_amount) {
        return this.fieldData.deposit_amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      }
      return '-';
    },
    amountSumup() {
      if (this.fieldData && this.fieldData.amount_sumup) {
        return this.fieldData.amount_sumup.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      }
      return '-';
    },
    selectedFieldDirectorList() {
      if (!this.fieldData) return [];

      const meta = JSON.parse(this.fieldData.meta || '{}');
      if (meta['directors']) {
        return meta['directors'];
      }
    },
    filteredUserList() {
      if (this.searchKeyword) {
        return this.userList.filter(user => {
          return user.name.includes(this.searchKeyword)
            || user.username.includes(this.searchKeyword)
            || user.phone.includes(this.searchKeyword)
            || user.department.includes(this.searchKeyword)
            || (user.company && user.company.com_type.includes(this.searchKeyword));
        });
      }
      return this.userList;
    },
    userTableList() {
      const first = (this.userTablePage - 1) * this.userTablePerPage;
      return this.filteredUserList.slice(first, first + this.userTablePerPage);
    },
    userTableLastPage() {
      return Math.ceil(this.filteredUserList.length / this.userTablePerPage);
    }
  },
  methods: {
    async loadField(fieldId) {
      if (!fieldId) return;

      await this.$store.dispatch("project/LOAD_FIELD", {fieldId});
      const info = this.$store.state.project.fieldInfo;
      if (!info) return;

      this.joinUsers = info.users;
      this.fieldData = {...info};

      if (this.fieldData.start_work_at) {
        // start_work_at 값을 'yyyy-MM-dd' 형식으로 대입한다
        this.fieldData.start_work_at = new Date(this.fieldData.start_work_at).toISOString().split("T")[0];
      }
      if (this.fieldData.be_completed_at) {
        // be_completed_at 값을 'yyyy-MM-dd' 형식으로 대입한다
        this.fieldData.be_completed_at = new Date(this.fieldData.be_completed_at).toISOString().split("T")[0];
      }

      if (this.fieldData.field_map.length > 0) {
        this.fieldData.field_map = this.fieldData.field_map[0];
      } else {
        this.fieldData.field_map = {};
      }
      if (this.fieldData.field_photo.length > 0) {
        this.fieldData.field_photo = this.fieldData.field_photo[0];
      } else {
        this.fieldData.field_photo = {};
      }
      if (this.fieldData.field_view.length > 0) {
        this.fieldData.field_view = this.fieldData.field_view[0];
      } else {
        this.fieldData.field_view = {};
      }

      if (this.fieldData.facility_category) {
        this.cat1 = this.fieldData.facility_category.cat1;
        this.cat2 = this.fieldData.facility_category.cat2;
        this.cat3 = this.fieldData.facility_category.id;
      }

      if (this.fieldData.signatures) {
        this.signatureList = JSON.parse(`${this.fieldData.signatures}`);
      }

      if (this.fieldData.companies && this.fieldData.companies.length > 0) {
        const companies = [];
        for (const company of this.fieldData.companies) {
          companies.push(company);
        }
        this.companyList = companies;

        await this.initMembers();
      }

      if (this.fieldData.meta) {
        const meta = JSON.parse(this.fieldData.meta);
        if (meta['directors']) {
          this.directorList = meta['directors'];
        }
      }
    },
    async initMembers() {
      const joinUsers = this.joinUsers;
      const members = [];
      for (const company of this.companyList) {
        members.push(...(await this.loadMember(company.id)));
      }

      for (const member of members) {
        let join_project = false;
        for (const user of joinUsers) {
          if (user.id === member.id) {
            join_project = true;
            break;
          }
        }
        member.join_project = join_project;
      }

      // members.join_project 값이 true인 아이템들을 앞으로 정렬한다
      members.sort((a, b) => {
        if (a.join_project && !b.join_project) return -1;
        if (!a.join_project && b.join_project) return 1;
        return 0;
      });

      this.userList = members;
    },
    async loadMember(company_id) {
      const page = 1;
      const perPage = 100;
      await this.$store.dispatch("company/LOAD_MEMBER_LIST", { page, perPage, company_id });
      return JSON.parse(JSON.stringify(this.$store.state.company.memberList));
    },
    handleChangePage(page) {
      this.userTablePage = page;
    },
  }
}
</script>

<style scoped lang="scss">
.popupContainer {
  padding: 10px;
}

.fieldInfoContainer {
  > div {
    margin-bottom: 5px;
    font-size: 16px;

    .field-info-label, span:first-child {
      font-weight: bold;
    }
  }
}

.directorTable {
  thead th, tbody td {
    padding: 14px;
    border-bottom: 1px solid #cdcdcd;
    font-size: 14px;
    text-align: center;
  }

  thead th {
    border-top: 1px solid #cdcdcd;
    background-color: #f9f9f9;
    font-weight: 500;
  }

  tbody td {

  }
}

.userTable {
  thead th, tbody td {
    padding: 10px 16px;
    font-size: 14px;
    text-align: center;
  }
}
</style>
