


function voice_make(sentence) {
    const voice = new SpeechSynthesisUtterance(sentence);
    voice.pitch = 0.8;
    voice.volume = 1.0;
    voice.rate = 1.0;
    return voice;
}


var audio = new Audio();
audio.loop = true;

let playlist = {
    "outro": './asset/outro.mp3', 
};


let synth;

let note_th = 4;

let notes = {
    0: "C",
    1: "D",
    2: "E",
    3: "F",
    4: "G",
    5: "A",
    6: "B"
};


let canvas, ctx, grid, board, maze, index, empty_color, filled_color, text_font, level, state, response, timer_loop, game_on, all_clear;
all_clear = false;

function timer_begin() {
    let s = 20;
    let ms = 0;
    clearInterval(timer_loop);
    timer_loop = setInterval(function() {

        if (ms == 0) {
            if (s <= 0) { // the timer expired, so move to the "retry" state

      
                audio.play();


                game_on = false;
                clearInterval(timer_loop);
                response = update_state("state1");
                response.then(function(result) {
                    //console.log(result);
                    index = 0;
                    level = 1
                    $("#level").html(level);
                    board = board_generate(grid);
                    update(ctx, board, grid, empty_color, filled_color);
                });
                return 0;
            }
            ms = 100
            s = s - 1
        }
        ms = ms - 1;
        if (s < 10) {
            s_temp = `0${s}`
        } else {
            s_temp = `${s}`
        }
        if (ms < 10) {
            ms_temp = `0${ms}`
        } else {
            ms_temp = `${ms}`
        }        
        $("#timer").html(`${s_temp}:${ms_temp}`)

        if (s_temp == 30 && ms_temp == 00) {
            speechSynthesis.speak(voice_make(`${s_temp} seconds left`));
        }
        else if (s_temp == 20 && ms_temp == 00) {
            speechSynthesis.speak(voice_make(`${s_temp} seconds left`));
        }
        else if (s_temp == 10 && ms_temp == 00) {
            speechSynthesis.speak(voice_make(`${s_temp} seconds left`));
        }
        else if (s_temp == 5 && ms_temp == 00) {
            speechSynthesis.speak(voice_make(`${5} seconds left`));
        }

        
    }, 10);
}

game_on = false;
level = 1;
max_level = 15;
index = 0;
grid = 5; // Board = 5 by 5
board = board_generate(grid);
maze = { // [y, x]
    1: [[0,0],[0,1],[0,2]],
    2: [[1,0],[1,1],[1,2],[1,3],[1,4]],
    3: [[1,0],[2,0],[3,0]],
    4: [[0,1],[1,1],[2,1],[3,1],[4,1]],
    5: [[0,0],[0,1],[0,2],[0,3],[0,4],[1,4],[2,4],[3,4],[4,4]],
    6: [[0,0],[1,0],[2,0],[3,0],[4,0],[4,1],[4,2],[4,3],[4,4]],
    7: [[4,0],[4,1],[4,2],[4,3],[4,4],[3,4],[2,4]],
    8: [[4,4],[3,4],[2,4],[1,4],[0,4],[0,3],[0,2]],
    9: [[0,0],[0,1],[0,2],[1,2],[2,2],[3,2],[4,2],[4,3],[4,4]],
    10: [[0,0],[1,0],[2,0],[3,0],[4,0],[4,1],[4,2],[4,3],[4,4],[3,4],[2,4],[1,4],[0,4]],
    11: [[0,0],[0,1],[0,2],[0,3],[0,4],[1,4],[2,4],[2,3],[2,2],[2,1],[2,0],[3,0],[4,0],[4,1],[4,2],[4,3],[4,4]],
    12: [[0,0],[0,1],[1,1],[1,2],[2,2],[2,3],[3,3],[3,4],[4,4]],
    13: [[0,0],[0,1],[0,2],[0,3],[0,4],[1,4],[1,3],[1,2],[1,1],[1,0],[2,0],[2,1],[2,2],[2,3],[2,4],[3,4],[3,3],[3,2],[3,1],[3,0],[4,0],[4,1],[4,2],[4,3],[4,4]],
    14: [[2,2],[2,3],[1,3],[1,2],[1,1],[2,1],[3,1],[3,2],[3,3],[3,4],[2,4],[1,4],[0,4],[0,3],[0,2],[0,1],[0,0],[1,0],[2,0],[3,0],[4,0],[4,1],[4,2],[4,3],[4,4]],
    15: [[0,0],[0,1],[1,1],[1,0],[2,0],[2,1],[2,2],[1,2],[0,2],[0,3],[1,3],[2,3],[3,3],[3,2],[3,1],[3,0],[4,0],[4,1],[4,2],[4,3],[4,4],[3,4],[2,4],[1,4],[0,4]]
};
empty_color = "rgb(255, 255, 255)"; // white
filled_color = "rgb(255, 0, 0)"; // red
text_color = "rgb(255, 100, 100)"
text_font = "bold 25px sans-serif";

