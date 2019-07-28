<template lang="html">
  <div class="">
    <!-- invisible button for readers etc. accessibility ftw.-->
    <svg width="120" height="120">
        <!-- white circle with dropshadow -->
        <defs>
          <filter id="f1" x="-20%" y="-20%" width="300%" height="300%">
            <feOffset result="offOut" in="SourceGraphic" dx="0" dy="2" />
            <feColorMatrix result="matrixOut" in="offOut" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0" />
            <feGaussianBlur result="blurOut" in="matrixOut" stdDeviation="2" />
            <feBlend in="SourceGraphic" in2="blurOut" mode="normal" />
          </filter>
        </defs>
        <g @mousedown="mousePressed($event, true)"
           @touchstart="startLoader(1)"
           @mouseup="stopLoader()"
           @mouseleave="stopLoader()"
           @touchend="stopLoader()"
           @touchcancel="stopLoader()">

          <circle class="button-round"
                  cx="60"
                  cy="60"
                  r="27.5"
                  fill="#fff"
                  stroke="none"
                  filter="url(#f1)"/>

          <!-- garbage can icon, copied from assets/images/icons/Icon-Garbage-Can-Red.svg -->
          <svg viewBox="-47.5 -47.5 120 120">

             <path style="transform: scale(2);" fill="#FF8181" fill-rule="nonzero" d="M6.144 11.644a.322.322 0 0 0 .323-.323V4.528a.323.323 0 1 0-.646 0v6.792a.323.323 0 0 0 .323.324zm-1.618 0a.322.322 0 0 0 .323-.323l-.322-6.793a.323.323 0 0 0-.646 0l.323 6.792a.323.323 0 0 0 .323.324zm7.44-9.38h-2.91v-.97C9.056.579 8.477 0 7.763 0H4.527c-.715 0-1.294.58-1.294 1.294v.97H.323a.323.323 0 1 0 0 .645H1.68l.907 9.38c0 .714.58 1.294 1.294 1.294H8.41c.715 0 1.294-.58 1.294-1.294l.906-9.378h1.357a.324.324 0 0 0 0-.647zm-8.085-.97a.647.647 0 0 1 .647-.648h3.235a.647.647 0 0 1 .646.648v.97H3.881v-.97zM9.056 12.29a.647.647 0 0 1-.648.646H3.88a.647.647 0 0 1-.647-.647l-.908-9.38h7.637l-.907 9.38zm-1.293-.647a.322.322 0 0 0 .322-.323l.323-6.793a.323.323 0 1 0-.646 0l-.323 6.792a.322.322 0 0 0 .324.324z"/>
          </svg>
        </g>
        <!-- the white loading-ring 2 * pi * 40 = 251.327-->
        <circle id="loader"
                v-if="isLoading"
                transform="rotate(-90 60 60)"
                cx="60"
                cy="60"
                r="40"
                fill="none"
                :stroke="`rgb(${this.loaderColor.r}, ${this.loaderColor.g}, ${this.loaderColor.b})`"
                stroke-width="8"
                stroke-dasharray="251.327 251.327"
                stroke-dashoffset="251.327"
              />
    </svg>

  </div>
</template>

<script>
export default {
  data(){
    return {
      circumference: 251.327,
      strokeLength: 0,
      stroke: {},
      loaderPercent: 0,
      loaderTimer: false,
      reverseLoaderTimer: false,
      isLoading: false,
      loaderColor: {r: 255, g: 255, b: 255}
    }
  },
  computed: {

  },
  created(){

  },
  methods: {
    mousePressed(event, bool){
      if(event.which == 1){
        this.startLoader(1);
      }
    },
    startLoader(increment){
      this.isLoading = true;
      console.log('started loader');
      if(!this.loaderTimer){
        if(this.reverseLoaderTimer){
          this.stopReverseLoader();
        }
        this.loaderTimer = setInterval(() => {this.updateLoader(increment)}, 10);
      }

    },
    updateLoader(increment){
      this.loaderPercent += increment;
      if(this.loaderPercent >= 100){
        this.loaderPercent = 0;
        this.stopLoader();
        this.isLoading = false;
        this.wasClicked();
      }

      // this.loaderColor.r += 2;
      // this.loaderColor.g -= 2;

      var loader = document.querySelector('#loader');

      loader.style.strokeDashoffset = 251.327 -((this.loaderPercent/100) * 251.327);
    },
    stopLoader(){
      console.log('stopped loader');
    	clearInterval(this.loaderTimer);
      this.loaderTimer = false;
      // if(this.loaderPercent > 0){
      //   this.startReverseLoader();
      // }
      this.loaderColor = {r: 255, g: 255, b: 255};
      this.loaderPercent = 0;
      // this.stopLoader();
      this.isLoading = false;
    },
    wasClicked(){
      console.log('clicked!');
      this.$emit('was_clicked', true);
    },
    startReverseLoader(){
      console.log('started reverse loader');
      if(!this.reverseLoaderTimer){
        // this.loaderTimer = window.setInterval(this.updateReverseLoader(), 30);
        this.reverseLoaderTimer = setInterval(() => {this.updateReverseLoader(-3)}, 1);
      }
    },
    updateReverseLoader(increment){
      this.loaderPercent += increment;
      console.log('derp');
      if(this.loaderPercent <= 0){
        this.loaderPercent = 0;
        this.stopReverseLoader();
        this.isLoading = false;
        console.log('derp');
      }
      var loader = document.querySelector('#loader');

      loader.style.strokeDashoffset = 251.327 -((this.loaderPercent/100) * 251.327);
    },
    stopReverseLoader(){
      console.log('stopped reverse loader');
    	clearInterval(this.reverseLoaderTimer);
      this.reverseLoaderTimer = false;
    },

  }
}
</script>

<style lang="css" scoped>
  .off-screen {
    float: left;
    left: 99999px;
  }
</style>
