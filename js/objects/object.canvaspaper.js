'use strict';

angular
        .module('object.canvaspaper', [])
        .factory('canvaspaper', ['$rootScope', function ($rootScope) {
            var factory = {};
            var CanvasPaper = (function(){
                var CanvasPaper = function(){
                    return new CanvasPaper.fn.paper();
                };
                //let paperTool = canvas.create(); 
                //let drawTool = drawline.createDrawLineTool();               

                CanvasPaper.fn = CanvasPaper.prototype = {
                    constructor: CanvasPaper,

                    paper: function(){
                        /*paper*/
                        
                        this.initPaper = function(){
                            this._initPaper();    
                        };
                        this.canvas = function(){
                            this._canvas();    
                        };
                    },
                    _initPaper: function(){
                        var canvas = new fabric.Canvas('drawingContainer',{
                            width: 1500,
                            height: 2000,
                            backgroundColor: 'gray'
                        });
                        var rect = new fabric.Rect({
                            left: 100,
                            top: 100,
                            fill: 'red',
                            width: 800,
                            height: 600
                            });
                            // "add" rectangle onto canvas
                            canvas.add(rect);

                    },
                    _canvas: function(){
                        var canvas = new fabric.Canvas('drawingContainer',{
                            width: 1500,
                            height: 2000,
                            backgroundColor: 'gray'
                        });
                        return canvas;
                    }
                }

                CanvasPaper.fn.paper.prototype = CanvasPaper.fn;

                return CanvasPaper;
            })();            

            factory.createCanvasPaper = function () {
                return CanvasPaper();
            };

            return factory;
        }]);