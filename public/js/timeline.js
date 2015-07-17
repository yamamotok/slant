(function(root){

    function TimeLine() {
        this.buffer = [];
    }

    TimeLine.prototype.findPostByInternalId = function(internalId) {
        var found = null;
        this.buffer.some(function(post){
            if (post.internalId == internalId) {
                found = post;
                return true;
            }
            return false;
        });
        return found;
    };

    TimeLine.prototype.findPostByFirebaseKey = function(firebaseKey) {
        var found = null;
        this.buffer.some(function(post){
            if (post.firebaseKey == firebaseKey) {
                found = post;
                return true;
            }
            return false;
        });
        return found;
    };

    root.TimeLine = TimeLine;

})(window);

