// 벡터 구조 JSON
function VectorStructure(id, x, y, type, name, icount, ocount){
	this.visibility = true;
	this.id = id;
	this.x = x;
	this.y = y;
	this.type = type;
	this.name = name;
	this.pin = [];
	for(var i = 1, ran = vectorSize.BasicWidth / (icount+1); i<=icount; i++)
		this.pin.push({x:this.x+(ran*i), y:this.y-3});
	this.pout = [];
	for(var i = 1, ran = vectorSize.BasicWidth / (ocount+1); i<=ocount; i++)
		this.pout.push({x:this.x+(ran*i), y:(this.y+vectorSize.BasicHeight+3)});
	return {id:this.id, visibility: this.visibility, data: null, script: null, x: this.x, y: this.y, h: vectorSize.BasicHeight, w: vectorSize.BasicWidth, type: this.type, name: this.name, pin:this.pin, pout:this.pout};
}

// 벡터 연결정보      출력벡터 출력벡터out 입력벡터 입력벡터input
function LinkInfo(outid, outnum, inid, innum){
	this.outid = outid;
	this.outnum = outnum;
	this.inid = inid;
	this.innum = innum;
	return {outid: this.outid, outnum: this.outnum, inid: this.inid, innum: this.innum};
}
