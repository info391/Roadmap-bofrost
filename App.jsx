import React, { useState, useMemo, useEffect } from 'react';
import { 
  Target, Zap, DoorOpen, Users, UserSearch, Handshake, 
  FileCheck, ArrowRight, Lightbulb, Calculator, Info, 
  ChevronDown, AlertCircle, CheckCircle2, User, Calendar, 
  TrendingUp, ClipboardPaste, FileDown, Loader2, X, Eye, Users2
} from 'lucide-react';

// --- CONFIGURATION ET CONSTANTES ---
const UI_CARD_STYLE = "bg-white rounded-3xl p-6 shadow-sm border border-blue-50 transition-all hover:shadow-lg text-left";

const Dropdown = ({ label, options, value, onChange, icon: Icon }) => (
  <div className="flex-1 min-w-[200px] text-left">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
      {Icon && <Icon size={12} />} {label}
    </label>
    <div className="relative text-left">
      <select 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none bg-white border border-slate-200 rounded-xl px-4 py-3 pr-10 font-bold text-slate-700 shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer transition-all hover:border-indigo-300 text-sm"
      >
        <option value="">Sélectionner...</option>
        {options.map(opt => (
          <option key={String(opt)} value={String(opt)}>
            {String(opt)}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
    </div>
  </div>
);

const RoadmapStep = ({ label, current, required, icon: Icon, ratioLabel, ratioValue, targetValue, isMax = true, hideRatio = false }) => {
  const isMet = parseFloat(current) >= parseFloat(required);
  const progress = Math.min((parseFloat(current) / parseFloat(required)) * 100, 100);
  const isRatioTargetMet = isMax ? ratioValue <= targetValue : ratioValue >= targetValue;
  const ratioColorClass = isRatioTargetMet ? 'text-emerald-600 bg-emerald-50 border-emerald-100' : 'text-rose-600 bg-rose-50 border-rose-100';

  return (
    <div className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-md relative overflow-hidden flex flex-col h-full text-left transition-all hover:shadow-lg">
      <div className="flex items-start justify-between mb-3 text-left">
        <div className={`p-2.5 rounded-xl ${isMet ? 'bg-emerald-50 text-emerald-600' : 'bg-indigo-50 text-indigo-600'}`}>
          {Icon && <Icon size={22} />}
        </div>
        <div className="text-right flex flex-col items-end">
          <p className="text-[9px] font-bold text-slate-400 leading-tight mb-1 max-w-[140px] text-right">
            "{label}" à réaliser pour arriver à l'objectif :
          </p>
          <p className="text-2xl font-black text-slate-900 leading-none">{required}</p>
        </div>
      </div>
      <div className="flex-1 space-y-3 mb-4 text-left">
        <div className="flex items-center gap-2 text-[10px]">
          <span className="font-bold text-slate-400 italic">Actuel: {current.toFixed(1)}</span>
          {!isMet && <ArrowRight size={10} className="text-slate-300" />}
          <span className={`font-black ${isMet ? 'text-emerald-600' : 'text-amber-600'}`}>
            {isMet ? 'Cible atteinte' : `Besoin: +${(required - current).toFixed(1)}`}
          </span>
        </div>
        {!hideRatio && (
          <div className={`px-3 py-2 rounded-xl border transition-colors ${ratioColorClass}`}>
            <div className="flex justify-between items-center mb-0.5">
              <p className="text-[8px] font-black uppercase tracking-widest opacity-70">{ratioLabel}</p>
              <p className="text-[8px] font-bold uppercase whitespace-nowrap ml-2 text-right">Cible: {isMax ? '≤' : '≥'} {targetValue}</p>
            </div>
            <p className="text-sm font-black flex items-center gap-1.5 text-left">
              {ratioValue.toFixed(2)}
              {isRatioTargetMet ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
            </p>
          </div>
        )}
      </div>
      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden text-left">
        <div 
          className={`h-full transition-all duration-1000 ${isMet ? 'bg-emerald-500' : 'bg-indigo-600'}`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

const LeverBlock = ({ title, ratioName, value, target, isMax = true, analysis, hideRatioDetails = false }) => {
  const isMet = isMax ? value <= target : value >= target;
  const colorClass = isMet ? 'emerald' : 'rose';
  return (
    <div className={`p-4 bg-${colorClass}-50/30 rounded-3xl border border-${colorClass}-100 flex items-start gap-3 transition-all hover:bg-white hover:border-${colorClass}-300 text-left`}>
      <div className={`shrink-0 p-2 bg-white rounded-xl shadow-sm text-${colorClass}-500 text-left`}>
        {isMet ? <CheckCircle2 size={18}/> : <AlertCircle size={18}/>}
      </div>
      <div className="text-left flex-1 text-left">
        <div className="flex items-center justify-between mb-1 text-left">
          <p className={`text-[10px] font-black uppercase tracking-widest text-${colorClass}-600 text-left`}>{title}</p>
          {!hideRatioDetails && (
            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full bg-${colorClass}-100 text-${colorClass}-700 text-right`}>
              {ratioName} : {value.toFixed(2)} (Cible {isMax ? '≤' : '≥'} {target})
            </span>
          )}
        </div>
        <div className="text-[11px] font-bold text-slate-700 leading-snug italic whitespace-pre-wrap text-left">
          {analysis}
        </div>
      </div>
    </div>
  );
};

const StatMinimal = ({ label, value, highlight }) => (
  <div className={`p-4 rounded-2xl border ${highlight ? 'bg-indigo-600 border-indigo-700 shadow-md text-left' : 'bg-slate-50 border-slate-100 text-left'}`}>
    <p className={`text-[8px] font-black uppercase tracking-widest mb-1 ${highlight ? 'text-indigo-200 text-left' : 'text-slate-400 text-left'}`}>{label}</p>
    <p className={`text-lg font-black ${highlight ? 'text-white italic text-left' : 'text-slate-700 text-left'}`}>{value}</p>
  </div>
);

// --- LOGIQUE DE PARSING ---

const parsePastedData = (text) => {
  if (!text || text.trim().length < 10) return { collabs: [], weeks: [], data: {} };
  const lines = text.split('\n').filter(l => l.trim() !== '');
  if (lines.length < 2) return { collabs: [], weeks: [], data: {} };
  const headers = lines[0].split(/[|\t]/).map(h => h.trim().toLowerCase());
  const findIdx = (keys) => headers.findIndex(h => keys.some(k => h.includes(k)));
  const idx = { name: findIdx(["nom"]), week: findIdx(["semaine"]), portes: findIdx(["portes"]), presents: findIdx(["présents", "presents"]), prospects: findIdx(["prospects"]), closings: findIdx(["closings"]), bc: findIdx(["bc"]) };
  
  if (idx.name === -1) return { collabs: [], weeks: [], data: {} };
  
  const db = {}; const allCollabs = new Set(); const allWeeks = new Set();
  lines.slice(1).forEach(line => {
    const p = line.split(/[|\t]/).map(v => v.trim());
    if (!p[idx.name]) return;
    const name = String(p[idx.name]);
    const weekValue = p[idx.week] ? p[idx.week].replace(/[^0-9]/g, '') : "1";
    const weekLabel = `Semaine ${weekValue}`;
    allCollabs.add(name); allWeeks.add(weekLabel);
    const key = `${name}_${weekLabel}`;
    if (!db[key]) db[key] = { count: 0, portes: 0, presents: 0, prospects: 0, closings: 0, bc: 0 };
    db[key].count += 1;
    db[key].portes += parseInt(p[idx.portes]) || 0;
    db[key].presents += parseInt(p[idx.presents]) || 0;
    db[key].prospects += parseInt(p[idx.prospects]) || 0;
    db[key].closings += parseInt(p[idx.closings]) || 0;
    db[key].bc += parseInt(p[idx.bc]) || 0;
  });
  return { collabs: Array.from(allCollabs).sort(), weeks: Array.from(allWeeks).sort((a,b) => (parseInt(a.replace(/\D/g,'')) || 0) - (parseInt(b.replace(/\D/g,'')) || 0)), data: db };
};

export default function App() {
  const [rawData, setRawData] = useState('');
  const [selectedCollab, setSelectedCollab] = useState('');
  const [selectedWeek, setSelectedWeek] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const targetBC = 12;

  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const parsed = useMemo(() => parsePastedData(rawData), [rawData]);

  const currentStats = useMemo(() => {
    if (!selectedCollab || !selectedWeek) return null;
    const stats = parsed.data[`${selectedCollab}_${selectedWeek}`];
    if (!stats || stats.count === 0) return null;
    
    const avgStats = { 
      portes: stats.portes / stats.count, 
      presents: stats.presents / stats.count, 
      prospects: stats.prospects / stats.count, 
      closings: stats.closings / stats.count, 
      bc: stats.bc / stats.count 
    };

    const ratios = { 
      rPoPres: avgStats.presents > 0 ? avgStats.portes / avgStats.presents : 3, 
      rPresPros: avgStats.prospects > 0 ? avgStats.presents / avgStats.prospects : 2, 
      rProsClo: avgStats.closings > 0 ? avgStats.prospects / avgStats.closings : 2, 
      rCloBC: avgStats.bc > 0 ? avgStats.closings / avgStats.bc : 2 
    };
    
    const reqClosings = targetBC * ratios.rCloBC; 
    const reqProspects = reqClosings * ratios.rProsClo; 
    const reqPresents = reqProspects * ratios.rPresPros; 
    const reqPortes = reqPresents * ratios.rPoPres;
    
    return { avg: avgStats, ratios, roadmap: { portes: Math.ceil(reqPortes), presents: Math.ceil(reqPresents), prospects: Math.ceil(reqProspects), closings: Math.ceil(reqClosings), bc: targetBC } };
  }, [selectedCollab, selectedWeek, parsed]);

  const exportPDF = () => {
    if (!window.html2pdf || !currentStats) return;
    setIsExporting(true);
    const element = document.getElementById('printable-roadmap');
    window.html2pdf().from(element).set({
      margin: [10, 10], filename: `Roadmap_${selectedCollab}_${selectedWeek}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['css', 'legacy'] }
    }).save().then(() => setIsExporting(false));
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans text-slate-900 text-left relative text-left">
      <div className="max-w-6xl mx-auto space-y-8 text-left">
        <header className="bg-indigo-950 p-8 rounded-[2.5rem] text-white shadow-2xl flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden text-left">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full -mr-32 -mt-32 opacity-20 blur-3xl text-left text-left"></div>
          <div className="relative z-10 text-left text-left text-left">
            <div className="flex items-center gap-3 mb-2 text-left">
              <div className="p-2 bg-indigo-500 rounded-xl shadow-lg text-left text-left text-left"><Zap size={24} /></div>
              <div className="flex flex-col text-left">
                <h1 className="text-2xl font-black uppercase tracking-tighter italic leading-none text-left">Roadmap suggestion</h1>
                <span className="text-[10px] font-bold text-indigo-300 opacity-50 mt-1 uppercase tracking-[0.2em] text-left">v60.44 Final Standalone</span>
              </div>
            </div>
            <p className="text-indigo-200 text-sm font-bold opacity-80 uppercase tracking-widest italic text-left">Pilotage prédictif : De l'objectif vers l'effort</p>
          </div>
          <div className="flex flex-col items-center gap-3 relative z-10 text-left text-left">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl text-center min-w-[180px] text-left">
              <p className="text-[10px] font-black uppercase tracking-widest text-indigo-300 text-left text-left text-left">Objectif Standard</p>
              <p className="text-4xl font-black text-white italic mt-1 text-left text-left">{targetBC} BC signés</p>
            </div>
            {currentStats && (
              <button onClick={exportPDF} disabled={isExporting} className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 disabled:opacity-50 text-left text-left">
                {isExporting ? <Loader2 size={14} className="animate-spin text-left text-left" /> : <FileDown size={14} className="text-left text-left text-left" />}
                {isExporting ? "Génération..." : "Exporter en PDF"}
              </button>
            )}
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 text-left text-left">
          <section className="lg:col-span-1 space-y-6 text-left">
            <div className={UI_CARD_STYLE}>
              <div className="flex items-center gap-2 mb-4 text-indigo-900 font-black text-xs uppercase tracking-widest text-left text-left text-left text-left"><ClipboardPaste size={16} /> 1. Charger les données</div>
              <textarea className="w-full h-40 p-3 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-mono focus:ring-2 focus:ring-indigo-500 outline-none resize-none shadow-inner text-left text-left text-left" placeholder="Collez le tableau ici..." value={rawData} onChange={(e) => setRawData(e.target.value)}/>
            </div>
            {parsed.collabs.length > 0 && (
              <div className="space-y-4 animate-in slide-in-from-left duration-500 text-left text-left text-left">
                <div className="flex items-center justify-between px-2 text-left">
                    <div className="flex items-center gap-2 text-indigo-900 font-black text-xs uppercase tracking-widest text-left text-left text-left"><Calculator size={16} /> 2. Paramétrage</div>
                    <div className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full flex items-center gap-1.5 border border-indigo-200 shadow-sm animate-pulse text-left text-left text-left">
                        <Users2 size={10} />
                        <span className="text-[10px] font-black text-left">{parsed.collabs.length} collab(s)</span>
                    </div>
                </div>
                <Dropdown label="Collaborateur" options={parsed.collabs} value={selectedCollab} onChange={setSelectedCollab} icon={User}/>
                <Dropdown label="Semaine" options={parsed.weeks} value={selectedWeek} onChange={setSelectedWeek} icon={Calendar}/>
              </div>
            )}
          </section>

          <section className="lg:col-span-3 text-left">
            {!currentStats ? (
              <div className="h-full min-h-[400px] border-2 border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center justify-center text-slate-400 gap-4 text-left text-left text-left">
                <Info size={48} className="opacity-20 text-left text-left" />
                <p className="font-bold text-center italic leading-relaxed text-left text-left text-left">Sélectionnez un collaborateur pour analyser <br/> la hiérarchie de sa performance.</p>
              </div>
            ) : (
              <div id="printable-roadmap" className="space-y-0 text-left text-left text-left">
                <div className="space-y-8 pb-8 print:pb-0 text-left text-left text-left">
                  <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl relative overflow-hidden text-left text-left text-left">
                    <div className="absolute top-0 right-0 p-8 text-indigo-50 opacity-10 text-left text-left text-left"><TrendingUp size={120} /></div>
                    <div className="flex items-center gap-3 mb-6 text-left text-left text-left text-left">
                      <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-md text-left text-left text-left"><Target size={24} /></div>
                      <div className="text-left text-left text-left">
                          <h3 className="text-xl font-black uppercase tracking-tighter text-[#0033a0] leading-none text-left text-left text-left text-left">{selectedCollab}</h3>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 text-left text-left text-left">Moyennes hebdomadaires ({selectedWeek})</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-left text-left text-left text-left text-left">
                      <StatMinimal label="Portes" value={currentStats.avg.portes.toFixed(1)} />
                      <StatMinimal label="Présents" value={currentStats.avg.presents.toFixed(1)} />
                      <StatMinimal label="Prospects" value={currentStats.avg.prospects.toFixed(1)} />
                      <StatMinimal label="Closings" value={currentStats.avg.closings.toFixed(1)} />
                      <StatMinimal label="BC signés" value={currentStats.avg.bc.toFixed(1)} highlight />
                    </div>
                  </div>
                  <div className="space-y-4 text-left text-left text-left">
                    <div className="flex items-center gap-2 px-2 text-indigo-900 font-black text-xs uppercase tracking-widest text-left text-left text-left text-left text-left"><Zap size={16} className="text-amber-500 text-left text-left text-left" /> Plan d'Effort Journalier : Objectif 12 BC signés</div>
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 text-left text-left text-left">
                      <RoadmapStep label="Portes" current={currentStats.avg.portes} required={currentStats.roadmap.portes} icon={DoorOpen} ratioLabel="Ratio Porte/Présent" ratioValue={currentStats.ratios.rPoPres} targetValue={3.00} />
                      <RoadmapStep label="Présents" current={currentStats.avg.presents} required={currentStats.roadmap.presents} icon={Users} ratioLabel="Ratio Présent/Prospect" ratioValue={currentStats.ratios.rPresPros} targetValue={2.00} />
                      <RoadmapStep label="Prospects" current={currentStats.avg.prospects} required={currentStats.roadmap.prospects} icon={UserSearch} ratioLabel="Ratio Prospect/Closing" ratioValue={currentStats.ratios.rProsClo} targetValue={2.00} />
                      <RoadmapStep label="Closings" current={currentStats.avg.closings} required={currentStats.roadmap.closings} icon={Handshake} ratioLabel="Ratio Closing/BC" ratioValue={currentStats.ratios.rCloBC} targetValue={2.00} />
                      <RoadmapStep label="BC signés" current={currentStats.avg.bc} required={targetBC} icon={FileCheck} hideRatio={true} />
                    </div>
                  </div>
                </div>
                <div style={{ pageBreakBefore: 'always' }} className="pt-8 print:pt-0 text-left text-left text-left text-left">
                  <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl text-left text-left text-left text-left">
                    <div className="flex items-center gap-3 mb-6 text-left">
                      <div className="p-2 bg-amber-100 text-amber-600 rounded-xl shadow-sm text-left text-left text-left text-left"><Lightbulb size={24} /></div>
                      <h3 className="text-lg font-black text-slate-900 tracking-tighter uppercase italic leading-none text-left text-left text-left text-left">Diagnostic approfondi des leviers de croissance</h3>
                    </div>
                    <div className="grid grid-cols-1 gap-4 text-left text-left text-left text-left text-left">
                      <LeverBlock 
                        title="Levier n°1 : BC signés (Productivité)" 
                        ratioName="BC signés / Jour" 
                        value={currentStats.avg.bc} 
                        target={12.0} 
                        isMax={false} 
                        hideRatioDetails={true} 
                        analysis={`La productivité journalière est actuellement de ${currentStats.avg.bc.toFixed(1)} BC signés. Pour atteindre le seuil de 12, vous devez impérativement augmenter votre production de ${(targetBC - currentStats.avg.bc).toFixed(1)} unités par jour. Pour y parvenir, il est nécessaire de revoir l'efficacité sur les étapes précédentes du tunnel de vente et de maintenir une intensité constante sur le terrain toute la journée. Un rythme plus soutenu est essentiel.`} 
                      />
                      <LeverBlock 
                        title="Levier n°2 : Closings (Signature)" 
                        ratioName="Ratio Closing / BC" 
                        value={currentStats.ratios.rCloBC} 
                        target={2.0} 
                        analysis={`L'objectif est d'atteindre ${currentStats.roadmap.closings} Closings. Un ratio supérieur à 2 révèle un déficit critique de transformation administrative. Trop d'accords moraux s'évaporent avant la signature physique. Vous devez sécuriser l'aspect contractuel dès la fin de l'entretien. Restez ferme dans votre posture de conseil jusqu'à la validation finale du contrat sans laisser de place au doute chez le client. C'est l'étape clé du succès.`} 
                      />
                      <LeverBlock 
                        title="Levier n°3 : Prospects (Verrouillage)" 
                        ratioName="Ratio Prospect / Closing" 
                        value={currentStats.ratios.rProsClo} 
                        target={2.0} 
                        analysis={`L'objectif est d'atteindre ${currentStats.roadmap.prospects} Prospects. Un verrouillage fragile révèle une difficulté à transformer l'intérêt initial en décision concrète. Travaillez la technique des 'petits oui' tout au long du parcours pour engager psychologiquement le client. Ne laissez pas les objections s'accumuler en fin de présentation, traitez-les immédiatement pour sécuriser le volume nécessaire. Soyez percutant sur la valeur ajoutée.`} 
                      />
                      <LeverBlock 
                        title="Levier n°4 : Présents (Découverte)" 
                        ratioName="Ratio Présent / Prospect" 
                        value={currentStats.ratios.rPresPros} 
                        target={2.0} 
                        analysis={`L'objectif est d'atteindre ${currentStats.roadmap.presents} Présents. Si le ratio dépasse 2, la phase de découverte est trop superficielle, empêchant de créer une valeur perçue forte chez le client. Prenez le temps nécessaire pour identifier les besoins réels et les points de douleur du foyer afin de rendre votre offre incontestable. Une écoute plus active augmentera mécaniquement votre taux de transformation et réduira l'effort physique fourni quotidien.`} 
                      />
                      <LeverBlock 
                        title="Levier n°5 : Portes (Accroche)" 
                        ratioName="Ratio Porte / Présent" 
                        value={currentStats.ratios.rPoPres} 
                        target={3.0} 
                        analysis={`L'objectif est d'atteindre ${currentStats.roadmap.portes} Portes. Votre ratio élevé révèle un fort taux d'absence lors de vos passages. Pour optimiser votre énergie, ciblez les moments où les foyers sont présents : privilégiez les fins de journées dès 17h00, le mercredi ou le samedi matin. Une meilleure lecture de vos secteurs réduira l'effort physique inutile tout en garantissant le volume de présentations nécessaires pour atteindre vos 12 BC signés quotidien.`} 
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
        <footer className="text-center py-8 text-[10px] text-slate-400 font-black uppercase tracking-[0.4em] opacity-40 italic text-center">Suggestion Engine • EMconsulting Data Analytics • v60.44 Final Standalone</footer>
      </div>
    </div>
  );
}
