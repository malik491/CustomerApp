/**
 * 
 */
$(document).ready(function() {
	setTimeout(fetchOrderStatus, 5000);
});


function fetchOrderStatus() {
	if (confirmation) {
		$.ajax({
			   type: 'POST',
			   url: ajaxURL,
			   dataType: 'JSON',
			   data: { orderConf: confirmation},
			   success: 
				   	function(data, textStatus, jqXHR) {
			   			if (data.valid === true) {
			   				if (fetchAgain(data.order)) {
				   				setTimeout(fetchOrderStatus, 5000);			   					
			   				}
				   		} else if (data.valid === false){
		   					alert('failed to fetch order: ' + data.message);
				   		} else {
				   			alert('malformed server ajax response');
				   		}
			    	},
			    error: 
			    	function(data) {
			        	alert('Error: AJAX request. Check if the server is running');
			    	}
		});
	}
}

function fetchAgain(fetchedOrder) {
	if (!fetchedOrder || !order)
		return;
	var oldItems = order.orderItems;
	var fetchedItems = fetchedOrder.orderItems;
	
	var isAllDone = true;
	
	for (var i=0; i < oldItems.length; i++) {
		var oldItem = oldItems[i];
		var found = false;
		for (var j=0; j < fetchedItems.length; j++) {
			var fetchedItem = fetchedItems[j];
			if (oldItem.menuItem.id === fetchedItem.menuItem.id) {
				var isReady = (fetchedItem.status === 'READY');
				isAllDone = isAllDone && isReady;
				
				$('#' + oldItem.menuItem.id).text(isReady? 'Ready' : 'Not Ready');
				found = true;
				break;
			}
		}
		
		if (found === false) {
			$('#' + oldItem.menuItem.id).text('Removed');
		}
	}
	
	return isAllDone? false : true;
}