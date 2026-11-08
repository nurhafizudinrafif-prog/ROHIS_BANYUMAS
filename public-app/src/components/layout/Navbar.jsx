import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, ArrowUpRight } from 'lucide-react';
import logo from '../../assets/logo.png';
const primary = [['/', 'Beranda'], ['/about', 'Tentang kami'], ['/programs', 'Program'], ['/berita', 'Berita'], ['/events', 'Agenda']];
const resources = [['/schools','Sekolah anggota'],['/articles','Artikel & opini'],['/library','Perpustakaan'],['/gallery','Galeri kegiatan'],['/consultation','Konsultasi']];
export function Brand() { return <Link className="rk-brand" to="/" aria-label="ROKABA — Beranda"><img src={logo} alt="Logo ROHIS Banyumas"/><span><strong>ROKABA</strong><small>ROHIS Kabupaten Banyumas</small></span></Link>; }
export default function Navbar() {
  const [open,setOpen] = useState(false); const [more,setMore] = useState(false);
  const location = useLocation(); const panel = useRef(null); const toggle = useRef(null); const dropdown = useRef(null);
  useEffect(()=>{setOpen(false);setMore(false);window.scrollTo({top:0,behavior:'instant'});},[location.pathname]);
  useEffect(()=>{ const close = e=>{if(dropdown.current && !dropdown.current.contains(e.target))setMore(false);}; document.addEventListener('pointerdown',close); return ()=>document.removeEventListener('pointerdown',close);},[]);
  useEffect(()=>{
    const old = document.body.style.overflow; if(open) {document.body.style.overflow='hidden'; panel.current?.querySelector('a')?.focus();}
    const key = e=>{if(e.key==='Escape'){setOpen(false);setMore(false);toggle.current?.focus();} if(open && e.key==='Tab'){const items=panel.current.querySelectorAll('a,button');const first=items[0],last=items[items.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}};
    document.addEventListener('keydown',key);return()=>{document.body.style.overflow=old;document.removeEventListener('keydown',key);};
  },[open]);
  const navItem=([path,label])=><Link key={path} to={path} aria-current={location.pathname===path?'page':undefined}>{label}</Link>;
  return <><a className="rk-skip" href="#main-content">Lewati ke konten</a><header className="rk-header"><div className="rk-utility"><div className="rk-wrap"><span>Portal resmi ROHIS Kabupaten Banyumas</span><span>Pelajar bertumbuh, kebaikan berlanjut.</span></div></div><div className="rk-wrap rk-nav"><Brand/><nav className="rk-desktop" aria-label="Navigasi utama">{primary.map(navItem)}<div className="rk-more" ref={dropdown}><button aria-expanded={more} aria-controls="rk-resources" onClick={()=>setMore(!more)}>Jelajahi <ChevronDown size={14}/></button>{more&&<div id="rk-resources" className="rk-dropdown">{resources.map(navItem)}</div>}</div></nav><Link className="rk-contact" to="/contact">Hubungi kami <ArrowUpRight size={16}/></Link><button ref={toggle} className="rk-menu-toggle" aria-label="Buka navigasi" aria-expanded={open} aria-controls="rk-mobile" onClick={()=>setOpen(true)}><Menu/></button></div></header>{open&&<div ref={panel} id="rk-mobile" className="rk-mobile" role="dialog" aria-modal="true" aria-label="Navigasi website"><div className="rk-mobile-top"><Brand/><button onClick={()=>{setOpen(false);toggle.current?.focus();}} aria-label="Tutup navigasi"><X/></button></div><nav>{[...primary,...resources,['/contact','Hubungi kami']].map(navItem)}</nav><p>Terhubung dalam ukhuwah. Bergerak untuk kebaikan.</p></div>}</>;
}
