<template>
  <div class="search-label-body" :class="{'label-hidden':labelHidden}" :style="gridStyle">
    <div class="search-label-body-container">
      <span v-if="!labelHidden">{{ label }}</span>
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "SearchLabelBody",
  props:{
    label: String,
    labelHidden: Boolean,
    columns: {
      type: String,
      default: 'auto auto'  // 기본 값으로 'auto auto' 설정
    }
  },
  computed: {
    gridStyle() {
      return {
        '--grid-template-columns': this.columns  // CSS 변수를 동적으로 설정
      };
    }
  }
}
</script>

<style lang="scss" scoped>
.search-label-body {
  & > .search-label-body-container {
    display: grid;
    grid-template-columns: var(--grid-template-columns); // CSS 변수 사용
    gap: 1rem;
  }
}

.search-label-body > .search-label-body-container > span {
  font-weight: 500;
  line-height: 38px;
  white-space: nowrap;
}

@media (max-width: 1200px) {
  .search-label-body {
    & > .search-label-body-container {
      grid-template-columns: 114px 1fr; // 모바일 뷰에서는 고정
    }
  }
}

.search-label-body.label-hidden > .search-label-body-container {
  grid-template-columns: auto;
}
</style>
