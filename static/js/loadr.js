/**
 * Created with IntelliJ IDEA.
 * User: tomek
 * Date: 10.06.2012
 * Time: 21:44
 * To change this template use File | Settings | File Templates.
 */

var use;

(function(global){

    var
        isBrowser = !!(typeof window !== 'undefined' && navigator && document),
        isOpera = typeof opera !== 'undefined' && opera.toString() === '[object Opera]',
        req = {},
        ctx = {},
        loaded = {}
    ;
    var baseUrl = "static/js/";
    var head;
    var baseElement;

    ctx.onScriptLoad = function(evt) {
        console.log("Script loaded " + evt.target.src);
    }

    ctx.onScriptError = function(evt) {
        console.log("Loading error " + evt.target.src);
    }

    if (isBrowser) {
        head = document.getElementsByTagName('head')[0];
        //If BASE tag is in play, using appendChild is a problem for IE6.
        //When that browser dies, this can be removed. Details in this jQuery bug:
        //http://dev.jquery.com/ticket/2709
        baseElement = document.getElementsByTagName('base')[0];
        if (baseElement) {
            head = baseElement.parentNode;
        }
    }



    req.load = function (context, url) {
        var config = (context && context.config) || {},
            node;
        if (isBrowser) {
            //In the browser so use a script tag
            node = document.createElement('script');
            node.type = 'text/javascript';
            node.charset = 'utf-8';

            //Set up load listener. Test attachEvent first because IE9 has
            //a subtle issue in its addEventListener and script onload firings
            //that do not match the behavior of all other browsers with
            //addEventListener support, which fire the onload event for a
            //script right after the script execution. See:
            //https://connect.microsoft.com/IE/feedback/details/648057/script-onload-event-is-not-fired-immediately-after-script-execution
            //UNFORTUNATELY Opera implements attachEvent but does not follow the script
            //script execution mode.
            if (node.attachEvent &&
                //Check if node.attachEvent is artificially added by custom script or
                //natively supported by browser
                //read https://github.com/jrburke/requirejs/issues/187
                //if we can NOT find [native code] then it must NOT natively supported.
                //in IE8, node.attachEvent does not have toString()
                //Note the test for "[native code" with no closing brace, see:
                //https://github.com/jrburke/requirejs/issues/273
                !(node.attachEvent.toString && node.attachEvent.toString().indexOf('[native code') < 0) &&
                !isOpera) {
                //Probably IE. IE (at least 6-8) do not fire
                //script onload right after executing the script, so
                //we cannot tie the anonymous define call to a name.
                //However, IE reports the script as being in 'interactive'
                //readyState at the time of the define call.
                useInteractive = true;

                node.attachEvent('onreadystatechange', context.onScriptLoad);
                //It would be great to add an error handler here to catch
                //404s in IE9+. However, onreadystatechange will fire before
                //the error handler, so that does not help. If addEvenListener
                //is used, then IE will fire error before load, but we cannot
                //use that pathway given the connect.microsoft.com issue
                //mentioned above about not doing the 'script execute,
                //then fire the script load event listener before execute
                //next script' that other browsers do.
                //Best hope: IE10 fixes the issues,
                //and then destroys all installs of IE 6-9.
                //node.attachEvent('onerror', context.onScriptError);
            } else {
                node.addEventListener('load', context.onScriptLoad, false);
                node.addEventListener('error', context.onScriptError, false);
            }
            node.src = url;

            //For some cache cases in IE 6-8, the script executes before the end
            //of the appendChild execution, so to tie an anonymous define
            //call to the module name (which is stored on the node), hold on
            //to a reference to this node, but clear after the DOM insertion.
            currentlyAddingScript = node;
            if (baseElement) {
                head.insertBefore(node, baseElement);
            } else {
                head.appendChild(node);
            }
            currentlyAddingScript = null;

            return node;
        }
    }


    /**
     * Calculate relative URL of module
     *
     * @param modname
     * @return {*}
     */
    function urlOfModule(modname) {
        var url;
        if (modname.match(/\.js$/)) {
            url = modname;
        } else {
            url = baseUrl + modname + ".js";
        }
        return url;
    }


    use = function(modname) {
        if (!loaded[modname]) {
            req.load(ctx, urlOfModule(modname));
            loaded[modname] = true;
        }
    }


}(this));