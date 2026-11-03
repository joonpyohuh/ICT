$(document).ready(function () {

	App.BoardCommon.init();

	//검색영역 셀렉트박스
	//App.BoardSelectBox.init();

	//FAQ list
	App.BoardFaqTab.init();

	//캘린더(주간) 목록 열기
	App.calendarList.init();

	// popup board list file
	$('.btn-popup-file').on('click', function(e) {
		e.stopPropagation();
		$('.js-popup-file').fadeOut(100);
		$(this).next('.js-popup-file').fadeIn(100);

	});
	$('.js-popup-file > div').on('click', function(e) { // 영역 외 클릭시 닫기 이벤트 버블링 막기
		e.stopPropagation();
	});
	$(document).on('click', function(e) {
		$('.js-popup-file').fadeOut(100);
	});

	//일반_썸네일 list  object-fit : IE대응
	if($(document).find('.bn-list-thumb01 .b-img-box > a').length > 0){
		var commonThumb = new App.ObjectFit();
		commonThumb.init('.bn-list-thumb01 .b-img-box > a');
	}
	//일반_이미지 list  object-fit : IE대응
	if($(document).find('.bn-list-img01 .b-img-box > a').length > 0){
		var commonImg = new App.ObjectFit();
		commonImg.init('.bn-list-img01 .b-img-box > a');
	}	
	//식당 list object-fit : IE대응
	if($(document).find('.bn-list-img02 .b-img-box > a').length > 0){
		var commonImg = new App.ObjectFit();
		commonImg.init('.bn-list-img02 .b-img-box > a');
	}	
	//식당 view object-fit : IE대응
	if($(document).find('.bn-view-menu01 .b-img-box').length > 0){
		var restaurnatImg = new App.ObjectFit();
		restaurnatImg.init('.bn-view-menu01 .b-img-box');
	}
/*	//통합검색 object-fit : IE대응
	if($(document).find('.b-sch-ul-type03 .b-img-box a').length > 0){
		var personList = App.ObjectFit();
		personList.init('.b-sch-ul-type03 .b-img-box a');
	}

	//통합검색 object-fit : IE대응
	if($(document).find('.b-sch-ul-type04 .b-img-box a').length > 0){
		var personList = App.ObjectFit();
		personList.init('.b-sch-ul-type03 .b-img-box a');
	}
	*/

	//모바일 셀렉트박스
	App.MoSelBox.init();

	// 규정집 lnb
	App.Lnb.init();
	
});

