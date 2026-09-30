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
      {
        id: 'cimitero-comunale',
        name: 'Cimitero comunale',
        geo: { lat: 45.4810, lng: 10.8575, status: 'demo' }
      }
    ]
  },
  {
    id: 'povegliano-veronese',
    name: 'Povegliano Veronese',
    province: 'VR',
    status: 'Demo attiva',
    cemeteries: [
      {
        id: 'cimitero-comunale',
        name: 'Cimitero comunale',
        geo: null
      }
    ]
  }
].map(municipality=>({
  ...municipality,
  features: {...standardFeatures}
}));
