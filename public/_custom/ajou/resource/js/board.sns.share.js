if(!window.App) {
	App = {};
}
if(!App.board){
	App.board = {};
}

$(function() {

	var boardApp = new App.board.Common.Sns();

	boardApp.init();

});

App.board.Common.Sns = function() {

	var self;
	var sns = {
		"facebook" : "https://www.facebook.com/sharer/sharer.php?u=",
		"twitter" : "https://twitter.com/intent/tweet?url=",
		"google" : "https://plus.google.com/share?url=",
		"naverblog" : "http://blog.naver.com/openapi/share?url=",
		"navershare" : "http://share.naver.com/web/shareView.nhn?url=",
		"naverband" : "http://www.band.us/plugin/share?route=",
		"linkedin" : "https://www.linkedin.com/shareArticle?url="  
    };
    
    var _thisHost = location.protocol+'//'+location.host;
    
	return {
		init: function() {
			self = this;
			
			// SNS 공유
			self.snsShare();


		},
		snsShare : function(){
			
			$('.sns').click( function(e) {
				
				var shortUrl;
                e.preventDefault();	
                                
                var $this = $(this), id = $this.attr('id')
                	//, url = sns[$this.attr('class')]
                	, url
                	, title;
                var className = $this.attr('class').replace(/\s{2,20}/g,' ')
					, classes = className.split(' '); // 클래스 분리
				
					if (classes.length > 1) {
						
						url = sns[classes[1]];
						
					}
				
console.log(url)				
                if ( typeof(url) != 'undefined' ) {
	                // 짧은 주소 구하기
	                $.ajax({
						url: '/cms/util/getShortUrl.do',
						data: {
	                    	url: location.pathname + location.search
	                  	},
	                  	success: function(json) {
	                    	if(json.success) {
	                      		shortUrl = _thisHost+'/s.do?'+ json.shortUrl;
	                    	}
	                  	},
	                  	async: false,
	                  	dataType: 'json'
	            	});
	            	
					if($this.attr('data-title')) {
						title = $this.attr('data-title');
					}
	                
	                //$this.attr('href', '#' +  id );
	
	                if($this.attr('class') == 'facebook') url += encodeURIComponent( shortUrl + '&t=' + title);
	                if($this.attr('class') == 'twitter') url += encodeURIComponent( shortUrl + '&text=' + title );
	                if($this.attr('class') == 'google')  url +=  encodeURIComponent( shortUrl );
	                if($this.attr('class') == 'naverblog' || $this.attr('class') == 'navershare') url += encodeURIComponent(  shortUrl + '&title=' + title);
	                if($this.attr('class') == 'naverband') url += encodeURIComponent(  shortUrl + '&body=' + title);
	                if($this.attr('class') == 'linkedin') url += encodeURIComponent( _thisHost + '&mini=true');
					
	                window.open(url,'', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=680,width=830');
                
				}
				
              
                //jwxe_popupWindow( url , "830", "680", true, true);	
			});
			
		}

	}
}

