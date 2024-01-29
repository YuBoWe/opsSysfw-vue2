const myMixin = {
  methods: {
    resetForm(name) {
      this.$refs[name].resetFields()
    }
  }
}

const PageMixin = {
  created() {
    this.getlist(this.pagination.page)
  },
  data() {
    return {
      pagination: { total: 0, size: 2, page: 1 }
    }
  }
}

export { myMixin }
export { PageMixin }