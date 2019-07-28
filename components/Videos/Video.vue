<template>

  <div class="list-bar list-bar__product" @click.prevent="setVideo">

    <div class="list-bar__product-image" :style="{'background-image': 'url(' + video_image + ')' }"></div>
    <div class="list-bar__product-text">
      <div class="list-bar__product-heading-and-edit">
        <h5 class="list-bar__product-title">{{video_name}}</h5>
      </div>
      <p class="list-bar__product-description">{{video_desc}}</p>

    </div>


  </div>

</template>

<script>

export default {

  props : {
    video_id_prop: {
      type: String,
      required: true
    },
    video_name_prop: {
      type: String,
      required: true
    },
    video_youtube_prop: {
      type: String,
      required: true
    },
    video_desc_prop: {
      type: String,
      required: true
    }
  },
  data () {

    return {
      video_id: this.video_id_prop,
      video_name: this.video_name_prop,
      video_youtube: this.video_youtube_prop,
      video_desc: this.video_desc_prop,
      video_image: '',
      video_emded_url:'',
      isLoading:true,
      content:''
    }
  },
  created(){

    this.YouTubeGetImageURL(this.video_youtube)
  },
  methods : {

    setVideo() {
    this.$emit('setVideo',this.video_name,this.video_emded_url)
    },

    hideVideoModal () {
      this.content = ''
    },



   YouTubeGetImageURL(url){
     var ID = '';
    url = url.replace(/(>|<)/gi,'').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
    if(url[2] !== undefined) {
    ID = url[2].split(/[^0-9a-z_\-]/i);
    ID = ID[0];
    }
      else {
    ID = url;
  }
    this.video_image = 'https://img.youtube.com/vi/'+ID+'/0.jpg';
    this.video_emded_url = 'https://www.youtube.com/embed/'+ID+'?rel=0&amp;showinfo=0'
    this.isLoading = false
  }
  }

}
</script>
