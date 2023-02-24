var oldProjectPath = "c:\\", oldFilePath = "";


angular.module('quick.controller', [])
        .controller('quickBarController', ['$rootScope', '$scope', 'canvas', 'filereader', 'paperevents', function ($rootScope, $scope, canvas, filereader, paperevents) {
                $scope.addFileTypes = ['12', '13'];
                
                let minispice = $rootScope.minispice,
                    isDraw = minispice.paintSwitch.isStartDraw,
                    painType = minispice.paintSwitch.type,
                    networkObject = $rootScope.networkObject,
                    fileReader = filereader.createFilereader(),
                    cv = canvas.create();
                getFilePath = function (filepath) {
                    var num = filepath.lastIndexOf("\\");
                    return filepath.substring(0, num);
                },
                getFileName = function (filepath) {
                    var num = filepath.lastIndexOf("\\");
                    return filepath.substring(num + 1);
                },
                openProjectFunction = function (minispice, fileDialogID) {
                    var filePath = document.querySelector(fileDialogID).value;
                    if (filePath === "")
                        return false;
                    var projectPath = getFilePath(filePath),
                        fileName = getFileName(filePath),
                        newFilePath = filePath.replace(/\\/g, '\\\\');
                    var editorObject = minispice.editors.getEditorObject(minispice.productName, fileName, projectPath.replace(/\\/g, '\\\\'));

                    if(minispice.filetree.inputfiles[0].nodes.length >= 1){ //It has a project already
                        minispice.filetree.resetAllFileTree(minispice.filetree);
                        minispice.editors.closeAllFile(editorObject.editorContainerID, minispice.openFiles); //delete all editors & filetitles
                    }
                    minispice.filetree.createAllFileTree(minispice.filetree, projectPath);
                    minispice.editors.createEdtior(minispice, fileName, newFilePath, editorObject.editorID, editorObject.editorContainerID, editorObject.editorArrayObject); //editorIDPre + fileName = editorID

                    minispice.projectPath = projectPath;
                    $("#editorID").val(editorObject.editorID);
                    document.querySelector(fileDialogID).value = '';
                    $("#fixNoRefresh").click();
                    fileReader.readAscFile(filePath);

                },
                openProject = function(){
                    if(!openProjectFunction(minispice, '#fileDialog')){
                        return;
                    }
                },
                resetNewProject = function () {
                    $("#newProjectName").val("");
                    $("#newProjectPath").val("c:\\");
                    oldProjectPath = "c:\\";
                    $("#chooseProjectPath").val("");
                    //document.querySelector('#chooseProjectPath').value = "";
                },

                resetCreatedStructures = function () {
                    _.each(graph.getElements(), function(el) {
                        graph.getCell(el.id).remove();
                    });
                },
                saveStructure = function (){
                    debugger;
                    //minispice.saveCreatedStructure(minispice.projectPath, minispice.projectName, $rootScope.points, '12')
                    minispice.saveNewCreatedStructure(minispice.appPath, $rootScope.points)
                },

                createTrangles = function(){
                    minispice.createNewTrangles(minispice.appPath, $rootScope.points);
                }

                userSettingFunction = function (product, chooseID, appPathID, helpPath) {
                    debugger;
                    $("#userSettingWindow").modal('toggle');
                    var pj = document.querySelector(chooseID);
                    pj.addEventListener("change", function (evt) {
                        document.querySelector(appPathID).value = this.value;
                        product.appPath = this.value;
                        product.helpPath = product.appPath + helpPath;
                        //product.setUserSetting(product.appPathName, this.value);
                        //product.setDeoSetting(product.appPathName, this.value);
                        //product.navigations = product.getNavigation(product.productName, product.appPath);
                    }, false);
                },

                newProjectFunction = function () {
                    if (minispice.addedCircuitComponents.length>0 && minispice.newPath.length > 0) {
                        if (confirm("Do to want to exit?") == true) {
                            resetCreatedStructures();
                        } else {
                            return false;
                        }
                    }

                    resetNewProject();
                    $("#newProjectWindow").modal('toggle');
                    var pj = document.querySelector('#chooseProjectPath');
                    pj.addEventListener("change", function () {
                        if ($("#newProjectName").val() !== "")
                            $('#newProjectPath').val(this.value + "\\" + $("#newProjectName").val());
                        else
                            $('#newProjectPath').val(this.value);
                        oldProjectPath = this.value;
                    }, false);
                };

                closeProjectFunction = function(){
                    console.log(minispice);
                };

                startToDraw = function(type){
                    minispice.paintSwitch.isStartDraw = true;
                    cv.hideGuide(minispice.papers[0].guide);
                    minispice.paintSwitch.cursorIcon = "crosshair";
                    document.getElementById("paper").style.cursor = minispice.paintSwitch.cursorIcon;
                };

                /**
                 * Updating when change project name in New Project Window
                 */
                updateProjectPath = function () {
                    $("#newProjectPath").val(oldProjectPath + "\\" + $("#newProjectName").val());
                };
                updateFilePath = function () {
                    $("#newFilePath").val(oldFilePath + "\\");
                };
                $scope.newProject = function () {
                    debugger;
                    var newName = $("#newProjectName").val(),
                            newPath = $("#newProjectPath").val().replace(/\\/g, '\\\\');
                            minispice.newPath = newPath;
                            minispice.newProjectName = newName;
                            // product = simucenter.currentProduct();
                    if (newName === "" || newPath === "") {
                        alert("Project name and path cannot be empty!");
                    } else {
                        var addFileTypes = [];
                        addFileTypes.length = 0;
                        var checkedObjects = $("input[name='newPrjectFileType_" + minispice.productName + "']:checked");
                        if (checkedObjects.length > 0){
                            angular.forEach(checkedObjects, function (obj) {
                                addFileTypes.push($(obj).val());
                            });
                        }
                        if (addFileTypes.length === 0) {
                            alert("Please choose file type!");
                            return;
                        }
                        minispice.createProject(newName, newPath, addFileTypes);
                        minispice.filetree.resetAllFileTree(minispice.filetree);
                        minispice.filetree.createAllFileTree(minispice.filetree, newPath);
                        var fileName = newName + "." + addFileTypes[0];
                        var editorObject = minispice.editors.getEditorObject(minispice.productName, newName, newPath);//filepath(last parameter)
                        minispice.editors.closeAllFile(editorObject.editorContainerID, minispice.openFiles);
                        minispice.editors.createEdtior(minispice, fileName, newPath + "\\\\" + fileName, editorObject.editorID, editorObject.editorContainerID, editorObject.editorArrayObject);
                        //var projectPath = getFilePath(filePath);
                        minispice.projectPath = newPath.replace(/\\/g, '/').replace(/\/\//g, "\\");
                        minispice.projectName=newName;
                        //minispice.title = "Welcome to SimuCenter - Simu" + product.productName + " - " + product.projectPath;
                        minispice.title = "Welcome to SimuCenter - Simu" + minispice.productName + " - " + newPath.replace(/\\/g, '/');
                        $("#newProjectWindow").modal('toggle');
                    }
                    //minispice.enableSaveButton();
                };
                createRect = function () {
                    debugger;
                    // switchToDrawingTool();
                    $("#createCubeWindow").modal('show');
                },

                $scope.quickEvent = function (index, isDisabled, e) {
                    //var move;
                    if (isDisabled === 'disabled')
                        return;
                        
                    switch (index) {
                        case 0://Rect
                           createRect();
                            break;
                        case 1://new
                           newProjectFunction();
                            break;
                        case 2://save
                            saveStructure();
                            break;
                        case 3: //User Setting
                            userSettingFunction(minispice, '#appPathFolder_MeshGenerator', "input[ng-model='minispice.appPath']", "/GUI/HTML/general/manual.html");
                        break;
                        case 4: //Create triangle
                       createTrangles();
                    break;
                    }
                };

            }]);