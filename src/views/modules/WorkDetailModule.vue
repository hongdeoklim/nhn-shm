<template>
  <vx-card>
    <vs-row class="mb-4 flex">
      <vs-col class="w-1/2">위험요인</vs-col>
      <vs-col v-if="enableClose" class="w-1/2 text-right"><vs-button class="p-2 px-4" type="border" @click="handleClose">X</vs-button></vs-col>
    </vs-row>

    <vs-row class="pb-4 mb-4 border-bottom">
      <vs-col>
        <ml-input v-model="data.work_unit"/>
      </vs-col>
    </vs-row>
    <vs-row class="mb-4">
      <vs-col class="w-full">
        <h5 class="mb-4" style="font-size:1rem;"><i class="dot"></i>위험요인</h5>
      </vs-col>
      <vs-col>
        <ml-textarea v-model="data.risk_factor"/>
      </vs-col>
    </vs-row>

    <vs-row class="mb-4">
      <vs-col class="w-full">
        <h5 class="mb-4" style="font-size:1rem;"><i class="dot"></i>안전보건대책</h5>
      </vs-col>
      <vs-col>
        <ml-textarea v-model="data.safety_measures"/>
      </vs-col>
    </vs-row>

    <vs-row class="mb-4">
      <vs-col class="w-full">
        <h5 class="mb-4" style="font-size:1rem;"><i class="dot"></i>재해형태</h5>
      </vs-col>
      <vs-col>
        <ml-textarea v-model="data.disaster_type"/>
      </vs-col>
    </vs-row>

    <vs-row class="mb-4">
      <vs-col class="w-full">
        <h5 class="mb-4" style="font-size:1rem;"><i class="dot"></i>안전대책 이행</h5>
      </vs-col>
      <vs-col>
        <p class="btn-list" style="display: grid; grid-template-columns: 1fr 1fr 1fr;">
          <label class="btn" :class="data.exe === 'Y' ? 'active':''" @click="()=>{onClickChangeExe('Y') }">
            Yes
          </label>
          <label class="btn" :class="data.exe === 'N' ? 'active':''" @click="()=>{onClickChangeExe('N') }">
            No
          </label>
          <label class="btn" :class="data.exe !== 'Y' && data.exe !== 'N' ? 'active':''" @click="()=>{onClickChangeExe('') }">
            N/A
          </label>
        </p>

      </vs-col>
    </vs-row>

    <vs-row class="mb-4">
      <vs-col class="w-full">
        <h5 class="mb-4" style="font-size:1rem;"><i class="dot"></i>점검결과 조치사항</h5>
      </vs-col>
      <vs-col>
        <ml-textarea class="w-full" rows="3" v-model="data.solution" :readonly="readonly"/>
      </vs-col>
      <vs-col v-if="!readonly">
        <vs-button type="border" @click="handleClickFileUpload">파일첨부</vs-button>
      </vs-col>
      <vs-col style="overflow-x:auto">
        <div style="display:inline-flex">
          <a v-for="(file, index) of data.fileList" :key="index" :href="file.path" target="_blank">
            <img style="width:100px; background-color: #cdcdcd;" :src="file.path" v-if="isImageWithFileName(file.fileName)"/>
            <div v-else style="width:100px; height:100px; display: flex; justify-content: center; align-items: center;">
              <vs-icon icon-pack="feather" icon="icon-file" />
              {{file.fileName}}
            </div>
          </a>
        </div>
      </vs-col>
    </vs-row>

    <vs-row v-if="list.length > 0" class="mt-12 mb-4 border-bottom">
      <vs-col class="w-full">
        <h5 class="mb-4" style="font-size:1rem;"><i class="dot"></i>점검결과 기록</h5>
      </vs-col>
    </vs-row>

    <vs-row v-for="(item,index) of list" :key="index">
      <vs-col class="w-full pb-4 mb-4 border-bottom">
        <div @click="selectListItem(index)">
          <span style="font-size: 1rem; ">{{item.checkDate}}</span> | <span style="font-size: 1rem; font-weight: 500">점검기록</span>
        </div>
      </vs-col>
      <div class="hide mb-4" :id="'checklogMiniList_'+index" style="overflow-x:auto">
        <vs-col>
          <p>{{item.comment}}</p>
        </vs-col>
        <vs-col class="w-full mb-2" style="overflow-x:auto">
          <div style="display:inline-flex">
            <vs-image
              v-for="(file, index) in item.fileList" :key="'fileList_'+index"
              style="width:100px; height:100px; background-color: #cdcdcd; background-size: cover"
              :src="file.path"></vs-image>
          </div>
        </vs-col>
        <vs-col class="mb-2" v-if="item.list && item.list.length > 0">
          <div v-for="(after, aftIndex) of item.list" :key="aftIndex">
            <p style="font-size: 0.85rem; text-align: left;">{{after.user_name}} ({{after.created_at}})</p>
            <p>{{after.comment}}</p>
            <p style="font-size: 0.85rem; text-align: right;"><a href="javascript:;" @click="()=>{handleDeleteComment(item, after)}">삭제</a> </p>
          </div>
        </vs-col>
        <vs-row class="w-full grid" style="grid-template-columns: 1fr auto;">
          <vs-col class="w-full pr-2" style="height:28px;">
            <ml-input class="side-input w-full h-full" style="padding:0px;" v-model="item.input"/>
          </vs-col>
          <vs-col class="w-full">
            <vs-button class="w-full small" @click="()=>{handleAddComment(item)}">입력</vs-button>
          </vs-col>
        </vs-row>
      </div>
    </vs-row>

    <vs-row class="mt-8">
      <vs-col>
        <vs-button class="w-full" color="secondary" @click="onClickDelete" >삭제</vs-button>
      </vs-col>
    </vs-row>

  </vx-card>
