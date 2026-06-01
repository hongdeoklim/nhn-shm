<template>
  <div>
    <!--기본정보-->
    <field-select-module class="mb-6" v-model="form.stdInfo" :board="this.board" :is-print="isPrint" title="작성자 정보" :types="['department', 'com_name', 'rank', 'writer_name', 'date']" />
    <!--    부서정보-->
    <div class="mb-6">
      <h5 class="mb-4">
        <i class="dot"></i>부서정보
        <span class="ml-2" style="font-weight: 400; font-size: 14px; color: #696d71">※ 입력된 부서는 작성자 부서의 하위부서로 등록이 됩니다.</span>
      </h5>
      <div class="grid grid-cols-12 gap-x-6 gap-y-4">
        <div class="col-span-4 items-center" style="display: grid; grid-template-columns: 110px 1fr">
          <div class="label-text mr-4">분야</div>
          <project-selector v-model="form.projectId" class="w-full flex-1" :isPrint="isPrint" :readonly="!!postId" @select="handleProjectChange" />
        </div>
        <div class="col-span-4 items-center" style="display: grid; grid-template-columns: 110px 1fr">
          <div class="label-text mr-4">부서명</div>
          <span v-if="isPrint" class="print-input"> {{ form.companyId }} </span>
          <vs-select v-else class="w-full" :readonly="!!postId" autocomplete v-model="form.companyId">
            <vs-select-item v-for="(item, index) in this.headquarters" :key="index" :text="item.com_name" :value="item.id" />
          </vs-select>
        </div>
      </div>
      <div class="col-span-12 items-center mt-4" style="display: grid; grid-template-columns: 110px 1fr">
        <div class="label-text mr-4">담당현장</div>
        <span v-if="isPrint" class="print-input"> {{ form.fieldNames }} </span>
        <multiselect v-else :disabled="!!postId" :options="fieldNameList" v-model="form.fieldNames" :multiple="true" placeholder="" selectLabel="" deselectLabel="" :showNoResults="false">
          <template slot="option" slot-scope="props">
            <div>{{ props.option }}</div>
          </template>
        </multiselect>
      </div>
      <div class="col-span-12 items-start mt-4" style="display: grid; grid-template-columns: 110px 1fr">
        <div class="label-text mr-4">내용</div>
        <span v-if="isPrint" class="print-textarea"> {{ form.description }} </span>
        <ml-textarea v-else class="flex-1 w-full" rows="5" v-model="form.description" :readonly="board.readonly" />
      </div>
    </div>

    <!--    시스템 사용자 정보-->
    <div class="mb-6">
      <div class="flex" style="align-items: center">
        <h5 class="mb-4">
          <i class="dot"></i>시스템 사용자 정보
          <span class="ml-2" style="font-weight: 400; font-size: 14px; color: #696d71">※ 입력 즉시 ID가 생성되며, 참여 종료일이 지난 즉시 접속이 차단됩니다.</span>
        </h5>
        <div v-if="!postId" class="ml-auto">
          <vs-button class="ml-4" color="secondary" @click="addUser"> 항목추가 </vs-button>
          <vs-button class="ml-4" color="secondary" type="border" @click="removeUser"> 선택삭제 </vs-button>
        </div>
      </div>
      <div class="mt-6 user-grid">
        <div class="head" @click.stop="handleClickUserAll"><vs-checkbox :checked="userAllCheck" /></div>
        <div class="head">No.</div>
        <div class="head">사용자명</div>
        <div class="head">사용자 ID</div>
        <div class="head">비밀번호</div>
        <div class="item">연락처</div>
        <div class="head">이메일</div>
        <div class="head">참여기간</div>
      </div>
      <div class="user-grid" v-for="(user, uIndex) in form.userList">
        <div class="item"><vs-checkbox class="w-full" v-model="user.is_checked" /></div>
        <div class="item">{{ uIndex + 1 }}</div>
        <div class="item"><ml-input class="w-full" v-model="user.name" /></div>
        <div class="item">
          <div style="position: relative; text-align: left">
            <ml-input class="w-full" v-model="user.username" :disabled="!!postId" @focusout="handleFocusout('username', user, uIndex)" />
            <span v-if="user.error.username" style="color: #ea5455">{{ user.error.username_message }}</span>
            <div v-if="user.error.username" class="p-3" style="position: absolute; top: 0; right: 0">
              <img :src="require('@/assets/icons/error.svg')" />
            </div>
          </div>
        </div>
        <div class="item">
          <div style="position: relative; text-align: left">
            <ml-input class="w-full" type="password" v-model="user.password" @focusout="handleFocusout('password', user, uIndex)" />
            <span v-if="user.error.password" style="color: #ea5455">{{ user.error.password_message }}</span>
            <div v-if="user.error.password" class="p-3" style="position: absolute; top: 0; right: 0">
              <img :src="require('@/assets/icons/error.svg')" />
            </div>
          </div>
        </div>
        <div class="item"><ml-input class="w-full" v-model="user.phone" /></div>
        <div class="item">
          <ml-input class="w-full" v-model="user.email" :disabled="!!postId" @focusout="handleFocusout('email', user, uIndex)" />
          <!-- <div style="position: relative; text-align: left">
            <span v-if="user.error.email" style="color: #ea5455">{{ user.error.email_message }}</span>
            <div v-if="user.error.email" class="p-3" style="position: absolute; top: 0; right: 0">
              <img :src="require('@/assets/icons/error.svg')" />
            </div>
          </div> -->
        </div>
        <div class="item">
          <date-selector v-model="user.startDate" />
          <span class="mx-2">~</span>
          <date-selector v-model="user.endDate" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FieldSelectModule from "@/views/modules/FieldSelectModule";
