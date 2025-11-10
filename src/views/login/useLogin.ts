import { computed, onUnmounted, ref, type ComponentInstance } from "vue";
import type { RegisterParams } from "@/api/login/type";
import { ElMessage, type ElForm } from "element-plus";
import { getCodeAPI, registerAPI } from "../../api/login/login";
import { useUserStore } from "@/stores/modules/user/user";
import { useRouter } from "vue-router";
import emitter from "@/utils/eventEmitter";
export const useLogin = () => {
  const loginOrRegister = ref<"login" | "register">("login");
  const loadding = ref(false);
  const submitLoading = ref(false);
  //验证码获取倒计时
  const countDown = ref(-1);
  //按钮禁用
  const disabled = computed(() => {
    return loadding.value || countDown.value > 0 || !formData.value.email;
  });
  const { login } = useUserStore();
  const router = useRouter();
  const formData = ref<RegisterParams>({
    username: "",
    password: "",
    email: "",
    code: "",
  });
  const formRef = ref<ComponentInstance<typeof ElForm>>();
  const validateEmail = (rule: any, value: string, callback: any) => {
    const emailRegex = /^[1-9][0-9]{4,10}@qq\.com$/;
    if (!value) {
      callback(new Error("请输入邮箱"));
    }
    //只支持qq邮箱
    else if (!emailRegex.test(value)) {
      callback(new Error("请输入正确的邮箱格式"));
    } else {
      callback();
    }
  };
  // 验证码格式验证函数
  const validateCode = (rule: any, value: string, callback: any) => {
    if (loginOrRegister.value === "register") {
      if (!value) {
        callback(new Error("请输入验证码"));
      } else if (!/^\d{6}$/.test(value)) {
        callback(new Error("验证码必须是6位数字"));
      } else {
        callback();
      }
    } else {
      callback(); // 登录模式下不验证
    }
  };

  // 邮箱格式验证函数
  const validateEmailRequired = (rule: any, value: string, callback: any) => {
    if (loginOrRegister.value === "register") {
      if (!value) {
        callback(new Error("请输入邮箱"));
      } else {
        callback();
      }
    } else {
      callback(); // 登录模式下不验证
    }
  };

  const rules = computed(() => ({
    username: [
      { required: true, message: "请输入用户名", trigger: "blur" },
      {
        min: 3,
        max: 50,
        message: "用户名长度必须在 3 到 50 个字符",
        trigger: "blur",
      },
    ],
    password: [
      { required: true, message: "请输入密码", trigger: "blur" },
      {
        min: 6,
        max: 50,
        message: "密码长度必须在 6 到 50 个字符",
        trigger: "blur",
      },
    ],
    email: [
      { validator: validateEmailRequired, trigger: "blur" },
      { validator: validateEmail, trigger: "blur" },
    ],
    code: [{ validator: validateCode, trigger: "blur" }],
  }));
  let currTimer: any = null;

  const getCode = async () => {
    if (!formData.value.email) return;
    ElMessage.success("验证码发送成功，注意检查邮箱");
    // 清理之前的定时器，防止重复点击
    if (currTimer) {
      clearInterval(currTimer);
      currTimer = null;
    }

    try {
      loadding.value = true;
      await getCodeAPI({ email: formData.value.email });
      countDown.value = 60;

      currTimer = setInterval(() => {
        countDown.value--;
        if (countDown.value <= 0) {
          clearInterval(currTimer!);
          currTimer = null;
        }
      }, 1000);
    } finally {
      loadding.value = false;
    }
  };

  onUnmounted(() => {
    if (currTimer) {
      clearInterval(currTimer);
      currTimer = null;
    }
  });
  const handleSubmit = async () => {
    await formRef.value?.validate();
    submitLoading.value = true;
    try {
      if (loginOrRegister.value === "register") {
        await registerAPI(formData.value);
        ElMessage.success("注册成功");
        loginOrRegister.value = "login";
      } else {
        await login(formData.value);
        ElMessage.success("登录成功");
        emitter.emit("login");
      }
    } finally {
      submitLoading.value = false;
    }
  };

  const cleanup = () => {
    if (currTimer) {
      clearInterval(currTimer);
      currTimer = null;
    }
  };

  return {
    loginOrRegister,
    formData,
    loadding,
    countDown,
    disabled,
    rules,
    formRef,
    submitLoading,
    getCode,
    handleSubmit,
    cleanup,
  };
};
