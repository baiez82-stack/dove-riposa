const standardFeatures = Object.freeze({
  precision: true,
  accessibility: true,
  assist: true,
  live: true
});

export const municipalities = [
  {
    id: 'pescantina',
    name: 'Pescantina',
    province: 'VR',
    status: 'Demo attiva',
    cemeteries: [
      { id: 'cimitero-comunale', name: 'Cimitero comunale' }
    ]
  },
  {
    id: 'povegliano-veronese',
    name: 'Povegliano Veronese',
    province: 'VR',
    status: 'Demo attiva',
    cemeteries: [
      { id: 'cimitero-comunale', name: 'Cimitero comunale' }
    ]
  }
].map(municipality=>({
  ...municipality,
  features: {...standardFeatures}
}));
