/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/background.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/background.js":
/*!***************************!*\
  !*** ./src/background.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

// the background script runs all the time and serves as a central message
// hub for each vue devtools (panel + backend) instance.

const ports = {}

chrome.runtime.onConnect.addListener(port => {
    let tab
    let name
    if (isNumeric(port.name)) {
        tab = port.name
        name = 'devtools'
        injectBackend(+port.name)
    } else {
        tab = port.sender.tab.id
        name = 'backend'
    }

    if (!ports[tab]) {
        ports[tab] = {
            devtools: null,
            backend: null
        }
    }
    ports[tab][name] = port

    if (ports[tab].devtools && ports[tab].backend) {
        doublePipe(tab, ports[tab].devtools, ports[tab].backend)
    }
})

function isNumeric(str) {
    return +str + '' === str
}

function injectBackend(tabId) {
    chrome.tabs.executeScript(tabId, {
        file: 'build/backend.js'
    }, function (res) {
        console.log("Inject backend finish: ", res)
    })
}

function doublePipe(id, one, two) {

    one.onMessage.addListener(lOne)
    function lOne(message) {
        if (message.event === 'log') {
            return console.log('tab ' + id, message.payload)
        }
        console.log('devtools -> backend', message)
        two.postMessage(message)
    }
    two.onMessage.addListener(lTwo)
    function lTwo(message) {
        if (message.event === 'log') {
            return console.log('tab ' + id, message.payload)
        }
        console.log('backend -> devtools', message)
        one.postMessage(message)
    }
    function shutdown() {
        console.log('tab ' + id + ' disconnected.')
        one.onMessage.removeListener(lOne)
        two.onMessage.removeListener(lTwo)
        one.disconnect()
        two.disconnect()
        ports[id] = null
    }
    one.onDisconnect.addListener(shutdown)
    two.onDisconnect.addListener(shutdown)
    console.log('tab ' + id + ' connected.')
}


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2JhY2tncm91bmQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtRQUFBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBOzs7UUFHQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMENBQTBDLGdDQUFnQztRQUMxRTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLHdEQUF3RCxrQkFBa0I7UUFDMUU7UUFDQSxpREFBaUQsY0FBYztRQUMvRDs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EseUNBQXlDLGlDQUFpQztRQUMxRSxnSEFBZ0gsbUJBQW1CLEVBQUU7UUFDckk7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwyQkFBMkIsMEJBQTBCLEVBQUU7UUFDdkQsaUNBQWlDLGVBQWU7UUFDaEQ7UUFDQTtRQUNBOztRQUVBO1FBQ0Esc0RBQXNELCtEQUErRDs7UUFFckg7UUFDQTs7O1FBR0E7UUFDQTs7Ozs7Ozs7Ozs7O0FDbEZBO0FBQ0E7QUFDQTtBQUNBLE1BQU0sS0FBSyxHQUFHLEVBQUU7QUFDaEI7QUFDQSxNQUFNLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsSUFBSSxJQUFJO0FBQzdDLElBQUksSUFBSSxHQUFHO0FBQ1gsSUFBSSxJQUFJLElBQUk7QUFDWixJQUFJLElBQUksU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRTtBQUM5QixRQUFRLEdBQUcsR0FBRyxJQUFJLENBQUMsSUFBSTtBQUN2QixRQUFRLElBQUksR0FBRyxVQUFVO0FBQ3pCLFFBQVEsYUFBYSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FB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RyxDQUFDLFVBQVUsRUFBRTtBQUN4QixRQUFRLEtBQUssQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJO0FBQ3hCLEtBQUs7QUFDTCxJQUFJLEdBQUcsQ0FBQyxZQUFZLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQztBQUMxQyxJQUFJLEdBQUcsQ0FBQyxZQUFZLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQztBQUMxQyxJQUFJLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxHQUFHLEVBQUUsR0FBRyxhQUFhLENBQUM7QUFDNUMsQ0FBQyIsImZpbGUiOiJiYWNrZ3JvdW5kLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9zcmMvYmFja2dyb3VuZC5qc1wiKTtcbiIsIi8vIHRoZSBiYWNrZ3JvdW5kIHNjcmlwdCBydW5zIGFsbCB0aGUgdGltZSBhbmQgc2VydmVzIGFzIGEgY2VudHJhbCBtZXNzYWdlXG4vLyBodWIgZm9yIGVhY2ggdnVlIGRldnRvb2xzIChwYW5lbCArIGJhY2tlbmQpIGluc3RhbmNlLlxuXG5jb25zdCBwb3J0cyA9IHt9XG5cbmNocm9tZS5ydW50aW1lLm9uQ29ubmVjdC5hZGRMaXN0ZW5lcihwb3J0ID0+IHtcbiAgICBsZXQgdGFiXG4gICAgbGV0IG5hbWVcbiAgICBpZiAoaXNOdW1lcmljKHBvcnQubmFtZSkpIHtcbiAgICAgICAgdGFiID0gcG9ydC5uYW1lXG4gICAgICAgIG5hbWUgPSAnZGV2dG9vbHMnXG4gICAgICAgIGluamVjdEJhY2tlbmQoK3BvcnQubmFtZSlcbiAgICB9IGVsc2Uge1xuICAgICAgICB0YWIgPSBwb3J0LnNlbmRlci50YWIuaWRcbiAgICAgICAgbmFtZSA9ICdiYWNrZW5kJ1xuICAgIH1cblxuICAgIGlmICghcG9ydHNbdGFiXSkge1xuICAgICAgICBwb3J0c1t0YWJdID0ge1xuICAgICAgICAgICAgZGV2dG9vbHM6IG51bGwsXG4gICAgICAgICAgICBiYWNrZW5kOiBudWxsXG4gICAgICAgIH1cbiAgICB9XG4gICAgcG9ydHNbdGFiXVtuYW1lXSA9IHBvcnRcblxuICAgIGlmIChwb3J0c1t0YWJdLmRldnRvb2xzICYmIHBvcnRzW3RhYl0uYmFja2VuZCkge1xuICAgICAgICBkb3VibGVQaXBlKHRhYiwgcG9ydHNbdGFiXS5kZXZ0b29scywgcG9ydHNbdGFiXS5iYWNrZW5kKVxuICAgIH1cbn0pXG5cbmZ1bmN0aW9uIGlzTnVtZXJpYyhzdHIpIHtcbiAgICByZXR1cm4gK3N0ciArICcnID09PSBzdHJcbn1cblxuZnVuY3Rpb24gaW5qZWN0QmFja2VuZCh0YWJJZCkge1xuICAgIGNocm9tZS50YWJzLmV4ZWN1dGVTY3JpcHQodGFiSWQsIHtcbiAgICAgICAgZmlsZTogJ2J1aWxkL2JhY2tlbmQuanMnXG4gICAgfSwgZnVuY3Rpb24gKHJlcykge1xuICAgICAgICBjb25zb2xlLmxvZyhcIkluamVjdCBiYWNrZW5kIGZpbmlzaDogXCIsIHJlcylcbiAgICB9KVxufVxuXG5mdW5jdGlvbiBkb3VibGVQaXBlKGlkLCBvbmUsIHR3bykge1xuXG4gICAgb25lLm9uTWVzc2FnZS5hZGRMaXN0ZW5lcihsT25lKVxuICAgIGZ1bmN0aW9uIGxPbmUobWVzc2FnZSkge1xuICAgICAgICBpZiAobWVzc2FnZS5ldmVudCA9PT0gJ2xvZycpIHtcbiAgICAgICAgICAgIHJldHVybiBjb25zb2xlLmxvZygndGFiICcgKyBpZCwgbWVzc2FnZS5wYXlsb2FkKVxuICAgICAgICB9XG4gICAgICAgIGNvbnNvbGUubG9nKCdkZXZ0b29scyAtPiBiYWNrZW5kJywgbWVzc2FnZSlcbiAgICAgICAgdHdvLnBvc3RNZXNzYWdlKG1lc3NhZ2UpXG4gICAgfVxuICAgIHR3by5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIobFR3bylcbiAgICBmdW5jdGlvbiBsVHdvKG1lc3NhZ2UpIHtcbiAgICAgICAgaWYgKG1lc3NhZ2UuZXZlbnQgPT09ICdsb2cnKSB7XG4gICAgICAgICAgICByZXR1cm4gY29uc29sZS5sb2coJ3RhYiAnICsgaWQsIG1lc3NhZ2UucGF5bG9hZClcbiAgICAgICAgfVxuICAgICAgICBjb25zb2xlLmxvZygnYmFja2VuZCAtPiBkZXZ0b29scycsIG1lc3NhZ2UpXG4gICAgICAgIG9uZS5wb3N0TWVzc2FnZShtZXNzYWdlKVxuICAgIH1cbiAgICBmdW5jdGlvbiBzaHV0ZG93bigpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ3RhYiAnICsgaWQgKyAnIGRpc2Nvbm5lY3RlZC4nKVxuICAgICAgICBvbmUub25NZXNzYWdlLnJlbW92ZUxpc3RlbmVyKGxPbmUpXG4gICAgICAgIHR3by5vbk1lc3NhZ2UucmVtb3ZlTGlzdGVuZXIobFR3bylcbiAgICAgICAgb25lLmRpc2Nvbm5lY3QoKVxuICAgICAgICB0d28uZGlzY29ubmVjdCgpXG4gICAgICAgIHBvcnRzW2lkXSA9IG51bGxcbiAgICB9XG4gICAgb25lLm9uRGlzY29ubmVjdC5hZGRMaXN0ZW5lcihzaHV0ZG93bilcbiAgICB0d28ub25EaXNjb25uZWN0LmFkZExpc3RlbmVyKHNodXRkb3duKVxuICAgIGNvbnNvbGUubG9nKCd0YWIgJyArIGlkICsgJyBjb25uZWN0ZWQuJylcbn1cbiJdLCJzb3VyY2VSb290IjoiIn0=