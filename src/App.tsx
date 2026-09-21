import { useState } from 'react'

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

// ─── Toggle ───────────────────────────────────────────────────────────────────

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

// ─── Divider ──────────────────────────────────────────────────────────────────

const Div = () => <div className="border-t border-slate-100"/>

// ─── Card ─────────────────────────────────────────────────────────────────────

const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white rounded-xl overflow-hidden ${className}`}>{children}</div>
)

// ─── Section title inside card ────────────────────────────────────────────────

const CardTitle = ({ children }: { children: React.ReactNode }) => (
  <div className="px-4 py-3 border-b border-slate-100">
    <span className="text-[16px] font-bold text-slate-900">{children}</span>
  </div>
)

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [powerOn, setPowerOn] = useState(true)

  return (
    <div className="bg-slate-100 min-h-screen flex justify-center">
      <div className="w-full max-w-[390px] flex flex-col" style={{ minHeight: '100dvh' }}>

        {/* ── NavBar ─────────────────────────────────────────────────────── */}
        <nav className="bg-white border-b border-slate-200 sticky top-0 z-10">
          <div className="h-11"/>
          <div className="relative flex items-center px-4 pb-3.5">

            {/* Back */}
            <button className="absolute left-4 flex items-center active:opacity-50 p-1 -ml-1">
              <svg width="11" height="19" viewBox="0 0 11 19" fill="none">
                <path d="M9.5 1.5 1.5 9.5l8 8" stroke="#111827" strokeWidth="2.2"
                  strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            {/* Title */}
            <p className="w-full text-center text-[17px] font-bold text-slate-900">
              设备详情与配置
            </p>

            {/* BT badge */}
            <span className="absolute right-4 inline-flex items-center gap-1.5
              bg-emerald-50 text-emerald-700 text-[12px] font-semibold
              px-3 py-1.5 rounded-full border border-emerald-100 whitespace-nowrap">
              <span className="w-[7px] h-[7px] rounded-full bg-emerald-500 shrink-0 blink"/>
              蓝牙已连接
            </span>
          </div>
        </nav>

        {/* ── Scrollable ─────────────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-3 pt-3 space-y-[10px] pb-6">

            {/* ━━━━━━━━━━━━━━ 上半区：状态总览 ━━━━━━━━━━━━━━ */}
            <Card>

              {/* SN / MAC */}
              <div className="px-4 py-3 border-b border-slate-100">
                <p className="mono text-[13px] text-slate-600 font-medium leading-snug">
                  SN: JG100-12345678901234
                </p>
                <p className="mono text-[13px] text-slate-600 font-medium leading-snug mt-0.5">
                  MAC: 0E:56:B2:31:98:F0
                </p>
              </div>

              {/* 4 核心数据 */}
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

              {/* 通信 + 姿态 */}
              <div className="px-4 py-3 flex items-center gap-3 border-b border-slate-100 flex-wrap">
                {/* 通信 */}
                <div className="flex items-center gap-2">
                  <span className="text-[14px] font-semibold text-slate-700">通信状态</span>
                  <span className="inline-flex items-center gap-1.5 bg-emerald-500 text-white
                    text-[12px] font-bold px-2.5 py-1 rounded-full">
                    正常
                  </span>
                </div>
                <div className="w-px h-5 bg-slate-200 shrink-0"/>
                {/* 姿态 */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[14px] font-semibold text-slate-700 shrink-0">当前姿态</span>
                  <span className="mono text-[16px] font-bold text-slate-900">0.18°</span>
                  <span className="text-slate-300 text-sm">|</span>
                  <span className="text-[13px] font-medium text-slate-500 shrink-0">触发阈值</span>
                  <span className="mono text-[15px] font-bold text-slate-700">10.00°</span>
                </div>
              </div>

              {/* GPS / LBS */}
              <div className="px-4 py-3 space-y-2">
                {/* GPS */}
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-bold text-slate-600 w-8 shrink-0">GPS</span>
                  <span className="mono text-[13px] font-semibold text-slate-900 flex-1">
                    103.986651, 30.776512
                  </span>
                  <span className="text-[12px] font-bold text-emerald-600 shrink-0 bg-emerald-50
                    px-2 py-0.5 rounded-full border border-emerald-100">
                    已定位
                  </span>
                </div>
                {/* LBS */}
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-bold text-slate-500 w-8 shrink-0">LBS</span>
                  <span className="mono text-[13px] font-medium text-slate-600 flex-1">
                    103.985120, 30.775890
                  </span>
                  <span className="text-[12px] font-medium text-slate-400 shrink-0 bg-slate-100
                    px-2 py-0.5 rounded-full border border-slate-200">
                    基站定位
                  </span>
                </div>
              </div>
            </Card>

            {/* ━━━━━━━━━━━━━━ 下半区①：现场安装 ━━━━━━━━━━━━━━ */}
            <Card>
              <CardTitle>🛠️ 现场安装操作区</CardTitle>

              <div className="px-4 py-3 space-y-3">

                {/* 行1：电源开关 */}
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

                {/* 行2：姿态校准 */}
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

                {/* 行3：获取GPS */}
                <button className="w-full flex items-center justify-center gap-2
                  bg-emerald-50 text-emerald-800 text-[15px] font-bold
                  border border-emerald-200 py-3.5 rounded-xl
                  active:opacity-75 transition-opacity">
                  📡 获取当前 GPS 定位
                </button>
              </div>
            </Card>

            {/* ━━━━━━━━━━━━━━ 下半区②：高级配置 ━━━━━━━━━━━━━━ */}
            <Card>
              <CardTitle>⚙️ 高级配置与调试</CardTitle>

              <div className="px-4 py-3 space-y-2.5">

                {/* 行1 */}
                <div className="grid grid-cols-2 gap-2.5">
                  <button className="flex items-center justify-center gap-1
                    bg-slate-100 text-slate-800 text-[14px] font-bold
                    py-3 rounded-xl active:opacity-70 transition-opacity">
                    🗺️ 查看地图位置
                  </button>
                  <button className="flex items-center justify-center gap-1
                    bg-blue-50 text-blue-700 text-[14px] font-bold
                    border border-blue-100 py-3 rounded-xl active:opacity-70 transition-opacity">
                    ⚙️ 配置模式
                  </button>
                </div>

                {/* 行2 */}
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
            </Card>

            {/* ━━━━━━━━━━━━━━ 断开按钮 ━━━━━━━━━━━━━━ */}
            <button className="w-full bg-red-50 text-red-600 text-[15px] font-bold
              border border-red-200 py-4 rounded-xl
              active:bg-red-100 transition-colors">
              ❌ 断开蓝牙连接
            </button>

            {/* iOS home indicator */}
            <div className="h-6"/>
          </div>
        </div>

      </div>
    </div>
  )
}
