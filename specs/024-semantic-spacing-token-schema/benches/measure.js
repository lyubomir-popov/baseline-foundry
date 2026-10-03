const number = value => parseFloat(value) || 0;
const px = value => `${value.toFixed(3)}px`;
function measure() {
  for (const box of document.querySelectorAll('.specimen')) {
    const sample = box.querySelector('.sample');
    const origin = sample.getBoundingClientRect();
    const rows = [];
    for (const element of sample.querySelectorAll('[data-measure]')) {
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      const occupied = rect.height + number(style.marginTop) + number(style.marginBottom);
      rows.push(`${element.dataset.measure}: x ${px(rect.left - origin.left)} · box ${px(rect.width)} × ${px(rect.height)} · occupied ${px(occupied)} · padding T/R/B/L ${[style.paddingTop, style.paddingRight, style.paddingBottom, style.paddingLeft].join('/')}`);
    }
    const markers = [...sample.querySelectorAll('.baseline')].map(el => el.getBoundingClientRect().bottom - origin.top);
    if (markers.length) rows.push(`Baseline spread: ${px(Math.max(...markers) - Math.min(...markers))}`);
    const title = sample.querySelector('.title-copy');
    const continuation = sample.querySelector('.continuation');
    if (title && continuation) rows.push(`Continuation keyline error: ${px(continuation.getBoundingClientRect().left + number(getComputedStyle(continuation).paddingLeft) - title.getBoundingClientRect().left)}`);
    const sections = [...sample.querySelectorAll('.seams > section')];
    for (let i = 1; i < sections.length; i++) rows.push(`Section ${i}→${i + 1} content seam: ${px(sections[i].getBoundingClientRect().top + number(getComputedStyle(sections[i]).paddingTop) - sections[i - 1].getBoundingClientRect().bottom + number(getComputedStyle(sections[i - 1]).paddingBottom))}`);
    box.querySelector('output').textContent = rows.join('\n');
  }
}
document.addEventListener('input', () => requestAnimationFrame(measure));
document.addEventListener('keydown', event => {
  if (event.target.matches('input, select, textarea') || event.ctrlKey || event.metaKey || event.altKey) return;
  const id = { b: 'current', p: 'proposed', s: 'tier-site', d: 'tier-docs', a: 'tier-app' }[event.key.toLowerCase()];
  const input = document.getElementById(id);
  if (input) { input.checked = true; requestAnimationFrame(measure); }
});
new ResizeObserver(measure).observe(document.querySelector('main'));
document.fonts.ready.then(measure);
measure();
