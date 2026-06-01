<template>
  <div>
    <!-- 기본정보 -->
    <field-select-module class="mb-6" v-model="form.stdInfo" :board="this.board" :is-print="isPrint" title="작성자 정보" :types="['project_name', 'department', 'com_name', 'rank', 'writer_name', 'date']" />

    <!-- 하도급업체 정보 -->
    <div class="mb-6">
      <h5 class="mb-4"><i class="dot"></i>하도급업체 정보</h5>
      <div class="writeGridContainer">
        <div>
          <div>현장명</div>
          <span v-if="isPrint" class="print-input"> {{ form.inputA_1 }} </span>
          <field-selector v-else :readonly="!!postId" :field-name="form.field.field_name" class="w-full flex-1" v-model="form.inputA_1" @select="handleFieldChange" />
        </div>
        <div>
          <div>업체명</div>
          <span v-if="isPrint" class="print-input"> {{ form.inputA_2 }} </span>
          <company-selector v-else :readonly="!!postId" class="w-full flex-1" v-model="form.inputA_2" :listOnly="false" :use-company-popup="true" @select="handleCompanyChange" />
        </div>
        <div>
          <div>대표자</div>
          <span v-if="isPrint" class="print-input"> {{ company.com_ceo }} </span>
          <ml-input v-else :readonly="true" class="w-full flex-1" v-model="company.com_ceo" />
        </div>
        <div>
          <div>사업자등록번호</div>
          <span v-if="isPrint" class="print-input"> {{ company.com_number | comNumber }} </span>
          <ml-input v-else :readonly="true" class="w-full flex-1" :value="company.com_number | comNumber" />
        </div>
        <div>
          <div>사업자등록주소</div>
          <span v-if="isPrint" class="print-input"> {{ company.com_address }} </span>
          <ml-input v-else :readonly="true" class="w-full flex-1" v-model="company.com_address" />
        </div>
        <div>
          <div>업태</div>
          <span v-if="isPrint" class="print-input"> {{ company.com_business_type }} </span>
          <ml-input v-else :readonly="true" class="w-full flex-1" v-model="company.com_business_type" />
        </div>
        <div>
          <div>업종</div>
          <span v-if="isPrint" class="print-input"> {{ company.com_business_class }} </span>
          <ml-input v-else :readonly="true" class="w-full flex-1" v-model="company.com_business_class" />
        </div>
        <div>
          <div>담당자</div>
          <span v-if="isPrint" class="print-input"> {{ company.director }} </span>
          <ml-input v-else :readonly="true" class="w-full flex-1" v-model="company.director" />
        </div>
        <div>
          <div>연락처</div>
          <span v-if="isPrint" class="print-input"> {{ company.phone }} </span>
          <ml-input v-else readonly class="w-full flex-1" :value="phoneHyphen(company.phone)" />
        </div>
        <div>
          <div>사업자등록증</div>
          <span v-if="isPrint" class="print-input"> {{ companyField.fileName || "" }} </span>
          <FileUploader v-else readonly class="flex-1 w-full" v-model="companyField" />
        </div>
        <div class="writeGridLineItem">
          <div>내용</div>
          <span v-if="isPrint" class="print-textarea"> {{ form.inputA_3 }} </span>
          <ml-textarea v-else class="flex-1 w-full" rows="5" v-model="form.inputA_3" :readonly="board.readonly" />
        </div>
      </div>
    </div>

    <!-- 시스템 사용자 정보 -->
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
      <div class="mt-6 user-grid" :class="projectId === 4 && 'grid-2'">
        <div class="head" @click.stop="handleClickUserAll"><vs-checkbox :checked="userAllCheck" /></div>
        <div class="head">No.</div>
        <div class="head">사용자명</div>
        <div class="head">사용자 ID</div>
        <div class="head">비밀번호</div>
        <div class="item">연락처</div>
        <div class="head">이메일</div>
        <div v-if="projectId === 4" class="head">부서</div>
        <div v-if="projectId === 4" class="head">직급</div>
        <div class="head">참여기간</div>
      </div>
      <div class="user-grid" :class="projectId === 4 && 'grid-2'" v-for="(user, uIndex) in form.userList">
        <div class="item"><vs-checkbox class="w-full" v-model="user.is_checked" /></div>
        <div class="item">{{ uIndex + 1 }}</div>
        <div class="item"><ml-input class="w-full" v-model="user.name" /></div>
        <div class="item">
          <div style="position: relative; text-align: left">
            <ml-input class="w-full" v-model="user.username" :disabled="postId" @focusout="handleFocusout('username', user, uIndex)" />
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
          <ml-input class="w-full" v-model="user.email" :disabled="postId" @focusout="handleFocusout('email', user, uIndex)" />
          <!-- <div style="position: relative; text-align: left">
            <span v-if="user.error.email" style="color: #ea5455">{{ user.error.email_message }}</span>
            <div v-if="user.error.email" class="p-3" style="position: absolute; top: 0; right: 0">
              <img :src="require('@/assets/icons/error.svg')" />
            </div>
          </div> -->
        </div>
        <div v-if="projectId === 4" class="item"><ml-input class="w-full" v-model="user.section" /></div>
        <div v-if="projectId === 4" class="item"><ml-input class="w-full" v-model="user.rank" /></div>
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
import HttpRequest from "@/util/HttpRequest";
import moment from "moment";

