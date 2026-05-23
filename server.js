const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, { cors: { origin: "*" } });
const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));

let players = {};

io.on('connection', (socket) => {
    console.log(`لاعب جديد انضم للمجرة: ${socket.id}`);

    players[socket.id] = {
        id: socket.id,
        planetName: `كوكب-${Math.floor(Math.random() * 900) + 100}`,
        x: Math.floor(Math.random() * 600) + 50,
        y: Math.floor(Math.random() * 400) + 50,
        energy: 100,
        crystal: 50,
        ships: 5,
        mineLevel: 1,
        lastUpdate: Date.now()
    };

    socket.emit('init', { id: socket.id, players: players });
    socket.broadcast.emit('newPlanet', players[socket.id]);

    setInterval(() => {
        if (players[socket.id]) {
            players[socket.id].energy += players[socket.id].mineLevel * 0.5;
            players[socket.id].crystal += players[socket.id].mineLevel * 0.2;
            socket.emit('updateResources', {
                energy: Math.floor(players[socket.id].energy),
                crystal: Math.floor(players[socket.id].crystal)
            });
        }
    }, 1000);

    socket.on('upgradeMine', () => {
        let player = players[socket.id];
        let cost = player.mineLevel * 100;
        if (player.crystal >= cost) {
            player.crystal -= cost;
            player.mineLevel += 1;
            socket.emit('mineUpgraded', { level: player.mineLevel, crystal: player.crystal });
        } else {
            socket.emit('errorMsg', 'الاقصاد لا يسمح! الموارد غير كافية للتطوير.');
        }
    });

    socket.on('buildShip', () => {
        let player = players[socket.id];
        let energyCost = 50;
        let crystalCost = 30;
        if (player.energy >= energyCost && player.crystal >= crystalCost) {
            player.energy -= energyCost;
            player.crystal -= crystalCost;
            player.ships += 1;
            socket.emit('shipBuilt', { ships: player.ships, energy: player.energy, crystal: player.crystal });
        } else {
            socket.emit('errorMsg', 'لا توجد موارد كافية لبناء سفينة فضائية.');
        }
    });

    socket.on('attackPlanet', (targetId) => {
        let attacker = players[socket.id];
        let target = players[targetId];

        if (!target || targetId === socket.id) return;
        if (attacker.ships < 1) {
            socket.emit('errorMsg', 'ليس لديك سفن جاهزة للهجوم!');
            return;
        }
        
        let attackPower = attacker.ships * (Math.random() * 1.5);
        let defensePower = target.ships * (Math.random() * 1.5);

        if (attackPower > defensePower) {
            let stolenCrystal = Math.floor(target.crystal / 2);
            attacker.crystal += stolenCrystal;
            target.crystal -= stolenCrystal;
            attacker.ships = Math.max(1, Math.floor(attacker.ships * 0.7));
            target.ships = 0;

            io.emit('battleResult', {
                winner: attacker.id,
                loser: target.id,
                msg: `🔥 انتصر ${attacker.planetName} على ${target.planetName} وتم نهب ${stolenCrystal} كريستال!`
            });
        } else {
            attacker.ships = 0;
            target.ships = Math.max(1, Math.floor(target.ships * 0.6));

            io.emit('battleResult', {
                winner: target.id,
                loser: attacker.id,
                msg: `🛡️ نجح ${target.planetName} في صد هجوم عنيف من ${attacker.planetName}!`
            });
        }
    });

    socket.on('disconnect', () => {
        delete players[socket.id];
        io.emit('playerLeft', socket.id);
    });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log(`سيرفر أسياد المجرة جاهز ويعمل على المنفذ ${PORT}`);
});
