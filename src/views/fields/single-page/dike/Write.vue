<template>
  <vx-card>
    <div>
      <div class="flex justify-between items-center">
        <p style="font-size: 18px; font-weight: 700">제방</p>
        <div class="flex justify-end">
          <vs-button v-if="isAdmin && !!fieldId" class="ml-4" color="secondary" type="border" @click="onClickDelete">삭제</vs-button>
          <vs-button class="ml-4" color="secondary" type="border" @click="onClickMoveList">목록</vs-button>
          <vs-button class="ml-4" color="secondary" @click="onClickSave">저장</vs-button>
        </div>
      </div>

      <!-- 기본정보 -->
      <div class="mt-28px">
        <h5 class="mb-4"><i class="dot"></i> 기본정보</h5>
        <div class="writeGridContainer">
          <div>
            <div>관리주체</div>
            <ml-input readonly v-model="form.management_entity" />
          </div>
          <div>
            <div>소유자</div>
            <ml-input readonly v-model="form.owner" />
          </div>
          <div>
            <div>전화번호</div>
            <ml-input v-model="form.phoneNumber" />
          </div>
          <div>
            <div>보관자</div>
            <ml-input v-model="form.custodian" />
          </div>
        </div>
      </div>

      <!-- 기본현황 -->
      <div class="mt-28px">
        <h5 class="mb-4"><i class="dot"></i> 기본현황</h5>
        <div class="writeGridContainer">
          <div>
            <div>시설물번호</div>
            <ml-input v-model="form.facilityNumber" />
          </div>
          <div>
            <div>관리번호</div>
            <ml-input v-model="form.managementNumber" />
          </div>
          <div>
            <div>시설물명</div>
            <ml-input v-model="form.facilityName" />
          </div>
          <div>
            <div>노선 - 구분</div>
            <ml-input v-model="form.routeDivision" />
          </div>
          <div>
            <div>노선 - 세부노선</div>
            <ml-input v-model="form.routeDetail" />
          </div>
          <div class="writeGridLineItem">
            <div>시설물 구분</div>
            <vs-select autocomplete v-model="cat1" @click="catLock = false" @change="onChangeCat1">
              <vs-select-item v-for="option in cat1List" :key="option" :text="option" :value="option" />
            </vs-select>
          </div>
          <div class="writeGridLineItem">
            <div>시설물 종류</div>
            <vs-select :disabled="!cat1" autocomplete v-model="cat2" @click="catLock = false" @change="onChangeCat2">
              <vs-select-item v-for="option in cat2List" :key="option" :text="option" :value="option" />
            </vs-select>
          </div>
          <div class="writeGridLineItem">
            <div>시설물 세분류</div>
            <vs-select :disabled="!cat2" autocomplete v-model="cat3" @click="catLock = false" @change="onChangeCat3">
              <vs-select-item v-for="option in cat3List" :key="option" :text="option" :value="option" />
            </vs-select>
          </div>
          <div>
            <div>종별</div>
            <vs-select :disabled="!cat3" autocomplete v-model="cat4" @click="catLock = false" @change="onChangeCat4">
              <vs-select-item v-for="option in cat4List" :key="option.classification" :text="option.classification" :value="option.id" />
            </vs-select>
          </div>
          <div>
            <div>SOC성능평가대상</div>
            <div class="radio">
              <vs-radio v-for="option in ['유', '무']" :key="`SOC성능평가대상_${option}`" v-model="form.socEvaluationTarget" vs-name="SOC성능평가대상" :vs-value="option">{{ option }}</vs-radio>
            </div>
          </div>
          <div class="writeGridCol2">
            <div>주소</div>
            <ml-input v-model="form.address" placeholder="(시,도) (시,군,구) (읍,면,동) (리, 번지 등 주소)" />
          </div>
        </div>
        <div class="writeGridContainer">
          <div>
            <div>관리주체</div>
            <ml-input v-model="form.management_entity" />
          </div>
          <div>
            <div>관리주체구분</div>
            <div class="radio">
              <vs-radio v-for="option in ['중앙부처', '지자체', '(국가/지방)공기업', '민간']" :key="`관리주체구분_${option}`" v-model="form.management_type" vs-name="관리주체구분" :vs-value="option">{{ option }}</vs-radio>
            </div>
          </div>
        </div>
        <div class="writeGridContainer">
          <div>
            <div>소유자</div>
            <ml-input v-model="form.owner" />
          </div>
          <div>
            <div>소유자구분</div>
            <div class="radio">
              <vs-radio v-for="option in ['중앙부처', '지자체', '(국가/지방)공기업', '민간']" :key="`소유자구분_${option}`" v-model="form.ownerType" vs-name="소유자구분" :vs-value="option">{{ option }}</vs-radio>
            </div>
          </div>
        </div>
        <div class="writeGridContainer">
          <div>
            <div>사업계획승인일</div>
            <DateSelector v-model="form.businessPlanApprovalDate" />
          </div>
          <div>
            <div>준공(사용승인)일</div>
            <DateSelector v-model="form.completionDate" />
          </div>
          <div>
            <div>하자담보책임만료일</div>
            <DateSelector v-model="form.defectLiabilityExpirationDate1" />
          </div>
          <div>
            <div>상세제원</div>
            <div class="radio">
              <vs-radio v-for="option in ['유', '무']" :key="`상세제원_${option}`" v-model="form.detailedSpecifications" vs-name="상세제원" :vs-value="option">{{ option }}</vs-radio>
            </div>
          </div>
          <div>
            <div>안전점검 및 정밀안전진단 이력</div>
            <div class="radio">
              <vs-radio v-for="option in ['유', '무']" :key="`안전점검및정밀안전진이력_${option}`" v-model="form.safetyInspectionAndDiagnosisHistory" vs-name="안전점검및정밀안전진이력" :vs-value="option">{{ option }}</vs-radio>
            </div>
          </div>
          <div>
            <div>보수·보강 이력</div>
            <div class="radio">
              <vs-radio v-for="option in ['유', '무']" :key="`보수보강이력_${option}`" v-model="form.repairAndReinforcementHistory" vs-name="보수보강이력" :vs-value="option">{{ option }}</vs-radio>
            </div>
          </div>
        </div>
        <div class="writeGridContainer">
          <div>
            <div>환기구 덮개 (접근 가능한 환기구)</div>
            <ml-input v-model="form.accessibleVentCover" />
          </div>
        </div>
        <div class="writeGridContainer">
          <div>
            <div>설계기간</div>
            <DateSelectorRang v-model="form.designPeriod" />
          </div>
          <div>
            <div>설계자</div>
            <ml-input v-model="form.designer" />
          </div>
          <div>
            <!--            <div>하자담보책임만료일</div>-->
            <!--            <DateSelector v-model="form.defectLiabilityExpirationDate2" />-->
          </div>
          <div>
            <div>공사기간</div>
            <DateSelectorRang v-model="form.constructionPeriod" />
          </div>
          <div>
            <div>시공자</div>
            <ml-input v-model="form.contractor" />
          </div>
          <div>
            <div>총공사비</div>
            <div class="after-text">
              <comma-input v-model="form.totalConstructionCost" />
              <span>백만원</span>
            </div>
          </div>
          <div>
            <div>내진설계 대상 유무</div>
            <div class="radio">
              <vs-radio v-for="option in ['대상', '미대상', '불명']" :key="`내진설계대상유무_${option}`" v-model="form.seismicDesignTarget" vs-name="내진설계대상유무" :vs-value="option">{{ option }}</vs-radio>
            </div>
          </div>
          <div>
            <div>내진설계 적용 유무</div>
            <div class="radio">
              <vs-radio v-for="option in ['적용', '미적용', '불명']" :key="`내진설계적용유무_${option}`" v-model="form.seismicDesignApplication" vs-name="내진설계적용유무" :vs-value="option">{{ option }}</vs-radio>
            </div>
          </div>
          <div>
            <div>적용내진설계기준</div>
            <ml-input v-model="form.seismicDesignStandard" />
          </div>
          <div>
            <div>내진성능평가 실시 유무</div>
            <div class="radio">
              <vs-radio v-for="option in ['실시', '미실시', '불명']" :key="`내진성능평가실시유무_${option}`" v-model="form.seismicPerformanceEvaluation" vs-name="내진성능평가실시유무" :vs-value="option">{{ option }}</vs-radio>
            </div>
          </div>
          <div>
            <div>내진보강 유무</div>
            <div class="radio">
              <vs-radio v-for="option in ['실시', '미실시', '불명']" :key="`내진보강유무_${option}`" v-model="form.seismicReinforcement" vs-name="내진보강유무" :vs-value="option">{{ option }}</vs-radio>
            </div>
          </div>
        </div>
        <div class="writeGridContainer">
          <div>
            <div>영21조대상</div>
            <div class="radio">
              <vs-radio v-for="option in ['예', '아니오']" :key="`영21조대상_${option}`" v-model="form.young21Target" vs-name="영21조대상" :vs-value="option">{{ option }}</vs-radio>
            </div>
          </div>
          <div>
            <div>감리기간</div>
            <DateSelectorRang v-model="form.auditPeriod" />
          </div>
          <div>
            <div>감리자(책임감리원)</div>
            <ml-input v-model="form.auditor" />
          </div>
          <div>
            <div>사업주체(발주자)</div>
            <ml-input v-model="form.projectOwner" />
          </div>
          <div>
            <div>공사명</div>
            <ml-input v-model="form.constructionName" />
          </div>
          <div>
            <div>공사감독·공사관리관</div>
            <ml-input v-model="form.constructionSupervisor" />
          </div>
          <div>
            <div>작성일</div>
            <DateSelector :value="form.creationDate" />
          </div>
          <div>
            <div>작성자</div>
            <ml-input :value="form.author" />
          </div>
          <div>
            <div>서명</div>
            <sign-field v-model="form.signature" />
          </div>
          <div>
            <div>최종 수정일</div>
            <DateSelector :value="form.lastModifiedDate" />
          </div>
          <div>
            <div>최종 수정자</div>
            <ml-input :value="form.lastModifiedBy" />
          </div>
          <div class="writeGridLineItem">
            <div>비고</div>
            <ml-textarea v-model="form.remarks" />
          </div>
        </div>
      </div>
    </div>

    <!-- 상세제원(제방) -->
    <div class="mt-28px">
      <h5 class="mb-4"><i class="dot"></i> 상세제원(제방)</h5>
      <div class="writeGridContainer">
        <div>
          <div>하천수계</div>
          <ml-input v-model="form.하천수계" />
        </div>
        <div>
          <div>하천명</div>
          <ml-input v-model="form.하천명" />
        </div>
        <div>
          <div>하천등급</div>
          <ml-input v-model="form.하천등급" />
        </div>
        <div>
          <div>하천에서의 좌우위치 (상류에서 하류쪽으로)</div>
          <ml-input v-model="form.하천에서의좌우위치" />
        </div>
        <div>
          <div>제방연장</div>
          <ml-input v-model="form.제방연장" />
        </div>
        <div>
          <div>계획홍수량</div>
          <ml-input v-model="form.계획홍수량" />
        </div>
        <div>
          <div>기준여유고</div>
          <ml-input v-model="form.기준여유고" />
        </div>
      </div>
    </div>

    <!-- - 제방 -->
    <div class="mt-28px">
      <h5 class="bold mb-4">- 제방</h5>
      <table>
        <colgroup>
          <col />
          <col width="340" />
        </colgroup>
        <thead>
        <th>구분</th>
        <th>제방위치 (읍면동까지기입)</th>
        <th>둑마루표고</th>
        <th>계획홍수위</th>
        <th>여유고</th>
        <th>제방고</th>
        <th>둑마루폭</th>
        <th>앞턱폭</th>
        <th>뒷턱폭</th>
        <th>제방저폭</th>
        <th>앞비탈경사</th>
        <th>뒷비탈경사</th>
        </thead>
        <tbody>
        <tr>
          <td>시점</td>
          <td><ml-input v-model="form.제방시점.제방위치" class="w-full" /></td>
          <td><ml-input v-model="form.제방시점.둑마루표고" class="w-full" /></td>
          <td><ml-input v-model="form.제방시점.계획홍수위" class="w-full" /></td>
          <td><ml-input v-model="form.제방시점.여유고" class="w-full" /></td>
          <td><ml-input v-model="form.제방시점.제방고" class="w-full" /></td>
          <td><ml-input v-model="form.제방시점.둑마루폭" class="w-full" /></td>
          <td><ml-input v-model="form.제방시점.앞턱폭" class="w-full" /></td>
          <td><ml-input v-model="form.제방시점.뒷턱폭" class="w-full" /></td>
          <td><ml-input v-model="form.제방시점.제방저폭" class="w-full" /></td>
          <td><ml-input v-model="form.제방시점.앞비탈경사" class="w-full" /></td>
          <td><ml-input v-model="form.제방시점.뒷비탈경사" class="w-full" /></td>
        </tr>
        <tr>
          <td>종점</td>
          <td><ml-input v-model="form.제방종점.제방위치" class="w-full" /></td>
          <td><ml-input v-model="form.제방종점.둑마루표고" class="w-full" /></td>
          <td><ml-input v-model="form.제방종점.계획홍수위" class="w-full" /></td>
          <td><ml-input v-model="form.제방종점.여유고" class="w-full" /></td>
          <td><ml-input v-model="form.제방종점.제방고" class="w-full" /></td>
          <td><ml-input v-model="form.제방종점.둑마루폭" class="w-full" /></td>
          <td><ml-input v-model="form.제방종점.앞턱폭" class="w-full" /></td>
          <td><ml-input v-model="form.제방종점.뒷턱폭" class="w-full" /></td>
          <td><ml-input v-model="form.제방종점.제방저폭" class="w-full" /></td>
          <td><ml-input v-model="form.제방종점.앞비탈경사" class="w-full" /></td>
          <td><ml-input v-model="form.제방종점.뒷비탈경사" class="w-full" /></td>
        </tr>
        </tbody>
      </table>
    </div>

    <!-- - 호안 -->
    <div class="mt-28px">
      <h5 class="bold mb-4">- 호안</h5>
      <table class="mb-4">
        <thead>
        <th>종류</th>
        <th>연장(m)</th>
        <th>폭(m)</th>
        </thead>
        <tbody>
        <tr>
          <td><ml-input v-model="form.호안종류" class="w-full" /></td>
          <td><ml-input v-model="form.호안연장" class="w-full" /></td>
          <td><ml-input v-model="form.호안폭" class="w-full" /></td>
        </tr>
        </tbody>
      </table>
    </div>

    <!-- 하천정비계획일자, 기타 상세제원 -->
    <div class="mt-28px">
      <div class="writeGridContainer">
        <div>
          <div>하천정비계획일자</div>
          <date-selector v-model="form.하천정비계획일자" />
        </div>
        <div class="writeGridLineItem">
          <div>기타 상세제원</div>
          <ml-textarea v-model="form.otherSpecifications" />
        </div>
      </div>
    </div>

    <!-- 관리 부서 및 업체 등록 -->
    <company-add-module
      title="관리 부서 및 업체 등록"
      :tableColumns="[
        { head: '구분', key: 'com_type' },
        { head: '부서(업체)명', key: 'com_name' },
        { head: '연락처', key: 'phone' },
      ]"
      :isSimple="true"
      v-model="companyList"
      @remove="removeCompany"
    />

    <!-- 전경사진 -->
    <photo-upload-grid-module :row-count="2" :grid-count="2" v-model="form.photoList" section-title="전경사진" placeholder="전경사진" />

    <file-upload-module v-model="fileList" class="mt-28px" />
  </vx-card>
