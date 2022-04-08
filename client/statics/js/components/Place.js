export default class {
    constructor(params) {
        this.params = params;
    }

    setTitle(title) {
        document.title = title;
    }

    init() {
        const URL = "http://localhost:8888";

        // const worker = {}

        const directsX = ["left", "right"];
        const directsY = ["up", "down"];
        let killTimer = null;


        //keys state, l/r/u/d
        const keys = {
            KeyA: false,
            KeyD: false,
            KeyW: false,
            KeyS: false,
            restart: false,
            death: false,
            x: 0,
            y:0
        };

        let rafId = 0;

        //manage dom elems - coin opacity
        const mapItemsInDom = [];
        //for dumping props object, add pacamn & ghost Dom objects
        const obj = {};
        //clear interval - when temeout 10sec
        let interval;

        const props = {
            x: "", // for grid row - first render items in Dom - set grid style
            y: "",
            h: 31, // height borad, count Y
            size: 28,
            inPlay: false, // play state
            time: {
                sec: 0,
                min: 0,
            },
            skip: false,
            sceneType: "",
            mainMenu: true,
        };

        //unit objects - for manipualte game
        const persons = {
            alien: {
                posX: 450,
                posY: 420,
                basePos: 407,
                direct: "up",
            },

            worker: {
                role: "",
                message: "",
                direct: "up",
                posX: 425,
                posY: 695,
                basePos: 658,
                transX: "",
                indexMap: 0,
                life: 5,
                score: 0,
                countCoin: 0,
                canKill: false,
                pause: false,
                lastIndex: 0
            },
            devices: {
                lights: [],//position light
                heatings: [],
                accessByFace: []
            }
        };

        const mapGame = [
            1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
            1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0,
            1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 4, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1,
            0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 4, 1, 1, 0, 1, 1, 1, 1, 0, 1,
            1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
            1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1,
            1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1,
            1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0,
            0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1,
            9, 1, 1, 9, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 3, 3, 3, 3, 3, 1, 0, 1,
            1, 1, 1, 1, 9, 1, 1, 9, 1, 1, 1, 1, 1, 0, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3,
            3, 1, 0, 1, 1, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 1, 1, 0, 1, 3, 3, 3, 3, 3,
            3, 3, 3, 3, 3, 1, 0, 1, 1, 9, 1, 1, 1, 6, 6, 1, 1, 1, 9, 1, 1, 0, 1, 3,
            3, 3, 3, 3, 1, 1, 1, 1, 1, 1, 0, 1, 1, 9, 1, 1, 9, 9, 9, 9, 1, 1, 9, 1,
            1, 0, 1, 1, 1, 1, 1, 8, 9, 9, 9, 9, 9, 9, 0, 9, 9, 9, 1, 1, 2, 2, 2, 2,
            1, 1, 9, 9, 9, 0, 9, 9, 9, 9, 9, 9, 8, 1, 1, 1, 1, 1, 0, 1, 1, 9, 1, 1,
            1, 1, 1, 1, 1, 1, 9, 1, 1, 0, 1, 1, 1, 1, 1, 1, 3, 3, 3, 3, 3, 1, 0, 1,
            1, 9, 1, 1, 1, 1, 1, 1, 1, 1, 9, 1, 1, 0, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3,
            3, 1, 0, 1, 1, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 1, 1, 0, 1, 3, 3, 3, 3, 3,
            3, 3, 3, 3, 3, 1, 0, 1, 1, 9, 1, 1, 1, 1, 1, 1, 1, 1, 9, 1, 1, 0, 1, 3,
            3, 3, 3, 3, 1, 1, 1, 1, 1, 1, 0, 1, 1, 9, 1, 1, 1, 1, 1, 1, 1, 1, 9, 1,
            1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1,
            0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1,
            1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 4, 0, 0,
            1, 1, 0, 0, 0, 0, 0, 0, 0, 9, 9, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 4, 1,
            1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1,
            0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1,
            1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0,
            0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
            0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1,
            1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
            1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
            1, 1, 1, 1,
        ];
        //1 wall, 0 coin, 4 cookie, 8 teleport, 3 -empty, 9 freepath


        const move = (direction, person) => {
            //get index - by formula, posX, posY - index for mapGame // formula = y / 30 * 28 + x / 30
            if (person.alien) {
                alert('к вам пришел гость / происходит проникновение')//set msg dashboard
            }

            persons.pacman.indexMap = Math.floor(
                ((persons.pacman.posY - 5) / 30) * 28 + (persons.pacman.posX - 5) / 30
            );
            // persons.pacman.lastIndex = persons.pacman.indexMap;

            //switch case - currentPosition & person_role  & time ? 

            if (persons.pacman.restart) {
                //restore in array map value
                for (let i = 0; i < replaced.length; i++) {
                    mapGame[replaced[i]] = 0;
                }
                for (let i = 0; i < cookie.length; i++) {
                    mapGame[cookie[i]] = 4;
                }
                persons.pacman.posX = 425;
                persons.pacman.posY = 695;
                persons.pacman.score = 0;
                persons.pacman.indexMap = 658;
                //set def value in array Map
                persons.pacman.canKill = false;
                clearTimeout(killTimer);
                // console.log(killTimer, "in worker");
                persons.pacman.restart = false;
            }
            //check if key press equal  Right, nextPos in mapGame != 1, update value, goToRight
            if (keys.KeyA) {
                persons.pacman.direct = "left";
                if (mapGame[persons.pacman.indexMap - 1] !== 1) {
                    persons.pacman.posX -= 30;
                    persons.pacman.indexMap -= 1;
                    persons.pacman.transX = "translateX(0%)";
                    //check tele
                    if (mapGame[persons.pacman.indexMap] === 8) {
                        persons.pacman.posX += 840;
                    }
                }
            } else if (keys.KeyD) {
                persons.pacman.direct = "right";
                if (mapGame[persons.pacman.indexMap + 1] !== 1) {
                    //canKill - and intersect -> -life
                    persons.pacman.indexMap += 1;
                    persons.pacman.posX += 30;
                    persons.pacman.transX = "translateX(100%)";
                    if (mapGame[persons.pacman.indexMap] === 8) {
                        persons.pacman.posX -= 840;
                    }
                }
            } else if (keys.KeyW) {
                persons.pacman.direct = "up";
                if (mapGame[persons.pacman.indexMap - 28] !== 1) {
                    persons.pacman.indexMap -= 28;
                    persons.pacman.posY -= 30;
                }
            } else if (keys.KeyS) {
                persons.pacman.direct = "down";
                if (
                    mapGame[persons.pacman.indexMap + 28] !== 1 &&
                    mapGame[persons.pacman.indexMap + 28] !== 6
                ) {
                    persons.pacman.indexMap += 28;
                    persons.pacman.posY += 30;
                }
            }
            //if pacman stay 1 position, check interect
            if (!persons.pacman.canKill) {
                isIntersect(persons.pacman.direct, "pacman");
            }
            if (persons.pacman.canKill) {
                isIntersect(persons.pacman.direct, "ghost");
            }
            // console.log(mapGame[persons.pacman.indexMap], keys.restart);
            // if changed pacman icndex, eqaul 4 || 0, add score, change - currentPos = 0, -> currPos = 9
            if (mapGame[persons.pacman.indexMap] !== 1) {
                if (mapGame[persons.pacman.indexMap] === 0) {
                    persons.pacman.score += 1;
                    persons.pacman.countCoin++;
                    //remember index, then restore mapGame array by index
                    replaced.push(persons.pacman.indexMap);
                }
                //Invulnerable pacman 10 sec
                if (mapGame[persons.pacman.indexMap] === 4) {
                    persons.pacman.score += 5;
                    persons.pacman.canKill = true;
                    clearTimeout(killTimer);
                    killGhost(persons.pacman.killTime);
                    persons.pacman.countCoin++; // count coin for - check win game
                }
                if (persons.pacman.indexMap !== 420 && persons.pacman.indexMap !== 391) {
                    mapGame[persons.pacman.indexMap] = 9;
                }
            }
        };
        document.addEventListener("keyup", (e) => {
            if (e.code in keys) {
                keys[e.code] = false;
            }
        });

        const startTime = () => {
            props.notify.style.display = "none";
            //  props.time.sec === 60 ? ((props.time.sec = 0), (props.time.min += 1)) : 0; def time
            interval = setInterval(() => {
                props.time.sec += 1;
                props.time.sec === 30
                    ? ((props.time.sec = 0), (props.time.min += 1))
                    : 0;
            }, 1000);
        };


        let text = [];
        let textPos = 0;
        let lastPos = 0;

        //history ;; ?
        // document.addEventListener("keydown", (e) => {

        //     if (prefix === "lose" || prefix === "win") {
        //         if (prefix === "win") {
        //             msg = "Твое достижение останется на скалах предков... ";


        //transform translate each item - change posit 0 in Dom
        const render = (...args) => {
            args.forEach((el, i) => {
                obj[
                    el.nick
                ].style.transform = `translate(${el.posX}px, ${el.posY}px)`;
            });
        };


        const step = () => {
            if (props.inPlay) {
                unitsMT.cool--;
                if (unitsMT.cool < 0) {
                    //set updated data from bg thread
                    unitsMT.pacman.posX = e.data.pacman.posX;
                    unitsMT.pacman.posY = e.data.pacman.posY;
                    unitsMT.pacman.indexMap = e.data.pacman.indexMap;
                    unitsMT.pacman.score = e.data.pacman.score;
                    unitsMT.pacman.life = e.data.pacman.life;
                    unitsMT.pacman.countCoin = e.data.pacman.countCoin;
                    unitsMT.pacman.canKill = e.data.pacman.canKill;
                    unitsMT.pacman.transX = e.data.pacman.transX;
                    unitsMT.pacman.death = e.data.pacman.death;
                    // keys.restart = e.data.pacman.restart;
                };
                //if changed pacman index, eqaul 4 || 0, add score, change - currentPos = 0, -> currPos = 9
                if (mapGame[unitsMT.pacman.indexMap] !== 1) {
                    if (
                        unitsMT.pacman.indexMap !== 391 &&
                        unitsMT.pacman.indexMap !== 420 &&
                        unitsMT.pacman.indexMap !== 350 &&
                        unitsMT.pacman.indexMap !== 349
                    ) {
                        //change opacity - coin
                        mapItemsInDom[
                            unitsMT.pacman.indexMap
                        ].children[0].style.opacity = 0;
                    }
                    //change mouth - pacman
                    obj.pacman_mouth.style.transform = unitsMT.pacman.transX;
                }
                if (unitsMT.pacman.life > 0) {
                    if (unitsMT.pacman.countCoin === 244) {
                        props.sceneType = "win";
                        endGame();
                    }
                } else {
                    props.sceneType = "lose";
                    endGame();
                }
                //render - draw
                obj.pacman.style.transform = `translate(${unitsMT.pacman.posX}px, ${unitsMT.pacman.posY}px)`;
                obj.redGhost.style.transform = `translate(${unitsMT.redGhost.posX}px, ${unitsMT.redGhost.posY}px)`;
                obj.orangeGhost.style.transform = `translate(${unitsMT.orangeGhost.posX}px, ${unitsMT.orangeGhost.posY}px)`;
                obj.cyanGhost.style.transform = `translate(${unitsMT.cyanGhost.posX}px, ${unitsMT.cyanGhost.posY}px)`;
                obj.pinkGhost.style.transform = `translate(${unitsMT.pinkGhost.posX}px, ${unitsMT.pinkGhost.posY}px)`;
                //updated value - render scoreboard
                props.scoreBoard.children[0].textContent = `Вирусы:${unitsMT.pacman.score} Жизни:${unitsMT.pacman.life}  Месяц:${props.time.min} Дни:${props.time.sec} `;
                //cooldwon, 5 * 16.7 -> reaction each 83ms
                unitsMT.cool = 6;
            }
            rafId = requestAnimationFrame(step);
            if (unitsMT.pacman.pause) {
                window.cancelAnimationFrame(rafId);
            }

        };

        const createBoard = () => {
            //create each block -> get data from mapGame array

            //   let l = window.matchMedia("(max-width: 700px)")
            //   if(l.matches) {
            //     x = 13
            //   }
            mapGame.forEach((el, idx) => {
                createBlock(el);
            });
            // get static elems -> add in Obejct, then add array - tags, change values -> render new value
            for (let i = 0; i < props.size; i++) {
                props.x += 30 + "px "; //cell grid height, width count - for grid
            }
            // 31 count height field Map
            for (let i = 0; i < props.h; i++) {
                props.y += 30 + "px "; //cell grid rows count, 31px
            }
            //set grid rows, columns, size - count
            props.grid.style.gridTemplateColumns = props.x;
            props.grid.style.gridTemplateRows = props.y;
            //board localy dom, props.grid -> in DOm browser inserted
        };

        const createBlock = (type) => {
            let div = document.createElement("div");
            div.classList.add("box");
            //create new div -> add class, append object - props.grid
            if (type === 0) {
                const coin = document.createElement("div");
                coin.classList.add("coin");
                div.append(coin);
            } else if (type === 1) {
                let wall = document.createElement("div");
                wall.classList.add("wall");
                div.append(wall);
            } else if (type === 4) {
                let cookie = document.createElement("div");
                cookie.classList.add("cookie");
                div.append(cookie);
            } else if (type === 6) {
                let door = document.createElement("div");
                door.classList.add("doorEnemy");
                div.append(door);
            } else if (type === 8) {
                let teleport = document.createElement("div");
                teleport.classList.add("teleport");
                div.append(teleport);
            } else if (type === 9) {
                let free = document.createElement("div");
                free.classList.add("free");
                div.append(free);
            }
            div.type = type;
            mapItemsInDom.push(div);
            props.grid.append(div);
        };


        //dom onladed -> get grid elem, -> append - block, then manipulate this dom object, etc
        window.onload = () => {
            //save cache dom in nodes - addres in Ram - > then change by pointer
            props.root = document.querySelector("div#app");
            props.grid = document.querySelector("div.grid");
            props.modal = document.querySelector("div.modal");
            props.notify = document.querySelector("div.notify");
            obj.worker = document.querySelector("div#workerId");

            createBoard();
            console.log('creates board')
        };
    }

    async getHtml() {
        let wrapper = `

          <div id='grid' class="grid">
      
              <div id='workerId' class="worker" type=7>
                  <div class=""></div>
              </div>
      
              <div class="" id='alienId'>
                   <div class=""></div>
              </div>
        
        </div>
      
          <div class='modal' id='modal'>

              <div class="" id="dashboardId">
                <span id="timeId"> time: </span>
                <span id="weatherId"> weather: </span>                  
                <span id="statusId"> status: </span>                  
              </div>

        </div>`;
        
        return wrapper;
    }
}
