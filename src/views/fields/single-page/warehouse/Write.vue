<template>
  <div>
    <vx-card>
      <div class="flex items-center justify-between mb-5">
        <h1 style="font-weight: 700; font-size: 18px">창고 등록</h1>
        <div class="flex justify-end">
          <vs-button v-if="isAdmin && !!fieldId" class="ml-4" color="secondary" type="border" @click="onClickDelete">삭제</vs-button>
          <vs-button class="ml-4" color="secondary" type="border" @click="onClickMoveList">목록</vs-button>
          <vs-button class="ml-4" color="secondary" @click="onClickSave">저장</vs-button>
        </div>
      </div>

      <!-- 창고 정보 -->
      <div class="mb-5">
        <h5 class="mb-5"><i class="dot"></i> 창고 정보</h5>
        <div class="writeGridContainer">
          <div>
            <div>반</div>
            <ml-input v-model="form.meta.ban" />
          </div>
          <div>
            <div>창고명</div>
            <ml-input v-model="form.field_name" />
          </div>
          <div>
            <div>위치(주소)</div>
            <ml-input v-model="form.address" />
          </div>
          <div>
            <div>구분</div>
            <ml-input v-model="form.meta.type" />
          </div>
          <div>
            <div>비고</div>
            <ml-input v-model="form.meta.note" />
          </div>
          <div>
            <div>담당소장</div>
            <ml-input v-model="form.director_name" />
          </div>
          <div class="writeGridLineItem">
            <div class="fit-text">물질안전보건자료(MSDS) 대상물질 내역</div>
            <ml-input v-model="form.meta.msds" />
          </div>
        </div>
      </div>

      <!-- 위험기계 기구 현황 -->
      <div class="mb-5">
        <h5 class="mb-5"><i class="dot"></i> 위험기계 기구 현황</h5>
        <table>
          <thead>
          <th v-for="machine in ['고소작업대', '굴삭기', '로라', '다짐기', '덤프트럭', '예초기', '엔진톱', '발전기', '전기양수기', '엔진양수기', '산소', 'LPG', '동력분무기', '잔디깍기', '경운기', '브로워']" :key="machine">
            {{ machine }}
          </th>
          </thead>
          <tbody>
          <tr>
            <td v-for="machine in ['고소작업대', '굴삭기', '로라', '다짐기', '덤프트럭', '예초기', '엔진톱', '발전기', '전기양수기', '엔진양수기', '산소', 'LPG', '동력분무기', '잔디깍기', '경운기', '브로워']" :key="machine">
              <comma-input placeholder="입력" v-model="form.meta.devices[machine]" class="w-full" />
            </td>
          </tr>
          </tbody>
        </table>
      </div>

      <!-- 부서 정보 -->
      <company-add-module v-model="companyList" @remove="removeCompany" />

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

      <file-upload-module v-model="fileList" />
    </vx-card>
  </div>
</template>

<script>
import FileInput from "@/components/custom/FileInput";
import FileUploadModule from "@/views/modules/FileUploadModule";
import FileUploader from "@/components/FileUploader";
import CompanyUserAuthModule from "@/views/_BS/components/CompanyUserAuthModule";
import SearchNavStartEnd from "@/components/nav/SearchNavStartEnd.vue";
import DateSelector from "@/components/selector/DateSelector";
import CustomOptionSelector from "@/components/selector/CustomOptionSelector.vue";

export default {
  components: {
    DateSelector,
    SearchNavStartEnd,
    CompanyUserAuthModule,
    FileUploader,
    FileInput,
    FileUploadModule,
    CustomOptionSelector,
  },
  data() {
    return {
      form: {
        field_name: "",
        address: "",
        director_name: "",

        company_ids: [], // 참여 업체 목록
        user_ids: [], // 참여 사용자 목록

        field_view: {}, // 현장 조감도
        field_map: {}, // 현장 약도
        field_photo: {}, // 현장 사진

        meta: {
          ban: "", // 반
          type: "", // 구분
          note: "", // 비고
          msds: "", // 대상물질내역
          devices: {}, // 위험기계 기구현황
        },
      },
      companyList: [],
      userList: [],
      joinUsers: [],
      fileList: [],
    };
  },
  computed: {
    projectId() {
      return this.$route.params.proj_id;
    },
    fieldId() {
      return this.$route.params.fieldId;
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
  mounted() {
    if (this.fieldId) {
      this.loadField();
    }
  },
  methods: {
    async loadField() {
      const fieldId = this.fieldId;
      await this.$store.dispatch("project/LOAD_FIELD", { fieldId });
      const info = this.$store.state.project.fieldInfo;

      this.joinUsers = info.users;

      const meta = {
        ban: "", // 반
        type: "", // 구분
        note: "", // 비고
        msds: "", // 대상물질내역
        devices: {}, // 위험기계 기구현황
      };
      const infoMeta = info.meta ? JSON.parse(info.meta) : {};
      const mergeMeta = { ...meta, ...infoMeta };

      this.form = { ...info, meta: mergeMeta };

      if (typeof this.form.meta === 'string') {
        this.form.meta = JSON.parse(this.form.meta)
      }

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

      if (this.form.companies && info.companies.length > 0) {
        const companies = [];
        for (const company of info.companies) {
          companies.push(company);
        }
        this.companyList = companies;

        await this.initMembers();
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
