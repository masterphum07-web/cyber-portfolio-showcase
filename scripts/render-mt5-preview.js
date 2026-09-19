const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const edgePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const destFile = path.join(__dirname, '..', 'assets', 'projects', 'mt5-ea.png');
const tempHtml = path.join(__dirname, '..', 'assets', 'projects', 'temp-mt5.html');

const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      margin: 0;
      padding: 30px;
      background: #0d1117;
      font-family: 'Consolas', 'Fira Code', monospace;
      color: #c9d1d9;
    }
    .window {
      background: #161b22;
      border: 1px solid #30363d;
      border-radius: 12px;
      box-shadow: 0 20px 50px rgba(0,0,0,0.8);
      overflow: hidden;
    }
    .titlebar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 18px;
      background: #21262d;
      border-bottom: 1px solid #30363d;
    }
    .dots { display: flex; gap: 8px; }
    .dot { width: 12px; height: 12px; border-radius: 50%; }
    .r { background: #ff5f56; }
    .y { background: #ffbd2e; }
    .g { background: #27c93f; }
    .title { font-size: 13px; color: #8b949e; font-weight: 600; }
    .grid { display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 0; }
    .code-pane {
      padding: 24px;
      font-size: 13px;
      line-height: 1.6;
      border-right: 1px solid #30363d;
      background: #0d1117;
    }
    .comment { color: #8b949e; }
    .keyword { color: #ff7b72; }
    .type { color: #79c0ff; }
    .string { color: #a5d6ff; }
    .func { color: #d2a8ff; }
    .num { color: #79c0ff; }
    .tg-pane {
      padding: 24px;
      background: #161b22;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .tg-header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding-bottom: 12px;
      border-bottom: 1px solid #30363d;
    }
    .bot-avatar {
      width: 42px;
      height: 42px;
      border-radius: 50%;
      background: linear-gradient(135deg, #0088cc, #00c6ff);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-weight: bold;
      font-size: 18px;
    }
    .msg {
      background: #21262d;
      border: 1px solid #30363d;
      border-radius: 10px;
      padding: 12px 16px;
      font-size: 12px;
      line-height: 1.5;
    }
    .msg-user {
      align-self: flex-end;
      background: #1f6feb;
      color: #fff;
      border-color: #388bfd;
    }
    .badge {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: bold;
    }
    .badge-green { background: rgba(46, 160, 67, 0.2); color: #3fb950; border: 1px solid #2ea043; }
    .badge-cyan { background: rgba(56, 139, 253, 0.15); color: #58a6ff; border: 1px solid #1f6feb; }
  </style>
</head>
<body>
  <div class="window">
    <div class="titlebar">
      <div class="dots">
        <div class="dot r"></div>
        <div class="dot y"></div>
        <div class="dot g"></div>
      </div>
      <div class="title">MetaTrader 5 · MainEA.mq5 (Structure Breakout) + Telegram Two-Way Daemon</div>
      <span class="badge badge-green">● EA RUNNING · M1 TIMEFRAME</span>
    </div>
    <div class="grid">
      <div class="code-pane">
        <span class="comment">//+------------------------------------------------------------------+</span><br>
        <span class="comment">//| MainEA.mq5 - Structure Breakout EA with Telegram Controller     |</span><br>
        <span class="comment">//| Enhanced: Profit Lock (BE) & Anti-Spam Single Trade             |</span><br>
        <span class="comment">//+------------------------------------------------------------------+</span><br><br>
        <span class="keyword">#property</span> copyright <span class="string">"Phumphat · EA Studio"</span><br>
        <span class="keyword">#property</span> version   <span class="string">"4.00"</span><br>
        <span class="keyword">#include</span> &lt;Trade\\Trade.mqh&gt;<br><br>
        <span class="keyword">enum</span> <span class="type">ENUM_EA_STATE</span> {<br>
        &nbsp;&nbsp;EA_STATE_ACTIVE = <span class="num">0</span>,&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="comment">// Normal Trading (Active)</span><br>
        &nbsp;&nbsp;EA_STATE_PAUSED = <span class="num">1</span>,&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="comment">// Paused from Telegram</span><br>
        &nbsp;&nbsp;EA_STATE_EMERGENCY_STOP = <span class="num">2</span> <span class="comment">// Drawdown Hard Cut 15% Hit</span><br>
        };<br><br>
        <span class="keyword">void</span> <span class="func">OnTick</span>() {<br>
        &nbsp;&nbsp;<span class="keyword">if</span>(ea_state == EA_STATE_EMERGENCY_STOP) <span class="keyword">return</span>;<br>
        &nbsp;&nbsp;<span class="keyword">if</span>(CheckTelegramEmergencyKill()) { CloseAllPositions(); }<br>
        &nbsp;&nbsp;<span class="func">ExecuteStructureBreakout</span>(_Symbol, <span class="num">0.05</span>, TP_TRAILING_ONLY);<br>
        }
      </div>
      <div class="tg-pane">
        <div class="tg-header">
          <div class="bot-avatar">🤖</div>
          <div>
            <div style="font-weight: 700; color: #fff;">MT5 Controller Bot</div>
            <div style="font-size: 11px; color: #3fb950;">● Connected to VPS (MetaTrader 5)</div>
          </div>
        </div>
        <div class="msg msg-user">/status</div>
        <div class="msg">
          📊 <b>MT5 EA Status Report:</b><br>
          • Pair: XAUUSD (Gold) M1<br>
          • Balance: $10,482.50<br>
          • Floating P/L: <span style="color: #3fb950; font-weight: bold;">+$142.80</span><br>
          • Daily Profit: <span style="color: #3fb950;">+$485.20</span><br>
          • Max Drawdown: 2.14% (Safe &lt; 15%)<br>
          • Mode: Trailing Profit Lock
        </div>
        <div class="msg msg-user">/lock_profit</div>
        <div class="msg">
          ✅ <b>Trailing Stop Triggered:</b><br>
          Stop Loss moved to Break-Even +$35.00.<br>
          Risk free position secured! 🛡️
        </div>
      </div>
    </div>
  </div>
</body>
</html>`;

fs.writeFileSync(tempHtml, html, 'utf8');
const fileUrl = 'file:///' + tempHtml.replace(/\\/g, '/');

try {
  execSync(`"${edgePath}" --headless=new --disable-gpu --virtual-time-budget=2000 --screenshot="${destFile}" --window-size=1280,720 "${fileUrl}"`, { stdio: 'ignore' });
  console.log('MT5 EA Screenshot captured:', fs.statSync(destFile).size);
} catch (e) {
  console.error(e);
} finally {
  if (fs.existsSync(tempHtml)) fs.unlinkSync(tempHtml);
}
