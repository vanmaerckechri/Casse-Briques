var canvas = document.getElementById("scene");
var ctx = canvas.getContext("2d");

var countdownId = document.getElementById('countdown');
var playerCycle = 0; // -3 defaite, -2: victoire, -1: compte à rebour, 0: menu, 1: en jeu
var marathonGame = false;
// menu
var optionSelect = 1;
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
//touches
var rightPressed = false;
var leftPressed = false;
var bottomPressed = false;
var topPressed = false;
var enterPressed = false;
//laser
var angleDummyPaddle = 45; //vitesse
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
    8, 9, 0, 0, 0, 0, 9, 8,
    0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 8, 0, 0, 8, 0, 0
    ];
var lvl02 = {bonusNbrDif: 2, brickBonusNumber: 4, brickColumnCount: 8, brickRowCount: 4, brickOffsetTop: 65, backgroundImg: 'assets/img/map02.jpg'};
var bricksGenLvl03 = [
    0, 2, 8, 9, 9, 8, 2, 0,
    0, 0, 8, 9, 9, 8, 0, 0,
    0, 0, 0, 2, 2, 0, 0, 0,
    0, 0, 2, 0, 0, 2, 0, 0,
    0, 8, 0, 8, 8, 0, 8, 0
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
//background marathon
var marathonMap = new Image();
marathonMap.src = 'assets/img/marathon_map.png';

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function launchRound()
{
    if (playerCycle == -1)
    {
        let lvl = marathonGame == true ? bricksGenLvlIndex : bricksGenLvlIndex + 1;
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
    countdownId.style.left = canvas.offsetLeft + canvas.width/2 - 33 + 'px' ;
    countdownId.style.top = canvas.offsetTop + canvas.height/2 + 'px';
}
function launchCountdown()
{
    let number = 3;
    countdownId.innerHTML = number;
    countdownId.style.display = 'block';
    countdownTempo = setInterval (function()
        {
            number--;
            countdownId.innerHTML = number;
            if (number < 0)
            {
                clearInterval(countdownTempo);
                countdownId.style.display = 'none';
                playerCycle = 1;
                dx = ballSpeedDefaut;
                dy = -ballSpeedDefaut;
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
	brickGenIndex += brickColumnCount;

	if (brickGenIndex > (brickColumnCount * (brickRowCount - 1))+brickGenIndexCol)
	{
		brickGenIndexCol++;
		brickGenIndex = brickGenIndexCol
	}
    genBonusInRandBricks();
}

function genMap() //bricksGenLvlXx
{
	if (marathonGame == false)
	{
    	canvas.style.backgroundImage = "url('"+backgroundImg+"')";
    }
    for(c=0; c<brickColumnCount; c++)
    {
        bricks[c] = [];
        for(r=0; r<brickRowCount; r++)
        {
        	brickType = bricksGenLvl[bricksGenLvlIndex][brickGenIndex];
        	if (brickType < 8) // type 0 = destructible, type 1 = destructible + bonus, type 2 = feu, type 8 = Incassable, type 9 = un espace
        	{
        		victoireCount++
        	}
			convertVisualArray();
            bricks[c][r] = { x: 0, y: 0, status: 1, type: brickType, bonus: -1, cycleParticles: 0, cycleFireParticles: 0, particlePosX : [], particulePosY: [], particleFirePosX: [], particuleFirePosY: [], particuleDirection: 0, colorR: [], colorG: [], colorB: [], colorFireR: [], colorFireG: [], colorFireB: []};
            if (brickType == 9)
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
var spacePressed = false;//pas oublier d effacer
function keyDownHandler(e)
{
	if (playerCycle >= 0)
	{
	    if(e.keyCode == 39)
	    {
	        rightPressed = true;
	    }
	    else if(e.keyCode == 37)
	    {
	        leftPressed = true;
	    }
	    else if(e.keyCode == 40)
	    {
	        bottomPressed = true;
	    }
	    else if(e.keyCode == 38)
	    {
	        topPressed = true;
	    }
        else if(e.keyCode == 32) // espacePressed triche
        {
            spacePressed = true;
        }
        else if(e.keyCode == 13)
        {
            enterPressed = true;
        }
	}
}
function keyUpHandler(e)
{
	if (playerCycle >= 0)
	{
	    if(e.keyCode == 39)
	    {
	        rightPressed = false;
	    }
	    else if(e.keyCode == 37)
	    {
	        leftPressed = false;
	    }
	    else if(e.keyCode == 40)
	    {
	        bottomPressed = false;
	    }
	    else if(e.keyCode == 38)
	    {
	        topPressed = false;
	    }
        else if(e.keyCode == 32) // espacePressed triche
        {
            spacePressed = false;
        }
        else if(e.keyCode == 13)
        {
            enterPressed = false;
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
function drawMarathonBG()
{
	if (marathonGame == true)
	{
			ctx.drawImage(marathonMap, 0, 0, 800, 600);
	}
}
function drawVictoire()
{   
    if (playerCycle == -2)
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
                // collisions laterales balle|brique 
            	if(x > b.x - ballRadius && x < b.x && y > b.y -ballRadius && y < b.y + brickHeight +ballRadius || x < b.x + brickWidth + ballRadius && x > b.x+brickWidth && y  > b.y -ballRadius && y < b.y + brickHeight +ballRadius)
                {
                    recordPaddleDirection(c, r);
                   /* if (dx > 0) // si la collision se produit vers la droite
                    {
                        x = b.x - ballRadius;
                    }
                    else
                    {
                        x = b.x + brickWidth + ballRadius;
                    } */
                    dx = -dx;
                    if (b.type < 8)
                    {
                    	b.status = 0;
                        b.cycleParticles = 1;
                        b.cycleFireParticles = b.type == 2 ? 1 : 0;
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
                // collisions horizontales balle|brique 
                if(x > b.x && x < b.x+brickWidth && y + ballRadius > b.y && y - ballRadius < b.y+brickHeight)
                {
                    recordPaddleDirection(c, r);
                    if (dy < 0) // si la collision se produit par le bas
                    {
                        y = b.y + brickHeight + ballRadius;
                    }
                    else
                    {
                        y = b.y - ballRadius;
                    }
                    dy = -dy;
                    if (b.type < 8)
                    {
                    	b.status = 0;
                        b.cycleParticles = 1;
                        b.cycleFireParticles = b.type == 2 ? 1 : 0;
                    	score++;
                        victoireCount--;
                        if (b.type == 1)
                        {
                            activeBonus(b, b.x, b.y);
                        }
                    }
                    if(victoireCount == 0 && marathonGame == false)
                    {
                        nextMap();
                    }
                    if(victoireCount == 0 && marathonGame == true)
                    {
                        playerCycle = -1;
                        reInit();
                        genRandomMap();
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
    if (dummyAngleRefresh >= 6 && playerCycle == 1)
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
    if (dummyAngleRefresh >= 5 && playerCycle == 1)
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
    ctx.strokeStyle = "rgba(25, 225, 225, .3)";
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.moveTo(paddleX + paddle.width/2, paddleY);
    ctx.lineTo(paddleX + (paddle.width/2) - laserDxLeft, paddleY - laserDyLeft);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgba(25, 225, 225, .3)";
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
                    ctx.fillStyle = "rgba(175, 75, 40, .9)";
                    ctx.strokeStyle = "rgba(80, 60, 75, .9)";
                }
                else if (bricks[c][r].type == 8)
                {
                    ctx.lineWidth = 5;
                    ctx.fillStyle = "rgba(100, 90, 100, .9)";
                    ctx.strokeStyle = "rgba(40, 75, 87, .9)";
                }
                ctx.stroke();
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function drawBrickFireParticles()
{
    let particlesMax = 300;
    for(c=0; c<brickColumnCount; c++)
    {
        for(r=0; r<brickRowCount; r++)
        {
            let brique = bricks[c][r];
            if(brique.cycleFireParticles > 0 && brique.type == 2)
            {   
                let particleX;
                let particleY;
                let directionX = 1;
                let directionY = 1;

                if(brique.cycleFireParticles == 1)
                {
                    for(p=0; p<particlesMax; p++) //explosion: init
                    {
                        brique.colorFireR[p] = 200 + Math.floor(Math.random()*50);
                        brique.colorFireG[p] = 150 + Math.floor(Math.random()*25);
                        brique.colorFireB[p] = 50 + Math.floor(Math.random()*25);
                        brique.particleFirePosX[p] = directionX * brique.x + Math.floor(Math.random()*brickWidth);
                        brique.particuleFirePosY[p] = directionY * brique.y + Math.floor(Math.random()*brickHeight);
                        particleX = brique.particleFirePosX[p];
                        particleY = brique.particuleFirePosY[p];
                    }
                }
                if(brique.cycleFireParticles > 1) //explosion: gravité direction
                {
                    for(p=0; p<particlesMax; p++)
                    {
                        brique.particuleFirePosY[p] = brique.particuleFirePosY[p] + Math.floor(Math.random()*10);
                        particleY = brique.particuleFirePosY[p];
                        // collisions avec le joueur -1 vie.
                        if (brique.particuleFirePosY[p] > paddleY && brique.particuleFirePosY[p] < paddleY + paddleHeight && brique.particleFirePosX[p] > paddleX && brique.particleFirePosX[p] < paddleX + paddleWidth)
                        {
                            lives--;
                            if(!lives)
                            {
                                alert("GAME OVER");
                                document.location.reload();
                            }
                            else
                            {
                                playerCycle = -1;
                                reInit();
                                launchCountdown();
                            }
                        }
                    }
                }
                if(brique.cycleFireParticles > 1 && brique.particuleFirePosY[p] > canvas.height)
                {
                    for(p=0; p<particlesMax; p++)
                    {
                        brique.particuleFirePosY[p] = brique.particuleFirePosY[p] + Math.floor(Math.random()*20);
                        particleY = brique.particuleFirePosY[p];
                        brique.cycleFireParticles = 0;
                        brique.status = 0;
                    }
                }
                if(brique.cycleFireParticles > 0)
                {
                    for(p=0; p<particlesMax; p++) 
                    {
                        ctx.beginPath();
                        ctx.rect(brique.particleFirePosX[p], brique.particuleFirePosY[p], 3, 3);
                        ctx.fillStyle = 'rgb('+brique.colorFireR[p]+', '+brique.colorFireG[p]+', '+brique.colorFireB[p]+')';
                        ctx.fill();
                        ctx.closePath(); 
                        bricks[c][r].cycleFireParticles++;
                    }
                }
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
    drawMarathonBG();
    drawDummyAngles();
    drawBricks();
    drawBonus();
    drawParticles();
    drawBrickFireParticles();
    drawPaddle();
    drawBall();
    collisionDetection();
    collisionBonus();
    drawFiltre()
    launchRound();
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
            	playerCycle = -1;
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

    if(bottomPressed == true && angleDummyPaddle > 20)
    {
        angleDummyPaddle = angleDummyPaddle - 2;
    }
    else if (topPressed == true && angleDummyPaddle < 60)
    {
        angleDummyPaddle = angleDummyPaddle +2;
    }

    x += dx;
    y += dy;
    if (playerCycle <= 0 && playerCycle > -2)
    {
        placeCoundown();
    }
    requestAnimationFrame(draw);
}
function killFireParticles()
{
    let brique;
    for(c=0; c<brickColumnCount; c++)
    {
        for(r=0; r<brickRowCount; r++)
        {
            brique = bricks[c][r];
            if (brique.cycleFireParticles > 0)
            {
                brique.status = 0;
                brique.cycleFireParticles =0;
            }
        }
    }
}
function reInit()
{
    killBonus();
    killFireParticles();
	rightPressed = false;
	leftPressed = false;
	topPressed = false;
	bottomPressed = false;
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
    if (marathonGame == true)
    {
        playerCycle = -1;
        genRandomMap();
    }
    else
    {
        bricksGenLvlIndex++;
        let lvlRealNumber = bricksGenLvlIndex + 1;
        if (bricksGenLvlIndex > bricksGenLvl.length)
        {
            reInit();
            playerCycle = -2;
        }
        else
        {
            playerCycle = -1;
            reInit();
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
            genMap();
            calcLaserLengthAtBirth()
            launchCountdown();
        }
    }
}

function genRandomMap()
{
	let r = Math.floor(Math.random()*255 + 100);
	let g = Math.floor(Math.random()*255 + 100);
	let b = Math.floor(Math.random()*255 + 100);
    brickGenIndex = 0;
    brickGenIndexCol = 0;
    brickType = 0;
    victoireCount = 0;
    brickBelowOthersFromTop = 0;
    bricks = [];    let maxBonus = 0;
    brickColumnCount = Math.floor(Math.random()*8 + 2);
    brickRowCount = Math.floor(Math.random()*6 + 2);
    bonusNbrDif = Math.floor(Math.random()*4 + 1);
    canvas.style.background = 'rgb('+r+', '+g+', '+b+')';
    bricksGenLvl[bricksGenLvlIndex] = [];
    for (i = 0; i < (brickColumnCount*brickRowCount); i++)
    {
        let brickRand = Math.floor(Math.random()*10);
        if (brickRand > 2 && brickRand < 8 || brickRand == 1)
        {
            brickRand = 0;
        }
        if (brickRand == 0)
        {
            maxBonus++;
        }
        bricksGenLvl[bricksGenLvlIndex][i] = brickRand;
    }
    brickBonusNumber = Math.floor(Math.random()*maxBonus);
    brickOffsetLeft = (canvas.width - ((brickWidth * brickColumnCount) + (brickPadding * brickColumnCount)))/2;
    initNewMap();
    bricksGenLvlIndex++;
}

function drawMenu()
{
    countdownId.style.display = 'none';
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.rect(0, 0, 800, 600);
    ctx.fillStyle = "black";
    ctx.fill();
    ctx.closePath(); 
    ctx.font = "54px Arial";
    ctx.fillStyle = "rgba(40, 150, 175, .9)";
    ctx.fillText("Break my Bricks ", 75, 115);
    ctx.font = "38px Arial";
    ctx.fillStyle = optionSelect == 1 ? "rgba(40, 150, 175, .9)" : "rgba(40, 150, 175, .5)";
    ctx.fillText(".Campaign", 75, canvas.height/2 - 50);
    ctx.fillStyle = optionSelect == 2 ? "rgba(40, 150, 175, .9)" : "rgba(40, 150, 175, .5)";
    ctx.fillText(".Marathon", 75, canvas.height/2 + 50);
    if (optionSelect == 1 && bottomPressed == true)
    {
        optionSelect = 2;
    }
    if (optionSelect == 2 && topPressed == true)
    {
        optionSelect = 1;
    }
    if (optionSelect == 1 && enterPressed == true)
    {
        playerCycle = -1;
        marathonGame = false;
        initNewMap();
        draw();
        return;
    }
    if (optionSelect == 2 && enterPressed == true)
    {
        playerCycle = -1;
        marathonGame = true;
        genRandomMap();
        draw();
        return;
    }
    requestAnimationFrame(drawMenu);
}
drawMenu();


function initNewMap()
{
    genMap();
    calcLaserLengthAtBirth();
    reInit();
    launchCountdown();
}