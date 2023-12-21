// ==UserScript==
// @name         Remove Wavebreaker Guide
// @namespace    your-namespace
// @version      1.3
// @description  Removes elements with class "wavebreaker__guide"
// @author       Vysokostnyi
// @match        http://*/pvz/*
// @grant        none
// ==/UserScript==

(function() {
  'use strict';

  function removeWavebreakerGuide() {
    let elements = document.querySelectorAll('.wavebreaker__guide');
    Array.from(elements).forEach(element => {
      element.remove();
    });
  }

  function moveWavebreakerBoxes() {
    let existingElement = document.querySelector('acceptance-wavebreaker-boxes.moved');
    let newElement = document.querySelector('acceptance-wavebreaker-boxes:not(.moved)');

    if (newElement) {
      if (existingElement) {
        existingElement.remove();
      }

      const destinationElement = document.querySelector('.acceptance__switcher');
      destinationElement.insertAdjacentElement('afterend', newElement);
      newElement.classList.add('moved');
    }
  }

  document.addEventListener('click', function(event) {
    if (event.target.closest('.acceptance__switcher div.active')) {
      removeWavebreakerGuide();
    }
  });

  let observer = new MutationObserver(function() {
    removeWavebreakerGuide();
    setTimeout(moveWavebreakerBoxes, 100);
  });
  observer.observe(document, { subtree: true, childList: true });
})();
