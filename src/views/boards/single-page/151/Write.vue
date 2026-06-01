<template>
  <div>
    <!--기본정보-->
    <field-select-module
      v-model="form.stdInfo"
      :board="this.board"
      :is-print="isPrint"
    />

    <!--협의체 정보-->
    <div class="mt-5">
      <vs-row class="my-4">
        <vs-col vs-type="flex" vs-justify="left" vs-align="center" w="12">
          <h5><i class="dot"></i> 협의체 정보</h5>
        </vs-col>
      </vs-row>
      <div class="grid grid-cols-12 gap-x-6 gap-y-4 mt-4">
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">구분</div>
          <p v-if="isPrint" class="print-input">{{ form.inputA_1 }}</p>
          <vs-select
            v-model="form.inputA_1"
            autocomplete
            v-else
            :readonly="board.readonly"
            class="w-full flex-1"
          >
            <vs-select-item text="최초" value="최초" />
            <vs-select-item text="정기" value="정기" />
            <vs-select-item text="수시" value="수시" />
          </vs-select>
        </div>
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">협의일</div>
          <p v-if="isPrint" class="print-input">
            {{ form.inputA_2 }}
          </p>
          <div v-else class="flex-1 flex items-center">
            <date-selector
              class="w-full"
              v-model="form.inputA_2"
              :readonly="board.readonly"
            />
          </div>
        </div>
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">차수</div>
          <p v-if="isPrint" class="print-input">{{ form.inputA_3 }}</p>
          <ml-input
            :readonly="board.readonly"
            v-else
            :value="comma(form.inputA_3)"
            @input="
              (data) => {
                form.inputA_3 = removeComma(data);
              }
            "
            class="w-full flex-1"
          />
        </div>
        <div class="col-span-4 flex items-center mt-4">
          <div class="label-text mr-4">대상기간</div>
          <p v-if="isPrint" class="print-input">
            {{ form.inputA_4 }} ~ {{ form.inputA_5 }}
          </p>
          <div v-else class="flex-1 flex items-center">
            <date-selector
              class="w-full flex-1"
              v-model="form.inputA_4"
              :readonly="board.readonly"
            />
            <p class="px-2">~</p>
            <date-selector
              class="w-full flex-1"
              v-model="form.inputA_5"
              :readonly="board.readonly"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 위험성평가협의회(사용자) -->
    <div class="mt-5">
      <vs-row class="flex justify-between items-center my-4">
        <h5><i class="dot"></i> 위험성평가협의회(사용자)</h5>
        <div v-if="!isPrint">
          <vs-button
            class="ml-4"
            color="secondary"
            @click="addTableRow('userTableList')"
          >
            항목추가
          </vs-button>
          <vs-button
            class="ml-4"
            color="secondary"
            type="border"
            @click="deleteSelectTable('userTableList')"
          >
            선택삭제
          </vs-button>
        </div>
      </vs-row>
      <vs-table
        :multiple="!isPrint"
        noDataText="데이터가 없습니다"
        v-model="userSelected"
        :data="form.userTableList"
        class="w-full table"
      >
        <template slot="thead">
          <vs-th> <div class="w-full text-center">소속명</div> </vs-th>
          <vs-th> <div class="w-full text-center">직책</div></vs-th>
          <vs-th> <div class="w-full text-center">이름</div></vs-th>
          <vs-th> <div class="w-full text-center">서명</div> </vs-th>
          <vs-th> <div class="w-full text-center">비고</div></vs-th>
        </template>

        <template slot-scope="{ data }">
          <vs-tr
            :data="tr"
            :key="indextr"
            v-for="(tr, indextr) in data"
            style="box-shadow: none !important; transform: translateY(0px)"
          >
            <vs-td class="w-2/12 text-center align-top">
              <div v-if="isPrint">{{ tr.cell1 }}</div>
              <ml-input
                v-else
                :readonly="board.readonly"
                v-model="tr.cell1"
                class="w-full flex-1"
                @click.stop
              />
            </vs-td>
            <vs-td class="w-2/12 text-center align-top">
              <div v-if="isPrint">{{ tr.cell2 }}</div>
              <vs-select
                v-else
                v-model="tr.cell2"
                autocomplete
                :readonly="board.readonly"
                class="w-full flex-1"
              >
                <vs-select-item text="사용자대표" value="사용자대표" />
                <vs-select-item text="안전관리자" value="안전관리자" />
                <vs-select-item text="보건관리자" value="보건관리자" />
                <vs-select-item text="관리감독자" value="관리감독자" />
                <vs-select-item text="사용자위원" value="사용자위원" />
                <vs-select-item text="기타" value="기타" />
              </vs-select>
            </vs-td>
            <vs-td class="w-2/12 text-center align-top">
              <div v-if="isPrint">{{ tr.cell3 }}</div>
              <ml-input
                v-else
                :readonly="board.readonly"
                v-model="tr.cell3"
                class="w-full flex-1"
                @click.stop
              />
            </vs-td>
            <vs-td class="w-2/12 text-center align-top">
              <sign-field v-model="tr.cell4" :readonly="board.readonly"/>
            </vs-td>
            <vs-td class="w-2/12 text-center align-top">
              <div v-if="isPrint">{{ tr.cell5 }}</div>
              <ml-input
                v-else
                :readonly="board.readonly"
                v-model="tr.cell5"
                class="w-full flex-1"
                @click.stop
              />
            </vs-td>
          </vs-tr>
        </template>
      </vs-table>
    </div>
    <!-- 위험성평가협의회(근로자) -->
    <div class="mt-5">
      <vs-row class="flex justify-between items-center my-4">
        <h5><i class="dot"></i> 위험성평가협의회(근로자)</h5>
        <div v-if="!isPrint">
          <vs-button
            class="ml-4"
            color="secondary"
            @click="addTableRow('workerTableList')"
          >
            항목추가
          </vs-button>
          <vs-button
            class="ml-4"
            color="secondary"
            type="border"
            @click="deleteSelectTable('workerTableList')"
          >
            선택삭제
          </vs-button>
        </div>
      </vs-row>
      <vs-table
        :multiple="!isPrint"
        noDataText="데이터가 없습니다"
        v-model="workerSelected"
        :data="form.workerTableList"
        class="w-full table"
      >
        <template slot="thead">
          <vs-th> <div class="w-full text-center">소속명</div> </vs-th>
          <vs-th> <div class="w-full text-center">직책</div></vs-th>
          <vs-th> <div class="w-full text-center">이름</div></vs-th>
          <vs-th> <div class="w-full text-center">서명</div> </vs-th>
          <vs-th> <div class="w-full text-center">비고</div></vs-th>
        </template>

        <template slot-scope="{ data }">
          <vs-tr
            :data="tr"
            :key="indextr"
            v-for="(tr, indextr) in data"
            style="box-shadow: none !important; transform: translateY(0px)"
          >
            <vs-td class="w-2/12 text-center align-top">
              <div v-if="isPrint">{{ tr.cell1 }}</div>
              <ml-input
                v-else
                :readonly="board.readonly"
                v-model="tr.cell1"
                class="w-full flex-1"
                @click.stop
              />
            </vs-td>
            <vs-td class="w-2/12 text-center align-top">
              <div v-if="isPrint">{{ tr.cell2 }}</div>
              <vs-select
                v-else
                v-model="tr.cell2"
                autocomplete
                :readonly="board.readonly"
                class="w-full flex-1"
              >
                <vs-select-item text="근로자대표" value="근로자대표" />
                <vs-select-item
                  text="명예산업안전감독관"
                  value="명예산업안전감독관"
                />
                <vs-select-item text="근로자위원" value="근로자위원" />
                <vs-select-item text="기타" value="기타" />
              </vs-select>
            </vs-td>
            <vs-td class="w-2/12 text-center align-top">
              <div v-if="isPrint">{{ tr.cell3 }}</div>
              <ml-input
                v-else
                :readonly="board.readonly"
                v-model="tr.cell3"
                class="w-full flex-1"
                @click.stop
              />
            </vs-td>
            <vs-td class="w-2/12 text-center align-top">
              <sign-field v-model="tr.cell4" :readonly="board.readonly"/>
            </vs-td>
            <vs-td class="w-2/12 text-center align-top">
              <div v-if="isPrint">{{ tr.cell5 }}</div>
              <ml-input
                v-else
                :readonly="board.readonly"
                v-model="tr.cell5"
                class="w-full flex-1"
                @click.stop
              />
            </vs-td>
          </vs-tr>
        </template>
      </vs-table>
    </div>

    <!-- 협의내용 -->
    <div class="mt-5">
      <vs-row class="my-4">
        <vs-col vs-type="flex" vs-justify="left" vs-align="center" w="12">
          <h5><i class="dot"></i> 협의내용</h5>
        </vs-col>
      </vs-row>

      <div class="grid grid-cols-12 gap-x-6 gap-y-4 mt-4">
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">재해형태(필수)</div>
          <p v-if="isPrint" class="print-input">{{ form.inputB_1 }}</p>
          <disaster-class-selector
            v-else
            class="w-full flex-1"
            v-model="form.inputB_1"
            :readonly="board.readonly"
          />
        </div>
      </div>
      <div class="print-container col-span-12 flex items-start mt-4">
        <div class="label-text mr-4 mt-2">전회 미결사항</div>
        <span v-if="isPrint" class="print-textarea">
          {{ form.inputB_2 }}
        </span>
        <ml-textarea
          v-else
          class="flex-1 w-full"
          rows="5"
          v-model="form.inputB_2"
          :readonly="board.readonly"
        />
      </div>
      <div class="print-container col-span-12 flex items-start">
        <div class="label-text mr-4 mt-2">전회 우수사례</div>
        <span v-if="isPrint" class="print-textarea">
          {{ form.inputB_3 }}
        </span>
        <ml-textarea
          v-else
          class="flex-1 w-full"
          rows="5"
          v-model="form.inputB_3"
          :readonly="board.readonly"
        />
      </div>
      <div class="print-container col-span-12 flex items-start">
        <div class="label-text mr-4 mt-2">근로자 의견</div>
        <span v-if="isPrint" class="print-textarea">
          {{ form.inputB_4 }}
        </span>
        <ml-textarea
          v-else
          class="flex-1 w-full"
          rows="5"
          v-model="form.inputB_4"
          :readonly="board.readonly"
        />
      </div>
      <div class="print-container col-span-12 flex items-start">
        <div class="label-text mr-4 mt-2">경영자 의견</div>
        <span v-if="isPrint" class="print-textarea">
          {{ form.inputB_5 }}
        </span>
        <ml-textarea
          v-else
          class="flex-1 w-full"
          rows="5"
          v-model="form.inputB_5"
          :readonly="board.readonly"
        />
      </div>
      <div class="print-container col-span-12 flex items-start">
        <div class="label-text mr-4 mt-2">위험요인 추가</div>
        <span v-if="isPrint" class="print-textarea">
          {{ form.inputB_6 }}
        </span>
        <ml-textarea
          v-else
          class="flex-1 w-full"
          rows="5"
          v-model="form.inputB_6"
          :readonly="board.readonly"
        />
      </div>
    </div>

    <!-- 사진대지 -->
    <photo-upload-grid-module
      v-model="form.photoList"
      :is-print="isPrint"
      :readonly="board.readonly"
      section-title="사진대지"
      placeholder="점검 현장 사진"
    />

    <!--    파일첨부-->
    <file-upload-module
      id="fileList"
      class="w-full mt-4"
      v-model="form.fileL10ist"
      :is-print="isPrint"
      :readonly="board.readonly"
    ></file-upload-module>
  </div>
