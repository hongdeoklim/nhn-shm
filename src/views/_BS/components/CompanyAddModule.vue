<template>
  <div class="grid grid-cols-12 gap-x-10 mt-8 mb-5">
    <div class="col-span-12">
      <div class="flex items-center justify-between">
        <p class="title">하도급업체 현황</p>
        <div class="flex" v-if="!isPrint && hasAdminPermission">
          <vs-button color="secondary" @click="openPopup">추가</vs-button>
          <vs-button v-if="!!selectCompany.com_name" color="secondary" class="ml-4" type="border" @click="removeCompany">삭제</vs-button>
        </div>
      </div>
      <vs-table v-model="selectCompany" @selected="handleSelected" :data="companyList" class="table-list mt-5">
        <template slot="thead">
          <vs-th style="width: 100px">No.</vs-th>
          <vs-th style="width: 20%">구분</vs-th>
          <vs-th style="width: 20%">업체명</vs-th>
          <vs-th style="width: 20%">대표자</vs-th>
          <vs-th style="width: 20%">담당자</vs-th>
          <vs-th style="width: 20%">주소</vs-th>
        </template>

        <template slot-scope="{ data }">
          <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
            <vs-td>{{ indextr + 1 }}</vs-td>
            <vs-td>{{ data[indextr].com_type }}</vs-td>
            <vs-td>{{ data[indextr].com_name }}</vs-td>
            <vs-td>{{ data[indextr].com_ceo }}</vs-td>
            <vs-td>{{ data[indextr].director }}</vs-td>
            <vs-td>{{ data[indextr].com_address }}</vs-td>
          </vs-tr>
          <div></div>
        </template>
      </vs-table>
      <vs-col>
        <div class="vs-con-table">
          <div class="con-pagination-table vs-table--pagination">
            <k-pagination
              :total="(page.lastPage) ? page.lastPage : 0"
              v-model="page.current" @change="handleChangePage"></k-pagination>
          </div>
        </div>
      </vs-col>
    </div>
    <div class="col-span-12" v-if="!isPrint">
      <div class="flex items-center justify-between">
        <p class="title">상세정보</p>
      </div>
      <div class="mt-5">
        <div class="grid grid-cols-12 gap-x-6 gap-y-4">
          <!-- <div class="col-span-4 flex items-center">
            <search-nav-item-select
              class="search-item"
              label="구분"
              v-model="selectCompany.com_type"
              :list="comTypes"
              :readonly="true"
            />
          </div> -->
          <!-- <div class="col-span-4 flex items-center">
            <div class="label-text mr-4">계약번호(하도급업체)</div>
            <ml-input
              class="w-full flex-1"
              :readonly="true"
              :value="selectCompany.contract_number"
            />
          </div> -->
          <div class="col-span-4 flex items-center">
            <div class="label-text mr-4">업체명</div>
            <ml-input class="w-full flex-1" :readonly="true" :value="selectCompany.com_name"/>
          </div>
          <div class="col-span-4 flex items-center">
            <div class="label-text mr-4">대표자</div>
            <ml-input class="w-full flex-1" :readonly="true" :value="selectCompany.com_ceo"/>
          </div>
          <div class="col-span-4 flex items-center">
            <div class="label-text mr-4">사업자등록번호</div>
            <ml-input class="w-full flex-1" :readonly="true" :value="selectCompany.com_number"/>
          </div>
          <div class="col-span-4 flex items-center">
            <div class="label-text mr-4">주소</div>
            <ml-input class="w-full flex-1" :readonly="true" :value="selectCompany.com_address"/>
          </div>
          <div class="col-span-4 flex items-center">
            <div class="label-text mr-4">업태</div>
            <ml-input class="w-full flex-1" :readonly="true" :value="selectCompany.com_business_class"/>
          </div>
          <div class="col-span-4 flex items-center">
            <div class="label-text mr-4">업종</div>
            <ml-input class="w-full flex-1" :readonly="true" :value="selectCompany.com_business_type"/>
          </div>
          <!-- <div class="col-span-4 flex items-center">
            <div class="label-text mr-4">사업기간</div>
            <search-nav-start-end class="w-full flex-1 input-se" label="" v-model="selectCompany.inputA_4" :readonly="true" />
          </div> -->
          <div class="col-span-4 flex items-center">
            <div class="label-text mr-4">담당자</div>
            <ml-input class="w-full flex-1" :readonly="true" :value="selectCompany.director"/>
          </div>
          <!-- <div class="col-span-4 flex items-center">
            <div class="label-text mr-4">FAX</div>
            <ml-input class="w-full flex-1" :readonly="true" :value="selectCompany.fax"/>
          </div> -->
          <div class="col-span-4 flex items-center">
            <div class="label-text mr-4">연락처</div>
            <ml-input class="w-full flex-1" :readonly="true" :value="selectCompany.phone"/>
          </div>
          <!-- <div class="col-span-4 flex items-center">
            <div class="label-text mr-4">이메일</div>
            <ml-input class="w-full flex-1" :readonly="true" :value="selectCompany.email"/>
          </div> -->
        </div>
      </div>
    </div>

    <popup-search-company v-model="showPopup" @handleClickSelect="handleClickSelect" />
  </div>
