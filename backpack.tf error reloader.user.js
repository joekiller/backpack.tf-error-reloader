// ==UserScript==
// @name         backpack.tf - Page Reloader
// @description  Recovers from various backpack.tf error responses
// @version      0.2.0
// @author       joekiller
// @namespace    https://github.com/joekiller
// @include      /^https?:\/\/(.*\.)?backpack\.tf\/.*
// @downloadURL  https://github.com/joekiller/backpack.tf-error-reloader/raw/master/backpack.tf%20error%20reloader.user.js
// @updateURL    https://github.com/joekiller/backpack.tf-error-reloader/raw/master/backpack.tf%20error%20reloader.meta.js
// @grant        none
// ==/UserScript==

let min = 10, max = 50;
let rand = Math.floor(Math.random() * (max - min + 1) + min);
let errorDelay = 10 * rand;

function reload() {
	try {
		console.log("reloading");
		location.assign(location.href);
	} catch {
		console.log("error?");
		setup();
	}
}

function setup() {
	// check for 500's
	let rows; let row;
	try {
		// console.log("test 500")
		rows = document.evaluate('/html/body/div[1]/div/div/h1',document,null,XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE);
		row = rows.snapshotItem(0);
		if ("500 - Server Error" === row.innerText) {
			setTimeout(reload, errorDelay);
		}
	} catch {
		try {
			// console.log("test 502 or 503")
			rows = document.evaluate('/html/body/center[1]/h1', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE);
			row = rows.snapshotItem(0);
			if ("502 Bad Gateway" === row.innerText) {
				setTimeout(reload, errorDelay);
			} else if ("503 Service Temporarily Unavailable" === row.innerText) {
				setTimeout(reload, errorDelay);
			} else if ("429 Too Many Requests" === row.innerText) {
				setTimeout(reload, errorDelay + 1000);
			}
		} catch {
			try {
				// ("test Unavailable")
				rows = document.evaluate('/html/body/pre', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE);
				row = rows.snapshotItem(0);
				if ("Service Temporarily Unavailable" === row.innerText) {
					setTimeout(reload, errorDelay);
				}
			} catch {
				try {
					// console.log("test error");
					rows = document.evaluate('/html/body/div/div[2]/header/h1/span[1]', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE);
					row = rows.snapshotItem(0);
					if ("Error" === row.innerText) {
						setTimeout(reload, errorDelay);
					}
				} catch {
					try {
						// console.log("test 500 again");
						rows = document.evaluate('/html/body/div[1]/div/div/h1', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE);
						row = rows.snapshotItem(0);
						if ("500 - Server Error" === row.innerText) {
							setTimeout(reload, errorDelay);
						}
					} catch {
						try {
							// final check to see if everything is okay (we do this last just to not be tricked...
							rows = document.evaluate('/html/body/footer/div[3]/div/p[1]/a', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE )
							row = rows.snapshotItem(0);
							if (" backpack.tf" === row.innerText) {
								// console.log("no errors");
							}
						} catch {
							console.log("I think we have a problem");
						}
					}
				}
			}
		}
	}
}

setup();
