

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. 
 *
 * @author didierfred@gmail.com
 * @version 0.1
 */


function start_analyse() {
  const analyseStartingTime = Date.now();
  const dom_size = document.getElementsByTagName("*").length;
  let pageAnalysis;

  if (analyseBestPractices) {
    // test with http://www.wickham43.net/flashvideo.php
    const pluginsNumber = getPluginsNumber();
    const printStyleSheetsNumber = getPrintStyleSheetsNumber();
    const inlineStyleSheetsNumber = getInlineStyleSheetsNumber();
    const emptySrcTagNumber = getEmptySrcTagNumber();
    const inlineJsScript = getInlineJsScript();
    const inlineJsScriptsNumber = getInlineJsScriptsNumber();
    const imagesResizedInBrowser = getImagesResizedInBrowser();


    pageAnalysis = {
      "analyseStartingTime": analyseStartingTime,
      "url": document.URL,
      "domSize": dom_size,
      "pluginsNumber": pluginsNumber,
      "printStyleSheetsNumber": printStyleSheetsNumber,
      "inlineStyleSheetsNumber": inlineStyleSheetsNumber,
      "emptySrcTagNumber": emptySrcTagNumber,
      "inlineJsScript": inlineJsScript,
      "inlineJsScriptsNumber": inlineJsScriptsNumber,
      "imagesResizedInBrowser": imagesResizedInBrowser,
    }
  }
  else pageAnalysis = {
    "analyseStartingTime": analyseStartingTime,
    "url": document.URL,
    "domSize": dom_size
  }

  chrome.runtime.sendMessage(pageAnalysis);

}



function getPluginsNumber() {
  const plugins = document.querySelectorAll('object,embed');
  return (plugins === undefined) ? 0 : plugins.length;
}



function getEmptySrcTagNumber() {
  return document.querySelectorAll('img[src=""]').length
    + document.querySelectorAll('script[src=""]').length
    + document.querySelectorAll('link[rel=stylesheet][href=""]').length;
}


function getPrintStyleSheetsNumber() {
  return document.querySelectorAll('link[rel=stylesheet][media~=print]').length
    + document.querySelectorAll('style[media~=print]').length;
}

function getInlineStyleSheetsNumber() {
  let styleSheetsArray = Array.from(document.styleSheets);
  let inlineStyleSheetsNumber = 0;
  styleSheetsArray.forEach(styleSheet => {
    try {
      if (!styleSheet.href) inlineStyleSheetsNumber++;
    }
    catch (err) {
      console.log("GREENIT-ANALYSIS ERROR ," + err.name + " = " + err.message);
      console.log("GREENIT-ANALYSIS ERROR " + err.stack);
    }  
  });
return inlineStyleSheetsNumber;
}


function getInlineJsScript() {
  let scriptArray = Array.from(document.scripts);
  let scriptText = "";
  scriptArray.forEach(script => {
    let isJSON = (String(script.type) === "application/ld+json"); // Exclude type="application/ld+json" from parsing js analyse
    if ((script.text.length > 0) && (!isJSON)) scriptText += "\n" + script.text;
  });
  return scriptText;
}

function getInlineJsScriptsNumber() {
  let scriptArray = Array.from(document.scripts);
  let inlineScriptNumber = 0;
  scriptArray.forEach(script => {
    let isJSON = (String(script.type) === "application/ld+json"); // Exclude type="application/ld+json" from count
    if ((script.text.length > 0) && (!isJSON)) inlineScriptNumber++;
  });
  return inlineScriptNumber;
}


function getImagesResizedInBrowser() {
  const imgArray = Array.from(document.querySelectorAll('img'));
  let imagesResized = [];
  imgArray.forEach(img => {
    if (img.clientWidth < img.naturalWidth || img.clientHeight < img.naturalHeight) {
      // Images of one pixel are some times used ... , we exclude them
      if (img.naturalWidth > 1) 
      {
        const imageMeasures = {
          "src":img.src,
          "clientWidth":img.clientWidth,
          "clientHeight":img.clientHeight,
          "naturalWidth":img.naturalWidth,
          "naturalHeight":img.naturalHeight
        }
        imagesResized.push(imageMeasures);
      }
    }
  });
  return imagesResized;
}


start_analyse();