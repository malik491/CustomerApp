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
import edu.depaul.se491.validators.AddressValidator;
import edu.depaul.se491.validators.CreditCardValidator;
import edu.depaul.se491.validators.MenuItemValidator;
import edu.depaul.se491.validators.OrderItemValidator;
import edu.depaul.se491.validators.OrderValidator;
import edu.depaul.se491.validators.PaymentValidator;

public class BaseAction extends HttpServlet {
	private static final long serialVersionUID = 1L; // ignore this
	private static final CredentialsBean customerAppCredentials = new CredentialsBean("customerapp", "password");
	
	protected static final String CORE_APP_URL = "http://localhost/CoreApp";
	protected static final String ACCOUNT_SERVICE_URL = CORE_APP_URL + "/account";
	protected static final String MENUITEM_SERVICE_URL = CORE_APP_URL + "/menuItem";
	protected static final String ORDER_SERVICE_URL = CORE_APP_URL + "/order";
	protected static final String LOGIN_JSP_URL = "/login.jsp";
	
	
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
