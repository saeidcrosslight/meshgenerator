angular.module('drawingTool.controller', [])

    .controller('drawingToolController', ['$scope', '$timeout', '$rootScope', 'canvaspaper', function ($scope, $timeout, $rootScope, canvaspaper) {
        var paper = canvaspaper.createCanvasPaper();
        let minispice = $rootScope.minispice;
        // $rootScope.boxCorners = [];
        $rootScope.rectCorners = { left: 0, right: 0, top: 0, bottom: 0 };
        $rootScope.boxCorners = [];
        $rootScope.canvas = new fabric.Canvas('drawingContainer', {
            width: 1500,
            height: 2000,
            backgroundColor: 'gray'
        });
        $rootScope.rectangular = { width: 0, height: 0, numberOfBoxes: 0 }
        $rootScope.points = [];

        const pointsInBetween = (startPoint, endPoint, numPoints, verticalGap = 0) => {
            const stepSize = 1 / (numPoints + 1);

            // Generate the intermediate points
            const intermediatePoints = [];

            for (let i = 1; i <= numPoints; i++) {
                const x = startPoint.x + i * stepSize * (endPoint.x - startPoint.x);
                const y = startPoint.y + i * stepSize * (endPoint.y - startPoint.y) + verticalGap;
                intermediatePoints.push({ x, y });
            }
            return intermediatePoints;
        }

        const getSidesToShrink = (index, numberOfBoxes) => {
            if (index === 1) {
                return "bottom"
            } else if (index === numberOfBoxes) {
                return "top"
            } else {
                return "both"
            }
        }


        $rootScope.drawRectangular = function () {
            for (let i = 0; i < $scope.rectangular.numberOfBoxes; i++) {
                var rect = new fabric.Rect({
                    left: 200,
                    top: 400 + i * $rootScope.rectangular.height,
                    width: $rootScope.rectangular.width,
                    height: $rootScope.rectangular.height,
                    stroke: 'black',
                    strokeWidth: 2,
                    fill: 'rgba(0,0,0,0)'
                });
                console.log(rect);
                $rootScope.canvas.add(rect);
                let coordinations = [];
                const sidesToShrink = getSidesToShrink(i + 1, $scope.rectangular.numberOfBoxes);
                debugger;
                let points = [];
                const gap = 5;
                const lineIntervals = 20;
                if (sidesToShrink === "top" || sidesToShrink === "both") {
                    points = points.concat(pointsInBetween(rect.aCoords.tl, rect.aCoords.tr, lineIntervals, gap));
                    const newTlConer = {x: rect.aCoords.tl.x, y: rect.aCoords.tl.y+gap};
                    const newTrConer = {x: rect.aCoords.tr.x, y: rect.aCoords.tr.y+gap};

                    points.push(newTlConer)
                    points.push(newTrConer)
                    coordinations.push(newTlConer)
                    coordinations.push(newTrConer)
                } else {
                    points = points.concat(pointsInBetween(rect.aCoords.tl, rect.aCoords.tr, lineIntervals));
                    points.push(rect.aCoords.tl)
                    points.push(rect.aCoords.tr)
                    coordinations.push(rect.aCoords.tl)
                    coordinations.push(rect.aCoords.tr)
                }

                if (sidesToShrink === "bottom" || sidesToShrink === "both") {
                    points = points.concat(pointsInBetween(rect.aCoords.bl, rect.aCoords.br, lineIntervals, -gap));

                    const newBlConer = {x: rect.aCoords.bl.x, y: rect.aCoords.bl.y-gap};
                    const newBrConer = {x: rect.aCoords.br.x, y: rect.aCoords.br.y-gap}; 

                    points.push(newBlConer)
                    points.push(newBrConer)
                    coordinations.push(newBlConer)
                    coordinations.push(newBrConer)
                } else {
                    points = points.concat(pointsInBetween(rect.aCoords.bl, rect.aCoords.br, lineIntervals));
                    points.push(rect.aCoords.bl)
                    points.push(rect.aCoords.br)
                    coordinations.push(rect.aCoords.bl)
                    coordinations.push(rect.aCoords.br)
                }

                points = points.concat(pointsInBetween(rect.aCoords.tl, rect.aCoords.bl, lineIntervals));
                points = points.concat(pointsInBetween(rect.aCoords.tr, rect.aCoords.br, lineIntervals));
                // points.push(rect.aCoords.tl)
                // points.push(rect.aCoords.tr)
                // points.push(rect.aCoords.bl)
                // points.push(rect.aCoords.br)
                // coordinations.push(rect.aCoords.br)
                // coordinations.push(rect.aCoords.bl)
                // coordinations.push(rect.aCoords.tl)
                // coordinations.push(rect.aCoords.tr)
                $rootScope.boxCorners.push({ index: i, left: rect.left, right: rect.width + rect.left, top: rect.top, bottom: rect.top + rect.height, points: points, coords: coordinations })
                debugger;

                console.log($rootScope.boxCorners)
            }
        };

        $rootScope.canvas.on('mouse:down', function (event) {
            console.log(event.absolutePointer);
            let point = [];
            //point.push(event.absolutePointer.x);
            //point.push(event.absolutePointer.y);
            //console.log(minispice.inside(event.absolutePointer, $rootScope.rectCorners))
            if (minispice.inside(event.absolutePointer)) {
                $rootScope.points.push(event.absolutePointer);
                console.log(event.e.clientX, event.e.clientY);
                circ = new fabric.Circle({
                    left: event.absolutePointer.x,
                    top: event.absolutePointer.y,
                    radius: 3,
                    stroke: 'red',
                    strokeWidth: 1,
                    fill: 'red'
                });
                $rootScope.canvas.add(circ);
            }
        });


        //create a rectangle object
        // var rect = new fabric.Rect({
        // left: 100,
        // top: 100,
        // fill: 'red',
        // width: 800,
        // height: 600
        // });

        //"add" rectangle onto canvas
        // $rootScope.canvas.add(rect);
        // var fs = require('fs');

        // $scope.createdObjects = {containers:[], objects:[]};
        // $scope.master = {};
        // $scope.radius = {};
        // $scope.selectedObjects = [];
        // $scope.materialNumber =1;
        // $scope.columns = [{columnNumber:1, isMaterialInfoVisible:false}];
        // $scope.targetColumns = [{columnNumber:1, isMaterialInfoVisible:false}];
        // $scope.layers = [];
        // $rootScope.layerIsCreated = false;
        // var morefile;
        // var macfile;

        // $scope.updateColumnsData = function(i){
        //     angular.copy($scope.columns[i], $scope.targetColumns[i]);
        // }

        // $scope.addLayers = function () {
        //     $('#layerDefinerModal').modal('hide');
        //     var layerDimention = {};
        //     var columns = [];
        //     angular.copy($scope.layerDimention,layerDimention);
        //     angular.copy($scope.targetColumns,columns);
        //     $scope.layers.push({layerDimention:layerDimention,columns:columns});
        //     drawLayers();
        //     $("#selectMaterial")[0].reset();
        //     angular.forEach($scope.columns, function (column) {
        //         delete column.selectedTestMaterial.symbol1;
        //         delete column.selectedTestMaterial.symbol1Value;
        //         delete column.selectedTestMaterial.symbol2;
        //         delete column.selectedTestMaterial.symbol2Value;
        //         delete column.selectedTestMaterial.symbol3;
        //         delete column.selectedTestMaterial.symbol3Value;
        //     });
        // };
        //$scope.previousHieght = 0;

        // drawLayers = function () {
        //     debugger;
        //     $rootScope.layerIsCreated =true;
        //     var lastlayer= ($scope.layers.slice(-1)[0]);
        //     var height = lastlayer.layerDimention.depth;
        //     //$scope.previousdept= $scope.previousdept+lastlayer.layerDimention.depth;
        //     var columns = lastlayer.columns;
        //     var left =200;
        //     angular.forEach(columns, function (column, key) {
        //         var rect = new fabric.Rect({
        //             left:left,
        //             lockMovementX: true,
        //             lockMovementY: true,
        //             lockRotation: true,
        //             lockScalingX: true,
        //             lockScalingY: true,
        //             top: 650-$scope.previousHieght-height,
        //             fill: column.selectedTestMaterial.color,
        //             width: column.width,
        //             height: height,
        //             stroke: 'black',
        //             strokeWidth: .5,
        //             columnInfo:{
        //                 columnNumber: column.columnNumber,
        //                 columnWidth: column.width,
        //                 materialName: column.selectedTestMaterial.name,
        //                 materialInfo: column.selectedTestMaterial.info,
        //                 symbol1: column.selectedTestMaterial.symbol1,
        //                 symbol1Value: column.selectedTestMaterial.symbol1Value,
        //                 symbol1ValueFrom: column.selectedTestMaterial.symbol1ValueFrom,
        //                 symbol1ValueTo: column.selectedTestMaterial.symbol1ValueTo,
        //                 symbol2: column.selectedTestMaterial.symbol2,
        //                 symbol2Value: column.selectedTestMaterial.symbol2Value,
        //                 symbol2ValueFrom: column.selectedTestMaterial.symbol2ValueFrom,
        //                 symbol2ValueTo: column.selectedTestMaterial.symbol2ValueTo,
        //                 symbol3: column.selectedTestMaterial.symbol3,
        //                 symbol3Value: column.selectedTestMaterial.symbol3Value,
        //                 symbol3ValueFrom: column.selectedTestMaterial.symbol3ValueFrom,
        //                 symbol3ValueTo: column.selectedTestMaterial.symbol3ValueTo,
        //             }
        //         });

        //         selectedcanvasWindow.add(rect);
        //         left = left+column.width;
        //     })
        //     $scope.previousHieght = $scope.previousHieght+height;
        // };

        // $scope.addColumn = function () {
        //     var newColumnNumber = $scope.columns.length+1;
        //     $scope.columns.push({
        //         columnNumber:newColumnNumber,
        //         isMaterialInfoVisible:false
        //     });
        //     $scope.targetColumns.push({
        //         columnNumber:newColumnNumber,
        //         isMaterialInfoVisible:false
        //     });
        // };

        // $scope.removeColumn = function() {
        //     var newColumnNumber = $scope.columns.length-1;
        //     if ( newColumnNumber !== 0 ) {
        //         $scope.columns.pop();
        //         $scope.targetColumns.pop();
        //     }
        // };

        // $scope.addStructure = function () {
        //     $('#structureModal').modal('hide');
        //     $rootScope.columnsAreDefined= true;
        // };

        // $scope.writeLayerFile = function () {
        //     var data = formatLayerFile();
        //     fs.writeFile("./outputfiles/test.layer", data, function(err) {
        //         if(err) {
        //             return console.log(err);
        //         }
        //         console.log("Layer file was saved!");
        //     });

        // };

        // formatLayerFile = function () {
        //     var layerString = "begin_layer"+"\n";
        //     $scope.targetColumns.forEach(function (column) {
        //         var columnNumber = "column column_num="+column.columnNumber;
        //         var width = " W="+column.width;
        //         layerString = layerString + columnNumber + width + "\n";
        //     });

        //     $scope.layers.forEach(function (layer) {
        //         var columns = layer.columns;
        //         var layerDepth = layer.layerDimention.depth;
        //         columns.forEach(function (column) {
        //             var columnMaterial = "layer_mater macro_name="+column.selectedTestMaterial.name;
        //             var columnNumber = "column_num="+column.columnNumber;
        //             if (column.selectedTestMaterial.symbol1 && column.selectedTestMaterial.symbol1ActiveGrading){
        //                 var symbol1 = "var_symbol1="+column.selectedTestMaterial.symbol1+" "+"grade_var="+ column.selectedTestMaterial.symbol1Value+" "+ "grade_from="+column.selectedTestMaterial.symbol1ValueFrom+" "+"grade_to="+column.selectedTestMaterial.symbol1ValueTo;
        //             }
        //             else if(column.selectedTestMaterial.symbol1){
        //                 var symbol1 = "var_symbol1="+column.selectedTestMaterial.symbol1+" "+"var1="+ column.selectedTestMaterial.symbol1Value;
        //             }else{
        //                 symbol1 ="";
        //             }
        //             if (column.selectedTestMaterial.symbol2 && column.selectedTestMaterial.symbol2ActiveGrading){
        //                 var symbol2 = "var_symbol2="+column.selectedTestMaterial.symbol2+" "+"grade_var="+ column.selectedTestMaterial.symbol2Value+" "+ "grade_from="+column.selectedTestMaterial.symbol2ValueFrom+" "+"grade_to="+column.selectedTestMaterial.symbol2ValueTo;
        //             }
        //             else if(column.selectedTestMaterial.symbol2){
        //                 var symbol2 = "var_symbol2="+column.selectedTestMaterial.symbol2+" "+"var2="+ column.selectedTestMaterial.symbol2Value;
        //             }else{
        //                 symbol2 ="";
        //             }
        //             if (column.selectedTestMaterial.symbol3 && column.selectedTestMaterial.symbol3ActiveGrading){
        //                 var symbol3 = "var_symbol3="+column.selectedTestMaterial.symbol3+" "+"grade_var="+ column.selectedTestMaterial.symbol3Value+" "+ "grade_from="+column.selectedTestMaterial.symbol3ValueFrom+" "+"grade_to="+column.selectedTestMaterial.symbol3ValueTo;
        //             }
        //             else if(column.selectedTestMaterial.symbol3){
        //                 var symbol3 = "var_symbol3="+column.selectedTestMaterial.symbol3+" "+"var3="+ column.selectedTestMaterial.symbol3Value;
        //             }else{
        //                 symbol3 ="";
        //             }
        //             var eachLayerMaterial = columnMaterial +" "+columnNumber+" "+symbol1 +" "+ symbol2 +" "+ symbol3;
        //             var formatedEachLayerMaterial = formatCharacterCountPerLine(eachLayerMaterial);
        //             layerString = layerString + formatedEachLayerMaterial + "\n";
        //         })
        //         layerString = layerString+"layer d = "+layerDepth +"\n";
        //     });
        //     layerString = layerString+"end_layer";
        //     return layerString;
        // };

        // // formatCharacterCountPerLine = function(string) {
        // //     var outputString  = "";
        // //     var maxCharacterAllowed = 80;
        // //     var outputStringArray = string.split(" ");
        // //     outputStringArray.forEach(function (e) {
        // //         if(outputString.length + e.length < maxCharacterAllowed){
        // //             outputString = outputString + e+ " ";
        // //         }else{
        // //             outputString = outputString+" &&"+"\n"+e+" ";
        // //             maxCharacterAllowed = maxCharacterAllowed + 80;
        // //         }
        // //     })
        // //     return outputString;
        // // };

        // addCanvas =  function(addedCanvas) {
        //     var canvas = document.createElement('canvas');
        //     canvas.setAttribute("id", "canvasWindow");
        //     canvas.width = addedCanvas.width;
        //     canvas.height = addedCanvas.height;
        //     $( "#drawingContainer" ).append(canvas);
        //     $rootScope.canvasIsAdded = true;
        //     selectedcanvasWindow = new fabric.Canvas('canvasWindow',{backgroundColor : "white"});
        //     selectedcanvasWindow.on('object:moving', function (e) {
        //         var obj = e.target;
        //         // if object is too big ignore
        //         if(obj.currentHeight > obj.canvas.height || obj.currentWidth > obj.canvas.width){
        //             return;
        //         }
        //         obj.setCoords();
        //         // top-left  corner
        //         if(obj.getBoundingRect().top < 0 || obj.getBoundingRect().left < 0){
        //             obj.top = Math.max(obj.top, obj.top-obj.getBoundingRect().top);
        //             obj.left = Math.max(obj.left, obj.left-obj.getBoundingRect().left);
        //         }
        //         // bot-right corner
        //         if(obj.getBoundingRect().top+obj.getBoundingRect().height  > obj.canvas.height || obj.getBoundingRect().left+obj.getBoundingRect().width  > obj.canvas.width){
        //             obj.top = Math.min(obj.top, obj.canvas.height-obj.getBoundingRect().height+obj.top-obj.getBoundingRect().top);
        //             obj.left = Math.min(obj.left, obj.canvas.width-obj.getBoundingRect().width+obj.left-obj.getBoundingRect().left);
        //         }
        //     });

        //     // selectedcanvasWindow.on('object:modified', function(options) {
        //     //     if (options.target && options.target.type == "rect") {
        //     //         $scope.rectCenterPointX = (options.target.getCenterPoint().x/10).toFixed(2);
        //     //         $scope.rectCenterPointY = (options.target.getCenterPoint().y/10).toFixed(2);
        //     //         $scope.firstRectCoordinateX = (options.target.getCoords()[0].x/10).toFixed(2);
        //     //         $scope.firstRectCoordinateY = (options.target.getCoords()[0].y/10).toFixed(2);
        //     //         $scope.secondRectCoordinateX = (options.target.getCoords()[1].x/10).toFixed(2);
        //     //         $scope.secondRectCoordinateY = (options.target.getCoords()[1].y/10).toFixed(2);
        //     //         $scope.thirdRectCoordinateX = (options.target.getCoords()[2].x/10).toFixed(2);
        //     //         $scope.thirdRectCoordinateY = (options.target.getCoords()[2].y/10).toFixed(2);
        //     //         $scope.forthRectCoordinateX = (options.target.getCoords()[3].x/10).toFixed(2);
        //     //         $scope.forthRectCoordinateY = (options.target.getCoords()[3].y/10).toFixed(2);
        //     //         $timeout (function () {
        //     //             $('#rectangularCoordinateModal').modal('show');
        //     //             $('.modal-backdrop').removeClass("modal-backdrop");
        //     //             $("#rectangularCoordinateModal").draggable({
        //     //                 handle: ".modal-header"
        //     //             });
        //     //         }, 0)
        //     //     }
        //     // });

        //     selectedcanvasWindow.on('mouse:dblclick', function(object) {
        //         if(object.target && object.target.columnInfo) {
        //             console.log(object.target.columnInfo);
        //             $scope.clickedMaterial = object.target.columnInfo;

        //             $timeout (function () {
        //                 $('#materialInfoModal').modal('show');
        //                 $('.modal-backdrop').removeClass("modal-backdrop");
        //                 $("#materialInfoModal").draggable({
        //                     handle: ".modal-header"
        //                 });
        //             }, 0)
        //         }
        //     });

        //     selectedcanvasWindow.on('mouse:over', function(object) {
        //         if(object.target && object.target.columnInfo) {
        //             console.log(object.target.columnInfo);
        //             console.log("In");
        //         }
        //     });

        //     selectedcanvasWindow.on('mouse:out', function(object) {
        //         if(object.target && object.target.columnInfo) {
        //             console.log(object.target.columnInfo);
        //             console.log("out");
        //         }
        //     });



        // };

        // addGrid = function () {
        //     var width = selectedcanvasWindow.width;
        //     var height = selectedcanvasWindow.height;

        //     var j = 0;
        //     var line = null;
        //     var rect = [];
        //     var size = 20;


        //     for (var i = 0; i < Math.ceil(width / 20); ++i) {
        //         rect[0] = i * size;
        //         rect[1] = 0;

        //         rect[2] = i * size;
        //         rect[3] = height;

        //         line = null;
        //         line = new fabric.Line(rect, {
        //             stroke: '#999',
        //             opacity: 0.5,
        //         });

        //         line.selectable = false;
        //         selectedcanvasWindow.add(line);
        //         line.sendToBack();

        //     }

        //     for (i = 0; i < Math.ceil(height / 20); ++i) {
        //         rect[0] = 0;
        //         rect[1] = i * size;

        //         rect[2] = width;
        //         rect[3] = i * size;

        //         line = null;
        //         line = new fabric.Line(rect, {
        //             stroke: '#999',
        //             opacity: 0.5,
        //         });
        //         line.selectable = false;
        //         selectedcanvasWindow.add(line);
        //         line.sendToBack();

        //     }

        //     selectedcanvasWindow.renderAll();
        // };

        // addCanvas({width:1860,height:890});
        // addGrid();

        // readCrosslightFile =  function (){
        //     var rawFile1 = new XMLHttpRequest();
        //     rawFile1.open("GET", "file:///src/crosslight.mac", false);
        //     rawFile1.onreadystatechange = function ()
        //     {
        //         if(rawFile1.readyState === 4)
        //         {
        //             if(rawFile1.status === 200 || rawFile1.status == 0)
        //             {
        //                 var allText1 = rawFile1.responseText;
        //                 macfile = allText1;
        //             }
        //         }
        //     }
        //     rawFile1.send(null);
        //     var rawFile2 = new XMLHttpRequest();
        //     rawFile2.open("GET", "file:///src/more.mac", false);
        //     rawFile2.onreadystatechange = function ()
        //     {
        //         if(rawFile2.readyState === 4)
        //         {
        //             if(rawFile2.status === 200 || rawFile2.status == 0)
        //             {
        //                 var allText2 = rawFile2.responseText;
        //                 morefile = allText2;
        //             }
        //         }
        //     }
        //     rawFile2.send(null);
        // };

        // populateMaterialCombo = function (materialFileContent) {
        //     var extractedArr = materialFileContent.match(/(?:material_lib)([^]+?)(?:end_library)/g);
        //     $scope.materialArr = [];
        //     var colors = ["aliceblue","antiquewhite","aqua","aquamarine","azure","beige","bisque","black","blanchedalmond","blue","blueviolet","brown","burlywood","cadetblue","chartreuse","chocolate","coral","cornflowerblue","cornsilk","crimson","cyan","darkblue","darkcyan","darkgoldenrod","darkgray","darkgrey","darkgreen","darkkhaki","darkmagenta","darkolivegreen","darkorange","darkorchid","darkred","darksalmon","darkseagreen","darkslateblue","darkslategray","darkslategrey","darkturquoise","darkviolet","deeppink","deepskyblue","dimgray","dimgrey","dodgerblue","firebrick","floralwhite","forestgreen","fuchsia","gainsboro","ghostwhite","gold","goldenrod","gray","grey","green","greenyellow","honeydew","hotpink","indianred","indigo","ivory","khaki","lavender","lavenderblush","lawngreen","lemonchiffon","lightblue","lightcoral","lightcyan","lightgoldenrodyellow","lightgray","lightgrey","lightgreen","lightpink","lightsalmon","lightseagreen","lightskyblue","lightslategray","lightslategrey","lightsteelblue","lightyellow","lime","limegreen","linen","magenta","maroon","mediumaquamarine","mediumblue","mediumorchid","mediumpurple","mediumseagreen","mediumslateblue","mediumspringgreen","mediumturquoise","mediumvioletred","midnightblue","mintcream","mistyrose","moccasin","navajowhite","navy","oldlace","olive","olivedrab","orange","orangered","orchid","palegoldenrod","palegreen","paleturquoise","palevioletred","papayawhip","peachpuff","peru","pink","plum","powderblue","purple","rebeccapurple","red","rosybrown","royalblue","saddlebrown","salmon","sandybrown","seagreen","seashell","sienna","silver","skyblue","slateblue","slategray","slategrey","snow","springgreen","steelblue","tan","teal","thistle","tomato","turquoise","violet","wheat","white","whitesmoke","yellow","yellowgreen"];
        //     extractedArr.forEach(function (item,index) {
        //         var material = {};
        //         material.info = item;
        //         material.color= colors[index]
        //         if(item.indexOf("name")>-1){
        //             var nameIndex = item.indexOf("name"),
        //                 firsSpaceIndex = nameIndex + item.substring(nameIndex).indexOf(" ");
        //             material.name = item.substring(nameIndex +5,firsSpaceIndex);
        //             if(item.indexOf("var_symbol1")>-1){
        //                 var symbol1Index = item.indexOf("var_symbol1"),
        //                     firsSpaceIndex = symbol1Index + item.substring(symbol1Index).indexOf(" ");
        //                 firsNewLineIndex = symbol1Index + item.substring(symbol1Index).indexOf("\n");
        //                 if(firsSpaceIndex<firsNewLineIndex){
        //                     material.symbol1 = item.substring(symbol1Index +12,firsSpaceIndex);
        //                 } else if(firsSpaceIndex>firsNewLineIndex){
        //                     material.symbol1 = item.substring(symbol1Index +12,firsNewLineIndex);
        //                 }
        //             }
        //             if(item.indexOf("var_symbol2")>-1){
        //                 var symbol2Index = item.indexOf("var_symbol2"),
        //                     firsSpaceIndex = symbol2Index + item.substring(symbol2Index).indexOf(" "),
        //                     firsNewLineIndex = symbol2Index + item.substring(symbol2Index).indexOf("\n");
        //                 if(firsSpaceIndex<firsNewLineIndex){
        //                     material.symbol2 = item.substring(symbol2Index +12,firsSpaceIndex);
        //                 } else if(firsSpaceIndex>firsNewLineIndex){
        //                     material.symbol2 = item.substring(symbol2Index +12,firsNewLineIndex);
        //                 }
        //             }
        //             if(item.indexOf("var_symbol3")>-1){
        //                 var symbol3Index = item.indexOf("var_symbol3"),
        //                     firsSpaceIndex = symbol3Index + item.substring(symbol3Index).indexOf(" "),
        //                     firsNewLineIndex = symbol3Index + item.substring(symbol3Index).indexOf("\n");
        //                 if(firsSpaceIndex<firsNewLineIndex){
        //                     material.symbol3 = item.substring(symbol3Index +12,firsSpaceIndex);
        //                 } else if(firsSpaceIndex>firsNewLineIndex){
        //                     material.symbol3 = item.substring(symbol3Index +12,firsNewLineIndex);
        //                 }

        //             }
        //             $scope.materialArr.push(material);
        //         }
        //     })
        // }

        // readCrosslightAndMoreFile = function () {
        //     readCrosslightFile();
        //     var allText = morefile + macfile;
        //     populateMaterialCombo(allText);
        // }
        // readCrosslightAndMoreFile();

        // $scope.reset = function() {
        //     $scope.circle = angular.copy($scope.master);
        //     $scope.rectangular = angular.copy($scope.master);
        // };

        // $scope.selectStructure = function () {
        //     $('#structureModal').modal('show');
        // };

        // $scope.addLayer = function () {
        //     $('#layerDefinerModal').modal('show');
        // };
        // $scope.expand = function () {
        //     debugger;
        //     console.log(this);
        //     this.column.isMaterialInfoVisible = this.column.isMaterialInfoVisible ? false : true;
        // }
    }])