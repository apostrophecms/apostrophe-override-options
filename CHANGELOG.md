## 2.2.1

* Declares two variables explicitly that had not been.

## 2.2.0

* New `$merge` operator for manipulating array options. Set the `comparator` property to the property name to be compared for equality, such as `id`, or to a function that compares two elements, returning true if they match. If the comparator finds a match for an element in the array, it is replaced with the `value` property. Otherwise the `value` property is appended as a new array element. Thanks to Etienne Laurent.

## 2.1.3

* New `$replace` operator for manipulating array options. Thanks to Arthur.

## 2.1.2

* The mechanism allowing self-overrides via `editable` and template options in widget modules has been completely rewritten to fully leverage the mechanisms used by other overrides. This eliminates a number of bugs relating to arrays and nested options.

## 2.1.1

* Editing and saving a widget that has `editable` options no longer crashes. Also, be aware that values inherited from other modules are not available when a widget is re-rendered at the time it is saved. However they are available when that widget is rendered later as part of an actual page load. This may be addressed in a future update of Apostrophe.

## 2.1.0

* A module may now override its own options (for instance, via `editable`) without the `apos.modulename` prefix.
* Widget modules may override their own options only, via `editable`. These overrides are honored *only while that specific widget is being rendered*. That is, they are accessible from a `module.getOption` call made from `widget.html` or something invoked by it. Because they are not full-page experiences, widgets *may not* override the options of other modules.

## 2.0.1

Fixed incorrect option name in docs. No code changes.

## 2.0.0

Initial release.
