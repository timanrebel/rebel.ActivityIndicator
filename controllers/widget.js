/**
 * The ActivityIndicator Widget controller generates an ActivityIndicitor, which is hidden by default
 *
 * @class sc.ActivityIndicator.controller.Widget
 */
var Animator = require('com.animecyc.animator');

_.extend(this, {
	construct: function(config) {
		config = config || {};

		if(OS_IOS) {
			$.activityIndicator.applyProperties({
				top: config.top,
				bottom: config.bottom,
				left: config.left,
				right: config.right,
				width: config.width,
				height: config.height
			});

			$.getView().applyProperties({
				backgroundColor: config.backgroundColor
			});
		}

		if(config.visible)
			$.show();
	},

	/**
	 * Show the ActivityIndicator
	 */
	show: function() {
		if(_keepAnimating === false) {
			if(OS_IOS) {
				_.defer(function() {
					$.getView().open();

					Animator.animate($.activityIndicator, _spinAnimation);

					_keepAnimating = true;
				});
			}
			else {
				$.getView().show();
			}
		}
	},

	/**
	 * Hide the ActivityIndicator.
	 *
	 * This is done via an Animation fading out the ActivityIndicator on iOS and directly on Android
	 */
	hide: function() {
		if(_keepAnimating === true) {
			// Fade out like native iOS activityIndicators
			if(OS_IOS) {
				Animator.animate($.getView(), _fadeOutAnimation, onFadeOutIsComplete);
			}
			// // Just hide
			else {
				$.getView().hide();
			}
		}
	},

	/**
	 * Either show or hide the activityIndicator based on the boolean given
	 *
	 * @param {Boolan} bool True to shode, false to hide the activityIndicator
	 */
	setVisible: function(bool) {
		if(bool)
			$.show();
		else
			$.hide();
	}
});

var _keepAnimating = false;

/**
 * Animation used when hiding the ActivityIndicator
 * @private
 */
var _fadeOutAnimation = {
    opacity: 0,
    duration: 300,
	easing: Animator.LINEAR
};

/**
 * Animation used to rotate the view. 10 rotations in 10 seconds.
 * @private
 */
var _spinAnimation = {
    rotate: 3600,
    duration: 10000,
    easing: Animator.BOUNCE_OUT
};

function onCancel(evt) {
	Ti.API.info('cancel');
	$.hide();
}

/**
 * Act on completion of the fade-out animation. Resetting the container into original configuration.
 *
 * @param {Object} evt Event details
 */
function onFadeOutIsComplete(evt) {
	$.getView().close();
	$.getView().opacity = 1;

	_keepAnimating = false;
}
