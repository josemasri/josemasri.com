// Lo único que necesita JS: el selector de tema y que el trace termine en la fecha de hoy.
// Sin este archivo la página se ve y funciona igual (tema del sistema, eje hasta la fecha del build).

(function () {
  var root = document.documentElement;

  // Tema: alterna entre claro y oscuro y lo recuerda. Por defecto sigue al sistema.
  var btn = document.getElementById('theme');
  if (btn) {
    btn.addEventListener('click', function () {
      var current = root.dataset.theme ||
        (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      var next = current === 'dark' ? 'light' : 'dark';
      var apply = function () { root.dataset.theme = next; };
      if (document.startViewTransition && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.startViewTransition(apply);
      } else {
        apply();
      }
      try { localStorage.setItem('theme', next); } catch (e) {}
    });
  }

  // El rol actual y el eje del trace se estiran hasta hoy.
  var d = new Date();
  var now = (d.getFullYear() + d.getMonth() / 12).toFixed(2);
  var trace = document.querySelector('.trace');
  if (trace) trace.style.setProperty('--axis-end', now);
  document.querySelectorAll('.span[data-live]').forEach(function (el) {
    el.style.setProperty('--end', now);
  });

  var year = document.getElementById('year');
  if (year) year.textContent = d.getFullYear();
})();
