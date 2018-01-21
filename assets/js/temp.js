var canvas = document.getElementById("scene");
var ctx = canvas.getContext("2d");

var text = document.getElementById('countdown');
var toPlay = -1;
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
//infos
var score = 0;
var lives = 3;
//briques
var brickRowCount = 2;
var brickColumnCount = 8;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 5;
var brickGenIndex = 0;
var brickGenIndexCol = 0;
var brickType = 0;
var victoireCount = 0;
var brickBelowOthersFromTop = 0;
var bricks = [];
var brickRowCount = 2;
var brickColumnCount = 8;
var brickOffsetLeft = (canvas.width - ((brickWidth * brickColumnCount) + (brickPadding * brickColumnCount)))/2;
var brickOffsetTop = 65;
// maps
var backgroundImg = 'assets/img/tuto.jpg';
var bricksGenLvl = [];
var bricksGenLvl01 = [ // array 1 = briques bonus. array 2 = briques incassables.
    0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0
    ];
var bricksGenLvl02 = [
    0, 9, 0, 0, 0, 0, 9, 0,
    2, 9, 0, 0, 0, 0, 9, 2,
    0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 2, 0, 0, 2, 0, 0
    ];
var lvl02 = {bonusNbrDif: 2, brickBonusNumber: 4, brickColumnCount: 8, brickRowCount: 4, brickOffsetTop: 65, backgroundImg: 'assets/img/map02.jpg'};
var bricksGenLvl03 = [
    0, 0, 2, 0, 0, 2, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0,
    2, 2, 2, 2, 2, 2, 2, 2,
    0, 0, 0, 0, 0, 0, 0, 0,
    2, 2, 0, 2, 2, 0, 2, 2
    ];
var lvl03 = {bonusNbrDif: 4, brickBonusNumber: 4, brickColumnCount: 8, brickRowCount: 5, brickOffsetTop: 65, backgroundImg: 'assets/img/map03.jpg'};
bricksGenLvl.push(bricksGenLvl01, bricksGenLvl02, bricksGenLvl03);
var bricksGenLvlIndex = 0;
// bonus
var bonusImgWidth = 25;
var bonusNbrDif = 1;
var brickBonusNumber = 1;
var bonus = [];
var bonusIndexInstall = 0;
//filtre
var filtre = new Image();
filtre.src = 'assets/img/filtre.png';

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function launchRound(lvl)
{
    if (toPlay == -1)
    {
        ctx.font = "32px Arial";
        ctx.fillStyle = "rgba(40, 150, 175, .9)";
        ctx.fillText("ROUND "+lvl, canvas.width/2 - 70, canvas.height/2);
    }
}

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

function genBonusInRandBricks()
{
    let bricksNumber = bricksGenLvl[bricksGenLvlIndex].length;
    let selectBrickBonus;
    while (brickBonusNumber > 0)
    {
        selectBrickBonus = Math.floor(Math.random()*bricksNumber);
        if(bricksGenLvl[bricksGenLvlIndex][selectBrickBonus] == 0)
        {
            bricksGenLvl[bricksGenLvlIndex][selectBrickBonus] = 1;
            brickBonusNumber--;
        }
    }
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
    genBonusInRandBricks();
}