import DateSelector from "@/components/selector/DateSelector";
import FileUploader from "@/components/FileUploader";
import FileUploadModule from "@/views/modules/FileUploadModule";
import CompanySelector from "@/components/selector/CompanySelector.vue";
import FieldSelector from "@/components/selector/FieldSelector.vue";
import TimeSelector from "@/components/selector/TimeSelector.vue";
import ProjectSelector from "@/components/selector/ProjectSelector.vue";
import Multiselect from "vue-multiselect";

export default {
  components: {
    ProjectSelector,
    TimeSelector,
    FieldSelector,
    CompanySelector,
    FieldSelectModule,
    FileUploadModule,
    FileUploader,
    DateSelector,
    Multiselect,
  },
  props: {
    isPrint: Boolean,
    board: Object,
    value: Object,
  },
  computed: {
    postId() {
      return this.$route.params.postId;
    },
    userAllCheck() {
      let all = this.form.userList.length > 0;
      for (const user of this.form.userList) {
        if (!user.is_checked) all = false;
      }
      return all;
    },
    headquarters() {
      return this.$store.state.company.headquarters;
    },
    fieldList() {
      if (this.$store.state.project.fieldListInfo.data) {
        return this.$store.state.project.fieldListInfo.data;
      }
      return [];
    },
    fieldNameList() {
      if (this.$store.state.project.fieldListInfo.data) {
        const list = [];
        for (const field of this.$store.state.project.fieldListInfo.data) {
          list.push(field.field_name);
        }

        return list;
      }

      return [];
    },
  },
  watch: {
    value: {
      important: true,
      deep: true,
      handler(value) {
        const keys = Object.keys(this.form);
        for (const key of keys) {
          if (value[key]) {
            this.form[key] = value[key];
          }
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
    "form.fieldNames": {
      immediate: true,
      deep: true,
      handler(value) {
        const fields = [];
        if (this.form.fieldNames.length > 0) {
          for (const fieldName of this.form.fieldNames) {
            const field = this.fieldList.find((e) => e.field_name === fieldName);
            if (field && field.id) {
              fields.push(field.id);
            }
          }
        }
        this.form.fields = fields;
      },
    },
    EnableSave: {
      immediate: true,
      handler() {
        this.$emit("EnableSave", this.EnableSave);
      },
    },
  },
  data() {
    return {
      EnableSave: true,
      form: {
        // 기본정보
        stdInfo: {},

        // 분야
        projectId: "",

        // 부서
        companyId: "",

        // 담당현장
        fieldNames: "",
        fields: [],

        // 내용
        description: "",

        userList: [],
        fileList: [],
      },
    };
  },
  mounted() {
    this.loadCompany();
  },
  methods: {
    loadCompany() {
      this.$store.dispatch("company/HEAD_QUARTERS");
    },

    async loadFieldList() {
      const projectId = this.form.projectId;
      const page = 1;
      const perPage = 1000;

      await this.$store.dispatch("project/LOAD_FIELD_LIST", { projectId, page, perPage, showAll: 'true' });
    },
    formCheck() {
      this.EnableSave = true;
      if (!this.postId && this.form.userList.length > 0) {
        for (const user of this.form.userList) {
          // 필수입력
          if (!user.username) {
            user.error.username = true;
            user.error.username_message = "사용자 ID를 입력하세요.";
            this.EnableSave = false;
          }
          if (!user.password) {
            user.error.password = true;
            user.error.password_message = "비밀번호를 입력하세요.";
            this.EnableSave = false;
          }
          if (!user.email) {
            user.error.email = true;
            user.error.email_message = "이메일을 입력하세요.";
            this.EnableSave = false;
          }
        }
      } else {
        this.EnableSave = true;
      }
    },
    async handleFocusout(dataName, user, index) {
      if (this.postId) {
      } else {
        //CHECK_EXIST
        if (dataName === "username") {
          // username
          if (user.username) {
            await this.$store.dispatch("CHECK_EXIST", { username: user.username }).then((value) => {
              if (value.isEmpty === true) {
                user.error.username = false;
                user.error.username_message = "";
              } else {
                user.error.username = true;
                user.error.username_message = "이미 사용중인 ID입니다.";
              }
            });
          } else {
            user.error.username = false;
            user.error.username_message = "";
          }
        }

        // password
        else if (dataName === "password") {
          if (user.password) {
            user.error.password = false;
            user.error.password_message = "";
          } else {
            user.error.password = true;
            user.error.password_message = "비밀번호를 입력하세요.";
          }
        }

        // email
        else if (dataName === "email") {
          if (user.email) {
            await this.$store.dispatch("CHECK_EXIST", { email: user.email }).then((value) => {
              if (value.isEmpty === true) {
                user.error.email = false;
                user.error.email_message = "";
              } else {
                user.error.email = true;
                user.error.email_message = "이미 사용중인 이메일 입니다.";
              }
            });
          } else {
            user.error.email = true;
            user.error.email_message = "이메일을 입력하세요.";
          }
        }
      }

      this.formCheck();
    },
    handleClickUserAll() {
      if (this.userAllCheck) {
        for (const user of this.form.userList) {
          user.is_checked = false;
        }
      } else {
        for (const user of this.form.userList) {
          user.is_checked = true;
        }
      }
    },
    handleProjectChange(project) {
      this.loadFieldList();
    },
    handleCompanyChange(company) {
      this.form.company = company;

      this.form.inputA_3 = company.com_ceo; // 대표자
      this.form.inputA_4 = company.com_number; // 사업자등록번호
      this.form.inputA_5 = company.com_address; // 사업자등록주소
      this.form.inputA_6 = company.com_business_type; // 업태
      this.form.inputA_7 = company.com_business_class; // 업종
      this.form.inputA_8 = company.director; // 담당자
      this.form.inputA_9 = company.phone; // 연락처
      this.form.inputA_10 = company.file ? company.file : {}; // 사업자등록증
      this.form.inputA_11 = company.etc; // 기타
    },
    addUser() {
      this.form.userList.push({
        name: "",
        username: "",
        password: "",
        phone: "",
        email: "",
        startDate: "",
        endDate: "",
        is_checked: false,

        error: {
          username: false,
          username_message: "",
          password: false,
          password_message: "",
          email: false,
          email_message: "",
        },
      });

      this.formCheck();
    },
    removeUser() {
      for (let i = 0; i < this.form.userList.length; i++) {
        if (this.form.userList[i].is_checked) {
          this.form.userList.remove(this.form.userList[i]);
          i = -1;
        }
      }
    },
  },
};
</script>

<style scoped lang="scss">
$border: 1px solid #cdcdcd;
.label-text {
  width: 114px;
  font-weight: 500;
  font-size: 14px;
  padding-right: 16px;
}

.mt-component-form {
  margin-top: 15px;
}

/* uploaded File */
.h-upload {
  height: 470px;
}

.upload-content {
  border: $border;

  &:last-child {
    border-left: none;
  }

  &__title {
    height: 54px;
    line-height: 54px;
    text-align: center;
    background: #fafafa;
    border-bottom: $border;
  }

  &__input {
    height: 54px;
    background: #f9f9f9;
    border-top: $border;
    padding: 5px 15px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__file {
    height: calc(100% - 54px);
    width: 100%;
    padding: 14px;
  }
}

.user-grid {
  display: grid;
  grid-template-columns: 40px 50px 1fr 1fr 1fr 1fr 1fr 2fr;
  column-gap: 12px;

  justify-content: center;
  align-items: center;
  text-align: center;

  border-top: 1px solid #cdcdcd;

  .head,
  .item {
    display: flex;
    justify-content: center;
    align-items: center;
    padding-top: 8px;
    padding-bottom: 8px;
  }
}
.user-grid:last-child {
  border-bottom: 1px solid #cdcdcd;
}
</style>
