function SendFBall(){}

SendFBall.init = function(){
	this.canvas = document.getElementById('pitch');
	this.context = this.canvas.getContext('2d');
	this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
	this.fball = new FBallObj();
	this.fball.init();
	this.tx = 0;
	this.tx = 0;
};

SendFBall.to = function(x, y){
	this.tx = x;// * this.canvas.width / 834;
	this.ty = y;// * this.canvas.height / 157;
	this.fball.setCanvasHeight(this.canvas.height);
	this.move();
};

SendFBall.move = function(){
	this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
	var moving = this.fball.toBounce(this.tx, this.ty);
	this.fball.draw(this.context);
	//SendFBall.debug();
	if (moving){
		setTimeout(function(SendFBall) { SendFBall.move(); }, 40, this);
	}	
};

SendFBall.debug = function(){
	this.context.moveTo(this.tx, this.ty-25);
	this.context.lineTo(this.tx, this.ty+25);
	this.context.moveTo(this.tx-25, this.ty);
	this.context.lineTo(this.tx+25, this.ty);
	this.context.strokeStyle = "#f00";
	this.context.stroke();
};