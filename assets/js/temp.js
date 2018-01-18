var canvas = document.getElementById("scene");
var ctx = canvas.getContext("2d");

var text = document.getElementById('countdown');
var toPlay = 0;
//balle
var ballRadius = 8;
var x = canvas.width/2; //position au commencement de la partie
var y = canvas.height-30;
var dx = 0; // vitesse de deplacement
var dy = 0;
//joueur
var paddleWidth = 90;
var paddleHeight = 10;
var paddle = {width: paddleWidth, height: paddleHeight};
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
// bonus
var bonusNbrDif = 4;
var bonusNbrIngame = 3;
var img00 = new Image(), img01 = new Image(), img02 = new Image(), img03 = new Image();
img00.src = 'assets/img/bonus_increaseWidth.png';
img01.src = 'assets/img/bonus_decreaseWidth.png';
img02.src = 'assets/img/bonus_decreaseSpeedBall.png';
img03.src = 'assets/img/bonus_increaseSpeedBall.png';
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
var briquesNbrPourVictoire = 0;

var bricks = [];
var bricksGenLvl01 = [ // array 1 = briques bonus. array 2 = briques incassables.
    0, 0, 0, 1, 0, 0, 0, 1,
    2, 0, 2, 0, 0, 2, 0, 2,
    0, 0, 0, 0, 1, 0, 0, 0
    ];
    
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function placeCoundown()
{
    text.style.left = canvas.offsetLeft + canvas.width/2 - 33 + 'px' ;
    text.style.top = canvas.offsetTop + canvas.height/2 + 'px';
}
function launchCountdown()
{
    let number = 3;
    text.innerHTML = number;
    text.style.display = 'block';
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
        	if (brickType <= 1)
        	{
        		briquesNbrPourVictoire++
        	}
			convertVisualArray();
            bricks[c][r] = { x: 0, y: 0, status: 1, type: brickType, bonus: -1, bonusY: brickOffsetTop, cycleParticles: 0, particlePosX : [], particulePosY: [], particuleDirection: 0, colorR: [], colorG: [], colorB: []};
            let brique = bricks[c][r];
            if (brickType == 1)
            {
                brique.bonus = Math.floor(Math.random()*bonusNbrDif);
            }
            brickType = 0;
        }
    }
}

function genBonus(nbr)
{

}

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

