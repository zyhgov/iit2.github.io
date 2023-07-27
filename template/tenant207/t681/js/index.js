(function ($, window, document, undefined) {
  "use strict";
  function Paging(element, options) {
    this.element = element;
    this.options = {
      pageNum: options.pageNum || 1, // 当前页码
      totalNum: options.totalNum, // 总页码
      totalList: options.totalList, // 数据总记录
      callback: options.callback, // 回调函数
    };
    this.init();
  }
  Paging.prototype = {
    constructor: Paging,
    init: function () {
      this.createHtml();
      this.bindEvent();
    },
    createHtml: function () {
      var me = this;
      var content = [];
      var pageNum = me.options.pageNum;
      var totalNum = me.options.totalNum;
      var totalList = me.options.totalList;
      content.push(
        "<button type='button' id='prePage'>&lt;</button>"
      );
      // 总页数大于6必显示省略号
      if (totalNum > 6) {
        // 1、当前页码小于5且总页码大于6 省略号显示后面+总页码
        if (pageNum < 5) {
          // 1与6主要看要显示多少个按钮 目前都显示5个
          for (var i = 1; i < 6; i++) {
            if (pageNum !== i) {
              content.push("<button type='button'>" + i + "</button>&nbsp;&nbsp;&nbsp;");
            } else {
              content.push(
                "<button type='button' class='current'>" + i + "</button>&nbsp;&nbsp;&nbsp;"
              );
            }
          }
          content.push(". . .");
          content.push("<button type='button'>" + totalNum + "</button>");
        } else {
          // 2、当前页码接近后面 到最后页码隔3个 省略号显示后面+总页面
          if (pageNum < totalNum - 3) {
            for (var i = pageNum - 2; i < pageNum + 3; i++) {
              if (pageNum !== i) {
                content.push("<button type='button'>" + i + "</button>");
              } else {
                content.push(
                  "<button type='button' class='current'>" + i + "</button>"
                );
              }
            }
            content.push(". . .");
            content.push("<button type='button'>" + totalNum + "</button>");
          } else {
            // 3、页码至少在5，最多在【totalNum - 3】的中间位置 第一页+省略号显示前面
            content.push("<button type='button'>" + 1 + "</button>");
            content.push(". . .");
            for (var i = totalNum - 4; i < totalNum + 1; i++) {
              if (pageNum !== i) {
                content.push("<button type='button'>" + i + "</button>");
              } else {
                content.push(
                  "<button type='button' class='current'>" + i + "</button>"
                );
              }
            }
          }
        }
      } else {
        // 总页数小于6
        for (var i = 1; i < totalNum + 1; i++) {
          if (pageNum !== i) {
            content.push("<button type='button'>" + i + "</button>&nbsp;&nbsp;&nbsp;");
          } else {
            content.push(
              "<button type='button' class='current'>" + i + "</button>&nbsp;&nbsp;&nbsp;"
            );
          }
        }
      }
      content.push(
        "<button type='button' id='nextPage'>&gt;</button>"
      );
    //   content.push("<span class='totalNum'> 共 " + totalNum + " 页 </span>");
    //   content.push(
    //     "<span class='totalList'> 共 " + totalList + " 条记录 </span>"
    //   );
      me.element.html(content.join(""));

      // DOM重新生成后每次调用是否禁用button
      setTimeout(function () {
        me.dis();
      }, 20);
    },
    bindEvent: function () {
      var me = this;
      me.element.off("click", "button");
      // 委托新生成的dom监听事件
      me.element.on("click", "button", function () {
        var id = $(this).attr("id");
        var num = parseInt($(this).html());
        var pageNum = me.options.pageNum;
        if (id === "prePage") {
          if (pageNum !== 1) {
            me.options.pageNum -= 1;
          }
        } else if (id === "nextPage") {
          if (pageNum !== me.options.totalNum) {
            me.options.pageNum += 1;
          }
        } else if (id === "firstPage") {
          if (pageNum !== 1) {
            me.options.pageNum = 1;
          }
        } else if (id === "lastPage") {
          if (pageNum !== me.options.totalNum) {
            me.options.pageNum = me.options.totalNum;
          }
        } else {
          me.options.pageNum = num;
        }
        me.createHtml();
        if (me.options.callback) {
          me.options.callback(me.options.pageNum);
        }
      });
    },
    dis: function () {
      var me = this;
      var pageNum = me.options.pageNum;
      var totalNum = me.options.totalNum;
      if (pageNum === 1) {
        me.element.children("#firstPage, #prePage").prop("disabled", true);
      } else if (pageNum === totalNum) {
        me.element.children("#lastPage, #nextPage").prop("disabled", true);
      }
    },
  };
  $.fn.paging = function (options) {
    return new Paging($(this), options);
  };
})(jQuery, window, document);

