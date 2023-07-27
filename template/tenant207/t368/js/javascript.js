/**
 * 涓撻鍒楄〃
 * @param id
 */
function cm_selected(id) {
  var obj = $(id).find("li");
  obj.hover(
    function () {
      obj.removeClass("selected");
      $(this).addClass("selected");
    },
    function () {}
  );
  obj.first().addClass("selected");
}

(function () {
  cm_selected(".list_topic_toggle");
})()

function HandleResponsiveOnResize() {
  $(window).resize(function () {
    BingLoadNextPageEvent($("#loadNextPageBtn"));
  });
}
function GetPageInfo() {
  var _return = { totalpagenumber: 0, baselink: "#", extend: "", index: 1 };
  var pagelink = $("#displaypagenum").find("a");
  if (pagelink.length) {
    var TotalPageNum, extend, lastHref;
    lastHref = pagelink.last().attr("href");
    extend = lastHref.match(/\.[a-zA-Z]+$/gi);
    TotalPageNum = lastHref.match(/\d+\.[a-zA-Z]+$/gi);
    TotalPageNum = TotalPageNum[0].substr(
      0,
      TotalPageNum[0].length - extend[0].length
    );
    _return.totalpagenumber = parseInt(TotalPageNum);
    _return.baselink = pagelink
      .last()
      .attr("href")
      .substr(
        0,
        pagelink.last().attr("href").length -
          extend[0].length -
          TotalPageNum.length -
          1
      );
    _return.extend = extend[0];
    _return.index = parseInt(
      $("#displaypagenum").find("span.page").first().text()
    );
  } else {
    //棰勮鐘舵€佺殑椤电爜閫氳繃鍒嗛〉绗﹁幏鍙�
    var hrNum = $("#sourceHTML").find("hr").length;
    _return.totalpagenumber = hrNum ? hrNum : 1;
    _return.baselink = "localhost";
  }
  return _return;
}

function LoadPage(pageInfo, loadNextPageBtn) {
  var baseLink = pageInfo.baselink;
  var totalPageNum = pageInfo.totalpagenumber;
  var currentPage = parseInt(loadNextPageBtn.attr("data-CurrentPage"));
  var nextPage = currentPage + 1;
  var extend = pageInfo.extend;

  if (nextPage <= totalPageNum) {
    var pageUrl =
      totalPageNum == 1
        ? baseLink + extend
        : baseLink + "_" + nextPage + extend;
    var ajaxResult = "";

    $.ajax({
      url: pageUrl,
      type: "GET",
      success: function (data) {
        //鍙栧嚭椤甸潰涓殑姝ｆ枃閮ㄥ垎
        ContentHtml_Reg = new RegExp(
          "<!--HTMLBOX-->([\\s\\S]+)<!--HTMLBOX-->",
          "i"
        );
        ajaxResult = data.match(ContentHtml_Reg);
        ajaxResult = ajaxResult[1].replace(/<!--[\w\W\r\n]*?-->/gim, "");
        ajaxResult = ajaxResult.replace(/<([^\s>]+)[^>]*>(\s*)<\/\1>/gim, "");
        $("#main-news-list").append(
          '<hr><small class="pageNum">绗�' +
            nextPage +
            "椤�</small>" +
            ajaxResult
        );

        if (nextPage == totalPageNum) {
          loadNextPageBtn.remove();
          showArticleEnd();
        } else {
          loadNextPageBtn.attr({ "data-CurrentPage": nextPage });
          $("#VProgress").text(nextPage + "/" + pageInfo.totalpagenumber);
        }
      },
    });
  } else {
    loadNextPageBtn.remove();
    return;
  }
}
function showArticleEnd() {
  $("#pageFooter").show();
}

function hiddenArticleEnd() {
  $("#pageFooter").hide();
}

function BingLoadNextPageEvent(loadNextPageBtn) {
  if ($(window).width() > 992) {
    showArticleEnd();
    return;
  }
  if (loadNextPageBtn.length > 0) {
    hiddenArticleEnd();
  }
  if (window.NextPageBtnHasEvent) {
    return;
  }
  var pageInfo = GetPageInfo();
  if (pageInfo.totalpagenumber > 1) {
    hiddenArticleEnd();
    loadNextPageBtn.click(function () {
      LoadPage(pageInfo, loadNextPageBtn);
    });
    $("#VProgress").text(1 + "/" + pageInfo.totalpagenumber);
    window.NextPageBtnHasEvent = 1;
  } else {
    showArticleEnd();
    loadNextPageBtn.remove();
  }
}

String.prototype.replaceAll = function (s1, s2) {
  return this.replace(new RegExp(s1, "gm"), s2);
};


+function($){	
	var today=new Date();
	var d=new Array("星期日","星期一","星期二","星期三","星期四","星期五","星期六");
	var DDDD=(today.getYear()<1900 ? today.getYear()+1900:today.getYear())+"年"+(today.getMonth()+1)+"月"+today.getDate()+"日";
	$('[data-markup="time"]').length>0 && $('[data-markup="time"]').first().text(DDDD + " " + d[today.getDay()]);
}(window.jQuery);