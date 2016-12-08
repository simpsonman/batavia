var vectors = [];
var selVecs = [];
var links = [];
var selIO = {};
var selectIdx = -1;
var viewScale = 1;
var mouseOnId = -1;
var scrollLeft = 0;
var scrollTop = 0;

$(document).ready(function() {});
$(function () {
	/*미니맵 부분*/
	var $parent = $( "#CanvasContainer" );
	var $children = $parent.find( '.child' );
	$children.each( function () {
		$( this ).draggable( {
			containment : $parent,
			scroll : false
		} );
	} );
	$( "#minimap" ).minimap( $parent );
		
	$(document).keydown(function(e) {
		if(e.keyCode == 81)	// q를 누르면 
			alert(JSON.stringify(vectors));
		else if(e.keyCode == 37){ // <-
			$("#LeftSideNavigation").hide();
			$("#ClayNavigation").hide();
		}
		else if(e.keyCode == 39){ // ->
			$("#LeftSideNavigation").show();
			$("#ClayNavigation").show();
		}
		else if(e.keyCode == 87) //w
			alert(JSON.stringify(selVecs)); 
		else if(e.keyCode == 69) //e
			alert(JSON.stringify(links));
		else if(e.keyCode == 46 && confirm('선택한 벡터를 전부 삭제하시겠습니까?')){	// delete키를 누르고 OK하면 선택된 벡터들 제거
			deleteVector();
		}
    });
    $(document).bind("contextmenu", function(event) { 
    	event.preventDefault();
    	$("<div class='canvas_menu'></div>").appendTo("body").css({top: event.pageY + "px", left: event.pageX + "px"});
    	var rect = collides(vectors, event.offsetX, event.offsetY);
        if (rect) {
	    	$.get('canvas_menu.html', function(data){
	    		selVecs = [];
	    		selVecs.push(rect.id);
				$( ".canvas_menu" ).html(data);
	    	});
        }else
        	$("div.canvas_menu").hide();
    }).bind("click", function(event) {
    	$("div.canvas_menu").hide();
	});
	$( "#VectorCanvas" ).dblclick(function(ev) {});
	$( "#VectorCanvas" ).mousedown(function(ev) { // 캔버스 마우스 다운 이벤트
		// 클릭한 위치에 활성화된 벡터가 있다면 
		var rect = collides(vectors, ev.offsetX, ev.offsetY);
        if (rect) {
            selectIdx = JSON.parse(JSON.stringify(rect)).id; // 클릭한 벡터 저장
          	vectorInfoUpdate(selectIdx);
        }
        selIO = IOcollides(vectors, ev.offsetX, ev.offsetY);     
	});
	$( "#VectorCanvas" ).mousemove(function( ev ) { // 캔버스 마우스 무브 이벤트
		scrollLeft = $("#CanvasContainer").scrollLeft();
		scrollTop = $("#CanvasContainer").scrollTop();
		var selectCanvas=document.getElementById("VectorCanvas");
		var bRect = selectCanvas.getBoundingClientRect();
		var rect = collides(vectors, ev.offsetX, ev.offsetY);
        if (rect){
        	mouseOnId = JSON.parse(JSON.stringify(rect)).id;
        	drawAllVectors();
        }else mouseOnId = -1;
		if(selectIdx >= 0){	// 벡터를 클릭한 채 유지하고 있다면
			// 클릭한 벡터의 위치 업데이트		
			vectors[selectIdx] = vectorLocationUpdate(selectIdx,vectors[selectIdx].class, ev);
			//$( "#ClayLog" ).text(JSON.stringify(vectors[selectIdx]));// 어트리뷰트에 벡터 좌표 전송
			drawAllVectors(); // 캔버스 다시그리기
		}else if(!jQuery.isEmptyObject(selIO)){
			if(selIO.pin != -1){
				drawTempLink(vectors[selIO.id].pin[selIO.pin].x, vectors[selIO.id].pin[selIO.pin].y, ev.clientX+scrollLeft, ev.clientY+scrollTop,colorTree.InLine);	
			}else if(selIO.pout != -1){
				drawTempLink(vectors[selIO.id].pout[selIO.pout].x, vectors[selIO.id].pout[selIO.pout].y, ev.clientX+scrollLeft, ev.clientY+scrollTop,colorTree.OutLine);
			}
		}else{ // 벡터를 더블클릭이나 클릭하고 있는 상태가 아니라면
			//$( "#ClayLog" ).text(ev.clientX + ", " + ev.clientY+ ", " +scrollLeft+ ", " +scrollTop);	//어트리뷰트에 마우스 좌표 송출		
			drawAllVectors(); // 캔버스 다시그리기	
		}
		vectorInfoUpdate(selectIdx);
	});
	$( "#VectorCanvas" ).click(function(ev) { // 캔버스 클릭 이벤트(빈 곳을 클릭했다면)
		//더블클릭 노드 연결 이벤트
		var rect = collides(vectors, ev.offsetX, ev.offsetY);
		if (rect && $.inArray(rect.id, selVecs) == -1 && ev.shiftKey)
		 		selVecs.push(rect.id);
		else selVecs = [];
		drawAllVectors(); // 캔버스 다시그리기
		$( "#CanvasSubMenu" ).hide();
	});
	$( "#VectorCanvas" ).mouseup (function(ev) {
		selectIdx = -1; // 클릭 취소
		if(!jQuery.isEmptyObject(selIO)){
			var target = IOcollides(vectors, ev.offsetX, ev.offsetY);
			if(selIO.pin != -1 && target.pout != -1){
				var tmp = LinkInfo(target.id, target.pout, selIO.id, selIO.pin);
				var chk = true;
				for(var i = 0; i< links.length; i++)
					if(angular.equals(links[i],tmp)){
						chk = false;
						break;
					}
				if(chk)
					links.push(tmp);	
			}else if(selIO.pout != -1 && target.pin != -1){
				var tmp = LinkInfo(selIO.id, selIO.pout, target.id, target.pin);
				var chk = true;
				for(var i = 0; i< links.length; i++)
					if(angular.equals(links[i],tmp)){
						chk = false;
						break;
					}
				if(chk)
					links.push(tmp);	
			}
		}
		selIO = {};
	});
	$( "#ClayActivation" ).click(function(ev) {
		//$( "#ClayLog" ).text(JSON.stringify(ev));
	});
});
function updateSlider(slideAmount) {
	//if(viewScale > 0.7 && viewScale < 1.3){
		viewScale = slideAmount;
		//$( "#ClayLog" ).text(viewScale);
		drawAllVectors();
	//}
}
//링크 제거 함수
function releaseLink(){
	var id = $( "#AttrID" ).text();
	for(var i = 0; i< links.length; i++)
		if(links[i].outid == id || links[i].inid == id)
			links.splice(i--,1);
	drawAllVectors(); 
}

