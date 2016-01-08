(function(map){
    (function(a, b){
        console.log(a);
    })(map(0, 1, 2), map(2, 1, 0));
})(function(letters){
    return function(){
        var args = arguments, ret = '';
        for(var i = 0, len = args.length; i < len; i++){
            ret += letters[args[i]];
        }
        return ret;
    }
}(['a', 'b', 'c']));