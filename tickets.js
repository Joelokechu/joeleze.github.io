(() => {
  'use strict';
  if (!document.querySelector('link[href="tickets.css"]')) {
    const css = document.createElement('link'); css.rel = 'stylesheet'; css.href = 'tickets.css'; document.head.append(css);
  }
  const labels = { data_analysis: 'Data analysis', web_development: 'Web development', free_consultation: 'Free consultation' };
  const config = () => window.IBJ_TICKET_CONFIG || {};
  const ready = () => /^https:\/\/[a-z0-9.-]+$/.test(config().supabaseUrl || '') && !!config().publishableKey;
  async function call(name, body) {
    if (!ready()) throw new Error('Ticket tracking is unavailable. Please contact Joel by email.');
    const response = await fetch(`${config().supabaseUrl}/functions/v1/${name}`, {method:'POST',headers:{'Content-Type':'application/json',apikey:config().publishableKey},body:JSON.stringify(body)});
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || 'Unable to complete the request. Please try again.');
    return data;
  }
  const token = () => Array.from(crypto.getRandomValues(new Uint8Array(32)), b => b.toString(16).padStart(2,'0')).join('');
  function attachForm(form, sendEmail) {
    if (!form) return;
    const status = document.getElementById('consult-status'), receipt = document.getElementById('ticket-receipt');
    const submit = form.querySelector('button[type=submit]');
    let pending = null;
    let lastSubmittedAt = 0;
    function show(message, error=false) {status.textContent=message;status.className=`form-status ${error?'error':'success'}`;}
    form.addEventListener('submit', async event => {
      event.preventDefault();
      if (submit.disabled || !form.reportValidity() || form.elements.namedItem('website').value) return;
      if(Date.now()-lastSubmittedAt<15000) {show('Please wait a few seconds before sending another request.',true);return;}
      const fields = {name:form.elements.namedItem('name').value.trim(),email:form.elements.namedItem('email').value.trim(),phone:form.elements.namedItem('phone').value.trim(),service:form.elements.namedItem('service').value,message:form.elements.namedItem('message').value.trim(),website:''};
      if (!fields.name || !fields.message) {show('Please enter your name and a description of what you need.',true);return;}
      const fingerprint = JSON.stringify(fields);
      if (!pending || pending.fingerprint!==fingerprint) pending={fingerprint,request_key:crypto.randomUUID(),token:token()};
      submit.disabled=true;receipt.classList.add('hidden');show(ready() ? 'Saving your request…' : 'Sending your enquiry…');
      try {
        if (!ready()) {
          const message = [labels[fields.service] + ' request', fields.phone ? 'Phone: '+fields.phone : '', fields.message].filter(Boolean).join('\n');
          await sendEmail({from_name:fields.name,from_email:fields.email,message});
          lastSubmittedAt=Date.now();
          show('Thank you. Your enquiry has been emailed to Joel, who will reply by email.');
          form.reset();pending=null;return;
        }
        const data = await call('ibj-create-ticket',{...fields,request_key:pending.request_key,token:pending.token});
        const url = new URL('request-status.html',location.href);
        url.hash=new URLSearchParams({ref:data.reference,token:pending.token}).toString();
        receipt.replaceChildren();receipt.className='receipt-card';
        const head=document.createElement('header');head.className='receipt-head';
        const kicker=document.createElement('p');kicker.className='receipt-kicker';kicker.textContent='Your project, one step closer';
        const logo=document.createElement('img');logo.src='logo.png';logo.alt='Insights by Joel logo';logo.className='receipt-logo';logo.width=84;logo.height=84;
        const heading=document.createElement('h3');heading.textContent='Thank you for your request.';head.append(logo,kicker,heading);
        const content=document.createElement('div');content.className='receipt-body';
        const ref=document.createElement('p');ref.className='receipt-reference';ref.textContent=data.reference;
        const summary=document.createElement('dl');
        for(const [label,value] of [['Service',labels[fields.service]],['Status','New'],['Name',fields.name],['Email',fields.email]]) {
          const pair=document.createElement('div'),dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=label;dd.textContent=value;pair.append(dt,dd);summary.append(pair);
        }
        const detailLabel=document.createElement('span');detailLabel.className='receipt-label';detailLabel.textContent='Your request';
        const details=document.createElement('p');details.className='receipt-details';details.textContent=fields.message;
        const message=document.createElement('p');message.textContent=data.customer_email==='accepted'?'Your confirmation email has been submitted for delivery. Joel will review your request and get in touch.':'Your request is saved. A confirmation email could not be sent; keep your tracking link below.';
        const link=document.createElement('a');link.className='receipt-button';link.href=url.href;link.textContent='View your request →';
        const note=document.createElement('p');note.className='receipt-footnote';note.textContent='Keep this private link to check your status and read updates from Joel.';
        content.append(ref,summary,detailLabel,details,message,link,note);receipt.append(head,content);
        lastSubmittedAt=Date.now();
        show('Thank you. Joel will review your request and get in touch.');form.reset();pending=null;
      } catch(error) {show(error.message,true);} finally {submit.disabled=false;}
    });
  }
  async function loadStatus() {
    const result=document.getElementById('ticket-result');if(!result)return;
    const refresh=document.getElementById('refresh-status');if(refresh)refresh.disabled=true;
    const params=new URLSearchParams(location.hash.slice(1));
    const reference=params.get('ref'),secret=params.get('token');
    if (!reference || !secret) {result.textContent='Open the private tracking link from your confirmation to view your request.';if(refresh)refresh.disabled=false;return;}
    try {
      const ticket=await call('ibj-ticket-status',{reference,token:secret});result.replaceChildren();result.className='';
      const ref=document.createElement('p');ref.className='receipt-reference';ref.textContent=ticket.reference;
      const summary=document.createElement('dl');
      for(const [label,value] of [['Service',labels[ticket.service]],['Status',ticket.status],['Last updated',new Date(ticket.updated_at).toLocaleString('en-GB')]]) {
        const pair=document.createElement('div'),dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=label;dd.textContent=value;if(label==='Status')dd.className='receipt-status';pair.append(dt,dd);summary.append(pair);
      }
      const label=document.createElement('span');label.className='receipt-label';label.textContent='Update from Joel';
      const update=document.createElement('p');update.className='receipt-update';
      update.textContent=ticket.public_update || (ticket.status==='New'?'Your request has been received and is awaiting review.':'No additional update has been added yet.');
      result.append(ref,summary,label,update);

    } catch(error){result.className='receipt-error';result.textContent=error.message;} finally {if(refresh)refresh.disabled=false;}
  }
  window.IBJTickets={attachForm,call,ready,labels};
  document.addEventListener('DOMContentLoaded',()=>{loadStatus();document.getElementById('refresh-status')?.addEventListener('click',loadStatus);});
})();
