/*
 * @Author: yaodongyi
 * @Date: 2019-08-28 10:52:48
 * @Description:入口文件
 */
// require('@babel/polyfill');

require('../assets/js/common/navigator.js');
import '../assets/style/style.less';

console.log($tools);

// scroll-style
$('ul.note li').click(function (e) {
  $('ul.note li').attr('class', '');
  $(this).attr('class', 'active');
  $('html,body').animate(
    {
      scrollTop: $(this)[0] === $(`ul.note li`).eq(0)[0] ? 0 : $(this)[0] === $(`ul.note li`).eq(1)[0] ? $('.second').offset().top : $(this)[0] === $(`ul.note li`).eq(2)[0] ? $('.third').offset().top : $('.fourth').offset().top,
    },
    300
  );
  console.log(this);
});
function scrollFun() {
  let h_scrTop = $('html,body').scrollTop();
  let header = $('header').offset().top;
  let second = $('.second').offset().top;
  let third = $('.third').offset().top;
  let fourth = $('.fourth').offset().top;
  $(`ul.note li`).attr('class', '');
  if (h_scrTop >= header && h_scrTop < second - 50) {
    $(`ul.note li`).eq(0).attr('class', 'active');
  } else if (h_scrTop >= second - 50 && h_scrTop < third - 50) {
    $(`ul.note li`).eq(1).attr('class', 'active');
  } else if (h_scrTop >= third - 50 && h_scrTop < fourth - 50) {
    $(`ul.note li`).eq(2).attr('class', 'active');
  } else {
    $(`ul.note li`).eq(3).attr('class', 'active');
  }
}
scrollFun();
$(document).scroll($tools.debounce(scrollFun, 100));
// scroll-style end

// 初始化悬浮---优势
$(function () {
  $('.second ul li').attr('class', 'transition');
});

// qrcode弹窗
$('.f-mask-qrcode').hide();
$('.download-btn').click(function () {
  $('.f-mask-qrcode').css({ opacity: 1 });
  $('.f-mask-qrcode').show();
});
$('.f-mask-qrcode').click(function () {
  $('.f-mask-qrcode').hide();
});
