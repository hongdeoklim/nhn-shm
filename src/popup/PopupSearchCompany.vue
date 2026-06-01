<template>
  <vs-popup
    id="popupSearchCompany"
    :title="title"
    :active.sync="showPopup"
    class="popupSearchCompany"
    :class="{ 'hidden-for-edit': hiddenForEdit }"
  >
    <!-- new -->
    <div v-if="mode === 'new' && listOnly === false" class="popupSearchCompany_new">
      <vs-row class="p-4">
        <vs-col class="flex">
          <label @click="handleClickBack" style="cursor: pointer; display: flex; align-content: center; color: #7e72f2">
            <feather-icon icon="ChevronLeftIcon" color="primary" />
            <span style="padding-top: 1px">뒤로가기</span>
          </label>
        </vs-col>
      </vs-row>
      <div class="py-4 px-8">
        <vs-row>
          <vs-col vs-type="flex" vs-justify="left" vs-align="center" w="12">
            <h5><i class="dot"></i> 하도급업체 정보</h5>
          </vs-col>
        </vs-row>
        <vs-row>
          <!-- 부서 -->
          <vs-col class="grid mt-4 px-2" style="grid-template-columns: 128px 1fr">
            <span class="pt-3">참여 부서</span>
            <div style="display: flex; gap: 0.5rem">
              <vs-checkbox v-for="project in projectList" v-model="form.project" :vs-value="project.id" :key="project.id">{{ project.field_name }}</vs-checkbox>
            </div>
          </vs-col>
        </vs-row>
        <vs-row class="grid" style="grid-template-columns: 1fr 1fr 1fr">

          <!-- 사업자등록번호 -->
          <vs-col class="grid mt-4 px-2" style="grid-template-columns: 128px 1fr">
            <span class="pt-3">사업자등록번호<span style="color: red;">*</span></span>
            <div style="position: relative">
              <corporate-number-input
                class="w-full"
                v-model="form.com_number"
                :disabled="isCheckingDuplicate"
                @keyup="handleKeyupComNumber"
                @focusout="handleFocusoutComNumber()"
              />
              <!-- 로딩 중일 때 -->
              <span v-if="isCheckingDuplicate" class="blue">사업자번호 중복 검사 중...</span>
              <!-- 오류가 있을 때 -->
              <span v-else-if="error.com_number" class="red">{{ error.message.com_number }}</span>

              <!-- 로딩 아이콘 -->
              <div v-if="isCheckingDuplicate" class="p-3" style="position: absolute; top: 0; right: 0">
                <div class="loading-spinner"></div>
              </div>
              <!-- 오류 아이콘 -->
              <div v-else-if="error.com_number" class="p-3" style="position: absolute; top: 0; right: 0">
                <img :src="require('./error.svg')" />
              </div>
            </div>
          </vs-col>

          <!-- 업체명 -->
          <vs-col class="grid mt-4 px-2" style="grid-template-columns: 128px 1fr">
            <span class="pt-3">업체명<span style="color: red;">*</span></span>
            <div style="position: relative">
              <ml-input class="w-full" v-model="form.com_name" :disabled="!fieldsEnabled" @focusout="handleFocusoutComName()" />
              <span v-if="error.com_name" class="red">{{ error.message.com_name }}</span>
              <div v-if="error.com_name" class="p-3" style="position: absolute; top: 0; right: 0">
                <img :src="require('./error.svg')" />
              </div>
            </div>
          </vs-col>

          <!-- 대표자 -->
          <vs-col class="grid mt-4 px-2" style="grid-template-columns: 128px 1fr">
            <span class="pt-3">대표자<span style="color: red;">*</span></span>
            <div style="position: relative">
              <ml-input class="w-full" v-model="form.com_ceo" :disabled="!fieldsEnabled" />
              <span v-if="error.com_ceo" class="red">{{ error.message.com_ceo }}</span>
              <div v-if="error.com_ceo" class="p-3" style="position: absolute; top: 0; right: 0">
                <img :src="require('./error.svg')" />
              </div>
            </div>
          </vs-col>


          <!-- 주소 -->
          <vs-col class="grid mt-4 px-2" style="grid-template-columns: 128px 1fr">
            <span class="pt-3">주소</span>
            <div style="position: relative">
              <address-field class="w-full" v-model="form.address" :disabled="!fieldsEnabled" />
              <span v-if="error.com_address" class="red">{{ error.message.com_address }}</span>
              <div v-if="error.com_address" class="p-3" style="position: absolute; top: 0; right: 0">
                <img :src="require('./error.svg')" />
              </div>
            </div>
          </vs-col>

          <!-- 업태 -->
          <vs-col class="grid mt-4 px-2" style="grid-template-columns: 128px 1fr">
            <span class="pt-3">업태</span>
            <div style="position: relative">
              <ml-input class="w-full" v-model="form.com_business_class" :disabled="!fieldsEnabled" />
              <span v-if="error.com_business_class" class="red">{{ error.message.com_business_class }}</span>
              <div v-if="error.com_business_class" class="p-3" style="position: absolute; top: 0; right: 0">
                <img :src="require('./error.svg')" />
              </div>
            </div>
          </vs-col>

          <!-- 업종 -->
          <vs-col class="grid mt-4 px-2" style="grid-template-columns: 128px 1fr">
            <span class="pt-3">업종</span>
            <div style="position: relative">
              <ml-input class="w-full" v-model="form.com_business_type" :disabled="!fieldsEnabled" />
              <span v-if="error.com_business_type" class="red">{{ error.message.com_business_type }}</span>
              <div v-if="error.com_business_type" class="p-3" style="position: absolute; top: 0; right: 0">
                <img :src="require('./error.svg')" />
              </div>
            </div>
          </vs-col>

          <!-- 담당자 -->
          <vs-col class="grid mt-4 px-2" style="grid-template-columns: 128px 1fr">
            <span class="pt-3">담당자</span>
            <div style="position: relative">
              <ml-input class="w-full" v-model="form.director" :disabled="!fieldsEnabled" />
              <span v-if="error.director" class="red">{{ error.message.director }}</span>
              <div v-if="error.director" class="p-3" style="position: absolute; top: 0; right: 0">
                <img :src="require('./error.svg')" />
              </div>
            </div>
          </vs-col>

          <!-- 연락처 -->
          <vs-col class="grid mt-4 px-2" style="grid-template-columns: 128px 1fr">
            <span class="pt-3">연락처</span>
            <div style="position: relative">
              <ml-input class="w-full" v-model="form.phone" :disabled="!fieldsEnabled" />
              <span v-if="error.phone" class="red">{{ error.message.phone }}</span>
              <div v-if="error.phone" class="p-3" style="position: absolute; top: 0; right: 0">
                <img :src="require('./error.svg')" />
              </div>
            </div>
          </vs-col>

          <!-- 사업자등록증 -->
          <vs-col class="grid mt-4 px-2" style="grid-template-columns: 128px 1fr">
            <span class="pt-3">사업자등록증</span>
            <div style="position: relative">
              <file-uploader class="w-full" v-model="form.file" :disabled="!fieldsEnabled" />
              <span v-if="error.file" class="red">{{ error.message.file }}</span>
              <div v-if="error.file" class="p-3" style="position: absolute; top: 0; right: 36px">
                <img :src="require('./error.svg')" />
              </div>
            </div>
          </vs-col>
        </vs-row>
      </div>
      <vs-row>
        <vs-col class="flex py-4 px-8" vs-align="center" vs-justify="flex-end">
          <vs-button class="mr-4" color="#EDEDED" text-color="black" type="filled" @click="handleClickClose">닫기 </vs-button>
          <vs-button v-if="selectCompany.id" class="" color="secondary" :disabled="isSubmitDisabled" @click="handleClickSave">수정</vs-button>
          <vs-button v-else class="" color="secondary" :disabled="isSubmitDisabled" @click="handleClickSave">등록</vs-button>
        </vs-col>
      </vs-row>
    </div>

    <!-- list -->
    <div v-else class="popupSearchCompany_list">
      <!-- 검색 -->
      <div v-if="isMobile" class="mobile flex justify-between items-center shadow rounded-lg p-4 mb-4">
        <div class="flex">
          <ml-input v-model="search.keyword" class="w-full" placeholder="검색어 입력" @keyup.enter="handleClickSearch" />
        </div>
        <div>
          <vs-button color="secondary" @click="handleClickSearch">검색</vs-button>
        </div>
      </div>
      <div v-else style="border-bottom: 1px solid #e0e0e0" class="flex flex-wrap  items-center justify-between gap-y-4 shadow rounded-lg p-5 mb-6">
        <div class="flex items-center gap-4">
          <p style="width: 114px" class="px-2">검색어</p>
          <ml-input v-model="search.keyword" class="w-full" @keyup.enter="handleClickSearch" />
        </div>
        <div class="ml-auto">
          <vs-button v-if="search.appliedKeyword" color="secondary" type="border" class="mr-2" @click="handleClickReset">초기화</vs-button>
          <vs-button color="secondary" @click="handleClickSearch">검색</vs-button>
        </div>
      </div>

      <!-- 테이블 -->
      <vs-row v-if="!isMobile" class="p-4">
        <vs-col class="flex" v-if="listOnly === false">
          <div class="ml-auto">
            <vs-button v-if="selectCompany.id" color="secondary" type="border" @click="handleClickUpdate"> 선택수정 </vs-button>
            <vs-button class="ml-4" color="secondary" @click="handleClickNew"> 신규작성 </vs-button>
          </div>
        </vs-col>
      </vs-row>
      <vs-row class="p-4">
        <vs-col>
          <vs-table stripe ref="table" :sst="true" :max-items="page.perPage" :data="companyList" noDataText="데이터가 없습니다" @selected="handleItemClickDetail">
            <template slot="thead">
              <vs-th style="width: 60px"><span class="w-full text-center whitespace-no-wrap">No.</span></vs-th>
              <vs-th v-if="isMobile" style="width: 20%"><span class="w-full text-center whitespace-no-wrap">업체명</span></vs-th>
              <vs-th style="width: 20%"><span class="w-full text-center whitespace-no-wrap">사업자등록번호</span></vs-th>
              <vs-th v-if="!isMobile" style="width: 20%"><span class="w-full text-center whitespace-no-wrap">업체명</span></vs-th>
              <vs-th style="width: 20%"><span class="w-full text-center whitespace-no-wrap">대표자</span></vs-th>
              <vs-th><span class="w-full text-center whitespace-no-wrap">주소</span></vs-th>
            </template>

            <template slot-scope="{ data }">
              <vs-tr :class="selectCompany.id === company.id ? 'active' : ''" :data="company" :key="index" v-for="(company, index) in data">
                <vs-td class="text-center whitespace-no-wrap">{{ company.id }}</vs-td>
                <vs-td v-if="isMobile" class="text-center whitespace-no-wrap">{{ company.com_name }}</vs-td>
                <vs-td class="text-center whitespace-no-wrap">{{ company.com_number | comNumber }}</vs-td>
                <vs-td v-if="!isMobile" class="text-center whitespace-no-wrap">{{ company.com_name }}</vs-td>
                <vs-td class="text-center whitespace-no-wrap">{{ company.com_ceo }}</vs-td>
                <vs-td class="text-center" :class="[isMobile ? 'whitespace-no-wrap' : '']" style="min-width: 300px;">{{ getCompanyAddress(company.com_address) }}</vs-td>
              </vs-tr>
            </template>
          </vs-table>
        </vs-col>
      </vs-row>
      <vs-row>
        <vs-col>
          <div class="vs-con-table">
            <div class="con-pagination-table vs-table--pagination">
              <k-pagination :total="page.lastPage ? page.lastPage : 0" v-model="page.current" @change="handleChangePage"></k-pagination>
            </div>
          </div>
        </vs-col>
        <vs-col class="mt-4 flex p-4" vs-align="center" vs-justify="flex-end">
          <vs-button class="mr-4" color="#EDEDED" text-color="black" type="filled" @click="handleClickClose">닫기 </vs-button>
          <vs-button class="" color="secondary" @click="handleClickSelect">선택</vs-button>
        </vs-col>
      </vs-row>
    </div>

    <!-- 업체 수정 팝업 -->
    <popup-edit-company
      v-model="showEditPopup"
      :company-id="duplicateCompanyId"
      :title="'중복된 업체 정보 수정'"
      @saved="handleEditSaved"
      @close="handleEditClose"
      @error="handleEditError"
    />
  </vs-popup>
