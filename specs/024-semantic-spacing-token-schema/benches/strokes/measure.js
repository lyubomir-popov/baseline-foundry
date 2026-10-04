const number = value => Number.parseFloat(value) || 0;
const px = value => `${value.toFixed(6)}px`;

function geometry(element) {
  const rect = element.getBoundingClientRect();
  const style = getComputedStyle(element);
  return {
    width: rect.width,
    height: rect.height,
    occupied: rect.height + number(style.marginTop) + number(style.marginBottom),
    border: [style.borderTopWidth, style.borderRightWidth, style.borderBottomWidth, style.borderLeftWidth],
    padding: [style.paddingTop, style.paddingRight, style.paddingBottom, style.paddingLeft],
    boxShadow: style.boxShadow,
    outline: `${style.outlineWidth} ${style.outlineStyle} / ${style.outlineOffset}`,
    direction: style.direction,
  };
}

function measure() {
  document.querySelector('.dpr').textContent = `Live devicePixelRatio: ${window.devicePixelRatio}`;
  for (const specimen of document.querySelectorAll('.specimen')) {
    const rows = [];
    for (const element of specimen.querySelectorAll('[data-measure]')) {
      const value = geometry(element);
      rows.push(`${element.dataset.measure}: ${px(value.width)} × ${px(value.height)} · occupied ${px(value.occupied)} · border ${value.border.join('/')} · padding ${value.padding.join('/')} · shadow ${value.boxShadow} · outline ${value.outline} · direction ${value.direction}`);
    }
    if (specimen.id === 'dense-nesting') {
      const hosts = [...specimen.querySelectorAll('tr')].map(row => row.getBoundingClientRect().height);
      rows.push(`Host height delta: ${px(hosts[1] - hosts[0])}`);
    }
    if (specimen.id === 'clearance') {
      rows.push('Opaque full-bleed child: inset stroke is computed but visually occluded; use an independent paint owner.');
    }
    specimen.querySelector('output').textContent = rows.join('\n');
  }
}

document.addEventListener('input', () => requestAnimationFrame(measure));
document.addEventListener('focusin', () => requestAnimationFrame(measure));
document.addEventListener('focusout', () => requestAnimationFrame(measure));
new ResizeObserver(measure).observe(document.querySelector('main'));
document.fonts.ready.then(measure);
measure();
