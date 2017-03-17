function() {
   var allLabels = 'buf and or xor not nand nor xnor'.split(' ');
   this.labels = 'buf and or xor'.split(' ');
   this.invert = 0;

   this.onSwipe[0] = ['invert', function() { this.invert = 1 - this.invert; }];

   this.codes = [
      '     x>0.5' ,    'min(x>0.5,y>0.5)',    'max(x>0.5,y>0.5)','(x>0.5)!=(y>0.5)',
      '1 - (x>0.5)','1 - min(x>0.5,y>0.5)','1 - max(x>0.5,y>0.5)','(x>0.5)==(y>0.5)'
   ];

   this.IDENT = [ [[-.5,.4],[.5,0],[-.5,-.4]], [[-.5,-.4],[-.5,.4]] ];
   this.AND   = [ [[-.5,.4]].concat(arc(.1, 0, .4, PI/2, -PI/2, 12))
                            .concat([[-.5,-.4]]), [[-.5,-.4], [-.5,.4]] ];
   this.OR    = [ [[-.5,.4]].concat(arc( -.2 ,-.4, .80,  PI/2  ,  PI/6  , 12)),
                                    arc( -.2 , .4, .80, -PI/6  , -PI/2  , 12).concat([[-.5,-.4]]),
                            arc(-0.904,  0, .565, -PI/4  ,  PI/4  , 12) ];
   this.X     =             arc(-1.00,  0, .51,  PI/3.5, -PI/3.5, 12);

   this.INVERT = arc(.6, .0, .1, PI, -PI, 24);

   this.s = -1;

   this.prevTime = 0;

   this.timerStart = 0;
   this.value = 0;

   this.getDelayedValue = function() {
      // Should only be called on 'buf' or 'not' gates.
      let delayAmount = this.inputs.hasValue(1) ? this.inputs.value(1).value : 0;
      if (time > this.timerStart + delayAmount) {
         this.value = this.inputs.hasValue(0) ? this.inputs.value(0).value : false;
         this.timerStart = time;
      }
      return this.value;
   }

   function xor(a, b) { return a == b ? 0 : 1; }

   this.render = function() {
      m.scale(this.size / 180);
      var s = this.selection;
      var si = s + 4 * this.invert;

      if (this.code == null)
         this.code = [['', this.codes[si]]];

      switch (s) {
      case 0: mCurve(this.IDENT[0]); break;
      case 1: mCurve(this.AND  [0]); break;
      case 2: mCurve(this.OR   [0]);
              mCurve(this.OR   [1]); break;
      case 3: mCurve(this.X    );
              mCurve(this.OR   [0]);
              mCurve(this.OR   [1]); break;
      }
      switch (s) {
      case 0: mCurve(this.IDENT[1]); break;
      case 1: mCurve(this.AND  [1]); break;
      case 2:
      case 3: mCurve(this.OR   [2]); break;
      }
      if (this.invert)
         mCurve(this.INVERT);

      this.afterSketch(function() {
         textHeight(this.mScale(0.25));
         color(fadedColor(0.5, this.colorId));
         var x = ([-0.23,-0.05,-0.04,-0.01,-0.22,-0.04,-0.01, 0.02])[s];
         mText(allLabels[si], [x, .03], .5, .5);
      });
   }

   this.setup = function() {
      // Set up the input ports in the setup function so that we can support different 
      // input configurations for the different sketches.
      // This ensures that the input port setup happens AFTER the "selection" variable is set.
      switch (this.selection) {
         case 0: // For buffers, allow for a propagation delay and only one boolean input.
            this.defineInput("Bool");
            this.defineInput("Float");
            break;
         case 1:
         case 2:
         case 3:
            this.defineInput("Bool");
            this.defineInput("Bool");
            break;
      }
   }

   this.defineOutput("Bool", function() {
      var s  = this.selection;
      return new AT.Bool(this.evalCode(this.codes[s + 4 * this.invert],
         s==0 ? this.getDelayedValue()
              : (this.inputs.hasValue(0) ? this.inputs.value(0).value : false),
         (this.inputs.hasValue(1) ? this.inputs.value(1).value : false)));
   });
}

