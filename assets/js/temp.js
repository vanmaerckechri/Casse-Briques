var canvas = document.getElementById("scene");
var ctx = canvas.getContext("2d");

//balle
var ballRadius = 10;
var x = canvas.width/2; //position au commencement de la partie
var y = canvas.height-30;
var dx = 2; // vitesse de deplacement
var dy = -2;
//joueur
var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width-paddleWidth)/2; //position au commencement de la partie
var paddleY = canvas.height-paddleHeight
var speedPlayer = 7;
var rightPressed = false;
var leftPressed = false;
var angleDummyPaddle = 45;
var decreaseAnglePressed = false;
var increaseAnglePressed = false;
var ballCollisionDx = dx * 10;
var ballCollisionDy = dy * 10;
//briques
var brickRowCount = 3;
var brickColumnCount = 9;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 23;
var score = 0;
var lives = 3;

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

var bricks = [];
for(c=0; c<brickColumnCount; c++)
{
    bricks[c] = [];
    for(r=0; r<brickRowCount; r++)
    {
         bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

function keyDownHandler(e)
{
    if(e.keyCode == 39)
    {
        rightPressed = true;
    }
    else if(e.keyCode == 37)
    {
        leftPressed = true;
    }
    else if(e.keyCode == 65) // a
    {
        decreaseAnglePressed = true;
    }
    else if(e.keyCode == 69) // e
    {
        increaseAnglePressed = true;
    }
}
function keyUpHandler(e)
{
    if(e.keyCode == 39)
    {
        rightPressed = false;
    }
    else if(e.keyCode == 37)
    {
        leftPressed = false;
    }
    else if(e.keyCode == 65) // a
    {
        decreaseAnglePressed = false;
    }
    else if(e.keyCode == 69) // e
    {
        increaseAnglePressed = false;
    }
}
function mouseMoveHandler(e)
{
    var relativeX = e.clientX - canvas.offsetLeft;
    if(relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth/2;
    }
}
function collisionDetection()
{
    for(c=0; c<brickColumnCount; c++)
    {
        for(r=0; r<brickRowCount; r++)
        {
            var b = bricks[c][r];
            if(b.status == 1)
            {
                if(x > b.x - 1 && x < b.x + 1  && y > b.y + 1 && y < b.y + brickHeight - 1 || x < b.x+brickWidth + 1 && x > b.x+brickWidth - 1 && y > b.y + 1 && y < b.y + brickHeight - 1)
                {
                    dx = -dx;
                    b.status = 0;
                    score++;
                    if(score == brickRowCount*brickColumnCount)
                    {
                        alert("YOU WIN, CONGRATS!");
                        document.location.reload();
                    }
                }
                if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight)
                {
                    dy = -dy;
                    b.status = 0;
                    score++;
                    if(score == brickRowCount*brickColumnCount)
                    {
                        alert("YOU WIN, CONGRATS!");
                        document.location.reload();
                    }
                }
            }
        }
    }
}

function changeBallAngle()
{
    let distance = Math.sqrt(Math.pow(dx, 2)+Math.pow(dy, 2));
    let dxNegatif = dx < 0 ? -1 : 1;
    let dyNegatif = dy < 0 ? -1 : 1;
    console.log('dx = '+dyNegatif);
    console.log('distance = '+distance);
    dx = distance * Math.cos(angleDummyPaddle * Math.PI / 180); //degré * (Math.PI / 180) => convertir degrés en gradiants.
    dy = distance * Math.sin(angleDummyPaddle * Math.PI / 180);
    dx *= dxNegatif;
    dy *= dyNegatif;
}
function drawDummyAngles()
{
    let distance = Math.sqrt(Math.pow(ballCollisionDx, 2)+Math.pow(ballCollisionDy, 2));
    ballCollisionDx = distance * Math.cos(angleDummyPaddle * Math.PI / 180); //degré * (Math.PI / 180) => convertir degrés en gradiants.
    ballCollisionDy = distance * Math.sin(angleDummyPaddle * Math.PI / 180);

    ctx.beginPath();
    ctx.moveTo(paddleX + paddleWidth/2, paddleY);
    ctx.lineTo(paddleX + (paddleWidth/2) + ballCollisionDx, paddleY - ballCollisionDy);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#0095DD";
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.moveTo(paddleX + paddleWidth/2, paddleY);
    ctx.lineTo(paddleX + (paddleWidth/2) - ballCollisionDx, paddleY - ballCollisionDy);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#0095DD";
    ctx.stroke();
    ctx.closePath();   
}

function drawBall()
{
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}
function drawPaddle()
{
    ctx.beginPath();
    ctx.rect(paddleX, paddleY, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}
function drawBricks()
{
    for(c=0; c<brickColumnCount; c++)
    {
        for(r=0; r<brickRowCount; r++)
        {
            if(bricks[c][r].status == 1)
            {
                var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
                var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#0095DD";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}
function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: "+score, 8, 20);
}
function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Lives: "+lives, canvas.width-65, 20);
}
function draw()
{
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    drawDummyAngles();
    drawScore();
    drawLives();
    collisionDetection();

    if(x + dx > canvas.width-ballRadius || x + dx < ballRadius)
    {
        dx = -dx;
    }
    if(y + dy < ballRadius)
    {
        dy = -dy;
    }
    else if(y + dy > canvas.height-ballRadius)
    {
        if(x > paddleX && x < paddleX + paddleWidth)
        {
            changeBallAngle();
            dy = -dy;
            dx = dx;
        }
        else {
            lives--;
            if(!lives)
            {
                alert("GAME OVER");
                document.location.reload();
            }
            else
            {
                reInit();
            }
        }
    }
    
    if(rightPressed && paddleX < canvas.width-paddleWidth)
    {
        paddleX += 7;
    }
    else if(leftPressed && paddleX > 0)
    {
        paddleX -= 7;
    }

    if(decreaseAnglePressed == true && angleDummyPaddle > 20)
    {
        angleDummyPaddle--;
    }
    else if (increaseAnglePressed == true && angleDummyPaddle < 60)
    {
        angleDummyPaddle++;
    }

    x += dx;
    y += dy;
    requestAnimationFrame(draw);
}
function reInit()
{
    x = canvas.width/2;
    y = canvas.height-30;
    angleDummyPaddle = 45;
    paddleX = (canvas.width-paddleWidth)/2;
}

draw();