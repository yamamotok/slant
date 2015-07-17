(function(root){

    var postCounter = 0;
    var angleUpdateThreshold = 0.017; // 1deg
    var updateLockDuration = 500;

    function getNextId() {
        return ++ postCounter;
    }

    /**
     *
     * @constructor
     */
    function Post(data, firebaseKey) {
        if (!(data instanceof Object)) {
            data = {
                message: data || '',
                angle: 0.0,
                timestamp: Date.now()
            };
        }
        this.internalId = getNextId();
        this.message = data.message;
        this.firebaseKey = firebaseKey || '';
        this.angle = data.angle;
        this.timestamp = data.timestamp ? new Date(data.timestamp) : new Date(0);
        this._lockedUntil = 0;
    }

    Post.prototype.isLocked = function() {
        return this._lockedUntil - Date.now() > 0;
    };

    Post.prototype._lockForAWhile = function() {
        this._lockedUntil = Date.now() + updateLockDuration;
    };

    Post.prototype.setAngle = function(angle) {
        this._lockForAWhile();

        var oldAngle = this.angle;
        if (Math.abs(oldAngle - angle) < angleUpdateThreshold) {
            return;
        }
        this.angle = angle;
        root.broadcaster.dispatch('angleUpdated', {post: this});
    };

    Post.prototype.toString = function() {
        return this.message + " " + this.firebaseKey + " " + this.internalId;
    };

    Post.prototype.toFirebaseRecord = function() {
        return {
            internalId: this.internalId,
            message: this.message,
            angle: this.angle,
            timestamp: this.timestamp.getTime()
        }
    };

    root.Post = Post;

})(window);





