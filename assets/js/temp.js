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
var ballSpeedDefaut = 4;
var ballSpeedNow = ballSpeedDefaut;
//joueur
var paddleWidth = 90;
var paddleHeight = 10;
var bonusIncreDecrePadWidth = 40
var paddle = {width: paddleWidth, height: paddleHeight, bonusIncrePadWidth: bonusIncreDecrePadWidth, bonusDecrePadWidth: bonusIncreDecrePadWidth};
var paddleX = (canvas.width-paddleWidth)/2; //position au commencement de la partie
var paddleY = canvas.height-paddleHeight
var speedPlayer = 7;
var rightPressed = false;
var leftPressed = false;
var angleDummyPaddle = 45; //vitesse
var decreaseAnglePressed = false;
var increaseAnglePressed = false;
var laserDummyDxLeft = 30;
var laserDummyDyLeft = 30;
var laserDummyDxRight = 30;
var laserDummyDyRight = 30;
var laserDummyLengthRight;
var laserDummyLengthLeft;
var laserDxRight = laserDummyDxRight;
var laserDyRight = laserDummyDyRight;
var laserDxLeft = laserDummyDxLeft;
var laserDyLeft = laserDummyDyLeft;
var laserLengthAtBirth = 0;
var dummyAngleRefresh = 0;
// bonus
var bonusNbrDif = 4;
var bonusNbrIngame = 3;
var img00 = new Image(), img01 = new Image(), img02 = new Image(), img03 = new Image();
img00.src = 'assets/img/bonus_increaseWidth.png';
img01.src = 'assets/img/bonus_decreaseWidth.png';
img02.src = 'assets/img/bonus_decreaseSpeedBall.png';
img03.src = 'assets/img/bonus_increaseSpeedBall.png';
var bonusImgWidth = 25;
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
var brickBelowOthersFromTop = 0;

var bricks = [];
var bricksGenLvl01 = [ // array 1 = briques bonus. array 2 = briques incassables.
    0, 0, 0, 1, 0, 0, 0, 1,
    2, 0, 2, 0, 0, 2, 0, 2,
    0, 0, 0, 0, 1, 0, 0, 0
    ];
    
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function calcLaserLengthAtBirth()
{
    brickBelowOthersFromTop = ((brickRowCount + 1) * brickHeight) + (brickRowCount * brickPadding) + brickOffsetTop;
    laserLengthAtBirth = canvas.height - brickBelowOthersFromTop;
}

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
        	if (brickType <= 1) // type 0 = destructible, type 1 = destructible + bonus
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

