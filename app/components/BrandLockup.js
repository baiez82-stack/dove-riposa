import Image from 'next/image';

export default function BrandLockup({subtitle='', compact=false, inverse=false}){
  return <span className={`brand-lockup ${compact?'compact':''} ${inverse?'inverse':''}`}>
    <Image
      src="/brand/dove-riposa-mark.svg"
      alt=""
      width={compact?42:48}
      height={compact?42:48}
      className="brand-logo-mark"
      priority
    />
    <span className="brand-lockup-copy">
      <strong>Dove Riposa</strong>
      {subtitle && <small>{subtitle}</small>}
    </span>
  </span>
}