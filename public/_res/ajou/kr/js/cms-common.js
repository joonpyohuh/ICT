$(document).ready(function () {
	App.headerFixed.init();
	setTimeout(function () {
		$('html').removeClass('no-js');
	}, 10);	

	App.Common.init();
	App.SelectBoxPath.init();
	App.SelectBoxMenu.init();

	if($(document).find('.gnb-ul').length > 0){
		App.MainGnb.init();
	}

	if($(document).find('.scrollbox').length > 0){
		App.TableScroll.init();
	};

	// 아주소개 > 역사
	if ($(document).find('.history-box').length > 0) {
		var hisCarousel = new App.CarouselModule();
		hisCarousel.init({
			name: '.history-box',
			carouselOption: {
				loop: true,
				nav: false,
				dots: true,
				items: 1,
				autoplay: true,
				autoplayTimeout: 8000,
				ctrlVer:"offset",
				ctrlPoint:"last"
			}
		});

	}	

	// 아주소개 > 역사 이미지 object-fit : IE대응
	if ($(document).find('.history-box .his-img-box').length > 0) {
		var hisImg = new App.ObjectFit();
		hisImg.init('.history-box .his-img-box');
	}

	// 입학 > 대학원 object-fit : IE대응
	if ($(document).find('.edu-box .ad-img-box').length > 0) {
		var eduImg = new App.ObjectFit();
		eduImg.init('.edu-box .ad-img-box');
	}


	// 연구자검색 제외하고 게시판 검색은 전체 제외
	if( CMS.menuCd != 724 ) { 
		$(".b-sel-box.b-cate-basic a.b-sel-title").text("제목");
		if($(document).find('.phone-search .b-sel-box.b-cate-basic a.b-sel-title').length>0){
			$(".b-sel-box.b-cate-basic a.b-sel-title").text("이름");
		}
	}

});

//======================================================================
//headerFixed
//======================================================================
App.headerFixed = function(){
	return {
		init: function(){
			const HEADER = $("header");
			const HEADERHEIGHT = $(HEADER).height();
			$(document).on("scroll", function(){
				const scrollValue = $(document).scrollTop();
				if(HEADERHEIGHT < scrollValue) {
					HEADER.addClass('fixed');
				}
				else {
					HEADER.removeClass('fixed');
				}
			});

		}
	}
}();

