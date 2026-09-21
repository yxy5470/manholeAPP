import { useState } from 'react'

// ─── Shared Icons ─────────────────────────────────────────────────────────────

const IcoBack = () => (
  <svg width="11" height="19" viewBox="0 0 11 19" fill="none">
    <path d="M9.5 1.5 1.5 9.5l8 8" stroke="#111827" strokeWidth="2.2"
      strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

// ─── Shared Toggle ────────────────────────────────────────────────────────────

const Toggle = ({ on, onChange }: { on: boolean; onChange: () => void }) => (
  <button
    role="switch" aria-checked={on} onClick={onChange}
    style={{ transition: 'background .18s ease', minWidth: 52 }}
    className={`relative inline-flex h-[32px] w-[52px] shrink-0 rounded-full
      ${on ? 'bg-emerald-500' : 'bg-slate-300'}`}>
    <span
      style={{ transition: 'transform .18s ease' }}
      className={`absolute top-[3px] left-[3px] h-[26px] w-[26px] rounded-full bg-white shadow
        ${on ? 'translate-x-[20px]' : 'translate-x-0'}`}/>
  </button>
)

// ─── Shared Card ──────────────────────────────────────────────────────────────

const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white rounded-xl overflow-hidden ${className}`}>{children}</div>
)

// ─── Shared CSS animations ────────────────────────────────────────────────────
// (defined in index.css: blink, spin)

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE A — Bluetooth Scan
// ═══════════════════════════════════════════════════════════════════════════════

// ─── Bluetooth Icon ───────────────────────────────────────────────────────────

const IcoBluetooth = ({ dim = false }: { dim?: boolean }) => {
  const c = dim ? '#94A3B8' : '#2563EB'
  return (
    <svg width="14" height="22" viewBox="0 0 14 22" fill="none">
      {/* vertical stem */}
      <line x1="7" y1="1" x2="7" y2="21" stroke={c} strokeWidth="1.8" strokeLinecap="round"/>
      {/* upper-right arm */}
      <line x1="7" y1="1" x2="13" y2="7" stroke={c} strokeWidth="1.8" strokeLinecap="round"/>
      {/* lower-right arm */}
      <line x1="7" y1="21" x2="13" y2="15" stroke={c} strokeWidth="1.8" strokeLinecap="round"/>
      {/* upper-left cross */}
      <line x1="13" y1="7" x2="1" y2="15" stroke={c} strokeWidth="1.8" strokeLinecap="round"/>
      {/* lower-left cross */}
      <line x1="13" y1="15" x2="1" y2="7" stroke={c} strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  )
}

// ─── QR Icon ──────────────────────────────────────────────────────────────────

const IcoScan = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    {/* corners */}
    <path d="M1 5V2a1 1 0 0 1 1-1h3" stroke="#2563EB" strokeWidth="1.6" strokeLinecap="round"/>
    <path d="M17 5V2a1 1 0 0 0-1-1h-3" stroke="#2563EB" strokeWidth="1.6" strokeLinecap="round"/>
    <path d="M1 13v3a1 1 0 0 0 1 1h3" stroke="#2563EB" strokeWidth="1.6" strokeLinecap="round"/>
    <path d="M17 13v3a1 1 0 0 1-1 1h-3" stroke="#2563EB" strokeWidth="1.6" strokeLinecap="round"/>
    {/* scan line */}
    <line x1="1" y1="9" x2="17" y2="9" stroke="#2563EB" strokeWidth="1.4" strokeLinecap="round"/>
  </svg>
)

function ScanPage({ onConnect }: { onConnect: () => void }) {
  const [filterOn, setFilterOn] = useState(true)
  const [query, setQuery] = useState('')

  const devices = [
    { id: 1, name: 'JG100260626001',     mac: '0E:56:B2:31:98:F0', rssi: -52, manhole: true  },
    { id: 2, name: '050349-250837151',   mac: 'F4:AB:5C:88:7F:E0', rssi: -89, manhole: false },
    { id: 3, name: 'TS02',               mac: '1D:A7:85:31:10:8A', rssi: -91, manhole: false },
  ]

  const visible = devices.filter(d => !filterOn || d.manhole)
    .filter(d => !query || d.name.toLowerCase().includes(query.toLowerCase()) || d.mac.toLowerCase().includes(query.toLowerCase()))

  return (
    <div className="bg-slate-100 min-h-screen flex justify-center">
      <div className="w-full max-w-[390px] flex flex-col" style={{ minHeight: '100dvh' }}>

        {/* ── NavBar ── */}
        <nav className="bg-white border-b border-slate-200 sticky top-0 z-10">
          <div className="h-11"/>
          <div className="relative flex items-center px-4 pb-3.5">
            <button className="absolute left-4 p-1 -ml-1 active:opacity-50">
              <IcoBack/>
            </button>
            <p className="w-full text-center text-[17px] font-bold text-slate-900">附近设备</p>
            <span className="absolute right-4 inline-flex items-center gap-1.5
              text-blue-600 text-[13px] font-semibold">
              <span className="w-2 h-2 rounded-full bg-blue-500 blink"/>
              扫描中
            </span>
          </div>
        </nav>

        <div className="flex-1 overflow-y-auto">
          <div className="px-3 pt-3 space-y-[10px] pb-6">

            {/* ── Search & Filter Card ── */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">

              {/* Row 1: search + QR */}
              <div className="flex items-center gap-2 px-3 py-2.5 border-b border-slate-100">
                <div className="flex-1 flex items-center gap-2 bg-slate-100 rounded-lg px-3 py-2">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <circle cx="6" cy="6" r="4.5" stroke="#94A3B8" strokeWidth="1.3"/>
                    <path d="M9.5 9.5L12.5 12.5" stroke="#94A3B8" strokeWidth="1.3" strokeLinecap="round"/>
                  </svg>
                  <input
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder="输入设备名称或 MAC 地址..."
                    className="flex-1 bg-transparent text-[14px] text-slate-700 placeholder-slate-400
                      outline-none min-w-0"
                  />
                </div>
                <button className="w-[38px] h-[38px] flex items-center justify-center shrink-0
                  border border-blue-200 bg-blue-50 rounded-lg active:opacity-70 transition-opacity">
                  <IcoScan/>
                </button>
              </div>

              {/* Row 2: filter toggle — all on one line */}
              <div className="flex items-center justify-between px-4 py-3 gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-[14px] font-bold text-slate-800 shrink-0">筛选</span>
                  <span className="text-[12px] text-slate-500 truncate">仅显示智能井盖监测仪</span>
                </div>
                <Toggle on={filterOn} onChange={() => setFilterOn(v => !v)}/>
              </div>
            </div>

            {/* ── Device List ── */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden divide-y divide-slate-100">
              {visible.length === 0 && (
                <p className="text-center text-[14px] text-slate-400 py-8">暂未发现设备</p>
              )}
              {visible.map((dev, idx) => {
                const isPrimary = dev.rssi >= -60
                const rssiColor = dev.rssi >= -60 ? 'text-amber-500' : 'text-red-400'

                return (
                  <div key={dev.id} onClick={onConnect} className="flex items-center gap-3 px-4 py-3.5 cursor-pointer active:bg-slate-50 transition-colors">

                    {/* BT icon */}
                    <div className="shrink-0 w-8 flex items-center justify-center">
                      <IcoBluetooth dim={!dev.manhole}/>
                    </div>

                    {/* Name + MAC */}
                    <div className="flex-1 min-w-0">
                      <p className="text-[15px] font-bold text-slate-800 leading-snug truncate mono">
                        {dev.name}
                      </p>
                      <p className="mono text-[12px] text-slate-500 mt-0.5">{dev.mac}</p>
                    </div>

                    {/* Signal */}
                    <div className="shrink-0 flex items-center justify-center w-20">
                      <span className={`mono text-[13px] font-bold ${rssiColor}`}>
                        {dev.rssi} dBm
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* ── Rescan ── */}
            <button className="w-full bg-white text-slate-700 text-[14px] font-semibold
              border border-slate-300 py-3.5 rounded-xl
              active:bg-slate-50 transition-colors">
              🔄 重新扫描附近设备
            </button>

            <div className="h-6"/>
          </div>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE B — Device Detail (existing design)
// ═══════════════════════════════════════════════════════════════════════════════

const IcoBattery = () => (
  <svg width="20" height="11" viewBox="0 0 20 11" fill="none">
    <rect x=".5" y=".5" width="16.5" height="10" rx="2" stroke="#374151" strokeWidth="1.1"/>
    <rect x="1.5" y="1.5" width="13.5" height="8" rx="1.2" fill="#374151"/>
    <rect x="17.5" y="3.2" width="2" height="4.6" rx="1" fill="#374151"/>
  </svg>
)

const IcoSignal = () => (
  <svg width="19" height="13" viewBox="0 0 19 13" fill="none">
    {[0,1,2,3].map(i => (
      <rect key={i} x={i*5} y={13-(i+1)*3.2} width="3.5" height={(i+1)*3.2}
        rx=".8" fill={i < 3 ? '#374151' : '#D1D5DB'}/>
    ))}
  </svg>
)

const IcoThermo = () => (
  <svg width="12" height="18" viewBox="0 0 12 18" fill="none">
    <rect x="4" y=".8" width="4" height="11.5" rx="2" stroke="#374151" strokeWidth="1.1"/>
    <rect x="5" y="1.8" width="2" height="8" rx="1" fill="#D1D5DB"/>
    <circle cx="6" cy="14.5" r="3" fill="#374151"/>
  </svg>
)

const IcoDrop = () => (
  <svg width="13" height="17" viewBox="0 0 13 17" fill="none">
    <path d="M6.5 1C6.5 1 1 8 1 12a5.5 5.5 0 0 0 11 0C12 8 6.5 1 6.5 1z"
      stroke="#374151" strokeWidth="1.1" fill="#E5E7EB"/>
  </svg>
)

const IcoGPS = () => (
  <svg width="12" height="14" viewBox="0 0 12 14" fill="none">
    <path d="M6 1C3.8 1 2 2.8 2 5c0 3 4 8 4 8s4-5 4-8c0-2.2-1.8-4-4-4z"
      stroke="#64748B" strokeWidth="1.1" fill="none"/>
    <circle cx="6" cy="5" r="1.5" fill="#64748B"/>
  </svg>
)

const IcoTower = () => (
  <svg width="12" height="14" viewBox="0 0 12 14" fill="none">
    <path d="M6 5v9M3 14h6" stroke="#94A3B8" strokeWidth="1.1" strokeLinecap="round"/>
    <path d="M1 2C2.5 3.5 9.5 3.5 11 2" stroke="#94A3B8" strokeWidth="1.1" strokeLinecap="round"/>
    <path d="M2.5 4C3.8 5 8.2 5 9.5 4" stroke="#94A3B8" strokeWidth="1.1" strokeLinecap="round"/>
    <circle cx="6" cy="5" r="1" fill="#94A3B8"/>
  </svg>
)

const Div = () => <div className="border-t border-slate-100"/>

const CardTitle = ({ children }: { children: React.ReactNode }) => (
  <div className="px-4 py-3 border-b border-slate-100">
    <span className="text-[16px] font-bold text-slate-900">{children}</span>
  </div>
)

function DetailPage({ onBack, onConfig }: { onBack: () => void; onConfig: () => void }) {
  const [powerOn, setPowerOn] = useState(true)

  return (
    <div className="bg-slate-100 min-h-screen flex justify-center">
      <div className="w-full max-w-[390px] flex flex-col" style={{ minHeight: '100dvh' }}>

        {/* NavBar */}
        <nav className="bg-white border-b border-slate-200 sticky top-0 z-10">
          <div className="h-11"/>
          <div className="relative flex items-center px-4 pb-3.5">
            <button onClick={onBack} className="absolute left-4 flex items-center active:opacity-50 p-1 -ml-1">
              <IcoBack/>
            </button>
            <p className="w-full text-center text-[17px] font-bold text-slate-900">
              设备详情与配置
            </p>
          </div>
        </nav>

        <div className="flex-1 overflow-y-auto">
          <div className="px-3 pt-3 space-y-[10px] pb-6">

            {/* 总览区 */}
            <div className="bg-white rounded-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-100">
                <p className="mono text-[13px] text-slate-600 font-medium leading-snug">
                  SN: JG100-12345678901234
                </p>
                <p className="mono text-[13px] text-slate-600 font-medium leading-snug mt-0.5">
                  MAC: 0E:56:B2:31:98:F0
                </p>
              </div>

              <div className="flex border-b border-slate-100">
                {[
                  { icon: <IcoBattery/>, val: '99',   unit: '%',   label: '电量' },
                  { icon: <IcoSignal/>,  val: '21',   unit: 'CSQ', label: '信号' },
                  { icon: <IcoThermo/>, val: '25.8', unit: '℃',  label: '温度' },
                  { icon: <IcoDrop/>,   val: '72.5', unit: '%',   label: '湿度' },
                ].map((m, i, a) => (
                  <div key={m.label}
                    className={`flex-1 flex flex-col items-center gap-1 py-3.5
                      ${i < a.length - 1 ? 'border-r border-slate-100' : ''}`}>
                    <div className="h-[18px] flex items-center">{m.icon}</div>
                    <div className="flex items-baseline gap-[2px]">
                      <span className="mono text-[20px] font-bold text-slate-900 leading-tight">{m.val}</span>
                      <span className="text-[11px] font-semibold text-slate-500">{m.unit}</span>
                    </div>
                    <span className="text-[13px] font-medium text-slate-600">{m.label}</span>
                  </div>
                ))}
              </div>

              <div className="px-4 py-3 flex items-center gap-3 border-b border-slate-100 flex-wrap">
                {/* 蓝牙已连接 */}
                <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700
                  text-[12px] font-semibold px-2.5 py-1 rounded-full border border-emerald-100">
                  <span className="w-[6px] h-[6px] rounded-full bg-emerald-500 shrink-0 blink"/>
                  蓝牙已连接
                </span>
                <div className="w-px h-5 bg-slate-200 shrink-0"/>
                {/* 通信状态 */}
                <div className="flex items-center gap-2">
                  <span className="text-[14px] font-semibold text-slate-700">通信状态</span>
                  <span className="inline-flex items-center gap-1.5 bg-emerald-500 text-white
                    text-[12px] font-bold px-2.5 py-1 rounded-full">
                    正常
                  </span>
                </div>
              </div>

              {/* 姿态行 */}
              <div className="px-4 py-3 flex items-center gap-3 border-b border-slate-100 flex-wrap">
                <span className="text-[14px] font-semibold text-slate-700 shrink-0">当前姿态</span>
                <span className="mono text-[22px] font-bold text-slate-900">0.18°</span>
                <div className="w-px h-5 bg-slate-200 shrink-0"/>
                <span className="text-[13px] font-medium text-slate-500 shrink-0">触发阈值</span>
                <span className="mono text-[14px] font-semibold text-slate-500">10.00°</span>
              </div>

              <div className="px-4 py-3 space-y-2">
                <div className="flex items-center gap-2">
                  <IcoGPS/>
                  <span className="text-[13px] font-bold text-slate-600 w-8 shrink-0">GPS</span>
                  <span className="mono text-[13px] font-semibold text-slate-900 flex-1">
                    103.986651°E, 30.776512°N
                  </span>
                  <span className="text-[12px] font-bold text-emerald-600 shrink-0 bg-emerald-50
                    px-2 py-0.5 rounded-full border border-emerald-100">
                    已定位
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <IcoTower/>
                  <span className="text-[13px] font-bold text-slate-500 w-8 shrink-0">LBS</span>
                  <span className="mono text-[13px] font-medium text-slate-600 flex-1">
                    103.985120°E, 30.775890°N
                  </span>
                  <span className="text-[12px] font-medium text-slate-400 shrink-0 bg-slate-100
                    px-2 py-0.5 rounded-full border border-slate-200">
                    基站定位
                  </span>
                </div>
              </div>
            </div>

            {/* 现场安装区 */}
            <div className="bg-white rounded-xl overflow-hidden">
              <CardTitle>🛠️ 现场安装操作区</CardTitle>
              <div className="px-4 py-3 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[16px] font-bold text-slate-900">设备电源</p>
                    <p className="text-[13px] font-medium text-slate-500 mt-0.5">
                      电源状态：{powerOn ? '已开机' : '已关机'}
                    </p>
                  </div>
                  <Toggle on={powerOn} onChange={() => setPowerOn(v => !v)}/>
                </div>
                <Div/>
                <div className="grid grid-cols-2 gap-2.5">
                  <button className="flex items-center justify-center gap-1.5
                    bg-blue-600 text-white text-[15px] font-bold
                    py-3.5 rounded-xl active:opacity-80 transition-opacity">
                    🎯 设置参考点
                  </button>
                  <button className="flex items-center justify-center gap-1.5
                    bg-slate-100 text-slate-700 text-[15px] font-bold
                    py-3.5 rounded-xl active:opacity-70 transition-opacity">
                    🗑️ 清除参考点
                  </button>
                </div>
                <button className="w-full flex items-center justify-center gap-2
                  bg-emerald-50 text-emerald-800 text-[15px] font-bold
                  border border-emerald-200 py-3.5 rounded-xl
                  active:opacity-75 transition-opacity">
                  📡 获取当前 GPS 定位
                </button>
              </div>
            </div>

            {/* 调试区 */}
            <div className="bg-white rounded-xl overflow-hidden">
              <CardTitle>⚙️ 高级配置与调试</CardTitle>
              <div className="px-4 py-3 space-y-2.5">
                <div className="grid grid-cols-2 gap-2.5">
                  <button className="flex items-center justify-center gap-1
                    bg-slate-100 text-slate-800 text-[14px] font-bold
                    py-3 rounded-xl active:opacity-70 transition-opacity">
                    🗺️ 查看地图位置
                  </button>
                  <button onClick={onConfig}
                    className="flex items-center justify-center gap-1
                    bg-blue-50 text-blue-700 text-[14px] font-bold
                    border border-blue-100 py-3 rounded-xl active:opacity-70 transition-opacity">
                    ⚙️ 配置模式
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <button className="flex items-center justify-center gap-1
                    bg-white text-slate-700 text-[14px] font-bold
                    border border-slate-300 py-3 rounded-xl active:bg-slate-50 transition-colors">
                    📋 实时日志
                  </button>
                  <button className="flex items-center justify-center gap-1
                    bg-white text-slate-700 text-[14px] font-bold
                    border border-slate-300 py-3 rounded-xl active:bg-slate-50 transition-colors">
                    🚀 手动推送报文
                  </button>
                </div>
              </div>
            </div>

            {/* 断开 */}
            <button className="w-full bg-red-50 text-red-600 text-[15px] font-bold
              border border-red-200 py-4 rounded-xl
              active:bg-red-100 transition-colors">
              ❌ 断开蓝牙连接
            </button>

            <div className="h-6"/>
          </div>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE C — Device Config
// ═══════════════════════════════════════════════════════════════════════════════

// ── Read / Write buttons ──────────────────────────────────────────────────────
const RWBtns = () => (
  <div className="flex gap-1 shrink-0">
    <button className="bg-blue-50 text-blue-600 border border-blue-200
      text-[12px] font-semibold px-2.5 py-1 rounded
      active:opacity-70 transition-opacity whitespace-nowrap">
      读取
    </button>
    <button className="bg-emerald-50 text-emerald-600 border border-emerald-200
      text-[12px] font-semibold px-2.5 py-1 rounded
      active:opacity-70 transition-opacity whitespace-nowrap">
      写入
    </button>
  </div>
)

// ── Mini toggle ───────────────────────────────────────────────────────────────
const MiniToggle = ({ on, onChange }: { on: boolean; onChange: () => void }) => (
  <button role="switch" aria-checked={on} onClick={onChange}
    style={{ transition: 'background .18s ease' }}
    className={`relative inline-flex h-[22px] w-[38px] shrink-0 rounded-full
      ${on ? 'bg-emerald-500' : 'bg-slate-300'}`}>
    <span style={{ transition: 'transform .18s ease' }}
      className={`absolute top-[2px] left-[2px] h-[18px] w-[18px] rounded-full bg-white shadow-sm
        ${on ? 'translate-x-[16px]' : 'translate-x-0'}`}/>
  </button>
)

// ── Config list row ───────────────────────────────────────────────────────────
const CfgRow = ({ label, children, last = false }: {
  label: string; children: React.ReactNode; last?: boolean
}) => (
  <div className={`flex items-center gap-2 px-4 py-3 ${!last ? 'border-b border-slate-100' : ''}`}>
    <span className="text-[13px] font-medium text-slate-700 shrink-0 w-[68px]">{label}</span>
    <div className="flex-1 min-w-0 flex items-center gap-2">{children}</div>
  </div>
)

// ── Input base style ──────────────────────────────────────────────────────────
const inputCls = `flex-1 min-w-0 bg-slate-100 border border-slate-200 rounded
  text-[13px] text-slate-800 font-medium px-2 py-1.5 outline-none
  focus:border-blue-400 focus:bg-white transition-colors`

function ConfigPage({ onBack }: { onBack: () => void }) {
  const [netTimeOn, setNetTimeOn]   = useState(true)
  const [storageOn, setStorageOn]   = useState(true)
  const [resumeOn,  setResumeOn]    = useState(false)
  const [logExpanded, setLogExpanded] = useState(false)
  const [customCmd, setCustomCmd]   = useState('')

  const logs = [
    { ts: '15:28:01.102', dir: 'TX',  msg: '01 03 00 00 00 02 C4 0B'        },
    { ts: '15:28:01.185', dir: 'RX',  msg: '01 03 04 00 0A 00 3C 7A 12'     },
    { ts: '15:28:05.420', dir: 'SYS', msg: '姿态角阈值读取成功: 10°'          },
    { ts: '15:28:09.310', dir: 'TX',  msg: '01 06 00 01 00 0A D9 CA'        },
    { ts: '15:28:09.402', dir: 'RX',  msg: '01 06 00 01 00 0A D9 CA'        },
    { ts: '15:28:09.450', dir: 'SYS', msg: '上传间隔写入成功'                 },
  ]

  const dirColor = (d: string) =>
    d === 'TX' ? 'text-sky-400' : d === 'RX' ? 'text-emerald-400' : 'text-slate-300'
  const dirLabel = (d: string) =>
    d === 'TX' ? 'TX ->' : d === 'RX' ? 'RX <-' : 'System:'

  return (
    <div className="bg-slate-100 min-h-screen flex justify-center">
      <div className="w-full max-w-[390px] flex flex-col" style={{ minHeight: '100dvh' }}>

        {/* ── NavBar ── */}
        <nav className="bg-white border-b border-slate-200 sticky top-0 z-10">
          <div className="h-11"/>
          <div className="relative flex items-center px-4 pb-3.5">
            <button onClick={onBack} className="absolute left-4 p-1 -ml-1 active:opacity-50">
              <IcoBack/>
            </button>
            <p className="w-full text-center text-[17px] font-bold text-slate-900">设备参数配置</p>
            <span className="absolute right-4 inline-flex items-center gap-1.5
              bg-emerald-50 text-emerald-700 text-[12px] font-semibold
              px-2.5 py-1 rounded-full border border-emerald-100 whitespace-nowrap">
              <span className="w-[6px] h-[6px] rounded-full bg-emerald-500 shrink-0 blink"/>
              蓝牙已连接
            </span>
          </div>
        </nav>

        <div className="flex-1 overflow-y-auto">
          <div className="px-3 pt-3 space-y-[10px] pb-6">

            {/* ── 顶置快捷操作条 ── */}
            <div className="bg-blue-50 border border-blue-100 rounded-lg px-3 py-2.5
              flex items-center justify-between gap-3">
              <span className="text-[13px] font-medium text-blue-700">设备参数同步状态</span>
              <button className="bg-blue-600 text-white text-[13px] font-semibold
                px-3 py-1.5 rounded-lg shrink-0 active:opacity-80 transition-opacity whitespace-nowrap">
                🔄 一键参数同步
              </button>
            </div>

            {/* ── 基础参数 ── */}
            <div className="bg-white rounded-xl overflow-hidden">
              <div className="px-4 py-2.5 border-b border-slate-100">
                <span className="text-[15px] font-bold text-slate-900">⚙️ 基础参数</span>
              </div>

              <CfgRow label="TNS">
                <input placeholder="输入 TNS" className={inputCls}/>
                <RWBtns/>
              </CfgRow>

              <CfgRow label="蓝牙名称">
                <input defaultValue="BLE_Device_01" className={inputCls}/>
                <button className="shrink-0 w-[30px] h-[30px] flex items-center justify-center
                  border border-slate-200 bg-slate-100 rounded active:opacity-70 transition-opacity">
                  <IcoScan/>
                </button>
                <button className="bg-emerald-50 text-emerald-600 border border-emerald-200
                  text-[12px] font-semibold px-2.5 py-1 rounded
                  active:opacity-70 transition-opacity whitespace-nowrap shrink-0">
                  写入
                </button>
              </CfgRow>

              <CfgRow label="上传间隔">
                <input defaultValue="00:05:00" className={inputCls}/>
                <RWBtns/>
              </CfgRow>

              <CfgRow label="工作模式">
                <select className={`${inputCls} appearance-none`}>
                  <option>常规工作模式</option>
                  <option>应急模式</option>
                </select>
                <RWBtns/>
              </CfgRow>

              <CfgRow label="系统时间" last>
                <span className="flex-1 mono text-[11.5px] text-slate-700 bg-slate-100
                  border border-slate-200 rounded px-2 py-1.5 truncate">
                  2026-09-21 16:09:30
                </span>
                <button className="bg-emerald-500 text-white text-[12px] font-semibold
                  px-2.5 py-1.5 rounded shrink-0 active:opacity-80 transition-opacity whitespace-nowrap">
                  一键校时
                </button>
              </CfgRow>
            </div>

            {/* ── 高级参数 ── */}
            <div className="bg-white rounded-xl overflow-hidden">
              <div className="px-4 py-2.5 border-b border-slate-100">
                <span className="text-[15px] font-bold text-slate-900">🛠️ 高级参数</span>
              </div>

              {/* 网络校时 */}
              <CfgRow label="网络校时">
                <MiniToggle on={netTimeOn} onChange={() => setNetTimeOn(v => !v)}/>
                <span className="text-[12px] text-slate-400 flex-1">
                  {netTimeOn ? '已开启' : '已关闭'}
                </span>
                <RWBtns/>
              </CfgRow>

              {/* 数据存储 + 断点续传 同行 */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-100">
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-[13px] font-medium text-slate-700">数据存储</span>
                  <MiniToggle on={storageOn} onChange={() => setStorageOn(v => !v)}/>
                </div>
                <div className="w-px h-4 bg-slate-200 shrink-0"/>
                <div className="flex items-center gap-1.5 flex-1">
                  <span className="text-[13px] font-medium text-slate-700">断点续传</span>
                  <MiniToggle on={resumeOn} onChange={() => setResumeOn(v => !v)}/>
                </div>
                <RWBtns/>
              </div>

              <CfgRow label="姿态角阈值">
                <input defaultValue="10" type="number" className={inputCls}/>
                <span className="text-[13px] font-medium text-slate-500 shrink-0">°</span>
                <RWBtns/>
              </CfgRow>

              <CfgRow label="数据编号" last>
                <input placeholder="输入编号" className={inputCls}/>
                <RWBtns/>
              </CfgRow>
            </div>

            {/* ── 系统维护 ── */}
            <div className="bg-red-50 border border-red-200 rounded-xl p-3">
              <button className="w-full bg-red-600 text-white text-[14px] font-bold
                py-3.5 rounded-xl active:opacity-80 transition-opacity">
                恢复出厂设置
              </button>
            </div>

            {/* ── 发送自定义数据 ── */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
              <p className="text-[13px] font-bold text-slate-700 mb-2">📡 发送自定义数据</p>
              <div className="flex gap-2">
                <input
                  value={customCmd}
                  onChange={e => setCustomCmd(e.target.value)}
                  placeholder="请输入指令"
                  className="flex-1 bg-white border border-slate-300 rounded-lg
                    text-[13px] text-slate-800 px-3 py-2 outline-none
                    focus:border-blue-400 transition-colors mono"/>
                <button className="bg-blue-600 text-white text-[13px] font-bold
                  px-4 py-2 rounded-lg shrink-0 active:opacity-80 transition-opacity">
                  发送
                </button>
              </div>
            </div>

            {/* ── 通信日志 ── */}
            <div className={`bg-slate-900 rounded-xl overflow-hidden
              ${logExpanded ? 'fixed inset-0 z-50 rounded-none' : ''}`}>

              {/* header */}
              <div className="flex items-center justify-between px-3 py-2 border-b border-slate-700">
                <div className="flex items-center gap-2">
                  <span className="text-[12px] font-semibold text-slate-300">
                    通信日志 (BLE Log)
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 blink shrink-0"/>
                    监听中
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button className="text-slate-400 text-[11px] font-medium px-2 py-1 rounded
                    hover:bg-slate-700 active:opacity-70 transition-colors">
                    清空
                  </button>
                  <button onClick={() => setLogExpanded(v => !v)}
                    className="text-slate-400 text-[11px] font-medium px-2 py-1 rounded
                    hover:bg-slate-700 active:opacity-70 transition-colors">
                    {logExpanded ? '✕ 关闭' : '⤢ 放大'}
                  </button>
                </div>
              </div>

              {/* body */}
              <div className="overflow-y-auto px-3 py-2 space-y-1 font-mono text-[11px]"
                style={{ height: logExpanded ? 'calc(100dvh - 45px)' : '90px' }}>
                {logs.map((l, i) => (
                  <div key={i} className="flex gap-1.5">
                    <span className="text-slate-500 shrink-0">[{l.ts}]</span>
                    <span className={`${dirColor(l.dir)} shrink-0`}>{dirLabel(l.dir)}</span>
                    <span className={dirColor(l.dir)}>{l.msg}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="h-6"/>
          </div>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// Root — simple page router
// ═══════════════════════════════════════════════════════════════════════════════

export default function App() {
  const [page, setPage] = useState<'scan' | 'detail' | 'config'>('scan')

  return page === 'scan'
    ? <ScanPage onConnect={() => setPage('detail')}/>
    : page === 'detail'
      ? <DetailPage onBack={() => setPage('scan')} onConfig={() => setPage('config')}/>
      : <ConfigPage onBack={() => setPage('detail')}/>
}
