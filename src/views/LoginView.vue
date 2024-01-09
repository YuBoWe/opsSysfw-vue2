<template>
  <div class="login_container">
    <div class="login_box">
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="logo" />
      </div>
      <!-- 表单，ELE UI组件需要按需导入组件-->
      <!-- <div :class="clsName || 'test'">{{ d1 }}</div>-->
      <el-form class="login_form" label-width="80px" :model="loginForm" :rules="loginRules" ref="loginFormRef">
        <el-form-item label="登录名" prop="username">
          <el-input placeholder="请输入登录名" v-model="loginForm.username" prefix-icon="el-icon-user"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            placeholder="请输入密码"
            v-model="loginForm.password"
            show-password
            @keyup.enter.native="login"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button :plain="true" type="primary" @click="login">登录</el-button>
          <el-button type="danger" icon="el-icon-delete" circle v-on:click="restForm">清空</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
// import axios from 'axios'
export default {
  // 所有的数据都在data中的对象中
  data() {
    return {
      // this.loginForm
      loginForm: { username: '', password: '' },
      loginRules: {
        username: [
          { required: true, message: '请输入正确格式的用户名', trigger: 'blur' },
          { min: 2, max: 14, message: 'Length should be 2 to 14', trigger: 'blur' }
        ],
        password: [
          // { required: true, message: '长度在6到15之间', trigger: 'change' },
          { min: 6, max: 15, message: '长度在6到15之间', trigger: 'blur' }
        ]
      }
    } // 在这里
  },
  methods: {
    // this.restForm
    restForm() {
      // console.log(this)
      const name = 'loginFormRef'
      // console.log(this.$refs.loginFormRef, this.$refs[name])
      // this.loginForm.username = ''
      // this.loginForm.password = ''
      this.$refs[name].resetFields()
      console.log(this.$router)
    },
    login() {
      console.log(this.loginForm)
      this.$refs.loginFormRef.validate(async valid => {
        // console.log(valid)
        if (valid) {
          // 提交数据 nginx proxy WSGI Server
          try {
            const { data: response } = await this.$http.post('login/', this.loginForm) // 127.0.0.1:8000/login
            // console.log(response, '@@@@@@@@@@@')
            // console.log(response.code) // error 1 5 1000; success undefined
            // if (response.code) {
            //   // 说明失败了，弹出窗口
            //   this.$message.error(response.message)
            // } else {
            //   // 跳转
            //   console.log('成功登录了，准备跳转')
            //   this.$message.success('成功登录，准备跳转')
            //   this.$router.push('/home')
            // }

            // 判断验证是否成功
            if (response.code) {
              return this.$message.error(response.message)
            }

            console.log('成功登录了，准备跳转')
            this.$message.success('成功登录，准备跳转')
            // token持久化，localstorage
            window.localStorage.setItem('token', response.access)

            this.$router.push('/home')
          } catch (error) {
            this.restForm()
            return this.$message.error(error)
          }
          // const url = '/api/v1/post' // nginx devServer  /proxy => gunicorn uwsgi
          // http://localhost:8080/1pi/v1/post
          // this.$http
          //   .post('post', this.loginForm)
          //   .then(function (response) {
          //     console.log(response)
          //     console.log(response.status) // 200
          //     console.log(response.data) // axios把response封装后的正文
          //     console.log(response.data.data) // 响应中我们关心的数据
          //   })
          //   .catch(function (error) {
          //    console.log(error)
          //  })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login_container {
  // background-image: url('../assets/background.heic');
  // background-size: 100% 100%;
  background-color: wheat;
  height: 100%;
}

.login_box {
  width: 450px;
  height: 280px;
  // background-image: url('../assets/inbox.heic');
  // background-size: 100% 100%;
  background-color: aliceblue;
  border-radius: 5px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  .avatar_box {
    height: 150px;
    width: 140px;
    padding: 10px;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }

  .login_form {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
  }
}
</style>