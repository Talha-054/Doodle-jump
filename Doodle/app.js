let grid = document.querySelector(".grid");
let doodler = document.createElement("div");
let start = document.querySelector("button");
let timer = document.querySelector(".timer");
let result = document.querySelector(".score");
let level = document.querySelector(".level");




let score = 0;
let countDownTimer = 5;
let doodlerBottom;
let doodlerLeft;
let platformCount = 5;
let platforms = []

let upTimerId;
let downTimerId;
let leftTimerId;
let rightTimerId;
let collisonCheckId;
let fall_Id;
let countDownId;
let gameOverId;
let platMoveId;

let upCount = 0;
let leftCount = 0;
let rightCount = 0;

let isMovingLeft = false;
let isMovingRight = false;
let isJumping = false;
let isFalling = false;
let isColliding = true;
let isGameOver = false;






let createDoodler = function () {
    if (isGameOver) return;
    doodler.classList.add("doodler");
    grid.appendChild(doodler);
    doodlerBottom = platforms[2].platBottom + 10;
    doodlerLeft = platforms[2].platLeft + 20;
    doodler.style.bottom = doodlerBottom + 'px';
    doodler.style.left = doodlerLeft + 'px';

}
    // Adding doodler image
    // doodler.appendChild(img);
    // img.classList.add("fa-brands");
    // img.classList.add("fa-twitter");    




class platform {
    constructor  (platBottom) {
        this.platBottom = platBottom;
        this.platLeft = Math.random() * 300;
        this.visual = document.createElement("div");

        const visual = this.visual;
        visual.classList.add("platform");
        grid.appendChild(visual);
        visual.style.bottom = this.platBottom + 'px';
        visual.style.left = this.platLeft + 'px';
    }
}



let createPlatforms = function (){
    if (isGameOver) return;
    for (i=0 ; i< platformCount ; i++){
        platGap = 600 / platformCount;
        platBottom = 50 + (i * platGap);
        let newPlatform = new platform(platBottom);
        platforms.push(newPlatform)

        
    }
}



let movePlatforms = function (){
    if (isGameOver) return;
    platMoveId = setInterval(()=>{
        platforms.forEach((platform)=>{
            platform.platBottom -= 4;
            platform.visual.style.bottom = platform.platBottom + 'px';
            if (platform.platBottom < 0){
                score += 1;

                if (score>15 && platforms.length == 5){
                    level.innerHTML = "Level 2"
                    jump()
                    platforms.forEach((plat)=>{
                        grid.removeChild(plat.visual)
                    })
                    platforms = [];
                    platformCount = 4;
                    createPlatforms()
                }
                if (score>30 && platforms.length == 4){
                    jump()
                    level.innerHTML = "Level 3"
                    platforms.forEach((plat)=>{
                        grid.removeChild(plat.visual)
                    })
                    platforms = [];
                    platformCount = 3;
                    createPlatforms()
                }
                
                timer.innerHTML = score;
                platform.visual.style.visibility = "hidden";
                platform.platBottom = 600;
                platform.platLeft = Math.random() * 300;
                platform.visual.style.left = platform.platLeft + 'px';
                platform.visual.style.bottom = platform.platBottom + 'px';
                platform.visual.style.visibility = "visible"
            }
        })
    },30)
}



let jump = function (){
    if (isGameOver) return;
    console.log("reached ")
    isColliding = false;
    collisonCheckId = setInterval(checkCollision,1)
    isFalling = false;
    if (isJumping) return;
    isJumping = true;
    clearInterval(downTimerId)
    clearInterval(fall_Id)
    upTimerId = setInterval(()=>{
        doodlerBottom += 4;
        doodler.style.bottom = doodlerBottom + 'px';
        upCount ++;
        if (upCount == 50){
            upCount = 0;
            clearInterval(upTimerId)
            isJumping = false;
            fall()
        }
    },20)
}


let fall = function (){
    if (isGameOver) return;
    clearInterval(fall_Id);
    downTimerId = setInterval(()=>{
        isFalling = true;
        doodlerBottom -= 15;
        doodler.style.bottom = doodlerBottom + 'px';
    },30)
}


let fall_2 = function (){
    if (isGameOver) return;
    if (downTimerId){
        clearInterval(downTimerId);
        isFalling = false;
    }
    if (upTimerId){
        clearInterval(upTimerId);
        isJumping = false;
    }
    
    
    fall_Id = setInterval(()=>{
                       
        isFalling = false;
        doodlerBottom -= 4;
        doodler.style.bottom = doodlerBottom + 'px';

        },30)

}



