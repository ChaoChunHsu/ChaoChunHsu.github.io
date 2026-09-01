/* expandable sections */
(function () {
  var expanders = document.querySelectorAll('[data-expands]');
  Array.prototype.forEach.call(expanders, function (expander) {
    var target = document.getElementById(expander.getAttribute('data-expands'));
    if (!target) return;
    expander.addEventListener('click', function () {
      var expanded = expander.getAttribute('aria-expanded') === 'true';
      expander.setAttribute('aria-expanded', !expanded);
      target.hidden = !target.hidden;
    });
  });
}());

/* mobile menu button */
(function () {
  var button = document.getElementById('menu-button');
  if (!button) return;
  button.addEventListener('click', function () {
    var expanded = this.getAttribute('aria-expanded') === 'true';
    this.setAttribute('aria-expanded', !expanded);
  });
}());

/* "link here" anchors on article section headings */
(function () {
  var headings = document.querySelectorAll('.prose > h2, .prose > h3');

  Array.prototype.forEach.call(headings, function (heading) {
    var id = heading.getAttribute('id');
    if (!id) return;

    var container = document.createElement('div');
    container.setAttribute('class', 'h2-container');

    var link = document.createElement('a');
    link.setAttribute('href', '#' + id);
    link.setAttribute('aria-label', 'Link to the ' + heading.textContent + ' section');
    link.innerHTML = '<svg aria-hidden="true" class="link-icon" viewBox="0 0 50 50" focusable="false"><use xlink:href="#link"></use></svg>';

    heading.parentNode.insertBefore(container, heading);
    container.appendChild(heading);
    container.appendChild(link);
  });
}());

/* wrap wide tables so they scroll instead of blowing out the column */
(function () {
  var tables = document.querySelectorAll('.prose table');
  Array.prototype.forEach.call(tables, function (table) {
    if (table.closest('.table-scroll')) return;
    var wrap = document.createElement('div');
    wrap.className = 'table-scroll';
    table.parentNode.insertBefore(wrap, table);
    wrap.appendChild(table);
  });
}());

/* highlight the current section in the contents rail */
(function () {
  var toc = document.querySelector('.toc');
  if (!toc || !('IntersectionObserver' in window)) return;

  var links = {};
  Array.prototype.forEach.call(toc.querySelectorAll('a[href^="#"]'), function (a) {
    links[decodeURIComponent(a.getAttribute('href').slice(1))] = a;
  });

  var targets = Object.keys(links)
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);
  if (!targets.length) return;

  var visible = {};
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      visible[entry.target.id] = entry.isIntersecting;
    });
    var current = targets.filter(function (t) { return visible[t.id]; })[0];
    if (!current) return;
    Object.keys(links).forEach(function (id) {
      links[id].removeAttribute('aria-current');
    });
    if (links[current.id]) links[current.id].setAttribute('aria-current', 'true');
  }, { rootMargin: '-10% 0px -70% 0px' });

  targets.forEach(function (t) { observer.observe(t); });
}());

/* keyboard-scrollable code samples */
(function () {
  var codeBlocks = document.querySelectorAll('pre, .code-annotated, .table-scroll');
  Array.prototype.forEach.call(codeBlocks, function (block) {
    if (block.scrollWidth > block.clientWidth) {
      block.setAttribute('role', 'region');
      block.setAttribute('tabindex', '0');
      if (!block.getAttribute('aria-label')) {
        block.setAttribute('aria-label', block.tagName === 'PRE' ? 'code sample' : 'table');
      }
    }
  });
}());

/* switch and persist theme */
(function () {
  var checkbox = document.getElementById('themer');
  var inverter = document.getElementById('inverter');
  if (!checkbox || !inverter) return;

  if (!CSS.supports('filter', 'invert(100%)')) {
    checkbox.parentNode.hidden = true;
    return;
  }

  function darkTheme (media) {
    inverter.setAttribute('media', media);
    inverter.textContent = inverter.textContent.trim();
    try { localStorage.setItem('darkTheme', media); } catch (e) {}
  }

  checkbox.addEventListener('change', function () {
    darkTheme(this.checked ? 'screen' : 'none');
  });

  try {
    if (localStorage.getItem('darkTheme') === 'screen') checkbox.click();
  } catch (e) {}
}());
