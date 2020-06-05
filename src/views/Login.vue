<template>
  <v-container fill-height align-center justify-center>
    <v-card width="500">
      <v-tabs v-model="tab" centered grow color="primary">
        <v-tab href="#tab-login" :disabled="snack.loading">登录</v-tab>
        <v-tab href="#tab-register" :disabled="snack.loading">注册</v-tab>
        <v-tab-item value="tab-login">
          <v-form v-model="loginValid" class="pa-6" ref="loginForm">
            <v-text-field
              v-model="info"
              label="用户名/学（工）号/手机"
              :rules="[rules.required]"
              :disabled="snack.loading"
            ></v-text-field>
            <v-text-field
              v-model="password"
              label="密码"
              :append-icon="showPassword ? 'visibility' : 'visibility_off'"
              :type="showPassword ? 'text' : 'password'"
              @click:append="showPassword = !showPassword"
              :rules="[rules.required]"
              :disabled="snack.loading"
            ></v-text-field>
            <v-spacer class="ma-6"></v-spacer>
            <!-- <v-btn
              absolute
              bottom
              right
              text
              @click="$router.push('/forget')"
              class="forget"
              v-if="$store.state.competition.registerAllow"
              >forget</v-btn
            > -->
            <v-btn
              color="primary"
              absolute
              bottom
              right
              @click="login"
              :disabled="snack.loading"
              :loading="snack.loading"
              >提交</v-btn
            >
          </v-form>
        </v-tab-item>
        <v-tab-item value="tab-register">
          <v-form v-model="regValid" class="pa-6" ref="registerForm">
            <v-layout row>
              <v-flex sm6 pl-3 pr-3>
                <v-text-field
                  v-model="name"
                  label="姓名"
                  :rules="[rules.required]"
                  :disabled="snack.loading"
                ></v-text-field>
              </v-flex>
            </v-layout>
            <v-layout row>
              <v-flex sm6 pl-3 pr-3>
                <v-select
                  v-model="department"
                  :items="departmentItems"
                  @change="onDepartChange"
                  item-text="name"
                  item-value="departId"
                  label="学院"
                  :rules="[rules.required]"
                  :disabled="snack.loading"
                ></v-select>
              </v-flex>
              <v-flex sm6 pl-3 pr-3>
                <v-select
                  v-model="majorId"
                  :items="majorItems"
                  item-text="name"
                  item-value="majorId"
                  label="专业"
                  :rules="[rules.required]"
                  :disabled="snack.loading"
                ></v-select>
              </v-flex>
            </v-layout>
            <v-layout row>
              <v-flex sm6 pl-3 pr-3>
                <v-text-field
                  v-model="number"
                  label="学工号"
                  :rules="[rules.required]"
                  :disabled="snack.loading"
                ></v-text-field>
              </v-flex>
              <v-flex sm6 pl-3 pr-3>
                <v-text-field
                  v-model="mail"
                  label="邮箱"
                  :rules="[rules.required, rules.email]"
                  :disabled="snack.loading"
                ></v-text-field>
              </v-flex>
            </v-layout>
            <v-layout row>
              <v-flex sm6 pl-3 pr-3>
                <v-text-field
                  v-model="regPassword"
                  label="密码"
                  :append-icon="showPassword ? 'visibility' : 'visibility_off'"
                  :type="showPassword ? 'text' : 'password'"
                  @click:append="showPassword = !showPassword"
                  :rules="[rules.required, rules.passLen(8), rules.password]"
                  :disabled="snack.loading"
                ></v-text-field>
              </v-flex>
              <v-flex sm6 pl-3 pr-3>
                <v-text-field
                  v-model="repeat"
                  label="密码确认"
                  :append-icon="showPassword ? 'visibility' : 'visibility_off'"
                  :type="showPassword ? 'text' : 'password'"
                  @click:append="showPassword = !showPassword"
                  :rules="[rules.required]"
                  :disabled="snack.loading"
                  :error-messages="againError"
                  @focus="againError = ''"
                  @blur="check"
                ></v-text-field>
              </v-flex>
            </v-layout>
            <v-layout row>
              <v-spacer class="ma-3"></v-spacer>
              <v-btn
                color="primary"
                absolute
                bottom
                right
                @click="register"
                :disabled="snack.loading"
                :loading="snack.loading"
                >提交</v-btn
              >
            </v-layout>
          </v-form>
        </v-tab-item>
      </v-tabs>
    </v-card>
    <v-snackbar v-model="snack.hasInfo" right bottom :timeout="3000">
      {{ snack.infoText }}
      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon @click="snack.hasInfo = false">close</v-icon>
      </v-btn>
    </v-snackbar>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import gql from "graphql-tag";
