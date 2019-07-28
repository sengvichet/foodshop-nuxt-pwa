<template>
<div>
      <div v-bind:class="{ blur: is_blur }">
      <h1 class="app-ui-overlay__content--title">{{$t('shop.videos.title')}}</h1>
      <div v-if="!pageloading" class="list-bar__container">
        <Video
        v-if = "!pageloading"
        v-for="(video,index) in videos"
        :key="video.objectId"
        :video_id_prop="video.objectId"
        :video_name_prop="video.objectName"
        :video_youtube_prop="video.objectYoutubeUrl"
        :video_desc_prop="video.objectDesc"
        @setVideo="setVideo"
         />
      </div>
    </div>

    <WatchVideoModal
    v-if="!pageloading"
    ref="WatchVideoModal"
    :modal_title="name"
    :video_emded_url="url"
     />


</div>
</template>
<script>
import {
  API
} from "aws-amplify";

import Video from '~/components/Videos/Video.vue'
import WatchVideoModal from '~/components/Videos/WatchVideoModal.vue'

export default {

  components: {
    Video,
    WatchVideoModal
  },
  layout:'widenoblur',
  data() {
    return {
      videos:[],
      pageloading:false,
      is_blur:this.$store.getters.theme.blur,
      shop_id:this.$store.getters.shop.shop_id,
      name:'',
      url:''
    }
  },
  created () {
    this.mixpanelTrack('Page View: Videos Page');
  },
  computed:{
  checkBlur() { return this.$store.getters.theme.blur }

  },
  watch: {
  checkBlur(newValue) {
    this.is_blur = this.$store.getters.theme.blur
  }
},

  async created() {

    try {

      if (!this.$store.getters.shop.show_videos_page) {

        await this.$router.push('/menu')
      }


      this.pageloading = true
      await this.listVideos();

    } catch (e) {
      bugsnagClient.notify(e)
      this.$notify.error(e.message, 'success')
    }

  },
  methods : {

    setVideo (name,url) {
      this.name = name
      this.url = url
      this.mixpanelTrack('Video Play: Videos Page',{
        name,
        url
      })
      this.$nextTick(() => {
			this.showWatchVideoModal()
		});

    },

    showWatchVideoModal() {
      this.pageloading= true
      this.$refs.WatchVideoModal.showWatchVideoModal()
      this.pageloading = false
    },
     listVideos () {

      this.videos = []

     API.get("metamat", "/cart/videos/"+this.shop_id).then((videos) => {

        this.videos = videos
        this.pageloading = false

      })

    }

  }

}
</script>
