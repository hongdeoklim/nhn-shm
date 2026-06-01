<template>
  <vx-card class="search-nav mb-4">
    <vs-row class="flex flex-col xl:flex-row gap-y-4" :class="align">
      <vs-col class="flex-1 flex xl:inline-flex flex-wrap gap-4" vs-align="center">
        <slot></slot>
      </vs-col>
      <vs-col class="flex w-auto items-end"  style="margin-left: auto; padding: 0.5rem 0;">
        <vs-button color="secondary" @click="handleSearch">{{ $t("search.검색") }}</vs-button>
      </vs-col>
    </vs-row>
  </vx-card>
</template>

<script>
export default {
  name: "SearchNav",
  props: {
    align: String,
    size: String,
  },
  methods: {
    handleSearch() {
      this.$emit("handleSearch");
    },
  },
};
</script>

<style lang="scss" scoped>
.search-nav {
  border-radius: 0;

  @media (min-width: theme("screens.xl")) {
    border-radius: theme("borderRadius.lg");
  }
}
</style>
<style>
.search-nav .vx-card__collapsible-content .vx-card__body {
  padding: 1.0rem 1.5rem;
}
</style>
