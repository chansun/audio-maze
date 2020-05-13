class Model {
    constructor() {
        this.state = {
            page : "menu",
            word : "start", 
            level : 1, 
            max_level : 15,
            index: 0,
            board : this.boardGenerate(5),
            empty_color : "rgb(255, 255, 255)",
            filled_color : "rgb(255, 0, 0)",
            text_color : "rgb(255, 100, 100)",
            text_font : "bold 25px sans-serif",
            maze : { // [y, x]
                1: [[0,0],[0,1],[0,2]],
                2: [[1,0],[1,1],[1,2],[1,3],[1,4]],
                3: [[0,0],[0,1],[0,2],[0,3],[0,4],[1,4],[2,4],[3,4],[4,4]],
                4: [[0,0],[0,1],[0,2],[1,2],[2,2],[3,2],[4,2],[4,3],[4,4]],
                5: [[1,0],[1,1],[1,2],[2,2],[2,3],[2,4]],
                6: [[0,0],[1,0],[2,0],[3,0],[4,0],[4,1],[4,2],[4,3],[4,4],[3,4],[2,4],[1,4],[0,4],[0,3],[0,2],[0,1]],
                7: [[0,2],[1,2],[1,3],[1,4],[2,4],[3,4],[3,3],[3,2],[4,2]],
                8: [[0,0],[0,1],[1,1],[1,2],[2,2],[2,3],[3,3],[3,4],[4,4]],
                9: [[0,0],[0,1],[0,2],[0,3],[0,4],[1,4],[2,4],[2,3],[2,2],[2,1],[2,0],[3,0],[4,0],[4,1],[4,2],[4,3],[4,4]],
                10: [[1,0],[1,1],[0,1],[0,2],[0,3],[1,3],[1,4],[2,4],[3,4],[3,3],[4,3],[4,2],[4,1],[3,1],[3,0],[2,0]],
                11: [[0,0],[0,1],[0,2],[0,3],[0,4],[1,4],[1,3],[1,2],[1,1],[1,0],[2,0],[2,1],[2,2],[2,3],[2,4],[3,4],[3,3],[3,2],[3,1],[3,0],[4,0],[4,1],[4,2],[4,3],[4,4]],
                12: [[2,2],[2,3],[1,3],[1,2],[1,1],[2,1],[3,1],[3,2],[3,3],[3,4],[2,4],[1,4],[0,4],[0,3],[0,2],[0,1],[0,0],[1,0],[2,0],[3,0],[4,0],[4,1],[4,2],[4,3],[4,4]],
                13: [[0,0],[0,1],[1,1],[1,0],[2,0],[2,1],[2,2],[1,2],[0,2],[0,3],[1,3],[2,3],[3,3],[3,2],[3,1],[3,0],[4,0],[4,1],[4,2],[4,3],[4,4],[3,4],[2,4],[1,4],[0,4]],
                14: [[0,0],[0,1],[1,1],[1,2],[2,2],[2,3],[3,3],[3,4],[4,4],[4,3],[4,2],[3,2],[3,1],[2,1],[2,0],[1,0]],
                15: [[0,0],[0,1],[1,1],[1,0],[2,0],[2,1],[3,1],[3,0],[4,0],[4,1],[4,2],[3,2],[2,2],[1,2],[0,2],[0,3],[0,4],[1,4],[1,3],[2,3],[2,4],[3,4],[3,3],[4,3],[4,4]]
            },
            octave : 4,
            notes : {
                0: "C",
                1: "D",
                2: "E",
                3: "F",
                4: "G",
                5: "A",
                6: "B"
            },
            synth : null,
            sound_on : false,
            audio : new Audio(),
            play_list : {
                "outro": './asset/outro.mp3'
            },
            bgm_on : false,
            delay : false,
            s : "03", 
            ms : "00",
            sentence : "Game Start",
            voice_on : false,
            lose : false,
        }
    };
    // Callback
    bindChange(callback) {
        this.change = callback
    }
    // Helper
    boardGenerate(grid) {
        let temp1 = [];
        let temp2;
        for (let i = 0; i < grid; i++) {
            temp2 = [];
            for (let j = 0; j < grid; j++) {
                temp2.push(0);
            }
            temp1.push(temp2);
        }
        return temp1;
    }
    // Setters
    pageChange(new_page) {
        this.state["page"] = new_page;
        this.change(this.state);
    }
    wordChange(new_word) {
        this.state["word"] = new_word;
        this.change(this.state);
    }
    boardAdvance() {
        let maze = this.state["maze"];
        let level = this.state["level"];
        let index = this.state["index"];
        this.state["board"][maze[level][index][0]][maze[level][index][1]] = 1;
        this.state["index"] = index + 1;
        this.change(this.state);
    }
    boardReset() {
        this.state["board"] = this.boardGenerate(5);
        this.change(this.state);
    }
    levelChange(new_level) {
        this.state["level"] = new_level;
        this.change(this.state);
    }
    indexChange(new_index) {
        this.state["index"] = new_index;
        this.change(this.state);
    }
    octaveChange(new_octave) {
        this.state["octave"] = new_octave;
        this.change(this.state);
    }
    synthInit() {
        this.state["synth"] = new Tone.Synth().toDestination();
        this.change(this.state);
    }
    bgmInit() {
        this.state["audio"].src = this.state["play_list"]["outro"];
        this.state["audio"].volume = 0.7;
        this.state["audio"].pause();
        this.change(this.state);
    }
    bgmChange(value) {
        this.state["bgm_on"] = value;
        this.change(this.state);
    }
    soundChange(value) {
        this.state["sound_on"] = value;
        this.change(this.state);
    }
    delayChange(value) {
        this.state["delay"] = value;
        this.change(this.state);
    }
    sChange(value) {
        this.state["s"] = value;
        this.change(this.state);
    }
    msChange(value) {
        this.state["ms"] = value;
        this.change(this.state);
    }
    sentenceChange(value) {
        this.state["sentence"] = value;
        this.change(this.state);
    }
    voiceChange(value) {
        this.state["voice_on"] = value;
        this.change(this.state);
    }
    loseChange(value) {
        this.state["lose"] = value;
        this.change(this.state);
    }
}

