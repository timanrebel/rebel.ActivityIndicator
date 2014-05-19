/**
 * The ActivityIndicator Widget controller generates an ActivityIndicitor, which is hidden by default
 * 
 * @class sc.ActivityIndicator.controller.Widget
 */
_.extend(this, {
	construct: function(config) {
		config = config || {};

		$.activityIndicator.applyProperties({
			top: config.top,
			bottom: config.bottom,
			left: config.left,
			right: config.right,
			width: config.width,
			height: config.height
		});

		$.container.applyProperties({
			backgroundColor: config.backgroundColor
		});

		if(config.visible)
			$.show();
	},

	/**
	 * Show the ActivityIndicator
	 */
	show: function() {
		_keepAnimating = true;

		if($.container.visible === false) {
			_spinAnimation.addEventListener('complete', onSpinIsComplete);
			$.activityIndicator.animate(_spinAnimation);

			$.container.visible = true;
		}
	},
	
	/**
	 * Hide the ActivityIndicator. 
	 * 
	 * This is done via an Animation fading out the ActivityIndicator on iOS and directly on Android
	 */
	hide: function() {
		if($.container.visible === true) {
			// Fade out like native iOS activityIndicators
			if(OS_IOS) {
				_fadeOutAnimation.addEventListener('complete', onFadeOutIsComplete);
				
				$.container.animate(_fadeOutAnimation);
			}
			// Just hide
			else {
				$.container.visible = false;
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

/**
 * Animation used when hiding the ActivityIndicator
 * @private
 */
var _fadeOutAnimation = Ti.UI.createAnimation({
    curve: Ti.UI.ANIMATION_CURVE_EASE_IN_OUT,
    opacity: 0,
    duration: 300,
});

var _keepAnimating = true;

var _transform = Ti.UI.create2DMatrix().rotate(179);


var _spinAnimation = Titanium.UI.createAnimation({
	transform: _transform,
	duration: 500, // chage this value to adjust rotation speed
	curve: Ti.UI.ANIMATION_CURVE_LINEAR 
});

/**
 * Act on completion of the fade-out animation. Resetting the container into original configuration.
 * 
 * @param {Object} evt Event details
 */
function onFadeOutIsComplete(evt) {
	_fadeOutAnimation.removeEventListener('complete', onFadeOutIsComplete);
	
	$.container.visible = false;
	$.container.opacity = 1;

	_keepAnimating = false;
}

function onSpinIsComplete(evt) {
	if(!_keepAnimating) {
		_spinAnimation.removeEventListener('complete', onSpinIsComplete);
		return false;
	}

	// First overwrite transform, so spinner keeps spinning
	_transform = _transform.rotate(179);

	// Assign new transformation
	_spinAnimation.transform = _transform;
	
	// And do another animation
	$.activityIndicator.animate(_spinAnimation);
}