export default {
  components: {
    TimeSelector,
    FieldSelector,
    CompanySelector,
    FieldSelectModule,
    FileUploadModule,
    FileUploader,
    DateSelector,
  },
  props: {
    isPrint: Boolean,
    board: Object,
    value: Object,
  },
  computed: {
    projectId() {
      return parseInt(this.$route.params.proj_id);
    },
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
    companyField() {
      if (this.company && this.company.attachments) {
        const file = this.company.attachments.map((att) => {
          let sizeCheck = att.file_size;
          if (sizeCheck < 1000) sizeCheck = `${sizeCheck}B`;
          else if (sizeCheck < 1000000) sizeCheck = `${(sizeCheck * 0.001).toFixed(1)}KB`;
          else sizeCheck = `${(sizeCheck * 0.000001).toFixed(1)}MB`;

          return {
            id: att.id,
            fileName: att.file_name,
            fileSize: sizeCheck,
            path: att.path,
            thumb: att.path,
          };
        });
        return file.length > 0 ? file[0] : undefined;
      }

      return undefined;
    },
  },
  data() {
    return {
      EnableSave: true,
      form: {
        stdInfo: {},
        field: {},
        company: {},

        inputA_1: "",
        inputA_2: "",
        inputA_3: "",

        userList: [],

        fileList: [],
        createdAt: "",
      },

      company: {},
    };
  },
  watch: {
    "value": {
      important: true,
      deep: true,
      handler(value) {
        const keys = Object.keys(this.form);
        for (const key of keys) {
          if (value[key]) {
            this.form[key] = value[key];

            if (key === "createdAt") {
              this.form.stdInfo.date = moment(value[key]).format("YYYY-MM-DD");
            }
          }
        }
      },
    },
    "form": {
      immediate: true,
      deep: true,
      handler(value) {
        if (this.form.inputA_1 && this.form.inputA_2) {
          this.$emit("saveButtonControl", true);
        } else {
          this.$emit("saveButtonControl", false);
        }
        this.$emit("input", value);
      },
    },
    "form.company": {
      immediate: true,
      deep: true,
      handler(value) {
        if (value.id) {
          this.loadCompany();
        }
      },
    },
    "EnableSave": {
      immediate: true,
      handler() {
        this.$emit("EnableSave", this.EnableSave);
      },
    },
  },
  mounted() {
    this.addUser();
    this.checkHasPermission();
  },
  methods: {
    /**
     * 관리자 권한이 있는 계정에서만 하도급 업체를 생성할 수 있다.
     * 만약 권한이 없다면, 메인 페이지로 이동시킨다.
     * @returns {Promise<void>}
     */
    async checkHasPermission() {
      if (this.$store.state.auth.userInfo && !this.$store.state.auth.userInfo.is_superuser) {
        // 권한이 없다는 팝업을 띄우고, 뒤로 이동시킨다
        const customAlert = new CustomEvent("customAlert", {
          detail: {
            title: '권한 없음',
            message: '하도급 업체를 등록할 수 있는 권한이 없습니다.',
            cancelFunction: () => {
              window.location.href = '/'
            }
          },
        });
        window.dispatchEvent(customAlert);
      }
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
      if (!this.postId) {
        if (dataName === "username") {
          // username
          if (user.username) {
            await this.$store.dispatch("CHECK_EXIST", { username: user.username }).then((value) => {
              if (value.isEmpty === true) {
                user.error.username = false;
                user.error.username_message = "";
              } else {
                user.error.username = true;
                user.error.username_message = "이미 사용중인 ID 입니다.";
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

        this.formCheck();
      }
    },
    async loadCompany() {
      if (this.form.company && this.form.company.id) {
        const companyId = this.form.company.id;
        await HttpRequest.get(`/api/v1/company/${companyId}`)
          .then((response) => {
            this.company = response;
          })
          .catch((err) => {});
      }
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
    handleFieldChange(field) {
      this.form.field = field;
      this.form.stdInfo.field_id = field.id;
    },
    handleCompanyChange(company) {
      this.form.company = company;
    },
    addUser() {
      const HOST_NAME = window.location.hostname;

      this.form.userList.push({
        name: "",
        username: "",
        password: "",
        phone: "",
        email: "",
        section: HOST_NAME === "nhsafe.maot.co.kr" ? "현장담당" : "",
        rank: HOST_NAME === "nhsafe.maot.co.kr" ? "대표이사" : "",
        startDate: "",
        endDate: "",
        is_checked: false,
        is_new: true,

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

      this.formCheck();
    },

    phoneHyphen(value) {
      if (!value) return "";
      return value.replace(/(\d{3})(\d{3,4})(\d{4})/, "$1-$2-$3");
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

  &.grid-2 {
    grid-template-columns: 40px 50px 1fr 1fr 1fr 1fr 1fr 1fr 1fr 2fr;
  }

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
