/**
 * 账号
 */
const loginValidator = new FieldValidator("txtLoginId", async function (val) {
  if (!val) {
    return "请输入账号";
  }
  const resp = await API.exists(val);
  if (resp.data) {
    return "该账号已被注册，请重新填写账号";
  }
});

/**
 * 昵称
 */
const nickNameValidator = new FieldValidator("txtNickname", function (val) {
  if (!val) {
    return "请输入昵称";
  }
});

/**
 * 密码
 */
const loginPwdValidator = new FieldValidator("txtLoginPwd", function (val) {
  if (!val) {
    return "请输入密码";
  }
});

/**
 * 确认密码
 */
const loginPwdConfirmValidator = new FieldValidator(
  "txtLoginPwdConfirm",
  function (val) {
    if (!val) {
      return "请再一次输入密码";
    }
    if (val !== loginPwdValidator.input.value) {
      return "两次输入的密码不一致";
    }
  }
);

const form = $(".user-form");
form.onsubmit = async (e) => {
  e.preventDefault();
  const result = await FieldValidator.validate(
    loginValidator,
    nickNameValidator,
    loginPwdValidator,
    loginPwdConfirmValidator
  );
  console.log(result);
  if (!result) {
    return; // 验证未通过 什么都不做
  }

  const formData = new FormData(form);
  console.log();
  const data = Object.fromEntries(formData.entries());

  const resp = await API.reg(data);
  if (resp.code === 0) {
    alert("注册成功，跳转到登录页面");
    location.href = "./login.html";
  }
};
