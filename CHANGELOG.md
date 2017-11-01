## 2.1.0

* A module may now override its own options (for instance, via `editable`) without the `apos.modulename` prefix.
* Widget modules may override their own options only, via `editable`. These overrides are honored *only while that specific widget is being rendered*. That is, they are accessible from a `module.getOption` call made from `widget.html` or something invoked by it. Because they are not full-page experiences, widgets *may not* override the options of other modules.

## 2.0.1

Fixed incorrect option name in docs. No code changes.

## 2.0.0

Initial release.
