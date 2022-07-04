// 防抖指令，可用于表单提交防止重复点击
const debounce = {
  inserted: function (el, binding) {
    let timer;
    el.addEventListener('click', () => {
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        binding.value();
      }, binding.arg || 1000);
    });
  }
};
export default debounce;
