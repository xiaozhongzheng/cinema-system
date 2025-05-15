(() => {
  document.addEventListener('DOMContentLoaded', () => {
    const docEl = document.documentElement;
    const resizeFn = () => {
      const baseSize = docEl.clientWidth / 1440 // 以1440px为设计稿
      console.log(docEl.clientWidth, baseSize, '**')
      docEl.style.fontSize = Math.max(0.8, baseSize) * 10 + 'px';
    };
    resizeFn();
    window.addEventListener('resize', resizeFn);
  });
})()
