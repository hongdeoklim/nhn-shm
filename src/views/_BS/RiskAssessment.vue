<template>
  <div>
    <vs-tabs :value="1">
      <vs-tab label="위험성평가" @click.prevent="onClickTab(0)" />
      <vs-tab label="위험성평가 엑셀 업로드" />
    </vs-tabs>

    <vx-card class="w-full">
      <div class="flex justify-between items-center">
        <h4>위험성평가 엑셀 업로드</h4>
        <vs-button color="secondary" @click="onClickSave">등록</vs-button>
      </div>
      <p class="mt-6 mb-5">※</p>

      <!-- 기본정보 -->
      <field-select-module
        title="작성자 정보"
        v-model="form.stdInfo"
        :typeslabel="{
          date: '등록일',
        }"
        :board="board"
        :types="['department', 'com_name', 'rank', 'writer_name', 'date']"
      />

      <!-- 파일 업로드 -->
      <div>
        <div class="writeGridContainer">
          <div class="writeGridLineItem">
            <div>파일 업로드</div>
            <div>
              <vs-button color="secondary" type="border" :href="excelLink">엑셀 템플릿 다운로드</vs-button>
              <vs-button color="secondary" class="ml-2" @click="onClickExcelUpload"> 작성 엑셀 업로드 </vs-button>
              <input v-show="false" ref="excelInput" type="file" multiple @change="readFile" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" />
            </div>
          </div>
        </div>
      </div>

      <!-- 등록 대상 위험성평가 정보 -->
      <div>
        <div class="flex justify-between items-center mt-6 mb-4">
          <h5><i class="dot"></i> 등록 대상 위험성평가 정보</h5>
        </div>
        <div style="max-height: 1070px; overflow-y: auto">
          <table>
            <colgroup>
              <col width="50" />
              <col width="60" />
              <col v-for="_ in 6" :key="`col_${_}`" />
              <col width="60" />
            </colgroup>
            <thead>
              <th></th>
              <th>No.</th>
              <th>사업장명</th>
              <th>공종명</th>
              <th>작업내용</th>
              <th>평가일</th>
              <th>실시기간 (시작)</th>
              <th>실시기간(종료)</th>
              <th>삭제</th>
            </thead>
            <tbody v-for="(excel, excel_i) in excelData" :key="`${excel_i}_${excel[0]}`">
              <tr>
                <td>
                  <img src="@/assets/icons/triangle_down.svg" class="mx-auto duration-200 cursor-pointer" :style="{ transform: excel.open ? 'rotate(0deg)' : 'rotate(-90deg)' }" @click="excel.open = !excel.open" />
                </td>
                <td>{{ excel_i + 1 }}</td>
                <td>
                  <field-selector class="w-full px-1" :field-name="excel.main.사업장명" @select="(data) => onSelectFieldSelector(excel_i, data)" />
                </td>
                <td><ml-input v-model="excel.main.공종명" class="w-full px-1" /></td>
                <td><ml-input v-model="excel.main.작업내용" class="w-full px-1" /></td>
                <td><date-selector v-model="excel.main.평가일" class="w-full px-1" /></td>
                <td><date-selector v-model="excel.main.실시기간_시작" class="w-full px-1" /></td>
                <td><date-selector v-model="excel.main.실시기간_종료" class="w-full px-1" /></td>
                <td>
                  <div class="flex justify-center gap-3">
                    <!-- <fragment v-if="editExcelIndex === excel_i && editSubExcelIndex === 'main'">
                      <button @click="onClickFinshExcelData(excel_i)">
                        <feather-icon icon="CheckIcon" svgClasses="h-5 w-5" />
                      </button>
                      <button @click="onClickCancelExcelData()">
                        <feather-icon icon="XIcon" svgClasses="h-5 w-5" />
                      </button>
                    </fragment> -->
                    <fragment>
                      <!-- <button @click="onClickEditExcelData(excel_i, 'main')">
                        <feather-icon icon="Edit2Icon" svgClasses="h-5 w-5" />
                      </button> -->
                      <button @click="onClickRemoveExcelData(excel_i, 'main')">
                        <feather-icon icon="Trash2Icon" svgClasses="h-5 w-5" />
                      </button>
                    </fragment>
                  </div>
                </td>
              </tr>
              <tr v-show="excel.open">
                <td colspan="9" class="p-0">
                  <table class="sub-table mb-5">
                    <colgroup>
                      <col v-for="_ in 5" :key="`sub_col_1_${_}`" />
                      <col width="60" />
                      <col width="60" />
                      <col v-for="_ in 2" :key="`sub_col_2_${_}`" />
                      <col width="60" />
                      <col width="60" />
                      <col v-for="_ in 3" :key="`sub_col_3_${_}`" />
                      <col width="60" />
                    </colgroup>

                    <tr>
                      <th>세부작업명</th>
                      <th>평가구분</th>
                      <th>유해 위험요인</th>
                      <th>재해형태</th>
                      <th>현재 안전보건조치</th>
                      <th>현재 위험도 가능성</th>
                      <th>현재 위험도 중대성</th>
                      <th>현재 위험도</th>
                      <th>위험감소대책</th>
                      <th>개선후 위험도 가능성</th>
                      <th>개선후 위험도 중대성</th>
                      <th>개선후 위험도</th>
                      <th>개선예정일</th>
                      <th>완료예정일</th>
                      <th>삭제</th>
                    </tr>
                    <tr v-for="(sub, sub_i) in excel.sub" :key="`sub_${excel_i}_${sub_i}`">
                      <td><ml-input v-model="sub.세부작업명" class="w-full px-1" /></td>
                      <td><ml-input v-model="sub.평가구분" class="w-full px-1" /></td>
                      <td><ml-input v-model="sub.유해위험요인" class="w-full px-1" /></td>
                      <td><ml-input v-model="sub.재해형태" class="w-full px-1" /></td>

                      <td><ml-input v-model="sub.현재안전보건조치" class="w-full px-1" /></td>
                      <td>
                        <vs-select v-model="sub.현재위험도가능성" autocomplete class="w-full px-1">
                          <vs-select-item v-for="__i in 5" :key="`sub_현재위험도가능성_${excel_i}_${sub_i}_${__i}`" :value="__i" :text="__i" />
                        </vs-select>
                      </td>
                      <td>
                        <vs-select v-model="sub.현재위험도중대성" autocomplete class="w-full px-1">
                          <vs-select-item v-for="__i in 4" :key="`sub_현재위험도중대성_${excel_i}_${sub_i}_${__i}`" :value="__i" :text="__i" />
                        </vs-select>
                      </td>
                      <td><ml-input readonly :value="setRisk(sub.현재위험도가능성, sub.현재위험도중대성)" class="w-full px-1" /></td>

                      <td><ml-input v-model="sub.위험감소대책" class="w-full px-1" /></td>
                      <td>
                        <vs-select v-model="sub.개선후위험도가능성" autocomplete class="w-full px-1">
                          <vs-select-item v-for="__i in 5" :key="`sub_개선후위험도가능성_${excel_i}_${sub_i}_${__i}`" :value="__i" :text="__i" />
                        </vs-select>
                      </td>
                      <td>
                        <vs-select v-model="sub.개선후위험도중대성" autocomplete class="w-full px-1">
                          <vs-select-item v-for="__i in 4" :key="`sub_개선후위험도중대성_${excel_i}_${sub_i}_${__i}`" :value="__i" :text="__i" />
                        </vs-select>
                      </td>
                      <td><ml-input readonly :value="setRisk(sub.개선후위험도가능성, sub.개선후위험도중대성)" class="w-full px-1" /></td>

                      <td><date-selector v-model="sub.개선예정일" class="w-full px-1" /></td>
                      <td><date-selector v-model="sub.완료예정일" class="w-full px-1" /></td>
                      <td>
                        <div class="flex justify-center gap-3">
                          <!-- <fragment v-if="editExcelIndex === excel_i && editSubExcelIndex === sub_i">
                            <button @click="onClickFinshExcelData(excel_i)">
                              <feather-icon icon="CheckIcon" svgClasses="h-5 w-5" />
                            </button>
                            <button @click="onClickCancelExcelData()">
                              <feather-icon icon="XIcon" svgClasses="h-5 w-5" />
                            </button>
                          </fragment> -->
                          <fragment>
                            <!-- <button @click="onClickEditExcelData(excel_i, sub_i)">
                              <feather-icon icon="Edit2Icon" svgClasses="h-5 w-5" />
                            </button> -->
                            <button @click="onClickRemoveExcelData(excel_i, sub_i)">
                              <feather-icon icon="Trash2Icon" svgClasses="h-5 w-5" />
                            </button>
                          </fragment>
                        </div>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </vx-card>
  </div>
