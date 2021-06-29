// Tasten initialisieren
let KEY_SPACE = false;  // 32
let KEY_UP = false;   // 38
let KEY_DOWN = false;  // 40

//Canvas initialisieren
let canvas;
let ctx;

//Hintergrundbild
let backgroundImage = new Image();

//Rakete Werte
let rocket =  {
    x: 50,
    y: 200,
    width: 90,
    height: 80,
    src: 'img/space-shuttle.png'
};

let rocketDown = false;

//Ufo 
let ufos =  [];

// Shot 
let shots = [];


// Tasten gedrückt
document.onkeydown = function (e){
    switch (e.keyCode){
       case 87:
           KEY_UP = true;
           break;
        case 83:
            KEY_DOWN = true;
            break;
        case 32:
            KEY_SPACE = true;
            break;
    }
};

// Tasten losgelassen
document.onkeyup = function (e){
    switch (e.keyCode){
       case 87:
           KEY_UP = false;
           break;
        case 83:
            KEY_DOWN = false;
            break;
        case 32:
            KEY_SPACE = false;
            break;
    }
};


// StartGame
function startGame(){
    let startDiv = document.getElementById("start");
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d'); // auf Canvas Zeichnen
    let gameOver = document.getElementById("game-over");

    startDiv.style.display ="none";
    canvas.style.display = "block";
    gameOver.style.display = "none";

    loadImages();
    setInterval(update, 1000 / 25);  //25 x pro sekunde ausgeführt
    setInterval(createUfos, 3000);
    setInterval(checkForCollision, 1000 / 25);
    setInterval(checkForKill,1000 /10);
    draw();
    //calculate
}

// Game Over
function gameOver(){
    let startDiv = document.getElementById("start");
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d'); // auf Canvas Zeichnen
    let gameOver = document.getElementById("game-over");

    startDiv.style.display ="none";
    canvas.style.display = "block";
    gameOver.style.display = "block";
    
    stopGame();
} 

// stopGame
function stopGame(){
    if(rocketDown){
        console.log("It's done I should stop now.")
        rocketDown = false;
    }
}

// Ufo's erstellen
function createUfos(){
    let ufo = {
        x: 800,
        y: 200,
        width: 80,
        height: 80,
        src: 'img/ufo.png',
        img: new Image()
    }

    for (let i = 0; i < 2; i++){
        ufo.y = randomRange(0, 400);
        ufo.img.src = ufo.src;  // Ufo-Bild wird geladen
        ufos.push(ufo)  
    }
}
 
// Random Spawn
function randomRange(minVal, maxVal){
    return Math.floor(Math.random() * (maxVal-minVal-1)) + minVal;
}


// Collisionen berechnen 
function checkForCollision(){
    ufos.forEach(function(ufo){
        if(rocket.x + rocket.width > ufo.x 
        && rocket.y + rocket.height > ufo.y
        && rocket.x < ufo.x
        && rocket.y < ufo.y)
        {
            rocket.img.src = 'img/collision.png';
            console.log("GAME OVER");
            ufos = ufos.filter(u => u != ufo);
            rocketDown = true;
        }

        shots.forEach(function(shot){
            if(shot.x + shot.width > ufo.x
            && shot.y + shot.height > ufo.y
            && shot.x < ufo.x
            && shot.y < ufo.y + ufo.height)
            {
                ufo.hit = true;
                ufo.img.src = 'img/collision2.png';
                console.log("Hit!");

                setTimeout(() => {
                    ufos = ufos.filter(u => u != ufo);
                }, 800);
            }
        });
    });
}


// Kills berechnen
function checkForKill(){
        if (KEY_SPACE){
         let shot = {
                x: rocket.x+90,
                y: rocket.y+30,
                width: 40,
                height: 20,
                src: 'img/shot2.png',
                img: new Image()
            };
                
            shot.img.src = shot.src;  // Shot-Bild wird geladen
            shots.push(shot)    // in Shot Array
        }
    }


// Update Funktion ändert Koordinaten von Rakete und Ufo
function update(){
    if(KEY_UP){
        rocket.y -= 4.5; //Schnelligkeit 
    }

    if(KEY_DOWN){
        rocket.y += 4; 
    }

    ufos.forEach(function(ufo){
        ufo.x -= 5;
    })

    shots.forEach(function(shot){
        shot.x += 7;
    })

    if(rocketDown){
        gameOver();
        
    }
}


// Bilder laden
function loadImages(){
    backgroundImage.src = "img/stars-4.jpg";
    rocket.img = new Image();
    rocket.img.src = rocket.src; // Bild wird geladen und in Rocket container hinterlegt
}

// Draw-Funktion: Zeichnen auf Canvas
function draw(){
    ctx.drawImage(backgroundImage,0 ,0);
    ctx.drawImage(rocket.img, rocket.x, rocket.y, rocket.width, rocket.height);

    ufos.forEach(function(ufo){
        ctx.drawImage(ufo.img, ufo.x, ufo.y, ufo.width, ufo.height);  
    });

    shots.forEach(function(shot){
        ctx.drawImage(shot.img, shot.x, shot.y, shot.width, shot.height);  
    });

    requestAnimationFrame(draw)
}
