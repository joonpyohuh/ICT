if ($(document).find('.slideMenu .m-gnb').length > 0) {
	$(function () {
		$(".btn-menu").click(function (e) {

			e.preventDefault();
			var currentPage = window.location.pathname;

			$('.m-gnb ul li a').removeClass('active selected');
			$('.m-gnb ul li a').each(function(){
				var mMenuLink = $(this).attr('href');
				if(currentPage == mMenuLink){
					$(this).addClass('active');
					$(this).parents('ul').siblings('a').addClass('active');
					$(this).parents('.dep1').find('ul').hide();
					$(this).parents('ul').show();
				}

			});

			$(".slideMenu").animate({right: "0"}, 300);
			$(".slideMenu").show();
			$(".m-gnb-bg").show();
			$(".slide-close").show();
			$("body").css({overflow: "hidden"});
		});

		$(".slide-close").click(function () {
			$(".slideMenu").animate({
				right: "-100%"
			});
			$(".slideMenu").hide(10);
			$(".m-gnb-bg").hide();
			$(".slide-close").hide();
			$("body").css({overflow: "auto"});
		});

		$(window).resize(function(){

			if($(window).width() > 1024){
				$(".slideMenu").css({right: "-100%"});
				$(".slideMenu").hide();
				$(".m-gnb-bg").hide();
				$(".slide-close").hide();
				$("body").css({overflow: "auto"});
			}
		});

		$(".m-gnb .dep1 > li > a").click(function () {
			if ($(this).next().is(':hidden')) {
				$(this).parent().find(".dep2").slideUp().siblings(".dep2").slideDown();
				/*$(this).parent().find(".dep3").slideUp();*/
				$(this).addClass("selected");
				$(this).addClass("active");
				$(this).next(".dep2").slideDown();
				$(this).parent().siblings().find(".dep2").slideUp();
				$(this).parent().siblings().find(".selected").removeClass("selected");
				$(this).parent().siblings().find(".active").removeClass("active");
			} else {
				$(this).next(".dep2").slideUp();
				$(this).removeClass("selected");
				$(this).removeClass('active');
			}
			return false;
		});

		$(".m-gnb .dep2 > li > a").click(function (e) {
			if($(this).next('.dep3').length > 0){
				e.preventDefault();
				if ($(this).next().is(':hidden')) { 
					$(this).parent().find(".dep3").slideUp().siblings(".dep3").slideDown(); 
					$(this).parent().find(".dep3").slideUp().slideDown();
					$(this).addClass("selected");
					$(this).addClass("active");
					$(this).next(".dep3").slideDown();
					$(this).parent().siblings().find(".dep3").slideUp();
					//$(this).parent().siblings().find(">a").removeClass("selected");
					$(this).parent().siblings().find(".selected").removeClass("selected");
					$(this).parent().siblings().find(".active").removeClass("active");
					$(this).parent().siblings().find(".depth02-active").removeClass("depth02-active");
				} else {  
					$(this).next(".dep3").slideUp(); 
					$(this).removeClass("selected");
					$(this).removeClass('active');
				}; 
			}
		});

		$(function () {
			var hasDep = $(".m-gnb .dep3").parents(".dep2 > li").find("a:first");

			hasDep.addClass("has-dep03-open");
			$(".m-gnb .dep3").parents(".dep2 > li").each(function () {
				$(this).click(function () {
					//$(this).find("a:first").toggleClass("has-dep03-open", "has-dep03-close");
					$(".dep3").parents(".dep2 > li").find("a:first").not("a.selected").removeClass("has-dep03-close").removeClass("depth02-active").addClass("has-dep03-open");
					$(".dep3 > li > a.active").parents(".dep2 > li").find("a:first").addClass("depth02-active");
					$(this).find("a:first.selected").addClass("depth02-active");
				});
			});

			$(".m-gnb .dep1 > li > a.active").parents(".dep1 > li").find(".dep2").show();
			$(".m-gnb .dep3 > li > a.active").parents(".dep2 > li").find(".dep3").show();
			$(".m-gnb .dep2 > li").find("a:first").removeClass("depth02-active");
			$(".m-gnb .dep3 > li > a.active").parents(".dep2 > li").find("a:first").addClass("depth02-active");
		});

	});
}