import { gqlQuery, gqlMutation } from "@/fetch";
import {
  UserInfo,
  UserInfoResult,
  BaseInput,
  LoginInput,
  LoginResult,
  RegisterInput,
  RegisterResult,
  ManyDepartmentInfoResult,
  DepartmentInfo,
  MajorInfo,
  AuthInfo
} from "@/struct";
import constValue from "@/constValue";
import { Snack } from '../snack';

@Component
export default class Login extends Vue {
  private tab: string = "tab-login";

  private info: string = "";
  private password: string = "";

  private name: string = "";
  private number: string = "";
  private department: string = "";
  private grade: string = "";
  private qq: string = "";
  private mail: string = "";
  private regPassword: string = "";
  private repeat: string = "";
  private majorId: string = "";

  private loginValid: boolean = false;
  private regValid: boolean = false;
  private departmentItems: DepartmentInfo[] = [];
  private majorItems: MajorInfo[] = [];

  private showPassword: boolean = false;
  private againError: string = "";
  private rules = {
    required: (value: string) => !!value || "请填写",
    email: (value: string) =>
      !!(value || "").match(
        /^[_A-Za-z0-9-+]+(.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(.[A-Za-z0-9]+)*(.[A-Za-z]{2,})$/
      ) || "非法的邮箱地址",
    passLen: (len: number) => (v: string) =>
      (v || "").length >= len || `非法的密码长度，需要 ${len} 位`,
    password: (value: string) =>
      ((value || "").match(/[A-Z]/) &&
        (value || "").match(/[a-z]/) &&
        (value || "").match(/\d/)) ||
      "密码必须由大小写字母数字和特殊符号组成" //TODO: 正则好像不对
  };

  private snack: Snack = new Snack();

  mounted() {
    if (!!this.$store.state.global.departments)
      this.departmentItems = this.$store.state.global.departments;
    else
      this.queryDepartments();
  }

  check() {
    if (this.regPassword != this.repeat) this.againError = "密码不一致";
  }

  queryDepartments() {
    this.snack.loading = true;
    this.apolloQuery<ManyDepartmentInfoResult>(
      gqlQuery.departmentsDetails,
      {},
      data => {
        this.$store.commit("global/setDepartments", { departments: data.departments });
        this.departmentItems = this.$store.state.global.departments;
      },
      this.snack
    )
  }

  updateSession(info: AuthInfo) {
    this.$store.commit("global/setUserIdAndRole", info);
    sessionStorage.setItem("user_id", info.userId);
    sessionStorage.setItem("role", info.role.toString());
  }

  login() {
    if (!this.loginValid) {
      (this.$refs.loginForm as any).validate();
      return;
    }
    this.apolloMutate<LoginResult, LoginInput>(
      gqlMutation.login, 
      {
        info: this.info,
        password: this.password
      },
      (data) => { 
        this.getUserInfo(()=>{
          this.updateSession(data.login);
          this.$router.replace("/");
        }, this.snack);
      },
      this.snack);
  }

  register() {
    if (!this.regValid) {
      (this.$refs.registerForm as any).validate();
      return;
    }
    this.apolloMutate<RegisterResult, RegisterInput>(
      gqlMutation.register, 
      {
        name: this.name,
        password: this.password,
        majorId: this.majorId,
        mail: this.mail
      },
      (data) => this.updateSession(data!.register),
    )
  }

  onDepartChange(departId: string) {
    let currentDepart = this.departmentItems.find(
      item => item.departId == departId
    );
    if (currentDepart) this.majorItems = currentDepart.majors;
  }
}
</script>

<style lang="scss" scoped>
.forget {
  margin-right: 100px;
}
</style>
