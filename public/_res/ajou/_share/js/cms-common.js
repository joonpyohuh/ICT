$(document).ready(function () {
	if($("#img-map").length > 0){
		App.resizePopup.init();	
	}
	
	//App.researchTab.init();
	setTimeout(function () {
		$('html').removeClass('no-js');
	}, 10);	
	//------------------------------------------------------
	// researchTab
	//------------------------------------------------------ 
	/*App.researchTab = function() {
	return {
		init: function () {
			var gettabText = $(".research-tab-list li.active").text();
			$(".m-tab-list").text(gettabText);

			$(".research-tab-list li").on("click", function(e){
				e.preventDefault();
				var tabIndex = $(this).index() + 1;
				var target = e.target;
				console.log(target)
				gettabText = $(this).text();

				$(this).addClass("active").siblings("li").removeClass("active");
				var tabConIndex = $( ".tab-content0" + tabIndex );
				$(tabConIndex).addClass("active").siblings(".tab-content").removeClass("active");
				$(".m-tab-list").text(gettabText);

				$(".research-tab-list").removeClass("show");


			});
			$(".m-tab-list").on("click",function(){

				$(".research-tab-list").toggleClass("show");
			});
		}
	}
	}();*/
});

App.resizePopup = function (){
	return {
		init: function(){
			if($('map').length > 0){
				$('map').imageMapResize();
				$(".popup-close-btn").on("click", function(e){
					e.preventDefault();
					window.close();
				});	
			}
		}
	}
}();


//IE Text UI
(function browserCheck(){ 
	var agent = navigator.userAgent.toLowerCase();
	if ( (navigator.appName == 'Netscape' && navigator.userAgent.search('Trident') != -1) || (agent.indexOf("msie") != -1) ) {
		//alert('Internet Explorer는 호환되지 않는 브라우저 입니다.');
		if(document.querySelector('.interest > span')){
			var spanEl = document.querySelector('.interest > span');
			spanEl.style.minWidth = "80px";
			spanEl.style.maxWidth = "90px";
		}
	}
})();