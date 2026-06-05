<template>
  <div>
    <div class="flex justify-between items-center my-4">
      <h5><i class="dot"></i> {{ title }}</h5>
      <input ref="fileInput" type="file" style="display: none" :accept="type === 'image' ? `image/gif, image/jpeg, image/png` : ''" @change="handleChangeFile" />
      <div v-if="isSuperUser && isChange" class="hidden xl:block">
        <vs-button class="" color="secondary" @click="openFileInput"> 파일추가 </vs-button>
        <vs-button v-if="type !== 'image'" class="ml-4" color="secondary" type="border" @click="fileRemove"> 선택삭제 </vs-button>
        <!-- <vs-button
          class="ml-4"
          color="secondary"
          @click="selectedDownloadFiles"
        >
          선택 다운로드
        </vs-button> -->
      </div>
    </div>
    <div v-if="type === 'image'" class="flex flex-col gap-4 mt-8">
      <div :key="index_image" v-for="(image, index_image) in tableList" class="relative">
        <div v-if="isSuperUser && isChange" class="delete-button-container" @click.stop="() => imageFileRemove(image)">
          <img src="@/assets/images/icon/icon-close.svg" alt="close" />
        </div>
        <a :href="image.path" target="_blank" class="cursor-pointer">
          <img :src="image.path" :alt="image.name" class="w-full" />
        </a>
      </div>
    </div>
    <vs-table v-else :multiple="isSuperUser && isChange" v-model="selected" :data="tableList" class="filedownload-table w-full" noDataText="파일이 없습니다">
      <template slot="thead">
        <vs-th class="text-sm">
          <p class="w-full text-center">서식명</p>
        </vs-th>
        <vs-th class="hidden xl:table-cell text-sm">
          <p class="w-full text-center">업로드 시각</p>
        </vs-th>
        <vs-th class="hidden xl:table-cell text-sm">
          <p class="w-full text-center">업로드 팀원</p>
        </vs-th>
        <vs-th class="hidden xl:table-cell text-sm text-center">
          <p class="w-full text-center">파일크기</p>
        </vs-th>
        <vs-th class="w-24 text-sm">
          <p class="w-full text-center">다운로드</p>
        </vs-th>
      </template>

      <template slot-scope="{ data }">
        <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
          <vs-td class="xl:hidden">
            <div class="flex items-center gap-2">
              <p class="font-medium text-base">{{ tr.name }}</p>
              <p class="font-normal text-sm" style="color: #9ca0a4">{{ tr.size }}</p>
            </div>
            <div class="font-normal text-sm">
              {{ tr.date | moment("YYYY-MM-DD, HH:ss,") }}
              {{ tr.user }}
            </div>
          </vs-td>
          <vs-td class="hidden xl:table-cell">
            <p class="w-full text-center">{{ tr.name }}</p>
          </vs-td>
          <vs-td class="hidden xl:table-cell">
            <p class="w-full text-center">
              {{ tr.date | moment("YYYY-MM-DD HH:ss") }}
            </p>
          </vs-td>
          <vs-td class="hidden xl:table-cell">
            <p class="w-full text-center">{{ tr.user }}</p>
          </vs-td>
          <vs-td class="hidden xl:table-cell">
            <p class="w-full text-center">{{ tr.size }}</p>
          </vs-td>
          <vs-td @click.stop>
            <div class="flex justify-center">
              <button @click.stop="() => downloadFile(tr.id, tr.name)" style="background: none" class="border-0 cursor-pointer">
                <feather-icon icon="DownloadIcon" />
              </button>
            </div>
          </vs-td>
        </vs-tr>
      </template>
    </vs-table>
    <div v-if="isSuperUser && isChange" class="xl:hidden flex items-center justify-end gap-4 py-3">
      <vs-button class="" color="secondary" @click="openFileInput"> 파일추가 </vs-button>
      <vs-button v-if="type !== 'image'" color="secondary" type="border" @click="fileRemove"> 선택삭제 </vs-button>
      <!-- <vs-button
          class="ml-4"
          color="secondary"
          @click="selectedDownloadFiles"
        >
          선택 다운로드
        </vs-button> -->
    </div>
  </div>