function board_generate(grid) {
    let board = [];
    for (let i = 0; i < grid; i++) {
        temp = [];
        for (let j = 0; j < grid; j++) {
            temp.push(0);
        }
        board.push(temp);
    }
    return board;
}

function drawRect(ctx, x, y, width, height, color){
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}

function drawText(text, ctx, x, y, color, text_font){
    ctx.fillStyle = color;
    ctx.font = text_font;
    ctx.fillText(text, x, y);
}

function update(ctx, board, grid, empty_color, filled_color) {
    for (let y = 0; y < grid; y++) {
        for (let x = 0; x < grid; x++) {
            if (board[y][x] == 1) {
                drawRect(ctx, x*(canvas.width/grid), y*(canvas.height/grid), canvas.width/grid, canvas.height/grid, filled_color);
            }
            else {
                drawRect(ctx, x*(canvas.width/grid), y*(canvas.width/grid), canvas.width/grid, canvas.height/grid, empty_color);
            }
        }
    }
    draw_start_end();
}

function getMousePos(ev) { 
    let rect = canvas.getBoundingClientRect();
    return [ev.clientY-rect.top+1, ev.clientX-rect.left+1];
}

function getTouchPos(ev) { 
    let rect = canvas.getBoundingClientRect();
    return [(ev.touches[0].clientY-rect.top+1)*5/3, (ev.touches[0].clientX-rect.left+1)*5/3];
}


function note_th_update() {
    if (index == 0) {
        note_th = 4;
    }
    else {
        if (index/7 >= 1 && index/7 < 2) {
            note_th = 5;
        }
        else if (index/7 >= 2 && index/7 < 3) {
            note_th = 6;
        }
        else if (index/7 >= 3 && index/7 < 4) {
            note_th = 7;
        }
        else if (index/7 >= 4 && index/7 < 5) {
            note_th = 8;
        }
    }
}

function tracker(coor, maze, index, canvas, grid, board) {
    if ((coor[0] >= maze[level][index][0]*(canvas.height/grid) && coor[0] < ((maze[level][index][0])+1)*(canvas.height/grid)) && (coor[1] >= maze[level][index][1]*(canvas.width/grid) && coor[1] < ((maze[level][index][1])+1)*(canvas.width/grid))) {
        board[maze[level][index][0]][maze[level][index][1]] = 1;

        //note_th_update();
        //synth.triggerAttackRelease(`${notes[index%7]}${note_th}`, "100n");

        index = index + 1;
        if (maze[level].length == index) {
            console.log("clear!!");
        }
        return index;
    }
    else {
        for (let i = 0; i < index; i++) {
            if ((coor[0] >= maze[level][i][0]*(canvas.height/grid) && coor[0] < ((maze[level][i][0])+1)*(canvas.height/grid)) && (coor[1] >= maze[level][i][1]*(canvas.width/grid) && coor[1] < ((maze[level][i][1])+1)*(canvas.width/grid))) {
                return index;
            }
        }
        return -1;
    }
}



