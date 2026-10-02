(async () => {
  const $ = (id) => document.getElementById(id);
  const message = $("admin-message");

  if (!window.IBJTickets.ready() || !window.supabase) {
    message.textContent =
      "The ticket system needs to be connected before you can sign in.";
    return;
  }

  const {
    supabaseUrl,
    publishableKey
  } = window.IBJ_TICKET_CONFIG;

  const db = window.supabase.createClient(
    supabaseUrl,
    publishableKey
  );

  let offset = 0;

  const statuses = [
    "New",
    "Contacted",
    "In Progress",
    "Completed",
    "Closed"
  ];

  const say = (text) => {
    message.textContent = text;
  };

  function field(label, value, tag = "textarea") {
    const wrapper = document.createElement("label");
    wrapper.append(document.createTextNode(label));

    const input = document.createElement(tag);
    input.value = value || "";

    wrapper.append(input);

    return [wrapper, input];
  }

  function card(ticket) {
    const box = document.createElement("article");
    box.className = "ticket-box";

    const heading = document.createElement("h2");
    heading.textContent = ticket.reference;

    const info = document.createElement("p");
    info.className = "ticket-notes";

    info.textContent =
      `${window.IBJTickets.labels[ticket.service]} · ` +
      `${new Date(ticket.created_at).toLocaleString("en-GB")}\n` +
      `${ticket.name} · ${ticket.email}` +
      `${ticket.phone ? " · " + ticket.phone : ""}\n\n` +
      ticket.message;

    const delivery = document.createElement("p");
    delivery.className = "ticket-meta";

    delivery.textContent =
      `Confirmation email: ${ticket.customer_email} · ` +
      `Owner notification: ${ticket.owner_email}`;

    const [statusWrapper, select] = field(
      "Status",
      ticket.status,
      "select"
    );

    statuses.forEach((status) => {
      const option = document.createElement("option");

      option.value = status;
      option.textContent = status;

      select.append(option);
    });

    select.value = ticket.status;

    const [publicWrapper, publicUpdate] = field(
      "Update visible to customer",
      ticket.public_update
    );

    publicUpdate.maxLength = 2000;

    const [notesWrapper, notes] = field(
      "Private notes",
      ticket.admin_notes
    );

    notes.maxLength = 10000;

    const buttons = document.createElement("div");
    buttons.className = "ticket-tools";

    const save = document.createElement("button");
    save.textContent = "Save changes";

    const remove = document.createElement("button");
    remove.textContent = "Delete request";

    save.onclick = async () => {
      save.disabled = true;

      try {
        const { data, error } = await db
          .from("ibj_requests")
          .update({
            status: select.value,
            public_update: publicUpdate.value,
            admin_notes: notes.value
          })
          .eq("id", ticket.id)
          .eq("updated_at", ticket.updated_at)
          .select("updated_at")
          .single();

        if (error) throw error;

        ticket.updated_at = data.updated_at;

        say(`${ticket.reference} updated.`);
      } catch {
        say(
          "Could not save. Refresh requests before trying again."
        );
      } finally {
        save.disabled = false;
      }
    };

    remove.onclick = async () => {
      const confirmed = confirm(
        `Permanently delete ${ticket.reference}? ` +
        "Its tracking link will stop working."
      );

      if (!confirmed) return;

      remove.disabled = true;

      try {
        const { data, error } = await db
          .from("ibj_requests")
          .delete()
          .eq("id", ticket.id)
          .select("id")
          .single();

        if (error || !data) {
          throw new Error("Deletion failed");
        }

        box.remove();

        say(`${ticket.reference} deleted.`);
      } catch {
        say("Could not delete this request.");
      } finally {
        remove.disabled = false;
      }
    };

    buttons.append(save, remove);

    box.append(
      heading,
      info,
      delivery,
      statusWrapper,
      publicWrapper,
      notesWrapper,
      buttons
    );

    return box;
  }

  async function load(append = false) {
    if (!append) offset = 0;

    $("more-tickets").disabled = true;

    let query = db
      .from("ibj_requests")
      .select("*")
      .order("created_at", { ascending: false })
      .range(offset, offset + 49);

    if ($("filter-service").value) {
      query = query.eq(
        "service",
        $("filter-service").value
      );
    }

    if ($("filter-status").value) {
      query = query.eq(
        "status",
        $("filter-status").value
      );
    }

    const { data, error } = await query;

    if (error) {
      say("Unable to load requests. Please sign in again.");
      $("more-tickets").disabled = false;
      return;
    }

    if (!append) {
      $("ticket-list").replaceChildren();
    }

    if (!data.length && !append) {
      $("ticket-list").textContent =
        "No requests match these filters.";
    }

    data.forEach((ticket) => {
      $("ticket-list").append(card(ticket));
    });

    offset += data.length;

    $("more-tickets").classList.toggle(
      "hidden",
      data.length < 50
    );

    $("more-tickets").disabled = false;
  }

  async function session(currentSession) {
    if (currentSession) {
      const { data, error } = await db
        .from("ibj_admin_users")
        .select("user_id")
        .eq("user_id", currentSession.user.id)
        .maybeSingle();

      if (error || !data) {
        say(
          "This account does not have permission to manage requests."
        );

        $("ticket-manager").classList.add("hidden");
        return;
      }
    }

    $("ticket-login").classList.toggle(
      "hidden",
      !!currentSession
    );

    $("ticket-manager").classList.toggle(
      "hidden",
      !currentSession
    );

    if (currentSession) {
      say("Signed in.");
      await load();
    } else {
      $("ticket-list").replaceChildren();
    }
  }

  $("ticket-login").onsubmit = async (event) => {
    event.preventDefault();

    const button = event.target.querySelector("button");
    button.disabled = true;

    const { data, error } = await db.auth.signInWithPassword({
      email: event.target.email.value,
      password: event.target.password.value
    });

    button.disabled = false;

    if (error) {
      say("Sign in failed. Check your email and password.");
      return;
    }

    event.target.password.value = "";

    await session(data.session);
  };

  $("logout-tickets").onclick = async () => {
    await db.auth.signOut();
    await session(null);

    say("Signed out.");
  };

  $("reload-tickets").onclick = () => load();

  $("more-tickets").onclick = () => load(true);

  for (const id of ["filter-service", "filter-status"]) {
    $(id).onchange = () => load();
  }

  const { data } = await db.auth.getSession();

  await session(data.session);
})();
