<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%>
<%@ page import="edu.depaul.se491.utils.ParamLabels"%>
<%@ page import="edu.depaul.se491.utils.ParamValues"%>
<%@ page import="edu.depaul.se491.utils.ParamLengths"%>
<%@ page import="edu.depaul.se491.beans.MenuItemBean"%>
<%@ page import="edu.depaul.se491.enums.AddressState"%>
<%@ page import="edu.depaul.se491.enums.OrderType"%>
<%@ page import="edu.depaul.se491.enums.MenuItemCategory"%>

<!DOCTYPE html>
<html>
<head>
	<meta charset="ISO-8859-1">
	<title>Point Of Sale</title>
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.0/jquery.min.js"></script>
	<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/css/pos.css" />
</head>
<body>
 	<div class="pos_header">
		<div id="logo"> Online Restaurant </div> 
		<div id="track_order_link"> 
			<a href="${pageContext.request.contextPath}/trackOrder.jsp"> Track Your Order </a> 
		</div>
	</div>
	
	<div class="pos_container">
	
<%
	String ajaxURL = String.format("\"%s%s\"", request.getContextPath(),"/ajax/create");
	String msg = (String) request.getAttribute(ParamLabels.JspMsg.MSG);
	String jsonMenuItemList = (String) request.getAttribute("jsonMenuItemList");
	MenuItemBean[] menuItems = (MenuItemBean[]) request.getAttribute(ParamLabels.MenuItem.VISIBLE_MENU_ITEM_BEAN_LIST);
	
	if (msg != null) {
%>		<h3>  <%=msg%> </h3>
<%	}	

	if (menuItems != null && jsonMenuItemList != null) {
		if (menuItems.length == 0) {
%>			<h2> There is no Menu </h2>
<%		} else {
			int buttonPerRow = 3;
			int total = menuItems.length;
%>
 			<div class="pos_menu">
 				<table class="pos_menu_items">
<%
				for (int i=1; i < total + 1 ; i++) {
					MenuItemBean mItem = menuItems[i-1]; // i - 1 (zero based index)
					long id = mItem.getId();
					String name = mItem.getName();	
				
					int modValue = i % buttonPerRow; 
					if (modValue == 1) {
%>	  					<tr>  
<% 					}
%>					<td><button class="menu_item_button" onClick="addOrderItem(<%=id%>)"> <%=name%> </button> </td>
<%			
					if (modValue == 0 || i == total ) {
%>						</tr>
<%					}
				}
%>				</table> 
			</div>
			
			
			<div class="pos_summary">
				<div id="pos_summary_detail">
					<h1>Current Order</h1>
					<table class="pos_summary_div_table">
					</table>
	    		</div>
	    		
	    		<div class="pos_summary_btn_container">
	    			<div id="clear_button">
	    				<div id="clear_button_text">Clear</div>
	    			</div>
	    			
	    			<div id="checkout_button">
	    				<div id="checkout_button_text">Check out</div>
	    			</div>
	    		</div>
	    	</div>
	    	
			<script type="text/javascript"> 
				var menu = {
						itemsList: <%=jsonMenuItemList%>,
						get: function(mItemId) {
								for(var i=0; i < this.itemsList.length; i++) {
									var mItem = this.itemsList[i];
									if (mItem.id === mItemId) {
										return mItem;
									}
								}
								return null;
							}
						};
				var ajaxURL = <%=ajaxURL%>;
			</script>	
			<script src="${pageContext.request.contextPath}/js/pos.js"></script>	
<%		}
	}
