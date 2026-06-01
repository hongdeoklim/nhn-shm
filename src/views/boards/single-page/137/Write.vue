<template>
  <div>
    <!--기본정보-->
    <field-select-module v-model="form.stdInfo" :board="this.board" :is-print="isPrint" :options="[{ type: 'date', label: '계획일' }]" />

    <!--관리자 그룹-->
    <table-inspection-group class="mt-5" title="점검 담당자 그룹" :list="form.group1" @updateList="updateGroupList" :isPrint="isPrint" :isReadonly="board.readonly" />

    <!--파일첨부-->
    <file-upload-module :readonly="board.readonly" v-model="form.fileList" class="mt-5" :is-print="isPrint" />
  </div>
</template>

<script>
import FieldSelectModule from "@/views/modules/FieldSelectModule";
import TableInspectionGroup from "@/components/TableInspectionGroup";
import FileUploadModule from "@/views/modules/FileUploadModule.vue";
import VueCookie from "vue-cookie";

export default {
  components: {
    FieldSelectModule,
    TableInspectionGroup,
    FileUploadModule,
  },
  props: {
    isPrint: Boolean,
    board: Object,
    value: Object,
  },
  watch: {
    value: {
      immediate: true,
      deep: true,
      handler(value) {
        const keys = Object.keys(this.form);
        for (const key of keys) {
          this.form[key] = value[key];
        }
      },
    },
    form: {
      immediate: true,
      deep: true,
      handler(value) {
        this.$emit("input", value);
      },
    },
  },
  data() {
    return {
      form: {
        stdInfo: {},
        group1: [],
        fileList: [],
      },
      date: "",
    };
  },
  computed: {
    projectId() {
      return parseInt(this.$route.params.proj_id);
    },
  },
  created() {
    this.date = VueCookie.get("list137_selectday");
    this.initBreadcrumb();
  },
  methods: {
    updateGroupList(list) {
      this.form.group1 = list;
    },
    initBreadcrumb() {
      if (this.projectId === 5) {
        this.$store.commit("menu/UPDATE_PAGE_LIST", [{ title: "Home" }, { title: "안전보건 점검 계획" }, { title: "시설물 안전점검 계획", active: true }]);
      }
    },
  },
};
</script>

<style scoped></style>
