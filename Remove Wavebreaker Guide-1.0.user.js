// ==UserScript==
// @name         Remove Wavebreaker Guide
// @namespace    your-namespace
// @version      1.0
// @description  Removes elements with class "wavebreaker__guide"
// @author       Vysokostnyi
// @match        http://*/pvz/acceptance*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Функция для удаления элементов с классом "wavebreaker__guide"
    function removeWavebreakerGuide() {
        var elements = document.getElementsByClassName('wavebreaker__guide');
        for (var i = 0; i < elements.length; i++) {
            elements[i].remove();
        }
    }

    // Функция для обработки нажатия на переключатель "Раскладка вещей"
    function handleSwitcherClick(event) {
        var target = event.target;
        var switcher = target.closest('.acceptance__switcher div');
        if (switcher && switcher.classList.contains('active')) {
            removeWavebreakerGuide();

            // Перемещение блока кода
            const originalElement = document.querySelector('acceptance-wavebreaker-boxes');
            const destinationElement = document.querySelector('.acceptance__switcher');

            destinationElement.insertAdjacentElement('afterend', originalElement);
        }
    }

    // Обработчик события клика на переключатель
    document.addEventListener('click', handleSwitcherClick);
})();
