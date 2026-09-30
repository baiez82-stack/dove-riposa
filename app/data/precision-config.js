export const precisionConfig = {
  'pescantina': {
    municipalityName: 'Pescantina',
    province: 'VR',
    cemeteries: {
      'cimitero-comunale': {
        name: 'Cimitero comunale',
        markers: {
          ingresso: {id:'ingresso',code:'DR-PC-ING',label:'Ingresso principale',x:360,y:470},
          centro: {id:'centro',code:'DR-PC-CEN',label:'Nodo centrale',x:360,y:385},
          testata: {id:'testata',code:'DR-PC-TES',label:'Testata centrale',x:360,y:105}
        }
      }
    }
  },
  'povegliano-veronese': {
    municipalityName: 'Povegliano Veronese',
    province: 'VR',
    cemeteries: {
      'cimitero-comunale': {
        name: 'Cimitero comunale',
        markers: {
          ingresso: {id:'ingresso',code:'DR-PV-ING',label:'Ingresso principale',x:520,y:635},
          centro: {id:'centro',code:'DR-PV-CEN',label:'Incrocio centrale',x:555,y:445},
          est: {id:'est',code:'DR-PV-EST',label:'Porticato est',x:635,y:365},
          ovest: {id:'ovest',code:'DR-PV-OVEST',label:'Area ovest',x:405,y:445}
        }
      }
    }
  }
};

export function getPrecisionMarkers(municipalityId,cemeteryId='cimitero-comunale'){
  return precisionConfig[municipalityId]?.cemeteries?.[cemeteryId]?.markers || {};
}

export function getPrecisionMarkerList(municipalityId,cemeteryId='cimitero-comunale'){
  return Object.values(getPrecisionMarkers(municipalityId,cemeteryId));
}
