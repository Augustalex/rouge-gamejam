import options from '../options.js'
import utils from '../utils.js';
import BossFysik from './BossFysik.js';
import Sprites from '../sprites.js';

const { genId, rand255, rHue, rColor } = utils;

function Boss(storeDependencies, state) {
    let { store, localStore } = storeDependencies;

    state.speed = 10;

    let {
        id,
        color,
        controllerId
    } = state;

    let towerImage = new Image();
    let bossFysik = BossFysik(storeDependencies, state);
    localStore.state.bulletsByShooterId[id] = {};

    return {
        id,
        controllerId,
        setPosition(x, y) {
            state.position.x = x;
            state.position.y = y;
        },
        getPosition() {
            return { x: state.position.x, y: state.position.y };
        },
        setMoving(x, y) {
            state.moving.x = x;
            state.moving.y = y;
        },
        async loadSprite() {
            await new Promise(resolve => {
                towerImage.onload = resolve;
                towerImage.src = './sprites/tower.png';
            });
        },
        render(context, camera) {
            if (state.position.x > camera.x + camera.w || state.position.x < camera.x
                || state.position.y > camera.y + camera.h || state.position.y < camera.y) {
                return;
            }

            let bullets = Object.keys(store.state.bulletsByShooterId[id]).map(bulletId => store.state.bulletsByShooterId[id][bulletId])
            let behindBoss = bullets.filter(b => b.y <= state.position.y - 80); // todo make variable shoot offset and use in fysik
            let inFrontOffBoss = bullets.filter(b => b.y > state.position.y - 80); // todo make variable shoot offset and use in fysik
            for (let bullet of behindBoss) {
                drawBullet(context, bullet, color)
            }
            if (Sprites.boss.complete) {
                let scale = 2;
                state.currentFrame += 0.5;
                if (state.currentFrame > 23.5) {
                    state.currentFrame = 0;
                }
                let frame = Math.floor(state.currentFrame);
                let sprite = Sprites.bossPast;
                if (store.state.presentDimension) {
                    sprite = Sprites.bossPresent;
                }
                let subImage = sprite[frame];
                context.drawImage(subImage, Math.floor(state.position.x - Sprites.boss.width * scale / 2), Math.floor(state.position.y - Sprites.boss.height * scale), Sprites.boss.width * scale, Sprites.boss.height * scale);
            }
            for (let bullet of inFrontOffBoss) {
                drawBullet(context, bullet, color);
            }

        },
        fysik(delta) {
            bossFysik(delta)
        }
    }
};
Boss.createState = function ({ controllerId, x, y }) {
    return {
        clone: false,
        id: genId(),
        color: rColor(),
        position: {
            x: x,
            y: y
        },
        moving: {
            x: 0,
            y: 0
        },
        currentFrame: 0,
        speed: 100,
        controllerId
    };
};
export default Boss;

function drawBullet(context, bullet, color) {
    if (bullet.isEnemy) {
        if (options.useShadows) {
            context.beginPath();
            context.arc(Math.floor(bullet.x), Math.floor(bullet.y + bullet.height / 1.1 + 1), 8 + bullet.height / 4, 0, 2 * Math.PI, false);
            context.fillStyle = 'black';
            context.globalAlpha = Math.max(1.1 - bullet.height / 22, 0);
            context.fill();
            context.globalAlpha = 1;
        }

        context.beginPath();
        context.arc(Math.floor(bullet.x), Math.floor(bullet.y), 8, 0, 2 * Math.PI, false);
        context.fillStyle = '#f7a7d0';
        context.fill();
        context.lineWidth = 2;
        context.strokeStyle = '#ba3278';
        context.stroke();
    }
}

function fillRectRot(context, x, y, width, height, dir) {
    context.save();
    context.translate(Math.floor(x), Math.floor(y));
    context.rotate(dir);
    context.fillRect(-width / 2, -height / 2, width, height);
    context.restore()
}