<template>
  <vs-row class="w-full xl:w-auto flex gap-2" vs-align="center" :class="size === 'mobile' ? 'layout-mobile' : ''">
    <vs-col class="title">{{ label }}</vs-col>
    <vs-col class="flex-1">
      <project-selector :class="size" :size="size" :use-name="useName" v-model="projectId" @select="select" class="w-full" />
    </vs-col>
  </vs-row>
</template>

<script>
import ProjectSelector from "@/components/selector/ProjectSelector";
export default {
  name: "SearchNavItemProject",
  components: { ProjectSelector },
  props: {
    label: String,
    value: {
      type: [String, Number],
      defalut: "",
    },
    size: {
      type: String,
      default: "normal",
    },
    useName: Boolean,
  },
  watch: {
    value(value) {
      this.projectId = value;
    },
  },
  data() {
    return {
      projectId: "",
    };
  },
  methods: {
    changeText() {
      this.$emit("input", this.projectId);
    },

    keyupEvent(event) {
      if (event.code === "NumpadEnter" || event.code === "Enter") {
        this.$emit("keyupEvent", event.target.value);
      }
    },
    select(project) {
      this.$emit("input", this.projectId);
      this.$emit("select", project);
    },
  },
};
</script>

<style lang="scss" scoped>
.title {
  width: 114px !important;

  font-weight: 500;
  line-height: 38px;
  text-align: left;
  white-space: nowrap;
}
</style>
