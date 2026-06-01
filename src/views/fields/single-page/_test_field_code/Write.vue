<template>
  <div>
    Write
  </div>
</template>

<script>
export default {
  name: "Write",
  computed: {
    fieldId() {
      return this.$route.params.fieldId;
    },
  },
  data() {
    return {
      form: {},
    }
  },
  methods: {
    // onClickSave() {
    //   const company_ids = [];
    //   for (const com of this.companyList) {
    //     company_ids.push(com.id);
    //   }
    //   const user_ids = [];
    //   if (this.joinUsers.length > 0) {
    //     for (const user of this.joinUsers) {
    //       user_ids.push(user.id);
    //     }
    //   }
    //   this.form.company_ids = company_ids;
    //   this.form.user_ids = user_ids;
    //   this.form.project_id = this.$route.params.proj_id;
    //
    //   this.$emit('save', this.form)
    // },
    onClickSave() { this.$emit('save', this.form) },
    onClickDelete () { this.$emit('delete', this.fieldId) },
    onClickMoveList () { this.$emit('moveList') },
  }
}
</script>

<style scoped>

</style>
