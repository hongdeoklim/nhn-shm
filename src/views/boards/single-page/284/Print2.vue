<template>
<div class="relative p-10" style="width:1123px; height: 1587px;">
  <img :src="`${baseUrl}/storage/app/media/%EB%86%8D%ED%98%91_%EB%B3%B8%EC%82%AC_%EA%B2%BD%EC%98%81%EB%B0%A9%EC%B9%A8.jpg`" class="w-full" alt="bg">

</div>
</template>

<script>
import config from "../../../../../public/config";

export default {
  name: 'Print',
  props: {
    board: Object,
    form: Object,
  },
  computed: {
    baseUrl() {
      return config.BASE_API_URL || 'https://api.shm.nhnetworks.co.kr';
    },
  },
}
</script>

<style lang="scss" scoped>
/* 스타일설정 */
.body {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  .title {
    text-align: center;
    padding-top: 138px;
    font-size: 32px;
    font-weight: bold;
  }

  .head {
    font-family: cursive;
    text-align: center;
    font-size: 20px;
    font-weight: bold;
    white-space: pre;

    padding-top: 50px;
    line-height: 3rem;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 300px;
    letter-spacing: 3px;
  }

  .main {
    padding-top: 100px;
    width: 100%;
    height: 846px;
    padding-left: 110px;
    padding-right: 110px;

    p {
      font-weight: bold;
      font-size: 24px;
      display: flex;
      align-items: center;
      min-height: 72px;
      word-break: keep-all;

      margin-bottom: 16px;

      .num {
        min-width: 40px;
      }
    }

    p:last-child { margin-bottom: 0; }
  }

  .yyyyMMdd {
    display: flex;
    justify-content: center;
    font-size: 20px;
    font-weight: bold;

    padding-top: 16px;
  }

  .sign {
    font-family: cursive;
    font-size: 32px;
    font-weight: bold;
    text-align: center;
    letter-spacing: 4px;

    padding-top: 30px;
  }
}

</style>