// 动态选择
var selects = document.getElementsByTagName("select");
var isIE = document.all && window.ActiveXObject && !window.opera ? true : false;
function getElement(id) {
  return document.getElementById(id);
}
function stopBubbling(ev) {
  ev.stopPropagation();
}
function rSelects() {
  for (i = 0; i < selects.length; i++) {
    selects[i].style.display = "none";
    select_tag = document.createElement("div");
    select_tag.id = "select_" + selects[i].name;
    select_tag.className = "select_box";
    selects[i].parentNode.insertBefore(select_tag, selects[i]);

    select_info = document.createElement("div");
    select_info.id = "select_info_" + selects[i].name;
    select_info.className = "tag_select";
    select_info.style.cursor = "pointer";
    select_tag.appendChild(select_info);

    select_ul = document.createElement("ul");
    select_ul.id = "options_" + selects[i].name;
    select_ul.className = "tag_options";
    select_ul.style.position = "absolute";
    select_ul.style.display = "none";
    select_ul.style.zIndex = "999";
    select_tag.appendChild(select_ul);

    rOptions(i, selects[i].name);

    mouseSelects(selects[i].name);

    if (isIE) {
      selects[i].onclick = new Function(
        "clickLabels3('" +
        selects[i].name +
        "');window.event.cancelBubble = true;"
      );
    } else if (!isIE) {
      selects[i].onclick = new Function(
        "clickLabels3('" + selects[i].name + "')"
      );
      selects[i].addEventListener("click", stopBubbling, false);
    }
  }
}
function rOptions(i, name) {
  var options = selects[i].getElementsByTagName("option");
  var options_ul = "options_" + name;
  for (n = 0; n < selects[i].options.length; n++) {
    option_li = document.createElement("li");
    option_li.style.cursor = "pointer";
    option_li.className = "open";
    getElement(options_ul).appendChild(option_li);

    option_text = document.createTextNode(selects[i].options[n].text);
    option_li.appendChild(option_text);

    option_selected = selects[i].options[n].selected;

    if (option_selected) {
      option_li.className = "open_selected";
      option_li.id = "selected_" + name;
      getElement("select_info_" + name).appendChild(
        document.createTextNode(option_li.innerHTML)
      );
    }

    option_li.onmouseover = function () {
      this.className = "open_hover";
    };
    option_li.onmouseout = function () {
      if (this.id == "selected_" + name) {
        this.className = "open_selected";
      } else {
        this.className = "open";
      }
    };

    option_li.onclick = new Function(
      "clickOptions(" + i + "," + n + ",'" + selects[i].name + "')"
    );
  }
}
function mouseSelects(name) {
  var sincn = "select_info_" + name;
  getElement(sincn).onmouseover = function () {
    if (this.className == "tag_select") this.className = "tag_select_hover";
  };
  getElement(sincn).onmouseout = function () {
    if (this.className == "tag_select_hover") this.className = "tag_select";
  };
  if (isIE) {
    getElement(sincn).onclick = new Function(
      "clickSelects('" + name + "');window.event.cancelBubble = true;"
    );
  } else if (!isIE) {
    getElement(sincn).onclick = new Function("clickSelects('" + name + "');");
    getElement("select_info_" + name).addEventListener(
      "click",
      stopBubbling,
      false
    );
  }
}
function clickSelects(name) {
  var sincn = "select_info_" + name;
  var sinul = "options_" + name;

  for (i = 0; i < selects.length; i++) {
    if (selects[i].name == name) {
      if (getElement(sincn).className == "tag_select_hover") {
        getElement(sincn).className = "tag_select_open";
        getElement(sinul).style.display = "";
      } else if (getElement(sincn).className == "tag_select_open") {
        getElement(sincn).className = "tag_select_hover";
        getElement(sinul).style.display = "none";
      }
    } else {
      getElement("select_info_" + selects[i].name).className = "tag_select";
      getElement("options_" + selects[i].name).style.display = "none";
    }
  }
}
function clickOptions(i, n, name) {
  var li = getElement("options_" + name).getElementsByTagName("li");

  getElement("selected_" + name).className = "open";
  getElement("selected_" + name).id = "";
  li[n].id = "selected_" + name;
  li[n].className = "open_hover";
  getElement("select_" + name).removeChild(getElement("select_info_" + name));

  select_info = document.createElement("div");
  select_info.id = "select_info_" + name;
  select_info.className = "tag_select";
  select_info.style.cursor = "pointer";
  getElement("options_" + name).parentNode.insertBefore(
    select_info,
    getElement("options_" + name)
  );

  mouseSelects(name);

  getElement("select_info_" + name).appendChild(
    document.createTextNode(li[n].innerHTML)
  );
  getElement("options_" + name).style.display = "none";
  getElement("select_info_" + name).className = "tag_select";
  selects[i].options[n].selected = "selected";
}
function initSelect(e) {
  bodyclick = document.getElementsByTagName("body").item(0);
  rSelects();
  bodyclick.onclick = function () {
    for (i = 0; i < selects.length; i++) {
      getElement("select_info_" + selects[i].name).className = "tag_select";
      getElement("options_" + selects[i].name).style.display = "none";
    }
  };
}
function addFavorite(url, title) {
  try {
    window.external.addFavorite(url, title);
  } catch (e) {
    try {
      window.sidebar.addPanel(title, url, "");
    } catch (e) {
      alert("请按 Ctrl+D 键添加到收藏夹");
    }
  }
}

