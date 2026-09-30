# Quickstart: Tabs item no-shrink QA

```powershell
npm run build
npm run test:build
npm run test:behavior
npm test
npm run qa:components
```

Open `/demo/components/tabs.html` for each tier. At about 390px the six-tab
"Project sections" list must scroll horizontally with every label whole and no
tab overlapping its neighbour. Focus a tab, press End then Home: the selected
tab scrolls into view and keeps its thick bar on the list rule. At desktop
width both specimens must look as they did on `main`.