//======================================================================
//Board Common
//======================================================================
App.BoardCommon = function () {
	var self;
	return {
		init: function () {
			self = this;
			//window popup
			$(document).on('click', '.b-open-pop', function(e){
				e.preventDefault();
				var popUrl = $(this).attr('href');
				window.open(popUrl, 'popup', 'width=1000,height=780,scrollbars=yes');
			});
			
			$('.b-pop-close-btn').click(function(){
				window.close();
			});
			//layer-popup
			$('.b-btn-popup').on('click', function(e) {
				e.stopPropagation();
				$('.b-js-popup').fadeOut(100);
				$(this).next('.b-js-popup').fadeIn(100);
				$('body').addClass('all-fixed');
			});
			$('.b-js-popup > div').on('click', function(e) { // 영역 외 클릭시 닫기 이벤트 버블링 막기
				e.stopPropagation();
			});
			$(document).on('click', function(e) {
				$('.b-js-popup').fadeOut(100);
				$('body').removeClass('all-fixed');
			});
			$('.b-btn-popup-close').on('click', function(e) {
				$('.b-js-popup').fadeOut(100);
				$('body').removeClass('all-fixed');
			});

			// 통합검색 : 검색옵션 표시/숨김 셀렉박스 - search-user.js 에서 소스가 중복되어서 주석처리
		/*	$('.b-option-box > a').on('click', function() {
				$('.bottom-box').toggleClass('active');
				$(this).parent().toggleClass('active')
			});

			$('.b-option-box').each(function () {
				var $thisBox = $(this);
				$(document).mouseup(function (e) {
					if ($thisBox.has(e.target).length === 0) {
						$thisBox.removeClass("active");
					}
				});
			});
*/
			// 통합검색 : 정렬 기준 셀렉박스
			$('.b-search-wrap .bottom-box > div > a').on('click', function() {
				if(!$(this).parent().hasClass('active')) { // 열기
					$('.b-search-wrap .bottom-box > div').removeClass('active');
					$(this).parent('div').addClass('active');
				} else { // 닫기
					$('.b-search-wrap .bottom-box > div').removeClass('active');
				}
			});

			$('.b-search-wrap .bottom-box > div').each(function () {
				var $thisBox = $(this);
				$(document).mouseup(function (e) {
					if ($thisBox.has(e.target).length === 0) {
						$thisBox.removeClass("active");
					}
				});
			});

			// 통합검색 우측 영역 탭박스
			$('.b-keyword-tab-box > li').each(function() {
				$(this).find('a').on('click', function() {
					var idx = $(this).parent().index();

					if($(this).parents('.b-keyword-tab-box').hasClass('type01')) {
						$(this).parents('.b-box').find('.b-topic-box').hide();
						$(this).parents('.b-box').find('.b-topic-box').eq(idx).show();
					} else if($(this).parents('.b-keyword-tab-box').hasClass('type02')) {
						$(this).parents('.b-box').find('.b-word-box').hide();
						$(this).parents('.b-box').find('.b-word-box').eq(idx).show();
					}
					$(this).parent().siblings().removeClass('active');
					$(this).parent('li').addClass('active');
				});
			});

			//통합검색 검색어 자동완성 search-user.js 에서 소스가 중복되어서 주석처리
			/*$('.btn-search-auto').click(function(){
				$(this).toggleClass('active');
				$('.b-search-auto-box').toggleClass('active');
			});*/
		}
	}
}();
//------------------------------------------------------
//BoardSelectBox
//------------------------------------------------------
/*
App.BoardSelectBox = function () {
	var self;
	var $box;
	return {
		init: function () {
			self = this;
			$box = $(".b-sel-box");

			$box.each(function () {
				var $thisBox = $(this);
				$thisBox.click(self.onClick);

				$(document).mouseup(function (e) {
					if ($thisBox.has(e.target).length === 0) {
						$thisBox.removeClass("close");
					}
				});
			});

		},
		onClick: function () {
			if ($(this).find("ul").is(":hidden")) {
				$(this).addClass("close");
			} else if ($(this).find("ul").is(":visible")) {
				$(this).removeClass("close");
			}

			$(this).mouseleave(function () {
				$(this).removeClass("close");
			});
		}
	}
}();
*/
//------------------------------------------------------
//object-fit(IE)
//------------------------------------------------------
App.ObjectFit = function () {
	var self;
	return {
		init: function (param) {
			if ('objectFit' in document.documentElement.style === false) {
				var container = document.querySelectorAll(param);
				for (var i = 0; i < container.length; i++) {
					var imageSource = container[i].querySelector('img').src;
					container[i].querySelector('img').style.display = 'none';
					container[i].style.backgroundSize = 'cover';
					container[i].style.backgroundImage = 'url(' + imageSource + ')';
					container[i].style.backgroundPosition = '50% 0';
				}
			}
		}
	}
};

