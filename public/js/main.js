(function (root, $) {
    var numberOfPosts = 15;
    var supportTouch = 'ontouchend' in root.document;
    var timeline = root.timeline = new TimeLine();
    var broadcaster = root.broadcaster = new signals.Signal();
    var chatRoomName = root.chatRoomName;
    var fbMessageList = new Firebase('https://sweltering-torch-3371.firebaseio.com/chat/' + chatRoomName);

    function findElementOfPost(post) {
        return $('[postindex="' + post.internalId + '"]');
    }

    fbMessageList.limitToLast(numberOfPosts).on('child_added', function(snapshot) {
        var key = snapshot.key();
        var data = snapshot.val();
        var post = new root.Post(data, key);
        timeline.buffer.push(post);

        var elm = findElementOfPost(post);
        if (!elm) return;

        scrollToPost(elm);
        setRotatable(elm, $('.handle', elm));
        elm.rotatable('angle', data.angle);
    });

    fbMessageList.limitToLast(numberOfPosts).on('child_changed', function(snapshot) {
        var key = snapshot.key();
        var data = snapshot.val();
        var post = timeline.findPostByFirebaseKey(key);
        if (!post || post.isLocked()) {
            return;
        }

        var elm = findElementOfPost(post);
        if (!elm) return;

        elm.rotatable('angle', data.angle);
    });

    broadcaster.add(function(event, params){
        if (event == 'angleUpdated') {
            var fbMessage = fbMessageList.child(params.post.firebaseKey);
            fbMessage.set(params.post.toFirebaseRecord());
        }
    });

    function setRotatable(elm, handle) {
        var options = {
            // Callback fired on rotation start.
            start: function (event, ui) {
            },
            // Callback fired during rotation.
            rotate: function (event, ui) {
                var post = timeline.findPostByInternalId(ui.element.attr('postindex'));
                if (!post) {
                    return;
                }
                post.setAngle(ui.angle.current);
            },
            // Callback fired on rotation end.
            stop: function (event, ui) {
            },
            // Set the rotation center at (25%, 75%).
            rotationCenterX: 50.0,
            rotationCenterY: 50.0,

            supportTouch: supportTouch,

            handle: handle
        };
        elm.rotatable(options);
    }

    function scrollToPost(elm) {
        $('html,body').stop(false, false).animate({
            scrollTop: elm.offset().top
        }, 600);
    }

    function getMessageInput() {
        var message = document.forms['postForm']['message'].value;
        return message;
    }

    function submitPost() {
        var message = getMessageInput();
        if (!message) return;

        var fbMessage = fbMessageList.push();
        var post = new root.Post(message, fbMessage.key());
        if (!post) return;

        fbMessage.set(post.toFirebaseRecord());
    }
    root.submitPost = submitPost;

    $(document).ready(function(){
        // Create data bindings
        rivets.bind($('#posts'), {timeline: timeline});

        // Set rotatable
        $('.rotatable').each(function(index, elm){
            setRotatable($(elm), $('.handle', elm));
        });

        // Init revets
        rivets.formatters.date = function(value){
            return moment(value).format('MMM DD HH:mm, YYYY')
        }
    });

})(window, jQuery);


