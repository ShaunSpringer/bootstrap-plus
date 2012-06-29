!function ($) {

  "use strict"; // jshint ;_;

// must refactor this: 
// http://jsfiddle.net/dh3bj/

 /* DRAW PUBLIC CLASS DEFINITION
  * ============================== */

  var canvas = '[data-draw="canvas"]'
    , clear = '[data-draw="clear"]'
    , Draw = function (element, options) {
      this.options = $.extend({}, $.fn.draw.defaults, options)
      this.points = []
      this.date = new Date()
      this.$element = $(element).parent()
        .on('mousedown.draw.data-api', '[data-draw="canvas"]', $.proxy(this.start, this))
        .on('click', '[data-clear="draw"]', $.proxy(this.clear, this))
      this.$canvas = $(canvas, this.$element)
      this.c = this.$canvas.get(0).getContext('2d')
      this.offset = this.$element.offset()
    }

  Draw.prototype = {
    constructor: Draw

    , start: function(e) {
      e && e.preventDefault()

      this.$canvas
        .on('mouseup.draw.data-api', $.proxy(this.stop, this))
        .on('mouseout.draw.data-api', $.proxy(this.stop, this))
        .on('mousemove.draw.data-api', $.proxy(this.move, this))

      var x = e.offsetX
        , y = e.offsetY
        , c = this.c

      this.addPoint(x, y)
      c.beginPath()
      c.moveTo(x, y)
    }

    , stop: function(e) {
      e && e.preventDefault()

     this.$canvas
        .off('mouseup.draw.data-api', $.proxy(this.stop, this))
        .off('mouseout.draw.data-api', $.proxy(this.stop, this))
        .off('mousemove.draw.data-api', $.proxy(this.move, this))
    }

    , move: function(e) {
      e && e.preventDefault()

      var x = e.offsetX
        , y = e.offsetY
        , c = this.c

      this.addPoint(x, y)
      c.lineTo(x, y)
      c.stroke()
    }

    , addPoint: function(x, y) {
      this.points.push({ x: x, y: y, t: this.date.getTime() })
    }

    , clear: function() {
      var c = this.c
        , $canvas = this.$canvas
      c.clearRect(0, 0, $canvas.width(), $canvas.height());
    }
  } 

 /* DRAW PLUGIN DEFINITION
  * ======================== */

  $.fn.draw = function (option) {
    return this.each(function () {
      var $this = $(this)
        , options = $.extend({}, $.fn.draw.defaults, typeof option == 'object' && option)
      $this.data('draw', (new Draw(this, options)))
    })
  }

  $.fn.draw.defaults = {
    colors: ['#000']
  }

  $.fn.draw.Constructor = Draw

 /* BUTTON DATA-API
  * =============== */

  $(document).ready(function(){
    $('[data-draw]').draw();
  })

}(window.jQuery);