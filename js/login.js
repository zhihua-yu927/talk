/**
 * 账号
 */
const loginValidator = new FieldValidator("txtLoginId", async function (val) {
  if (!val) {
    return "请输入账号";
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

const form = $(".user-form");
form.onsubmit = async (e) => {
  e.preventDefault();
  const result = await FieldValidator.validate(
    loginValidator,
    loginPwdValidator
  );
  console.log(result);
  if (!result) {
    return; // 验证未通过 什么都不做
  }

  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());
  console.log(data);

  const resp = await API.login(data);
  if (resp.code === 0) {
    alert("登陆成功，点击确定，跳转到首页");
    location.href = "./index.html";
  } else {
    loginPwdValidator.p.innerText = resp.msg;
    loginPwdValidator.input.value = "";
  }
};
