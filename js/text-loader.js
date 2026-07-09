(function () {
  'use strict';

  var DEFAULTS = {};

  function collectTexts(obj, flat, prefix) {
    prefix = prefix || '';
    for (var key in obj) {
      if (!obj.hasOwnProperty(key)) continue;
      var val = obj[key];
      var fullKey = prefix + key;
      if (typeof val === 'string') {
        flat[fullKey] = val;
      } else if (typeof val === 'object' && val !== null) {
        collectTexts(val, flat, fullKey + '.');
      }
    }
  }

  function getPairs(overrides) {
    var defaultsMap = {};
    collectTexts(DEFAULTS, defaultsMap);
    var overridesMap = {};
    collectTexts(overrides, overridesMap);

    var pairs = [];
    for (var key in defaultsMap) {
      if (!defaultsMap.hasOwnProperty(key)) continue;
      var from = defaultsMap[key];
      var to = overridesMap.hasOwnProperty(key) ? overridesMap[key] : from;
      pairs.push({ from: from, to: to });
    }
    return pairs;
  }

  function normalizeText(text) {
    return (text || "").replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase();
  }

  function decodeEntities(text) {
    if (!text) return "";
    return text.replace(/&nbsp;/g, '\u00a0');
  }

  function rewriteElementText(element, to) {
    var decodedTo = decodeEntities(to);
    var walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null, false);
    var node;
    var first = true;
    while ((node = walker.nextNode())) {
      node.textContent = first ? decodedTo : "";
      first = false;
    }
  }

  function replaceTextNodes(root, pairs) {
    var sorted = pairs.slice().sort(function (a, b) {
      return b.from.length - a.from.length;
    });

    sorted.forEach(function (p) {
      if (p.from === p.to) return;
      var normalizedFrom = normalizeText(p.from);
      
      var allElements = root.querySelectorAll('*');
      for (var i = allElements.length - 1; i >= 0; i--) {
        var el = allElements[i];
        
        var placeholder = el.getAttribute('placeholder');
        if (placeholder && normalizeText(placeholder) === normalizedFrom) {
          el.setAttribute('placeholder', decodeEntities(p.to));
        }
        var value = el.getAttribute('value');
        if (value && normalizeText(value) === normalizedFrom) {
          el.setAttribute('value', decodeEntities(p.to));
        }

        if (el.innerText && normalizeText(el.innerText) === normalizedFrom) {
          rewriteElementText(el, p.to);
        }
      }
    });
  }

  function updateMeta(data) {
    var section = (data.meta && data.meta.texts) || (DEFAULTS.meta && DEFAULTS.meta.texts) || {};
    if (section.title) document.title = section.title;
    if (section.description) {
      var el = document.querySelector('meta[name="description"]');
      if (el) el.setAttribute('content', section.description);
    }
  }

  function apply(data) {
    updateMeta(data);
    var pairs = getPairs(data);
    if (pairs.length > 0) {
      replaceTextNodes(document.body, pairs);
    }
  }

  var cachedData = null;
  var applied = false;
  var isLoading = false;

  function tryLoad() {
    if (applied || isLoading) return;
    var root = document.getElementById('main');
    if (!root || root.children.length === 0) return;

    applied = true;

    if (cachedData) {
      apply(cachedData);
    } else {
      isLoading = true;
      Promise.all([
        fetch('js/defaults.json?' + Date.now()).then(function (r) { return r.json(); }),
        fetch('data/content.json?' + Date.now()).then(function (r) { return r.json(); })
      ])
        .then(function (results) {
          DEFAULTS = results[0];
          cachedData = results[1];
          apply(cachedData);
        })
        .catch(function (e) {
          console.error('Error loading text data:', e);
          applied = false;
        })
        .finally(function () {
          isLoading = false;
        });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', tryLoad);
  } else {
    tryLoad();
  }

  var observer = new MutationObserver(function() {
    if (!applied) {
      tryLoad();
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
})();
