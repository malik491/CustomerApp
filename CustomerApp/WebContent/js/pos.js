
console.log('fuck you');
var currentOrder = null;

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
	 
	 var orderItem = getOrderItem(currentOrder, mItemId);
	 var oldQuantity = orderItem.quantity;
	 orderItem.quantity = oldQuantity + 1;
	 
	 updateOrderSummary(currentOrder);
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
		
		var tableRow = getRow(id);

		if (tableRow === undefined) {
			if (quantity > 0) {
				appendNewRow(id, name, quantity);
			}
		} else if (quantity === 0){
			$(tableRow).remove();
		} else {
			$($($(tableRow).children('td')[1]).children('input')[0]).val(quantity);
		}
	 }
 }
  
 function getRow(id) {
	var rowId = '#id-' + id;	
	return $(rowId).get(0);
 }
 
 function appendNewRow(id, name, qty) {
	 var newRow = '<tr id="id-'+id+'"> <td>'+name+'</td>' 
	 + '<td> <input type="number" min="1" max="500" step="1" value="'+qty
	 	 +'" onClick="updateItemQuantity('+id+')" required> </td>' 
	 + '<td> <button onClick="removeItem('+id+')"> remove </button> </td></tr>';
 
	$('.pos_summary_div_table').append(newRow);
 }
 
 function updateItemQuantity(id) {
	 var oldItem = getOrderItem(currentOrder, id);
	 var newQty = getIntValue($($($(getRow(id)).children('td')[1]).children('input')[0]).val());
	 if (newQty !== NaN) {
		 oldItem.quantity = newQty;
	 }
	 updateOrderSummary(currentOrder);	 
 }
 
 function removeItem(id) {
	 var oldItem = getOrderItem(currentOrder, id);
	 oldItem.quantity = 0;
	 updateOrderSummary(currentOrder);
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
	if (ccPayment.expMonth < 1 || ccPayment.expMonth > 12)
		 return false;
	if (ccPayment.expYear < 1996 || ccPayment.expYear > 2036)
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
  
 $(document).ready(function(){ 
	$('#pos_order_address').hide();

	$('.pos_ordertype').hide();
	$('.pos_paymenttype').hide();
	$('.pos_confirmation').hide();
	$('.pos_overlay').hide();
	
	$('#checkout_button').click(
			function(){
				if (currentOrder !== null) {
					if (isAllZeroQty(currentOrder.orderItems) === true) {
						$('#clear_button').trigger('click');
					} else {
						$('.pos_overlay').show(700); 
						$('.pos_ordertype').show(800);					
					}
				}
		});

	$('#clear_button').click(
			function(){
				if (currentOrder !== null) {
					currentOrder = null;
					$('.pos_summary_div_table > tbody > tr').each(function(){$(this).remove();});
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

		$('#pos_order_address').hide();

	});
	
	$('#ordertype_delivery').click(function(){
		if (currentOrder !== null) {
			currentOrder.type = 'DELIVERY';
			currentOrder.address = new AddressBean();
		}
		$('#pos_order_address').show();				
	});
	
	$('#back-ordertype').click(function(){
		$('.pos_ordertype').hide(700);
		$('.pos_overlay').hide(800);
	});
	
	$('#start_over').click(function(){
		$("#confirmation").text('');
		$("input[name='orderConf'").val('');
		
		$('.pos_confirmation').hide(700);
		$('.pos_overlay').hide(800);
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
				$('.pos_ordertype').hide(200); 
				$('.pos_paymenttype').show(700);	
			} else {
				alert('Invalid Address Data');
			}
		}	
	});
	
	$('#back-payment').click(function(){
		$('.pos_paymenttype').hide(200);
		$('.pos_ordertype').show(700);
	});
	
	$('#done-payment').click(function(){
		if (currentOrder !== null) {
			var isValid = false;
			
			if (currentOrder.payment.type === 'CREDIT_CARD') {
				var ccPayment = currentOrder.payment.creditCard;

				ccPayment.ccNumber = $("input[name='creditcard_number']").val().trim();
				ccPayment.ccHolderName  = $("input[name='creditcard_holder_name']").val().trim();
				
				var month = getIntValue($("input[name='creditcard_month']").val().trim());
				ccPayment.expMonth = month !== NaN? month : 0;
				
				var year  = getIntValue($("input[name='creditcard_year']").val().trim());
				ccPayment.expYear = year !== NaN? year : 0;
				
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
					   			if (data.added === true) {
					   				$("#confirmation").text(data.confirmation);
					   				$("input[name='orderConf'").val(data.confirmation);
					   				$('.pos_confirmation').show(700);

						   		} else if (data.added === false){
						   			$('.pos_ordertype').hide(700);
						   			alert('failed to added order: ' + data.message);

						   		} else {
						   			$('.pos_ordertype').hide(700);
						   			alert('malformed server ajax response');
						   		}
					    	},
					    error: 
					    	function(data) {	
					    		$('.pos_ordertype').hide(700);
					    		alert('Error: AJAX request. Check if the server is running');
					    	}
				});
				
				$('#clear_button').trigger('click');
				$('.pos_paymenttype').hide(700);
			
			} else {
				alert('Invalid Credit Card Data');
			}
		}
	});
	
});