<template>
  <div class="login_container">
    <div id="scene">
    <div data-depth="0.3" class="particletext hearts">
      <span class="particle" style="top:30%; left:17%;width:7.1px; height:7.1px;animation-delay: 1.4s;"></span>
    </div>
    <div data-depth="0.3" class="particletext hearts">
      <span class="particle" style="top:30%; left:17%;width:7.6px; height:7.6px;animation-delay: 3s;"></span>
    </div>
    <div data-depth="0.3" class="particletext hearts">
      <span class="particle" style="top:48%; left:79%;width:11.7px; height:11.7px;animation-delay: 1.7s;"></span>
    </div>
    <div data-depth="0.3" class="particletext hearts">
      <span class="particle" style="top:70%; left:69%;width:8.6px; height:8.6px;animation-delay: 1.6s;"></span>
    </div>
    <div data-depth="0.3" class="particletext hearts">
      <span class="particle" style="top:20%; left:59%;width:6.6px; height:6.6px;animation-delay: 0.8s;"></span>
    </div>
    <div data-depth="0.9" class="particletext hearts">
      <span class="particle" style="top:77%; left:32%;width:9.1px; height:9.1px;animation-delay: 0.5s;"></span>
    </div>
    <div data-depth="0.9" class="particletext hearts">
      <span class="particle" style="top:20%; left:61%;width:9.8px; height:9.8px;animation-delay: 1s;"></span>
    </div>
    <div data-depth="0.9" class="particletext hearts">
      <span class="particle" style="top:27%; left:75%;width:10.3px; height:10.3px;animation-delay: 1.1s;"></span>
    </div>
    <div data-depth="0.5" class="particletext hearts">
      <span class="particle" style="top:48%; left:69%;width:9.4px; height:9.4px;animation-delay: 0.1s;"></span>
    </div>
    <div data-depth="0.5" class="particletext hearts">
      <span class="particle" style="top:73%; left:25%;width:9.7px; height:9.7px;animation-delay: 2.4s;"></span>
    </div>
    <div data-depth="0.5" class="particletext hearts">
      <span class="particle" style="top:38%; left:31%;width:9.4px; height:9.4px;animation-delay: 0.3s;"></span>
    </div>
    <div data-depth="0.9" class="particletext hearts">
      <span class="particle" style="top:31%; left:23%;width:9px; height:9px;animation-delay: 2.4s;"></span>
    </div>
    <div data-depth="0.9" class="particletext hearts">
      <span class="particle" style="top:65%; left:86%;width:10.8px; height:10.8px;animation-delay: 0.1s;"></span>
    </div>
    <div data-depth="0.7" class="particletext hearts">
      <span class="particle" style="top:25%; left:54%;width:8px; height:8px;animation-delay: 2.3s;"></span>
    </div>
    <div data-depth="0.7" class="particletext hearts">
      <span class="particle" style="top:43%; left:24%;width:10.6px; height:10.6px;animation-delay: 0.1s;"></span>
    </div>
    <div data-depth="0.7" class="particletext hearts">
      <span class="particle" style="top:63%; left:70%;width:8.2px; height:8.2px;animation-delay: 2.9s;"></span>
    </div>
    </div>
    <transition name="fade">
      <div class="login_form">
        <el-col :span="18" :offset="3">
          <div class="login_title">月亮来啦
            
          </div>
          <el-form :model="dataForm" :rules="rules" ref="rules" @keyup.enter="handleAccountSubmit">
            <el-form-item prop="username">
              <el-input placeholder="账号" v-model="dataForm.username" autofocus="true">
              </el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input placeholder="密码" v-model="dataForm.password" type="password"></el-input>
            </el-form-item>
            <div class="form-item">
              <el-form-item prop="captcha">
                <el-input placeholder="验证码" v-model="dataForm.captcha"></el-input>
              </el-form-item>
              <el-image :src="captchaUrl" class="image" id="code"
                        @click="handleCaptchaClick"
                        ref="captcha"></el-image>
              <el-form-item prop="captcha">
                <el-input type="hidden" v-model="dataForm.uuid"></el-input>
              </el-form-item>
            </div>
            <div class="form-item">
              <el-form-item>
                <el-checkbox v-model="dataForm.remember" style="color: white">记住我</el-checkbox>
              </el-form-item>
              <el-form-item>
                <el-link :underline="false" style="margin-top: -5px;color:white">
                  忘记 密码?
                </el-link>
              </el-form-item>
            </div>
            <el-form-item>
              <el-button @click="handleAccountSubmit" :loading="loading" type="primary" style="width: 100%;">宇宙飞船！！</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </div>
    </transition>
  </div>
</template>

