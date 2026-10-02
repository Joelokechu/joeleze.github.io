(() => {
  "use strict";

  const labels = {
    data_analysis: "Data analysis",
    web_development: "Web development",
    free_consultation: "Free consultation"
  };

  const config = () => window.IBJ_TICKET_CONFIG || {};

  const ready = () =>
    /^https:\/\/[a-z0-9.-]+$/.test(
      config().supabaseUrl || ""
    ) && !!config().publishableKey;

  async function call(name, body) {
    if (!ready()) {
      throw new Error(
        "Ticket tracking is unavailable. Please contact Joel by email."
      );
    }

    const response = await fetch(
      `${config().supabaseUrl}/functions/v1/${name}`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          apikey: config().publishableKey
        },

        body: JSON.stringify(body)
      }
    );

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(
        data.error ||
        "Unable to complete the request. Please try again."
      );
    }

    return data;
  }

  const token = () =>
    Array.from(
      crypto.getRandomValues(new Uint8Array(32)),
      (byte) => byte.toString(16).padStart(2, "0")
    ).join("");

  function attachForm(form, sendEmail) {
    if (!form) return;

    const status = document.getElementById("consult-status");
    const receipt = document.getElementById("ticket-receipt");
    const submit = form.querySelector('button[type="submit"]');

    let pending = null;
    let lastSubmittedAt = 0;

    function show(message, error = false) {
      status.textContent = message;

      status.className =
        `form-status ${error ? "error" : "success"}`;
    }

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      if (
        submit.disabled ||
        !form.reportValidity() ||
        form.elements.namedItem("website").value
      ) {
        return;
      }

      if (Date.now() - lastSubmittedAt < 15000) {
        show(
          "Please wait a few seconds before sending another request.",
          true
        );

        return;
      }

      const fields = {
        name: form.elements.namedItem("name").value.trim(),

        email: form.elements.namedItem("email").value.trim(),

        phone: form.elements.namedItem("phone").value.trim(),

        service: form.elements.namedItem("service").value,

        message: form.elements.namedItem("message").value.trim(),

        website: ""
      };

      if (!fields.name || !fields.message) {
        show(
          "Please enter your name and a description of what you need.",
          true
        );

        return;
      }

      const fingerprint = JSON.stringify(fields);

      if (
        !pending ||
        pending.fingerprint !== fingerprint
      ) {
        pending = {
          fingerprint,
          request_key: crypto.randomUUID(),
          token: token()
        };
      }

      submit.disabled = true;
      receipt.classList.add("hidden");

      show(
        ready()
          ? "Saving your request…"
          : "Sending your enquiry…"
      );

      try {
        if (!ready()) {
          const message = [
            labels[fields.service] + " request",
            fields.phone ? "Phone: " + fields.phone : "",
            fields.message
          ]
            .filter(Boolean)
            .join("\n");

          await sendEmail({
            from_name: fields.name,
            from_email: fields.email,
            message
          });

          lastSubmittedAt = Date.now();

          show(
            "Thank you. Your enquiry has been emailed to Joel, who will reply by email."
          );

          form.reset();
          pending = null;

          return;
        }

        const data = await call("ibj-create-ticket", {
          ...fields,
          request_key: pending.request_key,
          token: pending.token
        });

        const url = new URL(
          "request-status.html",
          location.href
        );

        url.hash = new URLSearchParams({
          ref: data.reference,
          token: pending.token
        }).toString();

        receipt.replaceChildren();

        const heading = document.createElement("h3");

        heading.textContent =
          `Request saved: ${data.reference}`;

        const service = document.createElement("p");
        service.textContent = labels[fields.service];

        const message = document.createElement("p");

        message.textContent =
          data.customer_email === "accepted"
            ? "Your confirmation email has been submitted for delivery. Keep the private tracking link below."
            : "Keep your private tracking link below. Your ticket is saved, but a confirmation email could not be sent.";

        const link = document.createElement("a");
        link.href = url.href;
        link.textContent = "Track your request";

        receipt.append(
          heading,
          service,
          message,
          link
        );

        receipt.classList.remove("hidden");

        lastSubmittedAt = Date.now();

        show(
          "Thank you. Joel will review your request and get in touch."
        );

        form.reset();
        pending = null;
      } catch (error) {
        show(error.message, true);
      } finally {
        submit.disabled = false;
      }
    });
  }

  async function loadStatus() {
    const result = document.getElementById("ticket-result");

    if (!result) return;

    const params = new URLSearchParams(
      location.hash.slice(1)
    );

    const reference = params.get("ref");
    const secret = params.get("token");

    if (!reference || !secret) {
      result.textContent =
        "Open the private tracking link from your confirmation to view your request.";

      return;
    }

    try {
      const ticket = await call("ibj-ticket-status", {
        reference,
        token: secret
      });

      result.replaceChildren();

      const details = [
        ["Reference", ticket.reference],

        ["Service", labels[ticket.service]],

        ["Status", ticket.status],

        [
          "Last updated",
          new Date(ticket.updated_at).toLocaleString("en-GB")
        ],

        [
          "Update from Joel",
          ticket.public_update ||
          "Your request is awaiting review."
        ]
      ];

      for (const [label, value] of details) {
        const row = document.createElement("p");
        row.className = "ticket-notes";

        const title = document.createElement("strong");
        title.textContent = `${label}: `;

        row.append(
          title,
          document.createTextNode(value)
        );

        result.append(row);
      }
    } catch (error) {
      result.textContent = error.message;
    }
  }

  window.IBJTickets = {
    attachForm,
    call,
    ready,
    labels
  };

  document.addEventListener("DOMContentLoaded", () => {
    loadStatus();

    document
      .getElementById("refresh-status")
      ?.addEventListener("click", loadStatus);
  });
})();
