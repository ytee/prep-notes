(() => {
  const $ = selector => document.querySelector(selector);
  let updateScheduled = false;

  function activeModuleId() {
    return $('#moduleSelect')?.value || new URLSearchParams(location.hash.replace(/^#/, '')).get('module');
  }

  function setTextIfChanged(element, nextText) {
    if (element && element.textContent !== nextText) {
      element.textContent = nextText;
    }
  }

  function applyDomainLabels() {
    const activeModule = activeModuleId();
    const aerospace = activeModule === 'aerospace';
    const semiconductor = activeModule === 'semiconductor';
    const exampleLabel = $('#conceptDetail .concept-example .eyebrow');
    const label = aerospace ? 'AEROSPACE EXAMPLE' : semiconductor ? 'SILICON EXAMPLE' : 'AUTOMOTIVE EXAMPLE';
    setTextIfChanged(exampleLabel, label);

    if (aerospace) {
      $('#conceptDetail')?.querySelectorAll('.concept-tags span, .concept-references p').forEach(element => {
        if (!element.textContent.includes('Part ')) return;
        setTextIfChanged(element, element.textContent.replace(/\bPart\s+/g, ''));
      });
    }
  }

  function scheduleDomainLabels() {
    if (updateScheduled) return;
    updateScheduled = true;
    requestAnimationFrame(() => {
      updateScheduled = false;
      applyDomainLabels();
    });
  }

  function appendScript(source, onload = null) {
    if (!document.createElement || !document.body?.append) return;
    const existing = document.querySelector(`script[src="${source}"]`);
    if (existing) {
      if (onload) {
        if (existing.dataset.loaded === 'true') onload();
        else existing.addEventListener('load', onload, { once: true });
      }
      return;
    }
    const script = document.createElement('script');
    script.src = source;
    script.async = false;
    script.onload = () => {
      script.dataset.loaded = 'true';
      onload?.();
    };
    script.onerror = () => console.error(`Cannot load ${source}`);
    document.body.append(script);
  }

  function loadExtensions() {
    appendScript('assets/comparison-bootstrap.js');
    appendScript('assets/firmware-deep-dive-model.js', () => {
      appendScript('assets/firmware-deep-dive.js');
    });
  }

  const detail = $('#conceptDetail');
  if (detail) {
    new MutationObserver(scheduleDomainLabels).observe(detail, { childList: true, subtree: true });
  }
  $('#moduleSelect')?.addEventListener('change', scheduleDomainLabels);
  applyDomainLabels();
  loadExtensions();
})();
