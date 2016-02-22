/**
 * 
 */
package edu.depaul.se491.capp.actions;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;

import edu.depaul.se491.beans.MenuItemBean;
import edu.depaul.se491.utils.ParamLabels;
import edu.depaul.se491.ws.clients.MenuServiceClient;

/**
 * @author Malik
 *
 */
@WebServlet("/pos")
public class PointOfSale extends BaseAction {
	private static final long serialVersionUID = 1L;

	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String jspMsg = null;
		MenuItemBean[] menuItems = null;
		MenuServiceClient serviceClient = new MenuServiceClient(getCustomerAppCredentials(), MENUITEM_SERVICE_URL);
		menuItems = serviceClient.getAll();
		jspMsg = (menuItems == null)? serviceClient.getResponseMessage() : null;	
		
		if (jspMsg != null)
			request.setAttribute(ParamLabels.JspMsg.MSG, jspMsg);
		if (menuItems != null) {
			request.setAttribute(ParamLabels.MenuItem.MENU_ITEM_BEAN_LIST, menuItems);
			request.setAttribute("jsonMenuItemList", new Gson().toJson(menuItems));
		}
		
		String jspUrl = "/pos.jsp";
		getServletContext().getRequestDispatcher(jspUrl).forward(request, response);
	}

}
