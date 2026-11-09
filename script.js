(() => {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      nav.classList.toggle('open', !expanded);
      toggle.setAttribute('aria-label', expanded ? 'Відкрити меню' : 'Закрити меню');
    });
  }

  const series = {
    'gdp-chart': { title: 'gdp-title', label: 'Річна зміна реального ВВП України, відсотків', min: -35, max: 10, color: '#4b899a', values: [
      ['14',-6.6],['15',-9.8],['16',2.4],['17',2.4],['18',3.5],['19',3.2],['20',-3.8],['21',3.4],['22',-28.8],['23',5.5],['24',3.2],['25',1.8],['26*',1.0]
    ]},
    'cpi-chart': { title: 'cpi-title', label: 'Середньорічна інфляція в Україні, відсотків', min: 0, max: 55, color: '#d9a83f', values: [
      ['14',12.1],['15',48.7],['16',13.9],['17',14.4],['18',10.9],['19',7.9],['20',2.7],['21',9.4],['22',20.2],['23',12.9],['24',6.5],['25',12.7],['26*',8.9]
    ]}
  };

  function chartMarkup(config) {
    const w = 520, h = 220, left = 38, right = 10, top = 16, bottom = 31;
    const plotW = w - left - right, plotH = h - top - bottom;
    const y = value => top + (config.max - value) / (config.max - config.min) * plotH;
    const x = index => left + index * plotW / (config.values.length - 1);
    const ticks = config.id === 'gdp-chart' ? [-30,-20,-10,0,10] : [0,10,20,30,40,50];
    const grids = ticks.map(t => `<line x1="${left}" y1="${y(t)}" x2="${w-right}" y2="${y(t)}" stroke="${t===0 && config.id==='gdp-chart' ? '#87969a' : '#e5e9e7'}" stroke-width="${t===0 && config.id==='gdp-chart' ? 1.4 : 1}"/><text x="${left-7}" y="${y(t)+3}" text-anchor="end">${t}</text>`).join('');
    const points = config.values.map((d,i)=>`${x(i)},${y(d[1])}`).join(' ');
    const bars = config.values.map((d,i)=>{
      const zero=y(0), py=y(d[1]), bw=18, by=Math.min(zero,py), bh=Math.max(2,Math.abs(py-zero));
      const forecast=i===config.values.length-1;
      const fill=forecast?'#bd675b':config.color;
      const label=`${d[0]==='26*'?'2026 прогноз':'20'+d[0]}: ${d[1]>0?'+':''}${d[1]} відсотка`;
      return `<rect x="${x(i)-bw/2}" y="${by}" width="${bw}" height="${bh}" rx="2" fill="${fill}" opacity="${forecast?'.82':'.88'}"><title>${label}</title></rect><text x="${x(i)}" y="${h-8}" text-anchor="middle">${d[0]}</text>`;
    }).join('');
    const invasionX=x(8);
    return `<svg viewBox="0 0 ${w} ${h}" role="img" aria-labelledby="${config.title}"><title id="${config.title}">${config.label}</title>${grids}<line x1="${invasionX}" y1="${top}" x2="${invasionX}" y2="${h-bottom}" stroke="#bd675b" stroke-width="1.5" stroke-dasharray="4 4"/><text x="${invasionX+4}" y="${top+8}" fill="#bd675b">2022</text>${bars}<polyline points="${points}" fill="none" stroke="${config.color}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round" opacity=".72"/>${config.values.map((d,i)=>`<circle cx="${x(i)}" cy="${y(d[1])}" r="3.3" fill="${i===config.values.length-1?'#bd675b':config.color}"/>`).join('')}</svg>`;
  }
  Object.entries(series).forEach(([id, config]) => {
    const el=document.getElementById(id);
    if(el) el.innerHTML=chartMarkup({...config,id});
  });
})();

