<template>
  <vs-popup id="popupEditCompany" :title="title" :active.sync="showPopup" class="popupEditCompany">
    <div class="popupEditCompany_content">
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
          <!-- 업체명 -->
          <vs-col class="grid mt-4 px-2" style="grid-template-columns: 128px 1fr">
            <span class="pt-3">업체명</span>
            <div style="position: relative">
              <ml-input class="w-full" v-model="form.com_name" @focusout="handleFocusoutComName()" />
              <span v-if="error.com_name" class="red">{{ error.message.com_name }}</span>
              <div v-if="error.com_name" class="p-3" style="position: absolute; top: 0; right: 0">
                <img :src="require('./error.svg')" />
              </div>
            </div>
          </vs-col>

          <!-- 대표자 -->
          <vs-col class="grid mt-4 px-2" style="grid-template-columns: 128px 1fr">
            <span class="pt-3">대표자</span>
            <div style="position: relative">
              <ml-input class="w-full" v-model="form.com_ceo" />
              <span v-if="error.com_ceo" class="red">{{ error.message.com_ceo }}</span>
              <div v-if="error.com_ceo" class="p-3" style="position: absolute; top: 0; right: 0">
                <img :src="require('./error.svg')" />
              </div>
            </div>
          </vs-col>

          <!-- 사업자등록번호 -->
          <vs-col class="grid mt-4 px-2" style="grid-template-columns: 128px 1fr">
            <span class="pt-3">사업자등록번호</span>
            <div style="position: relative">
              <corporate-number-input class="w-full" v-model="form.com_number" @focusout="handleFocusoutComNumber()"/>
              <span v-if="error.com_number" class="red">{{ error.message.com_number }}</span>
              <div v-if="error.com_number" class="p-3" style="position: absolute; top: 0; right: 0">
                <img :src="require('./error.svg')" />
              </div>
            </div>
          </vs-col>

          <!-- 주소 -->
          <vs-col class="grid mt-4 px-2" style="grid-template-columns: 128px 1fr">
            <span class="pt-3">주소</span>
            <div style="position: relative">
              <address-field class="w-full" v-model="form.address" />
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
              <ml-input class="w-full" v-model="form.com_business_class" />
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
              <ml-input class="w-full" v-model="form.com_business_type" />
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
              <ml-input class="w-full" v-model="form.director" />
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
              <ml-input class="w-full" v-model="form.phone" />
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
              <file-uploader class="w-full" v-model="form.file" />
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
          <vs-button class="mr-4" color="#EDEDED" text-color="black" type="filled" @click="handleClickClose">닫기</vs-button>
          <vs-button v-if="companyId" class="" color="secondary" @click="handleClickSave">수정</vs-button>
          <vs-button v-else class="" color="secondary" @click="handleClickSave">등록</vs-button>
        </vs-col>
      </vs-row>
    </div>
  </vs-popup>
</template>

<script>
import FileUploader from "@/components/FileUploader.vue";
import AddressField from "@/components/AddressField.vue";
import HttpRequest from "@/util/HttpRequest";
import CorporateNumberInput from "@/components/CorporateNumberInput.vue";

export default {
  name: "PopupEditCompany",
  props: {
    value: Boolean,
    companyId: [String, Number],
    title: {
      type: String,
      default: "업체 정보",
    },
  },
  components: {
    CorporateNumberInput,
    AddressField,
    FileUploader,
  },

  watch: {
    value(data) {
      this.showPopup = data;
      if (this.showPopup && this.companyId) {
        this.loadCompany();
      } else if (!this.showPopup) {
        this.initForm();
      }
    },
    showPopup(value) {
      const body = document.querySelector('body');
      if (value) {
        body.style.overflow = 'hidden'
        this.closedByButton = false; // 팝업이 열릴 때 플래그 초기화
      } else {
        body.style.overflow = 'auto'
        // X 버튼으로 팝업이 닫힐 때만 close 이벤트 emit (닫기 버튼이 아닌 경우)
        if (!this.closedByButton) {
          this.$emit("close");
        }
        this.closedByButton = false; // 플래그 초기화
      }

      this.$emit("input", value);
    },
    "form.address": {
      handler(address) {
        if (address && address.home_address_1 && address.home_zip) {
          this.form.com_address = `${address.home_address_1} (${address.home_zip})`;
        }
      },
    },
    companyId() {
      if (this.showPopup && this.companyId) {
        this.loadCompany();
      }
    },
  },
  computed: {
    projectList() {
      return this.$store.state.project.projectListInfo.data;
    },
    projectId() {
      return parseInt(this.$route.params.proj_id);
    },
  },
  data() {
    return {
      showPopup: false,
      isMobile: false,
      originalComNumber: "", // 원본 사업자등록번호 저장 변수 추가
      closedByButton: false, // "닫기" 버튼으로 닫힌 경우 플래그

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
    async loadCompany() {
      if (this.companyId) {
        await HttpRequest.get(`/api/v1/company/${this.companyId}`)
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
            this.$emit("error", "업체 정보를 불러오는데 실패했습니다.");
          });
      }
    },

    initForm() {
      this.form = {
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
      const option = { com_name: this.form.com_name };
      if (option.com_name) {
        this.$store.dispatch("company/CHECK_EXIST", option).then((value) => {
          if (value.isEmpty || (this.companyId && value.id === this.companyId)) {
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

    handleFocusoutComNumber() {
      const option = { com_number: this.form.com_number };
      if (option.com_number) {
        this.$store.dispatch("company/CHECK_EXIST", option).then((value) => {
          if (value.isEmpty || (this.companyId && value.id === this.companyId)) {
            this.error.com_number = false;
            this.error.message.com_number = "";
          } else {
            this.error.com_number = true;
            this.error.message.com_number = "이미 등록되어 있는 사업자번호입니다.";
          }
        }).catch(() => {
          this.error.com_number = true;
          this.error.message.com_number = "올바른 사업자번호를 입력해주세요.";
        });
      } else {
        this.error.com_number = false;
        this.error.message.com_number = "";
      }
    },

    handleClickClose() {
      this.closedByButton = true; // "닫기" 버튼으로 닫힘을 표시
      this.$emit("input", false);
      this.$emit("close");
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
      if (!this.companyId || (this.form.com_number !== this.originalComNumber)) {
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

      if (this.companyId) {
        option.id = this.companyId;
        this.$store
          .dispatch("company/UPDATE_COMPANY", option)
          .then(() => {
            this.closedByButton = true; // saved로 닫힘을 표시
            this.$emit("saved");
            this.$emit("input", false);
          })
          .catch(() => {
            this.$emit("error", "업체 정보 수정에 실패했습니다.");
          });
      } else {
        this.$store
          .dispatch("company/CREATE_COMPANY", option)
          .then(() => {
            this.closedByButton = true; // saved로 닫힘을 표시
            this.$emit("saved");
            this.$emit("input", false);
          })
          .catch(() => {
            this.$emit("error", "업체 등록에 실패했습니다.");
          });
      }
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
  },
};
</script>

<style>
#popupEditCompany.popupEditCompany > .vs-popup {
  width: 1200px !important;
  max-width: 90% !important;
}

#popupEditCompany > .vs-popup > .vs-popup--content {
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
}

.popupEditCompany_content {
  height: calc(100% - 40px);
  display: grid;
  grid-auto-rows: 1fr auto;
}
</style>

<style scoped>
.red {
  color: #ea5455;
}
</style>