</template>

<script>
export default {
  name: 'WorkDetailModule',
  props:{
    value:Object,
    enableClose:{
      type:Boolean,
      default: true
    },
    readonly:{
      type:Boolean,
      default: false
    },
    boardSlug: {
      type: String,
      default: 'daily_safety_check_diary'
    }
  },
  watch :{
    value: {
      deep: true,
      handler (value) {
        this.data = value
        //this.loadPostList()
      }
    }
  },
  data () {
    return {
      rand: Math.floor(Math.random() * 10000),
      data:{},
      list:[],
      afterData:{}
    }
  },
  created () {
    this.data = this.value
    //this.loadPostList()
  },
  methods:{
    selectListItem (index) {
      const dom =  document.getElementById(`checklogMiniList_${index}`)
      if (dom.classList.contains('hide')) {
        dom.classList.remove('hide')
      } else {
        dom.classList.add('hide')
      }
    },

    imageExtWithFileName (fileName) {
      const fileNames  =  fileName.split('.')
      const ext = fileNames[fileNames.length  - 1].toLowerCase()
      return ext
    },

    isImageWithFileName (fileName) {
      const ext = this.imageExtWithFileName(fileName)
      if (ext === 'jpg' || ext === 'jpeg' || ext === 'jfif' || ext === 'exif' || ext === 'gif' || ext === 'bmp' || ext === 'png') {
        return true
      }

      return false
    },

    async loadPostList () {
      this.list = []
      this.afterData = []

      const boardSlug = this.boardSlug
      const page = 1
      const perPage = 1000
      const projectId = this.$route.params.proj_id
      const projectOrder = this.data.orderNumber
      const keyword = [`contentd$preview.orderNumber*${projectOrder}`]

      await this.$store.dispatch('approval/LOAD_POST_ALL', {boardSlug, page, perPage, projectId, keyword})

      const list = this.$store.state.approval.list
      for (const item of list) {
        const post_content = JSON.parse(item.post.post_content)
        const list1 = post_content.list1
        const list2 = post_content.list2
        let list = list1
        if (this.data.listType === 'list1') {
          list = list1
        } else if (this.data.listType === 'list2') {
          list = list2
        }

        const approved_afters = item.approved_afters
        if (approved_afters && approved_afters.length > 0) {
          this.afterData = JSON.parse(approved_afters[0].after_content)
        }

        const key = `${item.post_id}_${this.data.listType}_${this.data.num}`
        if (!this.afterData[key]) {
          this.afterData[key] = []
        }
        const commentList = this.afterData[key]

        if (list[this.data.num]) {
          this.list.push({
            afterId : (approved_afters && approved_afters.length > 0) ? approved_afters[0].id : 0,
            postId : item.post_id,
            listType: this.data.listType,
            num: this.data.num,
            list: commentList,

            checkDate: this.getPreview(item).checkDate,
            comment: list[this.data.num].solution,
            fileList: list[this.data.num].fileList,

            input:''
          })
        }
      }
    },

    getPreview (data) {
      if (data.post.preview) {
        const preview = JSON.parse(data.post.preview)
        return preview
      }
    },

    handleClickFileUpload () {
      this.$emit('handleClickFileUpload')
    },

    handleClose () {
      this.$emit('handleClose')
    },

    async handleAddComment (item) {
      const key = `${item.postId}_${this.data.listType}_${this.data.num}`
      const comment = item.input
      const userInfo = this.$store.state.auth.userInfo
      const user_id = userInfo.id
      const user_name = userInfo.name
      const created_at = new Date().format('yyyy-MM-dd HH:mm:ss')

      this.afterData[key].push({user_id, user_name, created_at, comment})


      const afterId = item.afterId
      const boardSlug = this.boardSlug
      const postId = item.postId

      if (afterId && afterId !== 0) {
        const content = JSON.stringify(this.afterData)
        await this.$store.dispatch('approval/UPDATE_AFTER_DATA', {
          content,
          boardSlug,
          postId,
          afterId
        })
      } else {
        const content = [JSON.stringify(this.afterData)]
        await this.$store.dispatch('approval/ADD_AFTER_DATA', {
          content,
          boardSlug,
          postId
        })
      }

      document.location.reload()
    },
    async handleDeleteComment (item, after) {
      const user_id = after.user_id
      const myId = this.$store.state.auth.userInfo.id

      if (user_id === myId) {
        const key = `${item.postId}_${this.data.listType}_${this.data.num}`
        const afterId = item.afterId
        const boardSlug = this.boardSlug
        const postId = item.postId

        this.afterData[key].remove(after)

        const content = JSON.stringify(this.afterData)
        await this.$store.dispatch('approval/UPDATE_AFTER_DATA', {
          content,
          boardSlug,
          postId,
          afterId
        })

        document.location.reload()
      } else {
        alert('삭제 권한이 없습니다')
      }
    },

    onClickChangeExe (value) {
      if (this.readonly) {

      } else {
        const newData = this.data
        newData.exe = value
        this.data = newData
      }
    },

    onClickDelete () {
      this.$emit('delete', this.data)
    }
  }
}
</script>

<style scoped lang="scss">
.hide {
  display: none;
}

.btn-list {
  .btn {
    cursor: pointer;
    border-radius: 0rem;
    display: grid;
    justify-content: center;
    align-items: center;
    padding:0.5rem;

    color: rgba(var(--vs-secondary), 1);
    background-color: transparent;
    border:1px solid rgba(var(--vs-secondary), 1);

    &.active {
      color: #fff;
      background-color: rgba(var(--vs-secondary), 1);
      border-color: transparent;
    }
  }
  .btn:first-child{
    border-top-left-radius: 0.5rem;
    border-bottom-left-radius: 0.5rem;
  }
  .btn:last-child{
    border-top-right-radius: 0.5rem;
    border-bottom-right-radius: 0.5rem;
   }
}
</style>

<style>
  [dir] .side-input .vs-input--input.normal {
    padding: 4px !important;
  }
  .vs-image--img {
    background-size: cover;
  }
</style>
