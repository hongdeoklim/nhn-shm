<template>
  <div class="page-container">
    <div class="header">유관기관 비상연락망</div>
    <div style="padding: 80px;">
      <div class="content">
        <div class="cell cell1">
          <div class="cellTitle"><span>노동부</span></div>
          <div class="cellBody">{{ form.list_1[0].inputB_1 }}</div>
          <div class="cellBody">{{ form.list_1[0].inputB_2 }}</div>
        </div>

        <div></div>

        <div class="cell">
          <div class="cellTitle"><span>본사</span></div>
          <div class="cellOne">{{ form.list_2[0].inputB_1 }}</div>
          <div class="cellOne">{{ form.list_2[0].inputB_2 }}</div>
          <!--          <div class="cellBody">{{ form.list_2[1].inputB_1 }}</div>-->
          <!--          <div class="cellBody">{{ form.list_2[1].inputB_2 }}</div>-->
        </div>

        <div></div>

        <div class="cell cell1">
          <div class="cellTitle"><span>감리단</span></div>
          <div class="cellBody">
            <span>{{ form.list_3[0].inputB_1 }}</span>
          </div>
          <div class="cellBody">
            <span>{{ form.list_3[0].inputB_2 }}</span>
          </div>
        </div>
      </div>

      <div class="content" style="height: 60px; grid-template-columns: 0.5fr 0.8fr 1fr 0.8fr 0.5fr;">
        <!-- 2번째 줄 (여백) -->
        <div class="verticalLine" style="width: 100%;"></div>
        <div class="diagonal1"></div>
        <div class="verticalLine"></div>
        <div class="diagonal2"></div>
        <div class="verticalLine" style="width: 0%;"></div>
      </div>

      <div class="content">
        <!-- 3번째 줄 (컨텐츠) -->
        <div class="cell cell1">
          <div class="cellTitle"><span>경찰서</span></div>
          <div class="cellBody">
            <span>{{ form.list_4[0].inputB_1 }}</span>
          </div>
          <div class="cellBody">
            <span>{{ form.list_4[0].inputB_2 }}</span>
          </div>
        </div>

        <div class="horizontalLine"></div>

        <div class="cell cell1">
          <div class="cellTitle"><span>현장</span></div>
          <div class="cellBody">
            <span>{{ form.stdInfo.field_name }}</span>
          </div>
          <div class="cellBody">
            <span>{{ form.stdInfo.field_address }}</span>
          </div>
        </div>

        <div class="horizontalLine"></div>

        <div class="cell cell1">
          <div class="cellTitle"><span>소방서</span></div>
          <div class="cellBody">
            <span>{{ form.list_5[0].inputB_1 }}</span>
          </div>
          <div class="cellBody">
            <span>{{ form.list_5[0].inputB_2 }}</span>
          </div>
        </div>
      </div>

      <div class="content" style="height: 60px; grid-template-columns: 0.5fr 0.8fr 1fr 0.8fr 0.5fr;">
        <!-- 4번째 줄 (여백) -->
        <div class="verticalLine" style="width: 100%;"></div>
        <div class="diagonal2"></div>
        <div class="verticalLine"></div>
        <div class="diagonal1"></div>
        <div class="verticalLine" style="width: 0%;"></div>
      </div>

      <div class="content">
        <!-- 5번째 줄 (컨텐츠) -->
        <div class="cell cell1">
          <div class="cellTitle"><span>시·도·군·구청</span></div>
          <div class="cellBody">
            <span>{{ form.list_6[0].inputB_1 }}</span>
          </div>
          <div class="cellBody">
            <span>{{ form.list_6[0].inputB_2 }}</span>
          </div>
        </div>

        <div></div>

        <div class="cell cell1">
          <div class="cellTitle"><span>한국전력공사</span></div>
          <div class="cellBody">
            <span>{{ form.list_7[0].inputB_1 }}</span>
          </div>
          <div class="cellBody">
            <span>{{ form.list_7[0].inputB_2 }}</span>
          </div>
        </div>

        <div></div>

        <div class="cell cell1">
          <div class="cellTitle"><span>병원</span></div>
          <div class="cellBody">
            <span>{{ form.list_8[0].inputB_1 }}</span>
          </div>
          <div class="cellBody">
            <span>{{ form.list_8[0].inputB_2 }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Print",
  props: {
    form: Object,
  },
};
</script>

<style lang="scss" scoped>
$border-color: #757575;
$border-color-bold: #757575;
$approval-border: 2px solid #cdcdcd;
.content {
  display: grid;
  grid-template-columns: 1fr 0.3fr 1fr 0.3fr 1fr;

  .cell {
    border: 1px solid $border-color;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 42px minmax(52px, 1fr) minmax(52px, 1fr);

    .cellTitle {
      display: grid;
      background-color: #f9f9f9;
      text-align: center;
      grid-column: 1/3;

      span {
        align-self: center;
        font-size: 14px;
        font-weight: 500;
      }
    }

    .cellBody {
      display: grid;
      border-top: 1px solid $border-color;
      font-size: 14px;
      font-weight: normal;
      white-space: nowrap;

      &:nth-child(2n) {
        border-right: 1px solid $border-color;
      }
    }

    .cellOne {
      display: grid;
      text-align: center;
      grid-column: 1/3;
      border-top: 1px solid $border-color;
      font-size: 14px;
      font-weight: normal;
      white-space: nowrap;
      align-content: center;
    }
  }

  .cell3 {
    grid-template-rows: 38px 1fr 1fr 1fr;
  }

  .cell1 {
    .cellBody {
      display: grid;
      grid-column: 1/3;
      // padding: 0;

      span {
        align-self: center;
        justify-self: center;
        word-wrap: break-word;
        white-space: pre-wrap;
      }

      &:nth-child(2n) {
        border-right: 0;
      }
    }
  }

  .verticalLine {
    width: 50%;
    border-right: 1px solid $border-color-bold;
  }

  .horizontalLine {
    height: 50%;
    border-bottom: 1px solid $border-color-bold;
  }

  .diagonal1 {
    background: linear-gradient(to top right, rgba(0, 0, 0, 0) calc(50% - 1px), $border-color-bold, rgba(0, 0, 0, 0) calc(50% + 1px));
  }

  .diagonal2 {
    background: linear-gradient(to top left, rgba(0, 0, 0, 0) calc(50% - 1px), $border-color-bold, rgba(0, 0, 0, 0) calc(50% + 1px));
  }
}

.header {
  font-size: 40px;
  font-weight: bold;
  color: #000;
  text-align: center;
  padding-bottom: 70px;
}

.cellBody {
  justify-content: center;
  align-content: center;
  padding: 10px;
}

html,
body,
.page-container {
  height: 100%;
}

.page-container {
  //display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: 80px;
}
</style>
