angular.module('drawingTool.controller', [])

    .controller('drawingToolController', ['$scope', '$timeout', '$rootScope', 'canvaspaper', function($scope, $timeout, $rootScope, canvaspaper) {
        var paper = canvaspaper.createCanvasPaper();
        let minispice = $rootScope.minispice;
        $rootScope.isDrawingRect = true;

        function polywind(polypt,pt ) {
          /*20230803 by NancyQ
          1. Return the winding number of a polygon(specified by a vector of vertex points polyvt) around an arbitary point pt;
          2. If the returned value is 1 or -1, the point is inside the polygon; If it's 0, it's outside;
          3. Any other answer indicates the polygon isn't a simple polygon (by simple , it means none of its line segments intersect, 
             if there're one or more segment intersections, it's a complex polygon);
          */
         var i,np,wind=0;
         var d0,d1,p0,p1,pt0,pt1;
         np=polypt.length;
         pt0=pt.x;
         pt1=pt.y;
         p0=polypt[np-1].x;    //save last vertex as "previous" to first
         p1=polypt[np-1].y;
      
         for(i=0;i<np;i++){    //loop over edges
              d0=polypt[i].x;
              d1=polypt[i].y;
              if(p1<=pt1){
                  if(d1>pt1 && (p0-pt0)*(d1-pt1)-(p1-pt1)*(d0-pt0)>0)
                      wind++;//upward-crossing edge. Is pt to its left? 
              }else{
                  if(d1<=pt1 && (p0-pt0)*(d1-pt1)-(p1-pt1)*(d0-pt0)<0)
                      wind--; //downward-crossing edge. Is pt to its right? 
              }
              p0=d0;           //current vertex becomes previous one
              p1=d1;
          }
          return wind;
         
      
          
      }


         $rootScope.canvas = new fabric.Canvas('drawingContainer',{
            width: 1500,
            height: 2000,
            selection: false,
            lockMovementX: true,
            lockMovementY: true,
            backgroundColor: '#fff'
        });


        var rect, isDown, origX, origY;
        const rectangles = [];
        const corners = [];
        let rectCorners = [];


// add points on the edge of rectangular if the click is close enough

        // $rootScope.canvas.on('mouse:down', function(event) {
        //   var mousePos = $rootScope.canvas.getPointer(event.e);
        // debugger;
        //   rectangles.forEach(function(object) {
        //     if (object.type === 'rect') {
        //       debugger
        //       // Calculate distances from the mouse position to each edge
        //       var distances = {
        //         top: Math.abs(mousePos.y - object.top),
        //         bottom: Math.abs(object.top + object.height - mousePos.y),
        //         left: Math.abs(mousePos.x - object.left),
        //         right: Math.abs(object.left + object.width - mousePos.x)
        //       };
        
        //       var edgeTolerance = 5; // Tolerance for considering it as an edge click
        
        //       // Find the closest edge
        //       var closestEdge = Object.keys(distances).reduce(function(prev, curr) {
        //         return distances[curr] < distances[prev] ? curr : prev;
        //       });
        
        //       // Check if the closest edge is within the tolerance
        //       if (distances[closestEdge] <= edgeTolerance) {
        //         var circlePos;
        
        //         switch (closestEdge) {
        //           case 'top':
        //             circlePos = { x: mousePos.x, y: object.top };
        //             break;
        //           case 'bottom':
        //             circlePos = { x: mousePos.x, y: object.top + object.height };
        //             break;
        //           case 'left':
        //             circlePos = { x: object.left, y: mousePos.y };
        //             break;
        //           case 'right':
        //             circlePos = { x: object.left + object.width, y: mousePos.y };
        //             break;
        //         }
        
        //         // Draw the circle
        //         var circle = new fabric.Circle({ radius: 5, left: circlePos.x, top: circlePos.y, fill: 'red' });
        //         $rootScope.canvas.add(circle);
        //         $rootScope.canvas.renderAll();
        //       }
        //     }
        //   });
        // });

        function calculateDistance(point1, point2) {
          const dx = point2[0] - point1[0];
          const dy = point2[1] - point1[1];
          return Math.sqrt(dx * dx + dy * dy);
        }
      
      
      
        
      function pointToLineDistance(point, lineStart, lineEnd) {
          //20230810 by Nancy, function to calculate the distance between a point and a line segment
          var x = point.x;
          var y = point.y;
          var x1 = lineStart.x;
          var y1 = lineStart.y;
          var x2 = lineEnd.x;
          var y2 = lineEnd.y;
        
          var num = Math.abs((x2 - x1) * (y1 - y) - (x1 - x) * (y2 - y1));
          var den = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
        
          return num / den;
      }
      
      function isPointInLineRange(point, startPoint, endPoint) {
          
          // Calculate the vectors representing the line segment and point
          const lineVector = [endPoint.x - startPoint.x, endPoint.y - startPoint.y];
          const pointVector = [point[0] - startPoint.x, point[1] - startPoint.y];
        
          // Calculate the dot product of the line vector and the point vector
          const dotProduct = pointVector[0] * lineVector[0] + pointVector[1] * lineVector[1];
        
          // Calculate the squared magnitude of the line vector
          const lineMagnitudeSquared = lineVector[0] * lineVector[0] + lineVector[1] * lineVector[1];
        
          // Check if the dot product is within the range of the line segment
          return dotProduct >= 0 && dotProduct <= lineMagnitudeSquared;
        }
      
      function isPointCloseToEdge(point, lineStart, lineEnd,threshold) {
          /*20230810 by Nancy,function to judge if point is very close to an edge of a polygon
          */
          const distance = pointToLineDistance(point, lineStart, lineEnd);
          if(distance==0)//the point is right on the edge
              return 0;
          else if(distance<threshold)//the point is close to the edge
              return 1;
          else
              return -1;
      
        
      }


      function movePointOntoLine(point, lineStart, lineEnd) {
          /*20230810 by Nancy,function to move a point onto a line if it's too close
          */
          
          const lineDirectionX = lineEnd.x - lineStart.x;
          const lineDirectionY = lineEnd.y - lineStart.y;
      
          const pointDirectionX = point.x - lineStart.x;
          const pointDirectionY = point.y - lineStart.y;
      
          const dotProduct =
          (pointDirectionX * lineDirectionX + pointDirectionY * lineDirectionY) /
          (lineDirectionX * lineDirectionX + lineDirectionY * lineDirectionY);
      
          const projectedPointX = lineStart.x + dotProduct * lineDirectionX;
          const projectedPointY = lineStart.y + dotProduct * lineDirectionY;
      
          return [projectedPointX, projectedPointY];
          
          
      }



        function adjust_pt_close_to_polygon_edge(targetPt,polyPt,threshold){
          /*20230812 by Nancy, to determine if a targetPt is close to any edge of a polygon(defined by a point sequence of polypt)
          move targetPt to the closest edge with distance less than threshold and the tagetPt should lie within the range of the edge;
          if no edge was found matching with the above conditions, calculate the distance between targetPt and each corner point
          of the polygon, if the closest one is less than threshold, then move targetPt to the closest corner point.*/
      
          var tflag=false;//if targetPt is found on any edge or moved to any edge ,set this flag=true 
          var closest_dist=1000000000000000;//record the closest distance between target point and each polygon edge 
          var closest_edge_index=-1;//record the closest edge index 
      
          //for each edge of the polygon, find the closest edge to targetPt(distance<thresold and targetPt within edge range) 
          for(var i=0;i<polyPt.length ;i++){
              var sp=polyPt[i];
              var ep=polyPt[0];
              if(i<polyPt.length-1)
                  ep=polyPt[i+1];
      
              const rp=isPointCloseToEdge(targetPt,sp,ep,threshold);
              if(rp==0 || rp==1){//if the targetPt is right one edge or close to edge
                  var adjustedPt=movePointOntoLine(targetPt,sp,ep);//get the adjusted point if move onto edge
                  if(isPointInLineRange(adjustedPt,sp,ep)){//judge if adjusted point lies within the range of current edge
                      var distance = pointToLineDistance(targetPt, sp, ep);//get the distance between targetPt and current edge
                      if(distance<closest_dist){
                          closest_dist=distance;
                          closest_edge_index=i;
                      }
                      tflag=true;
                  }
              }
          }
      
          if(tflag && closest_edge_index>-1){//if found the closest edge, then move targetPt onto this edge
              var startPt=polyPt[closest_edge_index];
              var endPt=startPt;
              if(closest_edge_index==polyPt.length-1)
                  endPt=polyPt[0];
              else 
                  endPt=polyPt[closest_edge_index+1];
              var adjustedPt=movePointOntoLine(targetPt,startPt,endPt);
              targetPt.x=adjustedPt[0];
              targetPt.y=adjustedPt[1];
              drawPoint(context,adjustedPt[0],adjustedPt[1],"","#00F",psize);
          }else{//if didn't find any edge close to targetPt,judge for every corner to see if any corner point is close to targetPt
              for(i=0;i<polyPt.length ;i++){
                  var pt1=[polyPt[i].x,polyPt[i].y];
                  var pt2=[targetPt.x,targetPt.y];
                  var dist=calculateDistance(pt1,pt2);
                  if(dist<threshold){//move target point to the corner
                      targetPt.x=pt1[0];
                      targetPt.y=pt1[1];
                      drawPoint(context,pt1[0],pt1[1],"","#00F",psize);
                      break;
                  }
              }
          }
      
      
      }

        $rootScope.canvas.on('mouse:down', function(o){
          if ($rootScope.isDrawingRect) {
          isDown = true;
          var pointer = $rootScope.canvas.getPointer(o.e);
          origX = pointer.x;
          origY = pointer.y;
          var pointer = $rootScope.canvas.getPointer(o.e);
          rect = new fabric.Rect({
              left: origX,
              top: origY,
              originX: 'left',
              originY: 'top',
              width: pointer.x-origX,
              height: pointer.y-origY,
              angle: 0,
              fill: 'rgba(255,0,0,0.5)',
              transparentCorners: false
          });
          
          $rootScope.canvas.add(rect);
        }else{

          ////// replace this with Nancy's function. that function expects array of corners for each polygon which is corners array coming from calling getCornersClockwise

            var mousePos = $rootScope.canvas.getPointer(o.e);
        debugger;
          rectangles.forEach(function(object) {
            if (object.type === 'rect') {
              debugger
              // Calculate distances from the mouse position to each edge
              var distances = {
                top: Math.abs(mousePos.y - object.top),
                bottom: Math.abs(object.top + object.height - mousePos.y),
                left: Math.abs(mousePos.x - object.left),
                right: Math.abs(object.left + object.width - mousePos.x)
              };
        
              var edgeTolerance = 5; // Tolerance for considering it as an edge click
        
              // Find the closest edge
              var closestEdge = Object.keys(distances).reduce(function(prev, curr) {
                return distances[curr] < distances[prev] ? curr : prev;
              });
        
              // Check if the closest edge is within the tolerance
              if (distances[closestEdge] <= edgeTolerance) {
                var circlePos;
        
                switch (closestEdge) {
                  case 'top':
                    circlePos = { x: mousePos.x, y: object.top };
                    break;
                  case 'bottom':
                    circlePos = { x: mousePos.x, y: object.top + object.height };
                    break;
                  case 'left':
                    circlePos = { x: object.left, y: mousePos.y };
                    break;
                  case 'right':
                    circlePos = { x: object.left + object.width, y: mousePos.y };
                    break;
                }
        
                // Draw the circle
                var circle = new fabric.Circle({ radius: 5, left: circlePos.x, top: circlePos.y, fill: 'red' });
                $rootScope.canvas.add(circle);
                $rootScope.canvas.renderAll();
              }
            }
          });
        }
      });

      $rootScope.canvas.on('mouse:move', function(o){
          if (!isDown) return;
          var pointer = $rootScope.canvas.getPointer(o.e);

          if(origX>pointer.x){
              rect.set({ left: Math.abs(pointer.x) });
          }
          if(origY>pointer.y){
              rect.set({ top: Math.abs(pointer.y) });
          }

          rect.set({ width: Math.abs(origX - pointer.x) });
          rect.set({ height: Math.abs(origY - pointer.y) });
          

          $rootScope.canvas.renderAll();
      });


      // Given a fabric.js object, get its corners in clockwise order
      function getCornersClockwise(object) {
        if (object.type === 'rect') {
            return [
                { x: object.left, y: object.top },
                { x: object.left + object.width, y: object.top },
                { x: object.left + object.width, y: object.top + object.height },
                { x: object.left, y: object.top + object.height }
            ];
        } else if (object.type === 'triangle') {
            return [
                { x: object.left, y: object.top + object.height }, // Base vertex
                { x: object.left + object.width, y: object.top + object.height }, // Right vertex
                { x: object.left + object.width / 2, y: object.top } // Left vertex
            ];
        } else if (object.type === 'polygon') {
            return object.points.map(function(point) {
                return { x: point.x, y: point.y };
            });
        }
        
        // Handle other polygon types here if needed
        
        return [];
      }


      $rootScope.canvas.on('mouse:up', function(o){
        rectangles.push(rect);
        debugger
        //rectCorners = [{ x: rect.left, y: rect.top }, { x: rect.left + rect.width, y: rect.top }, { x: rect.left + rect.width, y: rect.top + rect.height }, { x: rect.left, y: rect.top + rect.height }]
        //console.log(rectCorners)
        rectCorners = getCornersClockwise(rect)

        debugger;
        
        if(corners.length>0){
          debugger
          for(let i=0;i<corners.length;i++){
            for(let j=0;j<rectCorners.length;j++){
              if(polywind(corners[i], rectCorners[j])===1 || polywind(corners[i], rectCorners[j])===-1){
                $rootScope.canvas.remove(rect);
                $rootScope.canvas.renderAll();
                return;
              }
              console.log(polywind(corners[i], rectCorners[j]))
            }
          }
          corners.push(rectCorners);
        }else{
          corners.push(rectCorners);
        }
        isDown = false;
      });


    }])