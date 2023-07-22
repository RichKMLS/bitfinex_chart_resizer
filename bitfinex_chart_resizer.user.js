// ==UserScript==
// @name         Bitfinex Chart Resizer
// @author       github.com/richkmls
// @version      1
// @description  Looks for the chart container on Bitfinex trading pages, sets its height to fit the size of the active window, removes a specified element, and keeps trying until it finds it or reaches the maximum number of tries
// @match        *://trading.bitfinex.com/t/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Define a regular expression to match tradingviewWidgetID values
    let tradingviewWidgetIDRegex = /tradingview-widget\d+/;

    // Set the maximum number of tries before stopping
    let maxTries = 10;
    let tries = 0;

    // Check if the current page is a Bitfinex trading page
    if (window.location.href.match(/trading\.bitfinex\.com\/t\/.+?:.+?\?type=exchange/)) {

        // Set an interval to keep trying until the chart container is found or the maximum number of tries is reached
        let interval = setInterval(() => {
            // Use querySelectorAll to find all elements that match the tradingviewWidgetIDRegex
            let chartContainers = document.querySelectorAll(`html body.ticker-side.default-theme.dark-mode.sidebar-left div#root div div div#interface.body_container.row div.inner-wrapper div#app-page-content.main-app-container.trading-app div.collapsible-layout div#chart-header.ui-panel.bg-wrap div.collapsible div.ui-collapsible__body-wrapper div.ui-collapsible__body div div[id^="tradingview-widget"]`);
            chartContainers.forEach(chartContainer => {
                // Check if the chart container's id matches the tradingviewWidgetIDRegex
                if (chartContainer.id.match(tradingviewWidgetIDRegex)) {

                    // Set the height of the chart container to fit the size of the active window
                    chartContainer.style.height = `${window.innerHeight - 40}px`;

                    // Remove top of chart container clutter
                    let elementToRemove = document.querySelector('html body.ticker-side.default-theme.dark-mode.sidebar-left div#root div div div#interface.body_container.row div.page-info.securities');
                    if (elementToRemove) {
                        elementToRemove.parentNode.removeChild(elementToRemove);
                    }

                    // Remove padding from element
                    let elementToModify = document.querySelector('html body.ticker-side.default-theme.dark-mode.sidebar-left<div#root.div.div.div#interface.body_container.row.div.inner-wrapper.div#app-page-content.main-app-container.trading-app.div.collapsible-layout.div#chart-header.ui-panel.bg-wrap.div.collapsible.div.ui-collapsible__body-wrapper.div.ui-collapsible__body');
                    if (elementToModify) {
                        elementToModify.style.paddingTop = '0';
                        elementToModify.style.paddingBottom = '0';
                    }

                    // Clear the interval once the chart container is found and modified
                    clearInterval(interval);
                }
            });

            // Increment the number of tries and stop if the maximum number of tries is reached
            tries++;
            if (tries >= maxTries) {
                clearInterval(interval);
            }
        }, 1000);
    }
})();
