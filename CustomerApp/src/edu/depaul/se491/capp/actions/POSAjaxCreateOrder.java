/**
 * 
 */
package edu.depaul.se491.capp.actions;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;
import com.google.gson.JsonParseException;

import edu.depaul.se491.beans.OrderBean;
import edu.depaul.se491.beans.OrderItemBean;
import edu.depaul.se491.ws.clients.OrderServiceClient;

/**
 * @author Malik
 *
 */
@WebServlet("/pos/ajax/order")
public class POSAjaxCreateOrder extends BaseAction {
	private static final long serialVersionUID = 1L;
	
	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String jsonResponse = null;
		String orderInJson = request.getParameter("order");
			
		if (orderInJson == null) {
			jsonResponse = getInvalidResponse("Missing 'order' request parameters");
		} else {
			OrderBean order = getOrderBean(orderInJson);
			if (order == null) {
				jsonResponse = getInvalidResponse("failed to parse json order");
			} else if (isValidOrderBean(order) == false){
				jsonResponse = getInvalidResponse("Invalid order data");
			} else {
				OrderServiceClient serviceClient = new OrderServiceClient(getCustomerAppCredentials(), ORDER_WEB_SERVICE_URL);
				OrderBean createdOrder = serviceClient.post(order);
				if (createdOrder == null) {
					jsonResponse = getInvalidResponse(serviceClient.getResponseMessage());
				} else {
					jsonResponse = "{\"added\": true, \"confirmation\":\"" + createdOrder.getConfirmation() + "\"}";
				}
			}
		}
		
		
		response.setContentType("application/json");
		response.getWriter().print(jsonResponse);
		response.flushBuffer();
	}

	private OrderBean getOrderBean(String orderInJson) {
		OrderBean order = null;
		try {
			order = new Gson().fromJson(orderInJson, OrderBean.class);
			OrderItemBean[] orderItems = order.getOrderItems();
			if (orderItems != null) {
				List<OrderItemBean> noneZeroQtyOItems = new ArrayList<OrderItemBean>();	
				for (OrderItemBean oItem: orderItems) {
					if (oItem.getQuantity() > 0) {
						noneZeroQtyOItems.add(oItem);
					}
				}
				int size = noneZeroQtyOItems.size();
				if (size == 0) {
					order.setOrderItems(null);
				} else {
					order.setOrderItems(noneZeroQtyOItems.toArray(new OrderItemBean[size]));
				}
			}
			
		} catch (JsonParseException e) {
			e.printStackTrace();
		}
		return order;
	}

	private String getInvalidResponse(String message) {
		String response = "{\"added\": false, \"message\": \"" +message+ "\"}";
		return response;
	}
}
