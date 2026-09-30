export const precisionConfigs = {
  'povegliano-veronese': {
    municipalityName: 'Povegliano Veronese',
    municipalityLabel: 'Comune di Povegliano Veronese',
    cemeteryId: 'cimitero-comunale',
    cemeteryName: 'Cimitero comunale',
    markers: {
      ingresso: { id:'ingresso', code:'DR-PV-ING', label:'Ingresso principale', x:520, y:635 },
      centro: { id:'centro', code:'DR-PV-CEN', label:'Incrocio centrale', x:555, y:445 },
      est: { id:'est', code:'DR-PV-EST', label:'Porticato est', x:635, y:365 },
      ovest: { id:'ovest', code:'DR-PV-OVEST', label:'Area ovest', x:405, y:445 }
    }
  },
  pescantina: {
    municipalityName: 'Pescantina',
    municipalityLabel: 'Comune di Pescantina',
    cemeteryId: 'cimitero-comunale',
    cemeteryName: 'Cimitero comunale',
    markers: {
      ingresso: { id:'ingresso', code:'DR-PC-ING', label:'Ingresso principale', x:360, y:470 },
      centro: { id:'centro', code:'DR-PC-CEN', label:'Nodo centrale', x:360, y:385 },
      testata: { id:'testata', code:'DR-PC-TES', label:'Testata centrale', x:360, y:105 }
    }
  }
};

export function getPrecisionConfig(municipalityId){
  return precisionConfigs[municipalityId] || precisionConfigs['povegliano-veronese'];
}

export function markerList(municipalityId){
  return Object.values(getPrecisionConfig(municipalityId).markers);
}
