function Level (){
  this.shots = [];
  this.message = "";
  this.lifeP1 = 3;
  this.lifeP2 = 3;
  this.music = true;
  this.end = false;
  this.colObstaculos = 3;
  this.obstaculos = [];
}

Level.prototype.init = function () {
  var incrementoX = 1;
  var incrementoY = 1;
  var xInit = 100;
  var yInit = 100;
  for(var i = 1 ; i <= this.colObstaculos ; i++){
      for(var j = 1 ; j <= 3 ; j++){    
          var obstaculo = new Sprite();
          obstaculo.x = xInit * incrementoX;
          obstaculo.y = yInit * incrementoY;
          obstaculo.height = 80;
          obstaculo.width = 80;
          obstaculo.imgkey = "meteor";
          incrementoY = incrementoY + 2;
          this.obstaculos.push(obstaculo);   
      }
    incrementoX = incrementoX + 2;
    incrementoY = 1;
  }
};

Level.prototype.mover = function (dt) {

    for (var i = this.shots.length-1;i>=0; i--) {
      this.shots[i].moverAng(dt);
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

Level.prototype.desenharLevel = function (ctx, imageLib) {
    for (var i = 0; i < this.obstaculos.length; i++) {
      this.obstaculos[i].desenharMeteoro(ctx, imageLib.images[this.obstaculos[i].imgkey]);
    }
    for (var i = 0; i < this.shots.length; i++) {
    this.shots[i].desenharShot(ctx, imageLib.images[this.shots[i].imgkey]);
  }
};

Level.prototype.fire = function (alvo, tag ,audiolib, key, vol){
  if(alvo.cooldown>0) return;
  var tiro = new Sprite;
  tiro.x = alvo.x;
  tiro.y = alvo.y;
  tiro.angle = alvo.angle;
  tiro.am = -1000;
  tiro.width = 8;
  tiro.height = 16;
  tiro.imgkey = "shot";
  tiro.tag = tag;
  this.shots.push(tiro);
  alvo.cooldown = 0.8;
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
      if(this.shots[i].colidiuCom(alvo1) && this.shots[i].tag == 2){
        resolveColisao(this.shots[i], alvo1);
        alvo1.x = 30;
        alvo1.y = 490;
        this.lifeP1--;
        if(al && key){
          al.play(key);
        }
        this.shots.splice(i, 1);
      }
      else if(this.shots[i].colidiuCom(alvo2) && this.shots[i].tag == 1){
        resolveColisao(this.shots[i], alvo2);
        alvo2.x = 570;
        alvo2.y = 110;
        this.lifeP2--;
        if(al && key){
          al.play(key);
        }
        this.shots.splice(i, 1);
      }     
    } 
};

Level.prototype.colidiuCenario = function (alvo1, alvo2, al, key, resolveColisao) {
    for (var i = 0; i < this.obstaculos.length; i++) {
      if(this.obstaculos[i].colidiuCom(alvo1)){
        resolveColisao(this.obstaculos[i], alvo1);
        alvo1.x = 30;
        alvo1.y = 490;
        this.lifeP1--;
        if(al && key){
          al.play(key);
        }
      }
      if(this.obstaculos[i].colidiuCom(alvo2)){
        resolveColisao(this.obstaculos[i], alvo2);
        alvo2.x = 570;
        alvo2.y = 110;
        this.lifeP2--;
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

Level.prototype.colidiuTirosMeteoros = function () {
       for (var i = 0; i < this.obstaculos.length; i++) {
         for (var j = 0; j < this.shots.length; j++) {
             if(this.shots[j].colidiuCom(this.obstaculos[i])){
                this.shots.splice(j, 1);
             }
         }
       }
};

Level.prototype.vitoria = function(ctx, al = null, key = null){
  if (this.lifeP1 > 0 && this.lifeP2 > 0) {
    return true;
  } else if( this.lifeP1 <= 0) {
    this.message = "Player2 Venceu!";
    return false;
  } else {
    this.message = "Player1 Venceu!";
    return false;
  }
};

