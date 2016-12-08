//색상 모음
var colorTree={
	//Vector테두리
	BasicVectorStroke:"#293146",
    SelectVectorStroke:"#929200",//shift키 눌렀을때,Vector테두리색상
    BasicVectorFill:"#ffffff",

	//in,out 링크 색상
	BasicLine:"#a7a6a5",//연결선 색상
    InLine:"#0000FF",//input값의 선 색상
    OutLine:"#FF0000",//output값의 선 색상
	InFill:"#4cc23e",
    OutFill:"#a7a6a5",
	VectorName:"#293146"
};
// 벡터 치수 모음
var vectorSize={
	BasicWidth: 200,
	BasicHeight: 40,
	CornerRadi: 5,
	Font: "15px bold",
	IOStroke: 2,
	IOPI: 2*Math.PI,
	IORadi: 7,
	IODu: 0
};

// html의 클래스와 맞춘다.
var vectorClass={
	CuviewExample:"CuviewExample",
	RawDataSet:"RawDataSet",
	ResultVector:"ResultVector",
	SLModule:"SLModule",
};