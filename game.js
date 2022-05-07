var ctx;
var x = 100;
var y = 100;
var dragFlag = false;
var socket;
var dragData = null;
var id = 0;
var rColor = null;
var gColor;
var bColor;
var mapData = [];
var isDraged = false;
var dragStart = null;
var dragEnd = null;
var dragMove = null;
var dragStartArray = null;
var firstFlag = true;
var timer = 0;
var areas = [];
var dragAdjustPositionX = 0;
var dragAdjustPositionY = 0;
var dragIndex = 0;
var dragArea = {
  id: 0,
  kind: 0,
  x: 0,
  y: 0,
  r: 0,
  g: 0,
  b: 0,
  time: 0
};
var mouseDownIndex = 0;
var mouseUpIndex = 0;
// var dragAreaMouseDownX = 0;
// var dragAreaMouseDownY = 0;
// var dragAreaMouseUpX = 0;
// var dragAreaMouseUpY = 0;
var areas = [];
var bullet = [];
const KIND_EMPTY = 1;
const KIND_RED   = 2;
const KIND_GREEN = 3;

window.onload = function() {
    const canvas = document.getElementById("canvas");
    canvas.width = 640;
    canvas.height = 640;
    ctx = canvas.getContext("2d");

    // for (let i = 0; i < 2; ++i) {
    //   let area = {
    //     kind: 0,
    //     r: 0,
    //     b: 0,
    //     g: 0,
    //   };
    //   areas.push(area);
    // }

    //#####################
    // 各陣地をランダムに生成
    //#####################
    for (let l = 0; l < 20; ++l) {
      if (l == 0) {
        let area = {
          id: id,
          kind: KIND_RED,
          x: Math.floor(Math.random() * 600),
          y: Math.floor(Math.random() * 600),
          r: 255,
          g: 0,
          b: 0,
          bullets: [],
          bulletSpeed: 0,
          bulletTime: 0,
          dragAreaMouseDownX: 0,
          dragAreaMouseDownY: 0,
          dragAreaMouseUpX: 0,
          dragAreaMouseUpY: 0,
          time: Math.floor(Math.random() * 600)
        }
        mapData.push(area);
      } else if (l == 1) {
        let area = {
          id: id,
          kind: KIND_GREEN,
          x: Math.floor(Math.random() * 600),
          y: Math.floor(Math.random() * 600),
          r: 0,
          g: 255,
          b: 0,
          bullets: [],
          bulletSpeed: 0,
          bulletTime: 0,
          dragAreaMouseDownX: 0,
          dragAreaMouseDownY: 0,
          dragAreaMouseUpX: 0,
          dragAreaMouseUpY: 0,
          time: Math.floor(Math.random() * 600)
        }
        mapData.push(area);
      } else if (l == 2) {
        let area = {
          id: id,
          kind: KIND_GREEN,
          x: Math.floor(Math.random() * 600),
          y: Math.floor(Math.random() * 600),
          r: 0,
          g: 0,
          b: 255,
          bullets: [],
          bulletSpeed: 0,
          bulletTime: 0,
          dragAreaMouseDownX: 0,
          dragAreaMouseDownY: 0,
          dragAreaMouseUpX: 0,
          dragAreaMouseUpY: 0,
          time: Math.floor(Math.random() * 600)
        }
        mapData.push(area);
      } else {
        let area = {
          id: id,
          kind: KIND_EMPTY,
          x: Math.floor(Math.random() * 600),
          y: Math.floor(Math.random() * 600),
          r: 255,
          g: 255,
          b: 255,
          bullets: [],
          bulletSpeed: 0,
          bulletTime: 0,
          dragAreaMouseDownX: 0,
          dragAreaMouseDownY: 0,
          dragAreaMouseUpX: 0,
          dragAreaMouseUpY: 0,
          time: Math.floor(Math.random() * 600)
        };
        mapData.push(area);
      }
      id += 1;
    }
  
    canvas.addEventListener('mousedown', (event) => {
  
      // if (x > event.clientX - canvas.offsetLeft - 16 && event.clientX - canvas.offsetLeft + 16 > x &&
      //     y > event.clientY - canvas.offsetTop  - 16 && event.clientY - canvas.offsetTop  + 16 > y) {


        if (mapData != null) {
          let i = 0;
          for (let j = 0; j < mapData.length; ++j) {
            if (mapData[j].x > event.clientX - canvas.offsetLeft - 16 - 16 && event.clientX - canvas.offsetLeft + 16 - 16 > mapData[j].x &&
                mapData[j].y > event.clientY - canvas.offsetTop  - 16 - 16 && event.clientY - canvas.offsetTop  + 16 - 16 > mapData[j].y) {

              dragAdjustPositionX = mapData[j].x - (event.clientX - canvas.offsetLeft);
              dragAdjustPositionY = mapData[j].y - (event.clientY - canvas.offsetTop );
              dragArea.x = mapData[j].x;
              dragArea.y = mapData[j].y;
              dragArea.r = mapData[j].r;
              dragArea.g = mapData[j].g;
              dragArea.b = mapData[j].b;
              dragArea.kind = mapData[j].kind;
              dragArea.time = mapData[j].time;
              dragIndex = i;
              dragFlag = true;

              mapData[j].dragAreaMouseDownX = mapData[j].x + AREA_SIZE / 2;
              mapData[j].dragAreaMouseDownY = mapData[j].y + AREA_SIZE / 2;
              mouseDownIndex = j;
              console.log(mapData[j].dragAreaMouseDownX);
              break;
            }
            i += 1;
          }
        }
  
        firstFlag = false;
        dragStart = {
          x: event.clientX - canvas.offsetLeft,
          y: event.clientY - canvas.offsetTop
        };
        dragMove = null;
  
        // socket.emit("dragStart", {
        //   id: id,
        //   x: dragStart.x,
        //   y: dragStart.y,
        //   r: rColor,
        //   g: gColor,
        //   b: bColor
        // });
      // }
    }, false);
  
    canvas.addEventListener('mousemove', (event) => {
      if (dragFlag) {
        x = event.clientX - canvas.offsetLeft;
        y = event.clientY - canvas.offsetTop;

        dragArea.x = x + dragAdjustPositionX;
        dragArea.y = y + dragAdjustPositionY;
        dragMove = {
          x: x,
          y: y
        };
      }
        // socket.emit("drag", {
        //   id: id,
        //   x: x,
        //   y: y,
        //   r: rColor,
        //   g: gColor,
        //   b: bColor
        // });
    }, false);
    
    canvas.addEventListener('mouseup', (event) => {
      if (mapData != null) {
        isDraged = false;
        let j = 0;
        for (const data of mapData) {
          if (data.x > event.clientX - canvas.offsetLeft - 16 - 16 && event.clientX - canvas.offsetLeft + 16 - 16 > data.x &&
              data.y > event.clientY - canvas.offsetTop  - 16 - 16 && event.clientY - canvas.offsetTop  + 16 - 16 > data.y) {
                isDraged = true;
  
                if (data.kind == KIND_EMPTY) {
                  // data.time += dragArea.time;
                  data.r = dragArea.r;
                  data.g = dragArea.g;
                  data.b = dragArea.b;
                  data.kind = dragArea.kind;  
                } else if (data.kind == dragArea.kind) {
                  // data.time += dragArea.time;
                  data.r = dragArea.r;
                  data.g = dragArea.g;
                  data.b = dragArea.b;  
                  data.kind = dragArea.kind;  
                } else {
                  // data.time -= dragArea.time;
                  if (data.time < 0) {
                    data.time = -data.time;
                    data.kind = dragArea.kind;
                    data.r = dragArea.r;
                    data.g = dragArea.g;
                    data.b = dragArea.b;
  
                  }
                }



                dragMove = null;
                dragEnd = {
                  x: data.x + AREA_SIZE / 2,
                  y: data.y + AREA_SIZE / 2
                };
                x = data.x + AREA_SIZE / 2;
                y = data.y + AREA_SIZE / 2;

                data.dragAreaMouseUpX = data.x + AREA_SIZE / 2;
                data.dragAreaMouseUpY = data.y + AREA_SIZE / 2;
                mouseUpIndex = j;
                break;
          }
          ++j;
        }

                console.log(mapData[mouseDownIndex].time);
                for (let i = 0; i < mapData[mouseDownIndex].time / 10; ++i) {

                  let r = Math.sqrt( (mapData[mouseDownIndex].x - mapData[mouseUpIndex].dragAreaMouseUpX) * (mapData[mouseDownIndex].x - mapData[mouseUpIndex].dragAreaMouseUpX) +
                  (mapData[mouseDownIndex].y - mapData[mouseUpIndex].dragAreaMouseUpY) * (mapData[mouseDownIndex].y - mapData[mouseUpIndex].dragAreaMouseUpY) );

                  mapData[mouseDownIndex].dragAreaMouseUpX = mapData[mouseUpIndex].dragAreaMouseUpX;
                  mapData[mouseDownIndex].dragAreaMouseUpY = mapData[mouseUpIndex].dragAreaMouseUpY;

                  let bullet = 
                  {
                    isArrived: false,
                    x: mapData[mouseDownIndex].dragAreaMouseDownX,
                    y: mapData[mouseDownIndex].dragAreaMouseDownY,
                    dx: (mapData[mouseUpIndex].x + AREA_SIZE / 2 - mapData[mouseDownIndex].dragAreaMouseDownX) / r * 3,
                    dy: (mapData[mouseUpIndex].y + AREA_SIZE / 2 - mapData[mouseDownIndex].dragAreaMouseDownY) / r * 3,
                    mx: 0,
                    my: 0
                  };
                  mapData[mouseDownIndex].bullets.push(bullet);
                }
                mapData[mouseDownIndex].time = 0;

                // socket.emit("dragEnd", {
                //   id: id,
                //   x: dragEnd.x,
                //   y: dragEnd.y,
                //   r: rColor,
                //   g: gColor,
                //   b: bColor
                // });
        
        if (isDraged == false) {
          mapData[dragIndex].time = dragArea.time;
          dragArea.x = 0;
          dragArea.y = 0;
        }
        dragFlag = false;
      }
    }, false);
  
    loop();
  };
