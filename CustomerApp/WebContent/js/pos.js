/**
 * Malik 
 */
 var currentOrder = null;
 var isMenuLocked = false;
 
function OrderBean() {
	this.id = 0;
	this.status = 'SUBMITTED';
	this.type = 'PICKUP';
	this.timestamp = null;
	this.confirmation = null;
	this.payment = null;
	this.address = null;
	this.orderItems = null;
}

function AddressBean() {
	this.id = 0;
	this.line1 = null;
	this.line2 = null;
	this.city = null;
	this.state = null;
	this.zipcode = null;
}

function OrderItemBean(menuItemBean) {
	this.menuItem = menuItemBean;
	this.quantity = 0;
	this.status = 'NOT_READY';
} 

function PaymentBean() {
	this.id = 0;
	this.type = 'CREDIT_CARD';
	this.total = getTotal(currentOrder);
	this.creditCard = new CreditCardBean();
	this.transactionConfirmation = null;
	
}

function CreditCardBean() {
	this.ccNumber = null;
	this.ccHolderName = null;
	this.expMonth = 0;
	this.expYear = 0;
}


function getTotal(order) {
	if (order === null || order.orderItems === null) {
		return 0;
	}
	var items = order.orderItems;
	var total = 0.00;
	
	for (var i=0; i < items.length; i++) {
		var oItem = items[i];
		var price = oItem.menuItem.price;
		var quantity = oItem.quantity;

		if (quantity > 0) {
			total = toFixed(total + (price *  quantity), 2);
		}
	}
	return total;
}

function toFixed(value, precision) {
    var power = Math.pow(10, precision || 0);
    return Math.round(value * power) / power;
}

function getOrderItem(order, menuItemId) {
	if (order === null) {
		return null;		
	}
	var orderItem = null;
	
	var currentItems = order.orderItems;
	for (var i=0; i < currentItems.length; i++) {
		var oItem = currentItems[i];
		if (oItem.menuItem.id === menuItemId) {
			orderItem = oItem;
			break;
		}
	}
	
	if (orderItem === null) {
		orderItem = new OrderItemBean();
		orderItem.menuItem = menu.get(menuItemId);
		order.orderItems.push(orderItem);
	}
	
	return orderItem;
}

 function addOrderItem(mItemId) {
	 if (currentOrder === null) {
		 currentOrder = new OrderBean();
		 currentOrder.orderItems = [];
		 currentOrder.payment = new PaymentBean();
		 
	 }
	 if (isMenuLocked === false) {
		 var orderItem = getOrderItem(currentOrder, mItemId);
		 var oldQuantity = orderItem.quantity;
		 orderItem.quantity = oldQuantity + 1;
		 
		 updateOrderSummary(currentOrder);		 
	 }
 }
 
 
 function updateOrderSummary(order) {
	 if (order === null) {
		 return;
	 }
	 var orderItems = order.orderItems;
	 for (var i=0; i < orderItems.length; i++) {
		var oItem = orderItems[i];
		var menuItem = oItem.menuItem;
		var id = menuItem.id;
		var name = menuItem.name;
		var quantity = oItem.quantity;
		
		var orderItemDiv = getOrderItemDiv(id);

		if (orderItemDiv === undefined) {
			if (quantity > 0) {
				appendNewDiv(id, name, quantity);
			}
		} else if (quantity === 0){
			$(orderItemDiv).remove();
		} else {
			$($(orderItemDiv).children('input')[0]).val(quantity);
		}
	 }
 }
  
 function getOrderItemDiv(id) {
	var divId = '#item-' + id;	
	return $(divId).get(0);
 }
 
 function appendNewDiv(id, name, qty) {
	 var newDiv = 
		 '<div class="c_order-item" id="item-' + id + '">' +
			'<div class="c_item-name">'+ name + '</div>' +
			'<input class="c_item-qty" type="number" min="1" max="500" step="1" value="'+ qty + '" onClick="updateItemQuantity('+id+')" required="required">' +
			'<img class="c_item-remove-icon" alt="remove icon" src="' + deleteIconURL + '" onClick="removeItem('+id+')">' +
		'</div>';
	$('#summary-order-items').append(newDiv);
 }
 
 function updateItemQuantity(id) {
	 if (isMenuLocked === false) {
		 var oldItem = getOrderItem(currentOrder, id);
		 var newQty = getIntValue($($(getOrderItemDiv(id)).children('input')[0]).val());
		 if (isNaN(newQty) === false && newQty > 0) {
			 oldItem.quantity = newQty;
		 }
		 updateOrderSummary(currentOrder);		 
	 }
 }
 
 function removeItem(id) {
	 if (isMenuLocked === false) {
		 var oldItem = getOrderItem(currentOrder, id);
		 oldItem.quantity = 0;
		 updateOrderSummary(currentOrder);	 
	 }
 }
 
 
 function getIntValue(stringValue) {
	 if(/^[0-9]+$/.test(stringValue))
	    return Number(stringValue);
	 return NaN;
}

