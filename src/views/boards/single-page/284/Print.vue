<template>
  <div class="relative" style="width: 1123px; height: 1587px">
    <img src="@/assets/images/print_bg_img_001.png" class="w-full" alt="bg" />
    <div class="body">
      <div class="title">관리책임자 안전보건 경영방침</div>
      <div class="head" v-html="form.inputB_3"></div>
      <div class="main">
        <p v-for="(item, index) in form.contents" :key="index">
          <span class="num">{{ index + 1 }}.</span>
          <span>{{ item.content }}</span>
        </p>
      </div>
      <div class="yyyyMMdd">
        <span class="year pr-6">{{ form.stdInfo ? new Date(form.stdInfo.date).format("yyyy") : new Date().format("yyyy") }} 년</span>
        <span class="month pr-6">{{ form.stdInfo ? new Date(form.stdInfo.date).format("MM") : new Date().format("MM") }} 월</span>
        <span class="day">{{ form.stdInfo ? new Date(form.stdInfo.date).format("dd") : new Date().format("dd") }} 일</span>
      </div>
      <div class="sign flex items-center justify-center">
        <div>
          {{ form.stdInfo ? form.stdInfo.field_name : "" }} <br />
          관리책임자 {{ form.inputB_1 }}
          <span class="relative">
            (인)
            <img :src="form.inputB_2" class="absolute m-auto" style="width: 180px; top: -20px; left: -50px" />
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Print",
  props: {
    board: Object,
    form: Object,
  },
};
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
    display: flex;
    align-items: center;
    justify-content: center;

    height: 300px;

    font-family: cursive;
    text-align: center;
    font-size: 26px;
    font-weight: bold;
    line-height: 3rem;
    letter-spacing: 3px;

    white-space: pre-line;
    word-break: break-all;

    padding: 50px 13% 0;
  }

  .main {
    padding-top: 100px;
    width: 100%;
    height: 846px;
    padding-left: 110px;
    padding-right: 110px;

    p {
      font-weight: bold;
      font-size: 20px;
      display: flex;
      align-items: center;
      min-height: 60px;

      white-space: pre-line;
      word-break: break-all;

      margin-bottom: 16px;
      .num {
        min-width: 40px;
      }
    }

    p:last-child {
      margin-bottom: 0;
    }
  }

  .yyyyMMdd {
    display: flex;
    justify-content: center;
    font-size: 20px;
    font-weight: bold;

    padding-top: 12px;
  }

  .sign {
    min-height: 108px;

    font-family: cursive;
    font-size: 32px;
    font-weight: bold;
    text-align: center;
    letter-spacing: 4px;

    padding: 8px 0 0;
  }
}
</style>
