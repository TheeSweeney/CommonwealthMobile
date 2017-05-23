import Kefir from "kefir";

// https://github.com/rpominov/kefir/issues/88#issuecomment-99817611
export default function() {
    var emitter;
    var stream = Kefir.stream(function(_emitter) {
        emitter = _emitter;
        return function unsubscribe() {
            emitter = undefined;
        };
    });

    stream.emit = function(x) {
        emitter && emitter.emit(x);
        return this;
    };

    stream.error = function(x) {
        emitter && emitter.error(x);
        return this;
    };

    stream.end = function() {
        emitter && emitter.end();
        return this;
    };

    stream.emitEvent = function(x) {
        emitter && emitter.emitEvent(x);
        return this;
    };

    return stream.setName("emitter");
}
