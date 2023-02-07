'use strict';

angular
        .module('object.minispice', [])
        .factory('minispice', ['$rootScope', 'filetree', 'editor', 'file', 'childprocess', 'paper', function ($rootScope, filetrees, editor, file, childprocess, paper) {
                //var scene, renderer, camera, controls, morefile, macfile;
                //var fs = require('fs');
                var factory = {};

                var MiniSpice = (function(){
                    var MiniSpice = function(){
                        return new MiniSpice.fn.spice();
                    }

                    MiniSpice.fn = MiniSpice.prototype = {
                        constructor: MiniSpice,

                        spice: function(){
                            this.selectedComponentToModify = {};
                            this.title = 'Welcome to MiniSpice';
                            this.productName = 'Minispice';
                            this.appPathName = 'MiniSpicePath';
                            this.showStartPage = true;
                            this.addedCircuitComponents = [];
                            this.createProject = createProject;
                            this.inside = inside;
                            this.newPath = "";
                            this.projectName="";
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
                                isStartDraw : false,
                                type : null,           //wire, capacitor, ground, resistor, inductor, diode
                                cursorIcon : ''
                            };
                            this.createPaper = function(){
                                var newPaper = this._createPaper();
                                this.papers.push(newPaper);
                                return newPaper;
                            };
                            this.togglePaper = function(){
                                return this._togglePaper();
                            };                            
                        },

                        _createPaper: function(){
                            return paper.createMinispicePaper();
                        },

                        _togglePaper: function(){
                            if ($("#drawingTool").parent()[0].style.display === 'none') 
                                $("#regionContent").layout("expand", "west");
                            else
                                $("#regionContent").layout("collapse", "west");                              
                        },

                        
                        _hideAllPaper: function(){
                            
                        },

                        _getCurrentPaper: function(){
                            
                        },

                        _setPaperOn: function(paperId){

                        },

                        _setPaperOff: function(paperId){

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
                        if(this.papers[0].components.length > 0 && this.newPath.length > 0 && this.quickMenus[4].disabled === "disabled"){
                            this.quickMenus[4].disabled = "";
                            $rootScope.$apply();
                        }
                    };

                    const inside = (point, rect) => {
                        debugger;
                         return point.x > rect.left && point.x < rect.right && point.y > rect.top && point.y < rect.bottom
                        };

                    let saveCreatedStructure = function (projectPath, projectName, data, fileExtension) {
                        debugger;
                        if (projectName && projectPath.length > 0){
                            var filePath = projectPath + "\\" + projectName + "." + fileExtension;
                            //data = formatCircuitData(data);
                            //data = JSON.stringify(data);
                            data = formatPointsData(data);
                            file.writeallsync(filePath, data);
                        }else {
                            alert("please create a project first");
                        }
                        //this.quickMenus[4].disabled = "disabled";
                    };

                    let createLog = function (){
                        console.log('hi')
                    }

                    let saveNewCreatedStructure = function (appPath, data) {
                        debugger;
                        if (appPath.length > 0){
                            let filePath1 = appPath + "\\" + "fort.12";
                            let filePath2 = appPath + "\\" + "fort.13";
                            //data = formatCircuitData(data);
                            //data = JSON.stringify(data);
                            data = formatPointsData(data);
                            file.writeallsync(filePath1, data);
                            file.writeallsync(filePath2, "");
                            var sb = new String();
                            //sb = projectPath.split("\\")[0] + "\r\n";
                            sb += "cd /D \"" + appPath + "\"\r\n";
                            sb += "call deltri.exe < ret.txt";
                            file.writeallsync(appPath + "\\merg.bat", sb);//temp.bat
                            // var child_process = require('child_process');
                            // child_process.exec(appPath + "\\merg.bat", function(error, stdout, stderr) {
                            //     console.log(stdout);
                            // });
                        childprocess.callbackground('', "merg.bat", appPath,
                            function () {
                            },
                            function () {
                            },createLog)

                        }else {
                            alert("please create a project first");
                        }
                    };

                    let createNewTrangles = function (appPath, points) {
                        console.log(points);
                        debugger;
                        let trianglesFilePath = appPath+'\\out2.txt';
                        let trianglesFileContent =  file.readallsync(trianglesFilePath);
                        trianglesFileContent = trianglesFileContent.replace(/\s+/g, ' ').trim();
                        console.log(trianglesFileContent);
                        // trianglesFileContent = trianglesFileContent.replace(/\s/g, "");
                        trianglesFileContent = trianglesFileContent.split(' ');
                        let splitArray = [];
                        let newArray = [];
                        while(trianglesFileContent.length>0){
                            splitArray = trianglesFileContent.splice(0,3);
                            newArray.push(splitArray);
                        }
                        console.log(newArray);
                        let firstPoint;
                        let secondPoint;
                        let thirdPoint;
                        $rootScope.canvas.remove(...$rootScope.canvas.getObjects());

                        for(let i=0; i<newArray.length;i++){
                            firstPoint = points[newArray[i][0]-1];
                            secondPoint = points[newArray[i][1]-1];
                            thirdPoint = points[newArray[i][2]-1];
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

                    };


                    let _init = function () {

                        this.filetree.inputfiles = new this.filetree.minispiceInputFileTreeInit;
                        this.editors.startPageInit(this.openFiles);

                    };

                    let formatPointsData = function(data) {
                        let str="";
                        debugger
                        for(let i=0; i< data.length;i++){
                            str += data[i].x.toExponential()+ " "+ data[i].y.toExponential() + "\r\n"
                        }
                        debugger
                        return str;
                    };

                    let formatCircuitData = function (circuitData){
                        let str = "Version 4\r\n";
                        str += "SHEET 1 2000 1400 \r\n";
                        $.each(circuitData.links, function (i, link) {
                            let str1 = "WIRE ";
                            str1 += link.attributes.source.x;
                            str1 +=  " "+link.attributes.source.y;
                            str1 += " "+link.attributes.target.x;
                            str1 +=  " "+link.attributes.target.y + "\r\n";
                            str += str1;
                        });
                        $.each(circuitData.components, function (i, component) {
                            let str2 = "";
                            switch (component.type) {
                                case "resistor":
                                    str2 += "SYMBOL res ";
                                    str2 += component.position.x + " ";
                                    str2 += component.position.y;
                                    if(component.rotated == 1){
                                        str2 += " R";
                                    }
                                    else{
                                        str2 += " U";
                                    }
                                    //check if nodes are adjacent to component
                                    for(let i = 0; i < circuitData.links.length; i++){
                                        let a = component.linkNodes[0];
                                        let b = component.linkNodes[1];
                                        let c = circuitData.links[i];
                                        if(Math.abs(component.linkNodes[0].attributes.position.x - circuitData.links[i].attributes.source.x) < 6 && Math.abs(component.linkNodes[0].attributes.position.y - circuitData.links[i].attributes.source.y) < 6){
                                            str2 += "0";
                                        }
                                        if(Math.abs(component.linkNodes[0].attributes.position.x - circuitData.links[i].attributes.target.x) < 6 && Math.abs(component.linkNodes[0].attributes.position.y - circuitData.links[i].attributes.target.y) < 6){
                                            str2 += "0";
                                        }
                                        if(Math.abs(component.linkNodes[1].attributes.position.x - circuitData.links[i].attributes.target.x) < 6 && Math.abs(component.linkNodes[1].attributes.position.y - circuitData.links[i].attributes.target.y) < 6){
                                            str2 += "1";
                                        }
                                        if(Math.abs(component.linkNodes[1].attributes.position.x - circuitData.links[i].attributes.source.x) < 6 && Math.abs(component.linkNodes[1].attributes.position.y - circuitData.links[i].attributes.source.y) < 6){
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
                                    if(component.rotated == 1){
                                        str2 += " R";
                                    }
                                    else{
                                        str2 += " U";
                                    }
                                    for(let i = 0; i < circuitData.links.length; i++){
                                        let a = component.linkNodes[0];
                                        let c = circuitData.links[i];
                                        if(Math.abs(component.linkNodes[0].attributes.position.x - circuitData.links[i].attributes.source.x) < 6 && Math.abs(component.linkNodes[0].attributes.position.y - circuitData.links[i].attributes.source.y) < 6){
                                            str2 += "0";
                                        }
                                        if(Math.abs(component.linkNodes[0].attributes.position.x - circuitData.links[i].attributes.target.x) < 6 && Math.abs(component.linkNodes[0].attributes.position.y - circuitData.links[i].attributes.target.y) < 6){
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
                                    if(component.rotated == 1){
                                        str2 += " R";
                                    }
                                    else{
                                        str2 += " U";
                                    }
                                    for(let i = 0; i < circuitData.links.length; i++){
                                        let a = component.linkNodes[0];
                                        let b = component.linkNodes[1];
                                        let c = circuitData.links[i];
                                        if(Math.abs(component.linkNodes[0].attributes.position.x - circuitData.links[i].attributes.source.x) < 6 && Math.abs(component.linkNodes[0].attributes.position.y - circuitData.links[i].attributes.source.y) < 6){
                                            str2 += "0";
                                        }
                                        if(Math.abs(component.linkNodes[0].attributes.position.x - circuitData.links[i].attributes.target.x) < 6 && Math.abs(component.linkNodes[0].attributes.position.y - circuitData.links[i].attributes.target.y) < 6){
                                            str2 += "0";
                                        }
                                        if(Math.abs(component.linkNodes[1].attributes.position.x - circuitData.links[i].attributes.target.x) < 6 && Math.abs(component.linkNodes[1].attributes.position.y - circuitData.links[i].attributes.target.y) < 6){
                                            str2 += "1";
                                        }
                                        if(Math.abs(component.linkNodes[1].attributes.position.x - circuitData.links[i].attributes.source.x) < 6 && Math.abs(component.linkNodes[1].attributes.position.y - circuitData.links[i].attributes.source.y) < 6){
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
                                    if(component.rotated == 1){
                                        str2 += " R";
                                    }
                                    else{
                                        str2 += " U";
                                    }
                                    for(let i = 0; i < circuitData.links.length; i++){
                                        let a = component.linkNodes[0];
                                        let b = component.linkNodes[1];
                                        let c = circuitData.links[i];
                                        if(Math.abs(component.linkNodes[0].attributes.position.x - circuitData.links[i].attributes.source.x) < 6 && Math.abs(component.linkNodes[0].attributes.position.y - circuitData.links[i].attributes.source.y) < 6){
                                            str2 += "0";
                                        }
                                        if(Math.abs(component.linkNodes[0].attributes.position.x - circuitData.links[i].attributes.target.x) < 6 && Math.abs(component.linkNodes[0].attributes.position.y - circuitData.links[i].attributes.target.y) < 6){
                                            str2 += "0";
                                        }
                                        if(Math.abs(component.linkNodes[1].attributes.position.x - circuitData.links[i].attributes.target.x) < 6 && Math.abs(component.linkNodes[1].attributes.position.y - circuitData.links[i].attributes.target.y) < 6){
                                            str2 += "1";
                                        }
                                        if(Math.abs(component.linkNodes[1].attributes.position.x - circuitData.links[i].attributes.source.x) < 6 && Math.abs(component.linkNodes[1].attributes.position.y - circuitData.links[i].attributes.source.y) < 6){
                                            str2 += "1";
                                        }
                                    }
                                    str2 +="\r\n";
                                    str2 += "SYMATTR InstName " + component.id + "\r\n";
                                    str += str2;
                                    break;
                                    break;
                                case "inductor":
                                    str2 += "SYMBOL ind ";
                                    str2 += component.position.x + " ";
                                    str2 += component.position.y;
                                    if(component.rotated == 1){
                                        str2 += " R";
                                    }
                                    else{
                                        str2 += " U";
                                    }
                                    for(let i = 0; i < circuitData.links.length; i++){
                                        let a = component.linkNodes[0];
                                        let b = component.linkNodes[1];
                                        let c = circuitData.links[i];
                                        if(Math.abs(component.linkNodes[0].attributes.position.x - circuitData.links[i].attributes.source.x) < 6 && Math.abs(component.linkNodes[0].attributes.position.y - circuitData.links[i].attributes.source.y) < 6){
                                            str2 += "0";
                                        }
                                        if(Math.abs(component.linkNodes[0].attributes.position.x - circuitData.links[i].attributes.target.x) < 6 && Math.abs(component.linkNodes[0].attributes.position.y - circuitData.links[i].attributes.target.y) < 6){
                                            str2 += "0";
                                        }
                                        if(Math.abs(component.linkNodes[1].attributes.position.x - circuitData.links[i].attributes.target.x) < 6 && Math.abs(component.linkNodes[1].attributes.position.y - circuitData.links[i].attributes.target.y) < 6){
                                            str2 += "1";
                                        }
                                        if(Math.abs(component.linkNodes[1].attributes.position.x - circuitData.links[i].attributes.source.x) < 6 && Math.abs(component.linkNodes[1].attributes.position.y - circuitData.links[i].attributes.source.y) < 6){
                                            str2 += "1";
                                        }
                                    }
                                    str2 +="\r\n";
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