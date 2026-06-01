<template>
  <div>
    <vs-tabs v-if="1 < tabList.length || showOneTab" :value="currentTabIndex">
      <vs-tab v-for="(tab, tabIndex) in tabList" :key="`tab_${tab.label}`" :label="tab.label" @click="moveTab(tabIndex, tab)"></vs-tab>
    </vs-tabs>

    <!-- list -->
    <div v-if="tab && tab.pageType === 'list'">
      <component
        v-if="tab.component"
        :is="tab.component"
        :fieldCode="fieldCode"
        :tab="tab"
        :projectId="projectId"
        @moveCreate="onClickMoveCreate"
        @moveUpdate="onClickMoveUpdate"
      />
      <fields-list
        v-else
        :fieldCode="fieldCode"
        :tab="tab"
        :projectId="projectId"
        @moveCreate="onClickMoveCreate"
        @moveUpdate="onClickMoveUpdate"
      >
        <template v-slot:top-buttons>
          <!-- 목록 상단에 신규작성 버튼 등을 커스텀 개발하려면 여기에 코드를 넣으면 된다.-->
        </template>
      </fields-list>
    </div>

    <!-- write -->
    <div v-if="tab && tab.pageType === 'write'">
      <component v-if="tab.component" :is="tab.component"
                 @save="onClickSave"
                 @delete="onClickDelete"
                 @moveList="onClickMoveList"
      />
    </div>

    <div v-if="tab && tab.pageType === 'excel-upload'">
      <component v-if="tab.component" :is="tab.component" />
    </div>

    <!-- info -->
    <div v-if="tab && tab.pageType === 'info'">
      <component v-if="tab.component" :is="tab.component" />
    </div>
  </div>
</template>

<script>
import tabItems from "@/views/fields/tab-items";
import breadcrumb from "@/views/fields/breadcrumb";
import includeSinglePage from "@/views/fields/single-page/include";
import TableListPage from "@/views/list/TableListPage.vue";

export default {
  components: {
    TableListPage,
    FieldsList: () => import('@/views/fields/FieldsList.vue'),
  },
  computed: {
    projectId() {
      return this.$route.params.proj_id;
    },
    fieldCode () {
      return this.$route.params.fieldCode ? this.$route.params.fieldCode : '';
    },
    fieldId () {
      return this.$route.params.fieldId ? this.$route.params.fieldId : '';
    },
    pageType () {
      return this.$route.params.pageType ? this.$route.params.pageType : '';
    },

    showOneTab () {
      try {
        return this.tab.showOneTab
      } catch (e) {
        return false;
      }
    },

    tab() {
      try {
        return this.tabList[this.currentTabIndex];
      } catch (e) {
        return null;
      }
    },

    singlePage () {
      const write = includeSinglePage.write;
      const list = includeSinglePage.list;
      const search = includeSinglePage.search;
      const excelUpload = includeSinglePage.excelUpload;
      const info = includeSinglePage.info;
      const options = includeSinglePage.options;
      return { list, write, search, 'excelupload':excelUpload, info, options }
    }
  },

  data () {
    return {
      tabItems,
      breadcrumb,
      currentTabIndex: 0,
      tabList: [],
    }
  },

  beforeMount() {
    this.initBreadcrumb();
    this.initTab();
  },

  methods: {
    initTab() {
      this.tabList = [];
      this.addTab(this.fieldCode);
      for (let i = 0; i<this.tabList.length; i++) {
        if (this.tabList[i].pageType === this.pageType) {
          this.currentTabIndex = i;
          break;
        }
      }
    },

    addTab(fieldCode) {
      const item = this.tabItems[fieldCode];
      if (item) {
        // 현재 위치가 write(update) 가 아닌 경우, 첫번째 탭은 항상 list 로 설정한다.
        const pageType = this.pageType === 'write' ? 'write' : 'list';
        const component = this.singlePage[pageType][`${fieldCode}_${pageType}`];
        const search = this.singlePage.search[`${fieldCode}_search`];
        const options = this.singlePage.options[`${fieldCode}_options`];
        this.tabList.push({ pageType, component, search, options, ...item, label: `${item.label} 등록` });

        // 엑셀 업로드
        if (item.useExcelUpload) {
          const pageType = 'excel-upload';
          const key = `${fieldCode}_excelupload`;
          const component = this.singlePage.excelupload[key];
          this.tabList.push({ pageType, component, ...item, label: `${item.label} 엑셀(FMS) 업로드` });
        }

        // 현황
        if (item.useInfo) {
          const pageType = 'info';
          const key = `${fieldCode}_info`;
          const component = this.singlePage.info[key];
          this.tabList.push({ pageType, component, ...item, label: `${item.label} 현황` });
        }
      }
    },

    initBreadcrumb() {
      const breadcrumb = [{ title: "Home" }];
      const key = this.$route.params.fieldCode;
      if (this.breadcrumb[key] && this.breadcrumb[key].length > 0) {
        breadcrumb.push(...this.breadcrumb[key]);
      }
      if (breadcrumb.length > 0) breadcrumb[breadcrumb.length - 1].active = true;

      this.$store.commit("menu/UPDATE_PAGE_LIST", breadcrumb);
    },

    // ======== Tab ======== //
    moveTab(index, tab) {
      if (index === this.currentTabIndex) return;

      const proj_id = this.projectId;
      const fieldCode = this.fieldCode;
      const fieldId = this.fieldId;
      const pageType = tab.pageType;
      if (fieldId) {
        this.$router.push({ name: `${pageType}|fields`, params: { proj_id, fieldCode, pageType, fieldId } });
      } else {
        this.$router.push({ name: `${pageType}|fields`, params: { proj_id, fieldCode, pageType } });
      }
    },

    // ======== LIST ======== //
    onClickMoveCreate () {
      this.$router.push({ name: 'write|fields', params: { proj_id: this.projectId, fieldCode: this.fieldCode, pageType: 'write' } });
    },
    onClickMoveUpdate (fieldId) {
      this.$router.push({ name: 'update|fields', params: { proj_id: this.projectId, fieldCode: this.fieldCode, pageType: 'write', fieldId } });
    },

    // ======== WRITE ======== //
    onClickSave(form) {
      if (this.fieldId) {
        // update
        const fieldId = this.fieldId;
        this.$store
          .dispatch("project/UPDATE_FIELD", {
            field_type: this.fieldCode,
            field_code: this.fieldCode,
            fieldId,
            ...form,
            company_member_join : true, // company_ids 값에 따라서, 해당 업체 소속 사용자를 전부 참여시킨다
          })
          .then((/*value*/) => {
            this.onClickMoveList();
          });
      } else {
        // create
        this.$store
          .dispatch("project/CREATE_FIELD", {
            field_type: this.fieldCode,
            field_code: this.fieldCode,
            ...form,
            company_member_join : true, // company_ids 값에 따라서, 해당 업체 소속 사용자를 전부 참여시킨다
          })
          .then((/*value*/) => {
            this.onClickMoveList();
          });
      }
    },
    onClickDelete(fieldId) {
      if (!confirm("삭제하시겠습니까?")) return;
      this.$store
        .dispatch("project/DELETE_FIELD", {
          fieldId,
        })
        .then((/*value*/) => {
          this.onClickMoveList();
        });
    },
    onClickMoveList () {
      this.$router.push({ name: 'list|fields', params: { proj_id: this.projectId, fieldCode: this.fieldCode } });
    },
  }
}
</script>

<style scoped>

</style>
