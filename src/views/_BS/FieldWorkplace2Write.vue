<template>
  <vs-tabs>
    <vs-tab label="현장 등록" @click="onClickTab(0)">
      <vx-card>
        <div id="print-label" class="mr-auto"></div>
        <div id="print-report">
          <div>
            <div v-if="!isPrint" class="flex justify-end">
              <vs-button class="ml-4" color="secondary" type="border" @click="onClickPrint">인쇄</vs-button>
              <vs-button class="ml-4" color="secondary" type="border" @click="onClickMoveList">목록</vs-button>
              <vs-button class="ml-4" color="secondary" @click="onClickSave">저장</vs-button>
            </div>
            <p class="title mt-5 mb-5">현장 개요</p>
            <div class="w-full grid" style="grid-template-columns: 1fr 1fr 1fr; column-gap: 1.5rem;">
              <div class="mb-4" style="display: grid; grid-template-columns: 116px 1fr; align-items: center;">
                <div class="label-text mr-4">현장명</div>
                <span v-if="isPrint" class="print-input">{{ form.field_name }}</span>
                <ml-input v-else class="w-full flex-1" v-model="form.field_name"/>
              </div>
              <div class="mb-4" style="display: grid; grid-template-columns: 116px 1fr; align-items: center;">
                <div class="label-text mr-4">계약금액</div>
                <span v-if="isPrint" class="print-input">{{ form.deposit_amount }}</span>
                <ml-input v-else class="w-full flex-1" v-model="form.deposit_amount"/>
              </div>
              <div></div>
              <div class="mb-4" style="display: grid; grid-template-columns: 116px 1fr; align-items: center;">
                <div class="label-text mr-4">주소</div>
                <span v-if="isPrint" class="print-input">{{ form.address }}</span>
                <ml-input v-else class="w-full flex-1" v-model="form.address"/>
              </div>
              <div class="mb-4" style="display: grid; grid-template-columns: 116px 1fr; align-items: center;">
                <div class="label-text mr-4">사업기간</div>
                <div class="w-full flex items-center">
                  <span v-if="isPrint" class="print-input">{{ form.work_begin_at }}</span>
                  <date-selector v-else class="popup-fixed" v-model="form.work_begin_at"></date-selector>
                  <span class="px-2"> ~ </span>
                  <span v-if="isPrint" class="print-input">{{ form.work_end_at }}</span>
                  <date-selector v-else class="popup-fixed" v-model="form.work_end_at"></date-selector>
                </div>
              </div>
              <div class="mb-4" style="display: grid; grid-template-columns: 116px 1fr; align-items: center;">
                <div class="label-text mr-4">대표번호</div>
                <span v-if="isPrint" class="print-input">{{ form.phone }}</span>
                <ml-input v-else class="w-full flex-1" v-model="form.phone"/>
              </div>
            </div>
          </div>

          <!-- 담당 부서 및 하도급업체 현황 -->
          <company-add-module v-model="companyList" :isPrint="isPrint" @remove="removeCompany"/>

          <!-- 참여 인원 정보 -->
          <company-user-auth-module :users="userList" :isPrint="isPrint" v-model="joinUsers"/>

          <div class="my-8" style="display: grid; grid-template-columns: 1fr 1fr 1fr; column-gap: 1.5rem;">
            <div>
              <p class="title-n">현장조감도</p>
              <file-uploader type="only-image" class="upload-img " v-model="form.field_view"/>
            </div>
            <div>
              <p class="title-n">현장약도</p>
              <file-uploader type="only-image" class="upload-img" v-model="form.field_map"/>
            </div>
            <div>
              <p class="title-n">현장사진</p>
              <file-uploader type="only-image" class="upload-img" v-model="form.field_photo"/>
            </div>
          </div>

          <file-upload-module v-model="fileList" :isPrint="isPrint"/>
        </div>
        <div id="print-approval"></div>
      </vx-card>
    </vs-tab>
    <vs-tab label="부서별 현장 현황" @click="onClickTab(1)">
    </vs-tab>
  </vs-tabs>
</template>

<script>
import FileInput from '@/components/custom/FileInput'
import FileUploadModule from '@/views/modules/FileUploadModule'
import FileUploader from '@/components/FileUploader'
import CompanyAddModule from '@/views/_BS/components/CompanyAddModule'
import CompanyUserAuthModule from '@/views/_BS/components/CompanyUserAuthModule'
import SearchNavStartEnd from '@/components/nav/SearchNavStartEnd.vue'
import DateSelector from '@/components/selector/DateSelector'

