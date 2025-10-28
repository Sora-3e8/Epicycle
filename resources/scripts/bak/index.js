//* Important objects *//
var epicycle_obj;
var interval_instance;
//* Important objects *//

//* Input elements *//
var circles_toggle;
var fps_slider;
var play_toggle;
var reset_button;
var recenter_button;
var settings_button;
var predict_toggle;
var trail_toggle;
var grid_toggle;
var progress_slider;
var renderer_obj;
var step_multiplier;
//* Input elements *//

//* Key variables *//
var cycle_progress = 0;
var full_cycle = false;
//* Key variables *//

function get_center() { return new vector2D( dec_div(renderBox.width, 2), dec_div(renderBox.height, 2)); }

function init() 
{
	//* Loads buttons *//
	play_toggle = document.getElementById("play_toggle");
	recenter_button = document.getElementById("recenter_button");
	reset_button = document.getElementById("reset_button");
	reset_step_btn = document.querySelector("ez-btn[id='reset_step']");
	settings_button = document.getElementById("settings_button");
	// Loads buttons *//

	//* Loads all required inputs *//
	circles_toggle = document.getElementById("circles_toggle");
	fps_slider = document.getElementById("fps_slider");
	predict_toggle = document.getElementById("predict_toggle");
	trail_toggle = document.getElementById("trail_toggle");
	grid_toggle = document.getElementById("grid_toggle");
	progress_slider = document.querySelector("input[name='progress_slider']");
	renderer_obj = document.querySelector("ez-renderer");
	step_multiplier = document.querySelector("input[name='step_multiplier']");
	//* Loads all required inputs *//

	//* Setups events *//

	// play_toggle uses map object to switch state //
	play_toggle.addEventListener(
		"click",() =>
		{
				let el = play_toggle;
				let state_map=new Map( [ ['pause','play'],['play','pause'] ] );
				el.setAttribute('state',state_map.get(el.getAttribute('state')));
		}
	);
	progress_slider.addEventListener
	(
		"input", ()=>
		{
			let el = progress_slider;
			cycle_progress = parseFloat(el.value);
			document.querySelector("label[name='progress_label']").innerHTML = Math.round(cycle_progress).toString()+'%';
		}
	);
	recenter_button.addEventListener( "click", ()=>{ renderer_obj.positionReset(); } );
	reset_button.addEventListener( "click", ()=>{ resetProgress(); } );
	settings_button.addEventListener
	(
		"click", ()=>
		{
			if(document.location.hash!='#nav_settings')
			{
				document.location='#nav_settings';
			}
			else{ document.location='#'; }
		}
	);
	
	//* Setups events *//

	//* Initial configuration setup *//
	epicycle_obj = new Epicycle(new vector2D(0, 0));
	epicycle_obj.add_arm(120, 1, 0);
	epicycle_obj.add_arm(60, 1/2, 0);
	epicycle_obj.add_arm(60, -0.33, 0);

	//* Initial configuration setup *//	

	start_render() // Self describing... 
}

function resetProgress()
{
	set_progress(0);
	full_cycle = false;
}

function start_render() 
{	
	interval_instance = setInterval(() => { requestAnimationFrame(render_loop); }, 16.67); 
}
function stop_render() { clearInterval(interval_instance); }


//* Overrides progress through slider *//
// Slider input has priority over step
function set_progress(percentage_value)
{
		//percentage_value is to be float (NOT String with "%")
		progress_slider.value = percentage_value;
		progress_slider.dispatchEvent(new Event("input"));
}
//* Overrides progress through slider *//

function render_trail()
{
	if(full_cycle == true)
	{ 
		renderer_obj.drawLines( epicycle_obj.trail_segment( 100 ),"red" ); 
	}
	else
	{ 
		if(predict_toggle.checked){ renderer_obj.drawLines( epicycle_obj.trail_segment( 100, cycle_progress ),"DarkRed" ); }
		renderer_obj.drawLines( epicycle_obj.trail_segment( cycle_progress ),"red" ); 
	}
}

function render_loop() 
{
	
	//* Handles state updates *//
	if (play_toggle.getAttribute("state")=="play") 
	{
		let fps = parseFloat(fps_slider.value);
		let fps_coefficient = ( 100 / Math.pow(fps,2) );
		if (cycle_progress >= 100) { full_cycle = true; cycle_progress = cycle_progress - (dec_div(cycle_progress, 100) * 100);}	
		if (cycle_progress < 0) { cycle_progress = cycle_progress+ 100; }
		let d_prog = fps_coefficient*parseFloat(step_multiplier.value);
		cycle_progress=cycle_progress+d_prog;
		set_progress(cycle_progress);
	}
	//* Handles state updates *//

	//* Handles rendering *//
	
	renderer_obj.clear();	
	render_trail();	
	renderer_obj.drawLines( epicycle_obj.calculate_state( cycle_progress), "cyan" );

	//* Handles rendering *//	
}