function collisionBonus(bonusX, bonusY, brique)
{
    if (bonusX + bonusImgWidth > paddleX && bonusX < paddleX + paddle.width && bonusY > paddleY && bonusY < paddleY + paddleHeight)
    {
        if (brique.bonus == 0 && paddle.width < 140)
        {
            let increaseTemp = setInterval(function()
            {
                paddle.width++;
                paddle.bonusIncrePadWidth--;
                if (paddle.bonusIncrePadWidth <= 0)
                {
                    clearInterval(increaseTemp);
                    paddle.bonusIncrePadWidth = bonusIncreDecrePadWidth;
                }
            }, 10);
        }
        if (brique.bonus == 1 && paddle.width > 50)
        {            
            let decreaseTemp = setInterval(function()
            {
                paddle.width--;
                paddle.bonusDecrePadWidth--;
                if (paddle.bonusDecrePadWidth <= 0)
                {
                    clearInterval(decreaseTemp);
                    paddle.bonusDecrePadWidth = bonusIncreDecrePadWidth;
                }
            }, 10);
        }
        if (brique.bonus == 2 && dx >= 3 || brique.bonus == 2 && dx <= 3)
        {
            dx = dx/2;
            dy = dy/2;
            changeBallAngle();        
        }
        if (brique.bonus == 3 && dx <= 5 || brique.bonus == 3 && dx >= -5)
        {
            dx = dx*2;
            dy = dy*2;
            changeBallAngle();
        }
        bonusY = canvas.height + 50;
    }
    if (bonusY > canvas.height)
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
    if (dummyAngleRefresh >= 6 && toPlay == 1)
    {
        laserDummyDyLeft =  laserLengthAtBirth;
        laserDummyLengthLeft = laserDummyDyLeft / Math.sin(angleDummyPaddle * Math.PI / 180);
        laserDummyDxLeft = laserDummyLengthLeft * Math.cos(angleDummyPaddle * Math.PI / 180);

        laserDummyDyRight = laserLengthAtBirth;
        laserDummyLengthRight = laserDummyDyRight / Math.sin(angleDummyPaddle * Math.PI / 180);
        laserDummyDxRight = laserDummyLengthRight * Math.cos(angleDummyPaddle * Math.PI / 180);

        dummyAngleRefresh = 0;
    }

    if (paddleX + (paddle.width/2) - laserDummyDxLeft > 0)
    {
        laserDummyLengthLeft += brickHeight;
    }
    else
    {
        laserDummyLengthLeft -= brickHeight;
    }
    if (paddleX + (paddle.width/2) + laserDummyDxRight < canvas.width)
    {
        laserDummyLengthRight += brickHeight;
    }
    else
    {
        laserDummyLengthRight -= brickHeight;
    }
    for(c=0; c<brickColumnCount; c++)
    {
        for(r=0; r<brickRowCount; r++)
        {
            var b = bricks[c][r];
            if(b.status == 1)
            {
                if (paddleX + (paddle.width/2) + laserDummyDxRight > b.x && paddleX + (paddle.width/2) + laserDummyDxRight < b.x+brickWidth && paddleY - laserDummyDyRight > b.y && paddleY - laserDummyDyRight < b.y+brickHeight)
                {
                    laserDummyLengthRight -= brickHeight;
                }
                if (paddleX + (paddle.width/2) - laserDummyDxLeft > b.x && paddleX + (paddle.width/2) - laserDummyDxLeft < b.x+brickWidth && paddleY - laserDummyDyLeft > b.y && paddleY - laserDummyDyLeft < b.y+brickHeight)
                {
                    laserDummyLengthLeft -= brickHeight;
                }
            }
        }
    }
    laserDummyDxRight = laserDummyLengthRight * Math.cos(angleDummyPaddle * Math.PI / 180); //degré * (Math.PI / 180) => convertir degrés en gradiants.
    laserDummyDyRight = laserDummyLengthRight * Math.sin(angleDummyPaddle * Math.PI / 180);
    laserDummyDxLeft = laserDummyLengthLeft * Math.cos(angleDummyPaddle * Math.PI / 180);
    laserDummyDyLeft = laserDummyLengthLeft * Math.sin(angleDummyPaddle * Math.PI / 180);
    if (dummyAngleRefresh >= 5 && toPlay == 1)
    {
        laserDxRight = laserDummyDxRight;
        laserDyRight = laserDummyDyRight;
        laserDxLeft = laserDummyDxLeft;
        laserDyLeft = laserDummyDyLeft;
    }
    dummyAngleRefresh++;

    ctx.beginPath();
    ctx.moveTo(paddleX + paddle.width/2, paddleY);
    ctx.lineTo(paddleX + (paddle.width/2) + laserDxRight, paddleY - laserDyRight);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgba(225, 25, 25, .5)";
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.moveTo(paddleX + paddle.width/2, paddleY);
    ctx.lineTo(paddleX + (paddle.width/2) - laserDxLeft, paddleY - laserDyLeft);
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
function drawBonus() //systeme brouillon, mettre les bonus aléatoirement dans un tableau => plus léger, plus clair, plus modulable. Brique bonus casse, on prend le bonus dans l'index actuel du tableau et on en change le status.
{
    for(c=0; c<brickColumnCount; c++)
    {
        for(r=0; r<brickRowCount; r++)
        {
            let brique = bricks[c][r];
            if(brique.status == 0 && brique.type == 1 && brique.bonus >= 0)
            {
                let nomVariableImg = 'img0'+brique.bonus;
                ctx.drawImage(eval(nomVariableImg), brique.x+brickWidth/2-bonusImgWidth/2, brique.bonusY+brickHeight/2-bonusImgWidth/2, bonusImgWidth, bonusImgWidth);
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
    drawDummyAngles();
    drawBricks();
    drawBonus();
    drawParticles();
    drawBall();
    drawPaddle();
    drawScore();
    drawLives();
    collisionDetection();
    if(x + dx > canvas.width - ballRadius || x + dx < ballRadius) //  rebonds balle canvas
    {
        dx = -dx;
    }
    if(y + dy < ballRadius)
    {
        dy = -dy;
    }
    else if(y + dy > canvas.height - ballRadius - paddleHeight) // sortie balle sol
    {
        if(x - ballRadius > paddleX && x - ballRadius < paddleX + paddle.width) // sauf si rebonds balle joueur
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
        paddleX += speedPlayer;
    }
    else if(leftPressed && paddleX > 0)
    {
        paddleX -= speedPlayer;
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
    laserDxLeft = 30;
    laserDyLeft = 30;
    laserDxRight = 30;
    laserDyRight = 30;
    paddleX = (canvas.width-paddleWidth)/2;
    paddle.width = paddleWidth;
    paddle.height = paddleHeight;
}
genMap();
calcLaserLengthAtBirth()
draw();
launchCountdown();