function touch_motion(ev) {
    ev.preventDefault();
    let coor;
    let index_temp;
        if (game_on) {
            coor = getTouchPos(ev); // coor = [y, x]
            //speechSynthesis.speak(voice_make("start"));
            //console.log(`coor: ${coor}`);
            index_temp = tracker(coor, maze, index, canvas, grid, board);
            if (index_temp > index) { // Correct Path
                if (maze[level].length == index_temp) { // Cleared the current level;
                    console.log("clear!!");
                    if (level == max_level) { // the current level is the last level, so move to the "retry" state

                        audio.play();

                        all_clear = true;
                        game_on = false;
                        clearInterval(timer_loop);
                        response = update_state("state1");
                        response.then(function(result) {
                            console.log(result);
                            index = 0;
                            level = 1
                            $("#level").html(level);
                            board = board_generate(grid);
                            update(ctx, board, grid, empty_color, filled_color);
                        });
                    }
                    else { // move to the next level
                        game_on = false;
                        clearInterval(timer_loop);
                        response = update_state("state2");
                        response.then(function(result){
                            console.log(result);
                            index = 0;
                            level = level + 1
                            $("#level").html(level);
                            board = board_generate(grid);
                            update(ctx, board, grid, empty_color, filled_color);
                            game_on = true;
                            timer_begin();
                        })
                    }
                }
                update(ctx, board, grid, empty_color, filled_color);
                // 이 index는 tracker에서 index가 없데이트 되지 않기대문에 여기에 넣은거임.
                index = index + 1; // index를 다음단계로 넘겨야함. 그래야 메이즈의 다음 path를 찾을수 있음.
            }
            // Stayed on the same position, nothing happened
            else if (index_temp == index) {
                update(ctx, board, grid, empty_color, filled_color);
            }
            // Wrong path, reset the grid
            else {
                // console.log("reset");
                board = board_generate(grid);
                update(ctx, board, grid, empty_color, filled_color);
                index = 0;
            }
            tracker(coor, maze, index, canvas, grid, board);
            update(ctx, board, grid, empty_color, filled_color); 
        };
    }

    function mouse_motion(ev) {
        let coor;
        let index_temp;
            if (game_on) {
                coor = getMousePos(ev); // coor = [y, x]
                //speechSynthesis.speak(voice_make("start"));
                //console.log(`coor: ${coor}`);
                index_temp = tracker(coor, maze, index, canvas, grid, board);
                if (index_temp > index) { // Correct Path
                    note_th_update();
                    synth.triggerAttackRelease(`${notes[index%7]}${note_th}`, "100n");
                    if (maze[level].length == index_temp) { // Cleared the current level;
                        console.log("clear!!");
                        if (level == max_level) { // the current level is the last level, so move to the "retry" state
    
                            audio.play();
    
                            all_clear = true;
                            game_on = false;
                            clearInterval(timer_loop);
                            response = update_state("state1");
                            response.then(function(result) {
                                console.log(result);
                                index = 0;
                                level = 1
                                $("#level").html(level);
                                board = board_generate(grid);
                                update(ctx, board, grid, empty_color, filled_color);
                            });
                        }
                        else { // move to the next level
                            game_on = false;
                            clearInterval(timer_loop);
                            response = update_state("state2");
                            response.then(function(result){
                                console.log(result);
                                index = 0;
                                level = level + 1
                                $("#level").html(level);
                                board = board_generate(grid);
                                update(ctx, board, grid, empty_color, filled_color);
                                game_on = true;
                                timer_begin();
                            })
                        }
                    }
                    update(ctx, board, grid, empty_color, filled_color);
                    // 이 index는 tracker에서 index가 없데이트 되지 않기대문에 여기에 넣은거임.
                    index = index + 1; // index를 다음단계로 넘겨야함. 그래야 메이즈의 다음 path를 찾을수 있음.
                }
                // Stayed on the same position, nothing happened
                else if (index_temp == index) {
                    update(ctx, board, grid, empty_color, filled_color);
                }
                // Wrong path, reset the grid
                else {
                    // console.log("reset");
                    board = board_generate(grid);
                    update(ctx, board, grid, empty_color, filled_color);
                    index = 0;
                }
                tracker(coor, maze, index, canvas, grid, board);
                update(ctx, board, grid, empty_color, filled_color); 
            };
        }










