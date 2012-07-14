(function( $, window, document, undefined ) {
    $.fn.ZenjiTemplate = function(dataSource){
        var template = $.trim(this.html());
        var dataSourceSize = $(dataSource).size();
        var loopedTemplatedText = '';
        for(var i =0;i<dataSourceSize;i++){
            elem = dataSource[i];
            var loopedTemplate = template;
            for(propertyName in elem){
                loopedTemplate = loopedTemplate.replace(new RegExp('{{'+propertyName+'}}','g'),elem[propertyName]);

            }
            loopedTemplatedText += loopedTemplate;
        }
        return $(loopedTemplatedText);

    };

})( jQuery, window, document );