function genMap()
{
    canvas.style.backgroundImage = "url('"+backgroundImg+"')";
    for(c=0; c<brickColumnCount; c++)
    {
        bricks[c] = [];
        for(r=0; r<brickRowCount; r++)
        {
        	brickType = bricksGenLvl[bricksGenLvlIndex][brickGenIndex];
        	if (brickType <= 1) // type 0 = destructible, type 1 = destructible + bonus, type 9 = un espace
        	{
        		victoireCount++
        	}
			convertVisualArray();
            bricks[c][r] = { x: 0, y: 0, status: 1, type: brickType, bonus: -1, cycleParticles: 0, particlePosX : [], particulePosY: [], particuleDirection: 0, colorR: [], colorG: [], colorB: []};
            if (brickType == 9) // type 0 = destructible, type 1 = destructible + bonus
            {
                bricks[c][r].status = 0;
            }
            if (brickType == 1)
            {
                bricks[c][r].bonus = Math.floor(Math.random()*bonusNbrDif);
                bonus[bonusIndexInstall] = {x: 0, y: 0, status: 0, type: 0};
                bonus[bonusIndexInstall].type = bricks[c][r].bonus;
                bonusIndexInstall++;
            }
            brickType = 0;
        }
    }
    bonusIndexInstall = 0;
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

function killBonus()
{
    for (i = 0; i < bonusIndexInstall; i++)
    {
        if (bonus[i].status == 1)
        {
            bonus[i].status = 0;
        }
    }       
}
function drawFiltre()
{
    ctx.drawImage(filtre, 0, 0, 800, 600);
}
function drawVictoire()
{   
    if (toPlay == -2)
    {
        ctx.font = "32px Arial";
        ctx.fillStyle = "rgba(40, 150, 175, .9)";
        ctx.fillText("VICTOIRE ", canvas.width/2 - 70, canvas.height/2);
    }
}

function drawBonus()
{
    for (i = 0; i < bonusIndexInstall; i++)
    {
        if (bonus[i].status == 1)
        {
            let bonusImg = new Image();
            bonusImg.src = 'assets/img/bonus0'+bonus[i].type+'.png';
            ctx.drawImage(bonusImg, bonus[i].x, bonus[i].y, bonusImgWidth, bonusImgWidth);
            bonus[i].y += 3;
        }
    }   
}
function activeBonus(brique, briqueX, briqueY)
{           
    bonus[bonusIndexInstall].status = 1;
    bonus[bonusIndexInstall].x = briqueX + brickWidth/2 - bonusImgWidth/2;
    bonus[bonusIndexInstall].y = briqueY + brickHeight/2 - bonusImgWidth/2;
    bonusIndexInstall++;
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
                        victoireCount--;
                        if (b.type == 1)
                        {
                            activeBonus(b, b.x, b.y);
                        }
                    }
                    if(victoireCount == 0)
                    {
                        nextMap();
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
                        victoireCount--;
                        if (b.type == 1)
                        {
                            activeBonus(b, b.x, b.y);
                        }
                    }
                    if(victoireCount == 0)
                    {
                        nextMap();
                    }
                }
            }
        }
    }

}