function vectorInfoUpdate(vid){
	$( "#AttrID" ).text(vectors[vid].id);
    $( "#AttrVectorType" ).text(vectors[vid].class);
    $( "#AttrName" ).val(vectors[vid].name);
    $( "#AttrX" ).text(vectors[vid].x);
    $( "#AttrY" ).text(vectors[vid].y);
    $("#AttrScript").text("");
    $("#AttrScript").append(vectors[vid].type == vectorClass.SLModule?"<textarea id=\"scriptContent\" onkeyup=\"updateScript()\">"+(vectors[vid].script != null?vectors[vid].script:"")+"</textarea>":"");
}

function nameChange(){
	var id = $( "#AttrID" ).text();
	vectors[id].name = $("#AttrName").val();
	drawAllVectors();
	$("#ClayActivation").text("");	//액티베이션 리스트 초기화 및 다시 추가하기
	for(var i = 0; i < vectors.length; i++)
		addActivationItem(i, vectors[i].name);
}

function updateScript(){
	var id = $( "#AttrID" ).text();
	vectors[id].script = $("#scriptContent").val();
}

// 활성화벡터 리스트 체크박스 감지 함수
function toggleCheckbox(chkobj){
	vectors[chkobj.id].visibility = chkobj.checked?true:false;
	drawAllVectors();
}