//======================================================================
//Common
//======================================================================
App.Common = function(){
	var self;
	var flag;
	var curUrl;

	return {
		init: function(){
			self = this;

			// 언어 선택
			$('.btn-lang').on('click', function() {
				$(this).toggleClass('active');
				$('.lang-box').slideToggle();
			});
			$('header').on('mouseleave', self.closeLangbox);
			$('.lang-box li a').on('click', self.closeLangbox);

			//scroll top button
			$('.btn-scroll-top').click(function(){
				$('html, body').stop().animate({scrollTop: 0}, 500);
			});

			// gnb 현재페이지 표시
			if ($('.gnb').find('a.active').length > 0) {
				$('.gnb').find('a.active').each(function() {
					$('.gnb-ul > li > a').removeClass();
					$(this).parents('.gnb-ul > li').find(' > a').addClass('current');
				});
			}

			//메뉴 연동 select box - selected 처리
			$(document).find(".tab-sel option[value='" + window.location.pathname + "']").prop("selected", true);

			// header search
			flag = 1;

			$('.top-header-box .search-wrap .sch-btn').on('click', function(){
				$('.top-header-box .search-wrap .sch-btn').addClass('on');
				setTimeout(function(){
					$('.top-header-box .search-wrap .sch-btn').stop().attr({type: 'submit'});
				}, 100);
				$('.top-header-box .search-wrap input').show();
				$('.top-header-box .search-wrap input').on('click', function(){
					flag = 2;
				});
			});
			$('.top-header-box .search-wrap').on('mouseleave', function(){
				if(flag == 1){
					$('.top-header-box .search-wrap .sch-btn').stop().attr({type: 'button'}).removeClass('on');
					$('.top-header-box .search-wrap input').hide().val('');
				}else{
					$('.top-header-box .search-wrap input').blur(function(){
						setTimeout(function(){
							$('.top-header-box .search-wrap .sch-btn').stop().attr({type: 'button'}).removeClass('on');
							$('.top-header-box .search-wrap input').hide().val('');
						}, 100);
						flag = 1;
					});
				}
			});

			// 모바일 검색 header search (Mobile)
			$('.btn-sch-open').on('click', function() {
				if($('.btn-menu').hasClass('active')) $('.btn-menu').trigger('click');
				if(!$('.btn-sch-open').hasClass('active')) {
					$('.btn-sch-open').addClass('active');
					$('.bottom-header-wrap .search-wrap').css({'display': 'block'}).animate({'left': '0'}, 300);
				}
				else {
					$('.btn-sch-open').removeClass('active');
					$('.bottom-header-wrap .search-wrap').animate({'left': '100%'}, 300, function() {
						$(this).hide();
					});
				}
			});

			$(window).resize(function() {
				if($(window).width() > 1024) $('.bottom-header-wrap .search-wrap').hide();
			});

			// footer 관련사이트 팝업
			$('.btn-foot-link').on('click', function() {
				$(this).next().show();
				$(this).parent().siblings().find('.foot-link-box').hide();
			});
			$('.btn-foot-link-close').on('click', function() {
				$(this).parent().hide();
			});

			//scroll top button
			$('.btn-top').click(function(){
				$('html, body').stop().animate({scrollTop: 0}, 500);
			});

			// 예결산공고 회계연도 셀렉박스
			curUrl = window.location.pathname;
			$(".b-select-budget").find("option[value='" + curUrl + "']").attr("selected","selected");
			$(".b-select-budget").bind('change', function(){
				var url = $(this).val();
				if(url !=''){
					window.location = url;
				}
				return false;
			});

			//window popup
			$(document).on('click', '.open-pop', function(e){
				e.preventDefault();
				var popUrl = $(this).attr('href');
				window.open(popUrl, 'popup', 'width=1000,height=780,scrollbars=yes');
			});

			// layer-popup
			$('.btn-popup').on('click', function(e) {
				e.stopPropagation();
				$('.js-popup').fadeOut(100);
				$(this).next('.js-popup').fadeIn(100);
				$('body').addClass('all-fixed');
			});
			$('.js-popup > div').on('click', function(e) { // 영역 외 클릭시 닫기 이벤트 버블링 막기
				e.stopPropagation();
			});
			$(document).on('click', function(e) {
				$('.js-popup').fadeOut(100);
				$('body').removeClass('all-fixed');
			});
			$('.btn-popup-close').on('click', function(e) {
				$('.js-popup').fadeOut(100);
				$('body').removeClass('all-fixed');
			});

		},
		closeLangbox: function() {
			setTimeout(function() {
				$('.btn-lang').removeClass('active');
				$('.lang-box').slideUp();
			}, 100);
		}
	}
}();

