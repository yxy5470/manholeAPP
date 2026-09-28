import React, { useState, useEffect, useRef } from 'react'

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
    { id: 1, name: '120YJ260924001',   mac: '0E:56:B2:31:98:F0', rssi: -52, manhole: true  },
    { id: 2, name: '120YJ260924002',   mac: 'F4:AB:5C:88:7F:E0', rssi: -75, manhole: true  },
    { id: 3, name: 'TS02',             mac: '1D:A7:85:31:10:8A', rssi: -91, manhole: false },
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
                  <span className="text-[12px] text-slate-500 truncate">仅显示窨井遥测终端</span>
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

              {/* 水位 / 流速 / 瞬时流量 */}
              <div className="px-4 py-3 space-y-2.5">
                {[
                  { label: '水位',     val: '1.25',   unit: 'm'    },
                  { label: '流速',     val: '0.38',   unit: 'm/s'  },
                  { label: '瞬时流量', val: '0.047',  unit: 'm³/s' },
                  { label: '累计流量', val: '128.46', unit: 'm³'   },
                ].map((item, i, a) => (
                  <div key={item.label}
                    className={`flex items-center justify-between pb-2.5
                      ${i < a.length - 1 ? 'border-b border-slate-100' : ''}`}>
                    <span className="text-[14px] font-semibold text-slate-700">{item.label}</span>
                    <div className="flex items-baseline gap-1">
                      <span className="mono text-[20px] font-bold text-slate-900">
                        {item.val}
                      </span>
                      <span className="text-[12px] font-medium text-slate-500">{item.unit}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 现场安装区 */}
            <div className="bg-white rounded-xl overflow-hidden">
              <CardTitle>🛠️ 现场安装操作区</CardTitle>
              <div className="px-4 py-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[16px] font-bold text-slate-900">设备电源</p>
                    <p className="text-[13px] font-medium text-slate-500 mt-0.5">
                      电源状态：{powerOn ? '已开机' : '已关机'}
                    </p>
                  </div>
                  <Toggle on={powerOn} onChange={() => setPowerOn(v => !v)}/>
                </div>
              </div>
            </div>

            {/* 高级配置与调试 — 单按钮 */}
            <button onClick={onConfig}
              className="w-full bg-white text-slate-800 text-[15px] font-bold
                border border-slate-200 py-3.5 rounded-xl
                active:bg-slate-50 transition-colors">
              ⚙️ 高级配置与调试
            </button>

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
// PAGE C — Device Config (Tab + ViewPager)
// ═══════════════════════════════════════════════════════════════════════════════

const W = () => (
  <button style={{ background:'#ECFDF5', color:'#059669', border:'1px solid #A7F3D0', height:28 }}
    className="text-[12px] font-semibold px-2.5 rounded active:opacity-70 whitespace-nowrap shrink-0">
    写入
  </button>
)

const RW = () => (
  <div className="flex gap-1 shrink-0">
    <button style={{ background:'#EFF6FF', color:'#2563EB', border:'1px solid #BFDBFE', height:28 }}
      className="text-[12px] font-semibold px-2.5 rounded active:opacity-70 whitespace-nowrap">
      读取
    </button>
    <button style={{ background:'#ECFDF5', color:'#059669', border:'1px solid #A7F3D0', height:28 }}
      className="text-[12px] font-semibold px-2.5 rounded active:opacity-70 whitespace-nowrap">
      写入
    </button>
  </div>
)

const MT = ({ on, onChange }: { on: boolean; onChange: () => void }) => (
  <button role="switch" aria-checked={on} onClick={onChange}
    style={{ transition: 'background .18s ease' }}
    className={`relative inline-flex h-[22px] w-[38px] shrink-0 rounded-full
      ${on ? 'bg-emerald-500' : 'bg-slate-300'}`}>
    <span style={{ transition: 'transform .18s ease' }}
      className={`absolute top-[2px] left-[2px] h-[18px] w-[18px] rounded-full bg-white shadow-sm
        ${on ? 'translate-x-[16px]' : 'translate-x-0'}`}/>
  </button>
)

const cfgInp = `flex-1 min-w-0 bg-slate-100 border border-slate-200 rounded
  text-[12px] text-slate-800 px-2 py-1.5 outline-none
  focus:border-blue-400 focus:bg-white transition-colors`

const CRow = ({ label, children, last=false }: { label:string; children:React.ReactNode; last?:boolean }) => (
  <div className={`flex items-center gap-2 px-4 py-2.5 ${!last?'border-b border-slate-100':''}`}>
    <span className="text-[13px] font-medium text-slate-700 shrink-0 w-[72px] leading-tight">{label}</span>
    <div className="flex-1 min-w-0 flex items-center gap-1.5">{children}</div>
  </div>
)

const DEFAULT_RESET_CMDS = `AT+FACTORY_RESET\nAT+REBOOT`

function Tab1() {
  const [resetCmds, setResetCmds] = useState(DEFAULT_RESET_CMDS)
  return (
    <div className="space-y-2">
      <div className="bg-white rounded-xl overflow-hidden">
        <CRow label="TNS">
          <span className="flex-1 mono text-[12px] text-slate-500 bg-slate-50
            border border-slate-200 rounded px-2 py-1.5 truncate select-text">
            120YJ260924001
          </span>
        </CRow>
        <CRow label="蓝牙名称">
          <input defaultValue="BLE_Telemetry_01" className={cfgInp}/>
          <button className="shrink-0 w-[28px] h-[28px] flex items-center justify-center
            border border-slate-200 bg-slate-100 rounded active:opacity-70">
            <IcoScan/>
          </button>
          <W/>
        </CRow>
        <CRow label="上传间隔">
          <input defaultValue="00:05:00" className={cfgInp}/>
          <W/>
        </CRow>
        <CRow label="工作模式">
          <select className={`${cfgInp} appearance-none`}>
            <option>常规工作模式</option>
            <option>应急模式</option>
          </select>
          <W/>
        </CRow>
        <CRow label="系统时间" last>
          <span className="flex-1 mono text-[11px] text-slate-700 bg-slate-100
            border border-slate-200 rounded px-2 py-1.5 truncate">
            2026-09-21 16:09:30
          </span>
          <button className="bg-emerald-500 text-white text-[12px] font-semibold
            px-2.5 py-1.5 rounded shrink-0 active:opacity-80 whitespace-nowrap">
            一键校时
          </button>
        </CRow>
      </div>

      {/* 批量下发 */}
      <div className="bg-slate-800 rounded-xl px-4 py-3 space-y-2.5">
        <div className="flex items-center justify-between">
          <p className="text-[12px] font-semibold text-slate-200">批量下发指令</p>
          <span className="text-[10px] text-slate-400">每行一条，按序发送</span>
        </div>
        <textarea
          value={resetCmds}
          onChange={e => setResetCmds(e.target.value)}
          rows={3}
          spellCheck={false}
          className="w-full rounded-lg text-[12px] px-3 py-2 outline-none resize-none
            leading-relaxed mono transition-colors"
          style={{ background:'#1E293B', border:'1px solid #334155', color:'#94A3B8' }}
        />
        <button style={{ background:'#2563EB', color:'#fff', height:36, borderRadius:8 }}
          className="w-full text-[13px] font-bold active:opacity-80 transition-opacity">
          批量下发 {resetCmds.split('\n').filter(l=>l.trim()).length} 条指令
        </button>
      </div>

      {/* 恢复出厂设置 */}
      <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
        <button style={{ background:'#DC2626', color:'#fff', height:40, borderRadius:8 }}
          className="w-full text-[14px] font-bold active:opacity-80 transition-opacity">
          恢复出厂设置
        </button>
      </div>
    </div>
  )
}

function Tab2() {
  const [ch, setCh] = useState(0)
  const channels = ['CH1','CH2','CH3','CH4','CH5','CH6','CH7','CH8']
  const isCH1 = ch === 0

  const sel = `w-full bg-white border border-slate-200 rounded text-[12px]
    text-slate-800 px-2 py-2 outline-none focus:border-blue-400 transition-colors appearance-none`
  const inp2 = `w-full bg-white border border-slate-200 rounded text-[12px]
    text-slate-800 px-2 py-2 outline-none focus:border-blue-400 transition-colors mono`
  const inp2d = `w-full bg-slate-50 border border-slate-200 rounded text-[12px]
    text-slate-400 px-2 py-2 outline-none mono cursor-not-allowed`

  const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div>
      <p className="text-[11px] text-slate-500 font-medium mb-1">{label}</p>
      {children}
    </div>
  )

  const chTouchX = React.useRef(0)
  const onChTouchStart = (e: React.TouchEvent) => { chTouchX.current = e.touches[0].clientX }
  const onChTouchEnd   = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - chTouchX.current
    if (Math.abs(dx) > 40) setCh(c => dx < 0 ? Math.min(c+1, channels.length-1) : Math.max(c-1, 0))
  }

  return (
    <div className="space-y-2">
      {/* CH selector — sticky, compact */}
      <div className="sticky top-0 z-10 bg-slate-100 pt-0 pb-2">
        <div className="bg-white rounded-xl px-3 py-0"
          onTouchStart={onChTouchStart} onTouchEnd={onChTouchEnd}>
          <div className="flex items-center gap-1.5 overflow-x-auto"
            style={{ scrollbarWidth:'none', height:40 }}>
            {channels.map((c, i) => (
              <button key={c} onClick={() => setCh(i)}
                style={i===ch ? {background:'#2563EB',color:'#fff'} : {background:'#F1F5F9',color:'#64748B'}}
                className="text-[12px] font-semibold px-3 h-7 rounded-full whitespace-nowrap shrink-0 active:opacity-80 transition-colors">
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 采集参数 */}
      <div className="bg-white rounded-xl px-4 py-3 space-y-3">
        {/* 左右两列 */}
        <div className="grid grid-cols-2 gap-x-3 gap-y-3">
          {/* 左列 */}
          <Field label="数据格式/采样开关">
            <select className={sel} defaultValue="0：关闭">
              <option>0：关闭</option>
              <option>1：有符号整型大端序</option>
              <option>2：单精度IEEE 754浮点型小端序</option>
              <option>3：单精度IEEE 754浮点型大端序</option>
              <option>4：无符号整型大端序</option>
              <option>5：无符号整型小端序</option>
              <option>6：无符号整型混合端序</option>
              <option>7：单精度IEEE 754浮点型混合端序</option>
            </select>
          </Field>
          {/* 右列 */}
          <Field label="数据标识码">
            <input defaultValue="031" className={inp2}/>
          </Field>

          <Field label="数据1字节数">
            <select className={sel} defaultValue="2字节">
              <option>0字节</option><option>2字节</option><option>4字节</option>
              <option>6字节</option><option>8字节</option>
            </select>
          </Field>
          <Field label="数据1分辨率">
            <select className={sel} defaultValue="1">
              <option>1</option><option>0.1</option><option>0.01</option>
              <option>0.001</option><option>0.0001</option>
            </select>
          </Field>

          <Field label="数据2字节数">
            <select className={sel} defaultValue="0字节">
              <option>0字节</option><option>2字节</option><option>4字节</option>
              <option>6字节</option><option>8字节</option>
            </select>
          </Field>
          <Field label="数据2分辨率">
            <select className={sel} defaultValue="1">
              <option>1</option><option>0.1</option><option>0.01</option>
              <option>0.001</option><option>0.0001</option>
            </select>
          </Field>

          <Field label="数据3字节数">
            <select className={sel} defaultValue="0字节">
              <option>0字节</option><option>2字节</option><option>4字节</option>
              <option>6字节</option><option>8字节</option>
            </select>
          </Field>
          <Field label="数据3分辨率">
            <select className={sel} defaultValue="1">
              <option>1</option><option>0.1</option><option>0.01</option>
              <option>0.001</option><option>0.0001</option>
            </select>
          </Field>

          <Field label="人工置数">
            <select className={sel} defaultValue="关闭">
              <option>关闭</option><option>开启</option>
            </select>
          </Field>
          {/* 右列：波特率仅 CH1 显示 */}
          {isCH1 ? (
            <Field label="波特率">
              <select className={sel} defaultValue="0：9600">
                <option>0：9600</option><option>1：19200</option>
                <option>2：38400</option><option>3：115200</option>
              </select>
            </Field>
          ) : <div/>}
        </div>

        {/* Modbus 底部四格 */}
        <div className="grid grid-cols-2 gap-x-3 gap-y-3 pt-1 border-t border-slate-100">
          <Field label="Modbus地址">
            <input defaultValue="01" className={inp2}/>
          </Field>
          <Field label="功能码">
            <input defaultValue="03" className={inp2}/>
          </Field>
          <Field label="寄存器起始地址">
            <input defaultValue="0003" className={inp2}/>
          </Field>
          <Field label="寄存器读取长度">
            <input defaultValue="0001" disabled className={inp2d}/>
          </Field>
        </div>

        <div className="flex justify-end pt-1"><W/></div>
      </div>

      {/* 率定系数 */}
      <div className="bg-white rounded-xl px-4 py-3">
        <p className="text-[11px] font-semibold text-slate-500 mb-2">率定系数/基值</p>
        <div className="flex items-center gap-2">
          <select className="w-[120px] shrink-0 bg-white border border-slate-200 rounded text-[12px]
            text-slate-800 px-2 py-2 outline-none focus:border-blue-400 appearance-none">
            <option>基值+观测值</option>
            <option>基值-观测值</option>
          </select>
          <span className="text-[12px] text-slate-500 shrink-0">基值</span>
          <input defaultValue="+00.00000" className={`${cfgInp} mono`}/>
          <W/>
        </div>
      </div>

      {/* 数据召测 */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
        <p className="text-[11px] font-semibold text-slate-500 mb-2">数据召测</p>
        <div className="flex items-center gap-3">
          <span className="text-[12px] text-slate-600">采集值(E)</span>
          <span className="mono text-[13px] font-bold text-slate-800 flex-1">—</span>
          <span className="text-[12px] text-slate-600">上传值(P)</span>
          <span className="mono text-[13px] font-bold text-slate-800 w-12">—</span>
          <button style={{ background:'#EFF6FF', color:'#2563EB', border:'1px solid #BFDBFE', height:28 }}
            className="text-[12px] font-semibold px-2.5 rounded active:opacity-70 whitespace-nowrap shrink-0">
            读取
          </button>
        </div>
      </div>
    </div>
  )
}

type CfgPhase = 'idle' | 'entering' | 'active' | 'exiting'
type ToastType = 'info' | 'success' | 'warn' | 'error'

function Tab3() {
  // ── 水位互补 & 预警阈值 ──
  const [complement, setComplement] = useState(true)
  const [levelOn,    setLevelOn]    = useState(true)
  const [velOn,      setVelOn]      = useState(true)
  const [flowOn,     setFlowOn]     = useState(true)

  // ── 断面参数配置状态机 ──
  const [phase,      setPhase]      = useState<CfgPhase>('idle')
  const [unlocked,   setUnlocked]   = useState(false)
  const [hasRead,    setHasRead]    = useState(false)
  const [hasWritten, setHasWritten] = useState(false)
  const [busy,       setBusy]       = useState(false)
  const [countdown,  setCountdown]  = useState(300)
  const [toast,      setToast]      = useState<{msg:string; type:ToastType} | null>(null)

  // 断面参数
  const [section, setSection] = useState<'rect'|'circle'>('rect')
  const [topW,    setTopW]    = useState('')
  const [botW,    setBotW]    = useState('')
  const [ht,      setHt]      = useState('')
  const [diam,    setDiam]    = useState('')

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const stopTimer = () => { if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null } }

  const startTimer = () => {
    stopTimer()
    setCountdown(300)
    timerRef.current = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) {
          stopTimer()
          setPhase('idle'); setUnlocked(false); setHasRead(false); setHasWritten(false)
          setToast({ msg: '配置模式超时，已自动退出', type: 'error' })
          return 0
        }
        return c - 1
      })
    }, 1000)
  }

  useEffect(() => () => stopTimer(), [])

  const fmt = (s: number) => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`

  // 模拟 BLE 通信（实际接入时替换此函数）
  const sim = (onSuccess: () => void, onFail?: () => void, delay = 900) => {
    setBusy(true)
    setTimeout(() => {
      setBusy(false)
      onSuccess()
    }, delay)
    void onFail // 保留失败路径钩子
  }

  const handleEnter = () => {
    setToast({ msg: '→ TX: WMS:02\\r\\n  等待应答...', type: 'info' })
    setPhase('entering')
    sim(() => {
      setPhase('active')
      startTimer()
      setToast({ msg: '✓ 已进入配置模式', type: 'success' })
    })
  }

  const handleExit = () => {
    if (hasWritten) setToast({ msg: '⚠ 已写入，保存未确认', type: 'warn' })
    setPhase('exiting')
    sim(() => {
      stopTimer()
      setPhase('idle'); setUnlocked(false); setHasRead(false); setHasWritten(false)
      if (!hasWritten) setToast({ msg: '已退出配置模式', type: 'info' })
    })
  }

  const handleRead = () => {
    setToast({ msg: '→ TX: 01 03 00 60 00 09 85 D2', type: 'info' })
    sim(() => {
      setSection('rect'); setTopW('3.50'); setBotW('2.80'); setHt('4.20'); setDiam('')
      setHasRead(true)
      setToast({ msg: '✓ 读取成功', type: 'success' })
    })
  }

  const handleUnlockSave = () => {
    if (!unlocked) {
      setToast({ msg: '→ TX: 01 06 AA 55 81 5F AF 50 A0 A3 16', type: 'info' })
      sim(() => {
        setUnlocked(true)
        setToast({ msg: '✓ 解锁成功', type: 'success' })
      })
    } else {
      sim(() => {
        if (hasWritten) {
          setToast({ msg: '✓ 保存成功', type: 'success' })
          setHasWritten(false)
        } else {
          setToast({ msg: '已锁定（无新写入数据）', type: 'info' })
        }
        setUnlocked(false)
      })
    }
  }

  const handleWrite = () => {
    setToast({ msg: '→ TX: 写入断面参数报文...', type: 'info' })
    sim(() => {
      setHasWritten(true)
      setToast({ msg: '✓ 写入成功，尚未保存', type: 'warn' })
    })
  }

  const isActive  = phase === 'active'
  const canRead   = isActive && !busy
  const canWrite  = isActive && unlocked && hasRead && !busy
  const canUnlock = isActive && !busy

  const toastColors: Record<ToastType, string> = {
    info:    'bg-blue-50 border-blue-200 text-blue-700',
    success: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    warn:    'bg-amber-50 border-amber-200 text-amber-700',
    error:   'bg-red-50 border-red-200 text-red-700',
  }

  const paramInp = (disabled: boolean) =>
    `w-full border rounded text-[12px] px-2 py-1.5 outline-none transition-colors mono ${
      disabled
        ? 'bg-slate-50 border-slate-200 text-slate-300 cursor-not-allowed'
        : 'bg-white border-slate-200 text-slate-800 focus:border-blue-400'
    }`

  return (
    <div className="space-y-2">

      {/* 水位互补监测 */}
      <div className="bg-white rounded-xl px-4 py-3 flex items-center gap-3">
        <span className="text-[13px] font-medium text-slate-700">水位互补监测</span>
        <span className={`text-[11px] font-medium flex-1 ${complement?'text-emerald-600':'text-slate-400'}`}>
          {complement?'已开启':'已关闭'}
        </span>
        <MT on={complement} onChange={() => setComplement(v=>!v)}/>
        <W/>
      </div>

      {/* 断面参数配置 */}
      <div className="bg-white rounded-xl px-4 py-3 space-y-3">
        {/* 标题 + 状态 */}
        <div className="flex items-center justify-between">
          <span className="text-[12px] font-semibold text-slate-700">断面参数配置</span>
          {isActive && (
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-blue-600">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 blink shrink-0"/>
              配置模式  {fmt(countdown)}
            </span>
          )}
        </div>

        {/* Toast */}
        {toast && (
          <div className={`text-[11px] px-3 py-1.5 rounded-lg border mono leading-snug ${toastColors[toast.type]}`}>
            {toast.msg}
          </div>
        )}

        {/* 进入 / 退出按钮 */}
        {phase === 'idle' && (
          <button onClick={handleEnter} disabled={busy}
            className="w-full text-[12px] font-semibold py-2 rounded-lg
              border border-blue-200 bg-blue-50 text-blue-600 active:opacity-80
              disabled:opacity-40 disabled:cursor-not-allowed transition-opacity">
            进入配置模式
          </button>
        )}
        {(phase === 'entering' || phase === 'exiting') && (
          <div className="w-full text-[12px] text-slate-400 text-center py-2">
            {busy ? '通信中...' : ''}
          </div>
        )}
        {isActive && (
          <button onClick={handleExit} disabled={busy}
            className="w-full text-[12px] font-semibold py-2 rounded-lg
              border border-slate-300 bg-slate-50 text-slate-600 active:opacity-80
              disabled:opacity-40 disabled:cursor-not-allowed transition-opacity">
            退出配置模式
          </button>
        )}

        {/* 断面参数区 — 始终显示，未激活时置灰 */}
        <div className={`space-y-2.5 transition-opacity ${isActive ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
          {/* 断面类型 */}
          <div className="flex gap-4">
            {(['rect','circle'] as const).map(v => (
              <label key={v} className="flex items-center gap-1.5 cursor-pointer">
                <div onClick={() => isActive && setSection(v)}
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center
                    ${section===v?'border-blue-600':'border-slate-300'}`}>
                  {section===v && <div className="w-2 h-2 rounded-full bg-blue-600"/>}
                </div>
                <span className="text-[12px] text-slate-700">{v==='rect'?'矩形 / 梯形':'圆形'}</span>
              </label>
            ))}
          </div>

          {/* 参数输入 — 始终4格，不适用者置灰 */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-[10px] text-slate-400 mb-0.5">上底 (m)</p>
              <input value={topW} onChange={e=>setTopW(e.target.value)}
                disabled={section==='circle' || !isActive}
                className={paramInp(section==='circle')} placeholder="上底"/>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 mb-0.5">下底 (m)</p>
              <input value={botW} onChange={e=>setBotW(e.target.value)}
                disabled={section==='circle' || !isActive}
                className={paramInp(section==='circle')} placeholder="下底"/>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 mb-0.5">高度 (m)</p>
              <input value={ht} onChange={e=>setHt(e.target.value)}
                disabled={section==='circle' || !isActive}
                className={paramInp(section==='circle')} placeholder="高度"/>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 mb-0.5">圆直径 (m)</p>
              <input value={diam} onChange={e=>setDiam(e.target.value)}
                disabled={section==='rect' || !isActive}
                className={paramInp(section==='rect')} placeholder="直径"/>
            </div>
          </div>

          {/* 操作按钮行 */}
          <div className="flex gap-1.5 flex-wrap">
            {/* 读取 */}
            <button onClick={handleRead} disabled={!canRead}
              style={{ background:'#EFF6FF', color: canRead?'#2563EB':'#93C5FD',
                border:`1px solid ${canRead?'#BFDBFE':'#DBEAFE'}`, height:28 }}
              className="text-[12px] font-semibold px-2.5 rounded whitespace-nowrap
                transition-all disabled:cursor-not-allowed">
              读取
            </button>

            {/* 写入参数 */}
            <button onClick={handleWrite} disabled={!canWrite}
              style={{ background:'#ECFDF5', color: canWrite?'#059669':'#6EE7B7',
                border:`1px solid ${canWrite?'#A7F3D0':'#D1FAE5'}`, height:28 }}
              className="text-[12px] font-semibold px-2.5 rounded whitespace-nowrap
                transition-all disabled:cursor-not-allowed">
              写入参数
            </button>

            <div className="flex-1"/>

            {/* 解锁 / 锁定并保存 */}
            <button onClick={handleUnlockSave} disabled={!canUnlock}
              style={unlocked
                ? { background:'#FEF3C7', color:'#92400E', border:'1px solid #FDE68A', height:28 }
                : { background:'#F1F5F9', color:'#475569', border:'1px solid #CBD5E1', height:28 }}
              className="text-[12px] font-semibold px-2.5 rounded whitespace-nowrap
                transition-all disabled:cursor-not-allowed">
              {unlocked ? '锁定并保存' : '解锁'}
            </button>
          </div>
        </div>
      </div>

      {/* 数据预警阈值 */}
      <div className="rounded-xl px-4 py-3 space-y-2.5"
        style={{ background:'#FEF3C7', border:'1px solid #FDE68A' }}>
        <p className="text-[11px] font-semibold text-amber-700">数据预警阈值</p>
        {[
          { label:'水位',     on:levelOn, setOn:setLevelOn, ph:'+4.00000', unit:'m'    },
          { label:'流速',     on:velOn,   setOn:setVelOn,   ph:'输入流速',  unit:'m/s'  },
          { label:'瞬时流量', on:flowOn,  setOn:setFlowOn,  ph:'输入流量',  unit:'m³/s' },
        ].map(r => (
          <div key={r.label} className="flex items-center gap-2">
            <span className="text-[12px] font-medium text-amber-800 w-[52px] shrink-0">{r.label}</span>
            <MT on={r.on} onChange={() => r.setOn((v:boolean) => !v)}/>
            <input placeholder={r.ph}
              className="flex-1 min-w-0 bg-white border border-amber-200 rounded
                text-[12px] px-2 py-1.5 outline-none focus:border-amber-400 mono"/>
            <span className="text-[11px] text-amber-600 shrink-0">{r.unit}</span>
            <W/>
          </div>
        ))}
      </div>

    </div>
  )
}

function Tab4() {
  const [netTime, setNetTime] = useState(true)
  const [storage, setStorage] = useState(true)
  const [resume,  setResume]  = useState(false)
  return (
    <div className="space-y-2">
      {/* 平台对接 */}
      <div className="bg-white rounded-xl overflow-hidden">
        <CRow label="推送协议">
          <select className={`${cfgInp} appearance-none`}>
            <option>00：不推送</option>
            <option>02：部委地灾协议MQTT</option>
            <option>03：SCSW008-2011（2018修订版）《水文测报系统技术规约和协议》</option>
            <option>04：SL651-2014《水文监测数据通信规约》</option>
          </select>
          <W/>
        </CRow>
        <CRow label="测站编码 / MQTT Client ID" last>
          <input defaultValue="0000000000" className={`${cfgInp} mono`}/>
          <W/>
        </CRow>
      </div>

      {/* 系统维护 */}
      <div className="bg-white rounded-xl overflow-hidden">
        <CRow label="网络校时">
          <MT on={netTime} onChange={() => setNetTime(v=>!v)}/>
          <span className="text-[11px] text-slate-400 flex-1">{netTime?'已开启':'已关闭'}</span>
          <W/>
        </CRow>
        <CRow label="RS485预热">
          <input defaultValue="20" type="number" className={cfgInp}/>
          <span className="text-[12px] text-slate-500 shrink-0">s</span>
          <W/>
        </CRow>
        <CRow label="存储 / 续传" last>
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[12px] text-slate-600">存储</span>
            <MT on={storage} onChange={() => setStorage(v=>!v)}/>
          </div>
          <div className="w-px h-4 bg-slate-200 shrink-0"/>
          <div className="flex items-center gap-1.5 flex-1">
            <span className="text-[12px] text-slate-600">续传</span>
            <MT on={resume} onChange={() => setResume(v=>!v)}/>
          </div>
          <W/>
        </CRow>
      </div>
    </div>
  )
}

function ConfigPage({ onBack }: { onBack: () => void }) {
  const [tab, setTab] = useState(0)
  const [customCmd, setCustomCmd] = useState('')
  const [logVisible,  setLogVisible]  = useState(false)
  const [logExpanded, setLogExpanded] = useState(false)
  const logTouchY = React.useRef(0)
  const onLogHandleTouchStart = (e: React.TouchEvent) => { logTouchY.current = e.touches[0].clientY }
  const onLogHandleTouchEnd   = (e: React.TouchEvent) => {
    const dy = e.changedTouches[0].clientY - logTouchY.current
    if (dy > 30)  setLogVisible(true)
    if (dy < -30) setLogVisible(false)
  }
  const tabs = ['基础参数','RS485配置','水文算法与安全配置','全局运行配置']

  const logs = [
    { ts:'15:28:01.102', dir:'TX',  msg:'01 03 00 03 00 01 74 0A' },
    { ts:'15:28:01.185', dir:'RX',  msg:'01 03 02 00 1F 38 4C'    },
    { ts:'15:28:05.420', dir:'SYS', msg:'蓝牙数据读取成功'          },
    { ts:'15:28:09.310', dir:'TX',  msg:'01 06 00 01 00 14 C8 0F' },
    { ts:'15:28:09.402', dir:'RX',  msg:'01 06 00 01 00 14 C8 0F' },
  ]

  const touchX = React.useRef(0)
  const onTouchStart = (e: React.TouchEvent) => { touchX.current = e.touches[0].clientX }
  const onTouchEnd   = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchX.current
    if (Math.abs(dx) > 50) setTab(t => dx < 0 ? Math.min(t+1, tabs.length-1) : Math.max(t-1, 0))
  }

  const dirClr = (d:string) => d==='TX' ? '#38BDF8' : d==='RX' ? '#4ADE80' : '#CBD5E1'
  const dirLbl = (d:string) => d==='TX' ? 'TX ->' : d==='RX' ? 'RX <-' : 'System:'

  return (
    <div className="bg-slate-100 flex justify-center" style={{ height:'100dvh' }}>
      <div className="w-full max-w-[390px] flex flex-col" style={{ height:'100dvh' }}>

        {/* Fixed top */}
        <div className="shrink-0">
          <div className="bg-white border-b border-slate-200" style={{ paddingTop:44 }}>
            <div className="relative flex items-center px-4 pb-3">
              <button onClick={onBack} className="absolute left-4 p-1 -ml-1 active:opacity-50">
                <IcoBack/>
              </button>
              <p className="w-full text-center text-[17px] font-bold text-slate-900">高级配置与调试</p>
              <span className="absolute right-4 inline-flex items-center gap-1.5
                bg-emerald-50 text-emerald-700 text-[11px] font-semibold
                px-2.5 py-1 rounded-full border border-emerald-100 whitespace-nowrap">
                <span className="w-[5px] h-[5px] rounded-full bg-emerald-500 shrink-0 blink"/>
                蓝牙已连接
              </span>
            </div>
          </div>
          <div style={{ background:'#EFF6FF', borderBottom:'1px solid #BFDBFE' }}
            className="flex items-center justify-between px-4 py-2">
            <span className="text-[12px] font-medium text-blue-700">全量参数同步</span>
            <button style={{ background:'#2563EB' }}
              className="text-white text-[12px] font-semibold px-3 py-1.5 rounded-lg
                active:opacity-80 whitespace-nowrap">
              🔄 同步当前页参数
            </button>
          </div>
          <div className="bg-white border-b border-slate-200 flex overflow-x-auto"
            style={{ scrollbarWidth:'none', WebkitOverflowScrolling:'touch' } as React.CSSProperties}>
            {tabs.map((t, i) => (
              <button key={t} onClick={() => setTab(i)}
                className="shrink-0 px-3 py-2 text-[12px] font-medium relative whitespace-nowrap transition-colors"
                style={{ color: i===tab ? '#2563EB' : '#64748B' }}>
                {t}
                {i===tab && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-t-full"
                    style={{ background:'#2563EB' }}/>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden"
          onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
          <div className="px-3 py-3">
            {tab===0 && <Tab1/>}
            {tab===1 && <Tab2/>}
            {tab===2 && <Tab3/>}
            {tab===3 && <Tab4/>}
          </div>
        </div>

        {/* Fixed bottom */}
        <div className="shrink-0">
          <div style={{ background:'#F8FAFC', borderTop:'1px solid #E2E8F0' }}
            className="px-3 py-2">
            <p className="text-[12px] font-bold text-slate-600 mb-1.5">📡 发送自定义数据</p>
            <div className="flex gap-2">
              <input value={customCmd} onChange={e => setCustomCmd(e.target.value)}
                placeholder="请输入指令"
                className="flex-1 bg-white border border-slate-300 rounded-lg
                  text-[12px] text-slate-800 px-3 py-2 outline-none
                  focus:border-blue-400 transition-colors mono"/>
              <button style={{ background:'#2563EB' }}
                className="text-white text-[13px] font-bold px-4 py-2 rounded-lg
                  shrink-0 active:opacity-80">
                发送
              </button>
            </div>
          </div>

          {/* 拖拽把手 — 始终可见，向下滑展开日志 */}
          <div
            onTouchStart={onLogHandleTouchStart}
            onTouchEnd={onLogHandleTouchEnd}
            onClick={() => setLogVisible(v => !v)}
            style={{ background:'#0F172A', cursor:'pointer', userSelect:'none', height:28 }}
            className="flex items-center px-3"
            role="button"
            aria-label="通信日志"
          >
            <div className="w-full flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold text-slate-400">通信日志 (BLE Log)</span>
                <span className="flex items-center gap-1 text-[10px] text-emerald-400">
                  <span className="w-1 h-1 rounded-full bg-emerald-400 blink"/>监听中
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-500 text-[10px]">{logVisible ? '↑ 收起' : '↓ 展开'}</span>
                {logVisible && (
                  <button onClick={e => { e.stopPropagation(); setLogExpanded(true) }}
                    className="text-slate-500 text-[10px] hover:text-slate-300 active:opacity-70">
                    ⤢
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* 日志内容 — 滑出展示 */}
          <div style={{
            background:'#0F172A',
            maxHeight: logVisible ? 120 : 0,
            overflow: 'hidden',
            transition: 'max-height 0.25s ease',
          }}>
            <div className="overflow-y-auto px-3 py-2 space-y-1 font-mono text-[11px]"
              style={{ height:112 }}>
              {logs.map((l,i) => (
                <div key={i} className="flex gap-1.5">
                  <span className="text-slate-500 shrink-0">[{l.ts}]</span>
                  <span style={{ color: dirClr(l.dir) }} className="shrink-0">{dirLbl(l.dir)}</span>
                  <span style={{ color: dirClr(l.dir) }}>{l.msg}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 全屏展开 */}
          {logExpanded && (
            <div className="fixed inset-0 z-50 flex flex-col" style={{ background:'#0F172A' }}>
              <div className="flex items-center justify-between px-3 py-2 border-b border-slate-700">
                <div className="flex items-center gap-2">
                  <span className="text-[12px] font-semibold text-slate-300">通信日志 (BLE Log)</span>
                  <span className="flex items-center gap-1 text-[11px] text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 blink"/>监听中
                  </span>
                </div>
                <div className="flex gap-1">
                  <button className="text-slate-400 text-[11px] px-2 py-1 rounded hover:bg-slate-700">清空</button>
                  <button onClick={() => setLogExpanded(false)}
                    className="text-slate-400 text-[11px] px-2 py-1 rounded hover:bg-slate-700">
                    ✕ 关闭
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1 font-mono text-[11px]">
                {logs.map((l,i) => (
                  <div key={i} className="flex gap-1.5">
                    <span className="text-slate-500 shrink-0">[{l.ts}]</span>
                    <span style={{ color: dirClr(l.dir) }} className="shrink-0">{dirLbl(l.dir)}</span>
                    <span style={{ color: dirClr(l.dir) }}>{l.msg}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
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
