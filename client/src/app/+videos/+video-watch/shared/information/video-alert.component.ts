import { Component, Input } from '@angular/core'
import { VideoDetails } from '@app/shared/shared-main'
import { VideoState } from '@shared/models'

@Component({
  selector: 'my-video-alert',
  templateUrl: './video-alert.component.html',
  styleUrls: [ './video-alert.component.scss' ]
})
export class VideoAlertComponent {
  @Input() video: VideoDetails

  isVideoToTranscode () {
    return this.video && this.video.state.id === VideoState.TO_TRANSCODE
  }

  isVideoToEdit () {
    return this.video && this.video.state.id === VideoState.TO_EDIT
  }

  isVideoTranscodingFailed () {
    return this.video && this.video.state.id === VideoState.TRANSCODING_FAILED
  }

  isVideoMoveToObjectStorageFailed () {
    return this.video && this.video.state.id === VideoState.TO_MOVE_TO_EXTERNAL_STORAGE_FAILED
  }

  isVideoToImport () {
    return this.video && this.video.state.id === VideoState.TO_IMPORT
  }

  isVideoToMoveToExternalStorage () {
    return this.video && this.video.state.id === VideoState.TO_MOVE_TO_EXTERNAL_STORAGE
  }

  hasVideoScheduledPublication () {
    return this.video?.scheduledUpdate !== undefined
  }

  isWaitingForLive () {
    return this.video?.state.id === VideoState.WAITING_FOR_LIVE
  }

  isLiveEnded () {
    return this.video?.state.id === VideoState.LIVE_ENDED
  }
}
