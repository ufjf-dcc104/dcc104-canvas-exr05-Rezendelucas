function Level (){
  this.shots = [];
  this.message = "";
  this.lifeP1 = 3;
  this.lifeP2 = 3;
  this.music = true;
  this.end = false;
  this.colObstaculos = 5;
  this.obstaculos = [];
}

Level.prototype.init = function () {
  var incrementoX = 1;
  var incrementoY = 1;
  var xInit = 60;
  var yInit = 60;
  for(var i = 1 ; i <= this.colObstaculos ; i++){
      for(var j = 1 ; j <= 5 ; j++){    
          var obstaculo = new Sprite();
          obstaculo.x = xInit * incrementoX;
          obstaculo.y = yInit * incrementoY;
          obstaculo.height = 50;
          obstaculo.width = 50;
          incrementoY = incrementoY + 2;
          this.obstaculos.push(obstaculo);   
      }
    incrementoX = incrementoX + 2;
    incrementoY = 1;
  }
};

Level.prototype.mover = function (dt) {

    for (var i = this.shots.length-1;i>=0; i--) {
      this.shots[i].mover(dt);
      if(
        this.shots[i].x >  3000 ||
        this.shots[i].x < -3000 ||
        this.shots[i].y >  3000 ||
        this.shots[i].y < -3000
      ){
        this.shots.splice(i, 1);
      }
    }

};

Level.prototype.desenhar = function (ctx) {
    for (var i = 0; i < this.obstaculos.length; i++) {
      this.obstaculos[i].desenhar(ctx);
    }
};

Level.prototype.desenharImg = function (ctx, imageLib) {
  for (var i = 0; i < this.shots.length; i++) {
    this.shots[i].desenharImg(ctx, imageLib.images[this.shots[i].imgkey]);
  }
};

Level.prototype.fire = function (alvo, audiolib, key, vol){
  if(alvo.cooldown>0 || (alvo.vx == 0 && alvo.vy == 0)) return;
  var tiro = new Player();
  if(alvo.vx > 0){
    tiro.x = alvo.x + 20;
    tiro.y = alvo.y;
  } else if (alvo.vy > 0) {
    tiro.x = alvo.x;
    tiro.y = alvo.y + 20;
  } else if (alvo.vx < 0) {
    tiro.x = alvo.x - 20;
    tiro.y = alvo.y;
  } else if (alvo.vy < 0) {
    tiro.x = alvo.x;
    tiro.y = alvo.y  - 20;
  }
  tiro.vx = alvo.vx;
  tiro.vy = alvo.vy;
  tiro.width = 8;
  tiro.height = 16;
  tiro.imgkey = "shot";
  this.shots.push(tiro);
  alvo.cooldown = 1;
  if(audiolib && key) audiolib.play(key,vol);
};

Level.prototype.colidiuComParede =  function (alvo1, alvo2, al, key, resolveColisao) {
      if(alvo1.x < 0){
          alvo1.x = 1;
      }
      if(alvo1.x > 600){
          alvo1.x = 590;
      }
      if(alvo2.x < 0){
          alvo1.x = 1;
      }
      if(alvo2.x > 600){
          alvo1.x = 590;
      }
      if(alvo1.y < 0){
          alvo1.y = 1;
      }
      if(alvo1.y > 600){
          alvo1.y = 590;
      }
      if(alvo2.y < 0){
          alvo1.y = 1;
      }
      if(alvo2.y > 600){
          alvo1.y = 590;
      }     
};

Level.prototype.colidiuComTiros = function (alvo1, alvo2, al, key, resolveColisao) {
    for (var i = 0; i < this.shots.length; i++) {
      if(this.shots[i].colidiuCom(alvo1)){
        resolveColisao(this.shots[i], alvo1);
        alvo1.x = 50;
        alvo1.y = 490;
        if(al && key){
          al.play(key);
        }
      }
      if(this.shots[i].colidiuCom(alvo2)){
        resolveColisao(this.shots[i], alvo2);
        alvo2.x = 550;
        alvo2.y = 110;
        if(al && key){
          al.play(key);
        }
      }     
    } 
};

Level.prototype.colidiuCenario = function (alvo1, alvo2, al, key, resolveColisao) {
    for (var i = 0; i < this.obstaculos.length; i++) {
      if(this.obstaculos[i].colidiuCom(alvo1)){
        resolveColisao(this.obstaculos[i], alvo1);
        alvo1.x = 50;
        alvo1.y = 490;
        if(al && key){
          al.play(key);
        }
      }
      if(this.obstaculos[i].colidiuCom(alvo2)){
        resolveColisao(this.obstaculos[i], alvo2);
        alvo2.x = 550;
        alvo2.y = 110;
        if(al && key){
          al.play(key);
        }
      }     
    } 
};

Level.prototype.colidiuPlayers = function (alvo1, alvo2, al, key, resolveColisao) {
      if(alvo1.colidiuCom(alvo2)){
        resolveColisao(alvo1, alvo2);
        if(al && key){
          al.play(key);
        }
      }   
};

Level.prototype.playerLife = function(ctx, al = null, key = null){
  if (this.lifeP1 > 0 && this.lifeP2 > 0) {
    return true;
  } else if( this.lifeP1 <= 0) {
    this.message = "Player2 Venceu!";
    ctx.fillText(this.message, 180, 240);
    if(this.music&&al&&key) { 
      al.play(key)
      this.music = false;
    }
    return false;
  } else {
    this.message = "Player1 Venceu!";
    ctx.fillText(this.message, 180, 240);
    if(this.music&&al&&key) { 
      al.play(key)
      this.music = false;
    }
    return false;
  }
};

Level.prototype.victory = function(ctx, al = null, key = null){
    this.inimigos = [];
    this.message = "Você venceu!";
    ctx.fillText(this.message, 180, 240);
    if(this.music&&al&&key) { 
      al.play(key)
      this.music = false;
    }
}

