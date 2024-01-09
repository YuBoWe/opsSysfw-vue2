<template>
  <el-container>
    <el-header>
      <div class="logo">
        <img src="../assets/logo.png" alt="logo" />
        <div class="title">OO运维系统平台</div>
        <i :class="isCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold'" @click="isCollapse = !isCollapse"></i>
      </div>
      <div class="userinfo">
        <el-button type="primary" @click="logout">exit</el-button>
      </div>
    </el-header>
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
export default {
  created() {
    // 声明周期函数，创建了Home组件对象的时候，还未渲染到浏览器之前
    this.getMenuList()
  },
  data() {
    return {
      isCollapse: false,
      menuList: [],
      defaultActive: ''
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
  }
  i {
    font-size: 38px;
    margin-left: 5px;
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
