var tpl = '<div class="msg"><a href="#">{NAME}</a>-{TIME}: {MSG}</div>';
var intervalTime = 3000; //Time delay ajax get new data from server. Default 3000 for 3 seconds.

var ajaxHandler = {
	// Send data to server
	adding : function(){
		$('#send').click(function(event) {
			event.preventDefault();
			var name = $("#name");
			var message = $("#message");
			var has_err = false;
			$('p small').remove();
			$("#msg_err").css('display', 'none');
			// check name is empty
			if(name.val().trim().length<=0){
				name.parent('p').append('<small>Please add your name</small>');
				has_err = true;
			}			
			// check message is empty
			if(message.val().trim().length<=0){
				message.parent('p').append('<small>Please add your message</small>');
				has_err = true;
			}
			if(!has_err){
				$("#loader").fadeIn(100);
				$.post('chat.php', {atc: 'add', name: name.val(), message: message.val()}, function(data, textStatus, xhr) {
					var obj  = $.parseJSON(data);
					if(obj.status){
						name.val('');
						message.val('');
						$("#loader").fadeOut(100);
					}else{
						$("#msg_err").css('display', 'block');
						$("#loader").fadeOut(100);
					}
				});
			}
		});		
	},
	// get message from server
	getting: function(){
		$.get("chat.php",{atc:'all'}, function(data, status){
		    var obj = jQuery.parseJSON(data); // Parse json string to java Object
			var msg='';
			$.each(obj.msg, function(index, val) {  // Pass msg array object to get data
				 str= tpl;
				 str = str.replace('{NAME}', val.name)  // 
				 .replace('{TIME}', val.create_at)		// Replace template by data
				 .replace('{MSG}', val.message);		//
				 msg +=str;
			});
			$("#msg").html(msg);
	  	});
	}
}


$(document).ready(function() {	
	// get message for firts time enter
	ajaxHandler.getting()
	setInterval(function(){ajaxHandler.getting();}, intervalTime); // get message every 3 seconds
	ajaxHandler.adding(); //add message
});