//------------------------------------------------------
//FAQ-list
//------------------------------------------------------ 
App.BoardFaqTab = function(){
	var self;
	var $item, $dest, $dv;
	return {
		init: function(){
			self = this;

			$(".bn-list-faq01 .b-title-box").find(".b-title").click(self.onClick); 
			$(".bn-list-faq01").find(".b-btn-faq").click(self.onClick); 

			if($('.bn-list-faq01').length > 0) {

				var colNum = $('.bn-list-faq01').find('.b-ans-box .b-td-left').attr('colspan');

				if($(window).width() <= 768) {
					$('.bn-list-faq01').find('.b-ans-box .b-td-left').attr('colspan', '1');
				}

				$(window).on('resize', function() {
					if($(window).width() <= 768) {
						$('.bn-list-faq01').find('.b-ans-box .b-td-left').attr('colspan', '1');
					} else {
						$('.bn-list-faq01').find('.b-ans-box .b-td-left').attr('colspan', colNum);
					}
				});
			}

		},
		onClick: function(){
			$item = $(this).parents(".b-quest-box");

			if ($item.next(".b-ans-box").find('td > div').is(":hidden")) {
				$(".bn-list-faq01").find(".b-ans-box td > div").slideUp();
				$item.next(".b-ans-box").find('td > div').slideDown();
				$(".b-quest-box").removeClass("active");
				$item.addClass("active");
				$(".b-ans-box").removeClass("active");
				$item.next(".b-ans-box").addClass("active");

			} else if ($item.next(".b-ans-box").find('td > div').is(":visible")) {
				$item.next(".b-ans-box").find('td > div').slideUp();
				$item.removeClass("active");
				$(".b-ans-box").removeClass("active");
			}

		}
	}
}();
//------------------------------------------------------
//calendarList (캘린더(주간) 목록 열기)
//------------------------------------------------------ 
App.calendarList = function () {
	var first, second, third, sumHeight;
	return {
		init: function () {

			$('.b-cal-list-box > div').each(function(){
				if($(this).children('.b-cal-content-box').find('> div > div > div').length > 3){
					var first = $(this).children('.b-cal-content-box').find('> div > div > div:eq(1)').innerHeight();
					var second = $(this).children('.b-cal-content-box').find('> div > div > div:eq(2)').innerHeight();
					var third = $(this).children('.b-cal-content-box').find('> div > div > div:eq(3)').innerHeight();
					var sumHeight = first + second + third
					var conHeight = $(this).children('.b-cal-content-box').find('> div > div').innerHeight();

					$(this).children('.b-more-cal-box').show();
					$(this).children('.b-cal-content-box').css({height: sumHeight + 'px'});
					$(this).children('.b-more-cal-box').find('.b-btn-more-cal').each(function () {
						$(this).click(function () {

							if (!$(this).parent().prev('.b-cal-content-box').hasClass('on')) {
								$(this).addClass('active');
								$(this).parent().prev('.b-cal-content-box').css({
									height: 'auto'
								});
								$(this).parent().prev('.b-cal-content-box').addClass('on');
							} else {

								$(this).removeClass('active');
								$(this).parent().prev('.b-cal-content-box').css({
									height: sumHeight + 'px'
								});
								$(this).parent().prev('.b-cal-content-box').removeClass('on');
							}

						});
					});

				}else{
					$(this).children('.b-more-cal-box').hide();
					$(this).children('.b-cal-content-box').css({height: conHeight + 'px'});
					$(this).children('.b-cal-content-box').addClass('no-list');

				}
				$(window).resize(function () {
					$('.b-cal-list-box > div').each(function(){
						if($(this).children('.b-cal-content-box').find('> div > div > div').length > 3){
							var first = $('.b-cal-content-box > div > div > div:eq(1)').innerHeight();
							var second = $('.b-cal-content-box > div > div > div:eq(2)').innerHeight();
							var third = $('.b-cal-content-box > div > div > div:eq(3)').innerHeight();
							var sumHeight = first + second + third
							var conHeight = $(this).children('.b-cal-content-box').find('> div > div').innerHeight();
							if ($(this).children('.b-cal-content-box').hasClass('on')) {
								$(this).children('.b-cal-content-box').css({height: 'auto'});
							} else {
								$(this).children('.b-cal-content-box').css({height: sumHeight + 'px'});
							}
							$(this).children('.b-more-cal-box').find('.b-btn-more-cal').each(function () {
								$(this).click(function () {
									if ($(this).parent().prev('.b-cal-content-box').hasClass('on')) {
										$(this).parent().prev('.b-cal-content-box').css({
											height: 'auto'
										});
									} else {
										$(this).parent().prev('.b-cal-content-box').css({
											height: sumHeight + 'px'
										});
									}
								});
							});
						}else{
							$(this).children('.b-cal-content-box').css({height: conHeight + 'px'});
						}
					});
				});
			});
		}
	}
}();
//======================================================================
//Mobile Select Box
//======================================================================
/*App.MoSelBox = function () {
	var self;
	var select, mcenter;
	return {
		init: function () {
			self = this;
				
			//모바일 셀렉트 박스(선택시 label text 변경)
			select = $('.b-tab-sel, .sel-category');
			
			console.log($(select));
			mcenter = $('.b-m-tab-box > label, .b-category01-m > label, .b-search-box01 div > label');
			$(".b-m-tab-box, .b-category01-m, .b-search-box01 div").click(function(){
				$(this).toggleClass('active');
				select.change(function(){
					var select_name = $(this).children('option:selected').text();
					$(this).siblings('label').text(select_name);            
					
					
				});
			});
		},
		
		
		
	}
}();*/
App.MoSelBox = function () {
	var self;
	var select, mcenter;
	return {
		init: function () {
			self = this;
			
			// 모바일 셀렉트 박스(선택 시 label text 변경)
			select = $('.b-tab-sel, .sel-category');
			
			// 초기 설정: 현재 선택된 옵션의 텍스트를 라벨에 설정
			select.each(function() {
				var selectedOptionText = $(this).children('option:selected').text();
				$(this).siblings('label').text(selectedOptionText);
			});
			
			mcenter = $('.b-m-tab-box > label, .b-category01-m > label, .b-search-box01 div > label');
			$(".b-m-tab-box, .b-category01-m, .b-search-box01 div").click(function(){
				$(this).toggleClass('active');
			});
		},
	}
}();

//======================================================================
//Lnb
//======================================================================
App.Lnb = function(){
	var self;

	return {
		init: function(){
			self = this;

			// 규칙집 LNB
			if($('.b-rule-category').length > 0) $('.b-rule-cate-box ul > li > a.active').addClass('on');

			$('.b-rule-cate-box ul > li').each(function() {
				if($(this).find('> ul').length > 0) {
					$(this).find('> a').click(function(e) {
						e.preventDefault();
						$(this).toggleClass('on');
						$(this).next().slideToggle();
					});
				}
			});

		}
	}
}();