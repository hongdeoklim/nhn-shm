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
                  <h4 class="mb-4">비밀번호 변경</h4>
                  <p> 이메일로 전송받은 코드와 변경하실 비밀번호를 입력하세요.</p>
                </div>

                <ml-input type="email" label-placeholder="code" v-model="code" class="w-full mb-8" />
                <ml-input type="password" label-placeholder="비밀번호" v-model="password" class="w-full mb-8" />
                <ml-input type="password" label-placeholder="비밀번호 재입력" v-model="repassword" class="w-full mb-8" />
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
import constant from '@/constant/constant'
export default {
  data () {
    return {
      code: '',
      password:'',
      repassword:'',
    }
  },

  methods: {

    handleSendEmail () {
      this.$store.dispatch('USER_RESET_PASSWORD', {code:this.code, password:this.password, repassword:this.repassword}).then(() => {
        alert('비밀번호를 변경하였습니다.')
        this.$router.push('/login')
      }).catch((err) => {

        switch (constant.getErrorCode(err)) {
        case constant.ERROR_LOGIN_PASSWORD_NULL :
          alert('비밀번호를 입력해주세요.')
          break
        case constant.ERROR_LOGIN_INVALID_RESET_CODE :
          alert('인증코드가 잘 못 되었습니다.')
          break
        }
      })
    }
  }
}
</script>