</template>

<script>
import FieldSelectModule from "@/views/modules/FieldSelectModule";
import DateSelector from "@/components/selector/DateSelector";
import FieldSelector from "@/components/selector/FieldSelector";
import XLSX from "xlsx";
import moment from "moment";
import HttpRequest from "@/util/HttpRequest";
import { RiskAssessmentBody } from "@/views/_BS/RiskAssessmentForm";
import config from "/public/config";

export default {
  components: { FieldSelector, FieldSelectModule, DateSelector },
  data() {
    return {
      board: {
        projectTitle: this.$store.state.project.projectInfo.field_name,
        writer: {}, //작성자 정보
        readonly: false, // 읽기전용인가
        isPrint: false,
        viewSaveBtn: true,
        viewRemoveBtn: true,
      },

      form: {
        stdInfo: {},
        fields: [],
        company: null,
      },

      editExcelIndex: null,
      editSubExcelIndex: null,
      editExcelData: [],
      excelData: [],
      checkList: [],
    };
  },
  computed: {
    projectId() {
      return Number(this.$route.params.proj_id);
    },
    boardId() {
      return Number(this.$route.name.slice(-3));
    },
    myInfo() {
      return this.$store.state.member.memberInfo;
    },
    excelLink() {
      return `${config.BASE_API_URL}/storage/app/media/%EC%9C%84%ED%97%98%EC%84%B1%ED%8F%89%EA%B0%80_%EC%9D%BC%EA%B4%84%EB%93%B1%EB%A1%9D.xlsx`;
    },
  },
  async created() {
    this.$store.commit("menu/UPDATE_PAGE_LIST", [{ title: "Home" }, { title: "위험성평가" }, { title: "정기 위험성평가", active: true }]);
  },
  async mounted() {
    await this.init();
  },
  methods: {
    async init() {
      await this.$store.dispatch("USER_INFO");
      this.board.writer = {
        id: this.$store.state.auth.userInfo.id,
        name: this.$store.state.auth.userInfo.name,
        company_id: this.$store.state.auth.userInfo.company_id,
        department: this.$store.state.auth.userInfo.department,
        section: this.$store.state.auth.userInfo.section,
        rank: this.$store.state.auth.userInfo.rank,
        com_name: "",
      };

      await this.$store.dispatch("company/LOAD_COMPANY", {
        companyId: this.board.writer.company_id,
      });
      this.board.writer.com_name = this.$store.state.company.companyInfo.com_name;
      if (!this.board.writer.section) {
        this.board.writer.section = this.board.writer.com_name;
      }
    },
    onClickExcelUpload() {
      const excelInput = this.$refs.excelInput;
      excelInput.value = null;
      excelInput.click();
    },
    // 엑셀데이터 파싱
    readFile(event) {
      // get File object from input tag
      for (let i = 0; i < event.target.files.length; i++) {
        const file = event.target.files[i];
        // declare FileReader, temp result
        const reader = new FileReader();
        let tmpResult = {};

        // if you use "this", don't use "function(e) {...}"
        reader.onload = async (e) => {
          let data = e.target.result;
          data = new Uint8Array(data);
          // get excel file
          let excelFile = XLSX.read(data, { type: "array", cellDates: true });

          // get prased object
          excelFile.SheetNames.forEach(function (sheetName) {
            const roa = XLSX.utils.sheet_to_json(excelFile.Sheets[sheetName], { header: 1 });
            if (roa.length) tmpResult[sheetName] = roa;
          });

          const excelList = tmpResult.Sheet1.filter((data) => 0 < data.length);
          if (excelList.length < 2) {
            this.customAlert("엑셀 데이터가 없습니다");
            return;
          }

          let datas = [];
          let mainData = {},
            subDatas = [],
            err = {},
            findField = null;

          for (let i = 2; i < excelList.length; i++) {
            if (!!excelList[i][0]) {
              mainData = {
                // 기본정보
                사업장명: excelList[i][1],
                소속명: excelList[i][2],
                부서명: excelList[i][3],
                직책: excelList[i][4],
                작성자: excelList[i][5],
                작성일: this.setMoment(excelList[i][6]),

                // 위험성평가 정보
                공종명: excelList[i][7],
                작업내용: excelList[i][8],
                평가일: this.setMoment(excelList[i][9]),
                실시기간_시작: this.setMoment(excelList[i][10]),
                실시기간_종료: this.setMoment(excelList[i][11]),
                평가마감일: this.setMoment(excelList[i][12]),
              };
              subDatas.push({
                세부작업명: excelList[i][13],
                평가구분: excelList[i][14],
                유해위험요인: excelList[i][15],
                재해형태: excelList[i][16],
                현재안전보건조치: excelList[i][17],
                현재위험도가능성: excelList[i][18],
                현재위험도중대성: excelList[i][19],
                현재위험도: excelList[i][20],
                위험감소대책: excelList[i][21],
                개선후위험도가능성: excelList[i][22],
                개선후위험도중대성: excelList[i][23],
                개선후위험도: excelList[i][24],
                개선예정일: this.setMoment(excelList[i][25]),
                완료예정일: this.setMoment(excelList[i][26]),
              });

              // 사업장검사
              const loadField = await HttpRequest.get("/api/v1/field", {
                params: {
                  projectId: this.projectId,
                  code: "workplace-subcontract",
                  keyword: mainData.사업장명,
                },
              });
              findField = loadField.data.find((item) => item.field_name === mainData.사업장명);
              if (!findField) {
                mainData.사업장명 = "";
                err.사업장명 = "입력된 데이터가 검색되지 않습니다.";
              }
            } else {
              subDatas.push({
                세부작업명: excelList[i][13],
                평가구분: excelList[i][14],
                유해위험요인: excelList[i][15],
                재해형태: excelList[i][16],
                현재안전보건조치: excelList[i][17],
                현재위험도가능성: excelList[i][18],
                현재위험도중대성: excelList[i][19],
                현재위험도: excelList[i][20],
                위험감소대책: excelList[i][21],
                개선후위험도가능성: excelList[i][22],
                개선후위험도중대성: excelList[i][23],
                개선후위험도: excelList[i][24],
                개선예정일: this.setMoment(excelList[i][25]),
                완료예정일: this.setMoment(excelList[i][26]),
              });
            }

            // 다음 데이터가 없거나 다음 데이터의 첫번째 값이 있을때
            if (!excelList[i + 1] || !!excelList[i + 1][0]) {
              datas.push({ main: mainData, sub: subDatas, open: false, err, findField });
              mainData = {};
              subDatas = [];
              err = {};
              findField = null;
            }
          }

          this.excelData = datas;
        };
        reader.readAsArrayBuffer(file);
      }
    },
    setMoment(date) {
      if (!date) return "";
      let _date = date;
      if (typeof _date === "number") _date = `${_date}`;
      if (typeof _date === "string" && !_date.includes("-")) _date = `${_date.slice(0, 4)}-${_date.slice(4, 6)}-${_date.slice(6, 8)}`;
      const rd = moment(_date).add(1, "days").format("YYYY-MM-DD");
      // Invalid date 체크
      if (rd === "Invalid date") return "";
      return rd;
    },
    setRisk(data1, data2) {
      const data3 = Number(data1) * Number(data2);

      let data3Text = "매우낮음";
      if (data3 > 15) data3Text = "매우높음";
      else if (data3 > 12) data3Text = "높음";
      else if (data3 > 8) data3Text = "약간높음";
      else if (data3 > 6) data3Text = "보통";
      else if (data3 > 3) data3Text = "낮음";
      return data3Text;
    },
    // 수정버튼이 눌렸을때
    onClickEditExcelData(index, postion) {
      this.editExcelData = JSON.parse(JSON.stringify(this.excelData[index]));
      this.editExcelIndex = index;
      this.editSubExcelIndex = postion;
    },
    // 수정을 완료했을때
    onClickFinshExcelData(index) {
      let _data = this.editExcelData;
      if (this.editSubExcelIndex === "main") {
        const mainData = this.editExcelData.main.map((item, item_i) => {
          if (item_i === 3 || item_i === 4 || item_i === 5) return !!item.trim() ? moment(item).format("YYYY-MM-DD") : "";
          else return item;
        });
        _data = { ..._data, main: mainData };
      } else {
        // const subData = this.editExcelData.sub[this.editSubExcelIndex].map((item, item_i) => {
        //   if (item_i === 12 || item_i === 13) return !!item.trim() ? moment(item).format("YYYY-MM-DD") : "";
        //   else return item;
        // });
      }
      this.$set(this.excelData, index, _data);
      this.onClickCancelExcelData();
    },
    onClickCancelExcelData() {
      this.editExcelData = [];
      this.editExcelIndex = null;
      this.editSubExcelIndex = null;
    },
    onClickRemoveExcelData(index, postion) {
      if (postion === "main") this.excelData.splice(index, 1);
      else this.excelData[index].sub.splice(postion, 1);
    },
    onSelectFieldSelector(index, value) {
      if (value.field_name) {
        this.$set(this.excelData[index].main, "사업장명", value.field_name);
        this.$set(this.excelData[index], "findField", value);
        this.$set(this.excelData[index], "err", {});
      } else {
        this.$set(this.excelData[index].main, "사업장명", "");
        this.$set(this.excelData[index], "findField", null);
        this.$set(this.excelData[index], "err", { 사업장명: "입력된 데이터가 검색되지 않습니다." });
      }
    },
    onClickSave() {
      // 엑셀 데이터가 없을때 에러
      if (this.excelData.length < 1) {
        this.customAlert("등록 대상 위험성평가 정보가 없습니다");
        return;
      }
      // findField가 없을때 에러
      if (this.excelData.some((ed) => !ed.findField)) {
        this.customAlert("사업장명이 입력되지 않은 데이터가 있습니다");
        return;
      }

      this.loading(true);

      const header = { full: moment().format("YYYY-MM-DD"), month: Number(moment().format("MM")), year: Number(moment().format("YYYY")) };
      const posts = this.excelData.map((ed) => {
        const disasters = ed.sub.map((sub) => sub[3]);
        const riskAppraisalList = ed.sub.map((sub, sub_i) => {
          const input8Value = Number(sub.현재위험도가능성) * Number(sub.현재위험도중대성);
          const input13Value = Number(sub.개선후위험도가능성) * Number(sub.개선후위험도중대성);

          return {
            id: sub_i,
            input_check: false,
            input_1: sub.세부작업명,
            input_2: sub.평가구분,
            input_3: sub.유해위험요인,
            input_4: sub.재해형태,
            input_5: sub.현재안전보건조치,
            input_6: sub.현재위험도가능성,
            input_7: sub.현재위험도중대성,
            input_8: this.checkRank(input8Value),
            input_8_color: this.checkColor(input8Value),
            input_8_value: input8Value,
            input_9: sub.위험감소대책,
            input_11: sub.개선후위험도가능성,
            input_12: sub.개선후위험도중대성,
            input_13: this.checkRank(input13Value),
            input_13_color: this.checkColor(input13Value),
            input_13_value: input13Value,
            input_14: sub.개선예정일,
            input_15: sub.완료예정일,
            input_16: sub.담당자,
          };
        });

        const stdInfo = {
          ...this.form.stdInfo,
          project_name: ed.findField.project.field_name,
          field_id: ed.findField.id,
          field_name: ed.findField.field_name,
        };

        const content = {
          header,
          body: {
            ...JSON.parse(JSON.stringify(RiskAssessmentBody)),
            stdInfo,
            inputB_2: ed.main.공종명,
            inputB_3: ed.main.작업내용,
            inputB_4: ed.main.평가일,
            inputB_8: ed.main.실시기간_시작,
            inputB_9: ed.main.실시기간_종료,
            inputB_11: ed.main.평가마감일,
            riskAppraisalList,
            disasters: disasters.join(" "),
          },
        };

        return { title: "정기 위험성평가", content: JSON.stringify(content), projectId: this.projectId };
      });

      HttpRequest.put(`/api/v1/board/post/${this.boardId}/multiple`, { posts })
        .then((response) => {
          // 초기화
          this.excelData = [];
          this.editExcelData = [];
          this.editExcelIndex = null;
          this.editSubExcelIndex = null;

          this.loading(false);
          this.customAlert("위험성 평가가 등록되었습니다", "위험성 평가 등록");
        })
        .catch(({ response }) => {
          this.loading(false);
          // if (typeof response.data === "string") {
          //   const err = JSON.parse(response.data);
          //   this.errorMSG = err.map((_e) => {
          //     const { no, employee_code, job_category, employment_type, job_title, full_name, hire_date, current_position_date, contact_number, retirement_date } = _e.error;
          //     return [no, employee_code, job_category, employment_type, job_title, full_name, hire_date, current_position_date, contact_number, retirement_date];
          //   });
          // }
          // else if (typeof response.data === "object") {
          //   const errArray = [];
          //   const err = response.data;
          //   for (const _t in err) {
          //     const key = _t.split(".");
          //     errArray[key[1]] = { ...errArray[key[1]], ...{ [key[2]]: err[_t] } };
          //   }

          //   this.errorMSG = errArray.map((_e) => {
          //     const { no, employee_code, job_category, employment_type, job_title, full_name, hire_date, current_position_date, contact_number, retirement_date } = _e;
          //     return [no, employee_code, job_category, employment_type, job_title, full_name, hire_date, current_position_date, contact_number, retirement_date];
          //   });
          // } else {
          this.customAlert("서버에서 오류가 발생했습니다. 관리자에게 문의해주세요");
          // }
        });
    },
    checkColor(value) {
      if (value >= 1 && value <= 3) {
        return "#28C76F";
      } else if (value >= 4 && value <= 6) {
        return "#FF8510";
      } else {
        return "#E42728";
      }
    },
    checkRank(result) {
      if (result >= 1 && result <= 3) return "F";
      else if (result >= 4 && result <= 6) return "E";
      else if (result === 8) return "D";
      else if (result >= 9 && result <= 12) return "C";
      else if (result === 15) return "B";
      else if (result >= 16 && result <= 20) return "A";
    },
    customAlert(msg, title) {
      const customAlert = new CustomEvent("customAlert", {
        detail: {
          title: !!title ? title : "오류가 발생했습니다",
          message: msg,
        },
      });
      window.dispatchEvent(customAlert);
    },
    loading(open) {
      const loadingDialog = new CustomEvent("loadingDialog", {
        detail: {
          open,
        },
      });
      window.dispatchEvent(loadingDialog);
    },
    onClickTab(tabIndex) {
      if (tabIndex === 0) {
        this.$router.push({ name: "list|tab", params: { boardId: this.boardId } });
      }
    },
  },
};
</script>

