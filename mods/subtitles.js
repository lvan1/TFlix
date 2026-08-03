function subtitleLabel(track, index) {
  return track.label || track.language || `Subtitle ${index + 1}`;
}

export function getSubtitleOptions(video) {
  const tracks = video && video.textTracks ? Array.from(video.textTracks) : [];
  return tracks
    .filter(track => !track.kind || track.kind === 'subtitles' || track.kind === 'captions')
    .map((track, index) => ({ track, label: subtitleLabel(track, index) }));
}

export function applySubtitleOption(options, selectedIndex) {
  options.forEach((option, index) => {
    option.track.mode = index === selectedIndex ? 'showing' : 'disabled';
  });
}

export function createSubtitleController(video, container, notify) {
  const button = document.createElement('button');
  button.className = 'tflix-control-button tflix-subtitle-button';
  button.type = 'button';
  button.textContent = 'CC';
  button.setAttribute('aria-label', 'Subtitles');

  const menu = document.createElement('div');
  menu.className = 'tflix-subtitle-menu';
  menu.setAttribute('role', 'menu');

  let options = [];
  let selectedIndex = -1;
  let open = false;

  function render() {
    menu.textContent = '';
    const labels = ['Off', ...options.map(option => option.label)];
    labels.forEach((label, menuIndex) => {
      const item = document.createElement('button');
      item.type = 'button';
      item.className = 'tflix-subtitle-option';
      if (menuIndex === selectedIndex + 1) item.classList.add('selected');
      item.textContent = label;
      item.addEventListener('click', () => choose(menuIndex - 1));
      menu.appendChild(item);
    });
  }

  function refreshOptions() {
    options = getSubtitleOptions(video);
    const showing = options.findIndex(option => option.track.mode === 'showing');
    selectedIndex = showing >= 0 ? showing : -1;
  }

  function openMenu() {
    refreshOptions();
    if (!options.length) {
      notify('No subtitles are available for this video');
      return false;
    }
    open = true;
    menu.classList.add('show');
    button.classList.add('active');
    render();
    notify('Subtitles: use Up/Down, then press Enter');
    return true;
  }

  function closeMenu() {
    open = false;
    menu.classList.remove('show');
    button.classList.remove('active');
  }

  function choose(index) {
    selectedIndex = index;
    applySubtitleOption(options, index);
    notify(index < 0 ? 'Subtitles off' : `Subtitles: ${options[index].label}`);
    closeMenu();
  }

  function move(delta) {
    const itemCount = options.length + 1;
    const currentMenuIndex = selectedIndex + 1;
    const nextMenuIndex = (currentMenuIndex + delta + itemCount) % itemCount;
    selectedIndex = nextMenuIndex - 1;
    render();
  }

  function handleKey(event) {
    if (!open) {
      if (event.key !== 'ArrowDown') return false;
      return openMenu();
    }

    if (event.key === 'ArrowUp') move(-1);
    else if (event.key === 'ArrowDown') move(1);
    else if (event.key === 'Enter') choose(selectedIndex);
    else if (event.key === 'Escape' || event.key === 'Backspace' || event.keyCode === 10009) closeMenu();
    else return false;
    return true;
  }

  button.addEventListener('click', () => open ? closeMenu() : openMenu());
  container.appendChild(menu);

  return { button, menu, handleKey, openMenu, closeMenu };
}