// 활성화 벡터 이동 좌표 변경 함수
function vectorLocationUpdate(id,type, ev){
	var preVec = vectors[id];
	var reVec = VectorStructure(id, ev.clientX+scrollLeft, ev.clientY+scrollTop,preVec.type, preVec.name, preVec.pin.length, preVec.pout.length);
	reVec.script = preVec.script;
	reVec.data = preVec.data;
	return reVec;
}  

// 이벤트가 발생된 좌표 위치에 특정 벡터가 존재하는지 판별하는 함수
function collides(objs, x, y) {
    var isCollision = false;
    var dragHoldX, dragHoldY;
    for (var i = 0; i < objs.length; i++) {
        var left = objs[i].x, right = objs[i].x+objs[i].w;
	    var top = objs[i].y, bottom = objs[i].y+objs[i].h;
	    if (right >= x && left <= x && bottom >= y && top <= y) {
	        dragHoldX = x - objs[i].x; //클릭한 위치 x,y 전역변수 저장 move이벤트 발생시 사용
			dragHoldY = y - objs[i].y;
		    isCollision = objs[i];
	    }
    }
    return isCollision;
}

// 이벤트가 발생된 좌표 위치에 특정 벡터의 IO가 존재하는지 판별하는 함수
function IOcollides(objs, x, y) {
	//alert("dd");
    var idxInfo = {id:-1, pin:-1, pout:-1};
    for(var i = 0; i< objs.length; i++){
    	for(var j = 0; j< objs[i].pin.length; j++){
    		if(Math.pow(x-objs[i].pin[j].x,2)+Math.pow(y-objs[i].pin[j].y,2) < Math.pow(vectorSize.IORadi,2)){
    			idxInfo.id = i;
    			idxInfo.pin = j;
    			break;
    		}
    	}
    	for(var j = 0; j< objs[i].pout.length; j++){
    		if(Math.pow(x-objs[i].pout[j].x,2)+Math.pow(y-objs[i].pout[j].y,2) < Math.pow(vectorSize.IORadi,2)){
    			idxInfo.id = i;
    			idxInfo.pout = j;
    			break;
    		}			
    	}
    }
    return idxInfo;
}

function allowDrop(ev) {
   ev.preventDefault();
}

function drag(ev) {
	// 트리뷰에서 드래그 하는 벡터 정보 임시저장
	ev.dataTransfer.setData("id", ev.target.id);
	ev.dataTransfer.setData("class", ev.target.className);
}

function drop(ev) {	
	ev.preventDefault();
    // 벡터 배열에 백터 추가
	switch(ev.dataTransfer.getData("class")){	
		case vectorClass.CuviewExample:
			$.get('/CUVIEW/ExampleLoad', {}, function(data){
				loadExample(data, ev);
	    	});
			break;
		case vectorClass.RawDataSet: 										  //w,h,백터name
			vectors.push(VectorStructure(vectors.length, ev.clientX+scrollLeft, ev.clientY+scrollTop, vectorClass.RawDataSet, ev.dataTransfer.getData("id"),1,1));
			addActivationItem(vectors.length-1, vectors[vectors.length-1].name);	// 활성 벡터 리스트에 추가
			break;
		/*case vectorClass.ResultVector: 			
			addActivationItem(vectors.length);	
			vectors.push(VectorStructure(vectors.length, ev.clientX+scrollLeft, ev.clientY+scrollTop, vectorClass.ResultVector, ev.dataTransfer.getData("id"),1,0));
			break;*/
		case vectorClass.SLModule: 										  //w,h,백터name
			vectors.push(VectorStructure(vectors.length, ev.clientX+scrollLeft, ev.clientY+scrollTop, vectorClass.SLModule, ev.dataTransfer.getData("id"),1,1));
			addActivationItem(vectors.length-1, vectors[vectors.length-1].name);	// 활성 벡터 리스트에 추가
			break;
	}	
    drawAllVectors();	
}

