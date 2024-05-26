// ==UserScript==
// @name         EvilLovetsVoln
// @namespace    https://t.me/vskni
// @version      2024-05-27
// @description  try to take over the world!\Попытайтесь захватить мир!
// @author       @vskni
// @match        http://localhost:1100/*
// @match        http://*/pvz/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=undefined.localhost
// @grant        none
// ==/UserScript==

(function() {
    const targetUrl = '/api/wavebreaker/put';

    // Перехват XMLHttpRequest запросов
    var originalXhrOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url) {
        this._isTargetUrl = url.includes(targetUrl);
        return originalXhrOpen.apply(this, arguments);
    };

    var originalXhrSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function() {
        var xhr = this;
        if (this._isTargetUrl) {
            var originalOnReadyStateChange = xhr.onreadystatechange;
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    const responseBody = JSON.parse(xhr.responseText);
                    let acceptedCount = responseBody.acceptedCount || 0;
                    let expectedCount = responseBody.expectedCount || 0;
                    const cellId = responseBody.cellId || 'unknown';
                    const shkId = responseBody.shkId;

                    if ((!responseBody.msg || responseBody.msg !== "Повтор") && shkId !== 0) {
                        acceptedCount++;
                        expectedCount++;
                    }

                    const resultString = `${cellId} (${expectedCount}\\${acceptedCount})`;

                    const observer = new MutationObserver(function(mutations) {
                        mutations.forEach(function(mutation) {
                            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                                const numberElement = document.querySelector('.number');

                                if (numberElement) {
                                    numberElement.textContent = resultString;
                                    console.log("Результат:", resultString);
                                    observer.disconnect();
                                }
                            }
                        });
                    });

                    observer.observe(document.body, { childList: true, subtree: true });
                }
                if (originalOnReadyStateChange) {
                    originalOnReadyStateChange.apply(xhr, arguments);
                }
            };
        }
        return originalXhrSend.apply(this, arguments);
    };
})();
