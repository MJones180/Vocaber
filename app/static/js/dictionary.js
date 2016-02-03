// Display the Addnew popup
$("#action-button--addnew").click(function() {
	$("#additem-container").toggle();
});

// Add more input boxs for words
$("#addnew-words--add").click(function() {
	var input_html = '<input type="text" class="addnew-words--input x-grid-12" placeholder="Enter Word Here">';
	$("#addnew-words--holder").append(input_html);
});

// Add a new item when button is clicked
$("#addnew-button").click(function() {
	var word_count = 0;
	var word_list = [];
	$(".addnew-words--input").each(function() {
		var word = $(this).val().trim();
		if (word != "") {
			word_count++;
			word_list.push(word);
		}
	});
	var meaning_text = $("#addnew-meaning").val().trim();
	if ((word_count != 0) && (meaning_text != "")) {
		add_item(word_list, meaning_text);
	}
});

// Function to add the item to the database
function add_item(words, meaning) {
	json_words = JSON.stringify(words);
	$.ajax({
		url: "/vocab/add",
		type: "GET",
		data: {
			words : json_words,
			meaning : meaning
		},
		success: function(resp) {
			update_dictionary(words, meaning, resp);
			clear_addnew();
		},
		error: function(err) {
			console.log("vocab/grab error: " + err);
		}
	})
}

// Update the dictionary info
function update_dictionary(words, meaning, meaning_id) {
	var word_string = "";
	var totalwords = 0;
	for (var i = 0; i < words.length; i++) {
		if (i == 0) {
			word_string += words[i];
		}
		else {
			word_string += "<br>" + words[i];
		}
		totalwords++;
	}
	var string = '<div class="dictionary-item x-grid-12 nopad" m_id="' + meaning_id + '"><div class="dictionary-item--word x-grid-4">' + word_string + '</div><div class="dictionary-item--meaning x-grid-8">' + meaning + '</div></div>';
	$("#dictionary-item--holder").append(string);
	$("#dictionary-info--w").text(parseInt($("#dictionary-info--w").text()) + totalwords);
	$("#dictionary-info--m").text(parseInt($("#dictionary-info--m").text()) + 1);
}

// Clear and hide the Addnew popup
function clear_addnew() {
	var input_html = '<input type="text" class="addnew-words--input x-grid-12" placeholder="Enter Word Here">';
	$("#addnew-words--holder").html("");
	$("#addnew-words--holder").append(input_html);
	$("#addnew-words--holder").append(input_html);
	$("#addnew-words--holder").append(input_html);
	$("#addnew-meaning").val("");
	$("#additem-container").toggle();
}