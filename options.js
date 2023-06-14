import { default_idle_time, defualt_tab_title } from "./defaults.js";

// Saves options to chrome.storage
const saveOptions = () => {
	var idle_time = document.getElementById('idle_time').value;
	if(idle_time < 15){
		idle_time = 15;
		document.getElementById('idle_time').value = 15;
	}

	const tab_title = document.getElementById('tab_title').value;

	chrome.storage.local.set(
		{ idle_time: idle_time, tab_title: tab_title },
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
		{ idle_time: default_idle_time, tab_title: defualt_tab_title },
		(items) => {
			document.getElementById('idle_time').value = items.idle_time;
			document.getElementById('tab_title').value = items.tab_title;
		}
	);
};

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);