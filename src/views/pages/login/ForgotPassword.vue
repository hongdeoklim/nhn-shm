<!-- =========================================================================================
    File Name: ForgotPassword.vue
    Description: FOrgot Password Page
    ----------------------------------------------------------------------------------------
    Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
      Author: Pixinvent
    Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->
<template>
  <div class="h-screen flex w-full bg-img">
    <div class="vx-col w-4/5 sm:w-4/5 md:w-3/5 lg:w-3/4 xl:w-3/5 mx-auto self-center">
      <vx-card>
        <div slot="no-body" class="full-page-bg-color">
          <div class="vx-row">
            <div class="vx-col hidden sm:hidden md:hidden lg:block lg:w-1/2 mx-auto self-center">
              <img src="@/assets/images/pages/login.png" alt="login" class="mx-auto">
            </div>
            <div class="vx-col sm:w-full md:w-full lg:w-1/2 mx-auto self-center d-theme-dark-bg">
              <div class="p-8">
                <div class="vx-card__title mb-8">
                  <h4 class="mb-4">비밀번호 찾기</h4>
                  <p> 이메일 주소를 입력하시면 비밀번호 재설정 방법에 대한 안내를 보내드립니다.</p>
                </div>

                <ml-input type="email" label-placeholder="Email" v-model="email" class="w-full mb-8" />
                <vs-button type="border" to="/login" class="px-4 w-full md:w-auto">로그인으로</vs-button>
                <vs-button class="float-right px-4 w-full md:w-auto mt-3 mb-8 md:mt-0 md:mb-0" @click="handleSendEmail">비밀번호 변경</vs-button>
              </div>
            </div>
          </div>
        </div>
      </vx-card>
    </div>
  </div>
</template>

<script>
import HttpRequest from '@/util/HttpRequest'

export default {
  data () {
    return {
      email: '',
    }
  },

  methods: {
    handleSendEmail () {
      const option = {
        params: {
          email:this.email
        }
      }
      HttpRequest.post('/api/auth/forgot-password', option.params, true)
      .then(response => {
        alert('이메일을 보냈습니다.')
        this.$router.push('/reset-password')
      }).catch(err => {
        const errorCode = err.response.status
        if (`${errorCode}` === '404') {
          this.showErrorPopup(err, '가입 정보를 찾을 수 없습니다')
        }
      })
    },

    showErrorPopup (err, message) {
      const isCheckAlertDialog = document.getElementById("checkAlertDialog");
      if (isCheckAlertDialog) return;

      const customAlert = new CustomEvent("customAlert", {
        detail: {
          title: `${err.response.status} 에러`,
          message
        },
      });
      window.dispatchEvent(customAlert);
    }
  }
}
</script>
