const myMonsterImage = new Image();
myMonsterImage.src = './img/embySprite.png';
const monsterImage = new Image();
monsterImage.src = './img/draggleSprite.png';

const Monsters = {
    Emby: {
        position: {
            x: 0,
            y: 0
        },
        frames: { max: 4 },
        animate: true,
        image: myMonsterImage,
        name: 'Emby',
        attacks:[attacks.Tackle, attacks.Fireball]
    },
    Worm:{
        position:{
            x:0,
            y:0
        },
        image: monsterImage,
        frames: { max: 4 },
        animate: true,
        isEnemy: true,
        name: 'Worm',
        attacks:[attacks.Tackle]
    }
}