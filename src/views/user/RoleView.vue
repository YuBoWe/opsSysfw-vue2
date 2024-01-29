<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card shadow="hover">
      <el-row :gutter="5">
        <el-col :span="12"
          ><div class="grid-content bg-purple">
            <el-input placeholder="请输入内容" v-model="search" class="input-with-select">
              <el-button slot="append" icon="el-icon-search" @click="getlist(1)"></el-button>
            </el-input></div
        ></el-col>
        <el-col :span="12"
          ><div class="grid-content bg-purple">
            <el-button type="primary" @click="addDialogVisible = true">添加角色</el-button>
          </div></el-col
        >
      </el-row>
      <el-table :data="rolelist" border style="width: 100%" stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="name" label="角色名称"> </el-table-column>

        <el-table-column prop="is_superuser" label="管理员操作">
          <template slot-scope="{ row }">
            <el-tooltip content="设置权限">
              <el-button size="mini" @click="handleSetPerm(row)" icon="el-icon-menu" type="danger"> </el-button>
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
    <!-- 修改权限 -->
    <el-dialog title="设置权限" :visible.sync="editRoleDialogVisible" @close="resetPerm()">
      <el-tree
        :data="permlist"
        show-checkbox
        default-expand-all
        node-key="id"
        ref="tree"
        highlight-current
        :props="defaultProps"
        :default-checked-keys="permissions"
      >
      </el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRole">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 添加角色 -->
    <el-dialog title="添加角色" :visible.sync="addDialogVisible" @close="resetForm('addRole')">
      <el-form :model="addRoleForm" :rules="addRoleRules" ref="addRole" label-width="100px">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="addRoleForm.name" placeholder="请输入新的角色名称"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { PageMixin, myMixin } from '../../mixins/index.js'
export default {
  mixins: [PageMixin, myMixin],
  created() {
    this.getlist(this.pagination.page)
  },
  data() {
    return {
      // 搜索
      search: '',
      // 角色列表
      rolelist: [],
      // 修改权限
      // editRoleForm: { name: '', id: '', permissions: [] },
      editRoleDialogVisible: false,
      defaultProps: { label: 'name' },
      permlist: [],
      currentId: '',
      permissions: [],
      // 添加角色
      addRoleForm: { name: '', id: '' },
      addDialogVisible: false,
      addRoleRules: {
        name: [
          { required: true, message: '长度为6到16个', trigger: 'blur' },
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
      const { data: response } = await this.$http.get('users/roles/', {
        params: { page, search: this.search }
      })
      if (response.code) {
        return this.$message.error(response.message)
      }
      this.rolelist = response.results
      console.log(this.rolelist)
      this.pagination = response.pagination
    },
    // 修改权限
    async handleSetPerm(row) {
      this.currentId = row.id
      this.editRoleDialogVisible = true
      const { data: response } = await this.$http.get(`users/roles/${row.id}/perms/`)
      if (response.code) {
        return this.$message.error(response.message)
      }
      console.log(response)
      this.permlist = response.allPerms
      this.permissions = response.permissions
    },
    async editRole() {
      this.permissions = this.$refs.tree.getCheckedKeys()
      const { data: response } = await this.$http.patch(`users/roles/${this.currentId}/`, { permissions: this.permissions })
      if (response.code) {
        return this.$message.error(response.message)
      }
      this.$message.success('设置权限操作成功')
      this.editRoleDialogVisible = false
    },
    resetPerm() {
      this.permlist = []
    },
    // 添加角色
    addRole() {
      const name = 'addRole'
      this.$refs[name].validate(async valid => {
        if (valid) {
          const { data: response } = await this.$http.post('users/roles/', { name: this.addRoleForm.name })
          if (response.code) {
            return this.$message.error(response.message)
          }
          this.$message.success('成功添加' + this.addRoleForm.name + '角色')
          this.addDialogVisible = false
          this.getlist()
        }
      })
    }
  }
}
</script>

<style>
</style>