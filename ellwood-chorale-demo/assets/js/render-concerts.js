(function () {
  const concerts = Array.isArray(window.choraleConcerts) ? window.choraleConcerts : [];

  function eventDate(concert) {
    return new Date(concert.time ? `${concert.date}T${concert.time}:00` : `${concert.date}T23:59:59`);
  }

  function formatDate(concert) {
    const [year, month, day] = concert.date.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    const dateText = new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }).format(date);
    if (!concert.time) return `${dateText} · Time not published`;
    const timeDate = new Date(`${concert.date}T${concert.time}:00`);
    const timeText = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' }).format(timeDate);
    return `${dateText} · ${timeText}`;
  }

  // hard-coding the date for the time being
  const today = new Date("2026-05-13");
  function isPast(concert) { return eventDate(concert).getTime() < today /* Date.now() */; }

  function createConcertCard(concert) {
    const article = document.createElement('article');
    article.className = 'card event-card concert-list-item';
    if (isPast(concert)) article.classList.add('past-event');
    if (concert.closed) article.classList.add('closed-event');
    const status = isPast(concert) ? 'Past performance' : (concert.audience || 'Upcoming performance');
    article.innerHTML = `
      <div class="concert-date-block">
        <span>${formatDate(concert)}</span>
        <span class="event-status">${status}</span>
      </div>
      <div>
        <h3>${concert.title}</h3>
        <p class="event-meta">${concert.location}${concert.address ? '<br>' + concert.address : ''}</p>
        <p>${concert.description || ''}</p>
      </div>`;
    return article;
  }

  function renderConcertList() {
    const list = document.querySelector('[data-concert-list]');
    if (!list) return;
    list.innerHTML = '';
    concerts.slice().sort((a, b) => eventDate(a) - eventDate(b)).forEach(c => list.appendChild(createConcertCard(c)));
  }

  function renderNextConcert() {
    const target = document.querySelector('[data-next-concert]');
    if (!target) return;
    const nextConcert = concerts.filter(c => !isPast(c)).sort((a, b) => eventDate(a) - eventDate(b))[0];
    if (!nextConcert) {
      target.innerHTML = '<h3>Upcoming Concerts</h3><p>New concert dates will be posted as they are announced.</p><p><a href="concerts.html">View concerts</a></p>';
      return;
    }
    target.innerHTML = `<h3>Next Performance</h3><p class="event-meta">${formatDate(nextConcert)}</p><p><strong>${nextConcert.title}</strong></p><p>${nextConcert.location}${nextConcert.address ? '<br>' + nextConcert.address : ''}</p><p>${nextConcert.description || ''}</p><p><a href="concerts.html">View all concerts</a></p>`;
  }

  renderNextConcert();
  renderConcertList();
})();
