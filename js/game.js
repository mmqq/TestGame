//******** Nino 连连看 ************//
//********增加消除后时间+5秒功能************//



var GameTime = 5 * 60;
var st;
var maxwidthNum;
var maxheightNum;


function ImgObj(id, url, sortId, isImg) {
  this.id = id;
  this.url = url;
  this.sortId = sortId;
  this.isImg = isImg;
}


$(document).ready(function() {
  maxwidthNum = Math.floor($("#gamecontent").width() / 105) + 2;
  maxheightNum = parseInt(12 * 6 / maxwidthNum) + 2;
  SetNewGame();
  BindOpt();

});

//游戏开始
var SetNewGame = function() {
  var imgList = new Array();
  for (var i = 0; i < 12; i++) {
    imgList.push(new ImgObj(i, "img/" + i + ".png", $.GetRandomNum(100, 500, false) * 1-0.1));
    imgList.push(new ImgObj(i, "img/" + i + ".png", $.GetRandomNum(100, 500, false) * 1 + 0.2));
    imgList.push(new ImgObj(i, "img/" + i + ".png", $.GetRandomNum(100, 500, true) * 1 - 0.2));
    imgList.push(new ImgObj(i, "img/" + i + ".png", $.GetRandomNum(100, 500, true) * 1 + 0.1));
    imgList.push(new ImgObj(i, "img/" + i + ".png", $.GetRandomNum(100, 500, false) * 1 - 0.2));
    imgList.push(new ImgObj(i, "img/" + i + ".png", $.GetRandomNum(100, 500, true) * 1 + 0.2));
  }

  GetSort(imgList);



  //插入首行空白行
  for (var i = 0; i < maxwidthNum; i++) {
    $("#gamecontent").append("<div data-id=\"-1\" data-sortId=\"-999\" class=\"\" data-row=\"0\" data-col=\"" + i + "\" > </div>");
  }

  //插入元素
  for (var i = 0; i < imgList.length; i++) {
    //每行首个加空元素
    if (i % parseInt(maxwidthNum - 2) == 0) {
      $("#gamecontent").append("<div data-id=\"-1\" data-sortId=\"-999\" class=\"\" data-row=\"" + (parseInt(i / (maxwidthNum - 2)) + 1) + "\" data-col=\"" + 0 + "\" > </div>");
    }

    //真正元素
    $("#gamecontent").append("<div data-id=\"" + imgList[i].id + "\" data-sortId=\"" + imgList[i].sortId + "\" class=\"imgout imgout-disbled\"   data-row=\"" + (parseInt(i / (maxwidthNum - 2)) + 1) + "\"  data-col=\"" + parseInt(i % (maxwidthNum - 2) + 1) + "\" > <img  style=\"display:none\"  src=\"" + imgList[i].url + "\"  /></div>");
    //每行末尾加空元素
    if (i % (maxwidthNum - 2) == (maxwidthNum - 2 - 1)) {
      $("#gamecontent").append("<div data-id=\"-1\" data-sortId=\"-999\" class=\"\" data-row=\"" + parseInt(i / (maxwidthNum - 2) + 1) + "\" data-col=\"" + (maxwidthNum - 2 + 1) + "\" > </div>");
    }
  };

  //末尾一行加入空白元素
  for (var i = 0; i < maxwidthNum; i++) {
    $("#gamecontent").append("<div data-id=\"-1\" data-sortId=\"-999\" class=\"\" data-row=\"" + (maxheightNum) + "\" data-col=\"" + i + "\" > </div>");
  }

};

//冒泡排序
var GetSort = function(list) {
  for (var i = 0; i < list.length; i++) {
    for (var j = i + 1; j < list.length; j++) {
      var temp = list[i];
      if (list[i].sortId > list[j].sortId) {
        list[i] = list[j];
        list[j] = temp;
      }
    }
  }
};


