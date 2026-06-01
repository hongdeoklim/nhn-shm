<template>
  <div>
    <div class="header">
      <div class="container">
        <div class="title">
          현장안전보건 조직도
        </div>
        <div class="approval">
          <div class="title left">결<br><br><br>재</div>
          <div class="right">
            <span class="title">관리책임자</span>
            <div class="sign-space p-1" style="text-align: center;">
              <img v-if="form.sign" height="100%" :src="form.sign" />
            </div>
          </div>
        </div>
      </div>
      <div class="writer">
        <div class="item">
          <span>현장명</span>
          <span class="print-input">{{ form.stdInfo.field_name }}</span>
        </div>
<!--        <div class="item">-->
<!--          <span>작성자</span>-->
<!--          <span class="print-input">{{ form.stdInfo.writer_name }}</span>-->
<!--        </div>-->
<!--        <div class="item">-->
<!--          <span>작성일</span>-->
<!--          <span class="print-input">{{ form.stdInfo.date }}</span>-->
<!--        </div>-->

      </div>
    </div>
    <div class="body">
      <div class="container">

        <div class="col-3">
          <br>
          <div style="width: 100%; margin-left: auto; margin-right: auto">
            <div class="info-card">
              <div class="title">안전보건총괄책임자</div>
              <div class="contents">
                <div class="key-value">
                  <span class="key">관리책임자</span>
                  <span class="value">{{ form.group1[0].name }}</span>
                </div>
                <div class="phone">
                  {{ form.group1[0].phone }}
                </div>
              </div>
            </div>
            <div class="line-h" />
          </div>
          <br>
          <div class="info-card" style="width: 100%;">
            <div v-if="form.group1[1].type" class="title">{{ form.group1[1].type }}</div>
            <div v-if="form.group1[2].type" class="title">{{ form.group1[2].type }}</div>
            <div v-if="!form.group1[1].type && !form.group1[2].type" class="title">  </div>
<!--            <div class="contents">-->
<!--              <div class="memo">{{ form.group1[1].name }}</div>-->
<!--            </div>-->
          </div>
          <div>
            <div style="display: grid; height: 38px;">
              <div class="line-h" style="height: 19px;"/>
              <div class="line-w" style="width: calc(100% + 42px); margin-left: -21px; margin-right: -21px;"/>
              <div class="line-h" style="height: 19px;"/>
            </div>
            <div>
              <div class="line-h" style="height: 170px;"/>
            </div>

            <div class="line-group">
              <div class="line-h" style="height: 30px;" />
            </div>

            <div class="info-card" style="width: 100%;">
              <div class="title">(주)농협네트웍스 관리감독자</div>
              <div class="contents">
                <div class="key-value">
                  <span class="key">담당</span>
                  <span class="value">{{ form.group1[4].name }}</span>
                </div>
                <div class="phone">
                  {{ form.group1[4].phone }}
                </div>
                <div class="key-value">
                  <span class="key">담당</span>
                  <span class="value">{{ form.group1[5].name }}</span>
                </div>
                <div class="phone">
                  {{ form.group1[5].phone }}
                </div>
              </div>
            </div>
          </div>
          <div>
            <div class="info-card" style="width: 100%;">
              <div class="title">안전관리자</div>
              <div class="contents">
                <div class="key-value">
                  <span class="key">안전</span>
                  <span class="value">{{ form.group1[3].name }}</span>
                </div>
                <div class="phone">
                  {{ form.group1[3].phone }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="line-group">
          <div class="line-h" />
          <div class="line-w" style="width: calc(80% + 17px); margin-left: calc((100% - 21px*4)/5/2);"/>
        </div>

        <div class="col-5">

          <div>
            <div class="line-h" />
            <div class="info-card">
              <div class="title">{{ `${form.group2[0].target} ${form.group2[0].type}`.trim() }}</div>
              <div class="contents">
                <div class="key-value">
                  <span class="key">{{ form.group2[0].task }}</span>
                  <span class="value">{{ form.group2[0].name }}</span>
                </div>
                <div class="phone">
                  {{ form.group2[0].phone }}
                </div>
              </div>
            </div>
          </div>

          <div>
            <div class="line-h" />
            <div class="info-card">
              <div class="title">{{ `${form.group2[1].target} ${form.group2[1].type}`.trim() }}</div>
              <div class="contents">
                <div class="key-value">
                  <span class="key">{{ form.group2[1].task }}</span>
                  <span class="value">{{ form.group2[1].name }}</span>
                </div>
                <div class="phone">
                  {{ form.group2[1].phone }}
                </div>
              </div>
            </div>
          </div>

          <div>
            <div class="line-h" />
            <div class="info-card">
              <div class="title">{{ `${form.group2[2].target} ${form.group2[2].type}`.trim() }}</div>
              <div class="contents">
                <div class="key-value">
                  <span class="key">{{ form.group2[2].task }}</span>
                  <span class="value">{{ form.group2[2].name }}</span>
                </div>
                <div class="phone">
                  {{ form.group2[2].phone }}
                </div>
              </div>
            </div>
          </div>

          <div>
            <div class="line-h" />
            <div class="info-card">
              <div class="title">{{ `${form.group2[3].target} ${form.group2[3].type}`.trim() }}</div>
              <div class="contents">
                <div class="key-value">
                  <span class="key">{{ form.group2[3].task }}</span>
                  <span class="value">{{ form.group2[3].name }}</span>
                </div>
                <div class="phone">
                  {{ form.group2[3].phone }}
                </div>
              </div>
            </div>
          </div>

          <div>
            <div class="line-h" />
            <div class="info-card">
              <div class="title">{{ `${form.group2[4].target} ${form.group2[4].type}`.trim() }}</div>
              <div class="contents">
                <div class="key-value">
                  <span class="key">{{ form.group2[4].task }}</span>
                  <span class="value">{{ form.group2[4].name }}</span>
                </div>
                <div class="phone">
                  {{ form.group2[4].phone }}
                </div>
              </div>
            </div>
          </div>

        </div>

        <div class="col-5">
          <div>
            <div class="line-h" />
            <div class="info-card">
              <div class="title">{{ `${form.group2[5].target} ${form.group2[5].type}`.trim() }}</div>
              <div class="contents">
                <div class="key-value">
                  <span class="key">{{ form.group2[5].task }}</span>
                  <span class="value">{{ form.group2[5].name }}</span>
                </div>
                <div class="phone">
                  {{ form.group2[5].phone }}
                </div>
              </div>
            </div>
            <div class="line-h" />
          </div>

          <div>
            <div class="line-h" />
            <div class="info-card">
              <div class="title">{{ `${form.group2[6].target} ${form.group2[6].type}`.trim() }}</div>
              <div class="contents">
                <div class="key-value">
                  <span class="key">{{ form.group2[6].task }}</span>
                  <span class="value">{{ form.group2[6].name }}</span>
                </div>
                <div class="phone">
                  {{ form.group2[6].phone }}
                </div>
              </div>
            </div>
            <div class="line-h" />
          </div>

          <div>
            <div class="line-h" />
            <div class="info-card">
              <div class="title">{{ `${form.group2[7].target} ${form.group2[7].type}`.trim() }}</div>
              <div class="contents">
                <div class="key-value">
                  <span class="key">{{ form.group2[7].task }}</span>
                  <span class="value">{{ form.group2[7].name }}</span>
                </div>
                <div class="phone">
                  {{ form.group2[7].phone }}
                </div>
              </div>
            </div>
            <div class="line-h" />
          </div>

          <div>
            <div class="line-h" />
            <div class="info-card">
              <div class="title">{{ `${form.group2[8].target} ${form.group2[8].type}`.trim() }}</div>
              <div class="contents">
                <div class="key-value">
                  <span class="key">{{ form.group2[8].task }}</span>
                  <span class="value">{{ form.group2[8].name }}</span>
                </div>
                <div class="phone">
                  {{ form.group2[8].phone }}
                </div>
              </div>
            </div>
            <div class="line-h" />
          </div>

          <div>
            <div class="line-h" />
            <div class="info-card">
              <div class="title">{{ `${form.group2[9].target} ${form.group2[9].type}`.trim() }}</div>
              <div class="contents">
                <div class="key-value">
                  <span class="key">{{ form.group2[9].task }}</span>
                  <span class="value">{{ form.group2[9].name }}</span>
                </div>
                <div class="phone">
                  {{ form.group2[9].phone }}
                </div>
              </div>
            </div>
            <div class="line-h" />
          </div>
        </div>

        <div class="info-card">
          <div class="title">전근로자</div>
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
  name: 'Print',
  props: {
    board: Object,
    form: Object,
  }
}
</script>

