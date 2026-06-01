<template>
  <vx-card>
    <div>
      <div class="flex justify-between items-center">
        <p style="font-size: 18px; font-weight: 700">교량</p>
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
            <div>하자담보책임만료일</div>
            <DateSelector v-model="form.defectLiabilityExpirationDate3" />
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

    <!-- 상세제원(교량) -->
    <div class="mt-28px">
      <h5 class="mb-4"><i class="dot"></i> 상세제원(교량)</h5>
      <div class="writeGridContainer">
        <div class="writeGridCol2">
          <div>교량 시점위치</div>
          <ml-input v-model="form.bridgeStartLocation" placeholder="(시,도) (시,군,구) (읍,면,동) (리, 번지 등 주소)" />
        </div>
        <div class="writeGridCol2">
          <div>교량 종점위치</div>
          <ml-input v-model="form.bridgeEndLocation" placeholder="(시,도) (시,군,구) (읍,면,동) (리, 번지 등 주소)" />
        </div>
      </div>
      <div class="writeGridContainer">
        <div>
          <div>설계활하중</div>
          <ml-input v-model="form.designLiveLoad" />
        </div>
        <div>
          <div>허용통행하중</div>
          <ml-input v-model="form.permittedLiveLoad" />
        </div>
      </div>
    </div>
    <table class="mt-28px">
      <thead>
      <th>연장 - 길이(m)</th>
      <th>연장 - 경간수</th>
      <th>연장 - 최대경간수</th>
      <th>폭(m) - 보도</th>
      <th>폭(m) - 차도</th>
      <th>계</th>
      <th>차로수 - 상행</th>
      <th>차로수 - 하행</th>
      <th>계</th>
      <th>내진설계적용여부</th>
      </thead>
      <tbody>
      <td><comma-input v-model="form.bridgeLength" class="w-full" /></td>
      <td><comma-input v-model="form.bridgeSpanCount" class="w-full" /></td>
      <td><comma-input v-model="form.bridgeMaxSpanCount" class="w-full" /></td>
      <td><comma-input v-model="form.bridgeSidewalkWidth" class="w-full" /></td>
      <td><comma-input v-model="form.bridgeRoadwayWidth" class="w-full" /></td>
      <td><comma-input readonly :value="Number(form.bridgeSidewalkWidth) + Number(form.bridgeRoadwayWidth)" class="w-full" /></td>
      <td><comma-input v-model="form.bridgeUpstreamLanes" class="w-full" /></td>
      <td><comma-input v-model="form.bridgeDownstreamLanes" class="w-full" /></td>
      <td><comma-input readonly :value="Number(form.bridgeUpstreamLanes) + Number(form.bridgeDownstreamLanes)" class="w-full" /></td>
      <td>
        <div class="flex items-center justify-center gap-3">
          <vs-radio v-for="option in ['적용', '미적용']" :key="`내진설계적용여부_${option}`" v-model="form.seismicDesignApplied" vs-name="내진설계적용여부" :vs-value="option">{{ option }}</vs-radio>
        </div>
      </td>
      </tbody>
    </table>

    <!-- 상부구조 -->
    <div class="mt-28px">
      <h5 class="bold mb-4">-상부구조</h5>
      <div class="writeGridContainer">
        <div>
          <div>경간구성</div>
          <ml-input v-model="form.상부구조.경간구성" />
        </div>
        <div>
          <div>하부통과제한높이(m)</div>
          <comma-input v-model="form.상부구조.하부통과제한높이" />
        </div>
      </div>
      <table class="mt-28px">
        <thead>
        <th>구분</th>
        <th>경간형식</th>
        <th>받침종류</th>
        <th>신축이음종류</th>
        </thead>
        <tbody>
        <tr>
          <td>대표</td>
          <td><ml-input v-model="form.상부구조.대표.경간형식" class="w-full" /></td>
          <td><ml-input v-model="form.상부구조.대표.받침종류" class="w-full" /></td>
          <td><ml-input v-model="form.상부구조.대표.신축이음종류" class="w-full" /></td>
        </tr>
        <tr>
          <td>기타</td>
          <td><ml-input v-model="form.상부구조.기타.경간형식" class="w-full" /></td>
          <td><ml-input v-model="form.상부구조.기타.받침종류" class="w-full" /></td>
          <td><ml-input v-model="form.상부구조.기타.신축이음종류" class="w-full" /></td>
        </tr>
        </tbody>
      </table>
    </div>

    <!-- 하부구조 -->
    <div class="mt-28px">
      <h5 class="bold mb-4">-하부구조</h5>
      <div class="writeGridContainer">
        <div>
          <div>교차노선(또는 교차하천)</div>
          <ml-input v-model="form.하부구조.교차노선" />
        </div>
        <div>
          <div>교차하천 최고수심(m)</div>
          <comma-input v-model="form.하부구조.교차하천" />
        </div>
      </div>
      <table class="mt-28px">
        <thead>
        <th>구분</th>
        <th>교각 - 형식</th>
        <th>교각 - 기초형식</th>
        <th>교대 - 형식</th>
        <th>교대 - 기초형식</th>
        </thead>
        <tbody>
        <tr>
          <td>대표</td>
          <td><ml-input v-model="form.하부구조.대표.교각형식" class="w-full" /></td>
          <td><ml-input v-model="form.하부구조.대표.교각기초형식" class="w-full" /></td>
          <td><ml-input v-model="form.하부구조.대표.교대형식" class="w-full" /></td>
          <td><ml-input v-model="form.하부구조.대표.교대기초형식" class="w-full" /></td>
        </tr>
        <tr>
          <td>기타</td>
          <td><ml-input v-model="form.하부구조.기타.교각형식" class="w-full" /></td>
          <td><ml-input v-model="form.하부구조.기타.교각기초형식" class="w-full" /></td>
          <td><ml-input v-model="form.하부구조.기타.교대형식" class="w-full" /></td>
          <td><ml-input v-model="form.하부구조.기타.교대기초형식" class="w-full" /></td>
        </tr>
        </tbody>
      </table>
    </div>

    <div class="mt-28px">
      <div class="writeGridContainer">
        <div>
          <div>하천해상교량 해당여부</div>
          <div class="radio">
            <vs-radio v-for="option in ['해당', '미해당']" :key="`하천해상교량해당여부_${option}`" v-model="form.bridgeStatus" vs-name="하천해상교량해당여부" :vs-value="option">{{ option }}</vs-radio>
          </div>
        </div>
        <div>
          <div class="writeGridCol2">부착시설내용</div>
          <ml-input v-model="form.attachmentContent" />
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
        defectLiabilityExpirationDate3: "",
        constructionSupervisor: "",
        creationDate: "",
        author: "",
        signature: "",
        lastModifiedDate: "",
        lastModifiedBy: "",
        remarks: "",

        bridgeStartLocation: "",
        bridgeEndLocation: "",
        designLiveLoad: "",
        permittedLiveLoad: "",

        bridgeLength: "",
        bridgeSpanCount: "",
        bridgeMaxSpanCount: "",
        bridgeSidewalkWidth: "",
        bridgeRoadwayWidth: "",
        bridgeTotalWidth: "",
        bridgeUpstreamLanes: "",
        bridgeDownstreamLanes: "",
        bridgeTotalLanes: "",
        seismicDesignApplied: "",

        상부구조: {
          경간구성: "",
          하부통과제한높이: "",
          대표: {
            경간형식: "",
            받침종류: "",
            신축이음종류: "",
          },
          기타: {
            경간형식: "",
            받침종류: "",
            신축이음종류: "",
          },
        },
        하부구조: {
          교차노선: "",
          교차하천: "",
          대표: {
            교각형식: "",
            교각기초형식: "",
            교대형식: "",
            교대기초형식: "",
          },
          기타: {
            교각형식: "",
            교각기초형식: "",
            교대형식: "",
            교대기초형식: "",
          },
        },

        bridgeStatus: "",
        attachmentContent: "",
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
      const info = this.$store.state.project.fieldInfo;

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

      if (this.form.photoList) {
        this.form.photoList = this.form.photoList;
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
          title: !!title ? title : "오류가 발생했습니다",
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