//绑定事件
var BindOpt = function() {
  $("img").click(function() {
    if ($(".onClick").length > 0) {
      //之前选中的和自己匹配
      if ($(".onClick").parent("div").attr("data-id") == $(this).parent("div").attr("data-id") && $(".onClick").parent("div").attr("data-sortId") != $(this).parent("div").attr("data-sortId")) {
        if (IsCanRemove($(".onClick").parent("div"), $(this).parent("div"))) {
          $(".onClick").parent("div").children("img").remove();
          $(this).remove();
          GameTime +=6;
        }
        //如果已经没有图片了表示完成
        if ($("img").length == 0) {
          window.location.href = "Successdialog.html";
        }
      }

      $(this).removeClass("onClick");
      // $(this).parent("div").removeClass("imgout").addClass("noimg");
    }

    //第一次选中
    else {
      $(this).addClass("onClick");
    }
  });



  //开始 暂停变换
  $("#slider").change(function() {
    if ($(this).children(":selected").val() == "stop") {
      self.clearInterval(st);
      $("img").hide();
      $(".imgout").addClass("imgout-disbled");
    } else
    if ($(this).children(":selected").val() == "start") {
      SetTime();
      $("img").show();
      st = self.setInterval("SetTime()", 1000);
      $(".imgout").removeClass("imgout-disbled");
    }

  });

};

//设置倒数时间
//判断时间
var SetTime = function() {
  $("#time-span").html(parseInt(GameTime / 60) + ":" + (GameTime % 60 < 10 ? "0" + GameTime % 60 : GameTime % 60));
  if (GameTime == 0) {
    // $.mobile.changePage("#dialog");
    //跳转失败页面
    window.location.href = "Faildialog.html";
    self.clearInterval(st);
  }
  GameTime--;
};


//是否可以消除
var IsCanRemove = function(dian1, dian2) {
  var result = false;
  //紧紧相岭
  if ((Math.abs(dian1.attr("data-row") * 1 - 1 * dian2.attr("data-row")) == 1 && (dian1.attr("data-col") == dian2.attr("data-col"))) || Math.abs(dian1.attr("data-col") * 1 - 1 * dian2.attr("data-col")) == 1 && (dian1.attr("data-row") == dian2.attr("data-row"))) {
 
    result = true;
  } else {
    //检查是否dian1不可动
    if (!checkIsNoWay(dian1) && !checkIsNoWay(dian2)) {
      result = SameColOrRow(dian1, dian2) || OneCorner(dian1, dian2) || TwoCorner(dian1, dian2);
    }
  }
  return result;
};

//上下左右是否都存在图片
var checkIsNoWay = function(dian) {
  return $("[data-row=" + dian.attr("data-row") + "][data-col=" + (parseInt(dian.attr("data-col")) + 1) + "]").children("img").length *
    $("[data-row=" + dian.attr("data-row") + "][data-col=" + (parseInt(dian.attr("data-col")) - 1) + "]").children("img").length *
    $("[data-row=" + (parseInt(dian.attr("data-row")) + 1) + "][data-col=" + dian.attr("data-col") + "]").children("img").length *
    $("[data-row=" + (parseInt(dian.attr("data-row")) - 1) + "][data-col=" + dian.attr("data-col") + "]").children("img").length == 1;
};


