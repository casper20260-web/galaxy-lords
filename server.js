const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, { cors: { origin: "*" } });
const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));

let players = {};
let alliances = {};
const islands = ['metal', 'nature', 'magic'];
let nextIslandIndex = 0;

// نظام توقيت معركة جبل العرش
let mountainKing = { allianceId: null, allianceName: "لا أحد", holdTime: {}, lastUpdate: Date.now() };

io.on('connection', (socket) => {
    console.log(`لاعب جديد انضم: ${socket.id}`);

    // 1. التوزيع التلقائي العادل للاعبين على الجزر
    const assignedIsland = islands[nextIslandIndex];
    nextIslandIndex = (nextIslandIndex + 1) % islands.length;

    let posX = assignedIsland === 'metal' ? Math.floor(Math.random() * 80) + 80 : assignedIsland === 'nature' ? Math.floor(Math.random() * 80) + 500 : Math.floor(Math.random() * 80) + 300;
    let posY = assignedIsland === 'metal' ? Math.floor(Math.random() * 80) + 80 : assignedIsland === 'nature' ? Math.floor(Math.random() * 80) + 80 : Math.floor(Math.random() * 80) + 380;

    // 2. إنشاء بيانات حساب اللاعب التجاري الشامل
    players[socket.id] = {
        id: socket.id,
        kingName: `لورد-${Math.floor(Math.random() * 900) + 100}`,
        island: assignedIsland,
        x: posX, y: posY,
        castleLevel: 1, flurMill: 1, fruitFarm: 1, cheeseFactory: 1, researchLab: 1, allianceEmbassy: 1, warehouse: 1,
        cp_metal: 200, cp_nature: 200, cp_magic: 200, // عملة CP
        flour: 500, fruit: 500, cheese: 500, // الغذاء ليفل 100
        cannon: 5, sniper: 5, ninja: 5, // الجيش ليفل 7
        cannonLvl: 1, sniperLvl: 1, ninjaLvl: 1,
        ap: 100, // نقاط العمل / الطاقة
        allianceId: null, allianceRole: null, heroStars: 1, bloodFeudWith: null,
        shieldUntil: Date.now() + 172800000 // حماية مبتدئين 48 ساعة مجاناً
    };

    socket.emit('init', { id: socket.id, players: players, alliances: alliances });
    socket.broadcast.emit('newCastle', players[socket.id]);

    // 3. محرك الإنتاج التلقائي ليفل 100 وضخ الـ CP
    setInterval(() => {
        let p = players[socket.id];
        if (p) {
            // إنتاج الغذاء والمخازن
            let maxCap = p.warehouse * 5000;
            if (p.flour < maxCap) p.flour += p.flurMill * 0.5;
            if (p.fruit < maxCap) p.fruit += p.fruitFarm * 0.3;
            if (p.cheese < maxCap) p.cheese += p.cheeseFactory * 0.2;

            // إنتاج الـ CP حسب الجزيرة
            if (p.island === 'metal' && p.cp_metal < maxCap) p.cp_metal += p.castleLevel * 2;
            else if (p.island === 'nature' && p.cp_nature < maxCap) p.cp_nature += p.castleLevel * 2;
            else if (p.island === 'magic' && p.cp_magic < maxCap) p.cp_magic += p.castleLevel * 2;

            // تجدد نقاط العمل (الطاقة) تلقائياً ببطء
            if (p.ap < 100) p.ap += 0.05;

            socket.emit('updateResources', {
                cp_metal: Math.floor(p.cp_metal), cp_nature: Math.floor(p.cp_nature), cp_magic: Math.floor(p.cp_magic),
                flour: Math.floor(p.flour), fruit: Math.floor(p.fruit), cheese: Math.floor(p.cheese), ap: Math.floor(p.ap)
            });
        }
    }, 1000);

    // 4. الجزء التجاري: شراء الحزم والمبادلة لشحن الطاقة AP
    socket.on('buyBundle', (bundleType) => {
        let p = players[socket.id];
        if (!p) return;
        if (bundleType === 'speed') {
            p.cp_metal += 1000; p.cp_nature += 1000; p.cp_magic += 1000;
            p.flour += 5000; p.ap = 100;
            socket.emit('logUpdate', "💰 تم شراء حزمة تسريع التطوير والدراسة الفضية بنجاح!");
        }
    });

    socket.on('exchangeAP', () => {
        let p = players[socket.id];
        if (p && p.flour >= 200 && p.cheese >= 100) {
            p.flour -= 200; p.cheese -= 100; p.ap = Math.min(100, p.ap + 30);
            socket.emit('logUpdate', "⚡ تم شحن 30 نقطة عمل (AP) عن طريق مبادلة الطحين والجبن بالمتجر!");
        } else {
            socket.emit('errorMsg', "الموارد غير كافية بالمخزن للمبادلة وشحن الطاقة!");
        }
    });

    // 5. نظام تأسيس التحالف التجاري الصارم (ليفل 15 + 300 CP)
    socket.on('createAlliance', (name) => {
        let p = players[socket.id];
        if (p.castleLevel >= 15 && p.cp_metal >= 300) {
            p.cp_metal -= 300;
            let allyId = `all-${Date.now()}`;
            alliances[allyId] = { id: allyId, name: name, leader: socket.id, officers: [], elite: [], members: [socket.id] };
            p.allianceId = allyId; p.allianceRole = 'قائد';
            io.emit('allianceCreated', alliances[allyId]);
        } else {
            socket.emit('errorMsg', "⚠️ شروط التأسيس لم تكتمل! يجب تجاوز ليفل 15 ودفع 300 CP.");
        }
    });

    // 6. شات عام وشات تحالف فوري
    socket.on('msgGlobal', (msg) => {
        let p = players[socket.id];
        if (p) io.emit('chatGlobal', { sender: p.kingName, text: msg });
    });

    socket.on('disconnect', () => {
        delete players[socket.id];
        io.emit('playerLeft', socket.id);
    });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => { console.log(`المحرك يعمل على منفذ ${PORT}`); });
