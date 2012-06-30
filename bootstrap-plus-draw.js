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
        
      this.addPoint(x, y)
      this.drawPoint(x, y, 1)
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

      this.addLine(x, y)
      this.drawLine(x, y)
    }
    , drawPoint: function(x, y) {
      var c = this.c
      c.beginPath()
      c.moveTo(x, y)
    }

    , drawLine: function(x, y) {
      var c = this.c      
      c.lineTo(x, y)
      c.stroke()
    }

    , addPoint: function(x, y) {
      this.points.push({ x: x, y: y, t: new Date().getTime(), p: true })
    }

    , addLine: function(x, y) {
      this.points.push({ x: x, y: y, t: new Date().getTime(), p: false })
    }

    , clear: function() {
      var c = this.c
        , $canvas = this.$canvas
      c.clearRect(0, 0, $canvas.width(), $canvas.height())
      this.points = []
    }

    , play: function(data) {
      !data && (data = this.points)
      this.clear()
      var c = this.c
        , i

      for (i = 0; i < data.length; i++) {
        var pt = data[i]
          , x = pt.x
          , y = pt.y
          , t = pt.t
          , p = pt.p
          setTimeout(function(){
            (function(c, p, x, y){
              if (p) {
                c.beginPath()
                c.moveTo(x, y)
              } else {
                c.lineTo(x, y)
                c.stroke()
              }
            })(c, p, x, y)
          }, 0)
      }
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