<template>
  <div>
    <vx-card>
      <div class="flex items-center justify-between mb-5">
        <h1 style="font-weight: 700; font-size: 18px">집단급식소 등록</h1>
        <div class="flex justify-end">
          <vs-button v-if="isAdmin && !!fieldId" class="ml-4" color="secondary" type="border" @click="onClickDelete">삭제</vs-button>
          <vs-button class="ml-4" color="secondary" type="border" @click="onClickMoveList">목록</vs-button>
          <vs-button class="ml-4" color="secondary" @click="onClickSave">저장</vs-button>
        </div>
      </div>

      <!-- 집단급식소 정보 -->
      <div class="mb-5">
        <h5 class="mb-5"><i class="dot"></i> 집단급식소 정보</h5>
        <div class="writeGridContainer">
          <div>
            <div>사업장명</div>
            <ml-input v-model="form.field_name" />
          </div>
          <div>
            <div>담당 주무관</div>
            <ml-input v-model="form.manager_name" />
          </div>
          <div>
            <div>사업기간</div>
            <div class="w-full flex flex-1">
              <date-selector v-model="form.work_begin_at" />
              <label class="px-2 flex" style="align-items: center">~</label>
              <date-selector v-model="form.work_end_at"  />
            </div>
          </div>
          <div>
            <div>사업금액</div>
            <comma-input v-model="form.deposit_amount" />
          </div>
          <div>
            <div>행정동<br>(사업장 주소)</div>
            <ml-input v-model="form.address" />
          </div>
          <div>
            <div>사업장 연락처</div>
            <ml-input v-model="form.phone" />
          </div>
          <div>
            <div>원료·제조물 해당 법령</div>
            <div class="w-full flex-1">
              <ml-input v-model="form.meta.법령" class="w-full flex-1" />
              <div style="color: #696d71;">※ 중처법 제8조제3호참고</div>
            </div>
          </div>
          <div>
            <div>구체적 사용처</div>
            <ml-input v-model="form.meta.사용처" />
          </div>
        </div>
      </div>

      <!-- 부서 정보 -->
      <company-add-module
        v-model="companyList"
        title="담당 부서(업체) 정보"
        detail-title="부서(업체) 세부 정보"
        detail-label-com-name="부서(업체)명"
        :table-columns="[
            { head: &quot;구분&quot;, key: &quot;com_type&quot; },
            { head: &quot;부서(업체)명&quot;, key: &quot;com_name&quot; },
            { head: &quot;대표자&quot;, key: &quot;com_ceo&quot; },
            { head: &quot;담당자&quot;, key: &quot;director&quot; },
            { head: &quot;연락처&quot;, key: &quot;phone&quot; },
          ]"
        @remove="removeCompany"
      />

      <!-- 참여 인원 정보 -->
      <company-user-auth-module
        :colData="[
            { head: '구분', key: 'company_id' },
            { head: '사용자명', key: 'name' },
            { head: '연락처', key: 'phone' },
          ]"
        permissionHead="권한설정"
        :users="userList"
        v-model="joinUsers"
      />

      <div class="my-8" style="display: grid; grid-template-columns: 1fr 1fr 1fr; column-gap: 1.5rem">
        <div>
          <p class="title-n">현장조감도</p>
          <file-uploader type="only-image" class="upload-img" v-model="form.field_view" />
        </div>
        <div>
          <p class="title-n">현장약도</p>
          <file-uploader type="only-image" class="upload-img" v-model="form.field_map" />
        </div>
        <div>
          <p class="title-n">현장사진</p>
          <file-uploader type="only-image" class="upload-img" v-model="form.field_photo" />
        </div>
      </div>

      <file-upload-module v-model="form.fileList" />
    </vx-card>
  </div>
</template>

<script>
import HttpRequest from "@/util/HttpRequest";

import FileUploadModule from "@/views/modules/FileUploadModule";
import FileUploader from "@/components/FileUploader";
import CompanyAddModule from "@/views/_BS/components/CompanyAddModule";
import CompanyUserAuthModule from "@/views/_BS/components/CompanyUserAuthModule";
import SearchNavStartEnd from "@/components/nav/SearchNavStartEnd.vue";
import DateSelector from "@/components/selector/DateSelector";
import CustomOptionSelector from "@/components/selector/CustomOptionSelector.vue";

