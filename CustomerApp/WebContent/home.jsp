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
	
	<div class="action"> 
		<img alt="restaurant icon" src="${pageContext.request.contextPath}/icons/ic_restaurant_black_48px.svg">
		<a class="btn" href="<%=response.encodeURL(getServletContext().getContextPath() + "/pos")%>"> Place Online Order </a>
	</div>
	
	<div class="action"> 
		<img alt="track icon" src="${pageContext.request.contextPath}/icons/ic_track_black_48px.svg">
		<a class="btn" href="<%=response.encodeURL(getServletContext().getContextPath() + "/track")%>"> Track Order </a>
	</div>
</main>
</body>
</html>