import React, { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

function readableActions(children) {
  const text = value => React.Children.toArray(value).some(child => typeof child === 'string' ? child.trim().length > 0 : React.isValidElement(child) && child.type !== 'svg' && text(child.props.children));
  return React.Children.map(children, child => {
    if (!React.isValidElement(child) || child.type === 'svg') return child;
    const isAction = child.type === 'button' || child.type === 'a' || child.props.onClick;
    const label = child.props.title || child.props['aria-label'];
    const content = readableActions(child.props.children);
    return React.cloneElement(child, isAction ? { role: 'menuitem' } : {}, <>{content}{isAction && label && !text(child.props.children) && <span>{label}</span>}</>);
  });
}

export function rowNavigation(event, open) {
  if (event.target.closest('button, a, input, select, textarea, summary, [role="menu"], [data-row-action]')) return;
  if (event.type === 'keydown' && (event.key !== 'Enter' || event.target !== event.currentTarget)) return;
  if (event.type === 'keydown') event.preventDefault();
  open();
}

export default function RowActions({ children, label = 'Row actions' }) {
  const [position, setPosition] = useState(null);
  const trigger = useRef(null);
  const menu = useRef(null);
  const id = useId();
  useEffect(() => {
    if (!position) return;
    const dismiss = event => {
      if (!menu.current?.contains(event.target) && !trigger.current?.contains(event.target)) setPosition(null);
    };
    const escape = event => {
      if (event.key === 'Escape') { event.stopPropagation(); setPosition(null); trigger.current?.focus(); }
    };
    const reposition = () => setPosition(null);
    document.addEventListener('pointerdown', dismiss);
    document.addEventListener('keydown', escape);
    window.addEventListener('resize', reposition);
    window.addEventListener('scroll', reposition, true);
    menu.current?.querySelector('button:not(:disabled), a[href]')?.focus();
    return () => {
      document.removeEventListener('pointerdown', dismiss);
      document.removeEventListener('keydown', escape);
      window.removeEventListener('resize', reposition);
      window.removeEventListener('scroll', reposition, true);
    };
  }, [position]);
  return <span data-row-action="true" onClick={event => event.stopPropagation()} onKeyDown={event => event.stopPropagation()}>
    <button ref={trigger} type="button" aria-label={label} aria-haspopup="menu" aria-expanded={!!position} aria-controls={position ? id : undefined}
      className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-amber-50 hover:text-amber-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
      onClick={() => {
        if (position) { setPosition(null); return; }
        const rect = trigger.current.getBoundingClientRect();
        setPosition({ top: Math.min(rect.bottom + 4, Math.max(8, window.innerHeight - 250)), left: Math.max(8, Math.min(rect.right - 220, window.innerWidth - 228)) });
      }}><svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><circle cx="12" cy="5" r="1.75" /><circle cx="12" cy="12" r="1.75" /><circle cx="12" cy="19" r="1.75" /></svg></button>
    {position && createPortal(<div ref={menu} id={id} role="menu" aria-label={label} data-row-action="true"
      className="fixed z-[12000] w-[220px] max-h-[240px] overflow-y-auto rounded-xl border border-slate-200 bg-white p-2 shadow-xl text-left [&_button]:!w-full [&_button]:!justify-start [&_button]:!text-left [&_button]:!whitespace-normal [&_button]:!h-auto [&_button]:!min-h-8 [&_button]:!px-3 [&_button]:!py-2 [&_button]:!text-xs [&_button]:!rounded-lg [&_a]:!block [&_a]:!px-3 [&_a]:!py-2"
      style={position} onKeyDown={event => {
        event.stopPropagation();
        if (event.key === 'Escape') { setPosition(null); trigger.current?.focus(); }
        if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
          event.preventDefault();
          const items = [...event.currentTarget.querySelectorAll('button:not(:disabled), a[href]')];
          const current = items.indexOf(document.activeElement);
          const next = event.key === 'Home' ? 0 : event.key === 'End' ? items.length - 1 : (current + (event.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length;
          items[next]?.focus();
        }
      }} onClick={event => { event.stopPropagation(); if (event.target.closest('button, a')) setPosition(null); }}>
      <div className="flex flex-col gap-1 [&_button]:gap-2 [&>div]:!flex [&>div]:!flex-col [&>div]:!gap-1">{readableActions(children)}</div>
    </div>, document.body)}
  </span>;
}
