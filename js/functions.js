"use strict";

// ограничивает повторное выполнение функции
function debounce(f, ms) {
  let isCooldown = false;
  return function() {
    if (isCooldown) return;
    f.apply(this, arguments);
    isCooldown = true;
    setTimeout(function() {
      return (isCooldown = false);
    }, ms);
  };
};

// случайное число
function randomInteger(min, max) {
  let rand = min + Math.random() * (max + 1 - min);
  let d = Math.floor(rand);
  return d;
};
