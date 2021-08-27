exports.newPost = function newPost() {

    let thisObject = {
        emitterUserProfileId: undefined,
        targetUserProfileId: undefined,
        emitterPostHash: undefined,
        targetPostHash: undefined,
        postType: undefined,
        timestamp: undefined,
        replies: undefined,
        reactionsCount: undefined,
        reactionTypesCount: undefined,
        addReaction: addReaction,
        removeReactions: removeReaction,
        initialize: initialize,
        finalize: finalize
    }

    const POST_TYPES = {
        NEW_MULTI_MEDIA_POST: 10,
        REPLY_TO_MULTI_MEDIA_POST: 11,
        REPOST_MULTI_MEDIA: 12,
        QUOTE_REPOST_MULTI_MEDIA: 13,
        NEW_TRADE_POST: 20,
        REPLY_TO_TRADE_POST: 21,
        RE_POST_TRADE: 22,
        QUOTE_REPOST_TRADE: 23
    }

    const REACTION_TYPES = {
        REACTION_LIKE: 0,
        REACTION_LOVE: 1,
        REACTION_HAHA: 2,
        REACTION_WOW: 3,
        REACTION_SAD: 4,
        REACTION_ANGRY: 5,
        REACTION_HUG: 6
    }

    thisObject.reactionTypesCount = 7

    thisObject.reactionsCount = new Map()
    thisObject.reactionsCount.set(REACTION_TYPES.REACTION_LIKE, 0)
    thisObject.reactionsCount.set(REACTION_TYPES.REACTION_LOVE, 0)
    thisObject.reactionsCount.set(REACTION_TYPES.REACTION_HAHA, 0)
    thisObject.reactionsCount.set(REACTION_TYPES.REACTION_WOW, 0)
    thisObject.reactionsCount.set(REACTION_TYPES.REACTION_SAD, 0)
    thisObject.reactionsCount.set(REACTION_TYPES.REACTION_ANGRY, 0)
    thisObject.reactionsCount.set(REACTION_TYPES.REACTION_HUG, 0)

    return thisObject

    function finalize() {
        thisObject.emitterUserProfileId = undefined
        thisObject.targetUserProfileId = undefined
        thisObject.emitterPostHash = undefined
        thisObject.targetPostHash = undefined
        thisObject.postType = undefined
        thisObject.timestamp = undefined
        thisObject.replies = undefined
    }

    function initialize(
        emitterUserProfileId,
        targetUserProfileId,
        emitterPostHash,
        targetPostHash,
        postType,
        timestamp
    ) {

        thisObject.emitterUserProfileId = emitterUserProfileId
        thisObject.targetUserProfileId = targetUserProfileId
        thisObject.emitterPostHash = emitterPostHash
        thisObject.targetPostHash = targetPostHash
        thisObject.postType = postType
        thisObject.timestamp = timestamp

        thisObject.replies = []
        /*
        Let's find the Target Post
        */
        let targetPost

        if (
            event.eventType === POST_TYPES.REPLY_TO_MULTI_MEDIA_POST ||
            event.eventType === POST_TYPES.REPOST_MULTI_MEDIA ||
            event.eventType === POST_TYPES.QUOTE_REPOST_MULTI_MEDIA ||
            event.eventType === POST_TYPES.REPLY_TO_TRADE_POST ||
            event.eventType === POST_TYPES.RE_POST_TRADE ||
            event.eventType === POST_TYPES.QUOTE_REPOST_TRADE
        ) {
            targetPost = NT.memory.maps.POSTS.get(thisObject.targetPostHash)

            if (targetPost === undefined) {
                throw ('Target Post Not Found.')
            }
        }
        /*
         Let's add this post to the replies of the Target Post
         */
        if (
            event.eventType === POST_TYPES.REPLY_TO_MULTI_MEDIA_POST ||
            event.eventType === POST_TYPES.REPLY_TO_TRADE_POST
        ) {
            targetPost.replies.push(thisObject)
        }
    }

    function addReaction(reactionType) {
        let reactionCount = thisObject.reactionsCount.get(reactionType)

        if (reactionCount === undefined) {
            throw ('Reaction Type Not Supported.')
        }

        thisObject.reactionsCount.set(reactionType, reactionsCount + 1)
    }

    function removeReaction(reactionType) {
        let reactionCount = thisObject.reactionsCount.get(reactionType)

        if (reactionCount === undefined) {
            throw ('Reaction Type Not Supported.')
        }

        thisObject.reactionsCount.set(reactionType, reactionsCount - 1)
    }
}