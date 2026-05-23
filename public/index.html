<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <title>الثلاث جزر والظلام - النسخة التجارية الكاملة</title>
    <style>
        body { margin: 0; background: #070b12; color: #e2e8f0; font-family: Arial, sans-serif; overflow: hidden; }
        #ui { position: absolute; top: 15px; left: 15px; background: rgba(15, 23, 42, 0.95); padding: 15px; border-radius: 12px; border: 2px solid #f59e0b; z-index: 10; width: 280px; font-size: 13px; }
        .res { display: flex; justify-content: space-between; background: #1e293b; padding: 4px 8px; margin: 4px 0; border-radius: 4px; font-weight: bold; }
        #world-map { width: 100vw; height: 100vh; position: relative; background: radial-gradient(circle, #101726 30%, #030712 100%); }
        .island { position: absolute; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 14px; opacity: 0.8; }
        #isl-1 { top: 10%; left: 10%; width: 200px; height: 200px; background: #334155; border: 2px solid #f59e0b; }
        #isl-2 { top: 10%; right: 10%; width: 200px; height: 200px; background: #064e3b; border: 2px solid #10b981; }
        #isl-3 { bottom: 10%; left: 40%; width: 200px; height: 200px; background: #4c1d95; border: 2px solid #8b5cf6; }
        #mtn-center { top: 40%; left: 43%; width: 140px; height: 140px; background: #000; border: 2px solid #ef4444; border-radius: 50%; position: absolute; display: flex; align-items: center; justify-content: center; color: #ef4444; font-weight: bold; box-shadow: 0 0 20px #ef4444; }
        .btn-shop { background: #ef4444; color: white; font-weight: bold; border: none; padding: 8px; border-radius: 4px; cursor: pointer; width: 100%; margin-top: 5px; }
        .btn-ex { background: #10b981; color: white; font-weight: bold; border: none; padding: 8px; border-radius: 4px; cursor: pointer; width: 100%; margin-top: 5px; }
        #chat-box { position: absolute; bottom: 15px; left: 15px; width: 300px; height: 180px; background: rgba(15, 23, 42, 0.95); border: 1px solid #334155; border-radius: 8px; padding: 10px; display: flex; flex-direction: column; }
        #chat-msgs { flex: 1; overflow-y: auto; font-size: 12px; margin-bottom: 5px; }
    </style>
    <script src="/socket.io/socket.io.js"></script>
</head>
<body>

    <div id="ui">
        <h3 style="margin:0 0 5px 0; color:#f59e0b; text-align:center;" id="p-name">خزائن اللورد</h3>
        <div class="res" style="color:#ef4444;">⚡ طاقة العمل AP: <span id="val-ap">100</span></div>
        <div class="res" style="color:#f59e0b;">🪙 CP معدني: <span id="val-m">0</span></div>
        <div class="res" style="color:#10b981;">🌿 CP طبيعي: <span id="val-n">0</span></div>
        <div class="res" style="color:#8b5cf6;">✨ CP سحري: <span id="val-mg">0</span></div>
        <div class="res">🍞 الطحين (ليفل 100): <span id="val-f">0</span></div>
        <div class="res">🧀 الجبن (ليفل 100): <span id="val-c">0</span></div>
        
        <button class="btn-ex" onclick="exchangeAP()">🏪 مبادلة بالمتجر (شحن +30 طاقة AP)</button>
        <button class="btn-shop" onclick="buyBundle()">🛒 متجر الأرباح: شراء حزمة تسريع ليفل 100</button>
        <button style="width:100%; margin-top:5px; padding:6px;" onclick="createAlliance()">🏰 تأسيس تحالف (ليفل 15 + 300 CP)</button>
    </div>

    <div id="chat-box">
        <div id="chat-msgs"><b>💬 الشات العام للممالك:</b><br></div>
        <input type="text" id="chat-in" placeholder="اكتب رسالتك واضغط Enter..." onkeydown="if(event.key==='Enter') sendChat()">
    </div>

    <div id="world-map">
        <div id="isl-1" class="island">جزيرة المعادن</div>
        <div id="isl-2" class="island">جزيرة الطبيعة</div>
        <div id="isl-3" class="island">جزيرة السحر</div>
        <div id="mtn-center">جبل العرش 👑</div>
    </div>

    <script>
        const socket = io();
        socket.on('init', (data) => { document.getElementById('p-name').innerText = data.players[socket.id].kingName; });
        socket.on('updateResources', (res) => {
            document.getElementById('val-ap').innerText = res.ap;
            document.getElementById('val-m').innerText = res.cp_metal;
            document.getElementById('val-n').innerText = res.cp_nature;
            document.getElementById('val-mg').innerText = res.cp_magic;
            document.getElementById('val-f').innerText = res.flour;
            document.getElementById('val-c').innerText = res.cheese;
        });
        socket.on('chatGlobal', (d) => {
            const box = document.getElementById('chat-msgs');
            box.innerHTML += `<div><b>${d.sender}:</b> ${d.text}</div>`;
            box.scrollTop = box.scrollHeight;
        });
        socket.on('logUpdate', (m) => { alert(m); });
        socket.on('errorMsg', (m) => { alert(m); });

        function buyBundle() { socket.emit('buyBundle', 'speed'); }
        function exchangeAP() { socket.emit('exchangeAP'); }
        function createAlliance() {
            let name = prompt("اكتب اسم التحالف الجديد:");
            if(name) socket.emit('createAlliance', name);
        }
        function sendChat() {
            const inp = document.getElementById('chat-in');
            if(inp.value.trim()) { socket.emit('msgGlobal', inp.value); inp.value = ''; }
        }
    </script>
</body>
</html>
