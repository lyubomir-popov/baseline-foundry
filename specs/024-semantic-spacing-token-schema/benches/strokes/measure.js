const number = value => Number.parseFloat(value) || 0;
const px = value => `${value.toFixed(3)}px`;

function measure() {
  document.querySelector('.dpr').textContent = `Live devicePixelRatio: ${window.devicePixelRatio}`;
  for (const lane of document.querySelectorAll('.tier-lane')) {
    const rows = [];
    for (const element of lane.querySelectorAll('[data-measure]')) {
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      const occupied = rect.height + number(style.marginTop) + number(style.marginBottom);
      rows.push(`${element.dataset.measure}: ${px(rect.width)} × ${px(rect.height)} · occupied ${px(occupied)} · border ${style.borderTopWidth}/${style.borderBottomWidth} · padding ${style.paddingTop}/${style.paddingBottom} · shadow ${style.boxShadow}`);
    }
    lane.querySelector('.measurements').textContent = rows.join('\n');
  }
}

document.addEventListener('input', () => requestAnimationFrame(measure));
document.addEventListener('focusin', () => requestAnimationFrame(measure));
document.addEventListener('focusout', () => requestAnimationFrame(measure));
new ResizeObserver(measure).observe(document.querySelector('main'));
document.fonts.ready.then(measure);
measure();
