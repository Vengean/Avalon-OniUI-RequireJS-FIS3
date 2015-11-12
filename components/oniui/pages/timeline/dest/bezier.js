/*
 * Copyright (C) 2008 Apple Inc. All Rights Reserved.
 *
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 * 1. Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright
 *    notice, this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY APPLE INC. ``AS IS'' AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
 * PURPOSE ARE DISCLAIMED.  IN NO EVENT SHALL APPLE INC. OR
 * CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 * EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
 * PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
 * PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
 * OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. 
 */

/**
 * JavaScript port of Webkit implementation of CSS cubic-bezier(p1x.p1y,p2x,p2y) by http://mck.me
 * http://svn.webkit.org/repository/webkit/trunk/Source/WebCore/platform/graphics/UnitBezier.h
 */
var Bezier = (function(){
	'use strict';

	/**
	 * Duration value to use when one is not specified (400ms is a common value).
	 * @const
	 * @type {number}
	 */
	var DEFAULT_DURATION = 400;//ms

	/**
	 * The epsilon value we pass to UnitBezier::solve given that the animation is going to run over |dur| seconds.
	 * The longer the animation, the more precision we need in the timing function result to avoid ugly discontinuities.
	 * http://svn.webkit.org/repository/webkit/trunk/Source/WebCore/page/animation/AnimationBase.cpp
	 */
	var solveEpsilon = function(duration) {
		return 1.0 / (200.0 * duration);
	};

	/**
	 * Defines a cubic-bezier curve given the middle two control points.
	 * NOTE: first and last control points are implicitly (0,0) and (1,1).
	 * @param p1x {number} X component of control point 1
	 * @param p1y {number} Y component of control point 1
	 * @param p2x {number} X component of control point 2
	 * @param p2y {number} Y component of control point 2
	 */
	var unitBezier = function(p1x, p1y, p2x, p2y) {
	
		// private members --------------------------------------------

		// Calculate the polynomial coefficients, implicit first and last control points are (0,0) and (1,1).

		/**
		 * X component of Bezier coefficient C
		 * @const
		 * @type {number}
		 */
		var cx = 3.0 * p1x;

		/**
		 * X component of Bezier coefficient B
		 * @const
		 * @type {number}
		 */
		var bx = 3.0 * (p2x - p1x) - cx;

		/**
		 * X component of Bezier coefficient A
		 * @const
		 * @type {number}
		 */
		var ax = 1.0 - cx -bx;

		/**
		 * Y component of Bezier coefficient C
		 * @const
		 * @type {number}
		 */
		var cy = 3.0 * p1y;

		/**
		 * Y component of Bezier coefficient B
		 * @const
		 * @type {number}
		 */
		var by = 3.0 * (p2y - p1y) - cy;

		/**
		 * Y component of Bezier coefficient A
		 * @const
		 * @type {number}
		 */
		var ay = 1.0 - cy - by;

		/**
		 * @param t {number} parametric timing value
		 * @return {number}
		 */
		var sampleCurveX = function(t) {
			// `ax t^3 + bx t^2 + cx t' expanded using Horner's rule.
			return ((ax * t + bx) * t + cx) * t;
		};

		/**
		 * @param t {number} parametric timing value
		 * @return {number}
		 */
		var sampleCurveY = function(t) {
			return ((ay * t + by) * t + cy) * t;
		};

		/**
		 * @param t {number} parametric timing value
		 * @return {number}
		 */
		var sampleCurveDerivativeX = function(t) {
			return (3.0 * ax * t + 2.0 * bx) * t + cx;
		};

		/**
		 * Given an x value, find a parametric value it came from.
		 * @param x {number} value of x along the bezier curve, 0.0 <= x <= 1.0
		 * @param epsilon {number} accuracy limit of t for the given x
		 * @return {number} the t value corresponding to x
		 */
		var solveCurveX = function(x, epsilon) {
			var t0;
			var t1;
			var t2;
			var x2;
			var d2;
			var i;

			// First try a few iterations of Newton's method -- normally very fast.
			for (t2 = x, i = 0; i < 8; i++) {
				x2 = sampleCurveX(t2) - x;
				if (Math.abs (x2) < epsilon) {
					return t2;
				}
				d2 = sampleCurveDerivativeX(t2);
				if (Math.abs(d2) < 1e-6) {
					break;
				}
				t2 = t2 - x2 / d2;
			}

			// Fall back to the bisection method for reliability.
			t0 = 0.0;
			t1 = 1.0;
			t2 = x;

			if (t2 < t0) {
				return t0;
			}
			if (t2 > t1) {
				return t1;
			}

			while (t0 < t1) {
				x2 = sampleCurveX(t2);
				if (Math.abs(x2 - x) < epsilon) {
					return t2;
				}
				if (x > x2) {
					t0 = t2;
				} else {
					t1 = t2;
				}
				t2 = (t1 - t0) * 0.5 + t0;
			}

			// Failure.
			return t2;
		};

		/**
		 * @param x {number} the value of x along the bezier curve, 0.0 <= x <= 1.0
		 * @param epsilon {number} the accuracy of t for the given x
		 * @return {number} the y value along the bezier curve
		 */
		var solve = function(x, epsilon) {
			return sampleCurveY(solveCurveX(x, epsilon));
		};

		// public interface --------------------------------------------

		/**
		 * Find the y of the cubic-bezier for a given x with accuracy determined by the animation duration.
		 * @param x {number} the value of x along the bezier curve, 0.0 <= x <= 1.0
		 * @param duration {number} the duration of the animation in milliseconds
		 * @return {number} the y value along the bezier curve
		 */
		return function(x, duration) {
			return solve(x, solveEpsilon(+duration || DEFAULT_DURATION));
		};
	};

	// http://www.w3.org/TR/css3-transitions/#transition-timing-function
	return {
		/**
		 * @param x {number} the value of x along the bezier curve, 0.0 <= x <= 1.0
		 * @param duration {number} the duration of the animation in milliseconds
		 * @return {number} the y value along the bezier curve
		 */
		linear: unitBezier(0.0, 0.0, 1.0, 1.0),

		/**
		 * @param x {number} the value of x along the bezier curve, 0.0 <= x <= 1.0
		 * @param duration {number} the duration of the animation in milliseconds
		 * @return {number} the y value along the bezier curve
		 */
		ease: unitBezier(0.25, 0.1, 0.25, 1.0),

		/**
		 * @param x {number} the value of x along the bezier curve, 0.0 <= x <= 1.0
		 * @param duration {number} the duration of the animation in milliseconds
		 * @return {number} the y value along the bezier curve
		 */
		easeIn: unitBezier(0.42, 0, 1.0, 1.0),

		/**
		 * @param x {number} the value of x along the bezier curve, 0.0 <= x <= 1.0
		 * @param duration {number} the duration of the animation in milliseconds
		 * @return {number} the y value along the bezier curve
		 */
		easeOut: unitBezier(0, 0, 0.58, 1.0),

		/**
		 * @param x {number} the value of x along the bezier curve, 0.0 <= x <= 1.0
		 * @param duration {number} the duration of the animation in milliseconds
		 * @return {number} the y value along the bezier curve
		 */
		easeInOut: unitBezier(0.42, 0, 0.58, 1.0),
		unitBezier: unitBezier,
		/**
		 * @param p1x {number} X component of control point 1
		 * @param p1y {number} Y component of control point 1
		 * @param p2x {number} X component of control point 2
		 * @param p2y {number} Y component of control point 2
		 * @param x {number} the value of x along the bezier curve, 0.0 <= x <= 1.0
		 * @param duration {number} the duration of the animation in milliseconds
		 * @return {number} the y value along the bezier curve
		 */
		cubicBezier: function(p1x, p1y, p2x, p2y, x, duration) {
			return unitBezier(p1x, p1y, p2x, p2y)(x, duration);
		}
	};
})();

//AMD adapter
define(function() {
    return Bezier;
});