export default {
  components: {
    DateSelector,
    SearchNavStartEnd,
    CompanyUserAuthModule,
    CompanyAddModule,
    FileUploader,
    FileInput,
    FileUploadModule
  },
  data () {
    return {
      isPrint: false,
      form: {
        field_name: '', // 현장명
        deposit_amount: '', // 계약금액
        address: '', //주소
        work_begin_at: '', // 사업기간 시작
        work_end_at: '', // 사업기간 완료
        phone: '', // 대표번호
        company_ids: [], // 참여 업체 목록
        user_ids: [], // 참여 사용자 목록

        field_view: {}, // 현장 조감도
        field_map: {}, // 현장 약도
        field_photo: {}, // 현장 사진

        meta: '', // 부가 정보
      },
      companyList: [],
      userList: [],
      joinUsers: [],
      fileList: [],
    }
  },
  computed: {
    postId () {
      return this.$route.params.postId
    },
    isMobile()  {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    }
  },
  watch: {
    async companyList () {
      await this.initMembers()
    }
  },
  created () {
    this.initBreadcrumb()
  },
  mounted () {
    if (this.postId) {
      this.loadField()
    }
  },
  methods: {
    initBreadcrumb () {
      this.$store.commit('menu/UPDATE_PAGE_LIST', [{title: 'Home'}, {title: '현장/시설물 개요'}, {title: '현장(용역·위탁) 관리', active: true}])
    },
    async loadField () {
      const postId = this.postId
      await this.$store.dispatch('project/LOAD_FIELD', {postId})
      const info = this.$store.state.project.fieldInfo
      this.joinUsers = info.users
      this.form = {...info}

      if (this.form.field_map.length > 0) {
        this.form.field_map = this.form.field_map[0]
      } else {
        this.form.field_map = {}
      }
      if (this.form.field_photo.length > 0) {
        this.form.field_photo = this.form.field_photo[0]
      } else {
        this.form.field_photo = {}
      }
      if (this.form.field_view.length > 0) {
        this.form.field_view = this.form.field_view[0]
      } else {
        this.form.field_view = {}
      }

      if (this.form.companies && this.form.companies.length > 0) {
        const companies = []
        for (const company of this.form.companies) {
          companies.push(company)
        }
        this.companyList = companies

        await this.initMembers()
      }
    },

    async initMembers () {
      const joinUsers = this.joinUsers
      const members = []
      for (const company of this.companyList) {
        members.push(...await this.loadMember(company.id))
      }

      for (const member of members) {
        let join_project = false
        for (const user of joinUsers) {
          if (user.id === member.id) {
            join_project = true
            break
          }
        }
        member.join_project = join_project
      }

      this.userList = members
    },

    async loadMember (company_id) {
      const page = 1
      const perPage = 100
      await this.$store.dispatch('company/LOAD_MEMBER_LIST', {page, perPage, company_id})
      return JSON.parse(JSON.stringify(this.$store.state.company.memberList))
    },
    onClickTab (tabIndex) {
      if (tabIndex === 0) {
        this.$router.push({name: 'field-workplace2-list'})
      } else if (tabIndex === 1) {
        this.$router.push({name: 'field-workplace2-info'})
      }
    },
    onClickSave () {
      const company_ids = []
      for (const com of this.companyList) {
        company_ids.push(com.id)
      }
      const user_ids = []
      if (this.joinUsers.length > 0) {
        for (const user of this.joinUsers) {
          user_ids.push(user.id)
        }
      }
      this.form.company_ids = company_ids
      this.form.user_ids = user_ids
      this.form.project_id = this.$route.params.proj_id

      if (this.postId) {
        // update
        const fieldId = this.postId
        this.$store.dispatch('project/UPDATE_FIELD', {
          field_type: '현장(용역위탁)',
          fieldId,
          ...this.form
        }).then((/*value*/) => {
          this.$router.back()
        })
      } else {
        // create
        this.$store.dispatch('project/CREATE_FIELD', {
          field_type: '현장(용역위탁)',
          ...this.form
        }).then((/*value*/) => {
          this.$router.back()
        })
      }
    },
    onClickMoveList () {
      this.$router.push({ name: 'field-workplace2-list' })
    },
    removeCompany (company) {
      let i = 0
      for (i = 0; i < this.joinUsers.length; i++) {
        const usr = this.joinUsers[i]
        if (usr.company_id === company.id) {
          this.joinUsers.splice(i, 1)
          i--
        }
      }
    },
    handleSearch (/*searching*/) {
    },
    handleSort (/*key, active*/) {
    },

    onClickPrint() {
      const customAlert = new CustomEvent("customAlert", {
        detail: {
          title: "레이아웃 선택",
          messageIcon: "AlertCircleIcon",
          message: "인쇄 방향을 선택해 주세요.",
          useConfirm: true,
          confirmBtn: "세로 방향",
          cancelBtn: "가로 방향",
          confirmFunction: () => this.printPortrait(),
          cancelFunction: () => this.printLandscape(),
          size: "small",
          btnPosition: "center",
          confirmBtnStyle: {
            type: "border",
            icon: { type: "image", name: "icon-print-layout-vertical.svg" },
            style: "",
          },
          cancelBtnStyle: {
            type: "border",
            icon: { type: "image", name: "icon-print-layout-horizontal.svg" },
            style: "",
          },
        },
      });
      window.dispatchEvent(customAlert);

      return;
    },
    printLandscape() {
      this.print("@media print {@page { size: a3 landscape; }}");
    },
    printPortrait() {
      this.print("@media print {@page { size: a3 portrait; }}");
    },
    /**
     * 사진대지처럼 이미지의 용량이 큰 경우, 인쇄가 안되는 경우가 있어서
     * 다음과 같은 처리를 해준다.
     * 새로운 창을 연 후, DOMContentLoaded 이벤트가 발생하면, 현재 창에서 출력하고자 하는 내용을 새로운 창으로 넘겨준다.
     * 이 후, load 이벤트가 발생하면, 새로운 창에서 인쇄를 실행한다.
     * >> DOMContentLoaded : DOM 트리가 완성되면 호출됨
     * >> load : 모든 리소스가 로드되면 호출됨 (이미지가 모두 로딩된 후 호출됨)
     */
    print(css) {
      // 프린트
      this.isPrint = true;

      const winPrint = window.open(this.$route.fullPath, "_blank");
      winPrint.addEventListener("DOMContentLoaded", () => {
        const printTextarea = document.getElementsByClassName("print-textarea");
        for (let i = 0; i < printTextarea.length; i++) {
          const pt_r = printTextarea[i].innerHTML.trimStart().trimEnd().replace(/\r\n/gi, "<br>").replace(/\\n/gi, "<br>").replace(/\n/gi, "<br>");

          document.getElementsByClassName("print-textarea")[i].innerHTML = pt_r;
        }

        const g_label = document.getElementById("print-label").innerHTML;
        const g_oBeforeBody = document.getElementById("print-report").innerHTML;
        const g_oBeforeApproval = document.getElementById("print-approval").innerHTML;
        winPrint.document.body.style.backgroundColor = "#fff";
        winPrint.document.body.innerHTML = "";
        if (g_label) {
          winPrint.document.body.innerHTML += `${g_label}<br>`;
        }
        winPrint.document.body.innerHTML += g_oBeforeBody;
        if (g_oBeforeApproval) {
          winPrint.document.body.innerHTML += `<br>${g_oBeforeApproval}`;
        }
        winPrint.document.body.style.padding = "16px";

        const head = winPrint.document.head || winPrint.document.getElementsByTagName("head")[0],
          style = winPrint.document.createElement("style");

        style.type = "text/css";
        style.media = "print";

        if (style.styleSheet) {
          style.styleSheet.cssText = css;
        } else {
          style.appendChild(winPrint.document.createTextNode(css));
        }
        head.appendChild(style);
      });
      winPrint.addEventListener("load", function () {
        winPrint.print();
      });
      winPrint.onbeforeprint = function () {
        // 부모가 프린트 화면이므로 새로고침
        window.location.reload();
      };
      winPrint.onafterprint = function () {
        // 부모가 프린트 화면이므로 새로고침
        window.location.reload();
      };
      winPrint.onbeforeunload = function () {
        // 부모가 프린트 화면이므로 새로고침
        window.location.reload();
      };
    },
  }
}
</script>

<style scoped lang="scss">
.table-list {
  .action-button {
    margin-left: auto;
  }
}

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
