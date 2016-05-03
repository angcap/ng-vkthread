/**
 * worker.js - component of vkThread plugin.
 *
 * Copyright (c) 2013 - 2016 Vadim Kiryukhin ( vkiryukhin @ gmail.com )
 * https://github.com/vkiryukhin/vkthread
 * http://www.eslinstructor.net/vkthread/
 *
 */

(function() {
    var JSONfn = {
        parse: function(str, date2obj) {
            var iso8061 = date2obj ? /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/ : false;
            return JSON.parse(str, function(key, value) {
                if (typeof value != "string") return value;
                if (value.length < 8) return value;
                if (iso8061 && value.match(iso8061)) return new Date(value);
                if (value.substring(0, 8) === "function") return eval("(" + value + ")");
                if (value.substring(0, 8) === "_PxEgEr_") return eval(value.slice(8));
                return value
            })
        }
    };
    onmessage = function(e) {
        var obj = JSONfn.parse(e.data, true),
            cntx = obj.context || self;
        if (obj.importFiles) importScripts.apply(null, obj.importFiles);
        if(typeof obj.fn === "function" ){
          postMessage(obj.fn.apply(cntx, obj.args));
        } else {
          postMessage(self[obj.fn].apply(cntx, obj.args));
      }
    }
})();