</template>

<script>
import VueCookie from "vue-cookie";
import config from "../../public/config";

export default {
  props: {
    title: { type: String, default: "관련 서식 다운로드" },
    list: Array,
    isPrint: Boolean,
    isReadonly: Boolean,
    isChange: { type: Boolean, default: true },
    type: String,
  },
  data() {
    return {
      selected: [],
      tableList: [],
    };
  },
  computed: {
    boardSlug() {
      return `board-${this.$route.params.boardId}`;
    },
    isSuperUser() {
      const userInfo = this.$store.state.auth.userInfo;
      return 0 < userInfo.is_superuser;
    },
  },
  created() {
    this.loadBoard();
  },
  methods: {
    async loadBoard() {
      await this.$store.dispatch("board/LOAD_BOARD", {
        boardId: this.boardSlug,
      });

      const boardData = this.$store.state.board.boardData;

      this.tableList = boardData.attachments.map((att) => {
        let sizeCheck = att.file_size;
        if (sizeCheck < 1000) sizeCheck = `${sizeCheck}B`;
        else if (sizeCheck < 1000000) sizeCheck = `${(sizeCheck * 0.001).toFixed(1)}KB`;
        else sizeCheck = `${(sizeCheck * 0.000001).toFixed(1)}MB`;

        return {
          id: att.id,
          name: att.file_name,
          date: att.updated_at,
          user: att.user && att.user.name,
          size: sizeCheck,
          path: att.path,
        };
      });
    },
    async fileUpload(files) {
      if (files.length > 0) {
        await this.$store.dispatch("file/FILE_UPLOAD", files[0]);
        const fileInfo = this.$store.state.file.uploadedFile;

        await this.$store.dispatch("board/UPLOAD_FILE_LIST", {
          boardSlug: this.boardSlug,
          uploads: [fileInfo.id],
        });

        this.loadBoard();
      }
      this.$refs.fileInput.value = null;
    },
    imageFileRemove(data) {
      this.selected = [data];
      this.fileRemove();
    },
    async fileRemove() {
      if (this.selected.length < 1) return;
      const _confirm = confirm("선택한 파일을 삭제하시겠습니까?");
      if (!_confirm) return;
      const fileIds = this.selected.map((item) => item.id);
      await this.$store.dispatch("board/REMOVE_FILE_LIST", {
        boardSlug: this.boardSlug,
        fileIds,
      });

      this.selected = [];
      this.loadBoard();
    },
    async downloadFile(fileId, filename) {
      const token = VueCookie.get("token");
      fetch(`${config.BASE_API_URL}/api/v1/board/${this.boardSlug}/download?fileId=${fileId}`, {
        headers: new Headers({
          Authorization: `Bearer ${token}`,
        }),
      }).then((response) => {
        response.blob().then((myBlob) => {
          const url = window.URL.createObjectURL(myBlob);
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", filename);
          document.body.appendChild(link);
          link.click();
        });
      });
    },
    selectedDownloadFiles() {
      this.selected.map((item) => {
        this.downloadFile(item.id, item.path, item.name);
      });
    },
    openFileInput() {
      this.$refs.fileInput.click();
    },
    handleChangeFile(event) {
      this.fileUpload(event.target.files);
    },
  },
};
</script>

<style lang="scss" scoped>
.filedownload-table::v-deep {
  .vs-table--tbody-table {
    min-width: auto;
  }
  .vs-con-tbody {
    border: 0;
  }

  tr {
    background: white;
    border-top: solid 1px #cdcdcd;
    border-bottom: solid 1px #cdcdcd;
    transform: translateY(0px) !important;
  }
  th {
    background: #f9f9f9;
    font-size: 14px !important;
  }
}

.delete-button-container {
  position: absolute;
  top: -8px;
  right: -8px;
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 24px;
  height: 24px;
  border-radius: 999px;
  border: 1px solid #222;
  cursor: pointer;

  > img {
    position: relative;
    width: 12px;
    height: 12px;
  }
}
</style>
