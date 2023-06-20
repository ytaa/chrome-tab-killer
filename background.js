import { default_idle_time, default_idle_time_min, default_idle_time_max, default_idle_time_is_random, defualt_tab_title } from "./defaults.js";

var tab_title = defualt_tab_title;
var idle_time_min = default_idle_time_min;
var idle_time_max = default_idle_time_max;
var idle_time_is_random = default_idle_time_is_random;

function service_worker_set_random_idle_interval(idle_time_min, idle_time_max) {
	const min = Number(idle_time_min);
	const max = Number(idle_time_max);

	const idle_time_random = Math.floor(Math.random() * (max - min) + min);
	chrome.idle.setDetectionInterval(idle_time_random);

	return idle_time_random;
}

function service_worker_update_options() {
	chrome.storage.local.get(
		{ 
			idle_time: default_idle_time, 
			idle_time_is_random: default_idle_time_is_random,
			idle_time_min: default_idle_time_min, 
			idle_time_max: default_idle_time_max, 
			tab_title: defualt_tab_title 
		},
		(items) => {
			console.log("applying settings");

			tab_title = items.tab_title;
			idle_time_is_random = items.idle_time_is_random;
			idle_time_min = items.idle_time_min;
			idle_time_max = items.idle_time_max;

			console.log("tab title: " + tab_title);
			console.log("random idle time: " + idle_time_is_random);
			
			if(idle_time_is_random)
			{
				console.log("idle time min: " + idle_time_min);
				console.log("idle time max: " + idle_time_max);

				const idle_time_random = service_worker_set_random_idle_interval(idle_time_min, idle_time_max);
				console.log("idle time random: " + idle_time_random);
			}
			else
			{
				chrome.idle.setDetectionInterval(Number(items.idle_time));
				console.log("idle time: " + items.idle_time);
			}
		}
	);
}

function service_worker_init() {
	chrome.idle.onStateChanged.addListener(
		async function(state) {
			if (state === "active") {
				// Computer not locked, user active
				console.log("state: active")
			} 
			else {
				// Computer is locked, or the user was inactive for given time
				console.log("state: inactive")
				
				const tabs = await chrome.tabs.query({ title: tab_title });
				if(tabs){
					tabs.forEach((tab) => {
						console.log(`removing tab {id: ${tab.id}, title: ${tab.title}}`);
						chrome.tabs.remove(tab.id);
					});
				}

				if(idle_time_is_random)
				{
					const idle_time_random = service_worker_set_random_idle_interval(idle_time_min, idle_time_max);
					console.log("new idle time random: ", idle_time_random);
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