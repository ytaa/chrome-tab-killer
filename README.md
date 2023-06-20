# chrome-tab-killer
Google Chrome extension closing selected tabs when user is idle.

## Options
This extension currently supports the following options:

- ***Tab title*** - This is the pattern used to match page titles. Tabs with page titles that match the pattern will be closed when the user is detected as idle.
- ***Random idle time*** - If enabled, the time at which the user is detected as idle will be randomly chosen within a given range. Otherwise, the time will be fixed.
- ***Idle time [sec]*** - This is the fixed time in seconds after which the user is detected as idle. This option is available only if ***Random idle time*** option is set to false.
- ***Idle time min [sec]*** - This represents the lower bound of the range used to randomly select the idle time in seconds. This option is available only if ***Random idle time*** option is set to true.
- ***Idle time max [sec]*** - This indicates the upper bound of the range used to randomly select the idle time in seconds. This option is available only if ***Random idle time*** option is set to true.

These options can be modified through the extension's options panel:

![image info](./resources/options.png)
