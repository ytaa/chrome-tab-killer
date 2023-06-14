import { default_idle_time, defualt_tab_title } from "./defaults.js";

var tab_title = defualt_tab_title;

function service_worker_update_options() {
	chrome.storage.local.get(
		{ idle_time: default_idle_time, tab_title: defualt_tab_title},
		(items) => {
			chrome.idle.setDetectionInterval(Number(items.idle_time));
			tab_title = items.tab_title;

			console.log("applying settings");
			console.log("idle time: " + items.idle_time);
			console.log("tab title: " + tab_title);
		}
	);
}

function service_worker_init() {
	chrome.idle.onStateChanged.addListener(
		async function(state) {
			if (state === "active") {
				// Computer not locked, user active
				console.log("State: active")
			} 
			else {
				// Computer is locked, or the user was inactive for given time
				console.log("State: inactive")
				
				const [tab] = await chrome.tabs.query({ title: tab_title });
				if(tab){
					console.log("Removing tab with id: ", tab.id);
					chrome.tabs.remove(tab.id);
				}
			}
		}
	);
	  
	chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
		if(request.type == "save_options" && request.value == 1)
		{
			service_worker_update_options();
		}
	});

	console.log(`service-worker initialized`);
}

// Initial loading of options
service_worker_update_options();

// Listeners setup
service_worker_init();