// 初始化下拉
initSelect();

/**
 * 获取url参数
 */
function getParamVal() {
  let params = {};
  let arr = location.search.substring(1).split("&");
  let aTmp = null;
  let numberVal = null;
  let value = null;

  if (location.search !== "") {
    for (var i = 0, iLen = arr.length; i < iLen; i++) {
      aTmp = arr[i].split("=");
      value = decodeURIComponent(aTmp[1]);
      numberVal = Number(value);
      // 处理数字
      if (typeof numberVal === "number" && numberVal === numberVal) {
        value = numberVal;
      }
      // 处理布尔值
      if (value === "true" || value === "false") {
        value = value === "true";
      }
      params[aTmp[0]] = value;
    }
  }
  return params;
}
/**
 * 时间戳转化成时间格式
 */
function getMyDate(timestamp) {
  timestamp = Number(timestamp);
  if (typeof timestamp === "number") {
    var time = new Date(timestamp * 1000);
    var add0 = function (m) {
      return m < 10 ? "0" + m : m;
    };
    var year = time.getFullYear();
    var month = time.getMonth() + 1;
    var date = time.getDate();
    return year + "." + add0(month) + "." + add0(date) + "";
  } else {
    return timestamp;
  }
}

// 去空
function trim(str, isGlobal) {
  var result;
  result = str.replace(/(^\s+)|(\s+$)/g, "");
  if (isGlobal && isGlobal.toLowerCase() === "g") {
    result = result.replace(/\s/g, "");
  }
  return result;
}

