(function () {
  'use strict';

  var FIELD_RULES = {
    'user-name-surname': {
      required: true,
      pattern: /^[\p{L}\s]+$/u,
      message: "Ім'я має містити лише літери та пробіли"
    },
    'user-mail': {
      required: true,
      pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{1,}$/,
      message: 'Некорректний email'
    }
  };

  function qs(sel, ctx) { return (ctx || document).querySelector(sel); }

  function qsa(sel, ctx) { return Array.from((ctx || document).querySelectorAll(sel)); }

  function getWrapper(input) {
    return input.closest('label') || input.parentElement;
  }

  function getLabelText(wrapper) {
    if (!wrapper) return null;
    return wrapper.querySelector('.framer-muqsdo');
  }

  function getBtnText(btn) {
    if (!btn) return null;
    var wrapper = btn.querySelector('.framer-1ghc2bb');
    if (wrapper) return wrapper.querySelector('p, span') || wrapper;
    return btn.querySelector('p, span');
  }

  function validate(name, value) {
    var rule = FIELD_RULES[name];
    if (!rule) return '';
    if (rule.required && (!value || value.trim() === '')) return "Це поле обов'язкове";
    if (rule.pattern && !rule.pattern.test(value)) return rule.message;
    return '';
  }

  function setFieldState(input, isError) {
    var wrapper = getWrapper(input);
    if (!wrapper) return;
    var isFocused = document.activeElement === input;

    if (isError) {
      wrapper.style.setProperty('--border-color', 'var(--token-78eeacc2-39fb-42a2-b86e-ada9a7280cc8)');
      wrapper.style.boxShadow = isFocused ? '0px 0px 0px 5px var(--token-5bea8c16-3ef6-485f-8e0c-8c753934ef7a)' : '';
    } else {
      wrapper.style.setProperty('--border-color', 'var(--token-deada280-32e4-4ae5-a7ea-4a074f5ee96a)');
      wrapper.style.boxShadow = isFocused ? '0px 0px 0px 4px var(--token-b3d8f1a2-4c5e-4f6a-8b9d-0e1f2a3b4c5d)' : '';
    }

    var label = getLabelText(wrapper);
    if (label) {
      if (isError) {
        label.style.setProperty('--extracted-r6o4lv', 'var(--token-78eeacc2-39fb-42a2-b86e-ada9a7280cc8)');
      } else {
        label.style.removeProperty('--extracted-r6o4lv');
      }
    }
  }

  function resetField(input) {
    var wrapper = getWrapper(input);
    if (!wrapper) return;
    
    var borderColor = 'rgba(168, 176, 191, 0.43)';
    
    wrapper.style.setProperty('--border-color', borderColor, 'important');
    wrapper.style.setProperty('border-color', borderColor, 'important');
    wrapper.style.setProperty('box-shadow', 'none', 'important');
    
    input.style.setProperty('border-color', borderColor, 'important');
    input.style.setProperty('box-shadow', 'none', 'important');
    input.style.removeProperty('outline');
    
    var label = getLabelText(wrapper);
    if (label) {
      label.style.removeProperty('--extracted-r6o4lv');
    }
  }

  function showToast(message) {
    var existing = qs('.ssg-toast');
    if (existing) existing.remove();

    var toast = document.createElement('div');
    toast.className = 'ssg-toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    requestAnimationFrame(function () {
      toast.classList.add('ssg-toast--visible');
    });

    setTimeout(function () {
      toast.classList.remove('ssg-toast--visible');
      setTimeout(function () { toast.remove(); }, 350);
    }, 4000);
  }

  function initForm(form) {
    var fields = {};

    qsa('input[name], textarea[name]', form).forEach(function (el) {
      var name = el.getAttribute('name');
      if (name) fields[name] = el;
    });

    if (!fields['user-name-surname'] && !fields['user-mail']) return;

    Object.keys(fields).forEach(function (name) {
      var field = fields[name];
      if (!field || !FIELD_RULES[name]) return;

      field.addEventListener('input', function () {
        var err = validate(name, field.value.trim());
        if (err) {
          setFieldState(field, true);
        } else if (field.value.trim().length > 0) {
          setFieldState(field, false);
        } else {
          resetField(field);
        }
      });

      field.addEventListener('blur', function () {
        var err = validate(name, field.value.trim());
        if (err) {
          setFieldState(field, true);
        } else {
          setFieldState(field, false);
        }
      });

      field.addEventListener('focus', function () {
        var err = validate(name, field.value.trim());
        if (err) {
          setFieldState(field, true);
        } else if (field.value.trim().length > 0) {
          setFieldState(field, false);
        }
      });
    });

    var submitting = false;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      e.stopImmediatePropagation();

      if (submitting) return;
      submitting = true;

      var hasError = false;

      Object.keys(FIELD_RULES).forEach(function (name) {
        var field = fields[name];
        if (!field) return;
        var err = validate(name, field.value.trim());
        if (err) {
          setFieldState(field, true);
          hasError = true;
        } else {
          setFieldState(field, false);
        }
      });

      if (hasError) {
        submitting = false;
        return;
      }

      var btn = form.querySelector('button[type="submit"]');
      var btnText = getBtnText(btn);
      var ERROR_CLR = 'var(--token-5bea8c16-3ef6-485f-8e0c-8c753934ef7a)';

      function setBtnError() {
        if (!btn) return;
        btn.style.setProperty('background-color', ERROR_CLR, 'important');
        btn.style.setProperty('box-shadow', 'none', 'important');
        btn.style.setProperty('border-color', 'transparent', 'important');
        btn.style.removeProperty('--border-color');
      }

      function resetBtn() {
        if (!btn) return;
        btn.style.removeProperty('--border-color');
        btn.style.removeProperty('border-color');
        btn.style.removeProperty('box-shadow');
        btn.style.removeProperty('background-color');
      }

      var fd = new FormData(form);

      // --- Web3Forms: встав свій Access Key нижче ---
      fd.append('access_key', '84a18b7a-ce99-4f01-b981-894062266531');
      fd.append('subject', 'Нова заявка з сайту SSG Tech');
      fd.append('from_name', 'SSG Tech Website');

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: fd
      })
        .then(function (res) { return res.json(); })
        .then(function (data) {
            if (data.success) {
              if (btnText) btnText.textContent = 'Дякуємо!';
              showToast('Заявку успішно надіслано!');

              form.reset();
              qsa('input, textarea', form).forEach(function (f) {
                var prototype = f.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
                var nativeSetter = Object.getOwnPropertyDescriptor(prototype, 'value').set;
                nativeSetter.call(f, '');
                f.dispatchEvent(new Event('input', { bubbles: true }));
                f.dispatchEvent(new Event('change', { bubbles: true }));
                
                requestAnimationFrame(function() {
                  resetField(f);
                });
              });

              resetBtn();

              setTimeout(function () {
                if (btnText) btnText.textContent = 'Залишити заявку';
                submitting = false;
              }, 1000);
            } else {
            if (btnText) btnText.textContent = 'Щось пішло не так';
            setBtnError();
            if (data.errors) {
              Object.keys(data.errors).forEach(function (name) {
                var f = fields[name];
                if (f) setFieldState(f, true);
              });
            }
            showToast((data.errors && data.errors._form) || data.message || 'Помилка відправки. Спробуйте пізніше.');
            submitting = false;
          }
        })
        .catch(function () {
          if (btnText) btnText.textContent = 'Щось пішло не так';
          setBtnError();
          showToast('Помилка з\'єднання. Перевірте інтернет.');
          submitting = false;
        });
    }, true);
  }

  function init() {
    qsa('form').forEach(function (form) {
      if (form.querySelector('[name="user-name-surname"]') && form.querySelector('[name="user-mail"]')) {
        initForm(form);
      }
    });
  }

  init();

  var observer = new MutationObserver(function () {
    init();
  });
  observer.observe(document.body, { childList: true, subtree: true });
})();