<style lang="scss" scoped>
$border-color: #cdcdcd;
$approval-border: 2px solid #cdcdcd;
.header {
  padding-bottom: 10px;
  border-bottom: 1px solid #cdcdcd;

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
      font-size: 24px;
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
        background-color: #f9f9f9;
        align-items: center;
      }

      .sign-space {
        height: 100px;
      }

      & > .left { width: 32px; border-right: $approval-border}
      & > .right > .title { border-bottom: $approval-border}

    }
  }
  & > .writer {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    column-gap: 16px;

    & > .item {
      display: flex;
      align-items: center;

      span:nth-child(1) { width: 110px; min-width: 110px; font-weight: 500;}
      span:nth-child(2) { width: 100%; }
    }
  }
}
.body {

  & > .container {
    max-width: 100%;
    margin: 0;
    padding: 100px 0 0;

    .line-h { display: flex; margin-left: auto; margin-right: auto; width: 1px; height: 60px; background-color: $border-color }
    .line-w { display: flex; margin-top: auto; margin-bottom: auto; width: 100%; height: 1px; background-color: $border-color;}

    & > .col-3 {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      column-gap:21px;
      justify-content: center;
    }

    & > .col-5 {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      column-gap:21px;
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
      background-color: #f9f9f9;
      height: 38px;
      padding: 10px;
    }

    & > .contents {
      display: block !important;
      border: solid 1px #cdcdcd;
      border-top: none;
      border-bottom: none;

      div { display: flex; align-items: center; height: 38px; border-bottom: solid 1px #cdcdcd;}
      //div:last-child {border-bottom: none;}

      & > .key-value {
        display: grid;
        grid-template-columns: auto 1fr;

        span { display: flex; align-items: center; height: 100%; padding-left: 10px;padding-right: 10px; }
        span:first-child { background-color: #f9f9f9; border-right: solid 1px #cdcdcd;}

        .key {
          min-width: 70px;
        }
      }

      & > .memo {
        height: 152px;
        padding: 10px;
        align-items: flex-start;
      }

      & > .phone {
        grid-area: phone;
        font-weight: 500;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        height: 38px;
        padding: 10px;
      }
    }
  }
}
</style>