//======================================================================
//MainGNB
//======================================================================
App.MainGnb = function () {
	var self, depth02Arr, maxLength, max, indexNum, maxHeight;
	var boxWidth, subMenuWidth, subMenuLeng, subMenuIdx, subMenuTitle;
	var subMenuCol2, subMenuCol2Leng, subMenuLeftNew, findLeng;
	var gnbH, gnbOffset, fixedH;
	return {
		init: function () {
			self = this;
			depth02Arr = new Array();

			self.setCol($('.gnb-ul > li > a'));

			$('.gnb-ul > li > a').on('click', function(e){ // 열기
				if (!$(this).parent().hasClass('active')) {
					$('.gnb-ul > li').find('.sub-mn-box').hide();
					$('.gnb-bg').css({height: 0});

					$('.gnb-ul > li').removeClass('active');
					$(this).parent('li').addClass('active');
					self.setPos($(this));
					self.onMouseOver($(this));
					var gnbThis = $(this);
					setTimeout(function(){
						self.setHeight(gnbThis);
					}, 250);
				} else { // 닫기
					self.onMouseLeave();
				}
			});

			$('.bottom-header-wrap').on('mouseleave', self.onMouseLeave);

			$('.gnb-ul > li:last-of-type .sub-mn-box .sub-mn > li:last-of-type > .sub-mn02 > li:last-of-type > a').on('focusout', self.onMouseLeave);


		},
		onMouseOver: function (param) {
			$('.gnb-bg').hide();
			param.parent('li').find('.sub-mn-box').stop(true, true).delay(100).slideDown(500);
			$('.gnb-bg').stop(true, true).slideDown(200);
		},
		onMouseLeave: function () {
			$('.gnb-ul > li').removeClass('active');
			$('.sub-mn-box, .gnb-bg').stop(true, true).delay(100).slideUp(200);
		},
		setCol: function (param) {
			// 3depth가 14개 이상인 메뉴 두 줄 처리
			param.parent('li').find('.sub-mn > li').each(function(){
				if($(this).find('.sub-mn02 > li').length >= 14) $(this).addClass('col02'); 
				if($(this).hasClass('col02')) {
					findLeng = Math.floor($(this).find('.sub-mn02 > li').length / 2);
					$(this).find('.sub-mn02').each(function() {
						$(this).parent().append('<ul class="sub-mn02"></ul>');
						for(var i = 0; i < findLeng; i++) {
							$(this).next().prepend($(this).find('> li').last(i));
						}
					});
				}
			});
		},
		setPos: function(param){
			boxWidth = $('.bottom-header-box .gnb-wrap').width();
			subMenuLeng = param.parent('li').find('.sub-mn > li').length;
			subMenuWidth = boxWidth / subMenuLeng;

			// 2depth 메뉴 위치값 조정
			param.parent('li').find('.sub-mn > li').each(function(){
				subMenuCol2 = $(this).parent().find('.col02').length;
				subMenuCol2Leng = param.parent('li').find('.sub-mn > li').length + subMenuCol2;
				subMenuWidth = 100 / subMenuCol2Leng;

				// width 설정
				if($(this).hasClass('col02')) { // col 2줄짜리 포함 : 2줄
					$(this).css({'width': subMenuWidth * 2 + '%'});	
				} else if ($(this).siblings().hasClass('col02') && !$(this).hasClass('col02')) { // col 2줄짜리 포함 : 1줄
					$(this).not('.col02').css({'width': subMenuWidth + '%'}); 
				} else if(!$(this).hasClass('col02') && !$(this).siblings().hasClass('col02')){ // col 2줄짜리가 포함되지 않을 경우
					$(this).css({'width': subMenuWidth + '%'});
				}

				// left 설정
				if($(this).prev().length > 0) {
					subMenuLeftNew = parseFloat($(this).prev().css('left')) + parseFloat($(this).prev().css('width'));
				} else {
					subMenuLeftNew = 0
				}
				$(this).css({'left': subMenuLeftNew + '%'});
			});	

			$(window).resize(function(){
				self.setPos(param);
			});
		},
		setHeight: function(param){
			depth02Arr = [];

			// 3depth 메뉴의 개수에 따라 gnb-bg 높이 변경
			param.parent('li').find('.sub-mn > li').each(function () {
				depth02Arr.push($(this).outerHeight());
			});

			maxLength = depth02Arr.reduce(function (previous, current) {
				return previous > current ? max = previous : max = current;
			});

			indexNum = jQuery.inArray(max, depth02Arr);

			maxHeight = param.parent('li').find('.sub-mn > li:eq(' + indexNum + ')').outerHeight();

			if(depth02Arr.length > 0){
				$('.gnb-bg').css({height: maxHeight + 90 + 'px'});
			}else{
				$('.gnb-bg').css({height: 0});
			}
		}
	}
}();

//------------------------------------------------------
//List 자동화
//------------------------------------------------------  
App.autoList = function () {
	var self, ulWidth, liArr, liSum, liNum, space, liOneSpace, autoOpt, remainder;
	return {
		init: function (opt) {
			autoOpt = opt;

			ulWidth = $(autoOpt.list).innerWidth();
			liArr = [];
			liSum = 0;
			liNum = $(autoOpt.list).children("li").length;

			$(autoOpt.list).children("li").each(function () {
				liArr.push($(this).find("a").innerWidth());
			});

			liArr.reduce(function (a, b) {
				result = a + b;
				return result;
			});

			liSum = result;

			if ((ulWidth - liSum) >= 0) {
				space = ulWidth - liSum;
			} else {
				space = 0;
				remainder = ulWidth - liSum;
				ulWidth = ulWidth + (-remainder);
			}

			if ((space / liNum) >= 0) {
				liOneSpace = space / liNum;
			} else {
				liOneSpace = 0;
			}

			if (autoOpt.endWidth == "center") {
				$(autoOpt.list).children("li").each(function () {
					$(this).css({
						width: (($(this).children("a").innerWidth() + liOneSpace) / ulWidth) * 100 + "%"
					});
				});
			} else if (autoOpt.endWidth == "end") {
				$(autoOpt.list).children("li").each(function () {
					$(this).not(":first-of-type, :last-of-type").css({
						width: (($(this).children("a").innerWidth() + liOneSpace + (liOneSpace / (liNum - 1))) / ulWidth) * 100 + "%"
					});
				});
				$(autoOpt.list).children("li:first-of-type").css({
					width: (($(autoOpt.list).children("li:first-of-type").children("a").innerWidth() + (liOneSpace / 2) + ((liOneSpace / (liNum - 1))) / 2) / ulWidth) * 100 + "%"
				});
				$(autoOpt.list).children("li:last-of-type").css({
					width: (($(autoOpt.list).children("li:last-of-type").children("a").innerWidth() + (liOneSpace / 2) + ((liOneSpace / (liNum - 1))) / 2) / ulWidth) * 100 + "%"
				});
			}

		}
	}
};

