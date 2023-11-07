import Bullet from "./Bullet.js";

export default class BulletController {
        bullets = [];
        timeTillNextBulletAllowed =0; // thời gian cho đến khi viên đạn tiếp theo được bắn

    constructor(canvas, maxBulletAtATime, bulletColor, soundEnabled) {
        this.canvas = canvas;
        this.maxBulletAtATime = maxBulletAtATime; 
        this.bulletColor = bulletColor;
        this.soundEnabled = soundEnabled;

        this.shootSound = new Audio("sounds/shoot.wav");
        this.shootSound.volume = 0.5; 
    }

    draw(ctx){
        this.bullets = this.bullets.filter((bullet)=>bullet.y + bullet.width > 0 && bullet.y <= this.canvas.height); 
        // thêm dòng này để số lượng đạn bắn ra không bị giới hạn bởi số lượng 10 như dòng code bên dưới
        this.bullets.forEach((bullet) => bullet.draw(ctx));
        if(this.timeTillNextBulletAllowed>0){ 
            this.timeTillNextBulletAllowed--;
        }  
    }
    collideWith(sprite){
        const bulletThatHitSpriteIndex = this.bullets.findIndex(bullet => bullet.collideWith(sprite));
        if(bulletThatHitSpriteIndex>=0){
            this.bullets.splice(bulletThatHitSpriteIndex,1); // nếu tìm được xóa tại vị trí index
            return true;
        }
        return false;
    }

    shoot(x, y, velocity, timeTillNextBulletAllowed = 0){
        if(this.timeTillNextBulletAllowed <=0 && this.bullets.length < this.maxBulletAtATime) {
                const bullet = new Bullet(this.canvas, x, y, velocity, this.bulletColor);
                this.bullets.push(bullet);
                if(this.soundEnabled){
                    this.shootSound.currentTime = 0;
                    this.shootSound.play();
                }
            this.timeTillNextBulletAllowed = timeTillNextBulletAllowed;
            }
    }
}