class View {
    constructor() {
        this.canvas = document.getElementById("root");
        this.canvas.width = 500;
        this.canvas.height = 500;
        this.ctx = this.canvas.getContext('2d');
        this.timer = $("#timer");
        this.level = $("#level");
        this.state1 = $("#state1");
        this.state2 = $("#state2");
        this.timer = $("#timer");
    }
    // Renderer 
    renderUI(state) {
        if (state["page"] == "menu") {
            if (state["delay"]) {
                this.state2.css("opacity", 0.0);
                this.state2.css("z-index", 0); 
            } else {
                if (state["bgm_on"]) {
                    state["audio"].play();
                }
                this.state1.css({top: '50%', position:'absolute'});
                this.state1.html(state["word"]);
            }
        } else if (state["page"] == "play") {
            if (state["delay"]) {
                this.state1.css({top: '-100px', position:'absolute'});
                this.state2.css("opacity", 0.0);
                this.state2.css("z-index", 0); 
            } else {
                if (state["sound_on"]) {
                    state["synth"].triggerAttackRelease(`${state["notes"][state["index"]%7]}${state["octave"]}`, "100n");
                }
                this.level.html(state["level"]);
                this.drawBoard(state);
                this.timer.html(`${state["s"]}:${state["ms"]}`)
                this.state2.css("opacity", 0.5);
                this.state2.css("z-index", 2);
            }
            state["audio"].pause();
        }
        if (state["voice_on"]) {
            this.voiceMake(state["sentence"]);
        }
    }
    // Helpers
    drawBoard(state) {
        for (let y = 0; y < 5; y++) {
            for (let x = 0; x < 5; x++) {
                if (state["board"][y][x] == 1) {
                    this.drawRect(x, y, state["filled_color"]);
                } else {
                    this.drawRect(x, y, state["empty_color"]);
                }
            }
        }
        this.drawStartEnd(state);
    }
    drawStartEnd (state) {
        let curr = state["maze"][state["level"]];
        this.drawRect(curr[0][1], curr[0][0], state["filled_color"]);
        this.drawRect(curr[curr.length-1][1], curr[curr.length-1][0], state["filled_color"]);
        this.drawText(state, "START");
        this.drawText(state, "END");
    }
    drawRect(x, y, color) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x*100, y*100, 100, 100);
    }
    drawText(state, text) {
        let curr = state["maze"][state["level"]];
        this.ctx.fillStyle = state["empty_color"];
        this.ctx.font = state["text_font"];
        if (text == "START") {
            this.ctx.fillText(text, (curr[0][1]*100)+10, (curr[0][0]*100)+60);
        } else if (text == "END") {
            this.ctx.fillText(text, (curr[curr.length-1][1]*100)+25, (curr[curr.length-1][0]*100)+60);
        }
    }
    voiceMake(sentence) {
        const voice = new SpeechSynthesisUtterance(sentence);
        voice.pitch = 0.8;
        voice.volume = 1.0;
        voice.rate = 1.0;
        speechSynthesis.speak(voice);
    }
    // Binders
    bindClick(handler) {
        this.state1.on("click", async () => {
            //await Tone.start();
            handler();
        });
    }
    bindMouse(handler) {
        let rect = this.canvas.getBoundingClientRect();
        let x, y;
        this.state2.on("mousemove", function(ev) {
            x = ev.clientX-rect.left+1;
            y = ev.clientY-rect.top+1;
            handler([y, x]);
        });
    }
    bindTouch(handler) {
        let rect = this.canvas.getBoundingClientRect();
        let x, y;
        //this.state2.on("touchstart touchmove touchend", function(ev) {
        this.state2.on("touchstart touchmove", function(ev) {
            x = ((ev.touches[0].clientX)-rect.left+1)*5/3
            y = (ev.touches[0].clientY-rect.top+1)*5/3
            handler([y, x]);
        });
    }
}

