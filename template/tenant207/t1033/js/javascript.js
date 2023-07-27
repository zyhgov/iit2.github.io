/**
 * 专题列表
 * @param id
 */	   
function cm_selected(id){
    
    var obj = $('.list_topic_toggle').find('li');
    obj.hover(function(){obj.removeClass('selected');$(this).addClass('selected')},function(){});
	obj.first().addClass('selected');
}
cm_selected()
$(function(){
    //初始化专题切换
    cm_selected('.list_topic_toggle');
	
});

/**
 * 响应页面窗口调整
 * @constructor
 */
function HandleResponsiveOnResize(){
    $(window).resize(function(){
     
        //绑定移动端 Ajax 翻页事件
        BingLoadNextPageEvent($('#loadNextPageBtn'));
    });

  
}

/**
 * 获取分页信息
 * @returns {{totalpagenumber: string, baselink: string}}
 * @constructor
 */
function GetPageInfo(){
    var _return={totalpagenumber:0,baselink:"#",extend:'',index:1}
    var pagelink = $('#displaypagenum').find('a');
    if(pagelink.length)
    {
        var TotalPageNum,extend,lastHref;        
        lastHref = pagelink.last().attr('href');
        extend = lastHref.match(/\.[a-zA-Z]+$/ig);
        TotalPageNum = lastHref.match(/\d+\.[a-zA-Z]+$/ig);
        TotalPageNum = TotalPageNum[0].substr(0,TotalPageNum[0].length-extend[0].length);
        _return.totalpagenumber=parseInt(TotalPageNum);
        _return.baselink=pagelink.last().attr('href').substr(0,pagelink.last().attr('href').length-extend[0].length-TotalPageNum.length-1);
        _return.extend = extend[0];
        _return.index = parseInt($('#displaypagenum').find('span.page').first().text());
    }else{
        //预览状态的页码通过分页符获取
        var hrNum = $('#sourceHTML').find('hr').length;
        _return.totalpagenumber= hrNum ? hrNum : 1;
        _return.baselink = 'localhost';
    }
    return _return;
}

/**
 * Ajax 加载下一页数据
 * @param pageInfo
 * @param loadNextPageBtn
 * @constructor
 */
function LoadPage(pageInfo,loadNextPageBtn){
    console.log(pageInfo)
    var baseLink = pageInfo.baselink;
    var totalPageNum = pageInfo.totalpagenumber;
    var currentPage = parseInt(loadNextPageBtn.attr('data-CurrentPage'));
    var nextPage =  currentPage+1;
    var extend = pageInfo.extend;

    if(nextPage <= totalPageNum)
    {
        var pageUrl = totalPageNum == 1 ? baseLink + extend : baseLink + "_" + nextPage + extend;
        var ajaxResult = '';

        $.ajax({
            url:pageUrl,
            type:'GET',
            success:function(data){
                //取出页面中的正文部分
                ContentHtml_Reg = new RegExp("<!--HTMLBOX-->([\\s\\S]+)<!--HTMLBOX-->","i");
                ajaxResult = data.match(ContentHtml_Reg);
                ajaxResult = ajaxResult[1].replace(/<!--[\w\W\r\n]*?-->/gmi,"");
                ajaxResult = ajaxResult.replace(/<([^\s>]+)[^>]*>(\s*)<\/\1>/gmi,"");
                $('#main-news-list').append('<hr><small class="pageNum">第'+nextPage+'页</small>'+ajaxResult);

                if(nextPage == totalPageNum)
                {
                    loadNextPageBtn.remove();
                    showArticleEnd()
                }
                else
                {
                    loadNextPageBtn.attr({'data-CurrentPage':nextPage});
                    $('#VProgress').text(nextPage+'/'+pageInfo.totalpagenumber);
                }
            }
        });
    }
    else
    {
        loadNextPageBtn.remove();
        return;
    }

}
/**
 * 显示页脚和相关稿件
 */
function showArticleEnd()
{
    $('#pageFooter').show();
}

/**
 * 隐藏页脚和相关稿件
 */
function hiddenArticleEnd()
{
    $('#pageFooter').hide();
}

/**
 * 绑定分页按钮事件
 * @param loadNextPageBtn
 * @constructor
 */
function BingLoadNextPageEvent(loadNextPageBtn)
{
    if($(window).width()>992)
    {
        showArticleEnd()
	
        return;
    }

    if(loadNextPageBtn.length>0)
    {
        hiddenArticleEnd()
    }


    if(window.NextPageBtnHasEvent)
    {
        return ;
    }
   
     var pageInfo = GetPageInfo();
//  console.log(pageInfo,21313)
    // if(pageInfo.totalpagenumber>1){
    //     hiddenArticleEnd();
    //     loadNextPageBtn.click(function () {
    //         LoadPage(pageInfo,loadNextPageBtn);
    //     });
    //     $('#VProgress').text(1+'/'+pageInfo.totalpagenumber);
    //     window.NextPageBtnHasEvent = 1;
    // }else
    // {
    //   
    //     loadNextPageBtn.remove();
    // }
      showArticleEnd();

    //if(isIE5 || isIE6 || isIE7 || isIE8) return
}

/**
 * 字符串替换函数
 * @param s1
 * @param s2
 * @returns {string}
 */
// String.prototype.replaceAll = function(s1,s2) {
//     return this.replace(new RegExp(s1,"gm"),s2);
// }






(function(){	   

    //绑定窗口变化事件
    HandleResponsiveOnResize();

    //初始化 Ajax 翻页
    BingLoadNextPageEvent($('#loadNextPageBtn'));
		
})()
+function($){	
	var today=new Date();
	var d=new Array("星期日","星期一","星期二","星期三","星期四","星期五","星期六");
	var DDDD=(today.getYear()<1900 ? today.getYear()+1900:today.getYear())+"年"+(today.getMonth()+1)+"月"+today.getDate()+"日";
	$('[data-markup="time"]').length>0 && $('[data-markup="time"]').first().text(DDDD + " " + d[today.getDay()]);
}(window.jQuery);;

/* 折叠菜单 */
$(function(){
	var mainNav = $('#main-nav');
    var btn = $('#btn-nav-extend');
    btn.click(function(){
        if(mainNav.hasClass('open')){
            mainNav.removeClass('open');
            btn.text('更多');
        }else{
            mainNav.addClass('open');
            btn.text('隐藏');
        }
    });
});