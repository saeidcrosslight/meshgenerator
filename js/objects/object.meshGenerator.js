'use strict';

angular
        .module('object.meshgenerator', [])
        .factory('meshgenerator', ['$rootScope', 'filetree', 'editor', 'file', 'childprocess', 'paper', 'canvaspaper', function ($rootScope, filetrees, editor, file, childprocess, paper, canvaspaper) {
                //var scene, renderer, camera, controls, morefile, macfile;
                //var fs = require('fs');
                var factory = {};

                var Meshgenerator = (function(){
                    var Meshgenerator = function(){
                        return new Meshgenerator.fn.mesh();
                    }

                    Meshgenerator.fn = Meshgenerator.prototype = {
                        constructor: Meshgenerator,

                        mesh: function(){
                            this.selectedComponentToModify = {};
                            this.title = 'Welcome to MeshGenerator';
                            this.productName = 'MeshGenerator';
                            this.appPathName = 'MeshGenerator';
                            this.showStartPage = true;
                            this.canvasPapers = [];          //all opened papers
                            this.createCanvasPaper = function(){
                                var newPaper = this._createCanvasPaper();
                                this.canvasPapers.push(newPaper);
                                return newPaper;
                            };                         
                        },

                        _createCanvasPaper: function(){
                            return canvaspaper.createCanvasPaper();
                        }
                    };

                    Meshgenerator.fn.mesh.prototype = Meshgenerator.fn;

                    return Meshgenerator;
                })();

                factory.createMeshgenerator = function () {
                    return Meshgenerator();
                };
                return factory;
            }]);