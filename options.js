import { default_idle_time, default_idle_time_min, default_idle_time_max, default_idle_time_is_random, defualt_tab_title } from "./defaults.js";

const validateIdleTime = (elementId) => {
	var time = document.getElementById(elementId).value;
	if(time < 15){
		time = 15;
		document.getElementById(elementId).value = 15;
	}
	return time;
}

// Saves options to chrome.storage
const saveOptions = () => {
	const idle_time = validateIdleTime('idle_time');
	const idle_time_min = validateIdleTime('idle_time_min');
	const idle_time_max = validateIdleTime('idle_time_max');
	const idle_time_is_random = document.getElementById('idle_time_is_random').checked;

	const tab_title = document.getElementById('tab_title').value;

	chrome.storage.local.set(
		{ 
			idle_time: idle_time, 
			idle_time_is_random: idle_time_is_random,
			idle_time_min: idle_time_min, 
			idle_time_max: idle_time_max, 
			tab_title: tab_title 
		},
		() => {
			// Update status to let user know options were saved.
			const status = document.getElementById('status');
			status.textContent = 'Options saved.';
			setTimeout(() => {
				status.textContent = '';
			}, 750);
		}
	);

	chrome.runtime.sendMessage({ type: 'save_options', value: 1 });
};

const restoreOptions = () => {
	chrome.storage.local.get(
		{ 
			idle_time: default_idle_time, 
			idle_time_is_random: default_idle_time_is_random,
			idle_time_min: default_idle_time_min, 
			idle_time_max: default_idle_time_max, 
			tab_title: defualt_tab_title 
		},
		(items) => {
			document.getElementById('tab_title').value = items.tab_title;
			document.getElementById('idle_time_is_random').value = items.idle_time_is_random;
			document.getElementById('idle_time').value = items.idle_time;
			document.getElementById('idle_time_min').value = items.idle_time_min;
			document.getElementById('idle_time_max').value = items.idle_time_max;
		}
	);
};

const idleTimeIsRandomOnChange = () => {

	if(document.getElementById('idle_time_is_random').checked)
	{
		// random
		document.getElementById('idle_time_tr').hidden = true;
		document.getElementById('idle_time_min_tr').hidden = false;
		document.getElementById('idle_time_max_tr').hidden = false;
	}
	else
	{
		document.getElementById('idle_time_tr').hidden = false;
		document.getElementById('idle_time_min_tr').hidden = true;
		document.getElementById('idle_time_max_tr').hidden = true;
	}
};

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);

document.getElementById('idle_time_is_random').addEventListener('click', idleTimeIsRandomOnChange);