</template>

<script>
import PopupSearchCompany from "@/popup/PopupSearchCompany";
import SearchNavItemSelect from "@/components/nav/SearchNavItemSelect";
import SearchNavStartEnd from "@/components/nav/SearchNavStartEnd.vue";
import KPagination from '@/components/kPagination/kPagination.vue'
export default {
  name: "CompanyAddModule",
  components: {
    KPagination,
    SearchNavStartEnd,
    SearchNavItemSelect,
    PopupSearchCompany,
  },
  props: {
    title: {
      type: String,
      default: () => {
        return "";
      },
    },
    value: {
      type: Array,
      default: () => {
        return [];
      },
    },
    isPrint: Boolean,
    hasAdminPermission: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    companyList () {
      const first = (this.page.current - 1) * this.page.perPage
      return this.realCompanyList.slice(first, first + this.page.perPage)
    }
  },
  watch: {
    realCompanyList (list) {
      this.page.lastPage = Math.floor((list.length - 1) / this.page.perPage) + 1
    },
    value(data) {
      this.realCompanyList = this.value;
    },
  },
  data() {
    return {
      page: {
        lastPage: 1,
        current: 1,
        perPage: 5
      },
      showPopup: false,
      nav: {
        selects: [
          {
            text: "1",
            value: "1",
          },
        ],
      },
      selectCompany: {},
      realCompanyList: this.value,
      comTypes: [
        {
          text: "본청",
          value: "본청",
        },
        {
          text: "도급",
          value: "도급",
        },
        {
          text: "용역",
          value: "용역",
        },
        {
          text: "위탁",
          value: "본청",
        },
        {
          text: "기타",
          value: "기타",
        },
      ],
    };
  },
  methods: {
    openPopup() {
      this.showPopup = true;
    },
    handleSelected() {
      this.$emit("selected", this.selectCompany);
    },
    handleClickSelect(company) {
      if (this.findCompanyIndex(company) <= -1) {
        this.realCompanyList.push(company);
      }
    },
    findCompanyIndex(company) {
      let i = 0;
      for (i = 0; i < this.realCompanyList.length; i++) {
        const com = this.realCompanyList[i];
        if (com.id === company.id) {
          return i;
        }
      }
      return -1;
    },
    removeCompany() {
      if (this.selectCompany && this.selectCompany.id) {
        const index = this.findCompanyIndex(this.selectCompany);
        if (index >= 0) {
          const company = this.realCompanyList[index];
          this.realCompanyList.splice(index, 1);

          this.$emit("remove", company);
          this.selectCompany = {};
        }
      }
    },
    handleChangePage (page) {
      this.page.current = page
    }
  },
};
</script>

<style scoped lang="scss">
.title {
  font-weight: 500;
  font-size: 16px;
  height: 17px;
  line-height: 17px;
  position: relative;
  padding-left: 12px;
  &::before {
    content: "";
    width: 8px;
    height: 8px;
    background: #7e72f2;
    display: block;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: -8px;
    border-radius: 100%;
  }
}
.title-n {
  font-weight: 500;
  font-size: 16px;
  height: 17px;
  line-height: 17px;
}
.label-text {
  width: 114px;
  font-weight: 500;
  font-size: 14px;
}
.size-search {
  width: 200px;
}
.input-se {
  width: 100%;
  &::v-deep .start-end-title {
    width: 114px;
    font-weight: 500;
    font-size: 14px;
    justify-content: flex-start;
  }
  &::v-deep .mr-2 {
    flex: 1;
    margin-right: 10px !important;
  }
  &::v-deep .mr-2 + .mr-2 {
    margin-right: 0 !important;

    &::before {
      content: "~";
      margin-right: 10px;
    }
  }
  &::v-deep .inline-block {
    width: 100% !important;
  }
}
.vs-table-primary .is-selected {
  background: rgba(126, 114, 242, 0.6) !important;
  color: white;
}
.search-item {
  width: 100% !important;
  margin: 0 !important;
  &::v-deep > div:first-child {
    width: 114px !important;
    font-weight: 500;
    font-size: 14px;
  }
  &::v-deep > div:last-child {
    flex: 1 !important;
    .con-select {
      width: 100%;
    }
  }
}
.upload-img {
  width: 100%;
  height: 318px !important;
  margin-top: 22px;
}
.table-list::v-deep {
  .vs-con-tbody {
    border: none;
    border-top: solid 2px #f9f9f9;
    border-bottom: solid 2px #f9f9f9;
  }
  th .vs-table-text {
    justify-content: center;
  }
  td {
    text-align: center;
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
</style>
