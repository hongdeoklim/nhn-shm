<template>
  <div>
    <div class="header">
      <div class="container">
        <div class="title">현장안전보건 조직도</div>
      </div>
      <div>
        <div class="flex pb-2" style="border-bottom: 1px solid #cdcdcd">
          <span class="mr-8" style="font-weight: 500; font-size: 18px;">현장명</span>
          <span style="font-weight: 400; font-size: 18px;">{{ form.stdInfo.field_name }}</span>
        </div>
      </div>
    </div>
    <div class="body">
      <div class="container">
        <div class="col-3">
          <br />
          <div style="width: 100%; max-width: 240px; margin-left: auto; margin-right: auto">
            <div class="info-card">
              <div class="title border-b-0">(주)농협네트웍스</div>
              <div class="title">안전보건관리(총괄)책임자</div>
              <div class="contents">
                <div class="key-value">
                  <span class="key">관리책임자</span>
                  <span class="value">{{ form.group1[0].name }}</span>
                </div>
                <div class="key-value">
                  <span class="key">연락처</span>
                  <span class="value">{{ form.group1[0].phone }}</span>
                </div>
              </div>
            </div>
            <div class="line-h" />
          </div>
          <br />
          <div></div>
          <div>
            <div style="position: relative; height: 38px">
              <div class="line-h" style="height: 19px" />
              <div class="line-w" style="position: absolute; left: 50%; top: 50px; width: calc(50% + 21px)" />
              <div class="line-h" style="height: 19px" />
            </div>
            <div>
              <div class="line-h" style="height: 140px" />
            </div>
          </div>

          <div class="info-card" style="width: 100%; max-width: 240px;">
            <div class="title" style="height: 100px">{{ form.group1[1].type }}</div>
          </div>
        </div>

        <div class="line-group">
          <div style="width: calc(80% + 17px); margin: auto" class="info-card">
            <p class="title" style="border-bottom: 0">협력업체</p>
          </div>
          <div class="line-w" style="width: calc(80% + 17px); margin: auto; height: 1px; background-color: #CDCDCD" />
        </div>

        <div class="col-5">
          <div v-for="(item, index) in form.group2.slice(0, 5)" :key="index">
            <div class="line-h" />
            <div class="info-card">
              <div class="title">{{ `${item.target} ${item.type}`.trim() }}</div>
              <div class="contents">
                <div class="key-value">
                  <span class="key">{{ item.task }}</span>
                  <span class="value">{{ item.name }}</span>
                </div>
                <div class="key-value">
                  <span class="key">{{ item.phone && item.phone !== ''? '연락처' : ''}}</span>
                  <span class="value">{{ item.phone }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-5">
          <div v-for="(item, index) in form.group2.slice(5, 10)" :key="index">
            <div class="line-h" />
            <div class="info-card">
              <div class="title">{{ `${item.target} ${item.type}`.trim() }}</div>
              <div class="contents">
                <div class="key-value">
                  <span class="key">{{ item.task }}</span>
                  <span class="value">{{ item.name }}</span>
                </div>
                <div class="key-value">
                  <span class="key">{{ item.phone && item.phone !== ''? '연락처' : ''}}</span>
                  <span class="value">{{ item.phone }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!--        <div class="p-5 flex">-->
        <!--          <div>※</div>-->
        <!--          <div>현장 조직도는 발주처 또는 원도급업체의 요구/요청사항 등을 고려하여 본 서식을 수정하거나 타 양식을 사용해도 가능하며, 필히 현장소장의 서명후 승인본을 유지하고 “현장 업무 분장표”를 작성하여 운영할 것</div>-->
        <!--        </div>-->
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
$border-color: #757575;
$approval-border: 2px solid #cdcdcd;
.header {
  padding-bottom: 10px;
  //border-bottom: 1px solid #cdcdcd;

  & > .container {
    max-width: 100%;
    margin-bottom: 24px;
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: center;
    justify-content: center;

    & > .title {
      display: flex;
      margin: auto;
      font-weight: bold;
      font-size: 40px;
    }
    & > .approval {
      width: 240px;
      height: 100%;
      display: grid;
      grid-template-columns: auto 1fr;
      border: $approval-border;

      .title {
        width: 100%;
        min-width: 33px;
        min-height: 38px;
        display: flex;
        justify-content: center;
        background-color: #ececec;
        align-items: center;
      }

      .sign-space {
        height: 100px;
      }

      & > .left {
        width: 32px;
        border-right: $approval-border;
      }
      & > .right > .title {
        border-bottom: $approval-border;
      }
    }
  }
  & > .writer {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    column-gap: 16px;

    & > .item {
      display: flex;
      align-items: center;

      span:nth-child(1) {
        width: 110px;
        min-width: 110px;
        font-weight: 500;
      }
      span:nth-child(2) {
        width: 100%;
      }
    }
  }
}
.body {
  & > .container {
    max-width: 100%;
    margin: 0;
    padding: 100px 0 0;

    .line-h {
      display: flex;
      margin-left: auto;
      margin-right: auto;
      width: 2px;
      height: 60px;
      background-color: $border-color;
    }
    .line-w {
      display: flex;
      margin-top: auto;
      margin-bottom: auto;
      width: 100%;
      height: 2px;
      background-color: $border-color;
    }

    & > .col-3 {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      column-gap: 21px;
      justify-content: center;
    }

    & > .col-5 {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      column-gap: 21px;
      justify-content: center;
    }
  }

  .info-card {
    & > .title {
      grid-area: head;
      font-weight: 500;
      display: flex;
      justify-content: center;
      align-items: center;
      border: solid 1px #cdcdcd;
      background-color: #ececec;
      height: 38px;
      padding: 10px;
    }

    & > .contents {
      display: block !important;
      border: solid 1px #cdcdcd;
      border-top: none;
      border-bottom: none;

      div {
        display: flex;
        align-items: center;
        height: 38px;
        border-bottom: solid 1px #cdcdcd;
      }
      //div:last-child {border-bottom: none;}

      & > .key-value {
        display: grid;
        grid-template-columns: 0.4fr 0.6fr;

        span {
          display: flex;
          align-items: center;
          height: 100%;
          padding-left: 10px;
          padding-right: 10px;
          justify-content: center;
        }
        span:first-child {
          background-color: #ececec;
          border-right: solid 1px #cdcdcd;
        }

        .key {
          min-width: 70px;
        }
      }

      & > .memo {
        height: 100px;
        padding: 10px;
        align-items: flex-start;
      }

      & > .phone {
        grid-area: phone;
        font-weight: 500;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 38px;
        padding: 10px;
      }
    }
  }
}
</style>
