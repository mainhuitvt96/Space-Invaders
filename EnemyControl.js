import Enemy from "./Enemy.js";
import MovingDirection from "./MovinDirection.js";
export default class EnemyController {

    enemyMap = [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [2, 2, 2, 3, 3, 3, 3, 2, 2, 2],
        [2, 2, 2, 3, 3, 3, 3, 2, 2, 2],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
      ]; 
    enemyRows = [];
    
    currentDirection = MovingDirection.right;
    xVelocity = 0;
    yVelocity = 0;
    defaultXVelocity = 1;
    defaultYVelocity = 1;
    moveDownTimerDefaulf = 30;
    moveDownTimer = this.moveDownTimerDefaulf;
    fireBulletTimerDefault = 100;
    fireBulletTimer = this.fireBulletTimerDefault;


    constructor(canvas, enemyBulletController, playerBulletController){
        this.canvas = canvas;
        this.enemyBulletController = enemyBulletController;
        this.playerBulletController = playerBulletController;
        this.enemyDeathSound = new Audio('sounds/enemy-death.wav');
        this.enemyDeathSound.volume = 0.5;
        this.createEnemies();
    }

    draw(ctx){
        this.drawEnemies(ctx);
        this.decrementMoveDownTimer();
        this.updateVelocityAndDirection();
        this.collisionDetection();// phát hiện va chạm giữa đạn của người chơi và kẻ địch
        this.resetMoveDownTimer();
        this.fireBullet();
    }

    
    createEnemies() {
        for(let i =0; i < this.enemyMap.length; i++){
            this.enemyRows[i] = [];
            for(let j =0; j < this.enemyMap[i].length; j++){
                if(this.enemyMap[i][j] >0){
                    this.enemyRows[i].push(new Enemy(j* 50, i*35, this.enemyMap[i][j])); 
                }
            }
        }

    }
    
    drawEnemies(ctx){
        this.enemyRows.flat().forEach((enemy)=>{
            enemy.move(this.xVelocity, this.yVelocity);
            enemy.draw(ctx);
        })
    }

    decrementMoveDownTimer(){
        if(
            this.currentDirection === MovingDirection.downLeft ||
            this.currentDirection === MovingDirection.downRight) {
            this.moveDownTimer--;
        }
    }
    resetMoveDownTimer(){
        if(this.moveDownTimer <= 0){
            this.moveDownTimer = this.moveDownTimerDefaulf;
        }
    }

    moveDown(newDirection){
        this.xVelocity = 0;
        this.yVelocity = this.defaultYVelocity;
        if(this.moveDownTimer <= 0){
            this.currentDirection = newDirection;
            return true;
        }
       return false;
    } 


    updateVelocityAndDirection() {
        for(const enemyRow of this.enemyRows){
            if(this.currentDirection == MovingDirection.right){
                this.xVelocity = this.defaultXVelocity;
                this.yVelocity = 0;
                const rightMostEnemy = enemyRow[enemyRow.length -1];
                if(rightMostEnemy.x +rightMostEnemy.width >=  this.canvas.width) {
                    this.currentDirection = MovingDirection.downLeft;
                    break;
                }  
            } else if(this.currentDirection === MovingDirection.downLeft){
                if(this.moveDown(MovingDirection.left)){
                    break;
                }
            } else if (this.currentDirection === MovingDirection.left){
                this.xVelocity = -this.defaultXVelocity;
                this.yVelocity = 0;
                const  leftMostEnemy = enemyRow[0];
                if(leftMostEnemy.x <= 0) {
                    this.currentDirection = MovingDirection.downRight;
                    break;
                }

        } else if(this.currentDirection === MovingDirection.downRight){
            if(this.moveDown(MovingDirection.right)){
                break;
            }
        }
    }
}
    
    collideWith(sprite){
        return this.enemyRows.flat().some(enemy => enemy.collideWith(sprite));
    }

    collisionDetection(){
        //phương thức để phát hiện va chạm giữa đạn của người chơi và các kẻ địch.Nếu va chạm xảy ra, phương thức sẽ loại bỏ kẻ địch bị tiêu diệt khỏi danh sách các kẻ địch.
        this.enemyRows.forEach(enemyRow =>{
            enemyRow.forEach((enemy, enemyIndex)=> { 
                if(this.playerBulletController.collideWith(enemy)){
                    this.enemyDeathSound.currentTime = 0;
                    this.enemyDeathSound.play(); 
                    enemyRow.splice(enemyIndex, 1); // xóa enemy tại vị trí index của mảng
                }
            });
        });
         this.enemyRows = this.enemyRows.filter(enemyRow=> enemyRow.length>0);
    }


    fireBullet(){ // phương thức này cho phép kẻ địch bắn đạn xuống theo một chu kỳ nhất định
        this.fireBulletTimer--;
        if(this.fireBulletTimer <=0){
            this.fireBulletTimer = this.fireBulletTimerDefault;
            const allEnemies = this.enemyRows.flat();
            const enemyIndex = Math.floor(Math.random() * allEnemies.length);
            const enemy = allEnemies[enemyIndex]; 
            this.enemyBulletController.shoot(enemy.x, enemy.y, -3);      

        }
    }



}



