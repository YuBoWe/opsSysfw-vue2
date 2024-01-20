<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
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
            <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
          </div></el-col
        >
      </el-row>
      <el-table :data="userList" border style="width: 100%" stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="username" label="用户名" width="180"> </el-table-column>
        <el-table-column prop="email" label="邮箱" width="180"> </el-table-column>
        <el-table-column prop="phone" label="手机号"> </el-table-column>
        <el-table-column porp="is_active" label="激活状态">
          <template slot-scope="{ row }">
            <el-switch
              v-if="row.id !== 1"
              style="display: block"
              @change="handleActive(row)"
              active-color="#13ce66"
              v-model="row.is_active"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="is_superuser" label="管理员操作">
          <template slot-scope="{ row }">
            <el-tooltip v-if="row.id !== 1" content="设置">
              <el-button size="mini" @click="editCertain(row)" @close="resetForm('edit')" icon="el-icon-setting">
              </el-button>
            </el-tooltip>
            <el-tooltip v-if="row.id !== 1" content="删除用户">
              <el-button size="mini" type="danger" @click="handleDelete(row.id)" icon="el-icon-delete"></el-button>
            </el-tooltip>
            <el-tooltip v-if="row.id !== 1" content="修改密码">
              <el-button size="mini" type="warning" @click="handleChpwd(row)" icon="el-icon-edit"></el-button>
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
    <!-- 新增 -->
    <el-dialog title="新增用户" :visible.sync="addDialogVisible" @close="resetForm('add')">
      <el-form :model="addForm" :rules="addRules" ref="add" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="addForm.password" placeholder="请输入密码" show-password></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkpass">
          <el-input type="password" v-model="addForm.checkpass" placeholder="请输入确认密码" show-password></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="addForm.phone" placeholder="请输入电话"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCertain">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑用户 -->
    <el-dialog title="编辑用户" :visible.sync="editDialogVisible" @close="resetForm('edit')">
      <el-form :model="editForm" :rules="editRules" ref="edit" label-width="100px">
        <el-form-item label="用户名" prop="username">
          {{ editForm.username }}
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="editForm.phone" placeholder="请输入电话"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="edit">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 管理员修改用户密码 -->
    <el-dialog title="修改密码" :visible.sync="adChpwdDialogVisible" @close="resetForm('adChpwd')">
      <el-form :model="adChpwdForm" :rules="adChpwdRules" ref="adChpwd" label-width="100px">
        <el-form-item label="用户名" prop="username">
          {{ adChpwdForm.username }}
        </el-form-item>
        <el-form-item label="原密码" prop="oldPassword">
          <el-input type="password" v-model="adChpwdForm.oldPassword" placeholder="请输入原密码" show-password></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="password">
          <el-input type="password" v-model="adChpwdForm.password" placeholder="请输入新密码" show-password></el-input>
        </el-form-item>
        <el-form-item label="确认新密码" prop="checkpass">
          <el-input type="password" v-model="adChpwdForm.checkpass" placeholder="请输入确认新密码" show-password></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="adChpwdDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="adChpwdCertain">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  created() {
    this.getlist(this.pagination.page)
  },
  data() {
    // add校验密码
    const validatePass = (rule, value, callback) => {
      if (value !== this.addForm.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    // 管理员改密码校验
    const validatePass2 = (rule, value, callback) => {
      if (value !== this.adChpwdForm.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      // 激活
      activeValue: '',
      // 分页
      pagination: { total: 0, size: 2, page: 1 },
      // 搜索
      search: '',
      // 管理员修改用户密码
      adChpwdDialogVisible: false,
      adChpwdForm: {
        username: '',
        id: '',
        password: '',
        oldpassword: '',
        checkpass: ''
      },
      adChpwdRules: {
        oldPassword: [
          { required: true, message: '密码长度为6到16个', trigger: 'blur' },
          { min: 6, max: 16, message: 'Length should be 6 to 16', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码长度为6到16个', trigger: 'blur' },
          { min: 6, max: 16, message: 'Length should be 6 to 16', trigger: 'blur' }
        ],
        checkpass: [
          { required: true, message: '请输入正确格式的确认密码', trigger: 'blur' },
          { validator: validatePass2, trigger: 'blur' }
        ]
      },
      // edit编辑用户
      editDialogVisible: false,
      editForm: {
        id: '',
        email: '',
        phohe: '',
        username: ''
      },
      editRules: {},
      // add增加用户
      addDialogVisible: false,
      addForm: {
        username: '',
        password: '',
        checkpass: '',
        email: '',
        phone: ''
      },
      addRules: {
        username: [
          { required: true, message: '请输入正确格式的用户名', trigger: 'blur' },
          { min: 2, max: 14, message: 'Length should be 2 to 14', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码长度为6到16个', trigger: 'blur' },
          { min: 6, max: 16, message: 'Length should be 6 to 16', trigger: 'blur' }
        ],
        checkpass: [
          { required: true, message: '请输入正确格式的确认密码', trigger: 'blur' },
          { validator: validatePass, trigger: 'blur' }
        ]
      },

      // 用户列表
      userList: []
    }
  },
  methods: {
    handleCurrentChange(val) {
      this.getlist(val)
    },
    resetForm(name) {
      this.$refs[name].resetFields()
    },
    addCertain() {
      const name = 'add'
      this.$refs[name].validate(async vaild => {
        if (vaild) {
          console.log(this.addForm, '准备发送到后台了')
          const { data: response } = await this.$http.post('users/', this.addForm)
          if (response.code) {
            return this.$message.error(response.message)
          }
          console.log(response) // 返回新增的对象
          this.$message('成功新增用户' + this.addForm.username)
          this.addDialogVisible = false
          // 刷新列表
          this.getlist()
        }
      })
    },
    // 管理员修改用户密码
    handleChpwd(row) {
      this.adChpwdDialogVisible = true
      const { id, username } = row
      this.adChpwdForm = { id, username }
    },
    adChpwdCertain() {
      console.log(1)
      const name = 'adChpwd'
      this.$refs[name].validate(async vaild => {
        if (vaild) {
          const { data: response } = await this.$http.post(`users/${this.adChpwdForm.id}/adChpwd/`, this.adChpwdForm)
          if (response.code) {
            return this.$message.error(response.message)
          }
          this.$message.success('成功修改用户' + this.adChpwdForm.username + '的密码')
          this.adChpwdDialogVisible = false
        }
      })
    },
    // 编辑用户
    editCertain(row) {
      this.editDialogVisible = true
      const { id, username, email, phone } = row
      this.editForm = { id, username, email, phone }
    },
    edit() {
      const name = 'edit'
      const { id } = this.editForm
      this.$refs[name].validate(async vaild => {
        if (vaild) {
          const { data: response } = await this.$http.patch(`users/${id}/`, this.editForm)
          if (response.code) {
            return this.$message.error(response.message)
          }
          this.$message('成功修改用户' + this.editForm.username)
          this.editDialogVisible = false
          this.getlist()
        }
      })
    },
    // 删除用户
    handleDelete(id) {
      this.$msgBox
        .confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'error'
        })
        .then(async () => {
          const { data: response } = await this.$http.delete(`users/${id}/`)
          if (response.code) {
            return this.$message.error(response.message)
          }
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getlist()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },

    async getlist(page = 1) {
      if (!page) {
        page = 1
      }
      const { data: response } = await this.$http.get('users/', {
        params: { page, search: this.search }
      })
      if (response.code) {
        return this.$message.error(response.message)
      }
      this.userList = response.results
      this.pagination = response.pagination
    },
    async handleActive(row) {
      console.log(row)
      await this.$http.patch(`users/${row.id}/`, { is_active: row.is_active })
    }
  }
}
</script>

<style>
</style>