export default {
  components: {
    DateSelector,
    SearchNavStartEnd,
    CompanyUserAuthModule,
    CompanyAddModule,
    FileUploader,
    FileUploadModule,
    CustomOptionSelector,
  },
  data() {
    return {
      form: {
        field_name: "",
        manager_name: "",
        work_begin_at: "",
        work_end_at: "",
        deposit_amount: "",
        address: "",
        phone: "",

        company_ids: [], // 참여 업체 목록
        user_ids: [], // 참여 사용자 목록

        field_view: {}, // 현장 조감도
        field_map: {}, // 현장 약도
        field_photo: {}, // 현장 사진

        fileList: [],

        meta: {
          법령: "",
          사용처: "",
        }
      },
      companyList: [],
      userList: [],
      joinUsers: [],
    };
  },
  computed: {
    fieldId() {
      return this.$route.params.fieldId;
    },
    projectId() {
      return this.$route.params.proj_id;
    },
    isAdmin() {
      let isAdmin = false;
      const myInfo = this.$store.state.auth.userInfo;
      isAdmin = isAdmin || parseInt(myInfo.is_superuser) > 0;
      return isAdmin;
    },
  },
  watch: {
    async companyList() {
      await this.initMembers();
    },
  },
  created() {
    if (this.fieldId) this.loadField();
  },
  methods: {
    async loadField() {
      const fieldId = this.fieldId;
      await this.$store.dispatch("project/LOAD_FIELD", { fieldId });
      const info = this.$store.state.project.fieldInfo;

      this.joinUsers = info.users;
      this.form = { ...info };

      this.form.meta = JSON.parse(this.form.meta)

      if (this.form.field_map.length > 0) {
        this.form.field_map = this.form.field_map[0];
      } else {
        this.form.field_map = {};
      }
      if (this.form.field_photo.length > 0) {
        this.form.field_photo = this.form.field_photo[0];
      } else {
        this.form.field_photo = {};
      }
      if (this.form.field_view.length > 0) {
        this.form.field_view = this.form.field_view[0];
      } else {
        this.form.field_view = {};
      }

      this.companyList = info.companies;

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

      this.userList = members;
    },
    async loadMember(company_id) {
      const page = 1;
      const perPage = 100;
      await this.$store.dispatch("company/LOAD_MEMBER_LIST", { page, perPage, company_id });
      return JSON.parse(JSON.stringify(this.$store.state.company.memberList));
    },
    removeCompany(company) {
      let i = 0;
      for (i = 0; i < this.joinUsers.length; i++) {
        const usr = this.joinUsers[i];
        if (usr.company_id === company.id) {
          this.joinUsers.splice(i, 1);
          i--;
        }
      }
    },

    onClickSave() {
      const company_ids = [];
      for (const com of this.companyList) {
        company_ids.push(com.id);
      }
      const user_ids = [];
      if (this.joinUsers.length > 0) {
        for (const user of this.joinUsers) {
          user_ids.push(user.id);
        }
      }
      this.form.company_ids = company_ids;
      this.form.user_ids = user_ids;
      this.form.project_id = this.$route.params.proj_id;

      this.$emit('save', this.form)
    },
    onClickDelete () { this.$emit('delete', this.fieldId) },
    onClickMoveList () { this.$emit('moveList') },
  },
};
</script>

<style lang="scss" scoped>
table {
  table-layout: fixed;
  border-collapse: collapse;
  width: 100%;

  th,
  td {
    border: 1px solid #cdcdcd;
  }

  th {
    font-weight: 500;
    font-size: 14px;
    text-align: center;

    background: #f9f9f9;
    padding: 15px 4px;
  }
  td {
    padding: 6px;
  }
}
</style>

<style scoped lang="scss">
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
</style>

<style lang="scss">
.none-card {
  box-shadow: none;
  border-radius: 0;
  display: inline-block;

  .vx-card__body {
    padding: 0 !important;
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
