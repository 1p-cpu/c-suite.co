/* 中小企業未来経営CXO® LP（c-suitez.com/cxo/）
 * 旧 ChatGPT サイト版（app-v10.js / config-v10.js）と同じ動作を再現したもの。
 * 予約先は TimeRex。相談テーマを選ぶと、予約リンクのコメント欄（guest_comment）へ引き継ぐ。
 */
(function () {
  'use strict';
  var config = {
    bookingUrl: 'https://timerex.net/s/t.azuma_075e_bf54/79200b32',
    bookingReady: true,
    prices: { bimonthly: '7万円', monthly: '10万円', intervention: '35万円〜' },
    taxLabel: '税抜'
  };

  document.querySelectorAll('[data-price]').forEach(function (el) {
    var p = config.prices[el.dataset.price];
    if (p) el.textContent = p;
  });
  document.querySelectorAll('.tax').forEach(function (el) { el.textContent = config.taxLabel; });

  function updateBookingLinks(topic) {
    document.querySelectorAll('.booking-link').forEach(function (el) {
      if (config.bookingReady) {
        var url = new URL(config.bookingUrl);
        if (topic) url.searchParams.set('guest_comment', '無料30分経営ヒアリング：' + topic);
        el.href = url.toString();
        el.setAttribute('target', '_blank');
        el.setAttribute('rel', 'noopener noreferrer');
      } else {
        el.href = '#booking-panel';
        el.removeAttribute('target');
        el.removeAttribute('rel');
      }
    });
  }
  updateBookingLinks('');

  var mobileCta = document.querySelector('.mobile-cta');
  var consult = document.querySelector('#consult');
  if (mobileCta && consult && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      mobileCta.classList.toggle('hidden', entries[0].isIntersecting);
    }, { threshold: 0.1 }).observe(consult);
  }

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('.issue-choice').forEach(function (button) {
    button.addEventListener('click', function () {
      document.querySelectorAll('.issue-choice').forEach(function (other) {
        other.setAttribute('aria-pressed', String(other === button));
      });
      var topic = button.dataset.topic;
      updateBookingLinks(topic);
      var box = document.querySelector('#selected-booking-topic');
      if (box) box.hidden = false;
      var text = document.querySelector('#selected-topic-text');
      if (text) text.textContent = topic;
      var feedback = document.querySelector('#topic-feedback');
      if (feedback) feedback.textContent = '選択したテーマ：' + topic + '。予約時にTimeRexのコメント欄へ引き継ぎます。';
      var panel = document.querySelector('#booking-panel');
      if (panel) {
        panel.focus({ preventScroll: true });
        panel.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      }
    });
  });
})();
