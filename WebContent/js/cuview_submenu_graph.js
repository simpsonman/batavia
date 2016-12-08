$(document).ready(function() {

});
$(function () {
	var c=document.getElementById("CuviewGraph");
	var ctx=c.getContext("2d");
	
	var graphWidth = 600;
	var graphHeight = 600;
	var graphScale = 13.5;
	var graphStartX = 20;
	var graphEndY = graphHeight-graphStartX;
	
	// 눈금그리기
	ctx.beginPath();
	ctx.setLineDash([1]);
	ctx.lineWidth=0.2;
	for(var i = graphStartX+graphScale; i<graphWidth; i+=graphScale){	// x축 눈금
		ctx.moveTo(i,0);
		ctx.lineTo(i,graphEndY);
	} 
  	for(var i = graphEndY; i>0; i-=graphScale){	// y축 눈금
		ctx.moveTo(graphStartX,i);
		ctx.lineTo(graphWidth,i);
	} 
 	ctx.stroke();	
 	ctx.closePath();
 	
 	// x, y축 그리기
	ctx.beginPath();
  	ctx.setLineDash([0]);
	ctx.lineWidth=0.5;
	ctx.moveTo(graphStartX,0);
	ctx.lineTo(graphStartX,graphEndY);
	
	ctx.moveTo(graphStartX,graphEndY);
	ctx.lineTo(graphWidth,graphEndY);
	ctx.stroke();	
	ctx.closePath();
	
	ctx.font = "10px Arial";
	//y축 그리기
	ctx.beginPath();
	for(var i = graphEndY, j=0; i>=10; i-=graphScale,j++)
		ctx.fillText(""+j,0,i);	
	ctx.closePath();
	
	//x축 그리기
	ctx.beginPath();
	for(var i = graphStartX, j=0; i<=graphEndY; i+=graphScale,j++)
		ctx.fillText(""+j,i,graphWidth);	
	ctx.closePath();
	
	// 점 그리기
	for(var i = 0; i<100; i++){
		var circleX = Math.floor((Math.random() * 42) + 0);
		var circleY = Math.floor((Math.random() * 42) + 0);
		
		ctx.beginPath();
		ctx.fillStyle="#ff0000";	 
		ctx.arc(graphStartX+(circleX*graphScale), (graphEndY / graphScale -circleY) * graphScale,3,0,2*Math.PI);
		ctx.fill();
		ctx.stroke();	
		ctx.closePath();	
	}
	
	// 선그리기
	var sx = 1;
	var sy = 40;
	var ex = 40;
	var ey = 1;
	
	ctx.beginPath();
	ctx.moveTo(graphStartX+(sx*graphScale), (graphEndY / graphScale - sy) * graphScale);
	ctx.lineTo(graphStartX+(ex*graphScale), (graphEndY / graphScale - ey) * graphScale);
	ctx.stroke();
	ctx.closePath();
	
});