// ==UserScript==
// @name         Пустые ячейки
// @namespace    http://tampermonkey.net/
// @version      2023-12-18
// @description  try to take over the world!
// @author       You
// @match        http://192.168.1.3:1100/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=1.3
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Функция для выполнения вашего скрипта
    function addButton() {
        const header = document.querySelector('h1.ui.header');
        if (header && header.innerText === 'Волнорез') {
            const form = document.querySelector('app-wavebreaker-state form');
            if (form) {
                const existingButton = form.querySelector('#emptyCellsButton');
                if (!existingButton) {
                    let button = document.querySelector('.ui.primary.button.print-btn').cloneNode(true);
                    button.textContent = 'Показать пустые ячейки';
                    button.id = "emptyCellsButton";
                    form.prepend(button);
                    const emptyCellsButton = document.getElementById('emptyCellsButton');
                    emptyCellsButton.addEventListener('click', getMissingIds);
                }
            }
        }
    }

    function getMissingIds() {
        fetch("http://192.168.1.3:1100/api/wavebreaker/state")
            .then(response => response.json())
            .then(data => {
                const cells = data.cells;
                const existingIds = cells.map(cell => cell.cellId);
                const missingIds = [];
                for (let i = 1; i <= 740; i++) {
                    if (!existingIds.includes(i)) {
                        missingIds.push(i);
                    }
                }

                // Получаем сохраненное положение модального окна
                const modalPosition = JSON.parse(localStorage.getItem('modalPosition')) || { top: "50%", left: "50%" };

                const modalContent = document.createElement("div");
                modalContent.innerHTML = `
                    <div style="background-color: #f2f2f2; padding: 20px; text-align: center; font-size: 20px;">
                        <h2 id="modalHeader">Пустые ячейки:</h2>
                        <p>${missingIds.join(", ")}</p>
                        <button id="refreshButton" style="padding: 10px 20px; margin-top: 10px; background-color: #007bff; color: white; border: none; cursor: pointer;">Обновить</button>
                        <button id="closeModal" style="padding: 10px 20px; margin-top: 10px; background-color: #4CAF50; color: white; border: none; cursor: pointer;">Закрыть</button>
                    </div>
                `;
                const modal = document.createElement("div");
                modal.style.position = "fixed";
                modal.style.top = modalPosition.top; // Устанавливаем сохраненное положение
                modal.style.left = modalPosition.left;
                modal.style.transform = "translate(-50%, -50%)";
                modal.style.background = "rgba(255, 255, 255, 0.9)";
                modal.style.padding = "20px";
                modal.style.border = "1px solid #ccc";
                modal.appendChild(modalContent);
                document.body.appendChild(modal);

                // Добавляем обработчик события для кнопки закрытия модального окна
                const closeButton = document.getElementById('closeModal');
                closeButton.addEventListener('click', function() {
                    document.body.removeChild(modal);
                });

                // Добавляем обработчик события для кнопки обновления модального окна
                const refreshButton = document.getElementById('refreshButton');
                refreshButton.addEventListener('click', function() {
                    document.body.removeChild(modal);
                    getMissingIds();
                });

                // Добавляем возможность перемещать модальное окно за заголовок
                const modalHeader = document.getElementById('modalHeader');
                if (modalHeader) {
                    modalHeader.onmousedown = function(e) {
                        e = e || window.event;
                        var pos3 = e.clientX;
                        var pos4 = e.clientY;
                        document.onmouseup = function() {
                            document.onmouseup = null;
                            document.onmousemove = null;
                            // Сохраняем новое положение модального окна после перемещения
                            localStorage.setItem('modalPosition', JSON.stringify({ top: modal.style.top, left: modal.style.left }));
                        };
                        document.onmousemove = function(e) {
                            e = e || window.event;
                            modal.style.top = modal.offsetTop - (pos4 - e.clientY) + 'px';
                            modal.style.left = modal.offsetLeft - (pos3 - e.clientX) + 'px';
                            pos3 = e.clientX;
                            pos4 = e.clientY;
                        };
                    };
                }
            })
            .catch(error => console.error(error));
    }

    // Запуск функции при загрузке страницы
    addButton();

    // Задаем интервал для постоянной проверки наличия кнопки
    setInterval(addButton, 1000);
})();