function collisionBonus()
{
    for (i = 0; i < bonusIndexInstall; i++)
    {
        if (bonus[i].x + bonusImgWidth > paddleX && bonus[i].x < paddleX + paddle.width && bonus[i].y > paddleY && bonus[i].y < paddleY + paddleHeight && bonus[i].status == 1)
        {
            if (bonus[i].type == 0 && paddle.width < 140)
            {
                let increaseTemp = setInterval(function()
                {
                    paddle.width++;
                    paddleX = paddleX - 0.5;
                    paddle.bonusIncrePadWidth--;
                    if (paddle.bonusIncrePadWidth <= 0)
                    {
                        clearInterval(increaseTemp);
                        paddle.bonusIncrePadWidth = bonusIncreDecrePadWidth;
                    }
                }, 10);
            }
            if (bonus[i].type == 1 && paddle.width > 50)
            {            
                let decreaseTemp = setInterval(function()
                {
                    paddle.width--;
                    paddleX = paddleX + 0.5;
                    paddle.bonusDecrePadWidth--;
                    if (paddle.bonusDecrePadWidth <= 0)
                    {
                        clearInterval(decreaseTemp);
                        paddle.bonusDecrePadWidth = bonusIncreDecrePadWidth;
                    }
                }, 10);
            }
            if (bonus[i].type == 2 && dx >= 3 || bonus[i].type == 2 && dx <= 3)
            {
                dx = dx/1.5;
                dy = dy/1.5;
                changeBallAngle();        
            }
            if (bonus[i].type == 3 && dx <= 5 || bonus[i].type == 3 && dx >= -5)
            {
                dx = dx*1.5;
                dy = dy*1.5;
                changeBallAngle();
            }
            bonus[i].y = canvas.height + 50;
        }
        if (bonus[i].y > canvas.height)
        {
            bonus[i].status = 0;
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

    if (laserDummyDxLeft < paddleX + (paddle.width/2))
    {
        laserDummyLengthLeft += brickHeight;
    }
    else
    {
        laserDummyDxLeft = paddleX + (paddle.width/2);
        laserDummyLengthLeft = laserDummyDxLeft / Math.cos(angleDummyPaddle * Math.PI / 180);
        laserDummyDyLeft = laserDummyLengthLeft * Math.sin(angleDummyPaddle * Math.PI / 180);
    }
    if (laserDummyDxRight < canvas.width - paddleX + (paddle.width/2))
    {
        laserDummyLengthRight += brickHeight;
    }
    else
    {
        laserDummyDxRight = canvas.width - paddleX + (paddle.width/2);
        laserDummyLengthRight = laserDummyDxRight / Math.cos(angleDummyPaddle * Math.PI / 180);
        laserDummyDyRight = laserDummyLengthRight * Math.sin(angleDummyPaddle * Math.PI / 180);
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
    ctx.strokeStyle = "rgba(225, 25, 25, .3)";
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.moveTo(paddleX + paddle.width/2, paddleY);
    ctx.lineTo(paddleX + (paddle.width/2) - laserDxLeft, paddleY - laserDyLeft);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgba(225, 25, 25, .3)";
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
                    ctx.lineWidth = 5;
                    ctx.fillStyle = "rgba(40, 150, 175, .9)";
                    ctx.strokeStyle = "rgba(40, 75, 87, .9)";
                }
                else if (bricks[c][r].type == 1)
                {
                    ctx.lineWidth = 5;
                    ctx.fillStyle = "rgba(40, 150, 175, .9)";
                    ctx.strokeStyle = "rgba(40, 75, 87, .9)";
                }
                else if (bricks[c][r].type == 2)
                {
                    ctx.lineWidth = 5;
                    ctx.fillStyle = "rgba(100, 90, 100, .9)";
                    ctx.strokeStyle = "rgba(80, 60, 75, .9)";
                }
                ctx.stroke();
                ctx.fill();
                ctx.closePath();
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
    ctx.fillStyle = "rgba(40, 150, 175, .9)";
    ctx.fillText("Score: "+score, 8, 20);
}
function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "rgba(40, 150, 175, .9)";
    ctx.fillText("Lives: "+lives, canvas.width-65, 20);
}
function draw()
{
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawDummyAngles();
    drawBricks();
    drawBonus();
    drawParticles();
    drawPaddle();
    drawBall();
    collisionDetection();
    collisionBonus();
    drawFiltre()
    launchRound(bricksGenLvlIndex+1);
    drawVictoire();
    drawScore();
    drawLives();
    if(x + dx > canvas.width - ballRadius || x + dx < ballRadius) //  rebonds balle canvas
    {
        dx = -dx;
    }
    if(y + dy < ballRadius)
    {
        dy = -dy;
    }
    else if(y + dy > canvas.height - ballRadius) // sortie balle sol
    {
        if(x + ballRadius > paddleX && x - ballRadius < paddleX + paddle.width) // sauf si rebonds balle joueur
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
    if (toPlay <= 0 && toPlay > -2)
    {
        placeCoundown();
    }
    requestAnimationFrame(draw);
}
function reInit()
{
    killBonus();
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
function nextMap()
{
    bricksGenLvlIndex++;
    let lvlRealNumber = bricksGenLvlIndex + 1;
    if (bricksGenLvlIndex > bricksGenLvl.length)
    {
        reInit();
        toPlay = -2;
    }
    else
    {
        toPlay = -1;
        brickGenIndex = 0;
        brickGenIndexCol = 0;
        brickType = 0;
        victoireCount = 0;
        brickBelowOthersFromTop = 0;
        bricks = [];
        brickBonusNumber = eval("lvl0"+lvlRealNumber+".brickBonusNumber");
        brickColumnCount = eval("lvl0"+lvlRealNumber+".brickColumnCount");
        brickRowCount = eval("lvl0"+lvlRealNumber+".brickRowCount");
        bonusNbrDif = eval("lvl0"+lvlRealNumber+".bonusNbrDif");
        brickOffsetTop = eval("lvl0"+lvlRealNumber+".brickOffsetTop");
        backgroundImg = eval("lvl0"+lvlRealNumber+".backgroundImg");
        brickOffsetLeft = (canvas.width - ((brickWidth * brickColumnCount) + (brickPadding * brickColumnCount)))/2;
        reInit();
        genMap();
        calcLaserLengthAtBirth()
        launchCountdown();
    }
}
genMap();
calcLaserLengthAtBirth()
draw();
launchCountdown();