function isAllDigits(s) {
	if(/^[0-9]+$/.test(s))
	    return true;
	 return false;
}
 
function isValidAddress(address) {
	 if (address === null)
		 return false;
	 if (address.line1 === null || address.line1.length < 1 || address.line1.length > 100)
		 return false;
	 if (address.line2 !== null && address.line2.length > 100)
		 return false;
	 if (address.city === null || address.city.length < 1 || address.city.length > 100)
		 return false;
	 if (address.zipcode === null || address.zipcode.length < 5 || address.zipcode.length > 10)
		 return false;
	 if (isAllDigits(address.zipcode) === false)
		 return false;
	 if (address.state === null || address.state.length !== 2)
		 return false;
	 
	 return true;
 }
 function isValidCCPayment(ccPayment) {
	 if (ccPayment === null)
		 return false;
	if (ccPayment.ccNumber === null || ccPayment.ccNumber.length < 12 ||ccPayment.ccNumber.length > 19)
		 return false;
	if (isAllDigits(ccPayment.ccNumber) === false)
		return false;
	if (ccPayment.ccHolderName === null || ccPayment.ccHolderName.length < 3 || ccPayment.ccHolderName.length > 100)
		 return false;
	if (isNaN(ccPayment.expMonth) || ccPayment.expMonth < 1 || ccPayment.expMonth > 12)
		 return false;
	
	var currentYear = new Date().getFullYear();
	if (isNaN(ccPayment.expYear) || ccPayment.expYear < currentYear || ccPayment.expYear > currentYear + 20)
		 return false;

	var currentMonth = new Date().getMonth();
	if (ccPayment.expYear === currentYear && ccPayment.expMonth < currentMonth)
		return false;

	
	return true;
 }
 
 function isAllZeroQty(orderItems) {
	 var isAllZero = true;
	 for(var i=0; i < orderItems.length; i++) {
		 isAllZero = isAllZero && (orderItems[i].quantity === 0);
	 }
	 return isAllZero;
 }
 

 function removeMenuItem(id) {
	 $('#menuItem-' + id).remove();
 }

 function addMenuItem(id, name) {
	 var newDiv = '<div class="menu_item_button" id="menuItem-' + id +'" onClick="addOrderItem(' + id +')"> ' + name +' </div>';
	 $("#menu-content").append(newDiv);
 }

 
 function updateMenu(newMenuList) {
	 if (isMenuLocked === false) {
		 isMenuLocked = true;
		 var removeIds = [];
		 
		 var currentItems = menu.itemsList;

		/* remove old items */
		 for(var i=0; i < currentItems.length; i++) {
			var oldItem = currentItems[i];
			var found = false;
			for (var j=0; j < newMenuList.length; j++) {
				if (oldItem.id === newMenuList[j].id) {
					found = true;
					break;
				}
			}
			
			if (found === false) {
				removeIds.push(oldItem.id);
				removeMenuItem(oldItem.id);

				if (currentOrder != null) {
					var orderItems = currentOrder.orderItems;
					var indx = -1;
					for (var k=0; k < orderItems.length; k++) {
						var oItem = orderItems[k];
						if (oItem.menuItem.id === oldItem.id) {
							indx = k;
							break;
						}
					}
					if (indx > -1) {
						// remove item from order
						currentOrder.orderItems.splice(indx, 1);
						$('#item-' + oldItem.id).remove();
					}
				}
			}
		 }
		 
		/* add new items */
		for(var i=0; i < newMenuList.length; i++) {
			if (menu.get(newMenuList[i].id) === null) {
				var add = true;
				for (var j=0; j < removeIds.length; j++) {
					if (removeIds[j] === newMenuList[i].id) {
						add = false;
					}
				}
				if (add === true) {
					addMenuItem(newMenuList[i].id, newMenuList[i].name);
				}
			}
		}
		menu.itemsList = newMenuList;
		updateOrderSummary(currentOrder);
		isMenuLocked = false;
	}
 }
 
 
 function ajaxFetchMenu() {
	$.ajax({
	   type: 'POST',
	   url: ajaxFetchURL,
	   dataType: 'JSON',
	   success: 
		   	function(data, textStatus, jqXHR) {
	   			if (data.valid === undefined) {
	   				alert('Malformed Server Response');
	   			} else if (data.valid === false) {
		   			alert('Failed To Fetch Menu Data: ' + data.message);
		   		} else if (data.valid === true) {
		   			updateMenu(data.itemsList);
		   			setTimeout(ajaxFetchMenu, 15000);
		   		}
	    	},
			error: 
				function(xhr, status, error) {
					var msg = xhr.responseText;
					if (msg.length === 0) {
						msg = "Cannot Connect To The Server"
					}
			       	alert('Error: ' + msg);
				}
		});
	}
 
 
 
 $(document).ready(function(){
	$('#pos_order_address').css("visibility", "hidden");
	
	$('#pos_ordertype').hide();
	$('#pos_paymenttype').hide();
	$('#pos_confirmation').hide();
	$('#pos_overlay').hide();
	
	$('#checkout-btn').click(
		function(){
			if (currentOrder !== null && isMenuLocked === false) {
				isMenuLocked = true;
				if (isAllZeroQty(currentOrder.orderItems) === true) {
					$('#clear_btn').trigger('click');
					isMenuLocked = false;
				} else {
					$('#pos_overlay').show(700); 
					$('#pos_ordertype').show(800);					
				}
			}
	});

	$('#clear-btn').click(
			function(){
				if (currentOrder !== null) {
					currentOrder = null;
					$('#summary-order-items > div').each(function(){$(this).remove();});
					$('#ordertype_pickup').trigger('click');
					$("input[name='creditcard_number']").val('');
					$("input[name='creditcard_holder_name']").val('');
					$("input[name='creditcard_month']").val('1');
					$("input[name='creditcard_year']").val('2016');
				}
		});
	
	$('#ordertype_pickup').click(function(){
		if (currentOrder !== null) {
			currentOrder.type = 'PICKUP';
			currentOrder.address = null;
		}
		
		$("input[name='address_line_1']").val('');
		$("input[name='address_line_2']").val('');
		$("input[name='address_city']").val('');
		$("input[name='address_zipcode']").val('');

		$('#pos_order_address').css("visibility", "hidden");
	});
	
	$('#ordertype_delivery').click(function(){
		if (currentOrder !== null) {
			currentOrder.type = 'DELIVERY';
			currentOrder.address = new AddressBean();
		}
		$('#pos_order_address').css("visibility", "visible");			
	});
	
	$('#back-ordertype').click(function(){
		$('#pos_ordertype').hide(700);
		$('#pos_overlay').hide(800);
		isMenuLocked = false;
	});
	
	
	$('#next-ordertype').click(function(){
		if (currentOrder !== null) {
			var isValid = false;
			
			if (currentOrder.type === 'PICKUP') {
				currentOrder.address = null;
				isValid = true;
			} else if (currentOrder.type === 'DELIVERY') {
				if (currentOrder.address === null) {
					currentOrder.address = new AddressBean();
				}
				var address = currentOrder.address;
				address.line1 = $("input[name='address_line_1']").val().trim();
				address.city  = $("input[name='address_city']").val().trim();
				address.state = $($("select[name='address_state'] option:selected")[0]).text().trim();
				address.zipcode = $("input[name='address_zipcode']").val().trim();

				var line2 = $("input[name='address_line_2']").val().trim();
				address.line2 = line2.length > 0? line2 : null;
				
				isValid = isValidAddress(address);
			}
			
			if (isValid === true) {
				var total = getTotal(currentOrder);
				$('#pos_order_total').text(''+ total);
				$('#pos_ordertype').hide(200); 
				$('#pos_paymenttype').show(700);	
			} else {
				alert('Invalid Address Data');
			}
		}	
	});
	
	$('#back-payment').click(function(){
		$('#pos_paymenttype').hide(200);
		$('#pos_ordertype').show(700);
	});
	
	$('#start_over').click(function(){
		$("#confirmation").text('');
		$("input[name='orderConf'").val('');
		
		$('#pos_confirmation').hide(700);
		$('#pos_overlay').hide(800);
	});
	
	$('#done-payment').click(function(){
		if (currentOrder !== null) {
			var isValid = false;
			
			if (currentOrder.payment.type === 'CREDIT_CARD') {
				var ccPayment = currentOrder.payment.creditCard;

				ccPayment.ccNumber = $("input[name='creditcard_number']").val().trim();
				ccPayment.ccHolderName  = $("input[name='creditcard_holder_name']").val().trim();
				
				var month = getIntValue($("input[name='creditcard_month']").val().trim());
				ccPayment.expMonth = month;
				
				var year  = getIntValue($("input[name='creditcard_year']").val().trim());
				ccPayment.expYear = year;
				
				isValid = isValidCCPayment(ccPayment);
			}
			
			if (isValid === true) {
				currentOrder.payment.total = getTotal(currentOrder);
				var copiedCurrentOrder = $.extend(true, {}, currentOrder);
				
				$.ajax({
					   type: 'POST',
					   url: ajaxURL,
					   dataType: 'JSON',
					   data: { order: JSON.stringify(copiedCurrentOrder)},
					   success: 
						   	function(data, textStatus, jqXHR) {
						   		$('#pos_paymenttype').hide(700);
							   	if (data) {
								   	if (data.added === true) {
						   				$("#confirmation").text(data.confirmation);
						   				$("input[name='orderConf'").val(data.confirmation);
						   				$('#pos_confirmation').show(700);
							   		} else {
							   			$('#pos_overlay').hide(700);
							   			alert('Failed To Add New Order: ' + data.message);
							   		}						   		
							   	} else {
						   			$('#pos_overlay').hide(700);
							   		alert('Malformed Server Response');
							   	}
					    	},
					    error: 
					    	function(xhr, status, error) {
								$('#pos_paymenttype').hide(700);
					    		$('#pos_overlay').hide(700);
					    
								var msg = xhr.responseText;
								if (msg.length === 0) {
									msg = "Cannot Connect To The Server"
								}
						       	alert('Error: ' + msg);
							}
				});
				
				isMenuLocked = false;
				$('#clear-btn').trigger('click');
			} else {
				alert('Invalid Credit Card Data');
			}
		} else {
			isMenuLocked = false;
			$('#clear_btn').trigger('click');
			$('#pos_paymenttype').hide(700);
		}
	});
	
	setTimeout(ajaxFetchMenu, 15000);
});