// function mouseHandler(canvas, ctx, maze, index, board, grid, empty_color, filled_color) {
function mouseHandler() {
    
    canvas.addEventListener("touchstart", touch_motion, { passive: false });
    canvas.addEventListener("touchmove", touch_motion, { passive: false });
    canvas.addEventListener("touchend", touch_motion, { passive: false });
    canvas.addEventListener("mousemove", mouse_motion, { passive: false });    
};

function canvas_init() {
    canvas = document.getElementById("root");
    ctx = canvas.getContext('2d');
    canvas.width = 500;
    canvas.height = 500;
}

function draw_start_end() {
    drawRect(ctx, maze[level][0][1]*(canvas.width/grid), maze[level][0][0]*(canvas.height/grid), canvas.width/grid, canvas.height/grid, filled_color);
    drawRect(ctx, maze[level][maze[level].length-1][1]*(canvas.width/grid), maze[level][maze[level].length-1][0]*(canvas.height/grid), canvas.width/grid, canvas.height/grid, filled_color);
    drawText("START", ctx, (maze[level][0][1]*100)+10, (maze[level][0][0]*100)+60, empty_color, text_font);
    drawText("END", ctx, (maze[level][maze[level].length-1][1]*100)+25, (maze[level][maze[level].length-1][0]*100)+60, empty_color, text_font);
}


async function update_state(keyword) {
    return new Promise(function(resolve) {
        if (keyword == "init") { // initialize the state
            $("#state1").css({top: '-100px', position:'absolute'});
            setTimeout(function() {
                speechSynthesis.speak(voice_make("Game start"));

                setTimeout(function() {   
                     speechSynthesis.speak(voice_make(`Level ${level}`));
                 }, 1000);

                setTimeout(function() {         
                    //speechSynthesis.speak(voice_make(`Level ${level}`));   
                    $("#state2").css("opacity", 0.5);
                    $("#state2").css("z-index", 2);
                    resolve("init Finished");
                }, 1500);
                
            }, 300);
        }
        else if (keyword == "state1") { // change current state to state1
            if (all_clear) {
                speechSynthesis.speak(voice_make("Congratulations. All levels clear!"));
                all_clear = false;
            } else {
                speechSynthesis.speak(voice_make("Time expired"));
            }
            setTimeout(function() {
                $("#state2").css("opacity", 0.0);
                $("#state2").css("z-index", 0); 
                setTimeout(function() {
                    $("#state1").html("Retry");
                    $("#state1").css({top: '50%', position:'absolute'});
                    resolve("state1 Finished");
                }, 1000);
            }, 500);
        }
        else if (keyword == "state2") { // change current state to state2
            console.log(level);
            speechSynthesis.speak(voice_make(`Level ${level} clear`));
            setTimeout(function() {
                setTimeout(function() {
                    speechSynthesis.speak(voice_make(`Level ${level+1}`));
                }, 1000);
                $("#state2").css("opacity", 0.0);
                $("#state2").css("z-index", 0);
                setTimeout(function() {
                    $("#state2").css("opacity", 0.5);
                    $("#state2").css("z-index", 2);
                    resolve("state2 Finished");
                }, 2000);
            }, 500);
        }
    });
}


$(document).ready(function () {

    canvas_init();
    update(ctx, board, grid, empty_color, filled_color);
    mouseHandler();
    $("#state1").on("click", function() {
        audio.src = playlist["outro"];
        audio.volume = 0.7;
        audio.play();
        audio.pause();
        update(ctx, board, grid, empty_color, filled_color);
        response = update_state("init");
        response.then(function(result) {
            console.log(result);
            timer_begin();
            game_on = true;
        })
    });

    $("#state1").on("click", async () => {
        await Tone.start();
        console.log('audio is ready');
        synth = new Tone.Synth().toMaster();
    });


    
    
    

});