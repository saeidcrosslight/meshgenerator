angular.module('drawingTool.controller', [])

    .controller('drawingToolController', ['$scope', '$timeout', '$rootScope', 'canvaspaper', function($scope, $timeout, $rootScope, canvaspaper) {
        var paper = canvaspaper.createCanvasPaper();
        let minispice = $rootScope.minispice;

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

      function flattenObjectToOrderedCoordinates(obj) {
        const order = ["tl", "tr", "br", "bl"];
        const flattenedArray = order.map((key) => {
          const { x, y } = obj[key];
          return { x, y };
        });
        return flattenedArray;
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

        $rootScope.canvas.on('mouse:down', function(o){
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