//-----------------------------------------------------------------------------------------
//select box(path)
//-----------------------------------------------------------------------------------------
App.SelectBoxPath = function () {
	var self;
	var $path;
	return {
		init: function () {
			self = this;

			$path = $(".path-box > ul > li");
			$path.each(function () {
				var $thisBox = $(this);
				$thisBox.find(".path-selected").click(self.onClick);

				$(document).click(function (e) {
					if ($thisBox.has(e.target).length === 0) {
						$(".path-selected").parent().removeClass("active");
						$(".path-depth").slideUp(200);
					}
				});

				$(window).resize(function() {
					$(".path-selected").parent().removeClass("active");
					$(".path-depth").slideUp(200);
				});

			});

		},
		onClick: function () {
			$(this).parents("li").siblings().find(".path-depth").hide();
			$(this).parents("li").find(".path-depth").slideDown(200);
			$(this).parents("li").siblings().removeClass("active");
			$(this).parents("li").addClass("active");

			return false;
		}
	}
}();

//======================================================================
//CarouselModule(ver.05)
//======================================================================
App.CarouselModule = function () {
	var self, opt;
	var offset, pos; //[정지/재생] 버튼 위치 설정(절대값/상대값)
	var $controlBtn; //[이전/다음] 컨트롤 버튼
	var $carouselWrap, $carouselBox; //owl carousel 선택자
	var resOptKey, resOptVal, resArr, resWinWidth, resResult, resMatch; //반응형 옵션
	return {
		init: function (param) { //모듈 옵션을 parameter로 받는다.
			self = this;
			opt = param;

			//owl carousel 선택자
			$carouselWrap = $(opt.name); //.carousel-wrap
			$carouselBox = $(opt.name).find('.owl-carousel'); //.owl-carousel
			$controlBtn = $(opt.name).find('.control-wrap > a'); //[이전/다음] 버튼

			//각각의 owl-carousel 실행
			$(opt.name).find('.owl-carousel').owlCarousel(opt.carouselOption);

			//정지/재생 컨트롤버튼
			$controlBtn.click(self.onClick);
			$(document).on('click', '.carousel-stop', self.onClickStop); //정지
			$(document).on('click', '.carousel-play', self.onClickPlay); //재생

			//owl-carousel에 dot가 없는경우 클래스 추가하여 [정지/재생] hide처리
			if ($carouselWrap.find('.owl-dots.disabled').length > 0) {
				$carouselWrap.find('.mini-board-ctrl').addClass('no-dots');
			}

			//[정지/재생] 컨트롤버튼 위치 설정
			self.insertCtrl();

			//화면 resize 후에 다시 autoplay되는 bug 해결 
			$carouselBox.on('resized.owl.carousel', function () {
				if ($(opt.name).find('.mini-board-ctrl').hasClass('carousel-play') === true) {
					$(this).trigger('stop.owl.autoplay');
				}
				self.noLoop();
			});

			//owl carousel이 loop인 경우 화면에 노출될 아이템 개수보다 실제 등록된 아이템의 개수가 작을때 loop 해제
			self.noLoop();

			//direction
			self.direction();

			$('.carousel-wrap').each(function () {
				//cms적용된 홈페이지에서 carousel이 멈춘상태에서 owl-dot클릭시 자동으로 autoplay되는 오류해결
				$(this).find('.owl-dot').click(function () {
					var dotCarousel = $(this).parents('.owl-carousel');
					if ($(this).parents('.carousel-wrap').find('.mini-board-ctrl').hasClass('carousel-play') === true) {
						setTimeout(function () {
							dotCarousel.trigger('play.owl.autoplay');
							dotCarousel.trigger('stop.owl.autoplay');
						}, 10);
					}
				});

				//carousel이 멈춘상태에서 mouseDrag시 자동으로 autoplay되는 오류해결
				$(this).find('.owl-carousel').on('translated.owl.carousel', function () {
					var dragCarousel = $(this);
					if ($(this).parents('.carousel-wrap').find('.mini-board-ctrl').hasClass('carousel-play') === true) {
						setTimeout(function () {
							dragCarousel.trigger('play.owl.autoplay');
							dragCarousel.trigger('stop.owl.autoplay');
						}, 10);
					}
				});

				//carousel이 멈춘상태에서 prev, next 버튼 클릭시 자동으로 autoplay되는 오류해결       
				$(this).find('.control-wrap').on('click', function () {
					var conCarousel = $(this).parents('.owl-carousel');
					if ($(this).parents('.carousel-wrap').find('.mini-board-ctrl').hasClass('carousel-play') === true) {
						setTimeout(function () {
							conCarousel.trigger('play.owl.autoplay');
							conCarousel.trigger('stop.owl.autoplay');
						}, 10);
					}
				});
			});

		},
		onClick: function () { //[이전/다음] 컨트롤 버튼
			if ($(this).hasClass('prev')) {
				$(this).parents('.carousel-wrap').find('.owl-carousel').trigger('prev.owl.carousel');
			} else if ($(this).hasClass('next')) {
				$(this).parents('.carousel-wrap').find('.owl-carousel').trigger('next.owl.carousel');
			}

			return false;

		},
		onClickStop: function () { //정지
			$(this).parents('.carousel-wrap').find('.owl-carousel').trigger('stop.owl.autoplay');
			$(this).removeClass('carousel-stop').addClass('carousel-play');
			$(this).attr('title', '재생');
		},
		onClickPlay: function () { //재생
			$(this).parents('.carousel-wrap').find('.owl-carousel').trigger('play.owl.autoplay');
			$(this).removeClass('carousel-play').addClass('carousel-stop');
			$(this).attr('title', '정지');
		},
		ctrlOffset: function () { //[정지/재생] 컨트롤 버튼 절대값 위치계산
			if (opt.carouselOption.ctrlPoint === 'first') {
				offset = $carouselBox.find('.owl-dots .owl-dot:' + opt.carouselOption.ctrlPoint + '-of-type').offset().left;
				$carouselWrap.find('.mini-board-ctrl').css({left: offset - $carouselWrap.find('.mini-board-ctrl').width() + 'px'});
			} else if (opt.carouselOption.ctrlPoint === 'last') {
				offset = $carouselBox.find('.owl-dots .owl-dot:' + opt.carouselOption.ctrlPoint + '-of-type').offset().left + $carouselBox.find('.owl-dots .owl-dot:' + opt.carouselOption.ctrlPoint + '-of-type').outerWidth();
				$carouselWrap.find('.mini-board-ctrl').css({left: offset - $carouselWrap.find('.mini-board-ctrl').width() + 'px'});
			}
		},
		ctrlPos: function () { //[정지/재생] 컨트롤 버튼 상대값 위치계산
			if (opt.carouselOption.ctrlPoint === 'first') {
				pos = $carouselBox.find('.owl-dots .owl-dot:' + opt.carouselOption.ctrlPoint + '-of-type').position().left;
				$carouselWrap.find('.mini-board-ctrl').css({left: pos - $carouselWrap.find('.mini-board-ctrl').width() + 'px'});
			} else if (opt.carouselOption.ctrlPoint === 'last') {
				pos = $carouselBox.find('.owl-dots .owl-dot:' + opt.carouselOption.ctrlPoint + '-of-type').position().left + $carouselBox.find('.owl-dots .owl-dot:' + opt.carouselOption.ctrlPoint + '-of-type').outerWidth();
				$carouselWrap.find('.mini-board-ctrl').css({left: pos - $carouselWrap.find('.mini-board-ctrl').width() + 'px'});
			}
		},
		insertCtrl: function () { //[정지/재생] 컨트롤 버튼 위치 설정
			setTimeout(function () { //렌더링시 owl 로딩이 느려 위치를 제대로 계산하지 못하는 경우가 있기 때문에 setTimeout으로 일정시간 이후 위치를 지정하도록 한다.
				if (opt.carouselOption.ctrlVer === 'offset') {
					self.ctrlOffset();
					$(window).resize(function () {
						self.ctrlOffset();
					});
				} else if (opt.carouselOption.ctrlVer === 'pos') {
					self.ctrlPos();
					$(window).resize(function () {
						self.ctrlPos();
					});
				}
			}, 200);
		},
		noLoop: function () { //화면에 노출될 아이템 개수보다 실제 등록된 아이템의 개수가 작을때 loop 해제
			if ('responsive' in opt.carouselOption) { //owl carousel 옵션 중 responsive 옵션이 있는경우
				resArr = [];
				resOptKey = Object.keys(opt.carouselOption.responsive);

				for (var i = 0; i < resOptKey.length; i++) {
					resOptVal = (opt.carouselOption.responsive[resOptKey[i]]);
					resArr.push(resOptVal);
				}

				resWinWidth = $(window).innerWidth();
				resOptKey.reduce(function (current, next) {
					return resResult = resWinWidth > next ? next : current;
				});

				resMatch = resOptKey.indexOf(resResult);

				if (resArr[resMatch].loop === true && $carouselBox.find('.owl-item:not(.cloned)').length <= resArr[resMatch].items) {
					$carouselBox.find('.owl-item.cloned').remove();
					$carouselWrap.addClass('no-loop'); //css에서 .no-loop .owl-stage{transform:none !important;} / .no-loop .mini-board-ctrl{display:none;} / .no-loop .owl-dots{display:none;} 처리 필요
				} else {
					$carouselWrap.removeClass('no-loop');
					self.insertCtrl();
					if ($carouselWrap.find('.carousel-stop').length > 0) {
						$carouselBox.trigger('play.owl.autoplay');
					}
				}
			} else { //owl carousel 옵션 중 responsive 옵션이 없는 일반적인 경우
				if (opt.carouselOption.loop === true && $carouselBox.find('.owl-item:not(.cloned)').length <= opt.carouselOption.items) {
					$carouselBox.find('.owl-item.cloned').remove();
					$carouselWrap.addClass('no-loop');
				} else {
					$carouselWrap.removeClass('no-loop');
					self.insertCtrl();
					if ($carouselWrap.find('.carousel-stop').length > 0) {
						$carouselBox.trigger('play.owl.autoplay');
					}
				}
			}
		},
		direction: function () {
			if (opt.carouselOption.direction === 'vertical') {
				$carouselWrap.addClass('owl-vertical');

				var itemHeight = $carouselWrap.find('.owl-item').innerHeight();
				var clickNum = 0;
				var limitNum = 0;
				var prevFlag = 'off';
				var nextFlag = 'off';
				var posArr = null;
				var curPos = 0;
				var resetStage = 0;
				var autoBox = null;

				if (opt.carouselOption.loop === false) {
					$carouselWrap.find('.owl-carousel').on('resized.owl.carousel', function () {
						calcStage(clickNum * itemHeight);
						itemHeight = $carouselWrap.find('.owl-item').innerHeight();
					});
				} else if (opt.carouselOption.loop === true) {
					resetStage = $carouselWrap.find('.owl-item.active:eq(0)').prevAll().length * itemHeight;
					calcStage(-resetStage);
					curPos = resetStage;
				}

				function calcStage(resetVal) {
					$carouselWrap.find('.owl-carousel .owl-stage').css('transform', 'translate3d(0px,' + resetVal + 'px' + ', 0px)');
				}

				if (opt.carouselOption.autoplay === true) {
					autoLoop();
					function autoLoop() {
						$carouselWrap.find('.owl-carousel').trigger('play.owl.autoplay');
						$carouselWrap.find('.owl-carousel').trigger('stop.owl.autoplay');
						if ('autoplayTimeout' in opt.carouselOption) {
							autoBox = setInterval(function () {
								$carouselWrap.find('.control-wrap .next').trigger('click');
							}, opt.carouselOption.autoplayTimeout);
						} else {
							autoBox = setInterval(function () {
								$carouselWrap.find('.control-wrap .next').trigger('click');
							}, 5000);
						}
					}

					$carouselWrap.find('.mini-board-ctrl').click(function () {
						if ($(this).hasClass('carousel-stop')) {
							clearTimeout(autoBox);
						} else if ($(this).hasClass('carousel-play')) {
							autoLoop();
						}
						$carouselWrap.find('.owl-carousel').trigger('play.owl.autoplay');
						$carouselWrap.find('.owl-carousel').trigger('stop.owl.autoplay');
						setTimeout(function () {
							$carouselWrap.find('.owl-carousel').trigger('stop.owl.autoplay');
						}, 100);
					});
				}

				$carouselWrap.find('.control-wrap a').click(function () {
					var $stageArea = $(this).parents('.carousel-wrap').find('.owl-carousel .owl-stage');
					var itemNum = $stageArea.find('.owl-item').length;
					$carouselWrap.find('.owl-carousel').on('translated.owl.carousel', function () {
						posArr = $carouselWrap.find('.owl-stage').css('transform').replace(/[^0-9^,^-^.]/g, "").split(',');
						curPos = posArr[5];
					});

					if ($(this).attr('class') === 'next') {
						clickNum = ++clickNum;
					} else if ($(this).attr('class') === 'prev') {
						clickNum = --clickNum;
					}

					if (opt.carouselOption.loop === false) {
						if (1 <= clickNum) {
							clickNum = 0;
							$stageArea.css('transform', 'none');
						} else if (itemNum <= -(clickNum - opt.carouselOption.items)) {
							limitNum = -(itemNum - opt.carouselOption.items);
							clickNum = limitNum;
							calcStage(limitNum * itemHeight);
						} else {
							calcStage(clickNum * itemHeight);
						}
					} else if (opt.carouselOption.loop === true) {
						if ($(this).attr('class') === 'next') {
							if ($carouselWrap.find('.owl-item:not(.cloned).active').length <= 1) {
								nextFlag = 'on';
							}

							if (nextFlag === 'off') {
								calcStage(-itemHeight - curPos);
							} else if (nextFlag === 'on') {
								$carouselWrap.addClass('no-transition');
								calcStage(itemHeight - resetStage);
								setTimeout(function () {
									$carouselWrap.removeClass('no-transition');
									calcStage(-resetStage);
								}, 100);
								nextFlag = 'off';
								clickNum = 0;
							}
						} else if ($(this).attr('class') === 'prev') {
							if ($carouselWrap.find('.owl-item:not(.cloned):first').prev('.owl-item.cloned').hasClass('active')) {
								prevFlag = 'on';
								nextFlag = 'on';
							}

							if (prevFlag === 'off') {
								calcStage(itemHeight - curPos);
							} else if (prevFlag === 'on') {
								$carouselWrap.addClass('no-transition');
								calcStage(-(itemHeight * $carouselWrap.find('.owl-item:not(.cloned)').length) - resetStage);
								setTimeout(function () {
									$carouselWrap.removeClass('no-transition');
									calcStage(-(itemHeight * ($carouselWrap.find('.owl-item:not(.cloned)').length - 1)) - resetStage);
								}, 100);
								prevFlag = 'off';
								clickNum = 0;
							}
						}
					}
				});
			}
		}
	}
};

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
//table scroll
//------------------------------------------------------  
App.TableScroll = function(){
	return {
		init: function(){
			$(".scrollbox").each(function() {
				$(this).scroll(function() {
					$(this).find(".msg-touch-help").fadeOut();
				});
			});
		}
	}
}();

//------------------------------------------------------
//메뉴 연동 select box
//------------------------------------------------------
App.SelectBoxMenu = function () {
	var self;
	var $tabSel, $mTab;
	return {
		init: function () {
			self = this;
			$tabSel = $('.tab-sel');
			$mTab = $(".m-tab-box");
			$tabSel.each(function() {
				var select_name = $(this).children('option:selected').text();
				$(this).siblings('label').text(select_name);

				$(this).on('change', function () {
					var url = $(this).val();
					if (url) {
						window.location = url; // redirect
					}

					return false;
				});
			});		
			$mTab.click(self.onClick);
		},
		onClick: function(){
			$(this).toggleClass("active");
			$tabSel.blur(function(){
				$mTab.removeClass("active");
			});
		}
	}
}();
