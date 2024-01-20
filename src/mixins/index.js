const myMixin = {
  methods: {
    resetForm(name) {
      this.$refs[name].resetFields()
    }
  }
}

export { myMixin }