</template>

<script>
import KPagination from "@/components/kPagination/kPagination";
import FileUploader from "@/components/FileUploader.vue";
import AddressField from "@/components/AddressField.vue";
import HttpRequest from "@/util/HttpRequest";
import CorporateNumberInput from "@/components/CorporateNumberInput.vue";
import PopupEditCompany from "@/popup/PopupEditCompany.vue";
export default {
  name: "PopupSearchCompany",
  props: {
    value: Boolean,
    selectId: [String, Number],
    listOnly: {
      type: Boolean,
      default: () => true,
    },
    fieldId: Number,
    onlyRelated: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "업체검색",
    },
  },
  components: {
    CorporateNumberInput,
    AddressField,
    FileUploader,
    KPagination,
    PopupEditCompany,
  },

  watch: {
    value(data) {
      this.showPopup = data;
      if (this.oldSelectCompany.id) {
        this.selectCompany = this.oldSelectCompany;
      }
      if (!this.showPopup) {
        this.mode = "list";
        this.initForm();
        this.fieldsEnabled = false; // 팝업이 닫힐 때 필드 상태 초기화
        this.showEditPopup = false; // 수정 팝업도 닫기
        this.duplicateCompanyId = null; // 중복 업체 ID 초기화
        this.isCheckingDuplicate = false; // 중복 체크 상태 초기화
        this.hiddenForEdit = false; // 숨김 상태 초기화
      } else {
        this.mode = "list"; // 팝업이 열릴 때 목록 모드로 시작
        this.loadCompanyList();
      }
    },
    selectId(id) {
      this.oldSelectCompanyId = id;
      if (this.companyList) {
        for (const company of this.companyList) {
          if (company.id === this.oldSelectCompanyId) {
            try {
              this.oldSelectCompany = company;
              this.selectCompany = company;
            } catch (e) {
              //
            }
            break;
          }
        }
      }
    },
    showPopup(value) {
      const body = document.querySelector('body');
      if (value) {
        body.style.overflow = 'hidden'
      } else {
        body.style.overflow = 'auto'
      }

      this.selectCompany = this.oldSelectCompany;
      this.$emit("input", value);
    },

    "form.address": {
      handler(address) {
        this.form.com_address = `${address.home_address_1} (${address.home_zip})`;
      },
    },
    "form.com_number": {
      handler(newValue, oldValue) {
        // 사업자번호가 변경되면 이전 에러 상태 초기화
        if (newValue !== oldValue && this.error.com_number) {
          this.error.com_number = false;
          this.error.message.com_number = "";
        }
      },
    },
    fieldId() {
      this.loadCompanyList();
    },
  },
  computed: {
    projectList() {
      return this.$store.state.project.projectListInfo.data;
    },
    projectId() {
      return parseInt(this.$route.params.proj_id);
    },
    companyList() {
      const list = this.$store.state.company.companyList;

      return list;
    },
    // 등록/수정 버튼 비활성화 조건
    isSubmitDisabled() {
      const conditions = {
        isCheckingDuplicate: this.isCheckingDuplicate,
        hasComNumberError: this.error.com_number,
        noComNumber: !this.form.com_number,
        noComName: !this.form.com_name,
        noCeo: !this.form.com_ceo,
        noProject: this.form.project.length === 0
      };

      // 디버깅용 (개발 환경에서만)
      if (process.env.NODE_ENV === 'development') {
        console.log('isSubmitDisabled conditions:', conditions);
      }

      return (
        conditions.isCheckingDuplicate || // 중복 체크 중
        conditions.hasComNumberError || // 사업자번호 오류
        conditions.noComNumber || // 사업자번호 미입력
        conditions.noComName || // 업체명 미입력
        conditions.noCeo || // 대표자 미입력
        conditions.noProject // 참여 부서 미선택
      );
    },
  },
  data() {
    return {
      showPopup: false,
      showEditPopup: false, // 수정 팝업 표시 상태
      duplicateCompanyId: null, // 중복된 업체 ID
      isCheckingDuplicate: false, // 중복 체크 진행 중 플래그
      hiddenForEdit: false, // 수정 팝업을 위해 검색 팝업 숨김 상태
      mode: "list",
      isMobile: false,

      oldSelectCompanyId: 0,
      oldSelectCompany: {},
      selectCompany: {},
      originalComNumber: "", // 원본 사업자등록번호 저장
      fieldsEnabled: false, // 다른 필드들의 활성화 상태

      // 페이징
      page: {
        current: 1,
        lastPage: 1,
        perPage: 5,
      },

      // 겅색
      search: {
        keyword: "", // 검색어
      },

      // 신규작성 / 수정용 데이터
      form: {
        project: [], // 참여 부서
        com_name: "", // 업체명
        com_ceo: "", // 대표자
        com_number: "", // 사업자등록번호
        address: {
          home_zip: "",
          home_address_1: "",
          home_address_2: "",
        },
        com_address: "", // 주소
        com_business_class: "", // 업태
        com_business_type: "", // 업종
        director: "", // 담당자
        phone: "", // 연락처
        file: undefined, // 사업자등록증
      },

      error: {
        com_name: false, // 업체명
        com_ceo: false, // 대표자
        com_number: false, // 사업자등록번호
        com_address: false, // 주소
        com_business_class: false, // 업태
        com_business_type: false, // 업종
        director: false, // 담당자
        phone: false, // 연락처
        file: false, // 사업자등록증

        message: {
          com_name: "업체명을 입력해주세요", // 업체명
          com_ceo: "대표자를 입력해주세요", // 대표자
          com_number: "사업자등록번호를 입력해주세요", // 사업자등록번호
          com_address: "주소를 입력해주세요", // 주소
          com_business_class: "업태를 입력해주세요", // 업태
          com_business_type: "업종을 입력해주세요", // 업종
          director: "담당자를 입력해주세요", // 담당자
          phone: "연락처를 입력해주세요", // 연락처
          file: "사업자등록증을 입력해주세요", // 사업자등록증
        },
      },
    };
  },

  created() {
    this.checkMobile();
    window.addEventListener('resize', this.checkMobile);

    this.showPopup = this.value;
    this.oldSelectCompanyId = this.selectId;
  },

  mounted() {
    const backButtonRouteGuard = this.$router.beforeEach((to, from, next) => {
      if (this.showPopup) {
        this.showPopup = false;
        next(false);
        return;
      }
      next(true);
    });
    this.$once("hook:destroyed", () => {
      backButtonRouteGuard();
    });
  },

  beforeDestroy() {
    window.removeEventListener('resize', this.checkMobile)
  },

  methods: {
    async loadCompanyList() {
      const page = this.page.current;
      const perPage = this.page.perPage;
      const keyword = this.search.keyword;
      const projectId = this.projectId;
      const fieldId = this.fieldId;
      const onlyRelated = this.onlyRelated;
      await this.$store.dispatch("company/LOAD_COMPANY_LIST", {
        page,
        perPage,
        keyword,
        projectId,
        fieldId,
        onlyRelated: onlyRelated ? 1 : undefined,
      });

      const info = this.$store.state.company.companyListInfo;
      const list = this.$store.state.company.companyList;
      this.page.current = info.current_page;
      this.page.perPage = info.per_page;
      this.page.lastPage = info.last_page;

      for (const company of list) {
        if (company.id === this.oldSelectCompanyId) {
          this.oldSelectCompany = company;
          this.selectCompany = company;
          break;
        }
      }
    },

    async loadCompany() {
      if (this.selectCompany.id) {
        const companyId = this.selectCompany.id;
        await HttpRequest.get(`/api/v1/company/${companyId}`)
          .then((response) => {
            const projects = response.project;
            const projectIds = [];
            if (projects && projects.length > 0) {
              for (const project of projects) {
                projectIds.push(project.id);
              }
            }
            this.form.project = projectIds;
            this.form.com_name = response.com_name;
            this.form.com_ceo = response.com_ceo;
            this.form.com_address = response.com_address;
            this.form.com_number = response.com_number;
            this.originalComNumber = response.com_number; // 원본 사업자등록번호 저장
            this.form.com_business_class = response.com_business_class;
            this.form.com_business_type = response.com_business_type;
            this.form.director = response.director;
            this.form.phone = response.phone;

            const result_zip = Array.from(response.com_address.matchAll("\\(.*?\\)"), (match) => `${match[0]}`);
            const zip = result_zip.length > 0 ? result_zip[0].replaceAll("(", "").replaceAll(")", "") : "";
            const address = response.com_address.replaceAll(result_zip[0], "").split("|");
            const address1 = address[0];
            const address2 = address[1];
            this.form.address = {
              home_zip: zip,
              home_address_1: address1,
              home_address_2: address2,
            };

            const file = response.attachments.map((att) => {
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

            if (file.length > 0) {
              // id 값으로 내림차순 정렬한다
              file.sort((a, b) => {
                return b.id - a.id;
              });
            }

            this.form.file = file.length > 0 ? file[0] : undefined;
          })
          .catch(() => {
            // 오류 처리
          });
      }
    },

    initForm() {
      this.fieldsEnabled = false; // 필드들을 비활성화 상태로 초기화
      this.form = {
        com_name: "", // 업체명
        com_ceo: "", // 대표자
        com_number: "", // 사업자등록번호
        address: {},
        com_address: "", // 주소
        com_business_class: "", // 업태
        com_business_type: "", // 업종
        director: "", // 담당자
        phone: "", // 연락처
        file: {}, // 사업자등록증
        project: [], // 참여 부서
      };

      this.error = {
        com_name: false, // 업체명
        com_ceo: false, // 대표자
        com_number: false, // 사업자등록번호
        com_address: false, // 주소
        com_business_class: false, // 업태
        com_business_type: false, // 업종
        director: false, // 담당자
        phone: false, // 연락처
        file: false, // 사업자등록증

        message: {
          com_name: "", // 업체명
          com_ceo: "", // 대표자
          com_number: "", // 사업자등록번호
          com_address: "", // 주소
          com_business_class: "", // 업태
          com_business_type: "", // 업종
          director: "", // 담당자
          phone: "", // 연락처
          file: "", // 사업자등록증
        },
      };
    },

    handleFocusoutComName() {
      //CHECK_EXIST
      const option = { com_name: this.form.com_name };
      if (option.com_name) {
        this.$store.dispatch("company/CHECK_EXIST", option).then((value) => {
          if (value.isEmpty) {
            this.error.com_name = false;
            this.error.message.com_name = "";
          } else {
            this.error.com_name = true;
            this.error.message.com_name = "이미 사용중인 업체명입니다.";
          }
        });
      } else {
        this.error.com_name = false;
        this.error.message.com_name = "";
      }
    },
    handleKeyupComNumber(event, value) {
      // 만약 value 값이 '000-00-00000' 형식이라면, 중복 검사를 실행한다
      if (value.length === 12) {
        this.handleFocusoutComNumber();
      }
    },
    async handleFocusoutComNumber() {
      // 수정 팝업이 열려있거나 이미 중복 체크 중인 경우 건너뛰기
      if (this.showEditPopup || this.isCheckingDuplicate) {
        return;
      }

      const comNumber = this.form.com_number;
      // comNumber 값에 '-' 기호를 추가한다 (000-00-00000)
      const comNumberWithHyphen = comNumber.replace(/(\d{3})(\d{2})(\d{5})/, '$1-$2-$3');

      //CHECK_EXIST
      const option = { com_number: comNumberWithHyphen };
      if (option.com_number) {
        this.isCheckingDuplicate = true; // 중복 체크 시작
        try {
          const value = await this.$store.dispatch("company/CHECK_EXIST", option);

          if (value.isEmpty) {
            // 중복이 없는 경우 - 모든 상태 정상화
            this.error.com_number = false;
            this.error.message.com_number = "";
            this.fieldsEnabled = true; // 중복이 없으면 다른 필드들을 활성화

            // 추가적인 상태 초기화 (디버깅용)
            if (process.env.NODE_ENV === 'development') {
              console.log('사업자번호 중복 없음 - 모든 필드 활성화');
            }
          } else {
            // 중복이 발견된 경우 - 프로젝트별로 검색하여 컨펌 표시
            const searchResult = await this.searchCompanyInProjects(comNumberWithHyphen);

            if (searchResult) {
              // 업체를 찾았으면 사용자에게 확인 후 수정 팝업 열기
              const confirmMessage = `이미 등록된 사업자번호입니다.\n프로젝트: ${searchResult.project.field_name}\n업체명: ${searchResult.company.com_name}\n\n해당 업체 정보를 수정하시겠습니까?`;

              if (confirm(confirmMessage)) {
                this.duplicateCompanyId = searchResult.company.id;
                this.showEditPopup = true;
                // 업체 수정 팝업을 열면서 기존 검색 팝업 숨기기 (닫지 않음)
                this.hiddenForEdit = true;
              } else {
                // "취소"를 누른 경우 오류 메시지 표시
                this.error.com_number = true;
                this.error.message.com_number = "이미 등록되어 있는 사업자번호입니다.";
              }
            } else {
              // 프로젝트에서 찾지 못한 경우 기본 에러 메시지
              this.error.com_number = true;
              this.error.message.com_number = "이미 등록되어 있는 사업자번호입니다.";
            }
            this.fieldsEnabled = false; // 중복이 있으면 다른 필드들을 비활성화
          }
        } catch (error) {
          this.error.com_number = true;
          this.error.message.com_number = "올바른 사업자번호를 입력해주세요.";
          this.fieldsEnabled = false; // 오류가 있으면 다른 필드들을 비활성화
        } finally {
          this.isCheckingDuplicate = false; // 중복 체크 완료
        }
      } else {
        this.error.com_number = false;
        this.error.message.com_number = "";
        this.fieldsEnabled = false; // 입력이 없으면 다른 필드들을 비활성화
      }
    },

    handleClickClose() {
      this.$emit("input", false);
      this.$emit("handleClickClose");
    },

    handleClickSearch() {
      this.page.current = 1;
      this.loadCompanyList();
    },
    handleClickReset() {
      this.search.keyword = "";
      this.page.current = 1;
      this.loadFieldList();
    },

    handleChangePage(page) {
      this.page.current = page;
      this.loadCompanyList();
    },

    handleItemClickDetail(data) {
      if (this.selectCompany === data) {
        this.selectCompany = {};
      } else {
        this.selectCompany = data;
      }
    },

    handleClickSelect() {
      this.$emit("input", false);
      this.$emit("handleClickSelect", this.selectCompany);
    },
    handleClickSave() {
      const option = {
        // 필수
        com_name: this.form.com_name,
        project_ids: this.form.project,
        com_ceo: this.form.com_ceo,

        // 선택
        com_business_class: this.form.com_business_class,
        com_business_type: this.form.com_business_type,
        director: this.form.director,
        phone: this.form.phone,
      };

      // 새로운 업체 등록이거나 사업자등록번호가 변경된 경우에만 포함
      if (!this.selectCompany.id || (this.form.com_number !== this.originalComNumber)) {
        option.com_number = this.form.com_number;
      }

      // 주소 정보 설정
      if (this.form.address.home_address_1 && this.form.address.home_address_2 && this.form.address.home_zip) {
        option.com_address = `(${this.form.address.home_zip}) ${this.form.address.home_address_1} | ${this.form.address.home_address_2}`;
      }

      if (this.form.file && this.form.file.id) {
        option.uploads = [this.form.file.id];
      } else {
        delete option['uploads']
      }

      if (!option.com_name) {
        alert("업체명을 입력해주세요");
        return;
      } else if (option.project_ids.length < 1) {
        alert("참여 부서를 선택해주세요");
        return;
      } else if (!option.com_ceo) {
        alert("대표자를 입력해주세요");
        return;
      }

      if (this.selectCompany.id) {
        option.id = this.selectCompany.id;
        this.$store
          .dispatch("company/UPDATE_COMPANY", option)
          .then(() => {
            this.mode = "list";
            this.initForm();
          })
          .catch(() => {
            // 오류 처리
          });
      } else {
        this.$store
          .dispatch("company/CREATE_COMPANY", option)
          .then(() => {
            this.mode = "list";
            this.initForm();
          })
          .catch(() => {
            // 오류 처리
          });
      }
    },
    handleClickUpdate() {
      this.mode = "new";
      this.fieldsEnabled = true; // 수정 모드에서는 모든 필드 활성화

      this.loadCompany();
    },
    handleClickNew() {
      this.mode = "new";
      this.selectCompany = {};
      this.fieldsEnabled = false; // 신규 작성 모드에서는 사업자등록번호만 활성화
    },
    handleClickBack() {
      this.mode = "list";
      this.initForm();
    },
    getCompanyAddress(name) {
      if (!name) return "";

      const splitComName = name.split("|");
      // 다음 주소 검색 값이 아니면 그대로 출력한다
      if (splitComName.length !== 2) return name;

      // 우편번호 자리에 빈 괄호()만 있다면, 주소 입력이 안된 것이므로 그대로 표시한다
      if (splitComName[0].trim() === "()") return "";

      // 정상적으로 입력됐다면, | 기호를 제거하여 출력한다
      return splitComName.join(" ");
    },

    checkCorporateRegiNumber(number) {
      const numberMap = number.replace(/-/gi, '').split('').map(function (d) {
        return parseInt(d, 10);
      });

      if (numberMap.length === 10) {
        const keyArr = [1, 3, 7, 1, 3, 7, 1, 3, 5];
        let chk = 0;

        keyArr.forEach(function(d, i) {
          chk += d * numberMap[i];
        });

        chk += parseInt((keyArr[8] * numberMap[8]) / 10, 10);
        return Math.floor(numberMap[9]) === ((10 - (chk % 10)) % 10);
      }

      return false;
    },

    checkMobile() {
      this.isMobile = window.innerWidth < 768;
    },

    // 프로젝트별로 사업자등록번호로 업체 검색
    async searchCompanyInProjects(comNumber) {
      const projectList = this.projectList;

      if (!projectList || projectList.length === 0) {
        return null;
      }

      for (const project of projectList) {
        try {
          const response = await this.$store.dispatch("company/LOAD_COMPANY_LIST", {
            page: 1,
            perPage: 10,
            keyword: comNumber,
            projectId: project.id,
            fieldId: this.fieldId,
            onlyRelated: this.onlyRelated ? 1 : undefined,
          });

          const companyList = this.$store.state.company.companyList;

          // 정확히 일치하는 사업자등록번호를 가진 업체 찾기
          const matchedCompany = companyList.find(company =>
            company.com_number === comNumber
          );

          if (matchedCompany) {
            return {
              company: matchedCompany,
              project: project
            };
          }
        } catch (error) {
          console.error(`프로젝트 ${project.field_name}에서 업체 검색 실패:`, error);
          continue;
        }
      }

      return null;
    },

    // PopupEditCompany 관련 메서드들
    handleEditSaved() {
      // 업체 정보가 업데이트된 후 목록 새로고침
      this.loadCompanyList();
      this.$emit("company-updated");
      // 수정 완료 후 검색 팝업 다시 보이기 (목록 모드로)
      this.mode = "list";
      this.hiddenForEdit = false;
    },

    handleEditClose() {
      this.showEditPopup = false;
      this.duplicateCompanyId = null;
      this.isCheckingDuplicate = false; // 중복 체크 상태 초기화
      // 수정 팝업 닫기 후 검색 팝업 다시 보이기 (목록 모드로)
      this.mode = "list";
      this.hiddenForEdit = false;
    },

    handleEditError(message) {
      this.$emit("error", message);
    },
  },
};
</script>

<style>
#popupSearchCompany.popupSearchCompany > .vs-popup {
  width: 1600px !important;
  max-width: 90% !important;
}

/* 수정 팝업을 위해 검색 팝업 숨기기 */
#popupSearchCompany.popupSearchCompany.hidden-for-edit > .vs-popup {
  display: none !important;
}

#popupSearchCompany > .vs-popup > .vs-popup--content {
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
}

.popupSearchCompany_new {
  height: calc(100% - 40px);
  display: grid;
  grid-auto-rows: auto 1fr auto;
}
.popupSearchCompany_list {
  height: calc(100% - 40px);
}
</style>

<style scoped>
.table-layout {
  border: 1px solid #cdcdcd;
}

.table-layout .trow {
  border-bottom: 1px solid #cdcdcd;
}

.table-layout .tcol {
  border-right: 1px solid #cdcdcd;
}

.vs-con-table.stripe .tr-values.active {
  background: rgb(102, 112, 203) !important;
  color: #fff;
  font-weight: bold;
}

.red {
  color: #ea5455;
}

.blue {
  color: #7e72f2;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #7e72f2;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
