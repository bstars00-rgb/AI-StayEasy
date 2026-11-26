/*
 * Builds the company profile (A4, 4 pages) in the five site languages.
 *
 *   node scripts/brochure/build.cjs <outDir>      -> one .pptx per language
 *   powershell -File scripts/brochure/export-pdf.ps1 -Dir <outDir> -Out public/brochure
 *
 * Needs packages that are not app dependencies: pptxgenjs, react-icons, sharp
 * (install them outside the repo and point NODE_PATH there). PDF export uses PowerPoint.
 * Figures come from figures.json; a test keeps it equal to the hotel catalogue.
 */
const { createRequire } = require('module')
const fa = require('react-icons/fa')
// react must be the copy react-icons itself resolves, or server rendering sees two Reacts
const iconRequire = createRequire(require.resolve('react-icons/fa'))
const React = iconRequire('react')
const { renderToStaticMarkup } = iconRequire('react-dom/server')
const sharp = require('sharp')
const pptxgen = require('pptxgenjs')
const figures = require('./figures.json')
const content = require('./content.json')

const OUTDIR = process.argv[2]
if (!OUTDIR) throw new Error('usage: node build.cjs <outDir>')

const SITE = 'https://bstars00-rgb.github.io/AI-StayEasy/'
const INK = '10231C', DEEP = '0B5D45', GREEN = '12A072', MINT = 'CFE8DD', PALE = 'EAF4EF', ORANGE = 'F26B3A', GRAY = '5E6B66', WHITE = 'FFFFFF'
const L = 0.55, W = 7.17

const icon = async (name, color) => {
  const Cmp = fa[name]
  if (!Cmp) throw new Error('no icon ' + name)
  const svg = renderToStaticMarkup(React.createElement(Cmp, { color: '#' + color, size: '256' }))
  return 'image/png;base64,' + (await sharp(Buffer.from(svg)).png().toBuffer()).toString('base64')
}

