function FBallObj(){}

FBallObj.prototype.init = function(){
	this.canvasHeight = 100;
	this.img = new Image();
	this.img.src = "resources/images/soccerball.png";
	this.x = 150;
	this.y = 50;
	this.h = 0;
	this.perspectiveScale = 1;
	this.up = true;
	this.height = 46;
	this.width = 46;
	this.speed = 6;
	this.power = 0;
	this.g = 3;
	this.start = true;
	this.bounce = true;
};

FBallObj.prototype.setCanvasHeight = function(canvasHeight){
	this.canvasHeight = canvasHeight;
};

FBallObj.prototype.setPerspectiveScale = function(){
	this.perspectiveScale = 0.5576 + (this.y/this.canvasHeight*0.4424);
};

FBallObj.prototype.draw = function(context){
	var localH = this.height * this.perspectiveScale;
	var localW = this.width * this.perspectiveScale;
	var cx = this.x - (localW / 2);
	var cy = this.y - this.h - (localH / 2);
	context.drawImage(this.img, cx, cy, localH, localW);
};

FBallObj.prototype.toLin = function(x, y){
	if(this.start){
		var distx = x - this.x;
		var disty = y - this.y;
		this.power = parseInt(Math.sqrt(distx*distx + 7*disty*disty)/12);
		this.setPerspectiveScale();
		this.start = false;
	} else {}
	var dx = x - this.x;
	var dy = y - this.y;
	var dxy = Math.sqrt(dx*dx+dy*dy);
	var moving = (dxy>this.speed)? true : false;
	if (moving){
		var theta = Math.atan2(dy, dx);
		var relativeSpeed = this.speed - Math.abs(Math.sin(theta))*(this.speed*0.7);
		relativeSpeed *= Math.pow(this.perspectiveScale, 1);
		document.getElementById("timer").innerHTML = relativeSpeed;
		if(dxy > relativeSpeed){
			this.x += relativeSpeed * Math.cos(theta);
			this.y += relativeSpeed * Math.sin(theta);
		} else {
			this.x = x;
			this.y = y;
		}
		this.setPerspectiveScale();
	}
	return moving;
};

FBallObj.prototype.toBounce = function(x, y){
	var moving = this.toLin(x, y);
	if (this.bounce){
		if(this.up){
			this.h += this.power;
			if (this.power < 1.5*this.g){
				this.power = 0;
				this.up = false;
				if (this.h <= 1.5*this.g) {this.bounce = false;} else {}
			} else {
				this.power -= 1.5*this.g;
			}
		} else {
			this.h -= this.power;
			if (this.power > this.h){
				this.h = 0;
				this.up = true;
			} else {
				this.power += this.g;
			}
		}
	} else {this.h = 0;}
	if(!moving){
		this.str = "";
		this.x = x;
		this.y = y;
		this.h = 0;
		this.up = true;
		this.start = true;
		this.bounce = true;
	}
	return moving;
};