</template>

<script>
import FileUploadModule from "@/views/modules/FileUploadModule";
import CompanyAddModule from "@/views/_BS/components/CompanyAddModule";
import DateSelector from "@/components/selector/DateSelector";
import DateSelectorRang from "@/components/selector/DateSelectorRang";
import SignField from "@/components/SignField.vue";
import PhotoUploadGridModule from "@/views/modules/PhotoUploadGridModule";

export default {
  components: {
    FileUploadModule,
    CompanyAddModule,
    DateSelector,
    DateSelectorRang,
    SignField,
    PhotoUploadGridModule,
  },
  data() {
    return {
      form: {
        phoneNumber: "",
        custodian: "",

        facilityNumber: "",
        managementNumber: "",
        facilityName: "",
        routeDivision: "",
        routeDetail: "",

        facility_category_id: "",

        socEvaluationTarget: "",
        address: "",
        management_entity: "",
        management_type: "",
        owner: "",
        ownerType: "",
        businessPlanApprovalDate: "",
        completionDate: "",
        defectLiabilityExpirationDate1: "",
        detailedSpecifications: "",
        safetyInspectionAndDiagnosisHistory: "",
        repairAndReinforcementHistory: "",
        accessibleVentCover: "",
        designPeriod: "",
        designer: "",
        defectLiabilityExpirationDate2: "",
        constructionPeriod: "",
        contractor: "",
        totalConstructionCost: "",
        seismicDesignTarget: "",
        seismicDesignApplication: "",
        seismicDesignStandard: "",
        seismicPerformanceEvaluation: "",
        seismicReinforcement: "",
        young21Target: "",
        auditPeriod: "",
        auditor: "",
        projectOwner: "",
        constructionName: "",
        defectLiabilityExpirationDate: "",
        constructionSupervisor: "",
        creationDate: "",
        author: "",
        signature: "",
        lastModifiedDate: "",
        lastModifiedBy: "",
        remarks: "",

        하천수계: "",
        하천명: "",
        하천등급: "",
        하천에서의좌우위치: "",
        제방연장: "",
        계획홍수량: "",
        기준여유고: "",

        제방시점: {
          제방위치: "",
          둑마루표고: "",
          계획홍수위: "",
          여유고: "",
          제방고: "",
          둑마루폭: "",
          앞턱폭: "",
          뒷턱폭: "",
          제방저폭: "",
          앞비탈경사: "",
          뒷비탈경사: "",
        },
        제방종점: {
          제방위치: "",
          둑마루표고: "",
          계획홍수위: "",
          여유고: "",
          제방고: "",
          둑마루폭: "",
          앞턱폭: "",
          뒷턱폭: "",
          제방저폭: "",
          앞비탈경사: "",
          뒷비탈경사: "",
        },

        호안종류: "",
        호안연장: "",
        호안폭: "",

        하천정비계획일자: "",
        otherSpecifications: "",

        companyList: [],
        photoList: [],
      },

      companyList: [],
      userList: [],
      joinUsers: [],
      fileList: [],

      catLock: true,
      cat1: "",
      cat2: "",
      cat3: "",
      cat4: "",
      cat1List: [],
      cat2List: [],
      cat3List: [],
      cat4List: [],
    };
  },
  computed: {
    projectId() {
      return Number(this.$route.params.proj_id);
    },
    fieldId() {
      return this.$route.params.fieldId;
    },
    myInfo() {
      return this.$store.state.auth.userInfo;
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
  async mounted() {
    await this.$store.dispatch("project/LOAD_FIELD_FACILITY_CATEGORY_OPTIONS", {});

    const _cat1List = this.$store.state.project.fieldFacilityCategoryOptions.map((item) => item.cat1);
    this.cat1List = this.setCatOther(_cat1List);

    if (this.fieldId) {
      await this.loadField();
    }
  },
  methods: {
    async loadField() {
      const fieldId = this.fieldId;
      await this.$store.dispatch("project/LOAD_FIELD", { fieldId });
      const info = JSON.parse(JSON.stringify(this.$store.state.project.fieldInfo));

      this.joinUsers = info.users;
      this.form = { ...this.form, ...info, ...JSON.parse(info.meta) };

      if (this.form.facility_category) {
        this.cat1 = this.form.facility_category.cat1;
        this.cat2 = this.form.facility_category.cat2;
        this.cat3 = this.form.facility_category.cat3;
        this.cat4 = this.form.facility_category.id;
      }

      if (this.form.companies && info.companies.length > 0) {
        const companies = [];
        for (const company of info.companies) {
          companies.push(company);
        }
        this.companyList = companies;

        await this.initMembers();
      }

      if (this.form.fileList) {
        this.fileList = this.form.fileList;
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

    // ==================================================
    // ==================== Category ====================
    // ==================================================
    async onChangeCat1(data) {
      if (data && !this.catLock) {
        await this.$store.dispatch("project/LOAD_FIELD_FACILITY_CATEGORY_OPTIONS", { cat1: data });
        const _cat2List = this.$store.state.project.fieldFacilityCategoryOptions.map((item) => item.cat2);
        this.cat2List = this.setCatOther(_cat2List);
        this.cat2 = "";
        this.cat3 = "";
        this.cat4 = "";
      }
    },
    async onChangeCat2(data) {
      if (data && !this.catLock) {
        await this.$store.dispatch("project/LOAD_FIELD_FACILITY_CATEGORY_OPTIONS", { cat1: this.cat1, cat2: data });
        const _cat3List = this.$store.state.project.fieldFacilityCategoryOptions.map((item) => item.cat3);
        this.cat3List = this.setCatOther(_cat3List);
        this.cat3 = "";
        this.cat4 = "";
      }
    },
    async onChangeCat3(data) {
      if (data && !this.catLock) {
        await this.$store.dispatch("project/LOAD_FIELD_FACILITY_CATEGORY_OPTIONS", { cat1: this.cat1, cat2: this.cat2, cat3: data });
        this.cat4List = this.$store.state.project.fieldFacilityCategoryOptions;
        this.cat4 = "";
      }
    },
    onChangeCat4(data) {
      if (!this.catLock) this.form.facility_category_id = data;
    },

    // 정렬 후 기타, 기타 외를 배열의 마지막으로 이동하는 함수
    setCatOther(list) {
      list.sort();

      const etcIndex = list.indexOf("기타");
      if (etcIndex > -1) {
        list.splice(etcIndex, 1);
        list.push("기타");
      }
      const etcOutIndex = list.indexOf("기타 외");
      if (etcOutIndex > -1) {
        list.splice(etcOutIndex, 1);
        list.push("기타 외");
      }

      return list;
    },

    // ==================================================
    // ==================================================

    customAlert(msg, title) {
      const customAlert = new CustomEvent("customAlert", {
        detail: {
          title: title ? title : "오류가 발생했습니다",
          message: msg,
        },
      });
      window.dispatchEvent(customAlert);
    },

    onClickSave() {
      // 필수 : facilityNumber, facilityName,
      if (!this.form.facilityNumber) {
        this.customAlert("시설물 번호를 입력해주세요.");
        return;
      }
      if (!this.form.facilityName) {
        this.customAlert("시설물명을 입력해주세요.");
        return;
      }

      const option = {
        project_id: this.projectId, // 프로젝트 ID
        field_name: this.form.facilityName, // 현장(시설물, 사업장) 이름
        contract_code: this.form.facilityNumber, // 계약번호
        address: this.form.address, // 주소
        phone: this.form.phoneNumber, // 대표번호
        be_completed_at: this.form.completionDate, // 준공일
        deposit_amount: this.form.totalConstructionCost, // 총공사비
        facility_category_id: this.cat4, // Category
        uploads: this.fileList.map((file) => file.id), // 파일
      };

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
      option.company_ids = company_ids;
      option.user_ids = user_ids;

      // Meta
      option.meta = { ...this.form };

      this.$emit('save', option)
    },
    onClickDelete () { this.$emit('delete', this.fieldId) },
    onClickMoveList () { this.$emit('moveList') },
  },
};
</script>

<style scoped lang="scss">
table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;

  th,
  td {
    font-size: 14px;
    font-weight: 500;
    text-align: center;

    border: 1px solid #cdcdcd;
    padding: 5px;
  }

  th {
    background: #f9f9f9;
    padding: 10px 4px;
  }
}
</style>
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