// 예제 불러오는 매서드
function loadExample(jsonArr, ev){	
	var exVec = VectorStructure(vectors.length, ev.clientX+scrollLeft, ev.clientY+scrollTop, vectorClass.RawDataSet, ev.dataTransfer.getData("id"),0,1);
	var allData = [];
	var tline = [];
	var result = $.parseJSON(jsonArr);
	
	$.each(result[0], function(key, val) {
		tline.push(key);
	});
	allData.push(tline);
	for(var i = 0; i< result.length; i++){
		tline = [];
		$.each(result[i], function(key, val) {
			tline.push(val);
		});
		allData.push(tline);
	}
	exVec.data = allData;
	vectors.push(exVec);
	addActivationItem(vectors.length-1, vectors[vectors.length-1].name);	// 활성 벡터 리스트에 추가
}

// 활성 벡터 리스트에 추가하는 함수
function addActivationItem(item, name){  
    $("#ClayActivation").append("<li style=\"margin:0;padding:0;\"><input type=\"checkbox\" onchange=\"toggleCheckbox(this)\" class=\"ActivationList\" id=\""+item+"\" checked=\"checked\"/><label for=\""+item+"\">"+name+"</label></li>");  
}

// 활성 벡터 전체 그려주는 함수
function drawAllVectors(){
	var canvas=document.getElementById("VectorCanvas");
	var ctx=canvas.getContext("2d");
	//ctx.translate(0,0);
	ctx.scale(viewScale, viewScale);
	
	
	// 그리기 전 캔버스 초기화
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	
	for(var i = 0; i<vectors.length; i++){
		if(vectors[i].visibility == false)
			continue;
		ctx.strokeStyle = colorTree.BasicVectorStroke;
		ctx.beginPath();
		
		/*var tempvar = parseInt(vectors[i].name.length)*2;		//백터이름 중앙에 출력 
		var textx = vectors[i].x+vectors[i].w/2-tempvar;
		var texty = vectors[i].y+vectors[i].h/2;*/
		var textx = vectors[i].x+10;
		var texty = vectors[i].y+vectors[i].h*0.6;
		ctx.lineJoin = "round";
		ctx.lineWidth = vectorSize.CornerRadi+((mouseOnId==i)?5:0);
		ctx.fillStyle= colorTree.BasicVectorFill;
		ctx.strokeStyle=colorTree.BasicVectorStroke;
		ctx.setLineDash($.inArray(i, selVecs) != -1?[3,3]:[0, 0]);
		ctx.strokeRect(vectors[i].x, vectors[i].y, vectors[i].w, vectors[i].h);
		ctx.fillRect(vectors[i].x, vectors[i].y, vectors[i].w, vectors[i].h);
		ctx.fillStyle = colorTree.VectorName;	//백터 이름 색상
		ctx.font = vectorSize.Font;
		ctx.fillText(vectors[i].name,textx,texty);//백터 이름 출력
		ctx.stroke();
		ctx.closePath();
		ctx.setLineDash([0, 0]);
		
		
		// input 표시	
		for(var j = 0; j<vectors[i].pin.length; j++){
			ctx.beginPath();
			ctx.fillStyle=colorTree.InFill;	//색상
			ctx.lineWidth = vectorSize.IOStroke; 
			ctx.arc(vectors[i].pin[j].x, vectors[i].pin[j].y,vectorSize.IORadi,vectorSize.IODu,vectorSize.IOPI)
			ctx.fill();
			ctx.fillStyle = colorTree.BasicVectorStroke;
			ctx.stroke();
			ctx.closePath();
		}
			
		// output 표시
		for(var j = 0; j<vectors[i].pout.length; j++){
			ctx.beginPath();
			ctx.fillStyle=colorTree.OutFill;	//색상
			ctx.lineWidth = vectorSize.IOStroke; 
			ctx.arc(vectors[i].pout[j].x, vectors[i].pout[j].y,vectorSize.IORadi,vectorSize.IODu,vectorSize.IOPI)
			ctx.fill();
			ctx.fillStyle = colorTree.BasicVectorStroke;
			ctx.stroke();	
			ctx.closePath();
		}	
	}
	//링크 그리기
	for(var i = 0; i<links.length; i++)
		if(vectors[links[i].outid].visibility && vectors[links[i].inid].visibility)
			linkDraw(vectors[links[i].outid].pout[links[i].outnum], vectors[links[i].inid].pin[links[i].innum]);
	cloneCanvas(canvas);
}

