<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="edu.depaul.se491.utils.ParamLabels,edu.depaul.se491.utils.ParamValues,edu.depaul.se491.utils.ParamLengths" %>
<%@ page import="edu.depaul.se491.beans.AccountBean,edu.depaul.se491.beans.MenuItemBean" %>
<%@ page import="edu.depaul.se491.enums.AddressState,edu.depaul.se491.enums.PaymentType,edu.depaul.se491.enums.OrderType,edu.depaul.se491.enums.MenuItemCategory,edu.depaul.se491.enums.AccountRole" %>
<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<title>Point Of Sale</title>
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.0/jquery.min.js"></script>
	<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/css/pos.css" />
</head>
<body>
<jsp:include page="/nav.jsp"></jsp:include>

<main id="main">
<%
	String ajaxURL = response.encodeURL(getServletContext().getContextPath() + "/pos/ajax/order");
	String ajaxFetchURL = response.encodeURL(getServletContext().getContextPath() + "/pos/ajax/menu");
	
	String msg = (String) request.getAttribute(ParamLabels.JspMsg.MSG);
	String jsonMenuItemList = (String) request.getAttribute("jsonMenuItemList");
	MenuItemBean[] menuItems = (MenuItemBean[]) request.getAttribute(ParamLabels.MenuItem.VISIBLE_MENU_ITEM_BEAN_LIST);

	if (msg != null) {
%>		<div class="message">  <%=msg%> </div>
<%	}	
%>
<%	if (menuItems != null && jsonMenuItemList != null) {
%>	
		<div id="main-content">
				
<%		if (menuItems.length == 0) {
%>			<div class="message"> There is no Menu </div>
<%		} else {
%>
			<div id="menu-content">
<%
			for (MenuItemBean mItem : menuItems) {
				long id = mItem.getId();
				String name = mItem.getName();	
%>			
				<div class="menu_item_button" id="menuItem-<%=id%>" onClick="addOrderItem(<%=id%>)"> <%=name%> </div>
<% 			}
%>			
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
				var ajaxURL = "<%=ajaxURL%>";
				var ajaxFetchURL = "<%=ajaxFetchURL%>";
				var deleteIconURL = "<%=response.encodeURL(getServletContext().getContextPath() + "/icons/ic_delete_black_24px.svg")%>";
			</script>
			<script src="${pageContext.request.contextPath}/js/pos.js"></script>

<%		} // end (else)
%>
			<div id="summary-content">
				<div id="summary-header"> Current Order </div>
				<div id="summary-order-items">
				</div>
				<div id="summary-action-btns">
					<div class="action-btn" id="clear-btn">
						<img alt="clear button" src="${pageContext.request.contextPath}/icons/ic_clear_black_48px.svg">
					</div>
					<div class="action-btn" id="checkout-btn">
						<img alt="checkout button" src="${pageContext.request.contextPath}/icons/ic_done_black_48px.svg">
					</div>
				</div>
			</div>
		</div>
<%	}
%>	
</main>
<div id="pos_overlay"> </div>
	
<div id="pos_ordertype">
	<div class="overlay-header">
		Order Type
	</div>
	<div class="overlay-header-option">
		<label>
			<input id="ordertype_pickup" type="radio" name="otype" value="<%=OrderType.PICKUP.name()%>" checked>
			<%=OrderType.PICKUP.name().toLowerCase()%>
		 </label>
		 <label>
			<input id="ordertype_delivery" type="radio" name="otype" value="<%=OrderType.DELIVERY.name()%>">
		 	<%=OrderType.DELIVERY.name().toLowerCase()%>
		 	<img class="overlay-icon" alt="address icon" src="${pageContext.request.contextPath}/icons/ic_place_black_18px.svg">
		 	
		 </label>			
	</div>
	
	<div class="overlay-additional" id="pos_order_address">
		<table>
			<tr> <td>Line 1 :</td> <td> <input type="text" name="address_line_1" title="string between 3-100" required> </td> </tr>
			<tr> <td>Line 2 :</td> <td> <input type="text" name="address_line_2" title="optional string between 3-100"> </td> </tr>
			<tr> <td>City :	 </td> <td> <input type="text" name="address_city" title="string between 3-100" required> </td> </tr>
			<tr> <td>State : </td> 
				<td> <select name="address_state" required>
