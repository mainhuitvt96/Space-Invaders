import EnemyController from "./EnemyControl.js";
import Player from "./Player.js";
import BulletController from "./BulletController.js";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = 600;
canvas.height = 590;
const background = new Image();
background.src = "images/space.png";

const playerBulletController = new BulletController(canvas, 10, "red", true); // nhờ biến này
const enemyBulletController = new BulletController(canvas, 4, "white", false);
const enemyController = new EnemyController(canvas, enemyBulletController,playerBulletController);
const player = new Player(canvas, 3, playerBulletController); // tạo tham số từ BulletController nên thừa hưởng luôn function shoot luôn
let isGameOver = false;
let didWin = false;

function game(){
    checkGameOver();
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    displayGameOver();
    
    if(!isGameOver){
        enemyController.draw(ctx);
        player.draw(ctx);
        playerBulletController.draw(ctx);
        enemyBulletController.draw(ctx);
    }

}
function checkGameOver(){
    if(isGameOver == true){
        clearInterval(playGame);
        return;
    }
    if(enemyBulletController.collideWith(player)){
       clearInterval(playGame);
        isGameOver = true;
    }
}
function displayGameOver(){
    if(isGameOver){
        let text = didWin ? "You Win" : "Game Over";
        let textOffSet = didWin ? 3.5: 5;
        ctx.fillStyle = "White";
        ctx.font = "70px Arial";
        ctx.fillText(text, canvas.width/ textOffSet, canvas.height /2);
        music.pause();
    }
    
    if(enemyController.collideWith(player)){
        isGameOver = true;
        music.pause();
    }
    if(enemyController.enemyRows.length === 0){
        didWin = true;
        isGameOver  = true;
        music.pause();
    }
    if(enemyController.y == canvas.height){
        isGameOver = true;
        music.pause();
    }
}

const onOffBtn = document.getElementById('tunrOnOffMusic');
const music = new Audio('sounds/mucsic.mp3');
onOffBtn.addEventListener('click', () => {
    if(music.paused){
        music.play();
        onOffBtn.textContent = 'Turn Off Music';
    } else {
        music.pause();
        onOffBtn.textContent = 'Turn On Music';
    }
});

let resetBtn = document.getElementById('resetGame');
resetBtn.addEventListener('click', () => {
    setTimeout(function(){
        location.reload();
    }, 500);
});
let playGame = setInterval(game, 1000/70);

