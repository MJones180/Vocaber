//Variables - Settings
synonyms_first = false;
meaning_first = false;
disable_animation = false;
animation_speed = 2000;
disable_scroll = false;

//Variables - Internal
phase = "load";
allow_finish = true;

//Check for setting changes
$("[name=synonyms_first]").change(function() {
	synonyms_first = $(this).is(":checked") ? true : false;
});
$("[name=meaning_first]").change(function() {
	meaning_first = $(this).is(":checked") ? true : false;
});
$("[name=disable_animation]").change(function() {
	disable_animation = $(this).is(":checked") ? true : false;
	$("[name=disable_animation_speed]").toggle();
	if (disable_animation) {
		animation_speed = 0;
	}
	else {
		var input = $("[name=animation_speed]").val();
		animation_speed = input.length != 1 || !$.isNumeric(input) ? 2000 : input * 1000;
	}
});
$("[name=animation_speed]").keyup(function() {
	var input = $(this).val();
	animation_speed = input.length != 1 || !$.isNumeric(input) ? 2000 : input * 1000;
});
$("[name=disable_scroll]").change(function() {
	disable_scroll = $(this).is(":checked") ? true : false;
});

//Display the settings box
$("#settings-box")
.mouseenter(function() {
	$("#settings-holder").css("margin-bottom", 0 - $("#settings-holder").outerHeight() + 36);
	$("[name=disable_animation]").change(function() {
		$("#settings-holder").css("margin-bottom", 0 - $("#settings-holder").outerHeight() + 36);
	});
})
.mouseleave(function() {
	$("#settings-holder").css("margin-bottom", 0);
});

//Card functions
function card_clear() {
	$("#card-holder--word").text("...");
	$("#card-holder--meaning").text("...");
	$("#next_button").text("...");
}

function card_effect() {
	card_clear();
	if (disable_animation != true) {
		$("#card-holder").animate({"top": 0 - $(this).outerHeight() - 25, "opacity": .5}, animation_speed / 2);
		$("#card-holder").animate({"top": 0, "opacity": 1}, animation_speed / 2);
	}
	if (disable_scroll != true) {
		setTimeout(function() {
			$("body, html").animate({scrollTop: $("#content").offset().top}, 500);
		}, animation_speed);
	}
}

function card_load(words,meaning) {
	card_effect();
	setTimeout(function() {
		meaning_first ? $("#card-holder--meaning").text(meaning) : $("#card-holder--word").text(words);
		setTimeout(function() {
			meaning_first ? $("#next_button").text("Load Word(s)") : $("#next_button").text("Load Meaning");
			allow_finish = true;
		}, animation_speed / 2);
	}, animation_speed / 2);
}

function card_finish(words,meaning) {
	$("#card-holder--word").text(words);
	$("#card-holder--meaning").text(meaning);
	$("#next_button").text("Next Card");
}

function contents(current_phase) {
	if (allow_finish) {
		if (current_phase == "load") {
			allow_finish = false;
			card_load("Obsolete","No longer in use; outmoded in design or style");
			phase = "finish";
		}
		else {
			card_finish("Obsolete, Archaic, Antiquated","No longer in use; outmoded in design or style");
			phase = "load";
		}
	}
}

$("#next_button").click(function() {
	contents(phase);
});

$(document).keyup(function(e) {
	if (e.keyCode == 13) {
		contents(phase);
	}
});