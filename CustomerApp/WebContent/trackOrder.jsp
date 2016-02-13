<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%>
<%@ page import="edu.depaul.se491.utils.ParamLabels,edu.depaul.se491.utils.ParamLengths" %>
<%@ page import="edu.depaul.se491.beans.OrderBean,edu.depaul.se491.beans.OrderItemBean" %>
<%@ page import="edu.depaul.se491.enums.OrderItemStatus,edu.depaul.se491.enums.OrderStatus" %>
<%@ page import="com.google.gson.Gson" %>
<!DOCTYPE html>
<html>
	<head>
	<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
	<title>Track Order</title>
	<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/css/component.css"/>
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.0/jquery.min.js"></script>
</head>
<body>
	<div class="component">
<%
	String jspMsg = (String) request.getAttribute(ParamLabels.JspMsg.MSG);
	OrderBean order = (OrderBean) request.getAttribute(ParamLabels.Order.ORDER_BEAN);
%>
	<h3> Track Order </h3>
	<a href="${pageContext.request.contextPath}/home.jsp"> Home Page </a>
	<br><br>
	
	<div>
		<form action="${pageContext.request.contextPath}/track">
			<label> Order Confirmation: </label>
			<input type="text" name="<%=ParamLabels.Order.CONFIRMATION%>" 
				maxLength="<%=ParamLengths.Order.MAX_CONFIRMATION%>" 
				required="required">
			<input type="submit" value="Track Order">
		</form>
	</div>

<%	if (jspMsg != null) {
%>		<h3> <%=jspMsg%></h3>		
<%	}
%>	
	
<%	if (order != null) {
		String ajaxURL = String.format("%s%s", request.getContextPath(), "/ajax/track");
		String orderInJson = new Gson().toJson(order);
%>
		<br> <br>
		<h4> Current Order Status </h4>
		<div>
			<table>
				<thead> <tr> <th> Item </th> <th> Status </th> </tr></thead>
				<tbody>
<%				for (OrderItemBean item: order.getOrderItems()) {
					String status = (item.getStatus() == OrderItemStatus.NOT_READY)? "Not Ready" : "Ready";
%>					<tr> <td> <%=item.getMenuItem().getName()%></td> <td id="<%=item.getMenuItem().getId()%>"> <%=status%> </td> </tr>
<%				}
%>				</tbody>
			</table>
		</div>
		
		<script type="text/javascript">
			var confirmation = "<%=order.getConfirmation()%>";
			var ajaxURL = "<%=ajaxURL%>";
			var order = <%=orderInJson%>;
		</script>
		<script src="${pageContext.request.contextPath}/js/trackOrder.js"></script>
<%
	}
%>
</div>
</body>
</html>
