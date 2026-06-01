<template>
  <!-- 인쇄할 때 표시 -->
  <div v-if="(isPrint || readonly) && printFile.length > 0">
    <!-- ========== Head ========== -->
    <div ref="printPhotoUploadGridModulHead">
      <div v-if="isShowTitle && !!sectionTitle && customTitle" style="page-break-before: always">
        <slot name="customTitle"></slot>
      </div>
      <div v-else-if="isShowTitle && !!sectionTitle" class="mt-6 mb-4">
        <h5><i class="dot"></i>{{ sectionTitle }}</h5>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div v-for="(file, fileIndex) of printFile" :key="file.id" class="print-container col-1 flex flex-col" style="border-top: 1px solid #757575;border-left: 1px solid #757575" :style="{ height: fileIndex < 4 ? `calc(50vh - ${printHeadHeight}px)` : `calc(50vh - 16px)` }">
        <div class="mb-2" v-if="gridTitle && gridTitle[fileIndex - 1]" style="border-right: 1px solid #757575; border-bottom: 1px solid #757575">{{ gridTitle[fileIndex - 1] }}</div>
        <div style="width: 100%; height: 9.5cm; flex: 1; border-right: 1px solid #757575; border-bottom: 1px solid #757575;" class="flex items-center justify-center overflow-hidden p-2" >
          <img :src="file.path" width="100%" height="100%" class="max-w-full w-auto object-contain" />
        </div>
        <!-- ========== Footer ========== -->
        <slot name="footer" :file="file" :fileIndex="fileIndex" style="border-right: 1px solid #757575; border-bottom: 1px solid #757575;">
          <div v-if="showFooterInput && withDatePicker" class="grid grid-cols-12 gap-y-4" style="border-right: 1px solid #757575; border-bottom: 1px solid #757575; font-size: 18px;">
            <div class="col-span-6 flex items-center gap-2" style="border-right: 1px solid #757575;">
              <p class="p-2" style="border-right: 1px solid #757575;">날 짜</p>
              <p>{{ file.date }}</p>
            </div>
            <div class="col-span-6 flex items-center gap-2">
              <p class="p-2" style="border-right: 1px solid #757575;">내 용</p>
              <p>{{ file.input }}</p>
            </div>
          </div>
          <table v-else-if="showFooterInput && !withDatePicker" style="width: 100%; border-collapse: collapse;">
            <tbody>
            <tr>
              <td class="px-6 py-2" style="border-right: 1px solid #757575; border-bottom: 1px solid #757575; white-space: nowrap;">내용</td>
              <td class="w-full px-2 text-center" style="border-right: 1px solid #757575; border-bottom: 1px solid #757575;">{{ file.input }}</td>
              <td v-if="typeof footerBeforeText === 'string' && !!footerBeforeText"
                  style="width: 114px; border-right: 1px solid #757575; border-bottom: 1px solid #757575; white-space: nowrap;" class="px-2">{{ footerBeforeText }}</td>
              <td v-else-if="0 < footerBeforeText.length && !!footerBeforeText[fileIndex]"
                  style="width: 114px; border-right: 1px solid #757575; border-bottom: 1px solid #757575; white-space: nowrap;" class="px-2">{{ footerBeforeText[fileIndex] }}</td>
            </tr>
            </tbody>
          </table>
        </slot>
      </div>
    </div>
  </div>

  <!-- 작성할 때 표시 -->
  <div v-else-if="!isPrint && !readonly">
    <div v-if="isShowTitle || isCheckMode" class="flex justify-between items-center mt-8 mb-4">
      <!-- Title -->
      <h5 v-if="isShowTitle && !!sectionTitle" class="flex-1 flex items-center"><i class="dot"></i>{{ sectionTitle }}</h5>
      <div v-else class="flex-1"></div>

      <!-- Controller -->
      <div v-if="isCheckMode && !readonly && !isPrint">
        <vs-button color="secondary" @click="handleAdd"> 사진추가 </vs-button>
        <vs-button v-if="useDeleteLatestItem" class="ml-4" color="secondary" type="border" @click="handleRemove(-1)"> 마지막 항목 삭제 </vs-button>
        <vs-button v-else class="ml-4" color="secondary" type="border" @click="handleRemove"> 선택삭제 </vs-button>
      </div>
    </div>

    <slot name="customInput"></slot>

    <div class="grid grid-cols-6 xl:grid-cols-12 h-upload gap-5" :class="isShowTitle ? '' : 'mt-6'">
      <div v-for="(file, file_i) in fileList" :key="file_i" class="upload-content" :class="'col-span-' + Math.ceil(12 / setRowCount)">
        <!-- ========== Head ========== -->
        <div class="mb-2" v-if="gridTitle && gridTitle[file_i]">{{ gridTitle[file_i] }}</div>

        <!-- ========== Image ========== -->
        <div class="upload-content__file">
          <vs-checkbox v-if="isCheckMode" v-model="file.checked" :style="'position: absolute; top: 0;'" class="mt-2 z-20" />
          <div class="upload-content__content">
            <FileUploaderTransparent
              style="background-size: contain; background-repeat: no-repeat"
              v-model="file.image"
              :readonly="readonly"
              @input="setFile(file_i, file.image)"
              @progress="(state) => { fileProgress(file_i, state) }"
            />
          </div>
          <simple-spinner
            v-if="file.showSpinner"
            style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-color: #cdcdcdaa"/>
        </div>

        <!-- ========== Footer ========== -->
        <slot name="footer" :file="file" :fileIndex="file_i">
          <div v-if="showFooterInput && withDatePicker" class="grid grid-cols-12 gap-x-6 gap-y-4 mt-4">
            <div class="col-span-6 flex items-center gap-2">
              날짜
              <date-selector class="w-full flex-1" v-model="file.date" :placeholder="placeHolderDatePicker" :readonly="readonly" />
            </div>
            <div class="col-span-6 flex items-center gap-2">
              내용
              <ml-input v-model="file.input" :placeholder="placeholder" class="w-full flex-1"/>
            </div>
          </div>
          <div v-else-if="showFooterInput && !withDatePicker" class="upload-content__input flex justify-center items-center gap-3 mt-2">
            <ml-input class="flex-1" v-model="file.input" :placeholder="file.placeholder ? file.placeholder : placeholder" :readonly="readonly" />
            <p v-if="typeof footerBeforeText === 'string' && !!footerBeforeText" style="width: 114px">{{ footerBeforeText }}</p>
            <p v-else-if="0 < footerBeforeText.length && !!footerBeforeText[file_i]" style="width: 114px">{{ footerBeforeText[file_i] }}</p>
          </div>
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
import TemplateFileUploadCheckList from "@/views/modules/template/TemplateFileUploadCheckList";
import TemplateFileUploadCheckListCol from "@/views/modules/template/TemplateFileUploadCheckListCol";
import TemplateFileUploadGallery from "@/views/modules/template/TemplateFileUploadGallery";
import FileUploaderTransparent from "@/components/FileUploaderTransparent2";
import DateSelector from "@/components/selector/DateSelector";
import SimpleSpinner from "@/components/spinner/SimpleSpinner.vue";

