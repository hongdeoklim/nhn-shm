<template>
  <vs-popup class="popupSearchField" title="현장변경" :active.sync="showPopup">
    <div class="popupContainer">
      <!-- search -->
      <search-nav @handleSearch="onClickSearch">
        <search-nav-item-keyword v-model="nav.keyword"/>
      </search-nav>

      <!-- list -->
      <div>
        <vs-table
          class="pb-wide"
          color="success"
          style="min-width:100%; width:auto;"

          ref="table"
          :sst="true"
          :data="list"
          no-data-text=""
          @selected="onClickDetail"
        >
          <template slot="thead">
            <vs-th> <span class="w-full text-center">No.</span> </vs-th>
            <vs-th> <span class="w-full text-center">현장명</span> </vs-th>
            <vs-th> <span class="w-full text-center">주소</span> </vs-th>
            <vs-th> <span class="w-full text-center">사업기간</span> </vs-th>
            <vs-th><span class="w-full text-center"> 사업금액</span> </vs-th>
          </template>

          <template slot-scope="{ data }">
            <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data"
                   :class="(selectedField && selectedField.id === tr.id) ? 'active' : ''">
              <vs-td> <div class="w-full text-center">{{ indextr +1 }}</div> </vs-td>
              <vs-td> <div class="w-full text-center">{{ tr.field_name }}</div> </vs-td>
              <vs-td> <div class="w-full text-center">{{ tr.address }}</div> </vs-td>
              <vs-td> <div class="w-full text-center">{{ tr.start_work_at }} ~ {{ tr.be_completed_at }}</div> </vs-td>
              <vs-td> <div class="w-full text-center">{{ tr.deposit_amount | comma }}</div> </vs-td>
            </vs-tr>
          </template>

        </vs-table>
        <!--페이지네이션-->
        <div class="vs-con-table" >
          <div class="con-pagination-table vs-table--pagination">
            <k-pagination :total="lastPage" :max-items="5" v-model="page" @change="onChangePage"></k-pagination>
          </div>
        </div>
      </div>

      <!-- foot-->
      <div class="flex justify-end">
        <vs-button class="mr-4" color="#DCDFE2" style="color: #3C3C3C" @click="showPopup = false">닫기</vs-button>
        <vs-button class="" color="secondary" @click="onClickSave">변경</vs-button>
      </div>
    </div>
  </vs-popup>
</template>
<script>
import KPagination from "@/components/kPagination/kPagination.vue";
import SearchNav from "@/components/nav/SearchNav.vue";
import SearchNavItemKeyword from "@/components/nav/SearchNavItemKeyword.vue";

export default {
  name: "FieldSelectPopup",
  components: {SearchNavItemKeyword, SearchNav, KPagination},
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
  computed: {
    projectId() {
      return this.$route.params.proj_id;
    },
    showPopup: {
      get() {
        return this.active;
      },
      set(value) {
        this.$emit('update:active', value);
      }
    },

    memberInfo() {
      return this.$store.state.member.memberInfo;
    },
    /**
     * 사용자가 현재 프로젝트에서 선택하고 있는 현장의 ID를 반환합니다.
     */
    selectedFieldId() {
      const metaKey = `selected_field_${this.projectId}`;

      if (this.memberInfo && this.memberInfo.meta) {
        const metaValue = this.memberInfo.meta[metaKey];
        if (metaValue) {
          return JSON.parse(metaValue).id;
        }
      }

      return null;
    },
  },
  data() {
    return {
      nav: {
        keyword: '',
      },
      list: [],
      lastPage: 1,
      page: 1,
      selectedField: null,
    }
  },
  created() {
  },
  watch: {
    active(value) {
      this.showPopup = value;

      if (value) {
        this.loadFieldList();
      } else {
        this.selectedField = null;
      }
    },
    showPopup(value) {
      this.$emit('update:active', value);
    },
  },
  methods: {
    async loadFieldList() {
      const projectId = this.projectId;
      const page = this.page;
      const perPage = 10;
      const code = 'workplace-ordering';
      const params = {
        keyword: this.nav.keyword,
      };

      const options = { projectId, code, page, perPage, ...params }

      if (JSON.stringify(options) === JSON.stringify(this.apiLastLoadOptions)) {
        // 이전과 동일한 옵션으로 리스트를 불러옵니다.
        return;
      }
      this.apiLastLoadOptions = JSON.parse(JSON.stringify(options));
      await this.$store.dispatch("project/LOAD_FIELD_LIST", options);

      const fieldListInfo = this.$store.state.project.fieldListInfo;
      this.list = fieldListInfo.data;
      this.page = fieldListInfo.current_page;
      this.lastPage = fieldListInfo.last_page;
    },


    onClickSearch () {
      this.loadFieldList();
    },
    onClickDetail (field) {
      this.selectedField = field;
    },
    onChangePage (page) {
      this.page = page;
      this.loadFieldList();
    },
    onClickSave () {
      this.$emit("select", this.selectedField);
      this.showPopup = false;
    },
  }
}
</script>

<style scoped lang="scss">
.vs-con-tbody .tr-values.active {
  background: #7E72F299 !important;
  color: #fff;
  font-width: bold;
}
</style>