%>
	</div>
	
	<div class="pos_overlay"> </div>
	
	<div class="pos_ordertype">	
 		<h2> Order Type </h2>

		<label>
			<input id="ordertype_pickup" type="radio" name="otype" value="<%=OrderType.PICKUP.name()%>" checked="checked">
			<%=OrderType.PICKUP.name().toLowerCase()%>
		 </label>
		 <label>
			<input id="ordertype_delivery" type="radio" name="otype" value="<%=OrderType.DELIVERY.name()%>">
		 	<%=OrderType.DELIVERY.name().toLowerCase()%>
		 </label>
		 <br>
		 <br>
		 		
		<div id="pos_order_address">
			<table class="pos_inner_div_table">
				<tr> <td>Line 1 :</td> <td> <input type="text" name="address_line_1" title="string between 3-100" required="required"> </td> </tr>
				<tr> <td>Line 2 :</td> <td> <input type="text" name="address_line_2" title="optional string between 3-100"> </td> </tr>
				<tr> <td>City :	 </td> <td> <input type="text" name="address_city" title="string between 3-100" required="required"> </td> </tr>
				<tr> <td>State : </td> 
					 <td> <select name="address_state" required="required">
<%							for (AddressState state: AddressState.values()) {
%>								<option value="<%=state.name()%>" <%if (state == AddressState.IL){%> selected="selected" <%}%>> <%=state.name()%> </option>
<%							} 
%>						 </select>
					</td>
				</tr>
				<tr> <td>Zipcode :</td> <td> <input type="text" name="address_zipcode" title="all digit string between 5-10" required="required"> </td> </tr>
			</table> 	
		 </div>
		 <br>
		 <br>
		
		<button id="back-ordertype"> Back </button> <button id="next-ordertype"> Next </button>
		<br>
		<br>
 	</div> 		

 	
 	<div class="pos_paymenttype">
 		<h2> Order Payment </h2>
		
		<label>Total :</label> <div id="pos_order_total"> </div>
		<br>
		<br>
		<h3>Credit Card Payment</h3>
		<br>	
	 	<div id="pos_order_creditcard">
	 		<table class="pos_inner_div_table">
				<tr> <td>Credit card number:</td> 
					 <td> <input name="creditcard_number" type="text" 
					  title="digit string. length <%=ParamLengths.CreditCard.MIN_NUMBER%>-<%=ParamLengths.CreditCard.MAX_NUMBER%>" required="required"> 
					 </td> 
				</tr>
				<tr> <td>Holder&#39;s Name :</td> 
					 <td> <input name="creditcard_holder_name" type="text" 
					  title="length <%=ParamLengths.CreditCard.MIN_HOLDER_NAME%>-<%=ParamLengths.CreditCard.MAX_HOLDER_NAME%>" required="required"> 
					 </td> 
				</tr>
				<tr> <td>Expiration Month : </td> 
					 <td> <input type="number" name="creditcard_month" value="1"
					 		min="<%=ParamValues.CreditCard.MIN_EXP_MONTH%>" max="<%=ParamValues.CreditCard.MAX_EXP_MONTH%>"
					 		title="number between <%=ParamValues.CreditCard.MIN_EXP_MONTH%>-<%=ParamValues.CreditCard.MAX_EXP_MONTH%>" required="required"> 
					 <td>
				</tr>
				<tr> <td>Expiration Year : </td> 
					 <td> <input type="number" name="creditcard_year" value="2016"
					  min="<%=ParamValues.CreditCard.MIN_EXP_YEAR%>" max="<%=ParamValues.CreditCard.MAX_EXP_YEAR%>"
					  title="year between <%=ParamValues.CreditCard.MIN_EXP_YEAR%>-<%=ParamValues.CreditCard.MAX_EXP_YEAR%>" required="required"> 
					 </td> 
				</tr>
			</table> 	
	 	</div>
	 	<br>
		<br>
		
		<button id="back-payment"> Back </button> <button id="done-payment"> Submit </button>
		<br>
		<br>
 	</div>
 	
 	<div class="pos_confirmation">
 		<h2> Order Confirmation </h2>
		
		<label>Your order confirmation :</label><div id="confirmation"></div>
		<br>
		<br>		

		<form action="${pageContext.request.contextPath}/track">
			<input type="hidden" name="orderConf" value="" />
			<input type="submit" value="Track Your Order" />
		</form>

		<button id="start_over"> Start New Order </button>
		<br>
		<br>
 	</div>
</body>
</html>
