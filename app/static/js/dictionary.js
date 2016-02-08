// Load the dictionary
function load_dictionary() {
	for (var item_id in dictionary) {
		var item = dictionary[item_id];
		var meaning;
		for (var m in item) {
			meaning = m;
		}
		var word_string = "";
		var word_count = 0;
		for (var words in item) {
			for (var w = 0; w < item[words].length; w++){
				word_string += word_count == 0 ? item[words][w] : "<br>" + item[words][w];
				word_count++;
			}
		}
		update_dictionary(word_string, meaning, item_id, word_count);
	}
}

$(load_dictionary);

function update_dictionary(words, meaning, item_id, word_count) {
	$("#dictionary-item--holder").append(
		'<div class="dictionary-item x-grid-12 nopad" id="' + item_id + '"><div class="dictionary-item--word x-grid-4">' + words + '</div><div class="dictionary-item--meaning x-grid-8">' + meaning + '</div></div>'
	);
	$("#dictionary-info--w").text(parseInt($("#dictionary-info--w").text()) + word_count);
	$("#dictionary-info--m").text(parseInt($("#dictionary-info--m").text()) + 1);
}

// Display item containers
function display_container(id) {
	$("#edititem-container,#additem-container").hide();
	$(id).show();
	$("body, html").animate({scrollTop: $(id).offset().top - 20}, 500);
}

$("body").on("click", ".dictionary-item", function() {
	clear_item_container("edit");
	display_container("#edititem-container");
	edititem_contents($(this).attr("id"));
});

function edititem_contents(item_id) {
	$("#edititem-container").attr("current_id", item_id);
	var item = dictionary[item_id];
	for (var meaning in item) {
		$("#addedit-meaning").val(meaning);
	}
	for (var words in item) {
		for (var w = 0; w < item[words].length; w++){
			$("#addedit-words--holder").append(
				'<input type="text" class="addedit-words--input itembox-words--input x-grid-12" placeholder="Edit Word Here" value="' + item[words][w] + '">'
			);
		}
	}
}

$("#action-button--addnew").click(function() {
	clear_item_container("new");
	display_container("#additem-container");
});

// Hide item containers
$("#edititem-hide").click(function() {
	$("#edititem-container").hide();
	delete_button(true);
});

$("#additem-hide").click(function() {
	$("#additem-container").hide();
});

// Clear item containers
function clear_item_container(type) {
	$("#add" + type + "-words--holder").html("");
	if (type == "new") {
		add_input("new");
		add_input("new");
		add_input("new");
	}
	else {
		$("#edititem-container").attr("current_id", "");
		delete_button(true);
	}
	$("#add" + type + "-meaning").val("");
	$("#edititem-container,#additem-container").hide();
}

// Add more input boxs for words
$("#addnew-words--add").click(function() {
	add_input("new");
});

$("#addedit-words--add").click(function() {
	add_input("edit");
});

function add_input(type) {
	$("#add" + type + "-words--holder").append(
		'<input type="text" class="add' + type + '-words--input itembox-words--input x-grid-12" placeholder="Enter Word Here">'
	);
}

// Add the item
$("#addnew-button").click(function() {
	var word_count = 0;
	var word_list = [];
	var word_string = "";
	$(".addnew-words--input").each(function() {
		var word = $(this).val().trim();
		if (word != "") {
			word_count++;
			word_list.push(word);
			word_string += word_count == 1 ? word : "<br>" + word;
		}
	});
	var meaning_text = $("#addnew-meaning").val().trim();
	if ((word_count != 0) && (meaning_text != "")) {
		json_words = JSON.stringify(word_list);
		$.ajax({
			url: "/vocab/add",
			type: "GET",
			data: {
				words : json_words,
				meaning : meaning_text
			},
			success: function(item_id) {
				update_dictionary(word_string, meaning_text, item_id, word_count);
				var val = {};
				val[meaning_text] = word_list;
				dictionary[item_id] = val;
				clear_item_container("new");
			},
			error: function(err) {
				console.log("vocab/add error: " + err);
			}
		})
	}
});

// Edit the item
$("#addedit-button").click(function() {
	var new_word_count = 0;
	var word_list = [];
	var word_string = "";
	$(".addedit-words--input").each(function() {
		var word = $(this).val().trim();
		if (word != "") {
			new_word_count++;
			word_list.push(word);
			word_string += new_word_count == 1 ? word : "<br>" + word;
		}
	});
	var meaning_text = $("#addedit-meaning").val().trim();
	if ((new_word_count != 0) && (meaning_text != "")) {
		json_words = JSON.stringify(word_list);
		item_id = $("#edititem-container").attr("current_id");
		$.ajax({
			url: "/vocab/edit",
			type: "GET",
			data: {
				words : json_words,
				meaning : meaning_text,
				item_id : item_id
			},
			success: function(deleted_word_count) {
				edit_dictionary(word_string, meaning_text, item_id, new_word_count, deleted_word_count);
				delete dictionary[item_id];
				var val = {};
				val[meaning_text] = word_list;
				dictionary[item_id] = val;
				clear_item_container("edit");
			},
			error: function(err) {
				console.log("vocab/edit error: " + err);
			}
		})
	}
});

function edit_dictionary(words, meaning, item_id, new_count, deleted_count) {
	$("#" + item_id + " > .dictionary-item--word").html(words);
	$("#" + item_id + " > .dictionary-item--meaning").text(meaning);
	var change = parseInt(new_count) - parseInt(deleted_count);
	$("#dictionary-info--w").text(parseInt($("#dictionary-info--w").text()) + change);
}

// Delete the item
$("#delete-button").click(function() {
	$("#delete-button--confirm").is(":visible") ? delete_button(true) : delete_button(false);
});

function delete_button(confirm) {
	if (confirm) {
		$("#delete-button--confirm").hide();
		$("#delete-button").text("Delete Item");
	}
	else {
		$("#delete-button--confirm").show();
		$("#delete-button").text("Cancel Delete");
	}
}

$("#delete-button--confirm").click(function() {
	delete_item($("#edititem-container").attr("current_id"));
});

function delete_item(item_id) {
	$.ajax({
		url: "/vocab/delete",
		type: "GET",
		data: {
			item_id : item_id
		},
		success: function(total_words) {
			$("#" + item_id).remove();
			$("#dictionary-info--w").text(parseInt($("#dictionary-info--w").text()) - parseInt(total_words));
			$("#dictionary-info--m").text(parseInt($("#dictionary-info--m").text()) - 1);
			clear_item_container("edit");
		},
		error: function(err) {
			console.log("vocab/delete error: " + err);
		}
	})
}