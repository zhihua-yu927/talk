// 用户登录与注册的表单验证的通用代码

class FieldValidator {
  /**
   *
   * @param {string} txtId 元素的名称
   * @param {*} validatorFunc
   */
  constructor(txtId, validatorFunc) {
    this.input = $("#" + txtId);
    this.p = this.input.nextElementSibling;
    this.validatorFunc = validatorFunc;

    // 失去焦点事件
    this.input.onblur = () => {
      this.validate();
    };
  }
  /**
   * 验证成功返回true， 失败返回false
   * 原型方法
   */
  async validate() {
    const err = await this.validatorFunc(this.input.value);
    if (err) {
      this.p.innerText = err;
      return false;
    } else {
      this.p.innerText = "";
      return true;
    }
  }

  /**
   * 静态方法
   * @param {FieldValidator[]} validates
   */
  static async validate(...validates) {
    const proms = validates.map((r) => r.validate());
    const result = await Promise.all(proms);
    return result.every((r) => r);
  }
}


