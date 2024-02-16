'use strict';

angular
    .module('object.minispice', [])
    .factory('minispice', ['$rootScope', 'filetree', 'editor', 'file', 'childprocess', 'paper', function ($rootScope, filetrees, editor, file, childprocess, paper) {
        //var scene, renderer, camera, controls, morefile, macfile;
        //var fs = require('fs');
        var factory = {};

        var MiniSpice = (function () {
            var MiniSpice = function () {
                return new MiniSpice.fn.spice();
            }

            MiniSpice.fn = MiniSpice.prototype = {
                constructor: MiniSpice,

                spice: function () {
                    this.selectedComponentToModify = {};
                    this.title = 'Welcome to MiniSpice';
                    this.productName = 'Minispice';
                    this.appPathName = 'MiniSpicePath';
                    this.showStartPage = true;
                    this.addedCircuitComponents = [];
                    this.createProject = createProject;
                    this.inside = inside;
                    this.newPath = "";
                    this.projectName = "";
                    this.init = _init;
                    this.saveCreatedStructure = saveCreatedStructure;
                    this.saveNewCreatedStructure = saveNewCreatedStructure;
                    this.createNewTrangles = createNewTrangles;
                    this.formatCircuitData = formatCircuitData;
                    this.enableSaveButton = enableSaveButton;
                    this.appPath = '';
                    this.projectPath = '';
                    this.openFiles = [];
                    this.quickMenus = angular.fromJson(file.readallsync("json\\quick\\quick.json"));
                    this.filetree = filetrees.createMinispiceFiletree();      //filetree of the current project
                    this.editors = editor.createMinispiceEditor();         //all opened editors
                    this.fileTitles = [];      //all opened files
                    this.graph = new joint.dia.Graph;
                    this.papers = [];          //all opened papers
                    this.currentPaperId = '';  //the current active paper
                    this.rightMenus = angular.fromJson(file.readallsync("json\\rightmenu\\rightmenu.json"));      //right-click memu list
                    this.paintSwitch = {       //switch of the paintbrush
                        isStartDraw: false,
                        type: null,           //wire, capacitor, ground, resistor, inductor, diode
                        cursorIcon: ''
                    };
                    this.createPaper = function () {
                        var newPaper = this._createPaper();
                        this.papers.push(newPaper);
                        return newPaper;
                    };
                    this.togglePaper = function () {
                        return this._togglePaper();
                    };
                },

                _createPaper: function () {
                    return paper.createMinispicePaper();
                },

                _togglePaper: function () {
                    if ($("#drawingTool").parent()[0].style.display === 'none')
                        $("#regionContent").layout("expand", "west");
                    else
                        $("#regionContent").layout("collapse", "west");
                },


                _hideAllPaper: function () {

                },

                _getCurrentPaper: function () {

                },

                _setPaperOn: function (paperId) {

                },

                _setPaperOff: function (paperId) {

                }

            };

            let createProject = function (projectName, projectPath, fileTypes) {
                if (file.existsfile(projectPath)) {
                    if (confirm("The project path already exists, are sure use it?")) {
                        angular.forEach(fileTypes, function (fileType) {
                            var filePath = projectPath + "\\" + projectName + "." + fileType;
                            if (file.existsfile(filePath)) {
                                if (confirm("The project file already exists, whether or not to replace it?")) {
                                    file.delfile(filePath);
                                    file.writeallsync(filePath, "");
                                }
                            } else {
                                file.writeallsync(filePath, "");
                            }
                        });
                    }
                } else {
                    file.mkdirsync(projectPath);
                    angular.forEach(fileTypes, function (fileType) {
                        file.writeallsync(projectPath + "\\" + projectName + "." + fileType, "");
                    });
                }
            };

            let enableSaveButton = function () {
                if (this.papers[0].components.length > 0 && this.newPath.length > 0 && this.quickMenus[4].disabled === "disabled") {
                    this.quickMenus[4].disabled = "";
                    $rootScope.$apply();
                }
            };

            const inside = (point) => {
                debugger;
                let isInside = false
                for (let i = 0; i < $rootScope.boxCorners.length; i++) {
                    isInside = point.x > $rootScope.boxCorners[i].left && point.x < $rootScope.boxCorners[i].right && point.y > $rootScope.boxCorners[i].top && point.y < $rootScope.boxCorners[i].bottom;
                    if (isInside) {
                        $rootScope.boxCorners[i].points.push(point);
                        return isInside
                    }
                }
                return isInside
            };

            let saveCreatedStructure = function (projectPath, projectName, data, fileExtension) {
                debugger;
                if (projectName && projectPath.length > 0) {
                    var filePath = projectPath + "\\" + projectName + "." + fileExtension;
                    //data = formatCircuitData(data);
                    //data = JSON.stringify(data);
                    data = formatPointsData(data);
                    file.writeallsync(filePath, data);
                } else {
                    alert("please create a project first");
                }
                //this.quickMenus[4].disabled = "disabled";
            };

            let createLog = function () {
                console.log('hi')
            }

            const writeNewMeshFile = (order1, points1, order2, points2, rec1, rec2) => {

                let str = "mesh_version_ged2\n";
                str += order1.length + order2.length + "\n"
                for (let i = 0; i < order1.length; i++) {
                    for (let j = 0; j < order1[i].length; j++) {
                        str += points1[parseInt(order1[i][j]) - 1].x + " " + points1[parseInt(order1[i][j]) - 1].y + " " + order1[i][j] + "\n";
                    }
                    str += "1\n"; // Add a newline and "1" after each inner loop
                }
                for (let i = 0; i < order2.length; i++) {
                    debugger;
                    for (let j = 0; j < order2[i].length; j++) {
                        str += points2[parseInt(order2[i][j]) - 1].x + " " + points2[parseInt(order1[i][j]) - 1].y + " " + String(parseInt(order2[i][j]) + points1.length) + "\n";
                    }
                    str += "2\n"; // Add a newline and "1" after each inner loop
                }
                str += "nodal_material_index_listing\n"
                str += points1.length + points2.length + "\n"
                console.log(str);
                for (let i = 0; i < points1.length; i++) {
                    str += i + 1 + " " + 1 + " " + 1 + "\n"
                }
                for (let i = 0; i < points2.length; i++) {
                    str += i + 1 + points2.length + " " + 2 + " " + 2 + "\n"
                }
                str += points1.length + points2.length + " " + 2 + "\n"
                str += "material_type_list\n2\n"
                str += "2.000000000000000E-004\n";
                str += "2.000000000000000E-004\n";
                str += "2.000000000000000E-004\n";
                str += "2.000000000000000E-004\n";
                str += "-2.000000000000000E-004\n";
                str += "-2.000000000000000E-004\n";
                str += "-2.000000000000000E-004\n";
                str += "-2.000000000000000E-004\n";
                str += "-2.000000000000000E-004\n";
                str += "-2.000000000000000E-004\n";
                str += "-2.000000000000000E-004\n";
                str += "-2.000000000000000E-004\n";
                str += "-2.000000000000000E-004\n";
                str += "basic_box_info\n2\n4 1\n"
                str += "1pol\n"
                str += rec1
                str += "4 2\n"
                str += "2pol\n"
                str += rec2;
                debugger;
                return str;

            }

            let saveNewCreatedStructure = function (appPath, data) {
                debugger;
                if (appPath.length > 0) {
                    let filePath1 = appPath + "\\" + "fort.12";
                    let filePath2 = appPath + "\\" + "fort.13";
                    let filePath3 = appPath + "\\" + "fort.22";
                    let filePath4 = appPath + "\\" + "fort.23";
                    let recPath1 = appPath + "\\" + "rec.txt";
                    let recPath2 = appPath + "\\" + "rec2.txt";
                    let data1 = formatPointsData($rootScope.boxCorners[0].points);
                    let data2 = formatPointsData($rootScope.boxCorners[1].points);
                    //next write corner boxes in rec.txt and rec2.txt
                    let rec1 = formatPointsData($rootScope.boxCorners[0].coords);
                    let rec2 = formatPointsData($rootScope.boxCorners[1].coords);

                    //data = formatPointsData(data);
                    file.writeallsync(filePath1, data1);
                    file.writeallsync(filePath2, "");
                    file.writeallsync(filePath3, data2);
                    file.writeallsync(filePath4, "");

                    file.writeallsync(recPath1, rec1);
                    file.writeallsync(recPath2, rec2);

                    var sb = new String();
                    //sb = projectPath.split("\\")[0] + "\r\n";
                    sb += "cd /D \"" + appPath + "\"\r\n";
                    sb += "call deltri.exe < ret.txt" + "\"\r\n";
                    sb += "call deltri.exe < ret2.txt";
                    file.writeallsync(appPath + "\\merg.bat", sb);//temp.bat
                    // var child_process = require('child_process');
                    // child_process.exec(appPath + "\\merg.bat", function(error, stdout, stderr) {
                    //     console.log(stdout);
                    // });
                    childprocess.callbackground('', "merg.bat", appPath,
                        function () {
                        },
                        function () {
                        }, createLog)

                } else {
                    alert("please create a project first");
                }
            };

            let createNewTrangles = function (appPath, points) {
                console.log(points);
                console.log($rootScope.boxCorners[0])
                console.log($rootScope.boxCorners[1])

                debugger;
                let trianglesFilePath = appPath + '\\out2.txt';

                let trianglesFileContent = file.readallsync(trianglesFilePath);
                trianglesFileContent = trianglesFileContent.replace(/\s+/g, ' ').trim();
                console.log(trianglesFileContent);
                // trianglesFileContent = trianglesFileContent.replace(/\s/g, "");
                trianglesFileContent = trianglesFileContent.split(' ');
                let splitArray = [];
                let newArray = [];
                while (trianglesFileContent.length > 0) {
                    splitArray = trianglesFileContent.splice(0, 3);
                    newArray.push(splitArray);
                }
                console.log(newArray);

                let firstPoint;
                let secondPoint;
                let thirdPoint;
                $rootScope.canvas.remove(...$rootScope.canvas.getObjects());
                $rootScope.drawRectangular();

                for (let i = 0; i < newArray.length; i++) {
                    if (newArray[i].includes("0")) {
                        continue;
                    }
                    firstPoint = $rootScope.boxCorners[0].points[newArray[i][0] - 1];
                    secondPoint = $rootScope.boxCorners[0].points[newArray[i][1] - 1];
                    thirdPoint = $rootScope.boxCorners[0].points[newArray[i][2] - 1];
                    let line1 = new fabric.Line([firstPoint.x, firstPoint.y, secondPoint.x, secondPoint.y], {
                        stroke: 'red',
                        strokeWidth: 1
                    })
                    let line2 = new fabric.Line([secondPoint.x, secondPoint.y, thirdPoint.x, thirdPoint.y], {
                        stroke: 'red',
                        strokeWidth: 1
                    })
                    let line3 = new fabric.Line([thirdPoint.x, thirdPoint.y, firstPoint.x, firstPoint.y], {
                        stroke: 'red',
                        strokeWidth: 1
                    })
                    $rootScope.canvas.add(line1);
                    $rootScope.canvas.add(line2);
                    $rootScope.canvas.add(line3);
                }

                debugger;
                let trianglesFilePath2 = appPath + '\\out2_2.txt';

                let trianglesFileContent2 = file.readallsync(trianglesFilePath2);
                trianglesFileContent2 = trianglesFileContent2.replace(/\s+/g, ' ').trim();
                console.log(trianglesFileContent2);
                // trianglesFileContent = trianglesFileContent.replace(/\s/g, "");
                trianglesFileContent2 = trianglesFileContent2.split(' ');
                let splitArray2 = [];
                let newArray2 = [];
                while (trianglesFileContent2.length > 0) {
                    splitArray2 = trianglesFileContent2.splice(0, 3);
                    newArray2.push(splitArray2);
                }
                console.log(newArray2);
                const mesh = writeNewMeshFile(newArray, $rootScope.boxCorners[0].points, newArray2, $rootScope.boxCorners[1].points, formatPointsData($rootScope.boxCorners[0].coords), formatPointsData($rootScope.boxCorners[1].coords));
                let meshFilePath = appPath + '\\newMesh.msh';
                file.writeallsync(meshFilePath, mesh);
                let firstPoint2;
                let secondPoint2;
                let thirdPoint2;
                //$rootScope.canvas.remove(...$rootScope.canvas.getObjects());

                for (let i = 0; i < newArray2.length; i++) {
                    if (newArray2[i].includes("0")) {
                        continue;
                    }
                    firstPoint2 = $rootScope.boxCorners[1].points[newArray2[i][0] - 1];
                    secondPoint2 = $rootScope.boxCorners[1].points[newArray2[i][1] - 1];
                    thirdPoint2 = $rootScope.boxCorners[1].points[newArray2[i][2] - 1];
                    let line1 = new fabric.Line([firstPoint2.x, firstPoint2.y, secondPoint2.x, secondPoint2.y], {
                        stroke: 'red',
                        strokeWidth: 1
                    })
                    let line2 = new fabric.Line([secondPoint2.x, secondPoint2.y, thirdPoint2.x, thirdPoint2.y], {
                        stroke: 'red',
                        strokeWidth: 1
                    })
                    let line3 = new fabric.Line([thirdPoint2.x, thirdPoint2.y, firstPoint2.x, firstPoint2.y], {
                        stroke: 'red',
                        strokeWidth: 1
                    })
                    $rootScope.canvas.add(line1);
                    $rootScope.canvas.add(line2);
                    $rootScope.canvas.add(line3);
                }
            };


            let _init = function () {

                this.filetree.inputfiles = new this.filetree.minispiceInputFileTreeInit;
                this.editors.startPageInit(this.openFiles);

            };

            let formatPointsData = function (data) {
                let str = "";
                debugger
                for (let i = 0; i < data.length; i++) {
                    str += data[i].x.toExponential() + " " + data[i].y.toExponential() + "\r\n"
                }
                debugger
                return str;
            };

            let formatCircuitData = function (circuitData) {
                let str = "Version 4\r\n";
                str += "SHEET 1 2000 1400 \r\n";
                $.each(circuitData.links, function (i, link) {
                    let str1 = "WIRE ";
                    str1 += link.attributes.source.x;
                    str1 += " " + link.attributes.source.y;
                    str1 += " " + link.attributes.target.x;
                    str1 += " " + link.attributes.target.y + "\r\n";
                    str += str1;
                });
                $.each(circuitData.components, function (i, component) {
                    let str2 = "";
                    switch (component.type) {
                        case "resistor":
                            str2 += "SYMBOL res ";
                            str2 += component.position.x + " ";
                            str2 += component.position.y;
                            if (component.rotated == 1) {
                                str2 += " R";
                            }
                            else {
                                str2 += " U";
                            }
                            //check if nodes are adjacent to component
                            for (let i = 0; i < circuitData.links.length; i++) {
                                let a = component.linkNodes[0];
                                let b = component.linkNodes[1];
                                let c = circuitData.links[i];
                                if (Math.abs(component.linkNodes[0].attributes.position.x - circuitData.links[i].attributes.source.x) < 6 && Math.abs(component.linkNodes[0].attributes.position.y - circuitData.links[i].attributes.source.y) < 6) {
                                    str2 += "0";
                                }
                                if (Math.abs(component.linkNodes[0].attributes.position.x - circuitData.links[i].attributes.target.x) < 6 && Math.abs(component.linkNodes[0].attributes.position.y - circuitData.links[i].attributes.target.y) < 6) {
                                    str2 += "0";
                                }
                                if (Math.abs(component.linkNodes[1].attributes.position.x - circuitData.links[i].attributes.target.x) < 6 && Math.abs(component.linkNodes[1].attributes.position.y - circuitData.links[i].attributes.target.y) < 6) {
                                    str2 += "1";
                                }
                                if (Math.abs(component.linkNodes[1].attributes.position.x - circuitData.links[i].attributes.source.x) < 6 && Math.abs(component.linkNodes[1].attributes.position.y - circuitData.links[i].attributes.source.y) < 6) {
                                    str2 += "1";
                                }
                            }
                            str2 += "\r\n";
                            str2 += "SYMATTR InstName " + component.id + "\r\n";
                            str += str2;
                            break;
                            break;
                        case "ground":
                            str2 += "FLAG ";
                            str2 += component.position.x + " ";
                            str2 += component.position.y;
                            if (component.rotated == 1) {
                                str2 += " R";
                            }
                            else {
                                str2 += " U";
                            }
                            for (let i = 0; i < circuitData.links.length; i++) {
                                let a = component.linkNodes[0];
                                let c = circuitData.links[i];
                                if (Math.abs(component.linkNodes[0].attributes.position.x - circuitData.links[i].attributes.source.x) < 6 && Math.abs(component.linkNodes[0].attributes.position.y - circuitData.links[i].attributes.source.y) < 6) {
                                    str2 += "0";
                                }
                                if (Math.abs(component.linkNodes[0].attributes.position.x - circuitData.links[i].attributes.target.x) < 6 && Math.abs(component.linkNodes[0].attributes.position.y - circuitData.links[i].attributes.target.y) < 6) {
                                    str2 += "0";
                                }
                            }
                            str2 += "\r\n";
                            str += str2;
                            break;
                        case "capacitor":
                            str2 += "SYMBOL cap ";
                            str2 += component.position.x + " ";
                            str2 += component.position.y;
                            if (component.rotated == 1) {
                                str2 += " R";
                            }
                            else {
                                str2 += " U";
                            }
                            for (let i = 0; i < circuitData.links.length; i++) {
                                let a = component.linkNodes[0];
                                let b = component.linkNodes[1];
                                let c = circuitData.links[i];
                                if (Math.abs(component.linkNodes[0].attributes.position.x - circuitData.links[i].attributes.source.x) < 6 && Math.abs(component.linkNodes[0].attributes.position.y - circuitData.links[i].attributes.source.y) < 6) {
                                    str2 += "0";
                                }
                                if (Math.abs(component.linkNodes[0].attributes.position.x - circuitData.links[i].attributes.target.x) < 6 && Math.abs(component.linkNodes[0].attributes.position.y - circuitData.links[i].attributes.target.y) < 6) {
                                    str2 += "0";
                                }
                                if (Math.abs(component.linkNodes[1].attributes.position.x - circuitData.links[i].attributes.target.x) < 6 && Math.abs(component.linkNodes[1].attributes.position.y - circuitData.links[i].attributes.target.y) < 6) {
                                    str2 += "1";
                                }
                                if (Math.abs(component.linkNodes[1].attributes.position.x - circuitData.links[i].attributes.source.x) < 6 && Math.abs(component.linkNodes[1].attributes.position.y - circuitData.links[i].attributes.source.y) < 6) {
                                    str2 += "1";
                                }
                            }
                            str2 += "\r\n";
                            str2 += "SYMATTR InstName " + component.id + "\r\n";
                            str += str2;
                            break;
                        case "diode":
                            str2 += "SYMBOL diode ";
                            str2 += component.position.x + " ";
                            str2 += component.position.y;
                            if (component.rotated == 1) {
                                str2 += " R";
                            }
                            else {
                                str2 += " U";
                            }
                            for (let i = 0; i < circuitData.links.length; i++) {
                                let a = component.linkNodes[0];
                                let b = component.linkNodes[1];
                                let c = circuitData.links[i];
                                if (Math.abs(component.linkNodes[0].attributes.position.x - circuitData.links[i].attributes.source.x) < 6 && Math.abs(component.linkNodes[0].attributes.position.y - circuitData.links[i].attributes.source.y) < 6) {
                                    str2 += "0";
                                }
                                if (Math.abs(component.linkNodes[0].attributes.position.x - circuitData.links[i].attributes.target.x) < 6 && Math.abs(component.linkNodes[0].attributes.position.y - circuitData.links[i].attributes.target.y) < 6) {
                                    str2 += "0";
                                }
                                if (Math.abs(component.linkNodes[1].attributes.position.x - circuitData.links[i].attributes.target.x) < 6 && Math.abs(component.linkNodes[1].attributes.position.y - circuitData.links[i].attributes.target.y) < 6) {
                                    str2 += "1";
                                }
                                if (Math.abs(component.linkNodes[1].attributes.position.x - circuitData.links[i].attributes.source.x) < 6 && Math.abs(component.linkNodes[1].attributes.position.y - circuitData.links[i].attributes.source.y) < 6) {
                                    str2 += "1";
                                }
                            }
                            str2 += "\r\n";
                            str2 += "SYMATTR InstName " + component.id + "\r\n";
                            str += str2;
                            break;
                            break;
                        case "inductor":
                            str2 += "SYMBOL ind ";
                            str2 += component.position.x + " ";
                            str2 += component.position.y;
                            if (component.rotated == 1) {
                                str2 += " R";
                            }
                            else {
                                str2 += " U";
                            }
                            for (let i = 0; i < circuitData.links.length; i++) {
                                let a = component.linkNodes[0];
                                let b = component.linkNodes[1];
                                let c = circuitData.links[i];
                                if (Math.abs(component.linkNodes[0].attributes.position.x - circuitData.links[i].attributes.source.x) < 6 && Math.abs(component.linkNodes[0].attributes.position.y - circuitData.links[i].attributes.source.y) < 6) {
                                    str2 += "0";
                                }
                                if (Math.abs(component.linkNodes[0].attributes.position.x - circuitData.links[i].attributes.target.x) < 6 && Math.abs(component.linkNodes[0].attributes.position.y - circuitData.links[i].attributes.target.y) < 6) {
                                    str2 += "0";
                                }
                                if (Math.abs(component.linkNodes[1].attributes.position.x - circuitData.links[i].attributes.target.x) < 6 && Math.abs(component.linkNodes[1].attributes.position.y - circuitData.links[i].attributes.target.y) < 6) {
                                    str2 += "1";
                                }
                                if (Math.abs(component.linkNodes[1].attributes.position.x - circuitData.links[i].attributes.source.x) < 6 && Math.abs(component.linkNodes[1].attributes.position.y - circuitData.links[i].attributes.source.y) < 6) {
                                    str2 += "1";
                                }
                            }
                            str2 += "\r\n";
                            str2 += "SYMATTR InstName " + component.id + "\r\n";
                            str += str2;
                            break;
                    }

                });
                return str;
            };

            MiniSpice.fn.spice.prototype = MiniSpice.fn;

            return MiniSpice;
        })();

        factory.createMiniSpice = function () {
            return MiniSpice();
        };
        return factory;
    }]);