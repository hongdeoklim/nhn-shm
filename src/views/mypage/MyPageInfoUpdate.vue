<template>
  <div v-if="!showInfoUpdateForm">
    <vx-card>
      <div class="flex" style="align-items: start">
        <vs-row>
          <vs-col class="mb-6 flex" vs-align="center">
            <h5 style="height: 21px"><i class="dot"></i>{{ $t("content.mypage.info-update.개인정보입력") }}</h5>
          </vs-col>
          <vs-col>
            <vs-row class="flex justify-between mb-4" vs-align="center">
              <h5 class="vx-col sm:w-3/12">현재 비밀번호</h5>
              <vs-input type="password" :max="150" class="vx-col sm:w-8/12 w-full" v-model="loginPassword" @keyup.enter="checkPassword" />
              <vs-button color="secondary" @click="checkPassword">확인</vs-button>
            </vs-row>
          </vs-col>
        </vs-row>
      </div>
    </vx-card>
  </div>
  <div v-else>
    <vs-row style="margin-top: -60px">
      <vs-col class="mb-6 flex" vs-align="center">
        <div class="ml-auto">
          <vs-button class="mr-4" color="secondary" @click="handleUserInfoModified">{{ $t("button.저장") }}</vs-button>
          <vs-button color="#EDEDED" text-color="black" type="filled" @click="handleUserInfoClear">{{ $t("button.취소") }}</vs-button>
        </div>
      </vs-col>
    </vs-row>

    <vx-card>
      <div class="flex" style="align-items: start">
        <vs-row>
          <vs-col class="mb-6 flex" vs-align="center">
            <h5 style="height: 21px"><i class="dot"></i>{{ $t("content.mypage.info-update.개인정보입력") }}</h5>
          </vs-col>
          <vs-col>
            <vs-row class="flex mb-4" vs-align="center">
              <h5 class="vx-col sm:w-3/12">{{ $t("content.mypage.info-update.ID") }}</h5>
              <vs-input class="vx-col sm:w-8/12 w-full" v-model="form.username" readonly />
            </vs-row>
            <vs-row class="flex mb-4" vs-align="center">
              <h5 class="flex vx-col sm:w-3/12">현재 비밀번호</h5>
              <vs-input :max="150" type="password" class="vx-col sm:w-8/12 w-full" v-model="form.password_old" :danger="!!errPasswordOld" :danger-text="errPasswordOld" />
            </vs-row>
            <vs-row class="flex mb-4" vs-align="center">
              <h5 class="flex vx-col sm:w-3/12">{{ $t("content.mypage.info-update.비밀번호") }}</h5>
              <vs-input :max="150" type="password" class="vx-col sm:w-8/12 w-full" v-model="form.password" :danger="!!errPassword" :danger-text="errPassword" />
            </vs-row>
            <vs-row class="flex mb-4" vs-align="center">
              <h5 class="flex vx-col sm:w-3/12">{{ $t("content.mypage.info-update.비밀번호확인") }}</h5>
              <vs-input :max="150" type="password" class="vx-col sm:w-8/12 w-full" v-model="form.password_confirmation" :danger="!!errPasswordConfirm" :danger-text="errPasswordConfirm" />
            </vs-row>
            <vs-row class="flex mb-4" vs-align="center">
              <h5 class="flex vx-col sm:w-3/12">{{ $t("content.mypage.info-update.이름") }}</h5>
              <MlInput :max="50" class="vx-col sm:w-8/12 w-full" v-model="form.name" />
            </vs-row>
            <vs-row class="flex mb-4" vs-align="center">
              <h5 class="flex vx-col sm:w-3/12">{{ $t("content.mypage.info-update.이메일") }}</h5>
              <vs-input class="vx-col sm:w-8/12 w-full" v-model="form.email" />
            </vs-row>
            <vs-row class="flex mb-4" vs-align="center">
              <h5 class="flex vx-col sm:w-3/12">{{ $t("content.mypage.info-update.생년월일") }}</h5>
              <date-selector class="vx-col sm:w-8/12 w-full" v-model="form.birthdate"></date-selector>
            </vs-row>
            <!-- <vs-row class="flex mb-4" vs-align="center">
              <h5 class="flex vx-col sm:w-3/12">핸드폰 번호</h5>
              <vs-input class="vx-col sm:w-8/12 w-full"  v-model="form.mobile" />
            </vs-row> -->
            <vs-row class="flex mb-4" vs-align="start">
              <h5 class="flex vx-col sm:w-3/12" style="height: 37px; align-items: center">{{ $t("content.mypage.info-update.프로필 이미지") }}</h5>
              <div class="sm:w-9/12 m-0 p-0">
                <vs-upload
                  ref="vs_upload_1"
                  :action="fileUpLoad.action"
                  :headers="fileUpLoad.headers"
                  automatic
                  accept="image/gif, image/jpeg, image/png"
                  file-name="file_data"
                  :show-upload-button="false"
                  limit="1"
                  @change="handleChangeFile"
                  @on-success="handleSuccessFileUpload"
                  @on-error="handleErrorFileUpload"
                  @on-delete="handleDeleteFile"
                ></vs-upload>
                <div class="flex" style="align-items: center">
                  <feather-icon icon="AlertCircleIcon" style="color: red; width: 18px; margin-right: 4px" />
                  <span style="color: red">1MB 이하의 이미지형식(JPG, PNG 등) 파일만 업로드 가능합니다</span>
                  <vs-popup :active.sync="showErrorPopup" title="이미지 업로드 실패">
                    <div class="flex" style="align-items: center">
                      <feather-icon icon="AlertCircleIcon" style="width: 18px; margin-right: 4px" />
                      <span>이미지 업로드에 실패하였습니다.</span>
                    </div>
                    <div>
                      <span class="pl-5">(1MB 이하의 jpg, png 등 이미지형식 파일만 업로드 가능합니다)</span>
                    </div>
                  </vs-popup>
                </div>
              </div>
            </vs-row>
          </vs-col>
        </vs-row>
        <vs-row>
          <vs-col class="mb-6 flex" vs-align="center">
            <h5 style="height: 21px"></h5>
          </vs-col>
          <vs-col>
            <vs-row class="flex mb-4" vs-align="center">
              <h5 class="vx-col sm:w-3/12">부서명</h5>
              <vs-input class="vx-col sm:w-8/12 w-full" :value="getCompanyInfo.com_name" readonly />
            </vs-row>
            <vs-row class="flex mb-4" vs-align="center">
              <h5 class="flex vx-col sm:w-3/12">근무지주소</h5>
              <vs-col class="w-8/12">
                <div class="grid" style="grid-template-columns: 1fr auto">
                  <div class="w-full pr-3">
                    <vs-input class="vx-col w-full" readonly placeholder="우편번호" v-model="form.home_zip" />
                  </div>
                  <vs-button color="primary" type="border" @click="postcode.active = true">우편번호</vs-button>
                </div>
              </vs-col>
            </vs-row>
            <vs-row class="flex mb-4" vs-align="center" style="">
              <h5 class="flex vx-col sm:w-3/12"></h5>
              <MlInput :max="150" class="vx-col sm:w-8/12 w-full" readonly v-model="form.home_address_1" />
            </vs-row>
            <vs-row class="flex mb-4" vs-align="center">
              <h5 class="flex vx-col sm:w-3/12"></h5>
              <MlInput :max="100" class="vx-col sm:w-8/12 w-full" v-model="form.home_address_2" />
            </vs-row>
            <vs-row class="flex mb-4" vs-align="center">
              <h5 class="flex vx-col sm:w-3/12">소속</h5>
              <MlInput :max="150" class="vx-col sm:w-8/12 w-full" v-model="form.department" />
            </vs-row>
            <vs-row class="flex mb-4" vs-align="center">
              <h5 class="flex vx-col sm:w-3/12">{{ $t("content.mypage.info-update.직급") }}</h5>
              <MlInput :max="150" class="vx-col sm:w-8/12 w-full" v-model="form.rank" />
            </vs-row>
            <vs-row class="flex mb-4" vs-align="center">
              <h5 class="flex vx-col sm:w-3/12">{{ $t("content.mypage.info-update.전화") }}</h5>
              <MlInput :max="50" class="vx-col sm:w-8/12 w-full" v-model="form.phone" />
            </vs-row>
          </vs-col>
        </vs-row>
      </div>
    </vx-card>

    <!-- 다음우편번호 -->
    <vs-popup id="postcodePopup" :title="postcode.title" :active.sync="postcode.active">
      <vue-daum-postcode @complete="handlePostcodeComplete" />
    </vs-popup>
  </div>
