package edu.depaul.se491.capp.actions;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;

import edu.depaul.se491.beans.OrderBean;
import edu.depaul.se491.utils.ParamLabels;
import edu.depaul.se491.validators.OrderValidator;
import edu.depaul.se491.ws.clients.OrderServiceClient;

/***
 * @author Malik
 */

@WebServlet("/ajax/track")
public class TrackOrderAjax extends BaseAction {
	private static final long serialVersionUID = 1L;

	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String jsonResponse = null;
		String orderConfirmation = request.getParameter(ParamLabels.Order.CONFIRMATION);
			
		if (orderConfirmation == null) {
			jsonResponse = getInvalidResponse("Missing 'orderConf' request parameters");
		} else {
			boolean isValid = new OrderValidator().validateConfirmation(orderConfirmation);
			if (!isValid) {
				jsonResponse = getInvalidResponse("invalid order confirmation");
			} else {
				OrderServiceClient serviceClient = new OrderServiceClient(getCustomerAppCredentials(), ORDER_SERVICE_URL);
				OrderBean order = serviceClient.get(orderConfirmation);
				if (order == null) {
					jsonResponse = getInvalidResponse(serviceClient.getResponseMessage());
				} else {
					jsonResponse = String.format("{\"valid\": true, \"order\": %s}", new Gson().toJson(order));
				}
			}
		}
		
		
		response.setContentType("application/json");
		response.getWriter().print(jsonResponse);
		response.flushBuffer();
	}
	
	private String getInvalidResponse(String message) {
		String response = "{\"valid\": false, \"message\": \"" +message+ "\"}";
		return response;
	}
}
