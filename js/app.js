angular
    .module('CrosslightApp', ['crosslight.nodejs', 'ui.tree',
                              'object.minispice', 'object.paper', 'object.canvaspaper', 'object.meshgenerator', 'object.component', 'object.editor', 'object.filetree','object.filereader',
                              'tool.canvas', 'tool.drawline',
                              'paper.events', 'shortcut.event',
                              'filetree', 'editors.directive', 'popwindow.directive', 'header.directive', 'rightmenu.directive',
                              'circuit.controller','quick.controller','editor.controller', 'rightmenu.controller', 'drawingTool.controller', 'drawingTool.directive'])

    .config( [
        '$compileProvider',
        function( $compileProvider )
        {
            $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|local|data|chrome-extension):/);
            $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension):/);
        }
    ])

    .run(function ($rootScope, minispice, meshgenerator) {
        $rootScope.minispice =  minispice.createMiniSpice();
        $rootScope.meshgenerator =  meshgenerator.createMeshgenerator();               

    })

    .controller('MainController', ['$rootScope', '$scope', '$sce', 'file', function ($rootScope, $scope, $sce, file) {
        
        // $rootScope.minispice.createPaper().initPaper();
        // $rootScope.meshgenerator.createCanvasPaper().initPaper();
        $rootScope.minispice.init();

        $rootScope.trustSrc = function(src) {
            return $sce.trustAsResourceUrl(src);
        };
    }]);

