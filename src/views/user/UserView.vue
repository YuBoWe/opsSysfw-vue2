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
              <el-button slot="append" icon="el-icon-search"></el-button>
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
        <el-table-column porp="is_active" label="激活状态"></el-table-column>
        <el-table-column prop="is_superuser" label="管理员"></el-table-column>
      </el-table>
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
  </div>
</template>

<script>
export default {
  created() {
    this.getlist()
  },
  data() {
    const validatePass = (rule, value, callback) => {
      if (value !== this.addForm.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      search: '',
      // add
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

      userList: []
    }
  },
  methods: {
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
    async getlist() {
      const { data: response } = await this.$http.get('users/', this.addForm)
      if (response.code) {
        return this.$message.error(response.message)
      }
      this.userList = response
    }
  }
}
</script>

<style>
</style>