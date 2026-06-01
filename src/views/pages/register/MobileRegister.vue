<!-- =========================================================================================
    File Name: Register.vue
    Description: Register Page
    ----------------------------------------------------------------------------------------
    Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
      Author: Pixinvent
    Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->


<template>
  <div class="h-screen flex w-full bg-img vx-row no-gutter items-center justify-center">
    <div class="vx-col sm:w-1/2 md:w-1/2 lg:w-3/4 xl:w-3/5 sm:m-0 m-4">
      <vx-card>
        <div slot="no-body" class="full-page-bg-color">
          <div class="vx-row no-gutter">
            <div class="vx-col hidden sm:hidden md:hidden lg:block lg:w-1/2 mx-auto self-center">
              <img src="@/assets/images/pages/login.png" alt="register" class="mx-auto">
            </div>
            <div class="vx-col sm:w-full md:w-full lg:w-1/2 mx-auto self-center  d-theme-dark-bg">
              <div class="px-8 pt-8 register-tabs-container">
                <div class="vx-card__title mb-4">
                  <h4 class="mb-4">회원가입모바일</h4>
                  <p>아래 양식을 작성하여 새 계정을 만드세요</p>
                </div>
                <div>
                  <ml-input class="vx-col w-full mb-2" label-placeholder="아이디" placeholder="아이디" v-model="member.username"/>
                  <ml-input class="vx-col w-full mb-2" label-placeholder="이름" placeholder="이름" v-model="member.name"/>
                  <ml-input class="vx-col w-full mb-2" label-placeholder="이메일" placeholder="이메일" v-model="member.email"/>
                  <ml-input class="vx-col w-full mb-2" type="password" label-placeholder="비밀번호" placeholder="비밀번호" v-model="password" />
                  <ml-input class="vx-col w-full mb-2" type="password" label-placeholder="비밀번호 확인" placeholder="비밀번호 확인" v-model="repassword" />

                  <vs-checkbox v-model="isTermsConditionAccepted" class="mt-6">이용약관 동의</vs-checkbox>
                  <div style="display: grid; grid-template-columns: 1fr 1fr;">
                    <vs-button type="border" to="/login" class="mt-6 mr-1">로그인으로</vs-button>
                    <vs-button class="mt-6 ml-1" @click="handleRegister" >가입하기</vs-button>
                  </div>

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
import RegisterJwt from './RegisterJWT.vue'

export default {
  components: {
    RegisterJwt
  },

  data () {
    return {
      isTermsConditionAccepted:false,
      member: {
        username: '',
        name:'',
        email:''
      },
      password:'',
      repassword:''
    }
  },

  methods:{
    async registerMember () {
      const param = {
      }

      if (!this.member.username || this.member.username.length <= 0) {
        alert('ID를 입력하세요. ID는 로그인에 사용됩니다.')
        return
      }

      if (!this.member.email || this.member.email.length <= 0) {
        alert('Email를 입력하세요. Email는 비밀번호를 찾을때 사용됩니다.')
        return
      }

      // 비밀번호 변경
      if (this.password.length < 8 || this.password.length > 255) {
        alert('비밀번호는 8~255자리까지 입력 가능합니다.')
        return
      }

      if (this.password !== this.repassword) {
        alert('올바른 비밀번호를 입력하세요.')
        return
      }

      // 그외 비밀번호 제약조건
      // ...

      param.username = this.member.username
      param.email = this.member.email
      param.name = this.member.name
      param.mail_destination = this.member.mail_destination
      param.subscribe_email = this.member.subscribe_email
      param.subscribe_sms = this.member.subscribe_sms

      param.password = this.password
      param.password_confirmation = this.repassword

      await this.$store.dispatch('member/NONE_TOKEN_REGISTER_MEMBER', param)
        .then((/*response*/) => {
          // success
          alert('회원가입을 완료 했습니다.')
          this.$router.replace('/login')
        })
        .catch((/*err*/) => {
          // fail
          alert('저장에 실패하였습니다. 관리자에게 문의 바랍니다.')
        })
    },

    handleRegister () {
      this.registerMember()
    }
  }
}
</script>

<style lang="scss">
.register-tabs-container {
  min-height: 517px;

  .con-tab {
    padding-bottom: 23px;
  }
}
</style>
