<!-- =========================================================================================
    File Name: Login.vue
    Description: Login Page
    ----------------------------------------------------------------------------------------
    Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
      Author: Pixinvent
    Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->

<template>
  <div id="page-login" class="h-screen flex w-full bg-img vx-row no-gutter items-center justify-center">
    <div class="vx-col">
      <div class="w-full text-center" style="margin-bottom: 64px">
        <img src="@/assets/images/pages/NH_Login.svg" alt="login" style="width: 100%; max-width: 450px" />
      </div>
      <vx-card class="overflow-hidden">
        <div slot="no-body" class="full-page-bg-color">
          <div class="vx-row no-gutter justify-center items-center grid grid-cols-7 md:grid-cols-12" style="max-width: 1150px">
            <!--              style="display: grid; grid-template-columns: 550px 620px; grid-template-rows: 400px;">-->
            <div class="vx-col hidden md:block col-span-5" style="height: 100%; width: 100%">
              <img src="@/assets/images/pages/NH_Image.png" style="width: 100%; height: 100%; object-fit: cover" alt="login" class="mx-auto" />
            </div>
            <div class="vx-col h-full w-full d-theme-dark-bg col-span-7" style="padding: 40px 0px">
              <div class="py-0 md:py-8 px-8 login-tabs-container">
                <div class="vx-card__title mb-4">
                  <h4 class="mb-4">로그인</h4>
                  <p>아이디와 비밀번호를 입력해주세요.</p>
                </div>

                <div class="pt-1">
                  <ml-input name="email" icon-no-border icon="icon icon-user" icon-pack="feather" label-placeholder="아이디 입력" v-model="emailInput" :danger="emailRules" class="w-full" />

                  <ml-input type="password" name="password" icon-no-border icon="icon icon-lock" icon-pack="feather" label-placeholder="비밀번호 입력" v-model="passwordInput" class="w-full mt-6" @keyup.enter="login" />
                  <div class="flex flex-wrap justify-between my-6">
                    <vs-checkbox v-model="checkbox_remember_me" class="mb-3">아이디 기억하기</vs-checkbox>
                    <router-link to="/forgot-password">비밀번호를 잊으셨나요?</router-link>
                  </div>
                  <!--
                  # 자동방지문자 : google
                  -->
                  <vs-button v-if="isLoginInProgress" class="float-right" color="secondary" disabled>잠시만 기다려주세요</vs-button>
                  <vs-button v-else class="float-right" color="secondary" @click="login">로그인</vs-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </vx-card>
    </div>
  </div>
</template>

<script>
import config from "/public/config";
import VueCookie from "vue-cookie";
import constant from "@/constant/constant";

export default {
  watch: {
    checkbox_remember_me(checkbox_remember_me) {
      this.checkbox_remember_me = checkbox_remember_me;
      VueCookie.set("login_remember_me", checkbox_remember_me, 30);

      if (!this.checkbox_remember_me) {
        VueCookie.set("login_remember_email", "");
      }
    },
  },
  data() {
    return {
      hostname: config.HOST_NAME,
      emailInput: "",
      passwordInput: "",
      checkbox_remember_me: false,
      isLoginInProgress: false, // 로그인 진행중인지 여부
    };
  },
  computed: {
    emailRules() {
      return this.checkEmailRule(this.emailInput);
    },
  },
  created() {
    this.checkbox_remember_me = VueCookie.get("login_remember_me") === "true";
    if (this.checkbox_remember_me) {
      this.emailInput = VueCookie.get("login_remember_email") ? VueCookie.get("login_remember_email") : "";
    }
  },
  methods: {
    checkEmailRule(v) {
      if (v === "") {
        return true;
      }

      const regExp = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
      return !regExp.test(v);
    },

    async login() {
      if (this.isLoginInProgress) return;

      const email = this.emailInput;
      const pw = this.passwordInput;

      if (!email) {
        alert("아이디를 입력해주세요");
        return;
      }
      if (email.length < 3) {
        alert("아이디는 3글자 이상이어야 합니다.");
        return;
      }

      if (!pw) {
        alert("비밀번호를 입력해주세요");
        return;
      }

      // 비밀번호가 8자 이상, 소문자, 대문자, 숫자가 포함되어있는지 검증
      // if (!/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).{8,255}$/.test(pw)) {
      //   alert("비밀번호는 8자 이상, 소문자, 대문자, 숫자가 포함되어야 합니다.");
      //   return;
      // }

      this.isLoginInProgress = true;

      this.$store
        .dispatch("LOGIN", {
          email,
          pw,
        })
        .then(() => {
          if (VueCookie.get("login_remember_me") === "true") {
            VueCookie.set("login_remember_email", this.emailInput, 30);
          }

          localStorage.setItem("login_username", email);

          // 프로젝트 개수만큼 삭제해야함.
          // 지금은 임의로 10개 삭제하도록 설정
          for (let i = 0; i < 10; i++) {
            localStorage.removeItem(`${email}_${i + 1}_boardIds`);
          }
          localStorage.removeItem("/api/auth/me");
          localStorage.removeItem("/api/v1/member/all");
          localStorage.removeItem("sub_company");

          const toFullPath = VueCookie.get("LOGIN_TO_FULLPATH");
          if (toFullPath) {
            this.$router.replace(toFullPath).then((value) => {
              VueCookie.delete("LOGIN_TO_FULLPATH"); // 로그인 후 이동할 페이지 삭제
              this.$router.go(0);
            });
          } else {
            this.$router.replace("/home").then((value) => {
              this.$router.go(0);
            });
          }
        })
        .catch((err) => {

          switch (constant.getErrorCode(err)) {
            case constant.ERROR_LOGIN_ID_NULL:
              alert("아이디를 입력해주세요");
              break;
            case constant.ERROR_LOGIN_PASSWORD_NULL:
              alert("비밀번호를 입력해주세요");
              break;
            case constant.ERROR_LOGIN_INVALID_CREDENTIALS:
              alert("아이디 또는 패스워드가 틀립니다");
              break;
            case -1:
              switch (err.response.data) {
                case "The login must be between 2 and 255 characters.":
                  alert("아이디는 2자 이상 255자 이하로 입력해주세요.");
                  break;
                case "The password must be between 4 and 255 characters.":
                  alert("비밀번호는 4자 이상 255자 이하로 입력해주세요.");
                  break;
                default:
                  alert(err.response.data);
                  break;
              }
              break;
          }
          this.isLoginInProgress = false;
        });
    },
  },
};
</script>

<style lang="scss" scoped>
#page-login {
  .social-login-buttons {
    .bg-facebook {
      background-color: #1551b1;
    }

    .bg-twitter {
      background-color: #00aaff;
    }

    .bg-google {
      background-color: #4285f4;
    }

    .bg-github {
      background-color: #333;
    }
  }
}
.input-font::v-deep {
  span {
    font-size: 16px !important;
    height: 100%;
  }
  input {
    font-size: 16px !important;
  }
}

@media print, screen and (max-width: theme("screens.xl")) {
  .vx-col {
    width: 95%;
  }

  .lt-postion-logo {
    display: none;
  }
}
</style>
