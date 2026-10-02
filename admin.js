(async () => {
  'use strict';
  const $ = id => document.getElementById(id);
  const say = (text, error = false) => {
    const target = $('ticket-manager').hidden ? $('login-message') : $('admin-message');
    target.textContent = text; target.dataset.error = String(error);
  };
  if (!window.IBJTickets?.ready() || !window.supabase) {
    say('The ticket system is unavailable. Please try again later.', true); return;
  }
  const {supabaseUrl, publishableKey} = window.IBJ_TICKET_CONFIG;
  const db = window.supabase.createClient(supabaseUrl, publishableKey);
  const statuses = ['New', 'Contacted', 'In Progress', 'Completed', 'Closed'];
  let offset = 0, generation = 0;
  const node = (tag, text, className) => {
    const el = document.createElement(tag);
    if (text !== undefined) el.textContent = text;
    if (className) el.className = className;
    return el;
  };
  const badgeClass = status => status.toLowerCase().replaceAll(' ', '-');
  async function totals() {
    const queries = [null, 'New', 'In Progress', 'Completed'].map(status => {
      let q = db.from('ibj_requests').select('id', {count: 'exact', head: true});
      return status ? q.eq('status', status) : q;
    });
    const results = await Promise.all(queries);
    ['stat-total', 'stat-new', 'stat-progress', 'stat-completed'].forEach((id, i) => {
      $(id).textContent = results[i].error ? '—' : String(results[i].count ?? 0);
    });
  }
  function field(title, value, tag = 'textarea', hint = '') {
    const label = node('label'); label.append(node('span', title));
    const input = node(tag); input.value = value || ''; label.append(input);
    if (hint) label.append(node('span', hint, 'hint'));
    return [label, input];
  }
  function card(ticket) {
    const box = node('article', undefined, 'request-card');
    const top = node('div', undefined, 'request-top'), identity = node('div');
    identity.append(node('p', ticket.reference, 'reference'), node('h3', ticket.name),
      node('p', `${window.IBJTickets.labels[ticket.service]} · ${new Date(ticket.created_at).toLocaleString('en-GB')}`, 'request-meta'));
    const badge = node('span', ticket.status, `badge ${badgeClass(ticket.status)}`);
    top.append(identity, badge);
    const contact = node('div', undefined, 'contact-line');
    const email = node('a', ticket.email); email.href = 'mailto:' + ticket.email; contact.append(email);
    if (ticket.phone) {
      const phone = node('a', ticket.phone); phone.href = 'tel:' + ticket.phone.replace(/[^+\d]/g, ''); contact.append(phone);
    }
    const delivery = node('div', undefined, 'delivery');
    for (const [label, value] of [['Customer email', ticket.customer_email], ['Your notification', ticket.owner_email]]) {
      const text = value === 'accepted' ? 'Submitted' : value === 'failed' ? 'Failed' : 'Not sent';
      delivery.append(node('span', `${label}: ${text}`, value === 'accepted' ? 'accepted' : 'failed'));
    }
    const details = node('details'), summary = node('summary', 'Manage request'); details.append(summary);
    const grid = node('div', undefined, 'edit-grid');
    const [sw, select] = field('Request status', ticket.status, 'select');
    statuses.forEach(status => {const option = node('option', status); option.value = status; select.append(option);});
    select.value = ticket.status;
    const [pw, publicUpdate] = field('Update for your client', ticket.public_update, 'textarea', 'Visible on the private tracking page.'); publicUpdate.maxLength = 2000;
    const [nw, notes] = field('Private notes', ticket.admin_notes, 'textarea', 'Only visible to authorised administrators.'); notes.maxLength = 10000;
    grid.append(sw, pw, nw);
    const actions = node('div', undefined, 'actions');
    const save = node('button', 'Save changes', 'primary'), remove = node('button', 'Delete request', 'danger');
    save.type = remove.type = 'button';
    save.onclick = async () => {
      save.disabled = remove.disabled = true; save.textContent = 'Saving…';
      try {
        const {data, error} = await db.from('ibj_requests').update({status: select.value, public_update: publicUpdate.value, admin_notes: notes.value})
          .eq('id', ticket.id).eq('updated_at', ticket.updated_at).select('updated_at').single();
        if (error) throw error;
        ticket.updated_at = data.updated_at; ticket.status = select.value;
        badge.textContent = ticket.status; badge.className = `badge ${badgeClass(ticket.status)}`;
        say(`${ticket.reference} updated.`); await totals();
      } catch {say('Could not save. Refresh requests before trying again.', true);}
      finally {save.disabled = remove.disabled = false; save.textContent = 'Save changes';}
    };
    remove.onclick = async () => {
      if (!confirm(`Permanently delete ${ticket.reference}? Its tracking link will stop working.`)) return;
      save.disabled = remove.disabled = true;
      try {
        const {data, error} = await db.from('ibj_requests').delete().eq('id', ticket.id).select('id').single();
        if (error || !data) throw Error();
        await load(); say(`${ticket.reference} deleted.`);
      } catch {say('Could not delete this request.', true);}
      finally {save.disabled = remove.disabled = false;}
    };
    actions.append(save, remove); details.append(grid, actions);
    box.append(top, contact, node('p', ticket.message, 'request-text'), delivery, details);
    return box;
  }
  async function load(append = false) {
    const run = ++generation;
    if (!append) offset = 0;
    $('more-tickets').disabled = $('reload-tickets').disabled = true;
    let query = db.from('ibj_requests').select('*').order('created_at', {ascending: false}).range(offset, offset + 49);
    if ($('filter-service').value) query = query.eq('service', $('filter-service').value);
    if ($('filter-status').value) query = query.eq('status', $('filter-status').value);
    try {
      const {data, error} = await query;
      if (run !== generation) return;
      if (error) throw error;
      if (!append) $('ticket-list').replaceChildren();
      if (!data.length && !append) $('ticket-list').append(node('p', 'No requests match these filters.', 'empty-state'));
      data.forEach(ticket => $('ticket-list').append(card(ticket)));
      offset += data.length; $('more-tickets').hidden = data.length < 50;
      await totals();
    } catch {if (run === generation) say('Unable to load requests. Refresh or sign in again.', true);}
    finally {if (run === generation) $('more-tickets').disabled = $('reload-tickets').disabled = false;}
  }
  async function showSession(session) {
    if (session) {
      const {data, error} = await db.from('ibj_admin_users').select('user_id').eq('user_id', session.user.id).maybeSingle();
      if (error || !data) {
        await db.auth.signOut(); await showSession(null);
        say('This account does not have permission to manage requests.', true); return;
      }
    }
    $('login-screen').hidden = !!session; $('ticket-manager').hidden = !session;
    $('signed-in-email').textContent = session?.user.email || '';
    $('login-message').textContent = $('admin-message').textContent = '';
    if (session) await load(); else {generation++; $('ticket-list').replaceChildren();}
  }
  $('ticket-login').onsubmit = async event => {
    event.preventDefault(); const form = event.currentTarget, button = form.querySelector('button[type="submit"]');
    button.disabled = true; say('Signing in…');
    try {
      const {data, error} = await db.auth.signInWithPassword({email: form.elements.namedItem('email').value.trim(), password: form.elements.namedItem('password').value});
      if (error) throw error;
      form.elements.namedItem('password').value = ''; await showSession(data.session);
    } catch {say('Sign in failed. Check your email and password.', true);}
    finally {button.disabled = false;}
  };
  $('logout-tickets').onclick = async () => {
    const {error} = await db.auth.signOut();
    if (error) {say('Could not sign out. Please try again.', true); return;}
    await showSession(null); say('You have signed out.');
  };
  $('reload-tickets').onclick = () => load(); $('more-tickets').onclick = () => load(true);
  for (const id of ['filter-service', 'filter-status']) $(id).onchange = () => load();
  const {data, error} = await db.auth.getSession();
  if (error) say('Unable to restore your session. Please sign in.', true);
  else await showSession(data.session);
})();
