import Link from 'next/link';
import BrandLockup from '../../components/BrandLockup';
import { login } from './actions';

const messages={
  invalid:'Email o password non corretti.',
  missing:'Inserisci email e password.',
  'not-authorized':'L’account è valido ma non è abilitato per questo ente.'
};

export default async function AdminLogin({searchParams}){
  const params=await searchParams;
  const message=messages[params?.error]||'';

  return <main className="admin-login">
    <form className="admin-login-card" action={login}>
      <div className="admin-login-brand"><BrandLockup subtitle="Area riservata"/></div>
      <h1>Accesso operatori</h1>
      <p>Dove Riposa · ambiente demo multi-ente</p>
      {message&&<div className="login-error">{message}</div>}
      <label>Email<input name="email" type="email" autoComplete="username" required placeholder="nome@comune.it"/></label>
      <label>Password<input name="password" type="password" autoComplete="current-password" required placeholder="••••••••"/></label>
      <button className="primary" type="submit">Accedi</button>
      <small className="login-note">Accesso riservato a utenti nominativi autorizzati. Nessun PIN condiviso.</small>
      <Link href="/">← Torna al sito pubblico</Link>
    </form>
  </main>;
}
