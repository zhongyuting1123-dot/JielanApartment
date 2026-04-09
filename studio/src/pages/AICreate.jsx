import { useState } from 'react';
import { Upload, Sparkles, Image, Video, Flame, BookOpen, X, Check, ChevronDown, RefreshCw, Download, Eye, Plus, Search, Copy, Edit3, Trash2, Star, Clock, ArrowLeftRight, Zap } from 'lucide-react';

/* ── Styles ───────────────────────────────────────────────────── */
const inputStyle = {
  width: '100%', padding: '9px 14px', borderRadius: 8,
  border: '1px solid #E8E8ED', fontSize: 13, color: '#1D1D1F',
  outline: 'none', fontFamily: 'inherit', background: '#FAFAFA',
  transition: 'border-color 150ms ease', boxSizing: 'border-box',
};
const selectStyle = { ...inputStyle, cursor: 'pointer', appearance: 'none', backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'10\' height=\'6\' viewBox=\'0 0 10 6\' fill=\'none\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M1 1l4 4 4-4\' stroke=\'%23AEAEB2\' stroke-width=\'1.5\' stroke-linecap=\'round\' stroke-linejoin=\'round\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', paddingRight: 32 };
const labelStyle = { fontSize: 13, fontWeight: 600, color: '#1D1D1F', marginBottom: 8, display: 'block' };
const subLabel = { fontSize: 12, color: '#AEAEB2', fontWeight: 400, marginLeft: 6 };
const cardStyle = { background: '#FFF', border: '1px solid #F0F0F0', borderRadius: 12, padding: 20, marginBottom: 16 };
const stepBadge = (num, color = '#0071E3') => ({
  width: 22, height: 22, borderRadius: '50%', background: color, color: '#FFF',
  fontSize: 11, fontWeight: 700, display: 'inline-flex', alignItems: 'center',
  justifyContent: 'center', marginRight: 8, flexShrink: 0,
});
const btnPrimary = {
  width: '100%', padding: '13px 0', borderRadius: 10, fontSize: 15, fontWeight: 600,
  fontFamily: 'inherit', border: 'none', cursor: 'pointer', color: '#FFF',
  background: 'linear-gradient(135deg, #0071E3, #00C6FF)', boxShadow: '0 4px 16px rgba(0,113,227,0.25)',
  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all 150ms ease',
};
const previewWall = { flex: 1, background: '#F5F5F7', borderRadius: 12, padding: 20, minHeight: 400 };
const emptyState = { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: 300, color: '#AEAEB2' };