(function () {
  // 全局参数
  let languages = 1; // 语言
  let baseInfoList = new Array(); // 检索描述
  baseInfoList[1] = new Array(
    "您要检索的是：",
    "正在获取，请稍候",
    "作者",
    "分类",
    "时间",
    "相关度",
    "没有检索到结果"
  );
  baseInfoList[2] = new Array(
    "您要檢索的是：",
    "正在獲取，請稍候",
    "作者",
    "分類",
    "時間",
    "相關度",
    "没有檢索到结果"
  );
  baseInfoList[3] = new Array(
    "Did you mean to search for:",
    "please wait",
    "Author",
    "Channel",
    "Date",
    "Relevance",
    "No Results"
  );

  function getQueryString(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
      // console.log(decodeURIComponent(r[2]))
      return decodeURIComponent(r[2]);
    }
    return null;
  }

  // var param = getParamVal()
  // var keyword = param["keyword"] // 搜索关键词
  // var searchfield = param["searchfield"] // 搜索方式：标题TITLE/正文CONTENT/作者AUTHOR
  // var indexsearch = Number(param["indexsearch"]) // 检索方式：1:标准搜索 2:模糊匹配 3:二次检索
  // var channelId = param['channelId'] ? param['channelId'] : 636;
  var keyword = getQueryString("keyword") // 搜索关键词
  var searchfield = getQueryString("searchfield") // 搜索方式：标题TITLE/正文CONTENT/作者AUTHOR
  var indexsearch = Number(getQueryString("indexsearch")) // 检索方式：1:标准搜索 2:模糊匹配 3:二次检索
  var channelId = getQueryString('channelId') ? getQueryString('channelId') : 718;
  var pageSize = 10 // 请求页长度
  var pageNumber = 1 // 当前页码
  var pageTotal = 0 // 总数
  var curSearchField = '' // 搜索方式-字符
  var curIndexSearch = '' // 检索方式-字符
  var params = {} // 请求参数
  var initFlag = false // 初始化第一次
//   var channelId = param['channelId'] ? param['channelId'] : 718;

  if (!keyword) {
    keyword = ''
  } else {
      if (keyword.indexOf('+') > -1) {
        keyword = keyword.replace(/\+/g, ' ')
    }
  }
  if (!searchfield) {
    searchfield = 'TITLE'
  }
  if (!indexsearch) {
    indexsearch = 2
  }
  console.log('keyword', keyword, searchfield, indexsearch)

  // 搜索结果页方法
  function getResult(type) {
    // if(type == 'click') {
    //   if($("#rekeyword input").val().trim() == ''){
    //     $("#rekeyword input").val('');
    //     alert("请填写关键词然后提交")
    //     return
    //   }
    // }
    if (initFlag) return;
    initFlag = true;
    $("#DETAILELE1").html("");

    // 初始化
    if (type === "init") {
      // 搜索方式 -- 根据url参数显示当前
      let REFIELDform = $("#REFIELDform option");
      for (let i = 0; i < REFIELDform.length; i++) {
        if (searchfield === REFIELDform.eq(i).attr("value")) {
          $("#options_REFIELDform li").eq(i).trigger("click");
          curSearchField = REFIELDform.eq(i).text();
          searchfield = REFIELDform.eq(i).attr("value");
        }
      }
      // 检索方式 -- 根据url参数显示当前
      let isagain = $("#isagain option");
      for (let i = 0; i < isagain.length; i++) {
        if (indexsearch === Number(isagain.eq(i).attr("value"))) {
          $("#options_isagain li").eq(i).trigger("click");
          curIndexSearch = isagain.eq(i).text();
          indexsearch = Number(isagain.eq(i).attr("value"));
        }
      }
    }
    console.log(searchfield)
    // 根据搜索方式 传递接口请求参数
    if (searchfield === "TITLE") {
      // 标题
      params = {
        pageNumber: pageNumber,
        pageSize: pageSize,
        returnFields: "",
        indexNames: "manuscript", // (material:素材库 manuscript:稿件库),
        highlightType: 2,
        title: keyword,
        searchType: indexsearch,
        accessToken: "eXAiOiJKV1QiLJ9Jpc3MiOiJodHRwOlwvXC9n",
      };
    }
    if (searchfield === "CONTENT") {
      // 正文
      params = {
        pageNumber: pageNumber,
        pageSize: pageSize,
        returnFields: "",
        indexNames: "manuscript", // (material:素材库 manuscript:稿件库),
        highlightType: 2,
        content: keyword,
        searchType: indexsearch,
        accessToken: "eXAiOiJKV1QiLJ9Jpc3MiOiJodHRwOlwvXC9n",
      };
    }
    if (searchfield === "AUTHOR") {
      // 作者
      params = {
        pageNumber: pageNumber,
        pageSize: pageSize,
        returnFields: "",
        indexNames: "manuscript", // (material:素材库 manuscript:稿件库),
        highlightType: 2,
        author: keyword,
        searchType: indexsearch,
        accessToken: "eXAiOiJKV1QiLJ9Jpc3MiOiJodHRwOlwvXC9n",
      };
    }

    $("#rekeyword input").val(keyword);
    $("#jiazai").addClass("add_block_process");
    $("#select_info_REFIELDform").html(curSearchField);
    $("#select_info_isagain").html(curIndexSearch);
    console.log(
      "params",
      curSearchField + "/" + searchfield,
      curIndexSearch + "/" + (indexsearch),
      params
    );
    params.accessToken='eXAiOiJKV1QiLJ9Jpc3MiOiJodHRwOlwvXC9n';
    params.channelId=718;
    $.ajax({
      url: `${document.location.protocol}//mod-search.mod.gov.cn/api-surface/es/docSearchEasy`,
      data: params,
      success: function (res) {
        console.log("result", res);
        initFlag = false;
        if (res.code === 200) {
          let dataList = res.data.resultList;
          pageTotal = res.data.total;
          $("#totlenumele").html(res.data.total);
          $("#keywordele").html(`<font color="red">${keyword}</font>`);
          var pageQujian = ((params.pageNumber == 1) ? params.pageNumber : (params.pageSize * params.pageNumber - 10)) + '-' + params.pageSize * params.pageNumber
          $('#pagefwele').html(pageQujian)
          $("#TONGYINELE").html(baseInfoList[languages][0]);
          $("#TONGYIELE").html(baseInfoList[languages][0]);
          $("#timeele").html(res.data.useTime);
          $("#jiazai").removeClass("add_block_process");

          // 分页
          $("#page").paging({
            pageNum: pageNumber, // 当前页面
            totalNum: Math.ceil(pageTotal / pageSize), // 总页码
            totalList: pageTotal, // 记录总数量
            callback: function (num) {
              //回调函数
              console.log("num", num);
              pageNumber = num;
              getResult();
            },
          });

          let strHtml = "";
          console.log(dataList,2313)
          dataList.map((item) => {
            if (item.manuscriptData) {
              strHtml += `<table width="100%" border="0"><tbody>
                <tr><td class="lv16"><a href="${
                item.manuscriptData.url
                }" target="_blank">${item.title}</a></td></tr>
                <tr class="${!item.desc ? "hidden" : ""}"><td class="hei12">${
                !item.desc ? "" : item.desc
                }</td></tr>
                <tr><td class="lv12">
                <a href="${item.manuscriptData.url}" target="_blank">${
                item.manuscriptData.url
                }</a>&nbsp;&nbsp;
                作者：${item.author}&nbsp;&nbsp;
                分类：${item.manuscriptData.classify_name}&nbsp;&nbsp;
                时间：${
                !item.issueTime ? "" : getMyDate(item.issueTime)
                }&nbsp;&nbsp;
                </td></tr>
                </tbody></table>`;
            } else {
              strHtml += `<table width="100%" border="0"><tbody>
                <tr><td class="lv16"><a>${item.title}</a></td></tr>
                <tr class="${!item.desc ? "hidden" : ""}"><td class="hei12">${
                !item.desc ? "" : item.desc
                }</td></tr>
                <tr><td class="lv12">
                作者：${item.author}&nbsp;&nbsp;
                时间：${
                !item.issueTime ? "" : getMyDate(item.issueTime)
                }&nbsp;&nbsp;
                </td></tr>
                </tbody></table>`;
            }
          });
          $("#DETAILELE1").html(strHtml);
          if (res.data.tota == '0') {
              $("#DETAILELE1").html(baseInfoList[languages][6]);
          }
          if (Number(pageTotal) < 1) {
            $("#DETAILELE1").html(`<table width="100%" valign="middle" border="0">
            <tbody>
                <tr>
                    <td style="padding-top:0;display:flex;justify-content:center;" class="lv16"><p>没有检索到结果</p></td>
                </tr>
            </tbody>
            </table>`);
          }
          setS2T();
        }
      },
      error: function () {
        initFlag = false;
      },
    });
  }

  // 搜索方式
  let options_REFIELDform = $("#options_REFIELDform li");
  options_REFIELDform.on("click", function () {
    let index = $(this).index();
    curSearchField = options_REFIELDform.eq(index).text();
    searchfield = $("#REFIELDform option").eq(index).attr("value");
  });
  // 检索方式
  let options_isagain = $("#options_isagain li");
  options_isagain.on("click", function () {
    let index = $(this).index();
    curIndexSearch = options_isagain.eq(index).text();
    indexsearch = Number($("#isagain option").eq(index).attr("value"));
  });
  // 初始化
  getResult("init");
  // 图标点击搜索
  $("#iconSearch").on("click", function () {
    pageNumber = 1;
    keyword = $('#rekeyword input').val()
    if (keyword.indexOf('+') > -1) {
        keyword = keyword.replace(/\+/g, ' ')
    }
    getResult("click");
  });
  // keycode
  $("#rekeyword input").on("keydown", function (event) {
    if (event.keyCode == "13") {
      event.preventDefault();
      pageNumber = 1;
      keyword = $('#rekeyword input').val()
      if (keyword.indexOf('+') > -1) {
        keyword = keyword.replace(/\+/g, ' ')
    }
      getResult("click");
    }
  });
})();
