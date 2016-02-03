//Variables - Settings
synonyms_first = false;
meaning_first = false;
disable_animation = false;
animation_speed = 1000;
disable_scroll = false;

//Variables - Internal
phase = "load";
words = "";
single_word = "";
meaning = "";
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
		animation_speed = input.length != 1 || !$.isNumeric(input) ? 1000 : input * 1000 / 2;
	}
});
$("[name=animation_speed]").keyup(function() {
	var input = $(this).val();
	animation_speed = input.length != 1 || !$.isNumeric(input) ? 1000 : input * 1000 / 2;
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
		$("#next_button").animate({deg: 180}, {
			step: function(now) {
				$(this).css("transform", "rotateX(" + now + "deg)");
			},
			duration: animation_speed / 2
		});
		$("#next_button").animate({deg: 360}, {
			step: function(now) {
				$(this).css("transform", "rotateX(" + now + "deg)");
			},
			duration: animation_speed / 2
		});
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

//Internal, Data
function call_card() {
	if (phase == "load") {
		synonyms_first ? card_load(words,meaning) : card_load(single_word,meaning);
	}
	else {
		card_finish(words,meaning);
	}
	phase = phase == "load" ? "finish" : "load";
}

function grab_data() {
	var return_single_word = synonyms_first == false ? "true" : "false";
	$.ajax({
		url: "/vocab/grab",
		type: "GET",
		data: {
			single_word_value : return_single_word
		},
		success: function(resp) {
			words = resp["words"];
			single_word = return_single_word == "true" ? resp["single_word"] : "";
			meaning = resp["meaning"];
			call_card();
		},
		error: function(err) {
			console.log("vocab/grab error: " + err);
		}
	})
}

function controller() {
	if (allow_finish) {
		if (phase == "load") {
			allow_finish = false;
			grab_data();
		}
		else {
			call_card();
		}
	}
}

$("#next_button").click(function() {
	controller();
});

$(document).keyup(function(e) {
	if (e.keyCode == 13) {
		controller();
	}
});