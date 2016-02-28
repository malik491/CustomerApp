package edu.depaul.se491.capp.actions;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import edu.depaul.se491.beans.AddressBean;
import edu.depaul.se491.beans.CredentialsBean;
import edu.depaul.se491.beans.CreditCardBean;
import edu.depaul.se491.beans.MenuItemBean;
import edu.depaul.se491.beans.OrderBean;
import edu.depaul.se491.beans.OrderItemBean;
import edu.depaul.se491.beans.PaymentBean;
import edu.depaul.se491.enums.OrderType;
import edu.depaul.se491.utils.ParamLengths;
import edu.depaul.se491.validators.AddressValidator;
import edu.depaul.se491.validators.CreditCardValidator;
import edu.depaul.se491.validators.MenuItemValidator;
import edu.depaul.se491.validators.OrderItemValidator;
import edu.depaul.se491.validators.OrderValidator;
import edu.depaul.se491.validators.PaymentValidator;

public class BaseAction extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private static CredentialsBean customerAppCredentials;

	protected static String ACCOUT_WEB_SERVICE_URL;
	protected static String ORDER_WEB_SERVICE_URL;
	protected static String MENU_WEB_SERVICE_URL;
	
	protected static final String LOGIN_JSP_URL = "/login.jsp";
	
	@Override
	public void init() throws ServletException {		
		String hostname = getServletContext().getInitParameter("web-service-hostname");
		String port = getServletContext().getInitParameter("web-service-port");
		String appName = getServletContext().getInitParameter("web-service-appname");
		String username = getServletContext().getInitParameter("customerapp-username");
		String password = getServletContext().getInitParameter("customerapp-password");

		if (hostname == null)
			System.err.println("Missing web-service-hostname init parameter. 'localhost' will be used.");

		if (port == null)
			System.err.println("Missing web-service-port init parameter. Port '80' will be used.");
		
		if (appName == null)
			System.err.println("Missing web-service-appname init parameter (see web.xml). 'CoreApp' will be used.");

		hostname = hostname != null? hostname.trim() : "localhost";
		appName = appName != null? appName.trim() : "CoreApp";
		port = getPort(port);
		
		if (username == null || password == null) {
			System.err.println("Missing customerapp-username or customerapp-password init parameters (see web.xml)");
		} else {
			username = username.trim();
			int usernameLen = username.length();
			if (usernameLen < ParamLengths.Credentials.MIN_USERNAME || usernameLen > ParamLengths.Credentials.MAX_USERNAME)
				System.err.println(String.format("Invalid username length (length must be between %d-%d)", 
								ParamLengths.Credentials.MIN_USERNAME, ParamLengths.Credentials.MAX_USERNAME));
			
			password = password.trim();
			int passwordLen = password.length();
			if (passwordLen < ParamLengths.Credentials.MIN_PASSWORD || passwordLen > ParamLengths.Credentials.MAX_PASSWORD)
				System.err.println(String.format("Invalid password length (length must be between %d-%d)", 
								ParamLengths.Credentials.MIN_PASSWORD, ParamLengths.Credentials.MAX_PASSWORD));	
		}

		customerAppCredentials = new CredentialsBean(username, password);
		ACCOUT_WEB_SERVICE_URL = String.format("http://%s:%s/%s/account", hostname, port, appName);
		ORDER_WEB_SERVICE_URL = String.format("http://%s:%s/%s/order", hostname, port, appName);
		MENU_WEB_SERVICE_URL = String.format("http://%s:%s/%s/menuItem", hostname, port, appName);

	}
	
	private String getPort(String port) {
		String result = "80";
		if (port!= null) {
			try {
				port = port.trim();
				Integer.parseInt(port);
				result = port;
			} catch (NumberFormatException e) {
				System.err.println("Invalid port number (not a number). port '80' will be used.");
			}
		}
		return result;
	}
	
	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doGet(request, response);
	}
	
	protected CredentialsBean getCustomerAppCredentials() {
		return customerAppCredentials;
	}
	
	/**
	 * validate order bean
	 * @param order
	 * @param isNewOrder
	 * @return
	 */
	protected boolean isValidOrderBean(OrderBean order) {
		boolean isValid = false;
		
		isValid  = new OrderValidator().validate(order, true);
		isValid  = isValid? isValidPaymentBean(order.getPayment()) : false;
		
		if (isValid && order.getType() == OrderType.DELIVERY)
			isValid = isValidAddressBean(order.getAddress());
		
		if (isValid) {
			boolean isAllZeroQty = true;
			for(OrderItemBean oItem: order.getOrderItems()) {
				isValid &= isValidOrderItemBean(oItem);
				isAllZeroQty &= (oItem.getQuantity() == 0);
			}
			isValid &= (isAllZeroQty == false);
		}
		
		return isValid;
	}
	
	/**
	 * validate order item bean
	 * @param orderItem
	 * @return
	 */
	private boolean isValidOrderItemBean(OrderItemBean orderItem) {
		boolean isValid = false;
		isValid = new OrderItemValidator().validate(orderItem);
		isValid &= isValid? isValidMenuItemBean(orderItem.getMenuItem()) : false;
		
		return isValid;
	}
	
	/**
	 * validate menu item bean
	 * @param menuItem
	 * @param isNewMenuItem
	 * @return
	 */
	protected boolean isValidMenuItemBean(MenuItemBean menuItem) {
		return new MenuItemValidator().validate(menuItem, false);
	}
	
	/**
	 * validate payment bean
	 * @param paymentBean
	 * @param isNewPayment
	 * @return
	 */
	private boolean isValidPaymentBean(PaymentBean paymentBean) {
		boolean isValid = new PaymentValidator().validate(paymentBean, true);
		isValid = isValid? isValidCreditCardBean(paymentBean.getCreditCard()) : false;			
		
		return isValid;
	}
	
	/**
	 * validate a credit card bean
	 * @param creditCard
	 * @return
	 */
	private boolean isValidCreditCardBean(CreditCardBean creditCard) {
		return new CreditCardValidator().validate(creditCard);
	}
	
	/**
	 * validate address bean
	 * @param address
	 * @param isNewAddress
	 * @return
	 */
	private boolean isValidAddressBean(AddressBean address) {
		return new AddressValidator().validate(address, true);
	}
}