async function build(lang) {
  const t = content[lang]
  const pres = new pptxgen()
  pres.defineLayout({ name: 'A4P', width: 8.27, height: 11.69 })
  pres.layout = 'A4P'
  pres.theme = { headFontFace: t.font, bodyFontFace: t.font }
  pres.title = 'StayEasy ' + t.kind
  pres.author = 'StayEasy'
  const sz = (n) => Math.round(n * t.scale * 2) / 2

  const kit = (s) => ({
    text: (v, o) => s.addText(v, { isTextBox: true, margin: 0, valign: 'top', lang: t.locale, color: INK, ...o, fontSize: sz(o.fontSize) }),
    box: (x, y, w, h, color, name, r = 0.1) => s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: r, fill: { color }, line: { type: 'none' }, objectName: name }),
    rect: (x, y, w, h, color, name) => s.addShape(pres.shapes.RECTANGLE, { x, y, w, h, fill: { color }, line: { type: 'none' }, objectName: name }),
    disc: (cx, cy, d, color, name) => s.addShape(pres.shapes.OVAL, { x: cx - d / 2, y: cy - d / 2, w: d, h: d, fill: { color }, line: { type: 'none' }, objectName: name }),
    async badge(name, cx, cy, d, fill, label) {
      s.addShape(pres.shapes.OVAL, { x: cx - d / 2, y: cy - d / 2, w: d, h: d, fill: { color: fill }, line: { type: 'none' }, objectName: label + ' disc' })
      s.addImage({ data: await icon(name, WHITE), x: cx - d * 0.27, y: cy - d * 0.27, w: d * 0.54, h: d * 0.54, objectName: label + ' icon', altText: label })
    },
  })
  const logo = (k, x, y, size, dark) =>
    k.text([{ text: 'stay', options: { color: dark ? WHITE : INK } }, { text: 'easy', options: { color: GREEN } }, { text: '.', options: { color: ORANGE } }], { x, y, w: 3, h: size / 52, fontSize: size, bold: true, valign: 'middle', objectName: 'Logo' })
  const inner = (title, lead, page) => {
    const s = pres.addSlide()
    const k = kit(s)
    k.rect(0, 0, 8.27, 2.0, INK, 'Header band')
    logo(k, L, 0.28, 15, true)
    k.text(title, { x: L, y: 0.78, w: W, h: 0.55, fontSize: 24, bold: true, color: WHITE, valign: 'middle', objectName: 'Page title' })
    k.text(lead, { x: L, y: 1.38, w: W, h: 0.5, fontSize: 11, color: MINT, objectName: 'Page lead' })
    k.text('StayEasy ' + t.kind, { x: L, y: 11.28, w: 4, h: 0.2, fontSize: 8, color: GRAY, objectName: 'Footer' })
    k.text(String(page), { x: 7.22, y: 11.28, w: 0.5, h: 0.2, fontSize: 8, color: GRAY, align: 'right', objectName: 'Page number' })
    return { s, k }
  }
  const heading = (k, v, y) => k.text(v, { x: L, y, w: W, h: 0.32, fontSize: 15, bold: true, color: DEEP, objectName: 'Section ' + v })

  // ---- 1. cover -------------------------------------------------------------------------------------
  {
    const s = pres.addSlide()
    const k = kit(s)
    k.rect(0, 0, 8.27, 11.69, INK, 'Cover background')
    s.addShape(pres.shapes.OVAL, { x: 4.7, y: -1.6, w: 5.2, h: 5.2, fill: { color: GREEN, transparency: 82 }, line: { type: 'none' }, objectName: 'Cover circle' })
    s.addShape(pres.shapes.OVAL, { x: -1.7, y: 8.7, w: 4.2, h: 4.2, fill: { color: ORANGE, transparency: 86 }, line: { type: 'none' }, objectName: 'Cover circle low' })
    logo(k, L, 0.6, 30, true)
    k.text(t.kind, { x: L, y: 2.75, w: W, h: 0.35, fontSize: 14, bold: true, color: GREEN, objectName: 'Cover kind' })
    k.text(t.headline, { x: L, y: 3.25, w: W, h: 1.9, fontSize: 36, bold: true, color: WHITE, objectName: 'Cover headline' })
    k.text(t.sub, { x: L, y: 5.35, w: W, h: 0.4, fontSize: 14, color: MINT, objectName: 'Cover sub' })
    // The offer is open to hotels across the country, so no catalogue size is printed anywhere.
    const stats = [[t.stats.scope, t.stats.scopeLabel, 26], ['0', t.stats.fee, 38], [figures.languages, t.stats.languages, 38]]
    stats.forEach(([n, label, size], i) => {
      const x = L + i * 2.43
      k.box(x, 7.1, 2.31, 1.35, '1B3A2F', 'Cover stat ' + (i + 1), 0.12)
      k.text(String(n), { x, y: 7.2, w: 2.31, h: 0.72, fontSize: size, bold: true, color: WHITE, align: 'center', valign: 'middle', objectName: 'Cover stat number ' + (i + 1) })
      k.text(label, { x: x + 0.08, y: 7.96, w: 2.15, h: 0.35, fontSize: 11, color: MINT, align: 'center', objectName: 'Cover stat label ' + (i + 1) })
    })
    k.text(SITE, { x: L, y: 10.65, w: 5.4, h: 0.25, fontSize: 10, color: MINT, objectName: 'Cover site' })
    k.text('2026.11', { x: 6.22, y: 10.65, w: 1.5, h: 0.25, fontSize: 10, color: MINT, align: 'right', objectName: 'Cover date' })
  }

  // ---- 2. what we do -------------------------------------------------------------------------------------
  {
    const { k } = inner(t.what.title, t.what.lead, 2)
    heading(k, t.what.principlesHead, 2.3)
    const icons = ['FaCheckCircle', 'FaHotel', 'FaHandHoldingUsd']
    for (let i = 0; i < 3; i++) {
      const [head, body] = t.what.principles[i]
      const y = 2.76 + i * 1.28
      k.box(L, y, W, 1.14, PALE, 'Principle ' + (i + 1))
      await k.badge(icons[i], L + 0.55, y + 0.57, 0.62, GREEN, 'Principle ' + (i + 1))
      k.text(head, { x: L + 1.1, y: y + 0.14, w: 5.85, h: 0.3, fontSize: 13, bold: true, objectName: 'Principle head ' + (i + 1) })
      k.text(body, { x: L + 1.1, y: y + 0.5, w: 5.85, h: 0.58, fontSize: 10.5, color: GRAY, objectName: 'Principle body ' + (i + 1) })
    }
    heading(k, t.what.citiesHead, 6.85)
    figures.cities.forEach((c, i) => {
      const x = L + (i % 5) * 1.4425
      const y = 7.34 + Math.floor(i / 5) * 0.85
      k.box(x, y, 1.4, 0.75, PALE, 'City ' + (i + 1))
      k.text(c.name[lang], { x: x + 0.06, y, w: 1.28, h: 0.75, fontSize: 11, bold: true, align: 'center', valign: 'middle', objectName: 'City name ' + (i + 1) })
    })
    k.box(L, 9.1, W, 0.65, DEEP, 'More cities')
    k.text(t.what.moreCities, { x: L, y: 9.1, w: W, h: 0.65, fontSize: 13, bold: true, color: WHITE, align: 'center', valign: 'middle', objectName: 'More cities text' })
    k.text(t.what.citiesNote, { x: L, y: 9.98, w: W, h: 0.7, fontSize: 10.5, color: GRAY, objectName: 'City note' })
  }

  // ---- 3. travellers -------------------------------------------------------------------------------------
  {
    const { s, k } = inner(t.traveller.title, t.traveller.lead, 3)
    heading(k, t.traveller.stepsHead, 2.3)
    const icons = ['FaSearchLocation', 'FaBalanceScale', 'FaGlobeAsia']
    for (let i = 0; i < 3; i++) {
      const [head, body] = t.traveller.steps[i]
      const x = L + i * 2.43
      k.box(x, 2.76, 2.31, 2.3, PALE, 'Traveller step ' + (i + 1))
      await k.badge(icons[i], x + 1.155, 3.25, 0.62, DEEP, 'Traveller step ' + (i + 1))
      k.text(head, { x: x + 0.1, y: 3.68, w: 2.11, h: 0.3, fontSize: 12.5, bold: true, align: 'center', objectName: 'Traveller head ' + (i + 1) })
      k.text(body, { x: x + 0.14, y: 4.05, w: 2.03, h: 0.95, fontSize: 10, color: GRAY, align: 'center', objectName: 'Traveller body ' + (i + 1) })
    }
    const m = t.traveller.member
    k.box(L, 5.45, W, 5.35, MINT, 'Member panel', 0.15)
    k.box(L + 0.25, 5.68, 1.5, 0.34, ORANGE, 'Soon tag', 0.1)
    k.text(t.soon, { x: L + 0.25, y: 5.68, w: 1.5, h: 0.34, fontSize: 10, bold: true, color: WHITE, align: 'center', valign: 'middle', objectName: 'Soon text' })
    k.text(m.head, { x: L + 0.25, y: 6.16, w: 6.65, h: 0.36, fontSize: 16, bold: true, color: INK, objectName: 'Member head' })
    k.text(m.body, { x: L + 0.25, y: 6.62, w: 6.65, h: 0.75, fontSize: 10.5, objectName: 'Member body' })
    m.flow.forEach((v, i) => {
      const y = 7.55 + i * 0.66
      k.box(L + 0.25, y, 3.6, 0.54, WHITE, 'Flow ' + (i + 1))
      k.disc(L + 0.58, y + 0.27, 0.32, DEEP, 'Flow disc ' + (i + 1))
      k.text(String(i + 1), { x: L + 0.42, y: y + 0.11, w: 0.32, h: 0.32, fontSize: 10.5, bold: true, color: WHITE, align: 'center', valign: 'middle', objectName: 'Flow number ' + (i + 1) })
      k.text(v, { x: L + 0.88, y, w: 2.9, h: 0.54, fontSize: 10.5, bold: true, valign: 'middle', objectName: 'Flow text ' + (i + 1) })
    })
    // a drawn sample voucher (not a screenshot, and no real hotel)
    const vx = 4.75, vw = 2.65
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: vx, y: 7.55, w: vw, h: 2.52, rectRadius: 0.2, fill: { color: WHITE }, line: { color: INK, width: 3 }, objectName: 'Voucher sample' })
    k.text(m.voucher.label, { x: vx + 0.1, y: 7.72, w: vw - 0.2, h: 0.24, fontSize: 9, color: GRAY, align: 'center', objectName: 'Voucher label' })
    k.text(m.voucher.hotel, { x: vx + 0.1, y: 8.04, w: vw - 0.2, h: 0.3, fontSize: 12.5, bold: true, align: 'center', objectName: 'Voucher hotel' })
    k.text(m.voucher.perk, { x: vx + 0.1, y: 8.4, w: vw - 0.2, h: 0.3, fontSize: 11, bold: true, color: DEEP, align: 'center', objectName: 'Voucher perk' })
    k.box(vx + 0.6, 8.82, vw - 1.2, 0.32, PALE, 'Voucher status', 0.14)
    k.text(m.voucher.status, { x: vx + 0.6, y: 8.82, w: vw - 1.2, h: 0.32, fontSize: 9.5, bold: true, color: DEEP, align: 'center', valign: 'middle', objectName: 'Voucher status text' })
    k.box(vx + 0.25, 9.35, vw - 0.5, 0.44, INK, 'Voucher button', 0.18)
    k.text(m.voucher.button, { x: vx + 0.25, y: 9.35, w: vw - 0.5, h: 0.44, fontSize: 10, bold: true, color: WHITE, align: 'center', valign: 'middle', objectName: 'Voucher button text' })
    k.text(m.note, { x: L + 0.25, y: 10.36, w: 6.65, h: 0.3, fontSize: 9.5, color: DEEP, bold: true, objectName: 'Member note' })
  }

  // ---- 4. hotels -------------------------------------------------------------------------------------
  {
    const { k } = inner(t.hotel.title, t.hotel.lead, 4)
    heading(k, t.hotel.gainsHead, 2.3)
    const icons = ['FaConciergeBell', 'FaUsers', 'FaLanguage', 'FaHandHoldingUsd']
    for (let i = 0; i < 4; i++) {
      const [head, body] = t.hotel.gains[i]
      const x = L + (i % 2) * 3.65
      const y = 2.76 + Math.floor(i / 2) * 1.72
      k.box(x, y, 3.52, 1.58, PALE, 'Hotel gain ' + (i + 1))
      await k.badge(icons[i], x + 0.5, y + 0.46, 0.52, GREEN, 'Hotel gain ' + (i + 1))
      k.text(head, { x: x + 0.9, y: y + 0.22, w: 2.5, h: 0.5, fontSize: 12, bold: true, valign: 'middle', objectName: 'Gain head ' + (i + 1) })
      k.text(body, { x: x + 0.2, y: y + 0.84, w: 3.15, h: 0.68, fontSize: 10, color: GRAY, objectName: 'Gain body ' + (i + 1) })
    }
    const p = t.hotel.partner
    k.box(L, 6.4, W, 2.95, MINT, 'Partner panel', 0.15)
    k.box(L + 0.25, 6.62, 1.5, 0.34, ORANGE, 'Partner soon tag', 0.1)
    k.text(t.soon, { x: L + 0.25, y: 6.62, w: 1.5, h: 0.34, fontSize: 10, bold: true, color: WHITE, align: 'center', valign: 'middle', objectName: 'Partner soon text' })
    k.text(p.head, { x: L + 0.25, y: 7.1, w: 6.65, h: 0.36, fontSize: 16, bold: true, objectName: 'Partner head' })
    k.text(p.points.map((v, i) => ({ text: v, options: { bullet: { indent: 12 }, breakLine: i < p.points.length - 1, paraSpaceAfter: 11, lang: t.locale } })), { x: L + 0.25, y: 7.62, w: 6.65, h: 1.65, fontSize: 11.5, objectName: 'Partner points' })
    k.box(L, 9.6, W, 1.3, INK, 'Contact band', 0.12)
    k.text(t.hotel.closing, { x: L + 0.25, y: 9.78, w: 6.65, h: 0.4, fontSize: 15, bold: true, color: WHITE, objectName: 'Closing' })
    k.text(t.hotel.visit, { x: L + 0.25, y: 10.24, w: 6.65, h: 0.25, fontSize: 10, color: MINT, objectName: 'Visit label' })
    k.text([{ text: SITE, options: { hyperlink: { url: SITE }, color: WHITE } }], { x: L + 0.25, y: 10.52, w: 6.65, h: 0.28, fontSize: 11, bold: true, objectName: 'Site link' })
  }

  const out = `${OUTDIR}/stayeasy-company-profile-${lang}.pptx`
  await pres.writeFile({ fileName: out })
  console.log('wrote', out)
}

;(async () => {
  for (const lang of Object.keys(content)) await build(lang)
})().catch((e) => {
  console.error(e)
  process.exit(1)
})