function recordPaddleDirection(c, r)
{
    if (dx > 0 && dy < 0)
    {
        bricks[c][r].particuleDirection = 1;
    }
    else if (dx > 0 && dy > 0)
    {
        bricks[c][r].particuleDirection = 2;
    }
    else if (dx < 0 && dy > 0)
    {
        bricks[c][r].particuleDirection = 3;
    }
    else
    {
        bricks[c][r].particuleDirection = 4;
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
            	if(x > b.x - ballRadius && x < b.x && y  > b.y -ballRadius && y < b.y + brickHeight +ballRadius || x < b.x + brickWidth + ballRadius && x > b.x+brickWidth && y  > b.y -ballRadius && y < b.y + brickHeight +ballRadius)
                {
                    recordPaddleDirection(c, r);
                    dx = -dx;
                    if (b.type <= 1)
                    {
                    	b.status = 0;
                        b.cycleParticles = 1;
                    	score++;
                    }
                    if(score == briquesNbrPourVictoire)
                    {
                        alert("YOU WIN, CONGRATS!");
                        document.location.reload();
                    }
                }
                if(x > b.x && x < b.x+brickWidth && y + ballRadius > b.y && y - ballRadius < b.y+brickHeight)
                {
                    recordPaddleDirection(c, r);
                    dy = -dy;
                    if (b.type <= 1)
                    {
                    	b.status = 0;
                        b.cycleParticles = 1;
                    	score++;
                    }
                    if(score == briquesNbrPourVictoire)
                    {
                        alert("YOU WIN, CONGRATS!");
                        document.location.reload();
                    }
                }
            }
        }
    }

}
function collisionBonus(briqueX, briqueY, brique) // C EST DE LA MERDE !!!
{
    if (briqueX > paddleX && briqueX < paddleX + paddleWidth && brique.bonusY > paddleY && brique.bonusY < paddleY + paddleHeight)
    {
        if (brique.bonus == 0 && paddle.width < 140)
        {
            paddle.width = paddle.width + 20;
        }
        if (brique.bonus == 1 && paddle.width > 50)
        {
            paddle.width = paddle.width - 20;
        }
        if (brique.bonus == 1 && dx > 2)
        {
            dx--;
        }
        if (brique.bonus == 1 && dx < 2)
        {
            dx++;
        }
        briqueY = canvas.height + 50;
    }
    if (briqueY > canvas.height)
    {
        brique.type = 0;
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
    ctx.moveTo(paddleX + paddle.width/2, paddleY);
    ctx.lineTo(paddleX + (paddle.width/2) + ballCollisionDx, paddleY - ballCollisionDy);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgba(225, 25, 25, .5)";
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.moveTo(paddleX + paddle.width/2, paddleY);
    ctx.lineTo(paddleX + (paddle.width/2) - ballCollisionDx, paddleY - ballCollisionDy);
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
    ctx.rect(paddleX, paddleY, paddle.width, paddleHeight);
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
function drawBonus()
{
    let particlesMax = 30;
    for(c=0; c<brickColumnCount; c++)
    {
        for(r=0; r<brickRowCount; r++)
        {
            let brique = bricks[c][r];
            if(brique.status == 0 && brique.type == 1)
            {
                let nomVariableImg = 'img0'+brique.bonus;
                ctx.drawImage(eval(nomVariableImg), brique.x+brickWidth/2-12.5, brique.bonusY+brickHeight/2-12.5, 25, 25);
                collisionBonus(brique.x, brique.bonusY, brique); // PROBLEME ATTRIBUTS !!!!!!!!!
                brique.bonusY += 3;
            }
        }
    }
}
function drawParticles()
{
    let particlesMax = 30;
    for(c=0; c<brickColumnCount; c++)
    {
        for(r=0; r<brickRowCount; r++)
        {
            let brique = bricks[c][r];
            if(brique.cycleParticles > 0)
            {   
                let particleX;
                let particleY;
                let directionX = 1;
                let directionY = 1;

                if (brique.particuleDirection == 1)
                {
                    directionX = 1;
                    directionY = -1;
                }
                else if (brique.particuleDirection == 2)
                {
                    directionX = 1;
                }
                else if (brique.particuleDirection == 3)
                {
                    directionX = -1;
                }
                else if (brique.particuleDirection == 4)
                {
                    directionX = -1;
                    directionY = -1;
                }
                if(brique.cycleParticles == 1)
                {
                    for(p=0; p<particlesMax; p++) //explosion: init
                    {
                        brique.colorR[p] = 20 + Math.floor(Math.random()*20);
                        brique.colorG[p] = 100 + Math.floor(Math.random()*100);
                        brique.colorB[p] = 155 + Math.floor(Math.random()*100);
                        brique.particlePosX[p] = directionX * brique.x + Math.floor(Math.random()*brickWidth);
                        brique.particulePosY[p] = directionY * brique.y + Math.floor(Math.random()*brickHeight);
                        particleX = brique.particlePosX[p];
                        particleY = brique.particulePosY[p];
                    }
                }
                // direction = de 6h à 9h
                if(brique.cycleParticles > 1 && brique.cycleParticles < (120 * (particlesMax / 10))) //explosion: impulsion direction
                {
                    for(p=0; p<particlesMax; p++)
                    {
                        brique.particlePosX[p] = directionX * brique.particlePosX[p] + Math.floor(Math.random()*10);
                        brique.particulePosY[p] = directionY * brique.particulePosY[p] + Math.floor(Math.random()*6);
                        particleX = brique.particlePosX[p];
                        particleY = brique.particulePosY[p];
                    }
                }
                if(brique.cycleParticles >= 120 && brique.cycleParticles < (200 * (particlesMax / 10))) //explosion: début gravité direction
                {
                    for(p=0; p<particlesMax; p++)
                    {
                        brique.particlePosX[p] = directionX * brique.particlePosX[p] + Math.floor(Math.random()*7);
                        brique.particulePosY[p] = brique.particulePosY[p] + Math.floor(Math.random()*10);
                        particleX = brique.particlePosX[p];
                        particleY = brique.particulePosY[p];
                    }
                }
                if(brique.cycleParticles >= 200 && brique.cycleParticles < (300 * (particlesMax / 10))) //explosion: gravité direction
                {
                    for(p=0; p<particlesMax; p++)
                    {
                        brique.particulePosY[p] = brique.particulePosY[p] + Math.floor(Math.random()*20);
                        particleY = brique.particulePosY[p];
                    }
                }
                if(brique.cycleParticles > 0 && brique.cycleParticles < (300 * (particlesMax / 10)))
                {
                    for(p=0; p<particlesMax; p++)
                    {
                        ctx.beginPath();
                        ctx.rect(brique.particlePosX[p], brique.particulePosY[p], 3, 3);
                        ctx.fillStyle = 'rgb('+brique.colorR[p]+', '+brique.colorG[p]+', '+brique.colorB[p]+')';
                        ctx.fill();
                        ctx.closePath(); 
                        bricks[c][r].cycleParticles++;
                    }
                }
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
    drawBonus();
    drawParticles();
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
    else if(y + dy > canvas.height-ballRadius-paddleHeight)
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
    
    if(rightPressed && paddleX < canvas.width-paddle.width)
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
    if (toPlay == 0)
    {
        placeCoundown();
    }
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
genMap();
draw();
launchCountdown();