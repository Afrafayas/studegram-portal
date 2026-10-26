import { getDisplayId } from '../utils/displayId';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../api/axios';

export default function RegistrationStatus({ onNavigate }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => {
    const url = new URL(window.location.href);
    const token = url.searchParams.get('registrationToken') || localStorage.getItem('registration_status_token');
    if (url.searchParams.has('registrationToken')) {
      localStorage.setItem('registration_status_token', token);
      url.searchParams.delete('registrationToken');
      window.history.replaceState({}, '', url.pathname + url.search + url.hash);
    }
    let active = true;
    const refresh = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL.replace(/\/$/, '')}/partners/registration-status`, { headers: { Authorization: `Bearer ${token}` } });
        if (active) { setData(res.data.data); setError(''); }
      } catch (err) { if (active) setError(err.response?.data?.message || 'Unable to load registration status.'); }
    };
    refresh();
    const timer = setInterval(refresh, 30000);
    return () => { active = false; clearInterval(timer); };
  }, []);
  return <main className="min-h-screen bg-slate-100 p-6"><div className="max-w-2xl mx-auto bg-white rounded-2xl p-6 space-y-5">
    <h1 className="text-2xl font-bold">Your agency registration</h1>
    {error && <p role="alert" className="text-red-700">{error}</p>}
    {!data && !error && <p>Loading registration…</p>}
    {data && <>
      <p className="font-semibold">{data.companyName} · {data.status}</p>
      <p className="text-sm text-slate-600">If documents are requested, reply to the request email with your files attached. Your handling staff member will attach them to your registration for review.</p>
      {data.documentRequests?.map(request => <article key={request._id} className="border rounded-xl p-4 space-y-2">
        <h2 className="font-bold">{request.documents.join(', ')}</h2>
        <p className="text-sm whitespace-pre-wrap">{request.message}</p>
        <p className="text-sm">{request.status === 'Received' ? 'Documents received for review' : 'Waiting for your email reply'}</p>
        {request.replyTo?.length > 0 && <a className="text-blue-700 underline text-sm" href={`mailto:${request.replyTo.map(encodeURIComponent).join(',')}?subject=${encodeURIComponent(`Registration documents - ${data.companyName} (${getDisplayId(data)})`)}`}>Email handling staff and super admins</a>}
      </article>)}
      <h2 className="font-bold">Notifications</h2>
      {data.notifications.map(notification => <article key={notification._id} className="border-b py-3"><h3 className="font-semibold">{notification.title}</h3><p className="text-sm">{notification.message}</p><time className="text-xs text-slate-500">{new Date(notification.createdAt).toLocaleString()}</time></article>)}
    </>}
    <button onClick={() => onNavigate('login')} className="text-blue-700 underline">Go to login</button>
  </div></main>;
}