let moveLeft = function(){
    if (isGameOver) return;
    isColliding = false;
    collisonCheckId = setInterval(checkCollision,1)
    if (isMovingLeft) return;
    clearInterval(rightTimerId);
    leftTimerId = setInterval(()=>{
        if (doodlerLeft > 0){
            isMovingLeft = true;
            doodlerLeft -= 4;
            doodler.style.left = doodlerLeft + 'px';
            leftCount ++;
            if (leftCount == 15){
               leftCount = 0;
               clearInterval(leftTimerId)
               isMovingLeft = false;
            }
        }else{
            clearInterval(leftTimerId);
            isMovingLeft = false;
            leftCount = 0;
        } 
    },15)
}

let moveRight = function(){
    if (isGameOver) return;
    isColliding = false;
    collisonCheckId = setInterval(checkCollision,1)
    if (isMovingRight) return;
    clearInterval(leftTimerId)
    rightTimerId = setInterval(()=>{
        if (doodlerLeft <= 355){
            isMovingRight = true;
            doodlerLeft += 4;
            doodler.style.left = doodlerLeft + 'px';
            rightCount ++;
            if (rightCount == 15){
                rightCount = 0;
                clearInterval(rightTimerId)
                isMovingRight = false;
            }
        }else{
            clearInterval(rightTimerId);
            isMovingRight = false;
            rightCount = 0;
        }
    },15)
}

let checkCollision = function () {
    if (isGameOver) return;
    if (isFalling && !isColliding ){
        platforms.forEach((platform)=>{
            
            if (doodlerBottom >= platform.platBottom &&
                doodlerBottom <= platform.platBottom + 10 &&
                doodlerLeft >= platform.platLeft - 30 && 
                doodlerLeft <= platform.platLeft + 80){
                    console.log ("collision occured")
                    isColliding = true;
                    clearInterval(collisonCheckId)
                    fall_2()
                    
                }
        })
    // }else if (isJumping && !isColliding ){
    //     platforms.forEach((platform)=>{
            
    //         if (doodlerBottom >= platform.platBottom &&
    //             doodlerBottom <= platform.platBottom + 10 &&
    //             doodlerLeft >= platform.platLeft - 15 && 
    //             doodlerLeft <= platform.platLeft + 70){
    //                 console.log ("collision occured while jumping")
    //                 isColliding = true;
    //                 clearInterval(collisonCheckId)
    //                 fall_2()
    //                 // clearInterval(upTimerId);
    //                 // isJumping = false;
    //             }
    //     })
    }
}





let gameOver = function (){
    if (doodlerBottom <= 0){
        clearInterval(gameOverId)
        isGameOver = true;
        timer.innerHTML = score;
        result.style.visibility = "visible";
        console.log("game ended")
        clearInterval(platMoveId);
        clearInterval(upTimerId);
        clearInterval(downTimerId);
        clearInterval(leftTimerId);
        clearInterval(collisonCheckId);
        clearInterval(fall_Id);
        clearInterval(rightTimerId);
    }
}






















let countdown = function (){
    countDownId = setInterval(()=>{
        timer.innerHTML = countDownTimer;
        countDownTimer -= 1;
        if (countDownTimer < 0){
            clearInterval(countDownId);
            level.style.visibility = "visible";
            movePlatforms()
            fall_2()
            
            document.addEventListener("keyup",(event)=>{
                if (event.key == "ArrowUp"){
                   jump()
                }
            })
            
            
            document.addEventListener("keyup",(event)=>{
                if (event.key == "ArrowLeft"){
                    if(isMovingRight) isMovingRight = false;
                        moveLeft()    
                }
            })
            
            
            document.addEventListener("keyup",(event)=>{
                if (event.key == "ArrowRight"){
                    if (isMovingLeft) isMovingLeft = false;
                        moveRight()
                }
            })
        }
    },1000)
}

    


start.addEventListener("click", ()=>{
    console.log("start button was pressed")
    createPlatforms();
    createDoodler();
    start.style.zIndex = 0;
    start.style.visibility = "hidden";
    timer.style.visibility = "visible";
    countdown()
})











collisonCheckId = setInterval(checkCollision,1)
gameOverId = setInterval(gameOver,1)









