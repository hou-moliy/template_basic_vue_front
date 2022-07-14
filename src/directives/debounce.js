/**
* 防抖指令，可用于表单提交防止重复点击
* 使用方式：
* 1. <button class="btn"
*           v-debounce="handleLogin">防抖</button>
* 2.  <button class="btn"
*           v-debounce:3000="handleLogin">防抖</button>
*/
export default {
  inserted: function (el, binding) {
    let timer;
    let timerFlag = true;
    el.addEventListener('click', () => {
      if (timer) {
        clearTimeout(timer);
      }
      if (timerFlag) {
        binding.value();
        timerFlag = false;
      }
      timer = setTimeout(() => {
        // binding.value();
        timerFlag = true;
      }, binding.arg || 1000);
    });
  }
};
