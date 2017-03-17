
function() {
   this.label = "Boolean";
   this.state = true;
   this.onClick = function() {this.state = ! this.state;}
   this.render = function() {
      lineWidth(this.mScale(0.2));
      if (this.output.func().value) {
         mLine([  0,1],[ 0,-1]);
         mLine([-.9,1],[.9, 1]);
      }
      else {
         mCurve([[.7,1],[-.5,1],[-.5,-1]]);
         mLine([-.5, 0],[ .1,0]);
      }
   }

   this.defineOutput("Bool",
      function() {
         if (this.inputs.hasValue(0)) {
            return this.inputs.value(0);
         }
         return new AT.Bool(this.state);
      }
   );

   this.defineInput("Bool");
}

