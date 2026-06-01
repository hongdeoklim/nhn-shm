<template>
  <vs-popup id="popupOption" :title="title" :active.sync="isActive">
    <div class="popup-content">
      <draggable v-model="editableValue" handle=".handle" class="list-group">
        <div v-for="(item, index) in editableValue" :key="index" class="list-item">
          <vs-icon icon="drag_indicator" class="handle"></vs-icon>
          <vs-input v-model="item.value" :placeholder="placeholder" class="item-input" />
          <vs-button @click="removeItem(index)" color="danger" type="flat" icon="delete"></vs-button>
        </div>
      </draggable>
      <div class="w-full text-center">
        <vs-button @click="addItem" color="secondary" class="add-button">항목 추가</vs-button>
      </div>
    </div>
    <div class="mt-2 flex justify-center gap-4">
      <vs-button @click="isActive = false"  color="secondary" type="border">취소</vs-button>
      <vs-button @click="save"  color="secondary">저장</vs-button>
    </div>
  </vs-popup>
</template>

<script>
import draggable from "vuedraggable";

export default {
  name: "PopupOption",
  components: {
    draggable,
  },
  props: {
    value: { type: Array, default: [] },
    active: { type: Boolean, default: false },
    title: { type: String, default: "옵션 관리" },
    placeholder: String,
  },
  data() {
    return {
      editableValue: [],
    };
  },
  watch: {
    active(isActive) {
      // 팝업이 열릴 때(active가 true가 될 때)
      // v-model로 받은 value(원본 배열)를 수정 가능한 내부 데이터로 복사합니다.
      if (isActive) {
        this.editableValue = JSON.parse(JSON.stringify(this.value));
      }
      // 부모에게 상태 변경을 알립니다.
      this.$emit("update:active", isActive);
    },
  },
  methods: {
    addItem() {
      this.editableValue.push({ value: "" });
    },
    removeItem(index) {
      this.editableValue.splice(index, 1);
    },
    save() {
      // v-model을 업데이트하기 위해 input 이벤트를 발생시킵니다.
      this.$emit("input", this.editableValue);
      this.$emit("update");
      this.isActive = false;
    },
  },
  computed: {
    // active prop을 내부적으로 사용하고, 부모에게 변경사항을 알리기 위한 computed 속성
    isActive: {
      get() { return this.active; },
      set(val) { this.$emit("update:active", val); }
    },
  },
};
</script>

<style lang="scss" scoped>
.popup-content {
  padding: 1rem;
  min-height: 40vh;
}
.list-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
.handle {
  cursor: grab;
  margin-right: 10px;
}
.item-input {
  flex-grow: 1;
}
.add-button {
  width: 477px;
  margin-top: 0.5rem;
}
</style>
