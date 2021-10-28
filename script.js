const canvas = document.getElementById("main");
const ctx = canvas.getContext('2d');

const player = {
    x: 0,  y: (canvas.height - 100) / 2, 
    width: 10, height: 100,
    score: 0, color: "yellow",
}
const ball = {
    x: canvas.width / 2, y: canvas.height / 2,
    radius: 10, velocityX: 5,
    velocityY: 5, speed: 9, color: "red"
}
const autoUser = {
    x: canvas.width - 10, 
    y: (canvas.height - 100) / 2, 
    width: 10, height: 100,
    score: 0, color: "yellow"
}
const net = {
    x: (canvas.width - 2) / 2, y: 0,
    height: 10, width: 2, color: "WHITE"
}
function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}
function drawArc(x, y, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, true);
    ctx.closePath(); ctx.fill();
}
function drawNet() {
    for (let i = 0; i <= canvas.height; i += 15) {
        drawRect(net.x, net.y + i, net.width, net.height, net.color);
    }
}
function resetBall(){
    ball.x = canvas.width/2;
    ball.y = canvas.height/2;
    ball.velocityX = -ball.velocityX;
    ball.speed = 7;
}
canvas.addEventListener("mousemove", getMousePos);
function getMousePos(evt) {
    let rect = canvas.getBoundingClientRect();
    player.y = evt.clientY - rect.top - player.height / 2;
}
function drawText(text, x, y) {
    ctx.fillStyle = "#FFF";
    ctx.font = "40px fantasy";
    ctx.fillText(text, x, y);
}
function collionsion(b, p) {
    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;
    
    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;
    
    return p.left < b.right && p.top < b.bottom && p.right > b.left && p.bottom > b.top;
}
function update() {
    if (ball.x - ball.radius < 0) {
        autoUser.score++;
        resetBall();
    } else if (ball.x + ball.radius > canvas.width) {
        player.score++;
        resetBall();
    }
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;
    autoUser.y += ((ball.y - (autoUser.y + autoUser.height/2)))*0.1;

    if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
        ball.velocityY = -ball.velocityY;
    }
    let users = (ball.x + ball.radius < canvas.width/2) ? player : autoUser; 

    if (collionsion(ball,users)) {
        let collidePoint = ( ball.y - (users.y + users.height/2));
        collidePoint = collidePoint / (users.height/2);

        let angleRad = (Math.PI/4) * collidePoint;
        let direction = (ball.x + ball.radius < canvas.width/2) ? 1: -1;
        ball.velocityX = direction * ball.speed * Math.cos(angleRad);
        ball.velocityY = ball.speed * Math.sin(angleRad);
        ball.speed += 0.1;
    }

}
function render(){
    drawRect(0, 0, canvas.width, canvas.height, "#000");
    drawText(player.score,canvas.width/4,canvas.height/5);
    drawText(autoUser.score,3*canvas.width/4,canvas.height/5);
    drawNet();
    drawRect(player.x, player.y, player.width, player.height, player.color);
    drawRect(autoUser.x, autoUser.y, autoUser.width, autoUser.height, autoUser.color);
    drawArc(ball.x, ball.y, ball.radius, ball.color);
}
function game() {
    render(); update();
}
let frameS = 50;
let loop = setInterval(game, 1000 / frameS);
