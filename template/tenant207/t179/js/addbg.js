// 判断时间区间显示背景图
; (function () {
  var body = $('body')
  var startTimer = body.attr('data-start-timer')
  var endTimer = body.attr('data-end-timer')

  if (!startTimer) {
    return
  }
  // 获取当前日期
  var getDateTime = function () {
    // 格式化日对象
    var date = new Date();
    var sign2 = ":";
    var year = date.getFullYear() // 年
    var month = date.getMonth() + 1; // 月
    var day = date.getDate(); // 日
    var hour = date.getHours(); // 时
    var minutes = date.getMinutes(); // 分
    var seconds = date.getSeconds() //秒
    var weekArr = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期天'];
    var week = weekArr[date.getDay()];
    // 给一位数的数据前面加 “0”
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (day >= 0 && day <= 9) {
      day = "0" + day;
    }
    if (hour >= 0 && hour <= 9) {
      hour = "0" + hour;
    }
    if (minutes >= 0 && minutes <= 9) {
      minutes = "0" + minutes;
    }
    if (seconds >= 0 && seconds <= 9) {
      seconds = "0" + seconds;
    }
    return year + "-" + month + "-" + day + " " + hour + sign2 + minutes + sign2 + seconds;
  };
  // 判断现在时间班次
  var date = {
    isDuringDate: function (beginDate, endDate) {
      var curDate = getDateTime();
      console.log(curDate, beginDate, endDate)
      if (endDate) {
        // 有结束时间
        if (curDate >= beginDate && curDate <= endDate) {
          return true;
        }
      } else {
        // 无结束时间
        if (curDate >= beginDate) {
          return true;
        }
      }
      return false;
    }
  }
  console.log(body, date.isDuringDate(startTimer, endTimer))
  if (date.isDuringDate(startTimer, endTimer)) {
    body.addClass('env-lh')
  }
})()