<style scoped lang="scss">
table {
  table-layout: fixed;
  width: 100%;
  border-collapse: collapse;

  th,
  td {
    text-align: center;
    padding: 0;
  }

  th {
    font-weight: 700;
    font-size: 14px;
    line-height: 17px;

    background: #fafafa;
    border-top: 1px solid #cdcdcd;
    border-bottom: 1px solid #cdcdcd;
    padding: 16px 0;
  }

  td {
    font-weight: 400;
    font-size: 14px;
    line-height: 17px;

    border-bottom: 1px solid #cdcdcd;
    padding: 16px 0;
  }

  .sub-table {
    th {
      background: #7e72f20d;
      border-top: 0;
      padding: 16px 10px;
    }
  }

  button {
    width: 32px;
    height: 32px;

    display: flex;
    align-items: center;
    justify-content: center;

    color: #7e72f2;
    background: none;
    border: 1px solid #7e72f2;
    border-radius: 4px;
    cursor: pointer;

    span {
      margin: 0;
    }
  }

  .check {
    justify-content: center !important;
    ::v-deep {
      span {
        margin: 0;
      }
    }
  }
}
.errMsg {
  font-weight: 400;
  font-size: 12px;
  line-height: 17px;
  text-align: center;
  color: #ea5455;
  margin-top: 2px;
}
</style>
