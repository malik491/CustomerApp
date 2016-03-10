<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<title>Customer App</title>
	<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/css/component.css" />
	</head>
<body>
<jsp:include page="/nav.jsp"></jsp:include>

<main class="main">
	
	<img class="home-action" id="place-action" alt="restaurant icon" src="${pageContext.request.contextPath}/icons/food-red-100.png"
		onClick="location.href = '<%=response.encodeURL(getServletContext().getContextPath() + "/pos") %>'">
	
	<img class="home-action" alt="restaurant icon" src="${pageContext.request.contextPath}/icons/track-100.png"
		onClick="location.href = '<%=response.encodeURL(getServletContext().getContextPath() + "/track") %>'">
</main>
</body>
</html>