<script>
import Parallax from 'parallax-js'
import { useCounterStore } from '../stores/counter'
import {login, captcha} from '../http/api/login'
export default {
  name: "Login",
  setup() {
    const counterStore = useCounterStore()
    return { counterStore }
  },
  data() {
    return {
      dataForm: {
        username: '',
        password: '',
        captcha: '',
        token:'',
        uuid: ''
      },
      captchaUrl: '',
      rules: {
        username: [{required: true, message: "账号不能为空！", trigger: 'blur'},],
        password: [{required: true, message: "密码不能为空！", trigger: 'blur'}],
        captcha: [{required: true, message: "验证不能为空！", trigger: 'blur'}],
      },
      loading: false

    }
  },
  mounted(){
    new Parallax(document.getElementById("scene"));
  },
  components: {
    
  },
  methods: {
    handleCaptchaClick() {
      captcha(this.dataForm.uuid).then(res=>{
        this.captchaUrl = res.data.captcha;
        this.dataForm.uuid = res.data.uuid;
      })
    },
    handleAccountSubmit() {
      this.$refs['rules'].validate((valid) => {
        if (valid) {
          this.loading = true;
          login(this.dataForm).then(res=>{
            if(res.code == 200){
              this.counterStore.login(res.data);
              this.$router.push('/');
            }
          }).catch(() => {
              this.handleCaptchaClick();
          });
          this.$router.push('/login');
        }
        this.loading = false;
      })
    }
  },
  created() {
    this.handleCaptchaClick();
  }
}
</script>

<style scoped lang="scss">
.login_container {
  @keyframes gradient {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
  background-image: url("@/assets/index/image/illust_83574739_20201031_023002.jpg");
  // background-image: url("@/assets/index/image/aba7f950b15ffcc26494f4123520809.jpg");
  // background: linear-gradient(-45deg, #ee7752, #e73c7e, #23d5ab, #23a6d5),
  //             linear-gradient(180deg, #a05cee, #4d74df, #a9ff59, #ceff48);
	// background-size: 800% 800%;
  background-size: 130% 130%;
	animation: gradient 15s ease infinite;
  height: 100%;
  position: fixed;
  width: 100%;

  @keyframes fadeInLeft {
    from {
      opacity: 0;
      transform: translate3d(-150%, -150%, 0);
    }
    to {
      opacity: 1;
      transform: translate3d(-50%, -50%, 0);;
    }
  }
  .login_form {
    width: 420px;
    height: 410px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    box-shadow: 0 2px 8px rgba(0, 0, 0, .12), 0 0 12px rgba(0, 0, 0, .04);
    border-radius: 20px;
    justify-content: space-between;
    background-color: rgba(233, 227, 227, 0.205);
    
    animation-duration: 6s;
    animation-fill-mode: both;
    animation-name: fadeInLeft;
  }

  .login_title {
    color: #DCDFE6;
    margin: 30px 0;
    font-weight: 600;
    font-size: 21px;
    text-align: center;
  }

  .form-item {
    display: flex;
    justify-content: space-between;
    .image {
      opacity: 0.5;
      height: 40px;
      margin-left: 20px;
    }
  }
}
:deep(.el-input__wrapper){
  background-color: rgba(255, 0, 0, 0);
}

:deep(.el-input__inner) {
  background-color: rgba(255, 0, 0, 0);
}

:deep(.el-checkbox__inner) {
  background-color: rgba(255, 255, 255, 0);
}

:deep(.el-button) {
  background: linear-gradient(-45deg, #ee7752, #e73c7e, #23d5ab, #23a6d5),
              linear-gradient(180deg, #a05cee, #4d74df, #a9ff59, #ceff48);
	background-size: 200% 200%;
	animation: gradient 5s ease infinite;
  // background-color: rgba(255, 255, 255, 0);
  border: 1px solid #DCDFE6;
}

:deep(.el-button.is-disabled .el-button.is-disabled:focus .el-button.is-disabled:hover) {
  background-color: rgba(255, 255, 255, 0);
}

:deep(.el-button.is-disabled:focus) {
  background-color: rgba(255, 255, 255, 0);
}

:deep(.el-button.is-disabled:hover) {
  background-color: rgba(255, 255, 255, 0);
}
.particletext{
  width: 100%;
  height: 100vh;
  // position: absolute;
  // top:50%;
  // left: 50%;
}
.particletext.hearts > .particle {
  opacity: 0;
  position: absolute;
  background-color: #cc2a5d;
  -webkit-animation: hearts 3s ease-in infinite;
          animation: hearts 3s ease-in infinite;
}
.particletext.hearts > .particle:before, body .particletext.hearts > .particle:after {
  position: absolute;
  content: '';
  border-radius: 100px;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  background-color: #cc2a5d;
}
.particletext.hearts > .particle:before {
  -webkit-transform: translateX(-50%);
          transform: translateX(-50%);
}
.particletext.hearts > .particle:after {
  -webkit-transform: translateY(-50%);
          transform: translateY(-50%);
}
@-webkit-keyframes hearts {
  0% {
    opacity: 0;
    -webkit-transform: translate(0, 0%) rotate(45deg);
            transform: translate(0, 0%) rotate(45deg);
  }
  20% {
    opacity: 0.8;
    -webkit-transform: translate(0, -20%) rotate(45deg);
            transform: translate(0, -20%) rotate(45deg);
  }
  100% {
    opacity: 0;
    -webkit-transform: translate(0, -1000%) rotate(45deg);
            transform: translate(0, -1000%) rotate(45deg);
  }
}
@keyframes hearts {
  0% {
    opacity: 0;
    -webkit-transform: translate(0, 0%) rotate(45deg);
            transform: translate(0, 0%) rotate(45deg);
  }
  20% {
    opacity: 0.8;
    -webkit-transform: translate(0, -20%) rotate(45deg);
            transform: translate(0, -20%) rotate(45deg);
  }
  100% {
    opacity: 0;
    -webkit-transform: translate(0, -1000%) rotate(45deg);
            transform: translate(0, -1000%) rotate(45deg);
  }
}
</style>