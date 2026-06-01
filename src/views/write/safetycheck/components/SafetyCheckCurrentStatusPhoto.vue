<template>
  <div style="page-break-before: always">
    <vs-row class="my-4">
      <vs-col><h5><i class="dot"></i>현황사진</h5></vs-col>
    </vs-row>
    <vs-row>
      <vs-col class="photo-list" >

        <div v-for="(photo, index) in form.photos" :key="`photo_${index}`"
          class="photo-list-item">
          <div class="photo">
            <file-uploader type="only-image" class="w-full h-full" :readonly="board.readonly" v-model="photo.file"/>
            <div v-if="!board.readonly && !isPrint && photo.file.id" class="btn-close" @click="onClickRemove(photo)">
              <feather-icon icon="XIcon" />
            </div>
          </div>
          <div class="photo-title">
            <span v-if="isPrint">{{photo.title}}</span>
            <ml-input v-else class="w-full" v-model="photo.title" :placeholder="photo.placeholder"/>
          </div>
        </div>

      </vs-col>
    </vs-row>
  </div>
</template>

<script>
import FileUploader from '@/components/FileUploader'
export default {
  name: 'SafetyCheckCurrentStatusPhoto',
  components: {
    FileUploader},
  props: {
    board: Object,
    isPrint: Boolean,
    readonly:Boolean,
    value:Object
  },
  watch: {
    value (value) {
      this.form = value
    }
  },
  created () {
  },
  data () {
    return {
      // form: {
      //   photos:[
      //      {file:{}, title:'', placeholder:''},
      //   ]
      // }
      form: this.value
    }
  },
  methods: {

    onClickRemove (value) {
      value.file = {}
    }
  }
}
</script>

<style lang="scss" scoped>
.photo-list{
  display: grid; grid-template-columns: 1fr 1fr;
  border-top:1px solid #cdcdcd;
  border-left:1px solid #cdcdcd;

  .photo-list-item {
    border-right: 1px solid #cdcdcd;
    border-bottom: 1px solid #cdcdcd;

    .photo {
      padding: 14px;
      height: 296px;

      position: relative;
      border-bottom: 1px solid #cdcdcd;

      .btn-close {
        position: absolute;
        top: 0px;
        right: 0px;
        width: 32px;
        height: 32px;
        cursor: pointer;
        color: rgb(255, 255, 255);
        background-color: rgb(102, 112, 203);
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
    .photo-title {
      padding: 6px 14px;
    }
  }
}
</style>
