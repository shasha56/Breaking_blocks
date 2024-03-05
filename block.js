const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const firstDifficult = 4;
let number = 0;
let difficult = firstDifficult;
let nowLevel = 1;
const dif = document.getElementById("difficult");

const ball = {
    x: null,
    y: null,
    width: 5,
    height: 5,
    radios: 5,
    dx: null,
    dy: null,

    update:function(){
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radios, 0, Math.PI*2);
        ctx.fill();
        ctx.closePath();

        if(this.x - this.radios < 0 || this.x + this.radios > canvas.width) this.dx*=-1;
        if(this.y - this.radios < 0) this.dy*=-1;
        this.x +=this.dx;
        this.y +=this.dy;

        if(this.y + this.radios > canvas.height){
            difficult = firstDifficult;
            nowLevel = 1;
            init(difficult);
        }
    }
}
const paddle = {
    x: null,
    y: null,
    width: 100,
    height: 15,
    speed: 0,

    update: function() {
        ctx.beginPath();
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fill();
        ctx.closePath();

        this.x +=this.speed;
    }
}
const block = {
    width: null,
    height: 20,
    data: [],
    update: function() {
        this.data.forEach(brick => {
            ctx.beginPath();
            ctx.strokeRect(brick.x, brick.y, brick.width, brick.height);
            ctx.stroke();
            ctx.closePath();
        })
    }
}
const level = [
    [0,0,0,0,0,0],
    [0,0,0,0,0,0],
    [1,1,1,1,1,1],
    [1,1,1,1,1,1],
    [1,1,1,1,1,1],
    [1,1,1,1,1,1],
]

const init = (obj) => {

    number = 0;

    paddle.x = canvas.width/2 - paddle.width/2;
    paddle.y = canvas.height - paddle.height;

    ball.x = canvas.width/2;
    ball.y = canvas.height/2;
    ball.dx = obj;
    ball.dy = -obj;

    block.width = canvas.width / level[0].length;

    dif.textContent = 'level: ' + nowLevel;

    for(let i=0;i<level.length;i++) {
        for(let j=0;j<level[i].length;j++) {
            if(level[i][j]) {
                block.data.push({
                    x: block.width * j,
                    y: block.height * i,
                    width: block.width,
                    height: block.height
                })
                number++;
            }
        }
    }
}
const collide = (obj1,obj2) => {
    return obj1.x - obj1.width < obj2.x + obj2.width && //右端
           obj1.x + obj1.width > obj2.x &&  //左端
           obj1.y - obj1.height < obj2.y + obj2.height &&  //下端
           obj1.y + obj1.height > obj2.y;  //上端
}
const loop = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    paddle.update();
    ball.update();
    block.update();

    if(collide(ball,paddle)) {
        ball.dy *=-1;
        ball.y = paddle.y - ball.height;
    }

    block.data.forEach((brick,index) => {
        if(collide(ball,brick)) {
            ball.dy *=-1;
            block.data.splice(index,1);
            number--;
        }
    })

    if(number === 0) {
        difficult++;
        nowLevel++;
        init(difficult);
    }

    //window.requestAnimationFrame(loop);

}

init(difficult);
loop();




document.addEventListener('keydown', e => {
    if(e.key === 'ArrowLeft') paddle.speed = -6;
    if(e.key === 'ArrowRight') paddle.speed = 6;

});
document.addEventListener('keyup', () => paddle.speed = 0);

const btn = document.getElementsByTagName('button');
btn[0].addEventListener('touchstart', () => {
    paddle.speed = -6;
});
btn[0].addEventListener('touchend', () => {
    paddle.speed = 0;
});
btn[1].addEventListener('touchstart', () => {
    paddle.speed = 6;
});
btn[1].addEventListener('touchend', () => {
    paddle.speed = 0;
});
