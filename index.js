
// 라운드 별로 어떻게 넘어갈껀지, UI/UX어떻게 짤껀지 생각.

// 데스크탑, 모바일에 따라 싸이즈 맞춰서 만들기.

// grid에 따라 start, end 사이즈랑 위치 조절하기

// Maze 랜덤으로 만들기. 

// 라운드 별로 grid, board, maze 업데이트. 

// css로 예쁘게 꾸미기, transition (라운드 div 만들고, Start! 창띄게하고, 3-2-1 카운트 센후 Round# 창 띄게하고, 시간지나면 자동으로 다음라운드로 넘어가게. 그 링크 닷 게임처럼 만들기)
// https://state2-dot-to.com
// https://www.youtube.com/watch?v=_s8PGt883os 게임 사운드 뽑기
// https://www.leshylabs.com/apps/sfMaker/ (pickup 5 or pickup 이랑 loss 이렇게 두개써보자.)
// https://www.youtube.com/watch?v=U5GUASL9OBs - success 1
// https://www.youtube.com/watch?v=p7g7eBVGTLQ&list=LL6_eyp7Y6_toLHmS9E9F3YA&index=14&t=0s (아쉬운 노래)


/*

모바일까지 끗내고, 데스크탑 여러 브라우저에서 테스팅, 모바일에서 아이폰 갤럭시 테스팅. 코드/파일 깃헙에 정리해서 올리고 publish하기.

b-school 일 끗내고, 비스쿨 코드 깃헙에 정리해서 올리기.

레쥬메 정리/업데이트 하기 (job description, 프로젝트)

다 햇으면 김지현 그 분한테 이메일보내서 이번학기 마무리하면서 레쥬메 업데이트를 했는데 follow up하고싶다고 연락.
그리고 업데이트된 레쥬메, 이번학기에 작업한 그 오디오 메이즈(게임 퍼블리쉬 링크)랑 비스쿨에 사용된 프로그램 깃헙 링크 첨부하고,
인터뷰때 말씀했던 평소에 코딩을 자주하는지, 그리고 코딩경험 얼마정도인지 물어본게 기억나서 이번학기동안 파트타임으로 일하면서 작업했던거 정리해서
보여주고 싶었다고 말하기.

이번뺄까 - 송명근 면접관이랑 인터뷰를 봤는데, 인터뷰질문중에 프로젝트나 관련 프로그래밍 경험을 물으셨는데,
프로젝트 설명은 항상 문서로만 작업해오고 구술로 프로젝트에 설명해본 경험이많이 없어서 당시 너무 간추려서 이야기했는데, 이런게 좀 아쉽다고 느껴져서
그동안 작업한거 정리하는도중 생각나서 팔로우업 하면서 보여주고 싶었다고 말하기?



a) 다음단계로 넘어갈때 
1. 레벨 넘어간다고 목소리, 
2. 짝짝짝 박수 소리

b) Start 누르면
1. 게임 스타트 목소리
2. 배경음? (ambience music 같은걸로, 그리고 tone.js 음이랑 좀 어울려야함)

c) Retry 누르면
1. 게임 스타트 목소리
2. 배경음? (ambience music 같은걸로, 그리고 tone.js 음이랑 좀 어울려야함)

d) Timer expried 됫을때
1. 아쉬운 아~ 소리
2. Timer expried 목소리 넣을까? 필요없을려나

e) 마지막 단계 까지 깻을때
1. intro2 그거 배경음으로 쓸까?
2. All Levels Clear! Congrutulations! 목소리

f) 시간 10초남앗을때
1. 목소리로 10초남았다고 말하기.

g) 시간 30초 남았을때
1. 목소리로 30초남았다고 말하기.

h) 터치로 구동하게 만들기. 
1. 마우스 그거만 터치 드래깅으로 바꾸면 될것같은데
2. 레이아웃 모바일용으로 작게만들기.



*/


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
    let s = 90;
    let ms = 0;
    clearInterval(timer_loop);
    timer_loop = setInterval(function() {

        if (ms == 0) {
            if (s <= 0) { // the timer expired, so move to the "retry" state

                audio.src = playlist["outro"];
                audio.volume = 0.7;
                audio.play();

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
            speechSynthesis.speak(voice_make(`${s_temp} seconds left`));
        }

        
    }, 10);
}

game_on = false;
level = 1;
max_level = 10;
index = 0;
grid = 5; // Board = 5 by 5
board = board_generate(grid);
maze = { // [y, x]
    1: [[0,0],[0,1],[0, 2],[0,3],[0,4]],
    2: [[0,1],[1,1],[2, 1],[3,1],[4,1]],
    3: [[0,1],[0,2],[0, 3],[1,3],[2,3],[3,3],[4,3]],
    4: [[0,1],[1,1],[2, 1],[3,1],[4,1],[4,2]],
    5: [[4,0],[4,1],[4,2],[4,3],[4,4],[3,4]],
    6: [[0,1],[0,2],[0,3],[0,4],[1,4],[2,4],[3,4]],
    7: [[0,0],[0,1],[0,2],[1,2],[2,2],[3,2],[4,2],[4,3],[4,4]],
    8: [[0,0],[0,1],[0,2],[0,3],[0,4],[1,4],[2,4],[2,3],[2,2],[2,1],[2,0],[3,0],[4,0],[4,1],[4,2],[4,3],[4,4]],
    9: [[0,0],[0,1],[0,2],[0,3],[0,4],[1,4],[1,3],[1,2],[1,1],[1,0],[2,0],[2,1],[2, 2],[2,3],[2,4],[3,4],[3,3],[3,2],[3,1],[3,0],[4,0],[4,1],[4,2],[4,3],[4,4]],
    10:[[2,2],[2,3],[1,3],[1,2],[1,1],[2,1],[3,1],[3,2],[3,3],[3,4],[2,4],[1,4],[0,4],[0,3],[0,2],[0,1],[0,0],[1,0],[2,0],[3,0],[4,0],[4,1],[4,2],[4,3],[4,4]]
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

        note_th_update();
        synth.triggerAttackRelease(`${notes[index%7]}${note_th}`, "100n");
        



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

// function mouseHandler(canvas, ctx, maze, index, board, grid, empty_color, filled_color) {
function mouseHandler() {
    let coor;
    let index_temp;
    canvas.addEventListener("mousemove", function(ev) {
        if (game_on) {
            coor = getMousePos(ev); // coor = [y, x]
            index_temp = tracker(coor, maze, index, canvas, grid, board);
            if (index_temp > index) { // Correct Path
                if (maze[level].length == index_temp) { // Cleared the current level;
                    console.log("clear!!");
                    if (level == max_level) { // the current level is the last level, so move to the "retry" state

                        audio.src = playlist["outro"];
                        audio.volume = 0.7;
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
    });
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
    // mouseHandler(canvas, ctx, maze, index, board, grid, empty_color, filled_color);
    mouseHandler();
    $("#state1").on("click", function() {

        // audio.src = playlist["intro2"];
        // audio.volume = 0.1;
        // audio.play();
        audio.volume = 0.0;
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
        //create a synth and connect it to the master output (your speakers)
        synth = new Tone.Synth().toMaster();
        // synth.volume.value = -5;
        //play a middle 'C' for the duration of an 8th note
        // synth.triggerAttackRelease("C4", "10n");
        // music start



    });


    
    
    

});