class Controller {
    constructor(model, view) {
        this.model = model
        this.view = view
        this.model.bindChange(this.notify.bind(this));
        this.view.bindClick(this.gameStart.bind(this));
        this.view.bindMouse(this.handleMouse.bind(this));
        this.view.bindTouch(this.handleTouch.bind(this));
        this.notify(this.model.state);
        this.looper;
    }
    // Handlers
    notify(state) {
        this.view.renderUI(state)
    }
    gameStart() {
        let this_temp = this;
        let model_temp = this.model;
        model_temp.delayChange(true);
        setTimeout(function() { model_temp.delayChange(false); this_temp.timerBegin(); }, 1000);
        this.model.sentenceChange("Game Start");
        this.model.voiceChange(true);
        this.model.voiceChange(false);
        setTimeout(function() { model_temp.sentenceChange(`Level${model_temp.state["level"]}`); model_temp.voiceChange(true); model_temp.voiceChange(false); }, 1000);
        this.model.pageChange("play");
        this.model.synthInit();
        this.model.bgmInit();
        this.model.bgmChange(false);
    }
    handleMouse(coor) {
        let maze = this.model["state"]["maze"];
        let level = this.model["state"]["level"];
        let index = this.model["state"]["index"];
        // when coor hits the next part of the maze path:
        if ((coor[0] >= maze[level][index][0]*100 && coor[0] < ((maze[level][index][0])+1)*100) && (coor[1] >= maze[level][index][1]*100 && coor[1] < ((maze[level][index][1])+1)*100)) {
            this.adjustOctave();
            this.adjustGameState();
        } else {
            let check = false;
            // when coor is inside the maze path:
            for (let i = 0; i < index; i++) {
                if ((coor[0] >= maze[level][i][0]*(100) && coor[0] < ((maze[level][i][0])+1)*(100)) && (coor[1] >= maze[level][i][1]*(100) && coor[1] < ((maze[level][i][1])+1)*(100))) {
                    check = true;
                }
            }
            // when coor is outside the path:
            if (!check) {
                this.levelReset();
            }
        }
    }
    handleTouch(coor) {
        let maze = this.model["state"]["maze"];
        let level = this.model["state"]["level"];
        let index = this.model["state"]["index"];
        // when coor hits the next part of the maze path:
        if ((coor[0] >= maze[level][index][0]*100 && coor[0] < ((maze[level][index][0])+1)*100) && (coor[1] >= maze[level][index][1]*100 && coor[1] < ((maze[level][index][1])+1)*100)) {
            //this.adjustOctave(); 
            this.adjustGameState();
        } else {
            let check = false;
            // when coor is inside the maze path:
            for (let i = 0; i < index; i++) {
                if ((coor[0] >= maze[level][i][0]*(100) && coor[0] < ((maze[level][i][0])+1)*(100)) && (coor[1] >= maze[level][i][1]*(100) && coor[1] < ((maze[level][i][1])+1)*(100))) {
                    check = true;
                }
            }
            // when coor is outside the path:
            if (!check) {
                this.levelReset();
            }
        }
    }
    // Helpers
    gameEnd() {
        clearInterval(this.looper);
        let model_temp = this.model;
        model_temp.delayChange(true);
        if (model_temp.state["lose"]) {
            model_temp.sentenceChange(`Timer Expired`);
            setTimeout(function() { model_temp.delayChange(false); }, 500);
        } else {
            model_temp.sentenceChange(`Congratulations. All levels clear!`);
            setTimeout(function() { model_temp.delayChange(false); }, 2000);
        }
        model_temp.voiceChange(true);
        model_temp.voiceChange(false);
        this.model.wordChange("retry");
        this.model.levelChange(1);
        this.model.pageChange("menu");
        this.model.bgmChange(true);
        this.levelReset();
    }
    levelUp() {
        let this_temp = this;
        let model_temp = this.model;
        model_temp.delayChange(true);
        setTimeout(function() { model_temp.delayChange(false); this_temp.timerBegin(); }, 1000);
        model_temp.sentenceChange(`Level${model_temp.state["level"]} Clear`);
        model_temp.voiceChange(true);
        model_temp.voiceChange(false);
        this.model.levelChange(this.model.state["level"]+1);
        setTimeout(function() { model_temp.sentenceChange(`Level${model_temp.state["level"]}`); model_temp.voiceChange(true); model_temp.voiceChange(false); }, 1000);
        this.levelReset();
    }
    levelReset() {
        this.model.boardReset();
        this.model.indexChange(0);
    }
    adjustOctave() {
        let index = this.model.state["index"];
        if (index == 0) {
            this.model.octaveChange(4);
        } else {
            if (index/7 >= 1 && index/7 < 2) {
                this.model.octaveChange(5);
            } else if (index/7 >= 2 && index/7 < 3) {
                this.model.octaveChange(6);
            } else if (index/7 >= 3 && index/7 < 4) {
                this.model.octaveChange(7);
            } else if (index/7 >= 4 && index/7 < 5) {
                this.model.octaveChange(8);
            }
        }
        this.model.soundChange(true);
        this.model.soundChange(false);
    }
    adjustGameState() {
        this.model.boardAdvance();
        let index = this.model.state["index"];
        let maze = this.model.state["maze"];
        let level = this.model.state["level"];
        if (maze[level].length == index) {
            // Game clear
            if (this.model.state["level"] == this.model.state["max_level"]) {
                //console.log("Game clear");
                this.model.loseChange(false);
                this.gameEnd();
            }
            // Level clear
            else {
                //console.log("Level clear");
                this.levelUp();
            }
        }
    }
    timerBegin() {
        this.model.sChange("03");
        this.model.msChange("00");
        let s = parseInt(this.model.state["s"]);
        let ms = parseInt(this.model.state["ms"]);
        let s_temp;
        let ms_temp;
        let model_temp = this.model;
        let this_temp = this;
        clearInterval(this.looper);
        this.looper = setInterval(function() {
            if (ms == 0) {
                if (s <= 0) { 
                    clearInterval(this_temp.looper);
                    model_temp.loseChange(true);
                    this_temp.gameEnd();
                    //return -1; // call gameEnd
                }
                ms = 100;
                s = s - 1;
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
            model_temp.sChange(`${s_temp}`);
            model_temp.msChange(`${ms_temp}`);
            if (parseInt(s_temp) > 0 && parseInt(s_temp) < 30 && parseInt(s_temp)%10 == 0 && ms_temp == "00") {
                model_temp.sentenceChange(`${s_temp} seconds left`);
                model_temp.voiceChange(true);
                model_temp.voiceChange(false);
            }
        }, 10);
    }
    /*
    makePromise(sec) {
        return new Promise(function(resolve) {
            setTimeout(function() {         
                resolve("Promise resolved");
            }, sec*1000);
        });
    }
    async makeDelay(sec, callback, input){
        await this.makePromise(sec);
        console.log(callback);
        if (input != null) {
            this.model.callback(input);
        } else {
            this.model.callback();
        }
    } */
}


function test(sentence) {
    const voice = new SpeechSynthesisUtterance(sentence);
    voice.pitch = 0.8;
    voice.volume = 1.0;
    voice.rate = 1.0;
    speechSynthesis.speak(voice);
}

$(document).ready(function () {
    const game = new Controller(new Model(), new View());

    let a = new Audio();
    a.src = './asset/outro.mp3';
    $('body').on("click", function() {
        a.play();
        // game.model.bgmInit();
        // game.model.state["audio"].play();
        // console.log(game.model.state["audio"]);
    })
});
// Reference: https://www.taniarascia.com/javascript-mvc-todo-app/ 