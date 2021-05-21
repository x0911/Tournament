<template>
  <v-container>
    <v-card>
      <div class="px-4">
        <v-chip
          :color="`${micPermission.color}--text`"
          class="font-weight-bold"
          small
        >
          {{ micPermission.status }}
        </v-chip>
      </div>
      <v-card-title>
        We need permission to access your microphone
      </v-card-title>
      <v-card-text>
        <!--  -->
      </v-card-text>
      <v-card-actions class="px-4">
        <v-btn @click="start()"> Start </v-btn>
        <v-btn ref="downloadBtn" href="/" :disabled="stopped === false">
          Download
        </v-btn>
        <v-btn @click="stop()"> Stop </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    micPermission: {
      status: null,
      color: null,
    },
    stopped: false,
    mediaRecorder: null,
  }),
  mounted() {
    this.promptMicrophone()
  },
  methods: {
    start() {
      const $this = this
      const handleSuccess = function (stream) {
        const options = { mimeType: 'audio/webm' }
        const recordedChunks = []
        $this.mediaRecorder = new MediaRecorder(stream, options)
        $this.mediaRecorder.addEventListener('dataavailable', function (e) {
          if (e.data.size > 0) {
            recordedChunks.push(e.data)
          }
        })
        $this.mediaRecorder.addEventListener('stop', function () {
          $this.$refs.downloadBtn.$el.href = URL.createObjectURL(
            new Blob(recordedChunks)
          )
          $this.$refs.downloadBtn.$el.download = 'acetest.wav'
        })
        $this.mediaRecorder.start()
      }
      navigator.mediaDevices
        .getUserMedia({ audio: true, video: false })
        .then(handleSuccess)
    },
    stop() {
      if (this.stopped === false) {
        this.mediaRecorder.stop()
        this.$set(this, 'stopped', true)
      }
    },
    promptMicrophone() {
      const setStatus = (state, color) => {
        this.$set(this.micPermission, 'state', state)
        this.$set(this.micPermission, 'color', color)
      }
      navigator.permissions
        .query({ name: 'microphone' })
        .then(function (result) {
          if (result.state === 'granted') {
            setStatus('Permission Granted', 'success-front')
          } else if (result.state === 'prompt') {
            setStatus('Permission in Prompt', '')
          } else if (result.state === 'denied') {
            setStatus('Permission Denied', 'error')
          }
          result.onchange = function () {
            if (result.state === 'granted') {
              setStatus('Permission Granted', 'success-front')
            } else if (result.state === 'prompt') {
              setStatus('Permission in Prompt', '')
            } else if (result.state === 'denied') {
              setStatus('Permission Denied', 'error')
            }
          }
        })
    },
  },
}
</script>
