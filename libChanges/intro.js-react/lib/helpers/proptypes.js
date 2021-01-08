'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.options = exports.hintPosition = exports.tooltipPosition = undefined;

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Intro.js tooltip position proptype.
 * @type {Function}
 */
var tooltipPosition = exports.tooltipPosition = _propTypes2.default.oneOf(['top', 'right', 'bottom', 'left', 'bottom-left-aligned', 'bottom-middle-aligned', 'bottom-right-aligned', 'auto']);

/**
 * Intro.js hint position proptype.
 * @type {Function}
 */
var hintPosition = exports.hintPosition = _propTypes2.default.oneOf(['top-middle', 'top-left', 'top-right', 'bottom-left', 'bottom-right', 'bottom-middle', 'middle-left', 'middle-right', 'middle-middle']);

var options = exports.options = _propTypes2.default.shape({
  nextLabel: _propTypes2.default.string,
  prevLabel: _propTypes2.default.string,
  skipLabel: _propTypes2.default.string,
  doneLabel: _propTypes2.default.string,
  hidePrev: _propTypes2.default.bool,
  hideNext: _propTypes2.default.bool,
  tooltipPosition: tooltipPosition,
  tooltipClass: _propTypes2.default.string,
  highlightClass: _propTypes2.default.string,
  exitOnEsc: _propTypes2.default.bool,
  exitOnOverlayClick: _propTypes2.default.bool,
  nextOnOverlayClick: _propTypes2.default.bool,
  showStepNumbers: _propTypes2.default.bool,
  keyboardNavigation: _propTypes2.default.bool,
  showButtons: _propTypes2.default.bool,
  showBullets: _propTypes2.default.bool,
  showProgress: _propTypes2.default.bool,
  scrollToElement: _propTypes2.default.bool,
  overlayOpacity: _propTypes2.default.number,
  scrollPadding: _propTypes2.default.number,
  positionPrecedence: _propTypes2.default.arrayOf(_propTypes2.default.string),
  disableInteraction: _propTypes2.default.bool,
  hintPosition: hintPosition,
  hintButtonLabel: _propTypes2.default.string,
  hintAnimation: _propTypes2.default.bool
});