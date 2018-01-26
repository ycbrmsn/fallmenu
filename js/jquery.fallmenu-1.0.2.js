/**
 * @author jzw
 * @version 1.0.2
 * @history 
 *    1.0.2 修改了显示三级菜单时，二级菜单出现滚动条的问题
 */
;(function (factory) {
  if (typeof define === "function" && define.amd) {
    // AMD模式
    define([ "jquery" ], factory);
  } else {
    // 全局模式
    factory(jQuery);
  }
}(function ($) {
  $.fn.fallmenu = function (options) {
    // 默认参数
    var defaultOption = {
      scrollWidth: 20, // 滚动条宽度
      menuHeight: 60, // 一级菜单高度
      menuFontSize: 16, // 菜单字体大小
      menuPadding: 20, // 菜单的左右内间距
      menuPanelColor: '#2F4056', // 菜单栏颜色
      subMenuPanelColor: '#537298', // 子菜单栏颜色
      hiddenMenuPanelColor: '#5F7389', // 隐藏菜单栏颜色
      activeMenuItemColor: '#415977', // 选中菜单项颜色
      activeSubMenuItemColor: '#6e8cb0', // 选中的子菜单项颜色
      subMenuFontSize: 16, // 子菜单字体大小
      subMenuItemHeight: 30, // 子菜单每一项的高度
      subMenuItemMaxChineseChars: 11, // 子菜单最大中文数（一个中文对应两个英文活半角符号）
      subMenuMaxHeight: 210, // 子菜单的最大高度
      moreMenuIconBoxTop: 25, // 一级菜单更多图标盒子的top
      moreMenuIconTop: -13, // 一级菜单更多图标的top
      secondMoreMenuIconBoxTop: 10, // 二级菜单更多图标盒子的top
      secondMoreMenuIconTop: -12, // 二级菜单的更多图标的top
      moreMenuMoveDistance: 10, // 更多图标动画移动距离
      clickMenu: function (data) {
        console.log(data);
      }, // 菜单点击事件
      data: [
        {
          title: '首页',
          level: 'first'
        },
        {
          title: '菜单一',
          level: 'first',
          children: [
            {
              title: '菜单一-一',
              level: 'second',
              children: [
                {
                  title: '菜单一-二',
                  level: 'third'
                }
              ]
            }
          ]
        }
      ] // 菜单数据
    }
    var opt = $.extend(defaultOption, options);
    return this.each(function () {
      var $menu = $(this);
      var height = $menu.height();

      constructDoms($(this), opt.data, opt);

      // *************************************初始化开始***************************************
      // 设置菜单项样式
      $menu.find('.fallmenu-a__firstlevel').css({
        'height': opt.menuHeight + 'px',
        'lineHeight': opt.menuHeight + 'px',
        'fontSize': opt.menuFontSize + 'px',
        'padding': '0 ' + opt.menuPadding + 'px'
      });
      // 隐藏其他页菜单
      $menu.find('.fallmenu-box__current').css({
        'backgroundColor': opt.menuPanelColor
      }).siblings('.fallmenu-box').hide().css({
        'backgroundColor': opt.hiddenMenuPanelColor
      });
      // 设置翻页拉环按钮
      $menu.find('.fallmenu-knocker__large').css({
        'marginTop': '-10px'
      });
      // 设置二级菜单的样式
      $menu.find('.fallmenu-box__secondlevel').css({
        'width': '1px',
        'height': '0px',
        'maxHeight': opt.subMenuMaxHeight + 'px'
      });
      // 设置二级菜单项的样式
      $menu.find('.fallmenu-a__secondlevel').css({
        'fontSize': opt.subMenuFontSize + 'px',
        'height': opt.subMenuItemHeight + 'px',
        'lineHeight': opt.subMenuItemHeight + 'px',
        'backgroundColor': opt.subMenuPanelColor
      });
      // 设置二级菜单连接线颜色
      $menu.find('.fallmenu-line').css({
        'backgroundColor': opt.subMenuPanelColor
      });
       // 设置三级菜单的样式
      $menu.find('.fallmenu-box__thirdlevel').css({
        'width': '1px',
        'height': '0px',
        'maxHeight': opt.subMenuMaxHeight + 'px',
        'backgroundColor': opt.subMenuPanelColor
      });
      // 设置三级菜单项样式
      $menu.find('.fallmenu-a__thirdlevel').css({
        'fontSize': opt.subMenuFontSize + 'px',
        'height': opt.subMenuItemHeight + 'px',
        'lineHeight': opt.subMenuItemHeight + 'px'
      });
      // 一级菜单更多图标的高度位置
      $menu.find('.fallmenu-a__firstlevel .fallmenu-morebox').css({
        'top': opt.moreMenuIconBoxTop + 'px'
      }).find('.fallmenu-more').css({
        'top': opt.moreMenuIconTop + 'px'
      });
      // 二级菜单更多图标的高度位置
      $menu.find('.fallmenu-a__secondlevel .fallmenu-morebox').css({
        'top': opt.secondMoreMenuIconBoxTop + 'px'
      }).find('.fallmenu-more').css({
        'top': opt.secondMoreMenuIconTop + 'px'
      });
      // *************************************初始化结束***************************************

      // 一级菜单移入/移出效果
      $menu.find('.fallmenu-item__firstlevel').hover(function () { // 移入菜单效果
        $(this).css({
          'backgroundColor': opt.activeMenuItemColor
        });
        // 二级菜单
        var $subMenu = $(this).find('.fallmenu-box__secondlevel');
        if (!$subMenu.size()) {
          return false;
        }
        var $subMenuItems = $subMenu.find('.fallmenu-a__secondlevel');
        var subMenu = calcMenuWidthAndHeight($subMenuItems, opt.subMenuFontSize, opt.subMenuItemHeight, opt.subMenuMaxHeight);
        // 菜单项的宽度
        var menuItemWidth = $(this).width();
        // 拉环图标
        var $firstLevelKnocker = $(this).find('.fallmenu-a__firstlevel .fallmenu-knocker');
        runKnockerDown($firstLevelKnocker, opt.moreMenuIconTop, opt.moreMenuMoveDistance, function () {
          showSubMenu($subMenu, menuItemWidth, opt.menuHeight, subMenu.width, subMenu.height);
        });
      }, function () { // 移出菜单效果
        $(this).css({
          'backgroundColor': ''
        });
        // 子菜单
        var $subMenu = $(this).find('.fallmenu-box__secondlevel');
        if (!$subMenu.size()) {
          return false;
        }
        // 图标移动到初始位置
        $(this).find('.fallmenu-a__firstlevel .fallmenu-knocker').stop().animate({
          'top': opt.moreMenuIconTop + 'px'
        });
        var $subMenuItems = $subMenu.find('.fallmenu-item__secondlevel');
        var menuItemWidth = $(this).width();
        hideThirdMenu($subMenu, $subMenuItems, $subMenu, $needHiddenMenus, menuItemWidth, 
                0, 0);
        // 拉环还原
        runKnockerUp($subMenuItems.find('.fallmenu-knocker'), opt.secondMoreMenuIconTop);
      });

      // 二级菜单的移入/移出效果
      $menu.find('.fallmenu-a__secondlevel').hover(function () {
        $(this).css({
          'backgroundColor': opt.activeSubMenuItemColor
        });
      }, function () {
        $(this).css({
          'backgroundColor': opt.subMenuPanelColor
        });
      });

      // 二级菜单的点击效果
      var ableToggleSecondLevelMenu = true;
      // 需要隐藏的二级菜单
      var $needHiddenMenus = $('');
      var wholeHeight = 0;
      var menuScrollTop = 0;
      $menu.find('.fallmenu-a__secondlevel').click(function () {
        // 二级菜单项
        var $secondMenuItem = $(this).parent();
        var $secondMenu = $secondMenuItem.parent();
        // 三级菜单
        var $thirdMenu = $secondMenuItem.find('.fallmenu-box__thirdlevel');
        if ($thirdMenu.size()) {
          // 拉环图标
          var $secondLevelKnocker = $secondMenuItem.find('.fallmenu-a__secondlevel .fallmenu-knocker');
          // 菜单项的宽度，如果有滚动条，算上滚动条
          // var menuItemWidth = $(this).width();
          var menuItemWidth = $secondMenu.width();
          if ($thirdMenu.height() === 0) { // 当三级菜单隐藏时
            var $thirdMenuItems = $thirdMenu.find('.fallmenu-a__thirdlevel');
            var thirdMenu = calcMenuWidthAndHeight($thirdMenuItems, opt.subMenuFontSize, opt.subMenuItemHeight, opt.subMenuMaxHeight);
            var thirdIndex = $secondMenuItem.index();
            runKnockerDown($secondLevelKnocker, opt.secondMoreMenuIconTop, opt.moreMenuMoveDistance, function () {
              // 计算滚动条滑上去的距离
              menuScrollTop = $secondMenu.scrollTop();
              wholeHeight = $secondMenu.height();
              // 二级菜单连接线高度
              var menuLineHeight = opt.subMenuItemHeight * (thirdIndex - 1) - menuScrollTop;
              // 如果有滚动条先隐藏
              $secondMenu.css({
                'overflowX': 'hidden',
                'overflowY': 'hidden'
              })
              // 二级菜单高度变换到点击菜单项的高度
              $secondMenu.animate({
                'height': menuLineHeight + opt.subMenuItemHeight + 'px'
              }, 'fast', 'swing', function () {
                // 查询该菜单项其他的所有二级菜单，隐藏
                $needHiddenMenus = $secondMenuItem.siblings('.fallmenu-item__secondlevel');
                $needHiddenMenus.hide();
                $(this).css({
                  'overflowX': 'visible',
                  'overflowY': 'visible'
                });
                // 连接线变换
                $secondMenu.find('.fallmenu-line:first').css({
                  'width': menuItemWidth + 'px',
                  'height': menuLineHeight + 'px'
                }).animate({
                  'width': '1px'
                }, 'fast', 'swing', function () {
                  // 显示三级菜单
                  showSubMenu($thirdMenu, menuItemWidth, opt.subMenuItemHeight, thirdMenu.width, thirdMenu.height);
                });
              });
            });
          } else {
            // $(this).find('.fallmenu-a__firstlevel .fallmenu-knocker').stop().animate({
            //   'top': opt.moreMenuIconTop + 'px'
            // });

            runKnockerUp($secondLevelKnocker, opt.secondMoreMenuIconTop, function () {
              hideThirdMenu($secondMenu, $secondMenuItem, $thirdMenu, $needHiddenMenus, menuItemWidth, 
                wholeHeight, menuScrollTop)
            });
          }
        }
      });

      // 三级菜单的移入/移出效果
      $menu.find('.fallmenu-a__thirdlevel').hover(function () {
        $(this).css({
          'backgroundColor': opt.activeSubMenuItemColor
        });
      }, function () {
        $(this).css({
          'backgroundColor': opt.subMenuPanelColor
        });
      })

      // 下一页菜单点击效果
      var ableTurnPageMenu = true;
      $menu.find('.fallmenu-knocker__large').click(function () {
        if (!ableTurnPageMenu) {
          return false;
        }
        ableTurnPageMenu = false;
        // 下一页菜单效果
        $(this).stop().animate({
          'marginTop': 0
        }, 'fast').animate({
          'marginTop': '-15px'
        }, function () {
          // 设置菜单栏溢出隐藏
          $menu.css({
            'overflow': 'hidden'
          });
          // 当前菜单栏
          var $currentMenuPanel = $menu.find('.fallmenu-box__current');
          // 下一页菜单栏
          var $nextMenuPanel = $currentMenuPanel.prev();
          // 移动下一页菜单栏
          $nextMenuPanel.show().css({
            'marginTop': - opt.menuHeight + 'px'
          }).animate({
            'marginTop': 0,
            'backgroundColor': opt.menuPanelColor
          }, function () {
            // 隐藏移动到下方的菜单栏
            $currentMenuPanel.removeClass('fallmenu-box__current').hide().css({
              'backgroundColor': opt.hiddenMenuPanelColor
            });
            $nextMenuPanel.addClass('fallmenu-box__current');
            $menu.css({
              'overflow': 'visible'
            });
            // 判断上方是否还有菜单栏，如果没有，则将下方的菜单栏整体移动到上方
            if (!$nextMenuPanel.prev().size()) {
              $nextMenuPanel.siblings('.fallmenu-box').insertBefore($nextMenuPanel);
            }
            ableTurnPageMenu = true;
          });
          // 鼠标是否在翻页拉环上，如果不在，则拉环回复原始状态
          if (!isMousehoverPageMenu) {
            $(this).animate({
              'marginTop': '-10px'
            });
          }
        });
      });

      // 下一页菜单的悬浮效果
      var isMousehoverPageMenu = false;
      $menu.find('.fallmenu-knocker__large').hover(function () {
        isMousehoverPageMenu = true;
        if (ableTurnPageMenu) {
          $(this).stop().animate({
            'marginTop': '-15px'
          });
        }
      }, function () {
        isMousehoverPageMenu = false;
        if (ableTurnPageMenu) {
          $(this).stop().animate({
            'marginTop': '-10px'
          });
        }
      });
    });
  }

  /** 构造节点 **/
  function constructDoms($root, data, opt) {
    // 计算去掉分页按钮后菜单栏总长度
    var menuWidth = $root.width() - 70;
    var currentMenusWidth = 0;
    var $firstLevelBox, $firstLevelItem, $firstLevelA;
    var $secondLevelBox, $secondLevelItem, $secondLevelA;
    $firstLevelBox = $('<dl class="fallmenu-box fallmenu-box__firstlevel fallmenu-box__current"></dl>');
    $root.prepend($firstLevelBox);
    var startIndex = 0;
    var finishIndex = 0;
    var hasNextPage = false;
    for (var i = 0; i < data.length; i++) {
      var firstLevelMenu = data[i];
      var textLength = covertToZhTextLength(firstLevelMenu.title);
      // 菜单项的宽度
      var menuItemWidth = textLength * opt.menuFontSize + opt.menuPadding * 2;
      // 当前菜单累加宽度
      currentMenusWidth += menuItemWidth;
      // 如果加上当前菜单宽度，长度超长，则放到下一页的菜单中
      if (currentMenusWidth > menuWidth) {
        finishIndex = i;
        constructItem(data.slice(startIndex, finishIndex), $firstLevelBox, opt);
        startIndex = finishIndex;
        $firstLevelBox = $('<dl class="fallmenu-box fallmenu-box__firstlevel"></dl>');
        $root.prepend($firstLevelBox);
        currentMenusWidth = menuItemWidth;
        hasNextPage = true;
      }
    }
    constructItem(data.slice(startIndex), $firstLevelBox, opt);
    $root.children().each(function () {
      $(this).append('<dd class="fallmenu-item__end"></dd>')
    });
    if (hasNextPage) {
      $root.append('<div class="fallmenu-page"><i class="fallmenu-knocker__large"></i></div>');
    }
  }

  /** 递归添加菜单项 **/
  function constructItem(data, $box, opt) {
    for (var i = 0; i < data.length; i++) {
      var firstData = data[i];
      var $item = $('<dd class="fallmenu-item fallmenu-item__' + firstData.level + 'level"></dd>');
      // 标题
      var $a = $('<a href="javascript:;" class="fallmenu-a fallmenu-a__' + firstData.level + 'level">' + firstData.title + '</a>');
      bindClick($a, firstData, opt);
      // 判断是否有下级菜单
      if (firstData.children && firstData.children.length) {
        // 加上更多图标
        $a.append('<div class="fallmenu-morebox"><i class="fallmenu-more fallmenu-knocker"></i></div>');
        var $secondLevelBox = $('<dl class="fallmenu-box fallmenu-box__' + firstData.children[0].level + 'level"></dl>');
        $secondLevelBox.append('<dt class="fallmenu-line"></dt>');
        constructItem(firstData.children, $secondLevelBox, opt);
        $item.append($secondLevelBox);
      }
      $item.append($a);
      $box.append($item);
    }
  }

  /** 计算子菜单的宽度与高度 **/
  function calcMenuWidthAndHeight($items, subMenuFontSize, subMenuItemHeight, subMenuMaxHeight) {
    // 最大文字长度
    var maxTextLength = 0;
    var subMenuHeight = 0;
    // 滚动条宽度
    var scrollWidth = 20;
    $items.each(function (index, element) {
      // var wholeText = $(this).text().replace(/^\s*/g, '').replace(/\s*$/g, '');
      // // 去掉中文后的字符串
      // var noChineseText = wholeText.replace(/[\u4E00-\u9FA5]/g, '');
      // // 中文字符串的长度
      // var chineseTextLength = wholeText.length - noChineseText.length;
      // // 换算成中文后的字符串总长度，比例为目测得出，ie8下可能会有少许出入
      // var textLength = chineseTextLength + noChineseText.length / 20 * 11;
      var textLength = covertToZhTextLength($(this).text());
      // 如果有更多图标，则固定添加一个字长度
      if ($(this).find('.fallmenu-more').size()) {
        textLength++;
      }
      if (textLength > maxTextLength) {
        maxTextLength = textLength;
      }
      // 高度累加
      subMenuHeight += subMenuItemHeight;
    });
    // 计算子菜单的宽度，左右两边各半个字的宽度，所以最后加一
    var subMenuWidth = subMenuFontSize * (maxTextLength + 1);
    // 判断是否会出现滚动条，如果出现，则加上滚动条的宽度
    if (subMenuHeight > subMenuMaxHeight) {
      subMenuWidth += scrollWidth;
    }
    return {
      'width': subMenuWidth,
      'height': subMenuHeight
    }
  }

  /** 转化为中文后的字体长度 **/
  function covertToZhTextLength(text) {
    var wholeText = text.replace(/^\s*/g, '').replace(/\s*$/g, '');
    // 去掉中文后的字符串
    var noChineseText = wholeText.replace(/[\u4E00-\u9FA5]/g, '');
    // 中文字符串的长度
    var chineseTextLength = wholeText.length - noChineseText.length;
    // 换算成中文后的字符串总长度，比例为目测得出，ie8下可能会有少许出入
    var textLength = chineseTextLength + noChineseText.length / 20 * 11;
    return textLength;
  }

  /** 拉环上升与下降效果 **/
  function runKnocker($knocker, top, distance, afterRun) {
    // 移动到下拉位置
    $knocker.stop().animate({
      'top': top + distance + 'px'
    }, 'fast', 'swing', function () {
      // 恢复到初始位置
      $(this).animate({
        'top': top + 'px'
      }, 'fast', 'swing', function () {
        // 子菜单恢复初始位置后开始动画
        if (typeof afterRun === 'function') {
          afterRun()
        }
      });
    });
  }

  /** 拉环下降效果 **/
  function runKnockerDown($knocker, top, distance, afterRun) {
    // 移动到下拉位置
    $knocker.stop().animate({
      'top': top + distance + 'px'
    }, 'fast', 'swing', function () {
      if (typeof afterRun === 'function') {
        afterRun()
      }
    });
  }

  /** 拉环上升效果 **/
  function runKnockerUp($knocker, top, afterRun) {
    // 移动到下拉位置
    $knocker.stop().animate({
      'top': top + 'px'
    }, 'fast', 'swing', function () {
      if (typeof afterRun === 'function') {
        afterRun()
      }
    });
  }

  /** 显示子菜单 **/
  function showSubMenu($subMenu, menuItemWidth, menuItemHeight, subMenuWidth, subMenuHeight) {
    // 子菜单初始状态
    $subMenu.scrollTop(0);
    $subMenu.stop().css({
      'width': '1px',
      'height': '0px',
      'top': menuItemHeight + 'px',
      'left': menuItemWidth / 2 + 'px',
      'overflowX': 'hidden',
      'overflowY': 'hidden'
    }).animate({
      'height': subMenuHeight + 'px'
    }, 'fast', 'swing', function () {
      // 垂直方向位置到达后执行水平方向变换
      $(this).animate({
        'width': subMenuWidth + 'px',
        'left': (menuItemWidth - subMenuWidth) / 2 + 'px'
      }, 'fast', 'swing', function () {
        // 滚动条设置
        $(this).css({
          'overflowX': 'hidden',
          'overflowY': 'auto'
        })
      });
    });
  }

  /** 隐藏子菜单 **/
  function hideSubMenu($subMenu, menuItemWidth, afterHide) {
    $subMenu.stop().show().css({
      'overflowY': 'hidden'
    }).animate({
      'width': '1px',
      'left': menuItemWidth / 2 + 'px'
    }, 'fast', 'swing', function () {
      // 水平方向位置到达后执行垂直方向变换
      $(this).scrollTop(0);
      $(this).animate({
        'height': '0px'
      }, 'fast', 'swing', function () {
        // 隐藏子菜单下的所有子菜单
        $(this).find('.fallmenu-box').css({
          'height': '0px'
        })
        if (typeof afterHide === 'function') {
          afterHide()
        }
      });
    });
  }

  /** 隐藏三级菜单 **/
  function hideThirdMenu($secondMenu, $secondMenuItem, $thirdMenu, $needHiddenMenus, menuItemWidth, 
    wholeHeight, menuScrollTop) {
    hideSubMenu($thirdMenu, menuItemWidth, function () {
      if ($secondMenu == $thirdMenu) { // 隐藏二、三级菜单
        // 隐藏连接线
        $secondMenu.find('.fallmenu-line:first').css({
          'height': '0px'
        });
        // 二级菜单还原
        $secondMenu.css({
          'overflowX': 'hidden',
          'overflowY': 'auto'
        });
        // 显示隐藏的二级菜单
        $needHiddenMenus.show();
      } else { // 隐藏三级菜单，还原二级菜单
        // 连接线变换到二级菜单宽度
        $secondMenu.find('.fallmenu-line:first').animate({
          'width': menuItemWidth + 'px'
        }, 'fast', 'swing', function () {
          // 二级菜单还原
          $secondMenu.css({
            'height': wholeHeight + 'px',
            'overflowX': 'hidden',
            'overflowY': 'auto'
          });
          // 显示隐藏的二级菜单
          $needHiddenMenus.show();
          // 隐藏连接线
          $(this).css({
            'height': '0px'
          });
          // 二级菜单滚动条滚动到之前的位置
          // $secondMenu.scrollTop(menuScrollTop);
        });
      }
    });
  }

  /** 绑定菜单的点击事件 **/
  function bindClick($dom, data, opt) {
    $dom.click(function (e) {
      opt.clickMenu(data, e);
    });
  }
}));