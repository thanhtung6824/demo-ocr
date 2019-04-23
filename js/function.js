jQuery( document ).ready(function($) {
	$('.banner_header ul').slick({
		slidesToShow: 1,
		arrows: true,
		responsive: [
		{
			breakpoint: 768,
			settings: {
				arrows: true,
				slidesToShow: 1
			}
		},
		{
			breakpoint: 480,
			settings: {
				arrows: true,
				slidesToShow: 1
			}
		}
		]
	});
	 $(document).on('click','.hotro_fixed, .lh',function(event){
        event.preventDefault();
        $('.popup_register').modal('show');
    });

	 	jQuery(window).scroll(function() {
		var scroll = jQuery(window).scrollTop();
		if (scroll >= 50) {
			jQuery(".top_header").addClass("fixed_header");
		} else {
			jQuery(".top_header").removeClass("fixed_header");
		}
	});

	 	// SCROLL TO MULTI DIV 
		jQuery(window).scroll(function () {
			var window_top = jQuery(this).scrollTop();
			jQuery(".nav_primary   [class*='diem']").each(function(){
				var neoindext=jQuery(this).find('a').attr('rel');
				var neoclass= jQuery("#diem"+neoindext);
				if(neoclass.length){
					var this_offset = neoclass.offset().top-120;
					var max_height = neoclass.height()+this_offset;
					if((window_top>=this_offset)&&(this_offset<max_height)){
						jQuery(".nav_primary  [class*='diem']").removeClass('active');
						jQuery(".nav_primary  .diem"+neoindext).addClass('active');
					}
					else{
						jQuery(".nav_primary  .diem"+neoindext).removeClass('active');
					}
				}

			});
		});
		function scroll_to(div){
			jQuery('html, body').animate({
				scrollTop: jQuery(div).offset().top-70,
			},700);
		}
		jQuery('.nav_primary  ul>li:not(:last-child), #menu_mobile_full .menu li').click(function(e){
			
			var neoindext=jQuery(this).find('a').attr('rel');
			scroll_to("#diem"+neoindext);
			jQuery(".nav_primary  [class*='diem']").removeClass('active');
			jQuery(this).addClass('active');
			return true;
		});

		// MENU MOBILE
		jQuery(".icon_mobile_click").click(function(){
			jQuery(this).fadeOut(300);
			jQuery("#page_wrapper").addClass('page_wrapper_active');
			jQuery("#menu_mobile_full").addClass('menu_show').stop().animate({left: "0px"},260);
			jQuery(".close_menu, .bg_opacity").show();
		});
		jQuery(".close_menu").click(function(){
			jQuery(".icon_mobile_click").fadeIn(300);
			jQuery("#menu_mobile_full").animate({left: "-260px"},260).removeClass('menu_show');
			jQuery("#page_wrapper").removeClass('page_wrapper_active');
			jQuery(this).hide();
			jQuery('.bg_opacity').hide();
		});
		jQuery('.bg_opacity').click(function(){
			jQuery("#menu_mobile_full").animate({left: "-260px"},260).removeClass('menu_show');
			jQuery("#page_wrapper").removeClass('page_wrapper_active');
			jQuery('.close_menu').hide();
			jQuery(this).hide();
			jQuery('.icon_mobile_click').fadeIn(300);
		});
		jQuery("#menu_mobile_full ul li a").click(function(){
			jQuery(".icon_mobile_click").fadeIn(300);
			jQuery("#page_wrapper").removeClass('page_wrapper_active');
		});
		jQuery('.mobile-menu ul.menu').children().has('ul.sub-menu').click(function(){
			jQuery(this).children('ul').slideToggle();
			jQuery(this).siblings().has('ul.sub-menu').find('ul.sub-menu').slideUp();
		}).children('ul').children().click(function(event){event.stopPropagation()});
		jQuery('.mobile-menu ul.menu').children().find('ul.sub-menu').children().has('ul.sub-menu').click(function(){
			jQuery(this).find('ul.sub-menu').slideToggle();
		});
		jQuery('.mobile-menu ul.menu li').has('ul.sub-menu').click(function(event){
			jQuery(this).toggleClass('editBefore_mobile');
		});
		jQuery('.mobile-menu ul.menu').children().has('ul.sub-menu').addClass('menu-item-has-children');
		jQuery('.mobile-menu ul.menu li').click(function(){
			jQuery(this).addClass('active').siblings().removeClass('active, editBefore_mobile');
			jQuery(".close_menu, .bg_opacity").hide();
			jQuery("#menu_mobile_full").animate({left: "-260px"},260).removeClass('menu_show');
		});

});