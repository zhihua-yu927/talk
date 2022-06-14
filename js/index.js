(async () => {
  const resp = await API.profile();
  const user = resp.data;
  if (!user) {
    alert("账户未登录或已过期");
    location.href = "./login.html";
    return;
  }
  const doms = {
    aside: {
      nickname: $("#nickname"),
      loginId: $("#loginId"),
    },
    close: $(".close"),
    chatContainer: $(".chat-container"),
    txtMsg: $("#txtMsg"),
    subBtn: $(".msg-container"),
  };
  // 下面的登录环境一定是登陆状态
  setUserInfo();

  // 提交事件
  doms.subBtn.onsubmit = function (e) {
    e.preventDefault();
    sendChat();
  };

  // 注销事件
  doms.close.onclick = () => {
    API.loginOut();
    location.href = "./login.html";
  };

  /**
   * 获取历史记录
   */
  await loadHistory();
  async function loadHistory() {
    const resp = await API.getHistory();
    for (const item of resp.data) {
      addChat(item);
    }
    scrollToBottom();
  }

  /**
   * 设置用户信息
   */
  function setUserInfo() {
    doms.aside.nickname.innerText = user.nickname;
    doms.aside.loginId.innerText = user.loginId;
  }

  function addChat(chatInfo) {
    const chatItem = $$$("div");
    chatItem.className = "chat-item";
    if (chatInfo.from) {
      chatItem.classList.add("me");
    }

    const img = $$$("img");
    img.className = "chat-avatar";
    img.src = chatInfo.from ? "./asset/avatar.png" : "./asset/robot-avatar.jpg";

    const content = $$$("div");
    content.className = "chat-content";
    content.innerText = chatInfo.content;

    const date = $$$("div");
    date.className = "chat-date";
    date.innerText = formatDate(chatInfo.createdAt);

    chatItem.appendChild(img);
    chatItem.appendChild(content);
    chatItem.appendChild(date);

    doms.chatContainer.appendChild(chatItem);
  }

  /**
   * 让滚动条到达最底部
   */
  function scrollToBottom() {
    doms.chatContainer.scrollTop = doms.chatContainer.scrollHeight;
  }

  function formatDate(timestamp) {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDay().toString().padStart(2, "0");

    const hour = date.getHours().toString().padStart(2, "0");
    const minute = date.getMinutes().toString().padStart(2, "0");
    const second = date.getSeconds().toString().padStart(2, "0");

    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  }

  async function sendChat() {
    const content = doms.txtMsg.value.trim();
    if (!content) {
      return;
    }
    addChat({
      from: user.loginId,
      to: null,
      createdAt: Date.now(),
      content,
    });
    doms.txtMsg.value = "";
    scrollToBottom();

    const resp = await API.sendChat(content);
    addChat({
      from: null,
      to: user.loginId,
      ...resp.data,
    });
    scrollToBottom();
  }

  window.sendChat = sendChat;
})();
