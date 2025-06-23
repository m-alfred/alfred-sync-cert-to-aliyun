const debounce = function (func, time) {
  let timer;

  return function (...args) {
    // 每次执行函数时清除上一次定时器
    clearTimeout(timer);

    timer = setTimeout(() => {
      func.apply(this, args);
    }, time);
  };
};

exports.debounce = debounce;
