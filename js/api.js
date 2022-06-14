var API = (() => {
  const BASE_URL = "https://study.duyiedu.com";
  const TOKEN_KEY = "token";

  /**
   * 基于get与post方法使用，获取token值
   * @returns
   */
  function header() {
    const headers = {
      "Content-type": "application/json",
    };
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    return headers;
  }

  /**
   * get方法 函数
   * @param {*} path
   * @returns
   */
  function get(path) {
    const headers = header();
    return fetch(BASE_URL + path, { headers });
  }

  /**
   * post方法 函数
   * @param {*} path
   * @param {*} bodyJson
   * @returns
   */
  function post(path, bodyJson) {
    const headers = header();
    return fetch(BASE_URL + path, {
      headers,
      method: "POST",
      body: JSON.stringify(bodyJson),
    });
  }

  // 用户接口

  /**
   * 注册
   * @param {*} userInfo
   * @returns
   */
  async function reg(userInfo) {
    const user = await post("/api/user/reg", userInfo);
    return await user.json();
  }

  /**
   * 登录
   * @param {*} loginrInfo
   * @returns
   */
  async function login(loginrInfo) {
    const resp = await post("/api/user/login", loginrInfo);
    const result = await resp.json();
    if (result.code === 0) {
      // 登录成功
      // 将响应头中的 token 保存起来 (localStorage)
      const token = resp.headers.get("Authorization");
      localStorage.setItem([TOKEN_KEY], token);
    }
    return result;
  }

  /**
   * 账号
   * @param {*} loginId
   * @returns
   */
  async function exists(loginId) {
    const resp = await get("/api/user/exists?loginId=" + loginId);
    return await resp.json();
  }

  /**
   * 当前登录
   * @returns
   */
  async function profile() {
    const resp = await get("/api/user/profile");
    return await resp.json();
  }

  // 聊天接口

  /**
   * 发送
   * @param {*} content
   */
  async function sendChat(content) {
    const resp = await post("/api/chat", { content });
    return await resp.json();
  }

  /**
   * 获取聊天记录
   */
  async function getHistory() {
    const resp = await get("/api/chat/history");
    return await resp.json();
  }

  function loginOut() {
    localStorage.removeItem(TOKEN_KEY);
  }

  return {
    reg,
    login,
    exists,
    profile,
    sendChat,
    getHistory,
    loginOut,
  };
})();
