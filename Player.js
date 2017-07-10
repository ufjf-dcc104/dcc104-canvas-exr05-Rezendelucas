function Player(){
  this.x = 0;
  this.y = 0;
  this.vx = 0;
  this.vy = 0
  this.ax = 0;
  this.ay = 0;
  this.width = 32;
  this.height = 32;
  this.angle = 0;
  this.color = "blue";
  this.cooldown = 0;
}

Player.prototype.desenhar = function (ctx) {
  ctx.save();
  ctx.translate(this.x, this.y);
  ctx.rotate(this.angle*2*Math.PI/360);
  ctx.fillStyle = "black";
  ctx.fillRect(-this.width/2, -this.height/2, this.width, this.height);
  ctx.fill();
  ctx.strokeStyle = "black";
  ctx.stroke();
  ctx.strokeRect(-this.width/2, -this.height/2, this.width, this.height);
  ctx.restore();
};

Player.prototype.desenharImg = function (ctx, img) {
  ctx.save();
  ctx.translate(this.x, this.y);
  ctx.rotate(this.angle*2*Math.PI/360);
  ctx.fillStyle = this.color;
  ctx.drawImage(img, -this.width/2, -this.height/2, this.width, this.height);
  if(this.debug){
    ctx.strokeStyle = "grey";
    ctx.strokeRect(-this.width/2, -this.height/2, this.width, this.height);
  }
  ctx.restore();
};

Player.prototype.mover = function (dt) {
  if(this.imgkey == "shot"){
    this.vx = this.vx + this.ax*dt;
    this.x = this.x + this.vx*dt;
    this.vy = this.vy + this.ay*dt;
    this.y = this.y + this.vy*dt;
  }
  this.vy = this.vy + this.ay*dt;
  this.y = this.y + this.vy*dt;
  this.vx = this.vx + this.ax*dt;
  this.x = this.x + this.vx*dt;
  if(this.cooldown>0) {
    this.cooldown -= dt;
  } else {
    this.cooldown = 0;
  }
};

Player.prototype.colidiuCenario = function (ctx) {
  if(this.x >= 1080){
    this.x = 1080;
  }
  else if(this.x <= 0){
    this.x = 0;
  } 
  else if(this.y >= 480){
    this.y = 480;
  } 
  else if(this.y <= 0){
    this.y = 0;
  }
};

Player.prototype.colidiuCom = function (alvo) {
  if(this.x + this.width/2 < alvo.x - alvo.width/2)   return false;  // colisão pela esquerda
  if(this.x - this.width/2 > alvo.x + alvo.width/2)   return false;  // colisão pela direita
  if(this.y + this.height/2 < alvo.y - alvo.height/2)  return false;  //  colisão por cima
  if(this.y - this.height/2 > alvo.y + alvo.height/2)  return false;  // colisão por baixo
  return true;
};
