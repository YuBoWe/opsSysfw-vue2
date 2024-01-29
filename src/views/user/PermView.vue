<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card shadow="hover">
      <el-row :gutter="5">
        <el-col :span="12"
          ><div class="grid-content bg-purple">
            <el-input placeholder="请输入内容" v-model="search" class="input-with-select">
              <el-button slot="append" icon="el-icon-search" @click="getlist(1)"></el-button>
            </el-input></div
        ></el-col>
      </el-row>
      <el-table :data="permlist" border style="width: 100%" stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="name" label="名称"> </el-table-column>
        <el-table-column prop="content_type.app_label" label="contentType"> </el-table-column>
        <el-table-column prop="codename" label="codename"> </el-table-column>

        <el-table-column prop="is_superuser" label="管理员操作">
          <template slot-scope="{ row }">
            <el-tooltip v-if="row.id !== 1" content="修改名称">
              <el-button size="mini" @click="editPermCertain(row)" @close="resetForm('editPerm')" icon="el-icon-setting">
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page.sync="pagination.page"
        :page-size="pagination.size"
        layout="total, prev, pager, next, jumper"
        :total="pagination.total"
      >
      </el-pagination>
    </el-card>
    <!-- 修改名称 -->
    <el-dialog title="编辑权限名称" :visible.sync="editPermDialogVisible" @close="resetForm('editPerm')">
      <el-form :model="editPermForm" :rules="editPermRules" ref="editPerm" label-width="100px">
        <el-form-item label="权限名称" prop="name">
          <el-input v-model="editPermForm.name" placeholder="请输入新的权限名称"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editPermDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editPerm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { PageMixin, myMixin } from '../../mixins/index.js'
export default {
  mixins: [PageMixin, myMixin],
  data() {
    return {
      // 搜索
      search: '',
      // 权限列表
      permlist: [],
      // 修改权限名
      editPermForm: { name: '', id: '', codename: '', content_type_id: '' },
      editPermDialogVisible: false,
      editPermRules: {
        name: [
          { required: true, message: '长度为1到16个', trigger: 'blur' },
          { min: 1, max: 16, message: 'Length should be 1 to 16', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    handleCurrentChange(val) {
      this.getlist(val)
    },
    async getlist(page = 1) {
      if (!page) {
        page = 1
      }
      const { data: response } = await this.$http.get('users/perms/', {
        params: { page, search: this.search }
      })
      if (response.code) {
        return this.$message.error(response.message)
      }
      this.permlist = response.results
      this.pagination = response.pagination
    },
    // 修改名称
    editPermCertain(row) {
      console.log(row)
      const { name, id, codename } = row
      this.editPermForm = { name, id, codename }
      this.editPermForm.content_type_id = row.content_type.id
      console.log(this.editPermForm)
      this.editPermDialogVisible = true
    },
    editPerm() {
      const name = 'editPerm'
      this.$refs[name].validate(async valid => {
        const { data: response } = await this.$http.patch(`users/perms/${this.editPermForm.id}/`, this.editPermForm)
        if (response.code) {
          return this.$message.error(response.message)
        }
        this.$message.success('权限名修改成功')
        this.editPermDialogVisible = false
        this.getlist()
      })
    }
  }
}
</script>

<style>
</style>