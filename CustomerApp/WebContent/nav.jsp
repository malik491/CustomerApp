<nav class="nav-container">
	<div class="nav-content"> 
		<div id="appname">
			Customer App
		</div>
		
		<div id="home">
			<img class="icon" alt="icon" src="${pageContext.request.contextPath}/icons/ic_home_white_36px.svg"
				onclick="location.href = '<%=response.encodeURL(getServletContext().getContextPath() + "/home.jsp") %>'">
		</div>
	</div>
</nav>