</template>

<script>
import { VueDaumPostcode } from "vue-daum-postcode";
import DateSelector from "@/components/selector/DateSelector";
import FileUploader from "@/components/FileUploaderImg";
import VueCookie from "vue-cookie";
import config from "/public/config";
import HttpRequest from "@/util/HttpRequest";

export default {
  name: "MyPageInfoUpdate",
  components: {
    FileUploader,
    DateSelector,
    VueDaumPostcode,
  },

  computed: {
    getCompanyInfo() {
      return this.$store.state.company.companyInfo;
    },
    myInfo() {
      return this.$store.state.auth.userInfo;
    },
  },

  data() {
    return {
      showInfoUpdateForm: false,
      loginPassword: "",

      phone_1: "",
      phone_2: "",
      phone_3: "",
      form: {
        username: "",
        email: "",
        name: "",
        surname: "",
        password_old: "",
        password: "",
        password_confirmation: "",
        nickname: "",
        birthdate: "",
        mobile: "",
        phone: "",
        home_zip: "",
        home_address_1: "",
        home_address_2: "",
        com_name: "",
        company_zip: "",
        company_address_1: "",
        company_address_2: "",
        mail_destination: "",
        is_activated: "",
        avatar: "",
      },
      oldForm: {},
      postcode: {
        active: false,
        title: "우편번호 검색",
      },
      fileUpLoad: {
        headers: {},
        action: `${config.BASE_API_URL}/api/v1/photo`,
        files: [], // 등록하고자 하는 파일 목록
        oldFileIds: [], // 기존에 등록한 파일Id 목록
      },
      profile: {},
      workPosition: [],
      showErrorPopup: false,

      errPasswordOld: "",
      errPassword: "",
      errPasswordConfirm: "",

      fileNum: null,
    };
  },
  methods: {
    checkPassword() {
      const password = this.loginPassword;

      if (!password) {
        this.errorAlert("비밀번호를 입력해주세요");
        return;
      }

      HttpRequest.post("/api/auth/check", { password })
        .then((response) => {
          this.showInfoUpdateForm = true;

          this.$nextTick(async () => {
            await this.$store.dispatch("USER_INFO");
            const backButtonRouteGuard = this.$router.beforeEach((to, from, next) => {
              if (this.$refs.vs_upload_1.$children && this.$refs.vs_upload_1.$children.length > 0) {
                this.$refs.vs_upload_1.viewActive = false;
                next(false);
              } else if (this.postcode.active) {
                this.postcode.active = false;

                next(false);
              } else {
                next(true);
              }
            });
            this.$once("hook:destroyed", () => {
              backButtonRouteGuard();
            });

            // file upload 시 사용되는 xmlrequest header
            this.fileUpLoad.headers = {
              Authorization: `Bearer ${VueCookie.get("token")}`,
            };
            await this.loadInfoWorkPosition();
            await this.loadMember();
          });
        })
        .catch((err) => {
          const message = typeof err.response.data === "object" ? err.response.data.password[0] : err.response.data;
          switch (message) {
            case "The password must be between 8 and 255 characters.":
              this.errorAlert("비밀번호는 8자 이상 255자 이하로 입력해주세요");
              break;
            default:
              this.errorAlert(message);
              break;
          }
        });
    },

    // 회원정보 불러오기
    async loadMember() {
      const userId = this.$store.state.auth.userInfo.id;
      await this.$store.dispatch("member/LOAD_MEMBER", { userId });

      // 수정된 부분을 체크하기위해 깊은복사를 한다.
      const member = Object.assign({}, this.$store.state.member.memberInfo);

      // 이메일에 @em.pty 이 포함되어있으면 비운다.
      if (member.email.includes("@em.pty")) {
        member.email = "";
      }
      this.form = member;
      await this.$store.dispatch("company/LOAD_COMPANY", { companyId: this.form.company_id });

      // 이슈(MARK_001)을 해결하기 위해 value에 prefix를 추가한다.
      this.subscribe_email = member.subscribe_email ? "email_1" : "email_0";
      this.subscribe_sms = member.subscribe_sms ? "sms_1" : "sms_0";

      // 프로필 이미지 존재시, vs-upload에 이미지를 넣어준다.
      if (member.avatar) {
        if (this.fileNum === null) this.fileNum = 0;
        this.setVsUploadImage(this, member.avatar.path, member.avatar.id);
      }

      this.oldForm = JSON.parse(JSON.stringify(this.form));
    },

    // vs-upload에 초기 이미지 넣기
    async setVsUploadImage(_t, src, uploadedFileId) {
      let orientation = "h";
      const image = new Image();
      image.src = src;
      image.onload = function () {
        if (this.width > this.height) {
          orientation = "w";
        }

        const obj = {
          uploadedFileId,
          src: this.src,
          orientation,
          type: "image",
          percent: null,
          error: false,
          remove: false,
        };

        _t.$refs.vs_upload_1.srcs = [JSON.parse(JSON.stringify(obj))];
        _t.$refs.vs_upload_1.filesx = [JSON.parse(JSON.stringify(obj))];
      };
    },
    async loadInfoWorkPosition() {
      await this.$store.dispatch("project/HSE_LOAD_INFO_WORKPOSITION");
      const list = this.$store.state.project.hseInfoWorkPositionList;

      this.workPosition = [];
      for (const item of list) {
        this.workPosition.push({ text: item.name, value: item.id });
      }
    },

    async handleUserInfoModified() {
      const _form = JSON.parse(JSON.stringify(this.form));

      this.errPasswordOld = "";
      this.errPassword = "";
      this.errPasswordConfirm = "";

      // 비밀번호 변경시 유효성 검사
      if (_form.password_old || _form.password || _form.password_confirmation) {
        if (!_form.password_old) {
          this.errPasswordOld = "현재 비밀번호를 입력해주세요";
        }
        if (!_form.password) {
          this.errPassword = "비밀번호를 입력해주세요";
        }
        if (!_form.password_confirmation) {
          this.errPasswordConfirm = "비밀번호 확인을 입력해주세요";
        }
        if (!this.errPasswordConfirm && _form.password !== _form.password_confirmation) {
          this.errPasswordConfirm = "비밀번호가 일치하지 않습니다";
        }

        // 8자 이상 255자 이하
        if (!this.errPassword && (_form.password.length < 8 || _form.password.length > 255)) {
          this.errPassword = "8자 이상 255자 이하로 입력해주세요";
        }

        // 새로운 비밀번호 소문자, 대문자, 숫자 포함
        if (!this.errPassword && !/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).{8,255}$/.test(_form.password)) {
          this.errPassword = "대문자, 소문자, 숫자를 포함하여 8자 이상 255자 이하로 입력해주세요.";
        }
      }

      if (!!this.errPasswordOld || !!this.errPassword || !!this.errPasswordConfirm) return;

      // 이메일 유효성 검사
      if (_form.email && !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(_form.email.replace(/!/g, ''))) {
        this.errorAlert("이메일 형식이 올바르지 않습니다");
        return;
      }

      // 이메일 중복 여부 확인
      // if (this.oldForm.email !== _form.email) {
      //   const checkExist = await this.$store.dispatch("CHECK_EXIST", { email: _form.email });
      //   if (!checkExist.isEmpty) {
      //     this.errorAlert("이미 사용중인 이메일입니다.");
      //     return;
      //   }
      //   console.log("checkExist", checkExist);
      // } else {
      //   delete _form.email;
      // }

      // 이메일 수정 여부 확인
      if (this.oldForm.email === _form.email) {
        delete _form.email;
      }

      const file = this.fileUpLoad.files[this.fileUpLoad.files.length - 1];
      if (file) _form.avatar = file.uploadedFileId ? file.uploadedFileId : "";
      else delete _form.avatar;

      // _form.phone = `${this.phone_1}${this.phone_2}${this.phone_3}`;
      _form.userId = _form.id;
      _form.is_activated = _form.is_activated ? 1 : 0;

      // 메타 값은 개인정보변경 페이지에서 사용하지 않고 있고,
      // 실제 메타값을 업데이트 할 때 사용하는 데이터 형식과도 다르므로 metas 삭제
      // load 시 전달 받은 metas = [{ id, created_at, updated_at, user_id, meta_key, meta_value }]
      // update 시 전달해야 하는 metas = [{ key, value }]
      delete _form.metas;

      this.$store
        .dispatch("member/MODIFY_MEMBER", _form)
        .then(async (/*value*/) => {
          // 회원정보의 중복 호출을 막기위해 localStorage 에 값이 있을 경우, 변경되지 않으므로,
          // Storage 에 저장된 회원정보를 삭제한다.
          localStorage.removeItem('/api/auth/me')
          await this.$store.dispatch("USER_INFO");
          alert("저장 되었습니다");
          this.oldForm = JSON.parse(JSON.stringify(this.form));
        })
        .catch((err) => {
          const code = err.response.status;
          switch (code) {
            case 400:
              this.errorAlert(err.response.data);
              break;
            case 404:
              this.errorAlert("대상 사용자를 찾을 수 없습니다.");
              break;
            case 403:
              this.errorAlert("회원 정보 변경 권한이 없습니다");
              break;
            case 499:
              if (err.response.data.password_old) {
                this.errPasswordOld = typeof err.response.data.password_old === "object" ? this.errorKo(err.response.data.password_old[0]) : this.errorKo(err.response.data.password_old);
              }
              if (err.response.data.password) {
                this.errPassword = typeof err.response.data.password === "object" ? this.errorKo(err.response.data.password[0]) : this.errorKo(err.response.data.password);
              }
              if (err.response.data.password_confirmation) {
                this.errPasswordConfirm = typeof err.response.data.password_confirmation === "object" ? this.errorKo(err.response.data.password_confirmation[0]) : this.errorKo(err.response.data.password_confirmation);
              }
              break;
            default:
              this.errorAlert(this.errorKo(err.response.data));
              break;
          }
        });
    },

    async handleUserInfoClear() {
      document.location.reload();
      //this.form = JSON.parse(JSON.stringify(this.oldForm))
      //this.fileUpLoad.files.remove()

      //await this.setVsUploadImage(this, this.form.avatar.path, this.form.avatar.id)
    },

    handlePostcodeComplete(data) {
      // 도로명(R), 지번(J)
      const userSelectedType = data.userSelectedType;

      // 우편번호
      const zonecode = data.zonecode;

      // 주소
      let address1 = data.roadAddress;
      if (userSelectedType === "J") {
        address1 = data.jibunAddress;
      }

      // 자택주소
      if (this.postcode.active) {
        this.form.home_zip = zonecode;
        this.form.home_address_1 = address1;
      }

      this.postcode.active = false;
    },

    handleChangeFile(path, files) {
      this.fileUpLoad.files = files;
      this.fileNum = typeof this.fileNum === "number" ? this.fileNum + 1 : 0;
    },

    handleSuccessFileUpload(event) {
      // response
      let response = event.currentTarget.response;
      response = JSON.parse(response);
      const uploadedFileID = response.id;

      const file = this.fileUpLoad.files[this.fileUpLoad.files.length - 1];
      file.uploadedFileId = uploadedFileID;
    },
    handleErrorFileUpload(e) {
      this.$refs.vs_upload_1.removeFile(this.fileNum);
      this.showErrorPopup = true;
    },
    handleDeleteFile(file) {
      if (file.src) {
        this.fileUpLoad.oldFileIds.remove(file.uploadedFileId);
      } else {
        this.fileUpLoad.files.remove(file);
      }
    },

    errorAlert(message) {
      const customAlert = new CustomEvent("customAlert", {
        detail: {
          title: "오류가 발생했습니다",
          message,
        },
      });
      window.dispatchEvent(customAlert);
    },
    errorKo(errMsg) {
      switch (errMsg) {
        case "The password format is invalid.":
          return "대문자, 소문자, 숫자를 포함하여 8자 이상 255자 이하로 입력해주세요.";
        case "The password old must be between 4 and 255 characters.":
        case "The password must be between 8 and 255 characters.":
        case "The password confirmation must be between 8 and 255 characters.":
          return "8자 이상 255자 이하로 입력해주세요";
        case "The password confirmation field is required when password is present.":
          return "비밀번호 확인을 입력해주세요";
        case "The avatar must be an image.":
          return "이미지 파일만 업로드 가능합니다";
        default:
          return errMsg;
      }
    },
  },
};
</script>

<style scoped></style>

<style>
#postcodePopup .vue-daum-postcode-container {
  height: 450px !important;
}

[dir] .con-input-upload {
  margin: 0;
}
[dir] .con-img-upload {
  padding: 0;
}
</style>