//判断是否是同行或同列可消除
var SameColOrRow = function(dian1, dian2) {

  var balance;
  //同行
  if (dian1.attr("data-row") == dian2.attr("data-row") &&
    ((Math.abs(parseInt(dian1.attr("data-col")) - parseInt(dian2.attr("data-col"))) > 1) ||
      (dian1.children("img").length == 0 || dian2.children("img").length == 0))
  ) {
    //当中的相差
    balance = parseInt(dian1.attr("data-col")) - parseInt(dian2.attr("data-col"));
    if (Math.abs(balance) == 1 ||
      $("[data-row=" + dian1.attr("data-row") + "]").slice((balance > 0 ? parseInt(dian2.attr("data-col")) : parseInt(dian1.attr("data-col"))) + 1,
        balance > 0 ? parseInt(dian1.attr("data-col")) : parseInt(dian2.attr("data-col"))).children("img").length == 0) {
      //能够删除
      return true;
    };

  }

  //同列
  if (dian1.attr("data-col") == dian2.attr("data-col") &&
    ((Math.abs(parseInt(dian1.attr("data-row")) - parseInt(dian2.attr("data-row"))) > 1) ||
      (dian1.children("img").length == 0 || dian2.children("img").length == 0))
  ) {
    //当中的相差
    balance = parseInt(dian1.attr("data-row")) - parseInt(dian2.attr("data-row"));
    if (Math.abs(balance) == 1 ||
      $("[data-col=" + dian1.attr("data-col") + "]").slice((balance > 0 ? parseInt(dian2.attr("data-row")) : parseInt(dian1.attr("data-row"))) + 1,
        balance > 0 ? parseInt(dian1.attr("data-row")) : parseInt(dian2.attr("data-row"))).children("img").length == 0) {
      //能够删除
      return true;
    };
  };

  return false;
};

//打一个弯角
var OneCorner = function(dian1, dian2) {
  //定弯角点1
  var wan1 = $("[data-row=" + dian1.attr("data-row") + "][data-col=" + dian2.attr("data-col") + "]");

  //转交点1为空 才可继续
  if (wan1.children("img").length == 0) {
    if (SameColOrRow(dian1, wan1) && SameColOrRow(dian2, wan1)) {
      return true;
    }
  }
  //定弯角点2
  var wan2 = $("[data-row=" + dian2.attr("data-row") + "][data-col=" + dian1.attr("data-col") + "]");
  //转交点2为空 才可继续
  if (wan2.children("img").length == 0) {
    if (SameColOrRow(dian1, wan2) && SameColOrRow(dian2, wan2)) {
      return true;
    }
  }
  return false;
};

//打两个弯
var TwoCorner = function(dian1, dian2) {
  //第一种可能性 为x变更 ，y不变更
  //col=x  row=y
  var result;
  for (var tempX = 0; tempX <= maxheightNum; tempX++) {
 
    result = $("[data-row=" + tempX + "][data-col=" + dian2.attr("data-col") + "]").children("img").length == 0 &&
     $("[data-row=" + tempX + "][data-col=" + dian1.attr("data-col") + "]").children("img").length == 0 &&
      SameColOrRow($("[data-row=" + tempX + "][data-col=" + dian2.attr("data-col") + "]"), dian2) &&
      SameColOrRow($("[data-row=" + tempX + "][data-col=" + dian1.attr("data-col") + "]"), $("[data-row=" + tempX + "][data-col=" + dian2.attr("data-col") + "]")) &&
      SameColOrRow(dian1, $("[data-row=" + tempX + "][data-col=" + dian1.attr("data-col") + "]"));
    // 挑出循环
    if (result == true) {
      return true;
    }
  };


  if (!result) {
    //第二种可能性 x不变更,y变更
    //col=x  row=y
    for (var i = 0; i <= maxwidthNum; i++) {
      result = $("[data-col=" + i + "][data-row=" + dian1.attr("data-row")+ "]") .children("img").length == 0 &&
               $("[data-col=" + i + "][data-row=" + dian1.attr("data-row") + "]").children("img").length == 0 &&
        SameColOrRow(dian1, $("[data-col=" + i + "][data-row=" + dian1.attr("data-row") + "]")) &&
        SameColOrRow($("[data-col=" + i + "][data-row=" + dian2.attr("data-row") + "]"), $("[data-col=" + i + "][data-row=" + dian1.attr("data-row") + "]")) &&
        SameColOrRow($("[data-col=" + i + "][data-row=" + dian2.attr("data-row") + "]"), dian2);
      // 挑出循环
      if (result == true) {
        return true;
      }
    }
  }
  return result;
};

$.extend({
  //产生随机数
  GetRandomNum: function(Min, Max, IsMin) {

    return Math.abs(Math.random(Min, Max) * Math.random(100)) * (IsMin == true ? Min : Max);
  }
});