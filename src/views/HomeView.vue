<template>
  <el-container>
    <el-header>
      <div class="logo">
        <img src="../assets/logo.png" alt="logo" />
        <div class="title">OO运维系统平台</div>
        <i :class="isCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold'" @click="isCollapse = !isCollapse"></i>
      </div>
      <div class="userinfo">
        <!-- <el-button type="primary" @click="logout">exit</el-button> -->
        <el-dropdown trigger="click" @command="dropHandle">
          <span class="el-dropdown-link">
            <router-link to="/welcome">{{ currentUser.username }}</router-link>
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item icon="el-icon-edit" command="chpwd">修改密码</el-dropdown-item>
            <el-dropdown-item icon="el-icon-s-home" command="welcome">首页</el-dropdown-item>
            <el-dropdown-item divided icon="el-icon-switch-button" command="exit">退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-header>
    <!-- 修改密码 -->
    <el-dialog title="修改密码" :visible.sync="chpwdDialogVisible" @close="resetForm('chpwd')">
      <el-form :model="chpwdForm" :rules="chpwdRules" ref="chpwd" label-width="100px">
        <el-form-item label="用户名" prop="username">
          {{ currentUser.username }}
        </el-form-item>
        <el-form-item label="原密码" prop="oldPassword">
          <el-input type="password" v-model="chpwdForm.oldPassword" placeholder="请输入原密码" show-password></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="password">
          <el-input type="password" v-model="chpwdForm.password" placeholder="请输入新密码" show-password></el-input>
        </el-form-item>
        <el-form-item label="确认新密码" prop="checkpass">
          <el-input type="password" v-model="chpwdForm.checkpass" placeholder="请输入确认新密码" show-password></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="chpwdDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="chpwdCertain">确 定</el-button>
      </div>
    </el-dialog>
    <el-container>
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <!-- 目前是前端写死了，不同用户看到不同的菜单，菜单项从哪里来，从后端来 -->
        <el-menu
          router
          :collapse-transition="false"
          :collapse="isCollapse"
          :default-active="defaultActive"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
        >
          <el-submenu :index="sub.id + ''" v-for="sub in menuList" :key="sub.id">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{ sub.name }}</span>
            </template>
            <el-menu-item :index="item.path" v-for="item in sub.children" :key="item.id">
              <i class="el-icon-location"></i>
              <span>{{ item.name }}</span>
            </el-menu-item>
          </el-submenu>
          <el-menu-item index="/welcome">
            <i class="el-icon-document"></i>
            <span slot="title">首页</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main>
        <!-- 嵌套路由  -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { myMixin } from '../mixins/index'
export default {
  mixins: [myMixin],
  created() {
    // 声明周期函数，创建了Home组件对象的时候，还未渲染到浏览器之前
    this.getMenuList()
    this.getUserInfo()
  },
  data() {
    const validatePass = (rule, value, callback) => {
      if (value !== this.chpwdForm.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      isCollapse: false,
      menuList: [],
      defaultActive: '',
      currentUser: '',
      // 修改密码
      chpwdDialogVisible: false,
      chpwdForm: {
        oldPassword: '',
        password: '',
        checkpass: ''
      },
      chpwdRules: {
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
          { validator: validatePass, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    logout() {
      window.localStorage.removeItem('token')
      this.$router.push('/login')
    },
    async getMenuList() {
      const { data: response } = await this.$http.get('users/menulist/')
      console.log(response)
      this.menuList = response.menulist
      this.defaultActive = response.default
    },
    // 下拉菜单
    dropHandle(command) {
      if (command === 'exit') {
        this.logout()
      } else if (command === 'chpwd') {
        this.chpwdDialogVisible = true
      } else if (command === 'welcome') {
        this.$router.push('/welcome').catch(() => {})
      }
    },
    async getUserInfo() {
      const { data: response } = await this.$http.get('users/mgr/whoami/')
      if (response.code) {
        return this.$message.error(response.message)
      }
      this.currentUser = response.currentUser
    },
    // 修改密码
    chpwdCertain() {
      const name = 'chpwd'
      this.$refs[name].validate(async valid => {
        if (valid) {
          const { data: response } = await this.$http.post('users/mgr/myselfChpwd/', this.chpwdForm)
          if (response.code) {
            return this.$message.error(response.message)
          }
          this.$message.success('密码修改成功！')
          this.chpwdDialogVisible = false
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.el-container {
  height: 100%;
}

.el-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 5px;
  background: #e4facd;
  img {
    height: 40px;
  }
  .logo {
    display: flex;
    .title {
      font-size: 30px;
      margin-left: 5px;
    }
    i {
      font-size: 38px;
      margin-left: 5px;
    }
  }
}

.el-aside {
  background-color: aliceblue;
}
.el-main {
  background-color: white;
}
.el-menu {
  border-right: 0;
}
</style>