<%				for (AddressState state: AddressState.values()) {
%>					<option value="<%=state.name()%>" <%if (state == AddressState.IL){%> selected <%}%>> <%=state.name()%> </option>
<%				} 
%>				 </select>
				</td>
			</tr>
			<tr> <td>Zipcode :</td> <td> <input type="text" name="address_zipcode" title="all digit string between 5-10" required> </td> </tr>
		</table>
	</div>
	<div class="overlay-action-btn">
		<img class="nav-btn" id="back-ordertype" alt="back icon" src="${pageContext.request.contextPath}/icons/ic_left_black_48px.svg">
		<img class="nav-btn" id="next-ordertype" alt="next icon" src="${pageContext.request.contextPath}/icons/ic_right_black_48px.svg">
	</div>
 </div> 		

 <div id="pos_paymenttype">
 	<div class="overlay-header">
		Order Payment
	</div>
	
	<div id="order-total-div">
		Total: &#36;<div id="pos_order_total"></div>
	</div>
 	
 	<div class="overlay-header-option">
		<label>
			Credit Card
			<img class="overlay-icon" alt="payment icon" src="${pageContext.request.contextPath}/icons/ic_payment_black_18px.svg">
		</label> 	
	</div>
	
	
	<div class="overlay-additional" id="pos_order_creditcard">
	 	<table>
			<tr> <td>Number (12-19 digits):</td> 
				 <td> <input name="creditcard_number" type="text" 
				  title="digit string. length <%=ParamLengths.CreditCard.MIN_NUMBER%>-<%=ParamLengths.CreditCard.MAX_NUMBER%>" required> 
				 </td> 
			</tr>
			<tr> <td>Holder&#39;s Name :</td> 
				 <td> <input name="creditcard_holder_name" type="text" 
				  title="length <%=ParamLengths.CreditCard.MIN_HOLDER_NAME%>-<%=ParamLengths.CreditCard.MAX_HOLDER_NAME%>" required> 
				 </td> 
			</tr>
			<tr> <td>Expiration Month : </td> 
				 <td> <input type="number" name="creditcard_month" value="1"
				 		min="<%=ParamValues.CreditCard.MIN_EXP_MONTH%>" max="<%=ParamValues.CreditCard.MAX_EXP_MONTH%>"
				 		title="number between <%=ParamValues.CreditCard.MIN_EXP_MONTH%>-<%=ParamValues.CreditCard.MAX_EXP_MONTH%>" required> 
				 <td>
			</tr>
			<tr> <td>Expiration Year : </td> 
				 <td> <input type="number" name="creditcard_year" value="2016"
				  min="<%=ParamValues.CreditCard.MIN_EXP_YEAR%>" max="<%=ParamValues.CreditCard.MAX_EXP_YEAR%>"
				  title="year between <%=ParamValues.CreditCard.MIN_EXP_YEAR%>-<%=ParamValues.CreditCard.MAX_EXP_YEAR%>" required> 
				 </td> 
			</tr>
		</table> 	
	 </div>
	
	<div class="overlay-action-btn">
		<img class="nav-btn" id="back-payment" alt="back icon" src="${pageContext.request.contextPath}/icons/ic_left_black_48px.svg">
		<img class="nav-btn" id="done-payment" alt="next icon" src="${pageContext.request.contextPath}/icons/ic_check_circle_black_48px.svg">
	</div>
</div>

 <div id="pos_confirmation">
 	<div class="overlay-header">
 		Order Confirmation
 	</div>
 	<div class="overlay-confirmation">
		Your order confirmation :<div id="confirmation"></div>
 	</div>
 	<div class="overlay-confirmation-action">
		<form action="<%= response.encodeURL(getServletContext().getContextPath() + "/track") %>">
			<input type="hidden" name="orderConf" value="" />
			<input type="submit" value="Track Your Order" />
		</form>
 		<button id="start_over"> Start New Order </button>
 	</div>
 	</div>
</body>
</html>