var COUNT_UP_TIME = 200;
var BULLET_TIME = 10;
var globalTime = 0;
var bulletTime = 0; 
var bulletSpeed = 1; 
var ADJUST = 1.0;
var AREA_SIZE = 32;
var BULLET_SIZE = 8;

var MAP_TIME = 0;
var matTime = 0;
var mapSpeed = 1;

var animation = 0;
function loop() {
  ctx.fillStyle = "green";
  ctx.fillRect(0, 0, 640, 640);
  for (const data of mapData) {
    ctx.fillStyle = "rgb("+data.r+","+data.g+","+data.b+")";
    ctx.fillRect(data.x / ADJUST, data.y / ADJUST, AREA_SIZE, AREA_SIZE);
      ctx.fillStyle = "rgb(0,0,0)";
      ctx.font = "18px serif";
      ctx.fillText("" + data.time, data.x + 2, data.y + 28);
  }

  // if (isDraged == true && dragMove == null) {


    if (mapData != null) {

      // matTime += 1;
      // if (matTime > MAP_TIME && mapSpeed < mapData.length - 1) {
      //   mapTime = 0;
      //   mapSpeed += 1;
      // }
      // if (mapSpeed >= mapData.length - 1) {
      //   mapSpeed = 0;
      // }

//      bulletTime += 1;
      // isDraged = false;
      // let j = mapSpeed;
      for (let j = 0; j < mapData.length; ++j) {
        mapData[j].bulletTime += 1;
        if (mapData[j].bulletTime > BULLET_TIME && mapData[j].bulletSpeed < mapData[j].bullets.length) {
          mapData[j].bulletTime = 0;
          mapData[j].bulletSpeed += 1;
        }
      }    
      for (let j = 0; j < mapData.length; ++j) {        
        for (let i = 0; i < mapData[j].bulletSpeed; ++i) {
          if (mapData[j].dragAreaMouseUpX - AREA_SIZE / 2 <= mapData[j].bullets[i].x + mapData[j].bullets[i].mx && mapData[j].bullets[i].x + mapData[j].bullets[i].mx <= mapData[j].dragAreaMouseUpX + AREA_SIZE / 2 &&
              mapData[j].dragAreaMouseUpY - AREA_SIZE / 2 <= mapData[j].bullets[i].y + mapData[j].bullets[i].my && mapData[j].bullets[i].y + mapData[j].bullets[i].my <= mapData[j].dragAreaMouseUpY + AREA_SIZE / 2) {
            mapData[j].bullets[i].isArrived = true;
            mapData[j]
          }
          if (mapData[j].bullets[i].isArrived == false) {
            mapData[j].bullets[i].mx += mapData[j].bullets[i].dx;
            mapData[j].bullets[i].my += mapData[j].bullets[i].dy;
            ctx.fillStyle = "rgb(" + mapData[j].r + "," + mapData[j].g + "," + mapData[j].b + ")";
            ctx.fillRect(mapData[j].bullets[i].x + mapData[j].bullets[i].mx, mapData[j].bullets[i].y + mapData[j].bullets[i].my, BULLET_SIZE, BULLET_SIZE);
          }    
        }
      }

      for (const data of mapData) {
        if (data.dragAreaMouseUpX - AREA_SIZE / 2 <= data.x  && data.x <= data.dragAreaMouseUpX + AREA_SIZE / 2 &&
            data.dragAreaMouseUpY - AREA_SIZE / 2 <= data.y && data.y <= data.dragAreaMouseUpY + AREA_SIZE / 2) {
          for (let i = 0; i < data.bullets.length; ++i) {
            if (data.bullets[i].isArrived) {
              data.bullets[i].isArrived = false;
              data.time += 1;
            }
          }
        }
      }
    }






    // for (let i = 0; i < bulletSpeed; ++i) {
    //   if (dragAreaMouseUpX - AREA_SIZE / 2 <= bullet[i].x + bullet[i].mx && bullet[i].x + bullet[i].mx <= dragAreaMouseUpX + AREA_SIZE / 2 &&
    //     dragAreaMouseUpY - AREA_SIZE / 2 <= bullet[i].y + bullet[i].my && bullet[i].y + bullet[i].my <= dragAreaMouseUpY + AREA_SIZE / 2) {
    //       bullet[i].isArrived = true;
    //   }

    //   if (bullet[i].isArrived == false) {
    //     bullet[i].mx += bullet[i].dx;
    //     bullet[i].my += bullet[i].dy;
    //     ctx.fillStyle = "rgb(0,0,255)";
    //     ctx.fillRect(bullet[i].x + bullet[i].mx, bullet[i].y + bullet[i].my, BULLET_SIZE, BULLET_SIZE);
    //   }
    //   // if (bulletSpeed == 0) {
    //   //   break;
    //   // }
    // }

    // for (const data of mapData) {
    //   if (dragAreaMouseUpX - AREA_SIZE / 2 <= data.x  && data.x <= dragAreaMouseUpX + AREA_SIZE / 2 &&
    //   dragAreaMouseUpY - AREA_SIZE / 2 <= data.y && data.y <= dragAreaMouseUpY + AREA_SIZE / 2) {

    //         console.log("aaa");
    //     for (let i = 0; i < bullet.length; ++i) {
    //       if (bullet[i].isArrived) {
    //         bullet[i].isArrived = false;
    //         data.time += 1;
    //       }
    //     }
    //   }
    // }


  // }

  if (dragFlag) {
    ctx.fillStyle = "rgb("+dragArea.r+","+dragArea.g+","+dragArea.b+")";
    ctx.fillRect(dragArea.x, dragArea.y, AREA_SIZE, AREA_SIZE);
    ctx.fillStyle = "rgb(0,0,0)";
    ctx.font = "18px serif";
    ctx.fillText("" + dragArea.time, dragArea.x + 2, dragArea.y + 28);
  }

  if (globalTime >= COUNT_UP_TIME) {
    globalTime = 0;
    for (const data of mapData) {
      data.time += 1;
    }
  }
  globalTime += 1;
  // if (mapData != null) {
  //   for (const data of mapData) {
  //     ctx.fillStyle = "rgb("+data.r+","+data.g+","+data.b+")";
  //     ctx.fillRect(data.x / ADJUST, data.y / ADJUST,32,32);
  //     if ( !(data.r == 255 && data.g == 255 && data.b == 255) ) {
  //       ctx.fillStyle = "rgb(0,0,0)";
  //       ctx.font = "24px serif";
  //       ctx.fillText("" + data.n, data.x + 2, data.y + 28);

  //       if (dragStartArray && animation < 50) {
  //       for (let l = 0; l < dragStartArray.length; ++l) {
  //         // if (dragStartArray[l].id == data.id) {
  
  //           ctx.strokeStyle = "rgb("+dragStartArray[l].r+","+dragStartArray[l].g+","+dragStartArray[l].b+")";
  //           ctx.beginPath();
  //           const at2 = Math.atan2(dragStartArray[l].y - data.y, dragStartArray[l].x - data.x);
  //           const rad = 14 * Math.PI / 180;
  //           const cx1 = 20 * Math.cos(at2 + rad) + dragStartArray[l].x;
  //           const cy1 = 20 * Math.sin(at2 + rad) + dragStartArray[l].y;
  //           const cx2 = 20 * Math.cos(at2 - rad) + dragStartArray[l].x;
  //           const cy2 = 20 * Math.sin(at2 - rad) + dragStartArray[l].y;


  //           const xx = data.x - dragStartArray[l].x;
  //           const yy = data.y - dragStartArray[l].y;

            

  //           ctx.moveTo(xx / 50 * animation + dragStartArray[l].x / ADJUST, yy / 50 * animation + dragStartArray[l].y / ADJUST);
  //           ctx.lineTo(xx / 50 * animation + cx1, yy / 50 * animation + cy1);
  //           ctx.moveTo(xx / 50 * animation + dragStartArray[l].x / ADJUST, yy / 50 * animation + dragStartArray[l].y / ADJUST);
  //           ctx.lineTo(xx / 50 * animation + cx2, yy / 50 * animation + cy2);
  //           ctx.closePath();
  //           ctx.stroke();

  //         // }
  //       }
  //       }

  //     }
  //     // if (timer != 0) {
  //     //   ctx.fillStyle = "rgb(0,0,0)";
  //     //   ctx.font = "24px serif";
  //     //   ctx.fillText("" + data.n, data.x + 2, data.y + 28);    
  //     // }
  //   }
  // }
  // animation += 1;
  // if (dragData != null) {
  //   for (const data of dragData) {
  //     for (let l = 0; l < dragStartArray.length; ++l) {
  //       if (dragStartArray[l].id == data.id) {
  //         ctx.strokeStyle = "rgb("+data.r+","+data.g+","+data.b+")";
  //         ctx.beginPath();
  //         ctx.moveTo(dragStartArray[l].x / ADJUST, dragStartArray[l].y / ADJUST);
  //         ctx.lineTo(data.x / ADJUST, data.y / ADJUST);
  //         ctx.closePath();
  //         ctx.stroke();
          
          
  //         // ctx.beginPath();

  //         // const at2 = Math.atan2(dragStartArray[l].y - data.y, dragStartArray[l].x - data.x);
  //         // const rad = 14 * Math.PI / 180;
  //         // const cx1 = 50 * Math.cos(at2 + rad) + dragStartArray[l].x;
  //         // const cy1 = 50 * Math.sin(at2 + rad) + dragStartArray[l].y;
  //         // const cx2 = 50 * Math.cos(at2 - rad) + dragStartArray[l].x;
  //         // const cy2 = 50 * Math.sin(at2 - rad) + dragStartArray[l].y;
  //         // ctx.moveTo(dragStartArray[l].x / ADJUST, dragStartArray[l].y / ADJUST);
  //         // ctx.lineTo(cx1, cy1);
  //         // ctx.moveTo(dragStartArray[l].x / ADJUST, dragStartArray[l].y / ADJUST);
  //         // ctx.lineTo(cx2, cy2);
  //         // ctx.closePath();
  //         // ctx.stroke();
      
  //       }
  //     }
  //     // ctx.fillStyle = "rgb("+data.r+","+data.g+","+data.b+")";
  //     // ctx.fillRect(data.x / ADJUST - 16, data.y / ADJUST - 16, 32, 32);
  //   }
  // }
  // if (rColor != null && (firstFlag == true || dragMove != null )) {
  //   ctx.fillStyle = "rgb("+rColor+","+gColor+","+bColor+")";
  //   ctx.fillRect(x / ADJUST - 16, y / ADJUST - 16, 32, 32);
  // }

  // if (dragMove != null) {
  //   ctx.strokeStyle = "rgb("+rColor+","+gColor+","+bColor+")";
  //   ctx.beginPath();
  //   ctx.moveTo(dragStart.x / ADJUST, dragStart.y / ADJUST);
  //   ctx.lineTo(dragMove.x / ADJUST, dragMove.y / ADJUST);
  //   ctx.closePath();
  //   ctx.stroke();
  // }


  requestAnimationFrame(loop);
}
