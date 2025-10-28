
class renderer
{

  cam_x = 0;
  cam_y = 0;
  event_move = false;
  current_scale = 0;
  mouse_x = 0;
  mouse_y = 0;

  touch_points = [];
  
  constructor(canvas)
  {
    this.canvas = canvas;
    this.canvas.width=document.getElementById("drawingContainer").offsetWidth;
    this.canvas.height=document.getElementById("drawingContainer").offsetHeight;
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.ctx = canvas.getContext("2d");
    
    window.addEventListener("keydown",(event)=>{this.on_key(event);});
    this.canvas.addEventListener("touchstart",(event)=>{this.touch_start(event)});
    this.canvas.addEventListener("touchmove",(event)=>{this.touch_move(event)});
    this.canvas.addEventListener("mousedown", (event)=>{this.on_mousedown(event)});
    this.canvas.addEventListener("mouseup", (event)=>{this.on_mouseup(event)});
    this.canvas.addEventListener("mouseleave",(event)=>{this.on_mouseup(event)});
    this.canvas.addEventListener("mousemove", (event)=>{this.on_mousemove(event)});
    this.canvas.addEventListener("wheel", (event) => {this.on_desktop_zoom(event)});

    let rect = this.canvas.getBoundingClientRect();
    let dpr = window.devicePixelRatio;
    this.ctx.scale(dpr,dpr);
    window.addEventListener("resize", (event)=>{this.on_resize(event)});
  }
  on_key(event)
  {

  }
  
  touch_start(event)
  {
    this.touch_points = event.touches;
  }

  touch_move(event)
  {
    let ntouch_points = event.touches;
    
    console.log("Finger count:", this.touch_points.length );
    if(this.touch_points.length> 1 && ntouch_points.length < 3)
    {
      let p1 = new vector2D(this.touch_points[0].clientX,this.touch_points[0].clientY);
      let p2 = new vector2D(this.touch_points[1].clientX,this.touch_points[1].clientY);

      let p3 = new vector2D(ntouch_points[0].clientX,ntouch_points[0].clientY);
      let p4 = new vector2D(ntouch_points[1].clientX,ntouch_points[1].clientY);

      let delta1 = p1.substract(p2).length();
      let delta2 = p3.substract(p4).length();
      
      let delta3 = (delta2-delta1)/2;
      
      this.zoom(delta3*0.01);
      console.log("Points:",p1,p2,p3,p4);
      console.log("Deltas:",delta1,delta2,delta3);
      this.touch_points = ntouch_points;
    }
    
    if(this.touch_points.length>0 && this.touch_points.length<3)
    {
      let pos0 = new vector2D(this.touch_points[0].clientX,this.touch_points[0].clientY);
      let posN = new vector2D(ntouch_points[0].clientX,ntouch_points[0].clientY);
      let delta=posN.substract(pos0); 
      this.cam_move(delta.x,delta.y);
      this.touch_points = ntouch_points;
    }

  }

  cam_move(val_x,val_y)
  {
    this.ctx.translate(val_x,val_y);
    this.cam_x = this.cam_x + val_x;
    this.cam_y = this.cam_y + val_y;
  }

  zoom(zoom_val)
  {
    this.current_scale = this.current_scale + zoom_val;
    let scale = Math.pow(Math.E,this.current_scale);

    let pos_x = this.ctx.getTransform().e/scale;
    let pos_y = this.ctx.getTransform().f/scale;

    this.ctx.setTransform(1,0,0,1,this.cam_x*scale,this.cam_y*scale);

    let displace_x = (this.canvas.width*scale)-this.canvas.width;
    let displace_y = (this.canvas.height*scale)-this.canvas.height;

    this.ctx.translate(-displace_x/2,-displace_y/2);
    this.ctx.scale(scale,scale);
  }

  on_desktop_zoom(event)
  {
    this.zoom((-event.deltaY/Math.abs(-event.deltaY) )/10);
  }

  on_mousedown(event)
  {
    if(event.button == 0)
    {
      this.event_move = true;
    }
  }

  on_mousemove(event)
  {
    this.mouse_x = event.clientX;
    this.mouse_y = event.clientY;
    if(this.event_move == true)
    {
      let delta_x = event.movementX/(1+Math.abs(this.current_scale));
      let delta_y = event.movementY/(1+Math.abs(this.current_scale));
      this.cam_move(delta_x,delta_y);
    }
  }

  on_mouseup(event)
  {
    if(event.button == 0)
    {
      this.event_move = false;
    }
  }

  on_resize(event)
  { 
    this.canvas.width=document.getElementById("drawingContainer").offsetWidth;
    this.canvas.height=document.getElementById("drawingContainer").offsetHeight;

    console.log("Resize");
  }

  drawArms(arm_array,color)
  {
    this.ctx.strokeStyle = color;
    this.ctx.imageSmoothingEnabled = true;
    this.ctx.lineWidth=2;

    for(let i=0; i<arm_array.length;i++)
    {
      this.ctx.beginPath();
      let origin_point = get_center().add( arm_array[i].origin_point );
      let end_point = get_center().add( arm_array[i].end_point );

      this.ctx.moveTo(origin_point.x,origin_point.y);
      this.ctx.lineTo(end_point.x,end_point.y);
      this.ctx.stroke();
    }
    
  }

  positionReset()
  {
    this.cam_x = 0;
    this.cam_y = 0;
    this.current_scale = 0;
    let scale = 1 + this.current_scale;
    this.ctx.setTransform(scale,0,0,scale,this.cam_x,this.cam_y);
  }

  drawTrail(point_array,color)
  {
    this.ctx.strokeStyle = color; 
    this.ctx.lineWidth=2;
    
    for(let i=0;i<point_array.length-1; i++)
    {
      let origin_point = get_center().add(point_array[i]);
      let end_point = get_center().add(point_array[i+1]);
     
      this.ctx.beginPath();
      this.ctx.moveTo(origin_point.x,origin_point.y);
      this.ctx.lineTo(end_point.x,end_point.y);
      this.ctx.stroke();
    }
  }

  clear()
  {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

}
