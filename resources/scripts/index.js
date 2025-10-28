var renderer;
var scene;
var camera;
var epicycle;
var cycle_prog=0;
var play_btn;

function init()
{
  renderer = document.querySelector("ez-render");
  play_btn = document.querySelector("ez-toggle");

  renderer.camcontrols["rotate"]="never";
  renderer.camcontrols["pan_move"]="lmb";
  renderer.add_scene(new GlScene());
  renderer.use_scene(0);
  scene = renderer.Scene;
  scene.cam_manager.add_cam(new GlCam(GlCamProjType.orthogonal,GlCamType.firstperson));
  scene.cam_manager.use_cam(0);
  scene.cam_manager.Camera.wz = 5;
  camera = scene.cam_manager.Camera;
  camera.mspeed=0.01;
  
  epicycle = new Epicycle();
epicycle.add_arm(3, -2, 0);     
epicycle.add_arm(1, 6, 0); 



  let trail_obj = new GlObject( GlGeometry.line2d([0,0,0,0,0,0]),{x:0,y:0,z:0},{pitch:0,yaw:0,roll:0},Color.name("lime").flat());
  scene.add_object( trail_obj);
  scene.add_object( new GlObject(GlGeometry.line2d(epicycle.calculate_state(0))));
  scene.object_list[0].position.z = -1.1;
  scene.object_list[1].position.z = -1;
  setInterval(()=>{drawCycle();},10);
  renderer.set_fps(60);
}

function drawCycle()
{
  if(play_btn.toggled==true)
  {
    cycle_update();
    cycle_prog=cycle_prog+1;
  }
}

function cycle_update()
{
  scene.object_list[1].geometry = GlGeometry.line2d(epicycle.calculate_state(cycle_prog));
  scene.object_list[0].geometry = GlGeometry.line2d(epicycle.trail_segment(cycle_prog,0));

}


