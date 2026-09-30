export default function manifest(){
  return {
    name:'Dove Riposa',
    short_name:'Dove Riposa',
    description:'Ricerca e navigazione cimiteriale digitale, semplice e accessibile.',
    start_url:'/povegliano-veronese',
    display:'standalone',
    background_color:'#F8F6F1',
    theme_color:'#2F3E3E',
    lang:'it',
    icons:[
      {
        src:'/brand/dove-riposa-mark.svg',
        sizes:'any',
        type:'image/svg+xml',
        purpose:'any maskable'
      }
    ]
  };
}
