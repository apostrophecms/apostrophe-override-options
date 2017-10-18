This module allows configurable overrides of the `getOption` method and Nunjucks helper of Apostrophe modules, based on:

* The current piece type or user-editable settings of the piece, when viewing the "show" template (permalink page for that piece), *or*
* The current page type or user-editable settings of a current page, or those of an ancestor in the page tree, *or*
* User-editable settings of the `apostrophe-global` module, *or*
* The options actually configured for the module (this is the default behavior of `getOption`).

In addition, if the `apostrophe-workflow` module is present, settings based on piece types and page types can be localized, and module-level default settings can be localized as well.

## Override syntax

```javascript
module.exports = {
  name: 'landing-page',
  extend: 'apostrophe-custom-pages',
  addFields: [
    {
      name: 'analyticsEventId',
      type: 'string',
      label: 'Analytics Event ID',
      def: 'abc'
    }
  ],
  overrideOptions: {
    fixed: {
      // Note must begin with `apos.module-name` or `apos.moduleAlias`
      'apos.analytics-button-widgets.style': 'blue',
    },
    localized: {
      // Locales per `apostrophe-workflow` which must be in use
      'en': {
        'apos.analytics-button-widgets.style': 'purple',
      }
    },
    editable: {
      // `analyticsEventId` should be a schema field as seen above
      'apos.analytics-button-widgets.eventId': 'analyticsEventId'
    }
  }
};
```

The above code in the `landing-pages` module overrides what `getOption('style')` and `getOption('eventId')` will return in the `analytics-button-widgets` module.

The same technique may be used in a module that extends the `apostrophe-pieces` module, in which case it applies when the piece is being displayed on its own `show` page.

The technique may also be used in configuration of the `apostrophe-global` module, in which case it is most common to use the `editable` subproperty to make certain options of various modules overridable via the "global" admin bar item.

## Inexact URL matches and the `show` pages of pieces

In a best effort to take URLs that contain additional components beyond the slug of the page into account, this module honors `req.data.bestPage` if `req.data.page` is not yet set.

## Visibility of late option modifications

If the original options of a module are modified after `pageServe` time, those changes will not be accessible at all to `getOption` calls made for that particular request when this module is in use. However, since module options are not request-specific, it would almost never make sense to modify them after app launch time.

## Timing concerns

For performance, this module computes its results just before `pageServe` methods are invoked. At this point, `req.data.bestPage` has been set, and widgets are about to be loaded.

Any invocation of `getOption` before this point will invoke the default implementation.

However, `req.data.piece` is not set until the `pageServe` process is already underway. To address this issue, this module recomputes its results when a `show` page is encountered. This means that the impact of the piece type or piece settings will be honored in `getOption` calls in templates, or in JavaScript code invoked by `pageBeforeSend`. It is, however, too late for `getOption` to be honored inside the `load` methods of widgets on the page. 

You may optionally address this issue by passing this option to the `apostrophe-areas` module:

```javascript
modules: {
  'apostrophe-areas': {
    deferWidgetLoading: true
  }
}
```

With this change, areas invoke load methods for their widgets at the last possible moment, after all `pageBeforeSend` methods. This results in fewer database calls and also ensures that the impact of the current piece is visible in any `getOption` calls made by the widget loaders.

*This issue does not impact `widget.html` templates. If that is the only place you are making `getOption` calls for your widget you do not need to make this change.*

### Timing concerns with widget loaders for the `global` doc

Due to the middleware-based loading process for the `global` doc, `getOption` method calls by widget `load` methods for the `global` doc will not be able to see the impact of the current page in any scenario. Again, this impacts the load methods only, not `widget.html` files which **will** see it.

*TODO:* it may be possible to address this by further modifying `deferWidgetLoading` to defer the global doc to `pageBeforeSend` as well, which is invoked even if a page is being rendered via `sendPage`. This would need to be a new optional setting as developers invoking `renderPage` directly would not get widget loads this way.

## Options that cannot be overridden

Technically, `apos` itself is an option passed to each module. You cannot override properties of this object via the above syntax; an error will be reported. If Apostrophe allowed this the performance impact of deeply cloning the object to allow it to differ for each request would be prohibitive. Similarly you should avoid overriding properties of other large objects. Options that are configured in your modules using simple JSON-friendly data structures are much better candidates.