export default {
  name: "PhotoUploadGridModule",
  components: {
    SimpleSpinner,
    TemplateFileUploadGallery,
    TemplateFileUploadCheckListCol,
    TemplateFileUploadCheckList,
    FileUploaderTransparent,
    DateSelector,
  },
  props: {
    isCheckMode: {
      type: Boolean,
      default: true,
    },
    type: {
      type: String,
      default: "check_list",
    },
    /** 이미지 업로드 그리드 개수 */
    gridCount: { type: Number, default: 4 },

    /** 한 줄에 표시할 셀의 개수 (1 ~ 4) */
    rowCount: { type: Number, default: 2 },

    /** 사진추가시 증가될 수 */
    addCount: { type: Number, default: 1 },

    /** 마지막 항목 삭제 기능 사용*/
    useDeleteLatestItem: {
      type: Boolean,
      default: false,
    },

    /** 맨 위에 표시할 동그라미 제목 */
    sectionTitle: String,

    /** 파일 형식 상관없이 업로드할 수 있는 경우 TRUE */
    fileTypeAll: {
      type: Boolean,
      default: false,
    },
    withDatePicker: {
      type: Boolean,
      default: false,
    },

    /** 맨 위의 동그라미 제목 표시 여부 */
    isShowTitle: {
      type: Boolean,
      default: true,
    },
    customTitle: {
      type: Boolean,
      default: false,
    },

    /** 인쇄용 화면일 경우 TRUE */
    isPrint: Boolean,

    showFooterInput: {
      type: Boolean,
      default: true,
    },
    footerBeforeText: {
      type: Array | String,
      default: () => [],
    },
    /** 입력 창에 표시할 힌트 */
    placeholder: String,

    placeHolderDatePicker: {
      type: String,
      default: "날짜선택",
    },

    readonly: Boolean,
    id: String,
    value: Array, //{ id:0, fileName:'test1.txt', fileSize:1234, path:'', thumb:'', input:'' }
    multiStage: Number,

    /** 인풋창 제거 */
    notInput: Boolean,
    /** 그리드내 타이틀 */
    gridTitle: Array,
  },
  watch: {
    value: {
      handler(value) {
        // 값이 실제로 변경되었는지 확인
        const newValue = JSON.stringify(value);
        if (this.lastEmittedValue === newValue) {
          return;
        }
        
        // 무한 루프 방지: 외부에서 업데이트 중임을 표시
        this.isUpdatingFromParent = true;
        this.fileList = value;
        // 마지막 emit 값 업데이트
        this.lastEmittedValue = newValue;
        this.$nextTick(() => {
          this.isUpdatingFromParent = false;
        });
      },
    },
    fileList: {
      immediate: true,
      deep: true,
      handler(value) {
        // 값이 실제로 변경되었는지 먼저 확인 (JSON 비교)
        const currentValue = JSON.stringify(value);
        if (this.lastEmittedValue === currentValue) {
          return;
        }
        
        // 부모로부터 업데이트 중이면 emit 안 함
        if (this.isUpdatingFromParent) {
          return;
        }
        
        this.lastEmittedValue = currentValue;
        this.$emit("input", value);
      },
    },
    isPrint: {
      immediate: true,
      deep: true,
      handler(value) {
        if (value) {
          this.$nextTick(() => {
            if (!!this.$refs.printPhotoUploadGridModulHead) this.printHeadHeight = (this.$refs.printPhotoUploadGridModulHead.clientHeight + 100) / 2;
            else this.printHeadHeight = 80;
          });
        }
      },
    },
  },
  computed: {
    printFile() {
      return this.fileList.filter((file) => !!file.id);
    },
    setRowCount() {
      if (4 < this.rowCount) return 4;
      else if (this.rowCount < 1) return 1;
      else return this.rowCount;
    },
  },
  data() {
    return {
      printHeadHeight: 80,
      fileList: this.value,
      checkIndex: [],
      isUpdatingFromParent: false, // 무한 루프 방지 플래그
      lastEmittedValue: null, // 마지막으로 emit한 값 저장
    };
  },
  created() {
    this.fillEmptyFileList();
  },
  methods: {
    fillEmptyFileList() {
      if (this.fileList) {
        for (let index = this.fileList.length; index < this.gridCount; index++) {
          this.fileList.push({showSpinner: false});
        }
      }
    },
    handleAdd() {
      for (let index = 0; index < this.addCount; index++) {
        this.fileList.push({showSpinner: false});
      }
    },
    handleRemove(index) {
      if (index === -1) {
        for (let i=0; i<this.addCount; i++) {
          this.fileList.pop();
        }
      } else {
        this.fileList = this.fileList.filter((fl) => !fl.checked);
      }
    },
    setFile(index, file) {
      // fileList 변경 전에 플래그 설정
      this.isUpdatingFromParent = true;
      
      this.fileList[index].id = file ? file.id : null;
      this.fileList[index].path = file ? file.path : null;
      this.fileList[index].fileName = file ? file.fileName : null;
      
      // setFile 후 lastEmittedValue 업데이트하고 플래그 해제
      this.$nextTick(() => {
        this.lastEmittedValue = JSON.stringify(this.fileList);
        this.isUpdatingFromParent = false;
      });
    },
    fileProgress (index, state) {
      if (state === 'start') {
        this.fileList[index].showSpinner = true;
      } else if (state === 'success') {
        this.fileList[index].showSpinner = false;
        this.$toast.open({type: 'default', message: '이미지 업로드가 완료되었습니다.', position: 'bottom', duration: 2000});
      } else if (state === 'fail') {
        this.fileList[index].showSpinner = false;
        this.$toast.open({type: 'error', message: '이미지 업로드가 완료되었습니다.', position: 'bottom', duration: 2000});
      }
    },
    // 읽기 전용에서, 이미지가 클릭됐을 때 새 창으로 이미지 표시
    onClickImage(src) {
      window.open(src, "_blank");
    },
  },
};
</script>

<style scoped lang="scss">
.upload-content__file {
  width: 100%;
  padding-top: 56.25%;
  position: relative;
  border: 1px solid #cdcdcd;
  border-radius: 6px;

  .upload-content__content {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-position: center center;
    background-size: cover;

    .printImg {
      background-color: white;
      border-radius: 6px;
    }
  }
}
</style>
