// Design / Dribbble by:
// Adam Whitcroft
// URL: https://dribbble.com/shots/969445-The-Double-Delete

$("#portal-page .centerMe").click(function(){
	event.preventDefault();
	
	const button = $(event.target);
	const form = button.closest("form");

	if($(this).hasClass("confirm")){
		setTimeout(() => form.trigger("submit"), 2000)
		$(this).addClass("done");
		$("span").text("Deleted");
	} else {
		$(this).addClass("confirm");
		$("span").text("Are you sure?");
	}
});

// Reset
$("#portal-page .centerMe").on('mouseout', function(){
	if($(this).hasClass("confirm") || $(this).hasClass("done")){
		setTimeout(function(){
			$("#portal-page .centerMe").removeClass("confirm").removeClass("done");
			$("span").text("Delete");
		}, 3000);
	}
});