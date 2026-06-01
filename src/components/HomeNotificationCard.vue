<template>
  <vx-card style="min-width: 0px !important">
    <div class="flex justify-between items-center gap-3">
      <!-- 농협네트웍스 안전·보건 경영 시스템 -->
      <div class="font-bold" style="font-size: 14px; display: grid; grid-template-columns: auto 1fr; align-items: center">
        <i class="dot"></i>
        <ml-input v-if="isModify" v-model="value0" style="width: auto" />
        <span v-else> {{ values && values.value0 ? values.value0 : "안전·보건 경영 시스템" }}</span>
      </div>
      <div class="flex-1 flex justify-end items-center gap-2">
        <vs-button v-if="disabled === false" class="small" color="secondary" @click="onClick">{{ isModify ? "저장" : "편집" }}</vs-button>
        <vs-button v-if="isModify" class="small ml-2" type="border" color="secondary" @click="onClickCancel"> 취소 </vs-button>
      </div>
    </div>
    <div>
      <ul class="labels">
        <li>
          <div class="title">제·개정일자</div>
          <div class="contents">
            <ml-input v-if="isModify" v-model="value1" />
            <span v-else> {{ values && values.value1 ? values.value1 : "작성된 내용이 없습니다." }}</span>
          </div>
        </li>
        <li>
          <div class="title">문서번호</div>
          <div class="contents">
            <ml-input v-if="isModify" v-model="value2" />
            <span v-else> {{ values && values.value2 ? values.value2 : "작성된 내용이 없습니다." }}</span>
          </div>
        </li>
        <li>
          <div class="title">개정번호</div>
          <div class="contents">
            <ml-input v-if="isModify" v-model="value3" />
            <span v-else> {{ values && values.value3 ? values.value3 : "작성된 내용이 없습니다." }}</span>
          </div>
        </li>
        <li>
          <div class="title">주관부서</div>
          <div class="contents">
            <ml-input v-if="isModify" v-model="value4" />
            <span v-else> {{ values && values.value4 ? values.value4 : "작성된 내용이 없습니다." }}</span>
          </div>
        </li>
      </ul>
    </div>
  </vx-card>
</template>

<script>
export default {
  name: "HomeNotificationCard",
  props: {
    title: String,
    disabled: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    values() {
      return this.$store.state.keyValue.homeNotification;
    },
  },
  data() {
    return {
      isModify: false,
      value0: "",
      value1: "",
      value2: "",
      value3: "",
      value4: "",
    };
  },
  mounted() {
    this.loadData();
  },
  methods: {
    async loadData() {
      await this.$store.dispatch("keyValue/LOAD_HOME_NOTIFICATION");
    },
    async onClick() {
      if (this.isModify) {
        const value0 = this.value0.trim();
        const value1 = this.value1.trim();
        const value2 = this.value2.trim();
        const value3 = this.value3.trim();
        const value4 = this.value4.trim();
        await this.$store.dispatch("keyValue/SAVE_HOME_NOTIFICATION", { config: { value0, value1, value2, value3, value4 } });
      } else if (this.values) {
        this.value0 = this.values.value0;
        this.value1 = this.values.value1;
        this.value2 = this.values.value2;
        this.value3 = this.values.value3;
        this.value4 = this.values.value4;
      }
      this.isModify = !this.isModify;
    },
    onClickCancel() {
      this.isModify = false;
      this.value0 = this.values.value0 ? this.values.value0 : "";
      this.value1 = this.values.value1 ? this.values.value1 : "";
      this.value2 = this.values.value2 ? this.values.value2 : "";
      this.value3 = this.values.value3 ? this.values.value3 : "";
      this.value4 = this.values.value4 ? this.values.value4 : "";
    },
  },
};
</script>

<style scoped>
.labels li {
  display: flex;
  padding-left: 16px;
  padding-top: 4px;
  padding-bottom: 4px;
  align-items: center;
}
.labels li .title {
  width: 100px;
}
</style>
