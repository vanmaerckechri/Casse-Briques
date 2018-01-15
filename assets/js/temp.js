var canvas = document.getElementById("scene");
var ctx = canvas.getContext("2d");

var toPlay = 0;
//balle
var ballRadius = 8;
var x = canvas.width/2; //position au commencement de la partie
var y = canvas.height-30;
var dx = 0; // vitesse de deplacement
var dy = 0;
//joueur
var paddleHeight = 10;
var paddleWidth = 90;
var paddleX = (canvas.width-paddleWidth)/2; //position au commencement de la partie
var paddleY = canvas.height-paddleHeight
var speedPlayer = 7;
var rightPressed = false;
var leftPressed = false;
var angleDummyPaddle = 45;
var decreaseAnglePressed = false;
var increaseAnglePressed = false;
var ballCollisionDx = 30;
var ballCollisionDy = 30;
//briques
var brickRowCount = 3;
var brickColumnCount = 8;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 5;
var brickOffsetTop = 65;
var brickOffsetLeft = (canvas.width - ((brickWidth * brickColumnCount) + (brickPadding * brickColumnCount)))/2;
var score = 0;
var lives = 3;

var brickGenIndex = 0;
var brickGenIndexCol = 0;
var brickType = 0;

var bricks = [];
var bricksGenLvl01 = [ // array 1 = briques bonus. array 2 = briques incassables.
    0, 0, 0, 1, 0, 0, 0, 0,
    2, 0, 2, 0, 0, 2, 0, 2,
    0, 0, 0, 0, 1, 0, 0, 0
    ];

function launchCountdown()
{
	let number = 3;
	let text = document.getElementById('countdown');
	text.innerHTML = number;
	text.style.display = 'block';
	text.style.left = canvas.offsetLeft + canvas.width/2 - 33 + 'px' ;
	text.style.top = canvas.offsetTop + canvas.height/2 + 'px';
	countdownTempo = setInterval (function()
		{
			number--;
			text.innerHTML = number;
			if (number < 0)
			{
				clearInterval(countdownTempo);
				text.style.display = 'none';
				toPlay = 1;
				dx = 4;
				dy = -4;
			}
		}, 1000);
}

launchCountdown();

function convertVisualArray()
{
	let brickGenNextIndex = brickColumnCount;

	brickGenIndex += brickColumnCount;

	if (brickGenIndex > (brickColumnCount * (brickRowCount - 1))+brickGenIndexCol)
	{
		brickGenIndexCol++;
		brickGenIndex = brickGenIndexCol
	}
}

function genMap()
{
    for(c=0; c<brickColumnCount; c++)
    {
        bricks[c] = [];
        for(r=0; r<brickRowCount; r++)
        {

        	brickType = bricksGenLvl01[brickGenIndex];
			convertVisualArray();
            bricks[c][r] = { x: 0, y: 0, status: 1, type: brickType };
            brickType = 0;
        }
    }
}
genMap();

	document.addEventListener("keydown", keyDownHandler, false);
	document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e)
{
	if (toPlay == 1)
	{
	    if(e.keyCode == 39)
	    {
	        rightPressed = true;
	    }
	    else if(e.keyCode == 37)
	    {
	        leftPressed = true;
	    }
	    else if(e.keyCode == 40) // a
	    {
	        decreaseAnglePressed = true;
	    }
	    else if(e.keyCode == 38) // e
	    {
	        increaseAnglePressed = true;
	    }
	}
}
function keyUpHandler(e)
{
	if (toPlay == 1)
	{
	    if(e.keyCode == 39)
	    {
	        rightPressed = false;
	    }
	    else if(e.keyCode == 37)
	    {
	        leftPressed = false;
	    }
	    else if(e.keyCode == 40) // a
	    {
	        decreaseAnglePressed = false;
	    }
	    else if(e.keyCode == 38) // e
	    {
	        increaseAnglePressed = false;
	    }
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
            	if(x > b.x - 3 && x < b.x && y > b.y && y < b.y + brickHeight || x < b.x + brickWidth + 3 && x > b.x+brickWidth && y > b.y && y < b.y + brickHeight)
                {
                    dx = -dx;
                    if (b.type <= 1)
                    {
                    	b.status = 0;
                    	score++;
                    }
                    if(score == brickRowCount*brickColumnCount)
                    {
                        alert("YOU WIN, CONGRATS!");
                        document.location.reload();
                    }
                }
                if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight)
                {
                    dy = -dy;
                    if (b.type <= 1)
                    {
                    	b.status = 0;
                    	score++;
                    }
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
    ctx.strokeStyle = "rgba(225, 25, 25, .5)";
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.moveTo(paddleX + paddleWidth/2, paddleY);
    ctx.lineTo(paddleX + (paddleWidth/2) - ballCollisionDx, paddleY - ballCollisionDy);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgba(225, 25, 25, .5)";
    ctx.stroke();
    ctx.closePath();   
}

function drawBall()
{
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = "#EE7600";
    ctx.fill();
    ctx.closePath();
}
function drawPaddle()
{
    ctx.beginPath();
    ctx.rect(paddleX, paddleY, paddleWidth, paddleHeight);
    ctx.fillStyle = "#E75480";
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
                if (bricks[c][r].type == 0)
                {
                    ctx.fillStyle = "#0095DD";
                }
                else if (bricks[c][r].type == 1)
                {
                    ctx.fillStyle = "#0095DD";              
                }
                else if (bricks[c][r].type == 2)
                {
                    ctx.fillStyle = "green";
                }
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
            	toPlay = 0;
                reInit();
                launchCountdown();
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
        angleDummyPaddle = angleDummyPaddle - 2;
    }
    else if (increaseAnglePressed == true && angleDummyPaddle < 60)
    {
        angleDummyPaddle = angleDummyPaddle +2;
    }

    x += dx;
    y += dy;
    requestAnimationFrame(draw);
}
function reInit()
{
	rightPressed = false;
	leftPressed = false;
	increaseAnglePressed = false;
	decreaseAnglePressed = false;
	dx = 0; // vitesse de deplacement
	dy = 0;
    x = canvas.width/2;
    y = canvas.height-30;
    angleDummyPaddle = 45;
    paddleX = (canvas.width-paddleWidth)/2;
}

draw();