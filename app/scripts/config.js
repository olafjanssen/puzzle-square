/*global require */

require.config({
    shim: {
        "amplify": {
            deps: ["jquery"],
            exports: "amplify"
        }
    },
    paths: {
        amplify: "../../bower_components/amplify/lib/amplify",
        jquery: "../../bower_components/jquery/dist/jquery",
        modernizr: "../../bower_components/modernizr/modernizr",
        requirejs: "../../bower_components/requirejs/require"
    },
    packages: [

    ]
});
