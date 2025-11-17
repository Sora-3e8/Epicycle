var renderer;
var scene;
var camera;
var epicycle;
var cycle_prog=0;
var play_btn;

function init()
{
  init_scene();
  init_epicycle();
}

function init_scene()
{
  renderer = document.querySelector("ez-render");
  play_btn = document.querySelector("ez-toggle");

  renderer.camcontrols["rotate"]="never";
  renderer.camcontrols["pan_move"]="lmb";
  scene = renderer.Scene;
  scene.cam_manager = new GlCamManager();

  camera = scene.cam_manager.Camera;
  camera.projection_type = GlCamProjType.orthogonal;
  camera.wz = 5;
  camera.mspeed=0.01;
  
  renderer.set_fps(60);
}

function add_fx()
{
  let item_list = document.getElementById("fx_list");

  let item = document.createElement("ez-item");
  
  let item_lbl = document.createElement("label");
  let max_fx = 0;
  for(let i=0; i<item_list.childElementCount; i++)
  {
    if(parseInt(item_list.children[i].querySelector("label").innerHTML.split("fx:")[1]) > max_fx)
    {
      max_fx = parseInt(item_list.children[i].querySelector("label").innerHTML.split("fx:")[1]);
      console.log(max_fx);
    }
  }
  item_lbl.innerHTML = `fx:${(max_fx+1).toString()}`;

  let item_amp = document.createElement("input");
  let item_freq = document.createElement("input");
  let item_phase = document.createElement("input");

  item_amp.type = "text"; item_freq.type = "text"; item_phase.type = "text";
  item_amp.value = "1.0"; item_freq.value = "1.0"; item_phase.value = "0.0";
  
  item.appendChild(item_lbl);
  item.appendChild(item_amp);
  item.appendChild(item_freq);
  item.appendChild(item_phase);
  item_list.appendChild(item);

}
function rm_fx()
{
  let fx_list = document.getElementById("fx_list"); 
  let selected_item = fx_list.querySelector("ez-item[selected='true']");
  fx_list.removeChild(selected_item);

}

function apply_fxs()
{
  let item_list = document.getElementById("fx_list");
  epicycle.fx_array = []; 
  for(let i=0; i<item_list.childElementCount; i++)
  {
    let pars = item_list.children[i].querySelectorAll("input");
    console.log("Res:",[math.evaluate(pars[0].value),math.evaluate(pars[1].value),math.evaluate(pars[2].value)]);
    epicycle.fx_array.push( new euler_fx( math.evaluate(pars[0].value),math.evaluate(pars[1].value),math.evaluate(pars[2].value) ) );
  }
  cycle_prog = 0;
  epicycle.precalc();
  cycle_update();

}
function init_epicycle()
{
  epicycle = new FourierSeries();
  epicycle.fx_array = [new euler_fx(1,1,0), new euler_fx(1,1/2,0)];
  epicycle.precalc();

  let trail_obj = new GlObject( GlGeometry.line2d([0,0,0,0,0,0]),{x:0,y:0,z:0},{pitch:0,yaw:0,roll:0},Color.name("lime").flat());
  scene.add_object( trail_obj);
  scene.add_object( new GlObject(GlGeometry.line2d(epicycle.get_state(0))));
  scene.object_list[0].position.z = -1.1;
  scene.object_list[1].position.z = -1;
  setInterval(()=>{drawCycle();},10);

}

function drawCycle()
{
  if(play_btn.toggled==true)
  {
    cycle_update();
    cycle_prog=cycle_prog+1;
  }
  if(cycle_prog>200){cycle_prog = cycle_prog - 100;}
}

function cycle_update()
{
  scene.object_list[0].geometry = GlGeometry.line2d(epicycle.get_state(cycle_prog));
  scene.object_list[1].geometry = GlGeometry.line2d(epicycle.tail_segment(cycle_prog,0));

}