function cloneCanvas(oldCanvas) {
    var newCanvas = document.getElementById("CloneCanvas");
    var context = newCanvas.getContext('2d');
    context.scale(0.1, 0.1);
	context.drawImage(oldCanvas, 0, 0);
    return newCanvas;
}

// 벡터에서 발생한 임시 링크 그려주는 함수 dbclick시 링크
function drawTempLink(sx,sy,ex,ey,lineColor){
	drawAllVectors();
	var canvas=document.getElementById("VectorCanvas");
	var ctx=canvas.getContext("2d");
	ctx.lineWidth = 1;
	ctx.strokeStyle=lineColor;
	ctx.beginPath();
	ctx.moveTo(sx,sy);
	ctx.lineTo(ex, ey);
	ctx.stroke();
}

function linkDraw(pout, pin){
	var canvas=document.getElementById("VectorCanvas");
	var ctx=canvas.getContext("2d");
	ctx.lineWidth = 3;
	ctx.strokeStyle = colorTree.BasicLine;
	ctx.beginPath();
	ctx.moveTo(pout.x, pout.y);
	var xw = (pout.x - pin.x);
	var yw = (pout.y - pin.y);
	ctx.bezierCurveTo(pout.x-xw*0.1, pout.y-yw*0.9, pout.x-xw*0.9, pout.y-yw*0.1, pin.x, pin.y);
	ctx.stroke();
}	

function deleteVector(){
	selVecs.sort();
	selVecs.reverse();	// 삭제하면서 인덱스가 꼬이지 않기 위해 선택된 벡터들의 인덱스를 내림차순정렬함
	for(var i = 0; i<selVecs.length; i++){
		// 현재 벡터의 연결정보 삭제
		for(var j = 0; j<links.length; j++)
			if(links[j].outid == selVecs[i] || links[j].inid == selVecs[i])
				links.splice(j,1);
		// 현재 벡터보다 인덱스가 뒤에 있는 벡터들의 아이디 차감
		for(var j = selVecs[i]+1; j<vectors.length; j++)
			vectors[j].id--;
		// 전체 연결정보에서 현재 벡터보다 인덱스가 뒤에 있는 벡터들의 인덱스 차감
		for(var j = 0; j<links.length; j++){
			if(selVecs[i] < links[j].outid)
				links[j].outid--;
			if(selVecs[i] < links[j].inid)
				links[j].inid--;
		}
		// 벡터 정보 제거
		vectors.splice(selVecs[i],1);	//벡터 정보 제거
	}
	selVecs = []; //벡터 선택리스트 초기화
	drawAllVectors(); // 캔버스 다시그리기
	$("#ClayActivation").text("");	//액티베이션 리스트 초기화 및 다시 추가하기
	for(var i = 0; i < vectors.length; i++)
		addActivationItem(i, vectors[i].name);
}