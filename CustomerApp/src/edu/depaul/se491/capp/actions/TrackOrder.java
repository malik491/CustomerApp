/**
 * 
 */
package edu.depaul.se491.capp.actions;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import edu.depaul.se491.beans.OrderBean;
import edu.depaul.se491.utils.ParamLabels;
import edu.depaul.se491.validators.OrderValidator;
import edu.depaul.se491.ws.clients.OrderServiceClient;

/**
 * @author Malik
 *
 */
@WebServlet("/track")
public class TrackOrder extends BaseAction {
	private static final long serialVersionUID = 1L;

	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String jspMsg = null;
		String orderConfirmation = request.getParameter(ParamLabels.Order.CONFIRMATION);
		
		OrderBean order = null;
		if (orderConfirmation != null) {
			boolean isValid = new OrderValidator().validateConfirmation(orderConfirmation);
			if (!isValid) {
				jspMsg = "invalid order confirmation";
			} else {
				OrderServiceClient serviceClient = new OrderServiceClient(getCustomerAppCredentials(), ORDER_WEB_SERVICE_URL);
				order = serviceClient.get(orderConfirmation);
				jspMsg = (order == null)? serviceClient.getResponseMessage() : null;
			}
		}
		
		if (jspMsg != null)
			request.setAttribute(ParamLabels.JspMsg.MSG, jspMsg);
		if (order != null)
			request.setAttribute(ParamLabels.Order.ORDER_BEAN, order);
		
		String jspURL = "/trackOrder.jsp";
		getServletContext().getRequestDispatcher(jspURL).forward(request, response);
		
	}
}
