import { Job } from 'bull'
import { ActivitypubHttpFetcherPayload, FetchType } from '@shared/models'
import { logger } from '../../../helpers/logger'
import { VideoModel } from '../../../models/video/video'
import { VideoCommentModel } from '../../../models/video/video-comment'
import { VideoShareModel } from '../../../models/video/video-share'
import { MVideoFullLight } from '../../../types/models'
import { crawlCollectionPage } from '../../activitypub/crawl'
import { createAccountPlaylists } from '../../activitypub/playlists'
import { processActivities } from '../../activitypub/process'
import { addVideoShares } from '../../activitypub/share'
import { addVideoComments } from '../../activitypub/video-comments'

async function processActivityPubHttpFetcher (job: Job) {
  logger.info('Processing ActivityPub fetcher in job %d.', job.id)

  const payload = job.data as ActivitypubHttpFetcherPayload

  let video: MVideoFullLight
  if (payload.videoId) video = await VideoModel.loadAndPopulateAccountAndServerAndTags(payload.videoId)

  const fetcherType: { [ id in FetchType ]: (items: any[]) => Promise<any> } = {
    'activity': items => processActivities(items, { outboxUrl: payload.uri, fromFetch: true }),
    'video-shares': items => addVideoShares(items, video),
    'video-comments': items => addVideoComments(items),
    'account-playlists': items => createAccountPlaylists(items)
  }

  const cleanerType: { [ id in FetchType ]?: (crawlStartDate: Date) => Promise<any> } = {
    'video-shares': crawlStartDate => VideoShareModel.cleanOldSharesOf(video.id, crawlStartDate),
    'video-comments': crawlStartDate => VideoCommentModel.cleanOldCommentsOf(video.id, crawlStartDate)
  }

  return crawlCollectionPage(payload.uri, fetcherType[payload.type], cleanerType[payload.type])
}

// ---------------------------------------------------------------------------

export {
  processActivityPubHttpFetcher
}