/* ── Shared: Upload box ───────────────────────────────────────── */
function UploadBox({ label, accept, hint, file, onUpload, onClear, aspectRatio = '4/3', icon: IconComp = Upload }) {
  return (
    <div>
      {file ? (
        <div style={{ position: 'relative' }}>
          <div style={{ width: '100%', aspectRatio, borderRadius: 8, background: file.url ? `url(${file.url}) center/contain no-repeat #F5F5F7` : 'linear-gradient(135deg, #F5F5F7, #E8E8ED)', border: '1px solid #E8E8ED', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {!file.url && <IconComp size={28} color="#C7C7CC" />}
          </div>
          <button onClick={onClear} style={{ position: 'absolute', top: -6, right: -6, width: 20, height: 20, borderRadius: '50%', background: '#FF3B30', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={10} color="#FFF" /></button>
          <div style={{ fontSize: 11, color: '#AEAEB2', marginTop: 6 }}>{file.name}</div>
        </div>
      ) : (
        <div onClick={() => onUpload({ name: 'sample_product.jpg', url: null })}
          style={{ width: '100%', aspectRatio, borderRadius: 8, border: '2px dashed #D1D1D6', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 150ms ease', background: '#FAFAFA' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#0071E3'; e.currentTarget.style.background = 'rgba(0,113,227,0.02)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = '#D1D1D6'; e.currentTarget.style.background = '#FAFAFA'; }}
        >
          <IconComp size={24} color="#AEAEB2" style={{ marginBottom: 8 }} />
          <span style={{ fontSize: 12, color: '#0071E3', fontWeight: 500 }}>{label || '拖拽图片到此处'}</span>
          <span style={{ fontSize: 11, color: '#C7C7CC', marginTop: 4 }}>{hint || '或点击选择文件 · 支持 PNG/JPG/JPEG/WEBP'}</span>
        </div>
      )}
    </div>
  );
}

/* ── Shared: Preview grid item ────────────────────────────────── */
function PreviewItem({ status, label, ratio = '1/1', type = 'image' }) {
  const isVideo = type === 'video';
  return (
    <div style={{ background: '#FFF', border: '1px solid #E8E8ED', borderRadius: 10, overflow: 'hidden' }}>
      <div style={{ aspectRatio: ratio, background: status === 'done' ? 'linear-gradient(135deg, #667eea, #764ba2)' : '#F5F5F7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {status === 'generating' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: 36, height: 36, border: '3px solid #E8E8ED', borderTop: '3px solid #0071E3', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 8px' }} />
            <span style={{ fontSize: 11, color: '#AEAEB2' }}>正在生成...</span>
          </div>
        )}
        {status === 'done' && (isVideo ? <Video size={28} color="rgba(255,255,255,0.6)" /> : <Check size={28} color="rgba(255,255,255,0.6)" />)}
      </div>
      {label && <div style={{ padding: '8px 10px', fontSize: 11, color: '#6E6E73' }}>{label}</div>}
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Tab 1: 商品图生成
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function ProductImageGen() {
  const [file, setFile] = useState(null);
  const [productName, setProductName] = useState('');
  const [cat1, setCat1] = useState('');
  const [cat2, setCat2] = useState('');
  const [lang, setLang] = useState('英语');
  const [size, setSize] = useState('');
  const [model, setModel] = useState('Gemini 3 Pro Image');
  const [ratio, setRatio] = useState('1:1');
  const [resolution, setResolution] = useState('1K');
  const [count, setCount] = useState(7);
  const [results, setResults] = useState([]);
  const [generating, setGenerating] = useState(false);

  const autoExtract = () => {
    setProductName('HP Laptop with Intel Celeron Processor');
    setCat1('Electronics (电子产品)');
    setCat2('Computers & Accessories');
    setSize('14-15 inch disp');
  };

  const generate = () => {
    setGenerating(true);
    const labels = ['主图·白底正面', '45°侧面', '场景图', '尺寸标注图', '卖点图', '细节特写', '包装配件图', '备用图'];
    const items = [];
    for (let i = 0; i < count; i++) {
      items.push({ id: Date.now() + i, label: labels[i] || `图 ${i + 1}`, status: 'generating' });
    }
    setResults(items);
    items.forEach((item, idx) => {
      setTimeout(() => {
        setResults(prev => prev.map(r => r.id === item.id ? { ...r, status: 'done' } : r));
        if (idx === items.length - 1) setGenerating(false);
      }, 1500 + Math.random() * 2000 + idx * 500);
    });
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 24, alignItems: 'start' }}>
      <div>
        {/* Step 1: Upload */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 14 }}>
            <span style={stepBadge(1)}>1</span>
            <span style={labelStyle}>上传产品图</span>
          </div>
          <UploadBox file={file} onUpload={setFile} onClear={() => setFile(null)} hint="支持 PNG/JPG/JPEG/WEBP" />
        </div>

        {/* Step 2: Product info */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={stepBadge(2, '#34C759')}>2</span>
              <span style={labelStyle}>产品信息</span>
            </div>
            <button onClick={autoExtract} style={{ fontSize: 12, fontWeight: 500, color: '#0071E3', background: 'rgba(0,113,227,0.06)', border: '1px solid rgba(0,113,227,0.12)', borderRadius: 6, padding: '4px 12px', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 4 }}>
              <Sparkles size={12} /> AI 自动提取
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div><div style={{ fontSize: 11, color: '#6E6E73', marginBottom: 4 }}>产品名称</div><input value={productName} onChange={e => setProductName(e.target.value)} placeholder="输入产品名称" style={inputStyle} /></div>
            <div><div style={{ fontSize: 11, color: '#6E6E73', marginBottom: 4 }}>一级类目</div><select value={cat1} onChange={e => setCat1(e.target.value)} style={selectStyle}><option value="">请选择</option><option>Electronics (电子产品)</option><option>Home & Kitchen (家居厨房)</option><option>Beauty (美妆)</option><option>Clothing (服装)</option></select></div>
            <div><div style={{ fontSize: 11, color: '#6E6E73', marginBottom: 4 }}>二级类目</div><input value={cat2} onChange={e => setCat2(e.target.value)} placeholder="输入或由 AI 自动填充" style={inputStyle} /></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div><div style={{ fontSize: 11, color: '#6E6E73', marginBottom: 4 }}>首图语言</div><select value={lang} onChange={e => setLang(e.target.value)} style={selectStyle}><option>英语</option><option>中文</option><option>日语</option></select></div>
              <div><div style={{ fontSize: 11, color: '#6E6E73', marginBottom: 4 }}>产品尺寸</div><input value={size} onChange={e => setSize(e.target.value)} placeholder="如：14-15 inch" style={inputStyle} /></div>
            </div>
          </div>
        </div>

        {/* Step 3: Settings */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 14 }}>
            <span style={stepBadge(3, '#5856D6')}>3</span>
            <span style={labelStyle}>生成设置</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div><div style={{ fontSize: 11, color: '#6E6E73', marginBottom: 4 }}>模型选择</div><select value={model} onChange={e => setModel(e.target.value)} style={selectStyle}><option>Gemini 3 Pro Image</option><option>Gemini 2.0 Flash</option><option>Imagen 3</option><option>Imagen 3 Fast</option></select></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
              <div><div style={{ fontSize: 11, color: '#6E6E73', marginBottom: 4 }}>图片比例</div><select value={ratio} onChange={e => setRatio(e.target.value)} style={selectStyle}><option>1:1</option><option>3:4</option><option>16:9</option></select></div>
              <div><div style={{ fontSize: 11, color: '#6E6E73', marginBottom: 4 }}>分辨率</div><select value={resolution} onChange={e => setResolution(e.target.value)} style={selectStyle}><option>1K</option><option>2K</option></select></div>
              <div><div style={{ fontSize: 11, color: '#6E6E73', marginBottom: 4 }}>生成张数</div><select value={count} onChange={e => setCount(Number(e.target.value))} style={selectStyle}>{[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>{n}</option>)}</select></div>
            </div>
          </div>
        </div>

        <button onClick={generate} disabled={!file || generating} style={{ ...btnPrimary, opacity: (!file || generating) ? 0.5 : 1, cursor: (!file || generating) ? 'not-allowed' : 'pointer' }}>
          <Sparkles size={16} /> 立即生成
        </button>
      </div>

      {/* Preview wall */}
      <div style={previewWall}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: '#1D1D1F' }}>预览墙 <span style={{ fontWeight: 400, color: '#AEAEB2', fontSize: 13 }}>({results.filter(r => r.status === 'done').length}/{results.length})</span></span>
          {results.length > 0 && <button onClick={() => setResults([])} style={{ fontSize: 12, color: '#AEAEB2', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 4 }}><Trash2 size={12} /> 清空预览墙</button>}
        </div>
        {results.length > 0 && generating && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, padding: '8px 14px', background: '#FFF', borderRadius: 8, border: '1px solid #E8E8ED' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#FF3B30' }} />
            <span style={{ fontSize: 12, color: '#6E6E73' }}>SS{Date.now().toString().slice(-6)}</span>
            <span style={{ fontSize: 12, color: '#AEAEB2' }}>{model}</span>
            <span style={{ fontSize: 12, color: '#AEAEB2' }}>{new Date().toLocaleString()}</span>
            <div style={{ width: 12, height: 12, border: '2px solid #E8E8ED', borderTop: '2px solid #0071E3', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          </div>
        )}
        {results.length === 0 ? (
          <div style={emptyState}>
            <Image size={40} color="#D1D1D6" style={{ marginBottom: 12 }} />
            <div style={{ fontSize: 14, fontWeight: 500, color: '#AEAEB2' }}>暂无生成任务</div>
            <div style={{ fontSize: 12, color: '#C7C7CC', marginTop: 4 }}>上传产品图并生成后，结果将显示在这里</div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
            {results.map(r => <PreviewItem key={r.id} status={r.status} label={r.label} />)}
          </div>
        )}
      </div>
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Tab 2: 图生图
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function Img2Img() {
  const [file, setFile] = useState(null);
  const [prompt, setPrompt] = useState('');
  const [autoTranslate, setAutoTranslate] = useState(false);
  const [model, setModel] = useState('X-2.5');
  const [resolution, setResolution] = useState('1K');
  const [ratio, setRatio] = useState('16:9');
  const [genCount, setGenCount] = useState(1);
  const [results, setResults] = useState([]);

  const generate = () => {
    for (let i = 0; i < genCount; i++) {
      const id = Date.now() + i;
      setTimeout(() => {
        setResults(prev => [...prev, { id, label: `生成 #${prev.length + 1}`, status: 'generating' }]);
        setTimeout(() => setResults(prev => prev.map(r => r.id === id ? { ...r, status: 'done' } : r)), 2000 + Math.random() * 2000);
      }, i * 400);
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 24, alignItems: 'start' }}>
      <div>
        {/* Reference image */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
            <span style={labelStyle}>参考图 <span style={{ color: '#FF3B30' }}>*</span> <span style={subLabel}>已添加 {file ? 1 : 0} 张</span></span>
            {file && <button onClick={() => setFile(null)} style={{ fontSize: 12, color: '#FF3B30', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>清空</button>}
          </div>
          <UploadBox file={file} onUpload={setFile} onClear={() => setFile(null)} label="拖拽图片或文件夹到此处" hint="或点击选择文件 · 支持 JPG、PNG" />
          {!file && (
            <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
              <button onClick={() => setFile({ name: 'product.jpg', url: null })} style={{ flex: 1, padding: '7px 0', fontSize: 12, borderRadius: 6, border: '1px solid #E8E8ED', background: '#FFF', cursor: 'pointer', fontFamily: 'inherit', color: '#6E6E73' }}>选择图片</button>
              <button onClick={() => setFile({ name: 'folder/products/', url: null })} style={{ flex: 1, padding: '7px 0', fontSize: 12, borderRadius: 6, border: '1px solid #E8E8ED', background: '#FFF', cursor: 'pointer', fontFamily: 'inherit', color: '#6E6E73' }}>选择文件夹</button>
            </div>
          )}
        </div>

        {/* Prompt */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={labelStyle}>提示词 <span style={{ color: '#FF3B30' }}>*</span></span>
            <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#AEAEB2', cursor: 'pointer' }}>
              <input type="checkbox" checked={autoTranslate} onChange={e => setAutoTranslate(e.target.checked)} style={{ accentColor: '#0071E3' }} /> 自动翻译
            </label>
          </div>
          <textarea value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="请输入提示词，描述你想要生成的画面..." style={{ ...inputStyle, minHeight: 120, resize: 'vertical', lineHeight: 1.6 }} />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 8 }}>
            <button style={{ fontSize: 11, padding: '4px 12px', borderRadius: 6, border: '1px solid #E8E8ED', background: '#FFF', cursor: 'pointer', fontFamily: 'inherit', color: '#6E6E73', display: 'flex', alignItems: 'center', gap: 4 }}><BookOpen size={11} /> 模版库</button>
            <button style={{ fontSize: 11, padding: '4px 12px', borderRadius: 6, border: '1px solid rgba(0,113,227,0.15)', background: 'rgba(0,113,227,0.04)', cursor: 'pointer', fontFamily: 'inherit', color: '#0071E3', display: 'flex', alignItems: 'center', gap: 4 }}><Sparkles size={11} /> AI 生成</button>
          </div>
        </div>

        {/* Settings */}
        <div style={cardStyle}>
          <div><div style={{ fontSize: 11, color: '#6E6E73', marginBottom: 4 }}>模型选择</div><select value={model} onChange={e => setModel(e.target.value)} style={selectStyle}><option>Gemini 3 Pro Image</option><option>Gemini 2.0 Flash</option><option>Imagen 3</option><option>Imagen 3 Fast</option></select></div>
          <div style={{ marginTop: 10 }}><div style={{ fontSize: 11, color: '#6E6E73', marginBottom: 4 }}>分辨率</div><select value={resolution} onChange={e => setResolution(e.target.value)} style={selectStyle}><option>1K</option><option>2K</option><option>4K</option></select></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 10 }}>
            <div><div style={{ fontSize: 11, color: '#6E6E73', marginBottom: 4 }}>图片比例</div><select value={ratio} onChange={e => setRatio(e.target.value)} style={selectStyle}><option>16:9</option><option>9:16</option><option>1:1</option><option>3:4</option></select></div>
            <div><div style={{ fontSize: 11, color: '#6E6E73', marginBottom: 4 }}>生图数量</div><select value={genCount} onChange={e => setGenCount(Number(e.target.value))} style={selectStyle}><option value={1}>1</option><option value={2}>2</option><option value={4}>4</option></select></div>
          </div>
        </div>

        <button onClick={generate} disabled={!file || !prompt} style={{ ...btnPrimary, opacity: (!file || !prompt) ? 0.5 : 1, cursor: (!file || !prompt) ? 'not-allowed' : 'pointer' }}>
          <Sparkles size={16} /> 立即生成
        </button>
      </div>

      <div style={previewWall}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: '#1D1D1F' }}>预览墙</span>
          {results.length > 0 && <button onClick={() => setResults([])} style={{ fontSize: 12, color: '#AEAEB2', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 4 }}><Trash2 size={12} /> 清空预览墙</button>}
        </div>
        {results.length === 0 ? (
          <div style={emptyState}>
            <div style={{ width: 56, height: 56, borderRadius: 14, background: 'linear-gradient(135deg, #0071E3, #00C6FF)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
              <RefreshCw size={24} color="#FFF" />
            </div>
            <div style={{ fontSize: 14, fontWeight: 500, color: '#6E6E73' }}>准备开始创作</div>
            <div style={{ fontSize: 12, color: '#AEAEB2', marginTop: 4 }}>上传参考图并填写提示词，AI 将生成全新作品</div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {results.map(r => <PreviewItem key={r.id} status={r.status} label={r.label} ratio={ratio === '9:16' ? '9/16' : ratio === '16:9' ? '16/9' : '1/1'} />)}
          </div>
        )}
      </div>
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Tab 3: 图生视频
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function Img2Video() {
  const [model, setModel] = useState('V-V');
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);
  const [shots, setShots] = useState(2);
  const [prompt, setPrompt] = useState('');
  const [autoTranslate, setAutoTranslate] = useState(false);
  const [videoRatio, setVideoRatio] = useState('16:9');
  const [clarity, setClarity] = useState('720p');
  const [removeAudio, setRemoveAudio] = useState(false);
  const [results, setResults] = useState([]);

  const generate = () => {
    const id = Date.now();
    setResults(prev => [...prev, { id, label: `视频 #${prev.length + 1}`, status: 'generating' }]);
    setTimeout(() => setResults(prev => prev.map(r => r.id === id ? { ...r, status: 'done' } : r)), 5000 + Math.random() * 3000);
  };

  const shotOptions = [2, 3, 4, 5];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 24, alignItems: 'start' }}>
      <div>
        {/* Model */}
        <div style={cardStyle}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#1D1D1F', marginBottom: 8 }}>模型选择</div>
          <select value={model} onChange={e => setModel(e.target.value)} style={selectStyle}><option>Veo 2</option><option>Veo 3</option><option>Imagen Video</option></select>
        </div>

        {/* Reference images */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={labelStyle}>参考图片 <span style={{ color: '#FF3B30' }}>*</span></span>
            {(file1 || file2) && <button onClick={() => { setFile1(null); setFile2(null); }} style={{ fontSize: 12, color: '#FF3B30', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>清空</button>}
          </div>
          <div style={{ fontSize: 11, color: '#AEAEB2', marginBottom: 10 }}>支持 1-2 张图片（单图生成模式 / 首尾帧过渡）</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 10, color: '#AEAEB2', marginBottom: 4 }}>单图生成模式</div>
              <UploadBox file={file1} onUpload={setFile1} onClear={() => setFile1(null)} aspectRatio="4/3" />
            </div>
            <button style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid #E8E8ED', background: '#FFF', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><ArrowLeftRight size={14} color="#0071E3" /></button>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 10, color: '#AEAEB2', marginBottom: 4 }}>尾帧</div>
              {file2 ? (
                <div style={{ position: 'relative' }}>
                  <div style={{ width: '100%', aspectRatio: '4/3', borderRadius: 8, background: '#F5F5F7', border: '1px solid #E8E8ED', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Image size={20} color="#C7C7CC" /></div>
                  <button onClick={() => setFile2(null)} style={{ position: 'absolute', top: -4, right: -4, width: 16, height: 16, borderRadius: '50%', background: '#FF3B30', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={8} color="#FFF" /></button>
                </div>
              ) : (
                <div onClick={() => setFile2({ name: 'end_frame.jpg', url: null })} style={{ width: '100%', aspectRatio: '4/3', borderRadius: 8, border: '2px dashed #D1D1D6', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: '#FAFAFA' }}>
                  <Plus size={18} color="#AEAEB2" />
                  <span style={{ fontSize: 10, color: '#AEAEB2', marginTop: 2 }}>上传图片</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Shots */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#1D1D1F' }}>分镜</span>
            <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 4, background: 'rgba(0,113,227,0.06)', color: '#0071E3', fontWeight: 500 }}>✨ 推荐</span>
          </div>
          <div style={{ display: 'flex', gap: 0, marginBottom: 8 }}>
            {shotOptions.map(n => (
              <button key={n} onClick={() => setShots(n)} style={{
                flex: 1, padding: '7px 0', fontSize: 12, fontWeight: shots === n ? 600 : 400,
                background: shots === n ? '#0071E3' : '#FFF', color: shots === n ? '#FFF' : '#6E6E73',
                border: '1px solid #E8E8ED', cursor: 'pointer', fontFamily: 'inherit',
                borderRadius: n === 2 ? '6px 0 0 6px' : n === 5 ? '0 6px 6px 0' : 0,
                marginLeft: n === 2 ? 0 : -1,
              }}>{n} 镜</button>
            ))}
          </div>
          <div style={{ fontSize: 11, color: '#AEAEB2' }}>当前：10秒内包含{shots}个分镜，每个分镜约{(10 / shots).toFixed(1)}秒。</div>
        </div>

        {/* Prompt */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={labelStyle}>提示词</span>
            <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#AEAEB2', cursor: 'pointer' }}>
              <input type="checkbox" checked={autoTranslate} onChange={e => setAutoTranslate(e.target.checked)} style={{ accentColor: '#0071E3' }} /> 自动翻译
            </label>
          </div>
          <textarea value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="描述你想要的视频内容，例如：一个女孩在海边奔跑，阳光洒在脸上..." style={{ ...inputStyle, minHeight: 80, resize: 'vertical', lineHeight: 1.6 }} />
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
            <button style={{ fontSize: 11, padding: '5px 14px', borderRadius: 6, border: '1px solid rgba(0,113,227,0.15)', background: 'rgba(0,113,227,0.04)', cursor: 'pointer', fontFamily: 'inherit', color: '#0071E3', display: 'flex', alignItems: 'center', gap: 4 }}><Zap size={11} /> DeepThink ✨</button>
          </div>
          <div style={{ fontSize: 10, color: '#AEAEB2', marginTop: 6 }}>输入简单描述后点击 DeepThink，将根据当前 {shots} 个分镜自动生成各镜头的详细提示词。</div>
        </div>

        {/* Output */}
        <div style={cardStyle}>
          <span style={labelStyle}>输出选项</span>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 8 }}>
            <div><div style={{ fontSize: 11, color: '#6E6E73', marginBottom: 4 }}>宽高比</div><select value={videoRatio} onChange={e => setVideoRatio(e.target.value)} style={selectStyle}><option>16:9</option><option>9:16</option><option>1:1</option></select></div>
            <div><div style={{ fontSize: 11, color: '#6E6E73', marginBottom: 4 }}>清晰度</div><select value={clarity} onChange={e => setClarity(e.target.value)} style={selectStyle}><option>720p</option><option>1080p</option></select></div>
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#6E6E73', marginTop: 10, cursor: 'pointer' }}>
            <input type="checkbox" checked={removeAudio} onChange={e => setRemoveAudio(e.target.checked)} style={{ accentColor: '#0071E3' }} /> 去除原视频音频
          </label>
        </div>

        <button onClick={generate} disabled={!file1} style={{ ...btnPrimary, opacity: !file1 ? 0.5 : 1, cursor: !file1 ? 'not-allowed' : 'pointer' }}>
          <Sparkles size={16} /> 立即生成
        </button>
      </div>

      <div style={previewWall}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: '#1D1D1F' }}>预览墙</span>
          {results.length > 0 && <button onClick={() => setResults([])} style={{ fontSize: 12, color: '#AEAEB2', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 4 }}><Trash2 size={12} /> 清空预览墙</button>}
        </div>
        {results.length === 0 ? (
          <div style={emptyState}><Video size={40} color="#D1D1D6" style={{ marginBottom: 12 }} /><div style={{ fontSize: 14, fontWeight: 500, color: '#AEAEB2' }}>暂无视频任务</div></div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
            {results.map(r => <PreviewItem key={r.id} status={r.status} label={r.label} ratio="16/9" type="video" />)}
          </div>
        )}
      </div>
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Tab 4: 爆款视频复刻
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function ViralVideoClone() {
  const [sourceVideo, setSourceVideo] = useState(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [analyzed, setAnalyzed] = useState(false);
  const [productImages, setProductImages] = useState([]);
  const [prompt, setPrompt] = useState('');
  const [ratio, setRatio] = useState('9:16');
  const [clarity, setClarity] = useState('1080p');
  const [result, setResult] = useState(null);
  const [generating, setGenerating] = useState(false);

  const analyze = () => {
    setAnalyzed(true);
    setPrompt('镜头1：产品正面特写，Costco 超市背景，暖色灯光\n镜头2：手拿产品翻转展示细节，货架虚化\n镜头3：产品使用场景，桌面俯拍\n镜头4：文字弹出 "NOW that the US owns TikTok..."');
  };

  const generate = () => {
    setGenerating(true);
    setResult(null);
    setTimeout(() => { setResult({ id: Date.now() }); setGenerating(false); }, 6000);
  };

  const analysisInfo = [
    { label: '时长', value: '12秒' },
    { label: '分镜', value: '4个镜头' },
    { label: '节奏', value: '快切 · 2-3秒/镜' },
    { label: '风格', value: 'TikTok 爆款 · 手机竖屏' },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 24, alignItems: 'start' }}>
      <div>
        {/* Step 1: Source video */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 14 }}>
            <span style={stepBadge(1)}>1</span>
            <span style={labelStyle}>源视频</span>
          </div>
          {sourceVideo ? (
            <div>
              <div style={{ width: '100%', aspectRatio: '16/9', borderRadius: 8, background: 'linear-gradient(135deg, #1d1d1f, #2c2c2e)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', border: '1px solid #E8E8ED' }}>
                <Video size={28} color="rgba(255,255,255,0.4)" />
                <button onClick={() => { setSourceVideo(null); setAnalyzed(false); }} style={{ position: 'absolute', top: -6, right: -6, width: 20, height: 20, borderRadius: '50%', background: '#FF3B30', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={10} color="#FFF" /></button>
              </div>
              <div style={{ fontSize: 11, color: '#AEAEB2', marginTop: 6 }}>{sourceVideo.name} · 0:12</div>
            </div>
          ) : (
            <>
              <UploadBox label="点击选择源视频" hint="支持 MP4 格式，时长 5-180 秒，最大 500MB" onUpload={() => setSourceVideo({ name: 'viral_tiktok.mp4' })} onClear={() => {}} file={null} icon={Video} aspectRatio="16/9" />
              <div style={{ margin: '10px 0', textAlign: 'center', fontSize: 11, color: '#AEAEB2' }}>或</div>
              <input value={videoUrl} onChange={e => setVideoUrl(e.target.value)} placeholder="粘贴 TikTok / 抖音 / YouTube 链接" style={inputStyle} />
            </>
          )}
          {sourceVideo && !analyzed && (
            <button onClick={analyze} style={{ ...btnPrimary, marginTop: 12, padding: '10px 0', fontSize: 13 }}><Sparkles size={14} /> AI 分析结构</button>
          )}
        </div>

        {/* Step 2: Analysis result */}
        {analyzed && (
          <div style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 14 }}>
              <span style={stepBadge(2, '#34C759')}>2</span>
              <span style={labelStyle}>结构分析</span>
              <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 4, background: 'rgba(52,199,89,0.08)', color: '#34C759', fontWeight: 500, marginLeft: 8 }}>✓ 已完成</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {analysisInfo.map(a => (
                <div key={a.label} style={{ padding: '8px 10px', borderRadius: 6, background: '#F5F5F7', fontSize: 11 }}>
                  <div style={{ color: '#AEAEB2', marginBottom: 2 }}>{a.label}</div>
                  <div style={{ color: '#1D1D1F', fontWeight: 500 }}>{a.value}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Product images */}
        {analyzed && (
          <div style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 14 }}>
              <span style={stepBadge(3, '#FF9F0A')}>3</span>
              <span style={labelStyle}>你的产品</span>
            </div>
            <UploadBox label="上传产品图（1-7张）" hint="AI 将用你的产品替换原视频中的产品" file={productImages.length > 0 ? productImages[0] : null} onUpload={f => setProductImages([f])} onClear={() => setProductImages([])} />
          </div>
        )}

        {/* Step 4: Prompt */}
        {analyzed && (
          <div style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
              <span style={stepBadge(4, '#5856D6')}>4</span>
              <span style={labelStyle}>分镜提示词</span>
            </div>
            <textarea value={prompt} onChange={e => setPrompt(e.target.value)} style={{ ...inputStyle, minHeight: 100, resize: 'vertical', lineHeight: 1.6, fontSize: 12 }} />
            <div style={{ fontSize: 10, color: '#AEAEB2', marginTop: 6 }}>AI 已根据源视频自动生成，你可以逐条编辑调整</div>
          </div>
        )}

        {/* Step 5: Output */}
        {analyzed && (
          <div style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
              <span style={stepBadge(5, '#FF6B35')}>5</span>
              <span style={labelStyle}>输出设置</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div><div style={{ fontSize: 11, color: '#6E6E73', marginBottom: 4 }}>宽高比</div><select value={ratio} onChange={e => setRatio(e.target.value)} style={selectStyle}><option>9:16</option><option>16:9</option><option>1:1</option></select></div>
              <div><div style={{ fontSize: 11, color: '#6E6E73', marginBottom: 4 }}>清晰度</div><select value={clarity} onChange={e => setClarity(e.target.value)} style={selectStyle}><option>1080p</option><option>720p</option></select></div>
            </div>
          </div>
        )}

        {analyzed && (
          <button onClick={generate} disabled={generating || productImages.length === 0} style={{ ...btnPrimary, opacity: (generating || productImages.length === 0) ? 0.5 : 1 }}>
            <Sparkles size={16} /> {generating ? '生成中...' : '立即生成'}
          </button>
        )}
      </div>

      {/* Right panel */}
      <div style={previewWall}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: '#1D1D1F' }}>预览墙</span>
          {result && <button onClick={() => setResult(null)} style={{ fontSize: 12, color: '#AEAEB2', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 4 }}><Trash2 size={12} /> 清空预览墙</button>}
        </div>
        {!generating && !result ? (
          <div style={emptyState}><Flame size={40} color="#D1D1D6" style={{ marginBottom: 12 }} /><div style={{ fontSize: 14, fontWeight: 500, color: '#AEAEB2' }}>暂无视频任务</div><div style={{ fontSize: 12, color: '#C7C7CC', marginTop: 4 }}>上传爆款视频，AI 分析后生成同款</div></div>
        ) : generating ? (
          <div style={emptyState}>
            <div style={{ width: 48, height: 48, border: '3px solid #E8E8ED', borderTop: '3px solid #0071E3', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: 16 }} />
            <div style={{ fontSize: 14, fontWeight: 500, color: '#6E6E73' }}>AI 正在复刻视频...</div>
            <div style={{ fontSize: 12, color: '#AEAEB2', marginTop: 4 }}>预计需要 30-60 秒</div>
          </div>
        ) : result ? (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={{ background: '#FFF', borderRadius: 10, overflow: 'hidden', border: '1px solid #E8E8ED' }}>
                <div style={{ aspectRatio: '9/16', background: 'linear-gradient(135deg, #1d1d1f, #2c2c2e)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                  <Video size={32} color="rgba(255,255,255,0.3)" />
                  <span style={{ position: 'absolute', top: 8, left: 8, fontSize: 10, padding: '2px 8px', borderRadius: 4, background: 'rgba(0,0,0,0.5)', color: '#FFF' }}>原始</span>
                </div>
              </div>
              <div style={{ background: '#FFF', borderRadius: 10, overflow: 'hidden', border: '1px solid #E8E8ED' }}>
                <div style={{ aspectRatio: '9/16', background: 'linear-gradient(135deg, #667eea, #764ba2)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                  <Check size={32} color="rgba(255,255,255,0.6)" />
                  <span style={{ position: 'absolute', top: 8, left: 8, fontSize: 10, padding: '2px 8px', borderRadius: 4, background: '#0071E3', color: '#FFF' }}>生成结果</span>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 14, justifyContent: 'flex-end' }}>
              <button onClick={() => { setResult(null); generate(); }} style={{ fontSize: 12, padding: '8px 16px', borderRadius: 8, border: '1px solid #E8E8ED', background: '#FFF', cursor: 'pointer', fontFamily: 'inherit', color: '#6E6E73', display: 'flex', alignItems: 'center', gap: 4 }}><RefreshCw size={12} /> 重新生成</button>
              <button style={{ fontSize: 12, padding: '8px 16px', borderRadius: 8, border: 'none', background: '#0071E3', cursor: 'pointer', fontFamily: 'inherit', color: '#FFF', display: 'flex', alignItems: 'center', gap: 4 }}><Download size={12} /> 下载</button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Tab 5: 提示词库
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const MOCK_PROMPTS = [
  { id: 1, name: 'Costco 超市场景', category: '商品图', content: '# ROLE\n你是一位顶级的社交媒体爆款商品图生成专家与商业静物摄影师。请根据用户上传的任意商品图片，将其无缝融合到"大型仓储会员超市（如Costco）"的真实购物场景中...', tags: ['商品图', '场景', 'Costco'], scope: 'system', usageCount: 128, lastUsed: '2分钟前' },
  { id: 2, name: 'TikTok 爆款竖屏图', category: '商品图', content: '在画面中上部居中添加原生感短视频字幕：\n- 样式：粗体白色无衬线英文字体 + 黑色文字厚描边\n- 文案根据识别到的商品类别自动替换 [Item]', tags: ['TikTok', '竖屏', '爆款'], scope: 'system', usageCount: 95, lastUsed: '15分钟前' },
  { id: 3, name: '亚马逊白底主图', category: '商品图', content: '纯白色背景(RGB 255,255,255)，产品居中，占画面85%以上，无阴影，无装饰，无文字，专业商业摄影光线', tags: ['亚马逊', '白底', '主图'], scope: 'system', usageCount: 210, lastUsed: '1小时前' },
  { id: 4, name: '产品使用场景', category: '场景图', content: '将产品自然放置在家庭生活场景中，温馨日常感，自然光线，浅景深虚化背景，让产品成为画面焦点但不突兀', tags: ['场景', '生活', '自然'], scope: 'team', usageCount: 45, lastUsed: '3小时前' },
  { id: 5, name: '对比评测图', category: '商品图', content: '左右分屏对比图，左侧为竞品（模糊处理），右侧为我们的产品（高清突出），中间分割线，标注核心差异点', tags: ['对比', '评测', '卖点'], scope: 'personal', usageCount: 12, lastUsed: '昨天' },
  { id: 6, name: '视频开场钩子', category: '视频脚本', content: '3秒快速吸引注意力：产品从画面外飞入 → 定格在中心 → 文字弹出核心卖点，背景音效配合', tags: ['视频', '开场', '钩子'], scope: 'system', usageCount: 67, lastUsed: '30分钟前' },
];

const PROMPT_CATEGORIES = ['全部', '商品图', '场景图', '视频脚本', '爆款复刻'];
const PROMPT_SCOPES = ['全部', '系统预设', '团队共享', '我的模版'];

function PromptLibrary() {
  const [selectedCat, setSelectedCat] = useState('全部');
  const [selectedScope, setSelectedScope] = useState('全部');
  const [searchQ, setSearchQ] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  const scopeLabel = { system: '系统预设', team: '团队共享', personal: '我的模版' };
  const scopeColor = { system: '#0071E3', team: '#34C759', personal: '#FF9F0A' };

  const filtered = MOCK_PROMPTS.filter(p => {
    if (selectedCat !== '全部' && p.category !== selectedCat) return false;
    if (selectedScope === '系统预设' && p.scope !== 'system') return false;
    if (selectedScope === '团队共享' && p.scope !== 'team') return false;
    if (selectedScope === '我的模版' && p.scope !== 'personal') return false;
    if (searchQ && !p.name.includes(searchQ) && !p.content.includes(searchQ) && !p.tags.some(t => t.includes(searchQ))) return false;
    return true;
  });

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: 20, alignItems: 'start' }}>
      {/* Left: categories */}
      <div style={{ background: '#FFF', border: '1px solid #F0F0F0', borderRadius: 12, padding: '12px 0' }}>
        <div style={{ padding: '0 16px 10px', fontSize: 11, fontWeight: 600, color: '#AEAEB2', letterSpacing: '0.04em' }}>分类</div>
        {PROMPT_CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setSelectedCat(cat)} style={{
            width: '100%', padding: '8px 16px', fontSize: 13, textAlign: 'left',
            background: selectedCat === cat ? 'rgba(0,113,227,0.06)' : 'transparent',
            color: selectedCat === cat ? '#0071E3' : '#6E6E73',
            fontWeight: selectedCat === cat ? 600 : 400,
            border: 'none', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 150ms',
          }}>{cat}</button>
        ))}
        <div style={{ margin: '8px 16px', borderTop: '1px solid #F0F0F0' }} />
        <div style={{ padding: '6px 16px 10px', fontSize: 11, fontWeight: 600, color: '#AEAEB2', letterSpacing: '0.04em' }}>来源</div>
        {PROMPT_SCOPES.map(scope => (
          <button key={scope} onClick={() => setSelectedScope(scope)} style={{
            width: '100%', padding: '8px 16px', fontSize: 13, textAlign: 'left',
            background: selectedScope === scope ? 'rgba(0,113,227,0.06)' : 'transparent',
            color: selectedScope === scope ? '#0071E3' : '#6E6E73',
            fontWeight: selectedScope === scope ? 600 : 400,
            border: 'none', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 150ms',
          }}>{scope}</button>
        ))}
      </div>

      {/* Right: prompt list */}
      <div>
        {/* Search + new */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search size={14} color="#AEAEB2" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
            <input value={searchQ} onChange={e => setSearchQ(e.target.value)} placeholder="搜索提示词..." style={{ ...inputStyle, paddingLeft: 34 }} />
          </div>
          <button style={{ padding: '0 18px', borderRadius: 8, border: 'none', background: '#0071E3', color: '#FFF', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 4, whiteSpace: 'nowrap' }}><Plus size={14} /> 新建提示词</button>
        </div>

        {/* Prompt cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map(p => (
            <div key={p.id} style={{ background: '#FFF', border: '1px solid #F0F0F0', borderRadius: 10, overflow: 'hidden', transition: 'box-shadow 150ms', cursor: 'pointer' }}
              onClick={() => setExpandedId(expandedId === p.id ? null : p.id)}
              onMouseEnter={e => e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
            >
              <div style={{ padding: '14px 18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#1D1D1F' }}>{p.name}</span>
                  <span style={{ fontSize: 10, padding: '1px 8px', borderRadius: 4, background: `${scopeColor[p.scope]}10`, color: scopeColor[p.scope], fontWeight: 500 }}>{scopeLabel[p.scope]}</span>
                </div>
                <div style={{ fontSize: 12, color: '#6E6E73', lineHeight: 1.5, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: expandedId === p.id ? 99 : 2, WebkitBoxOrient: 'vertical' }}>
                  {p.content}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {p.tags.map(t => <span key={t} style={{ fontSize: 10, padding: '2px 8px', borderRadius: 4, background: '#F5F5F7', color: '#6E6E73' }}>{t}</span>)}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 11, color: '#AEAEB2' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><Clock size={10} /> {p.lastUsed}</span>
                    <span>使用 {p.usageCount} 次</span>
                  </div>
                </div>
              </div>
              {expandedId === p.id && (
                <div style={{ padding: '10px 18px 14px', borderTop: '1px solid #F0F0F0', display: 'flex', gap: 8 }}>
                  <button style={{ fontSize: 12, padding: '6px 14px', borderRadius: 6, border: '1px solid #E8E8ED', background: '#FFF', cursor: 'pointer', fontFamily: 'inherit', color: '#6E6E73', display: 'flex', alignItems: 'center', gap: 4 }}><Copy size={11} /> 复制</button>
                  <button style={{ fontSize: 12, padding: '6px 14px', borderRadius: 6, border: '1px solid #E8E8ED', background: '#FFF', cursor: 'pointer', fontFamily: 'inherit', color: '#6E6E73', display: 'flex', alignItems: 'center', gap: 4 }}><Edit3 size={11} /> 编辑</button>
                  <button style={{ fontSize: 12, padding: '6px 14px', borderRadius: 6, border: '1px solid #E8E8ED', background: '#FFF', cursor: 'pointer', fontFamily: 'inherit', color: '#6E6E73', display: 'flex', alignItems: 'center', gap: 4 }}><Star size={11} /> 收藏</button>
                  {p.scope !== 'system' && <button style={{ fontSize: 12, padding: '6px 14px', borderRadius: 6, border: '1px solid rgba(255,59,48,0.15)', background: 'rgba(255,59,48,0.04)', cursor: 'pointer', fontFamily: 'inherit', color: '#FF3B30', display: 'flex', alignItems: 'center', gap: 4 }}><Trash2 size={11} /> 删除</button>}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Main: AI 创作
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const TABS = [
  { id: 'product-img', label: '商品图生成', icon: Image },
  { id: 'img2img', label: '图生图', icon: Image },
  { id: 'img2video', label: '图生视频', icon: Video },
  { id: 'viral-clone', label: '爆款视频复刻', icon: Flame },
  { id: 'prompt-lib', label: '提示词库', icon: BookOpen },
];

export default function AICreate() {
  const [tab, setTab] = useState('product-img');

  return (
    <div style={{ flex: 1, overflow: 'auto', animation: 'fadeIn 250ms ease' }}>
      {/* Header */}
      <div style={{ background: '#FFF', borderBottom: '1px solid #F0F0F0', padding: '28px 36px 0' }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1D1D1F', letterSpacing: '-0.4px', marginBottom: 4 }}>AI 创作</h1>
        <p style={{ fontSize: 13, color: '#AEAEB2', marginBottom: 18 }}>AI 驱动的图片与视频创作工具</p>

        {/* Tab bar */}
        <div style={{ display: 'flex', gap: 0 }}>
          {TABS.map(t => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '10px 18px', fontSize: 13, fontWeight: active ? 600 : 400,
                color: active ? '#0071E3' : '#6E6E73',
                background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                borderBottom: active ? '2px solid #0071E3' : '2px solid transparent',
                marginBottom: -1, transition: 'color 150ms',
              }}>
                <Icon size={14} /> {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '24px 36px 48px' }}>
        {tab === 'product-img' && <ProductImageGen />}
        {tab === 'img2img' && <Img2Img />}
        {tab === 'img2video' && <Img2Video />}
        {tab === 'viral-clone' && <ViralVideoClone />}
        {tab === 'prompt-lib' && <PromptLibrary />}
      </div>
    </div>
  );
}
