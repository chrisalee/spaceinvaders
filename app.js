document.addEventListener("DOMContentLoaded", () => {
    const gridDisplay = document.querySelector('.grid');
    // const squares = document.querySelectorAll('.grid div');
    const resultDisplay = document.getElementById('result');

    const width = 15;
    let squares = [];
    let currentShooterIndex = 202;
    let currentInvaderIndex = 0;
    let alienInvaderShotDown = [];
    let result = 0;
    let direction = 1;
    let invaderId;

    // creating the game space  ***************************************************************************
    function createBoard() {
        for( let i = 0; i < width * width; i++){
            const square = document.createElement('div');
            gridDisplay.appendChild(square);
            squares.push(square);
        }
    };
    createBoard();

    //define the alien invaders  *************************************************************************************
    const alienInvaders = [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 
        15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 
        30, 31, 32, 33, 34, 35, 36, 37, 38, 39
    ];

    //draw the alien invaders  ***************************************************************************************
    alienInvaders.forEach(invader => squares[currentInvaderIndex + invader].classList.add('invader'));

    //draw the shooter  *************************************************************************************
    squares[currentShooterIndex].classList.add('shooter');

    //move the shooter across the grid, but not up and dpwn
    function moveShooter(e) {
        squares[currentShooterIndex].classList.remove('shooter');
        switch(e.keyCode) {
            case 37:  //left key
                if(currentShooterIndex % width !== 0) {
                    currentShooterIndex -=1;
                }
                break;
            case 39:  //right key
                if(currentShooterIndex % width < width - 1){
                    currentShooterIndex +=1;
                }
                break;
        }
        squares[currentShooterIndex].classList.add('shooter');
    }
    document.addEventListener('keydown', moveShooter);

    //move the alien invaders from one side to the other  ********************************************************************************************************
    function moveAliens() {
        const isLeftEdge = alienInvaders[0] % width === 0;
        const isRightEdge = alienInvaders[alienInvaders.length-1] % width === width - 1;

        if((isLeftEdge && direction === -1) || (isRightEdge && direction === 1)) {
            direction = width;
        }
        else if(direction === width) {
            if(isLeftEdge) {
                direction = 1;
            }
            else{
                direction = -1;
            }
        }
        for(let i = 0; i <= alienInvaders.length - 1; i++){
            squares[alienInvaders[i]].classList.remove('invader');
        }
        for(let i = 0; i <= alienInvaders.length - 1; i++){
            alienInvaders[i] += direction;
        }
        for(let i = 0; i <= alienInvaders.length - 1; i++){
            if(!alienInvaderShotDown.includes(i)){
                squares[alienInvaders[i]].classList.add('invader');
            }
        }

        //decide if game is over  ******************************************************************************************
        if(squares[currentShooterIndex].classList.contains('invader', 'shooter')) {
            resultDisplay.textContent = 'Game Over, the aliens have destroyed you.';
            squares[currentShooterIndex].classList.add('boom');
            clearInterval(invaderId);
        }

        for(let i = 0; i <= alienInvaders.length -1; i++){
            if(alienInvaders[i] > (squares.length - (width - 1))) {
                resultDisplay.textContent = 'Game Over, the aliens have invaded our planet.';
                clearInterval(invaderId);
            }
        }

        //determine win ***********************************************************************************
        if(alienInvaderShotDown.length === alienInvaders.length){
            console.log('winner');
            resultDisplay.textContent = 'Winner. You saved the planet'
        }
    }
    invaderId = setInterval(moveAliens, 500);

    //shoot at the aliens
    function shoot(e) {
        let laserId;
        let currentLaserIndex = currentShooterIndex;
        //move the laser from the shooter to the alien Invader
        function moveLaser(){
            squares[currentLaserIndex].classList.remove('laser');
            currentLaserIndex -= width;  //to make the laser go straight up from where shot
            squares[currentLaserIndex].classList.add('laser');
            if(squares[currentLaserIndex].classList.contains('invader')){
                squares[currentLaserIndex].classList.remove('laser');
                squares[currentLaserIndex].classList.remove('invader');
                squares[currentLaserIndex].classList.add('boom');

                setTimeout(() => squares[currentLaserIndex].classList.remove('boom'), 250);
                clearInterval(laserId);

                const alienShotDown = alienInvaders.indexOf(currentLaserIndex);
                alienInvaderShotDown.push(alienShotDown);
                result++;
                resultDisplay.textContent = result;
            }
            if(currentLaserIndex < width) {
                clearInterval(laserId);
                setTimeout(() => squares[currentLaserIndex].classList.remove('laser'), 100);
            }
        }
        switch(e.keyCode){
            case 32:
                laserId = setInterval(moveLaser, 100);
                break;
        }
    }
    document.addEventListener('keydown', shoot);
})