</template>

<script>
import config from "/public/config";
import VueCookie from "vue-cookie";
import FieldSelectModule from "@/views/modules/FieldSelectModule";
import DateSelector from "@/components/selector/DateSelector";
import PhotoUploadGridModule from "@/views/modules/PhotoUploadGridModule";
import FileUploadModule from "@/views/modules/FileUploadModule";
import DisasterClassSelector from "@/components/selector/DisasterClassSelector";
import SignField from '@/components/SignField'

export default {
  components: {
    SignField,
    FieldSelectModule,
    DateSelector,
    PhotoUploadGridModule,
    FileUploadModule,
    DisasterClassSelector,
  },
  props: {
    isPrint: Boolean,
    board: Object,
    value: Object,
  },
  watch: {
    value: {
      immediate: true,
      deep: true,
      handler(value) {
        const keys = Object.keys(this.form);
        for (const key of keys) {
          if (value[key]) {
            this.form[key] = value[key];
            if (key === "userTableList" && 0 < value[key].length) this.userTempId = value[key][value[key].length - 1].id;
            if (key === "workerTableList" && 0 < value[key].length) this.workerTempId = value[key][value[key].length - 1].id;
          }
        }
      },
    },
    form: {
      immediate: true,
      deep: true,
      handler(value) {
        this.$emit("input", value);
      },
    },
  },
  data() {
    return {
      form: {
        stdInfo: {},
        userTableList: [],
        workerTableList: [],
        inputA_1: "",
        inputA_2: "",
        inputA_3: "",
        inputA_4: "",
        inputA_5: "",
        inputB_1: "",
        inputB_2: "",
        inputB_3: "",
        inputB_4: "",
        inputB_5: "",
        inputB_6: "",
        photoList: [],
        fileList: [],
      },
      userSelected: [],
      workerSelected: [],
      userTempId: 0,
      workerTempId: 0,
    };
  },
  methods: {
    addTableRow(type) {
      this.form[type].push({
        id: type === "userTableList" ? ++this.userTempId : ++this.workerTempId,
        cell1: "",
        cell2: "",
        cell3: "",
        cell4: "",
        cell5: "",
      });
    },
    deleteSelectTable(type) {
      const seletedIds =
        type === "userTableList"
          ? this.userSelected.map((item) => item.id)
          : this.workerSelected.map((item) => item.id);
      this.form[type] = this.form[type].filter(
        (item) => !seletedIds.includes(item.id)
      );
    },
    comma(num) {
      const str = `${Number(num) ? Number(num) : ""}`;
      if (str && str.length > 0) {
        return str.replace(/,/gi, "").replace(/\B(?=(\d{3})+(?!\d))/gi, ",");
      }
      return str;
    },
    removeComma(str) {
      return str.replace(/,/g, "");
    },
  },
};
</script>

<style scoped lang="scss">
$border: 1px solid #cdcdcd;
.label-text {
  width: 114px;
  font-weight: 500;
  font-size: 14px;
}

.mt-component-form {
  margin-top: 15px;
}

/* uploaded File */
.h-upload {
  height: 470px;
}

.upload-content {
  border: $border;

  &:last-child {
    border-left: none;
  }

  &__title {
    height: 54px;
    line-height: 54px;
    text-align: center;
    background: #fafafa;
    border-bottom: $border;
  }

  &__input {
    height: 54px;
    background: #f9f9f9;
    border-top: $border;
    padding: 5px 15px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__file {
    height: calc(100% - 54px);
    width: 100%;
    padding: 14px;
  }
}

.table ::v-deep {
  .vs-con-tbody {
    background: none !important;
    border: 0 !important;
  }
  thead tr {
    background: #f9f9f9 !important;
    border-top: solid 1px #cdcdcd;
    border-bottom: solid 1px #cdcdcd;
  }
  tr {
    background: #fff !important;
    border-bottom: solid 1px #cdcdcd;
  }
}
</style>
