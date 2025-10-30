class Epicycle_fx
{
  phase = 0;
  revolutions = 0;
  length = 0;
  origin_point = new vector2D(0,0);
  end_point = new vector2D(0,0);

  constructor(amplitude,frequency,phase=0,units=Ang.rad)
  {
    this.amplitude = amplitude;
    this.frequency = frequency;
    this.phase = phase;
  }

  calculate_state(origin_point,steps)
  {
    this.origin_point = origin_point;
let rotated_vector = new vector2D(0,this.length).rotate(this.angle+(this.revolutions*steps))
    this.end_point=origin_point.add(rotated_vector);
  }
}

// Usage Epicycle(Center<Vector2D>)
class Epicycle
{
  resolution = 3;
  evaulated_period = 0;
  Arms=[];
  Center = [];
  Period = 0.0;
  period_needs_update = true;
  trail_buffer=[];
  Progress = 0;
  trail_partial=[];

  constructor(center=new vector2D(0,0))
  {
    this.Center = center;
    //this.dpr = window.devicePixelRatio;
  }
  // Do not under any cicumstance use more than pow(10,2) => It will start to freak out
  eval_period()
  {
    let periods = [];
    let speeds = [];
    this.period_needs_update = false;
    for(let k=0; k<this.Arms.length; k++)
    {
      speeds.push(Math.round(this.Arms[k].revolutions*Math.pow(10,this.resolution)));
    }
    let gcd_res = math.gcd.apply(this,speeds);
    this.evaluated_period = (2*Math.PI)/(gcd_res/math.pow(10,this.resolution));
    
  }

  calc_trail(trail_start=0,trail_end=100)
  {
    this.trail_buffer=[];
    
    
    //for(let p=trail_start; p<Math.max(trail_end,100)*Math.pow(10,this.resolution)-3;p+=3)
    //{
     //this.trail_buffer.push(this.calculate_state(p/Math.pow(10,this.resolution)).slice(-1)[0]);
    //}
    
    console.log("Trail end:",(100/(1/Math.pow(10,this.resolution))));
    let scaled_step = Math.pow(10,this.resolution);
    for(let p=0; p<(100*scaled_step)-10;p+=10)
    {
      this.trail_buffer.push(this.calculate_state(p/scaled_step).slice(-1));
    }

    if (trail_end == 100){this.trail_buffer.push(this.trail_buffer[0]);} 
    console.log("Recalculating trail...");
    return this.trail_buffer;
  }

  edit_arm(index,att,val)
  {
    this.Arms[index].setAttr(att,val);
    this.period_needs_update = true;
  }

  add_arm(length,speed,initial_pos)
  {
    this.Arms.push(new Arm(length,speed,initial_pos));
    this.period_needs_update = true;
  }

  remove_arm(index)
  {
    this.Arms.splice(index,1);
    this.period_needs_update = true;
  }

  trail_segment(progress,start=0)
  {
    let start_index = Math.round( (this.trail_buffer.length/100)*Math.min(100,start) );
    let trail_index = Math.round( (this.trail_buffer.length/100)*Math.min(100,progress) );

    return this.trail_buffer.slice(start_index,trail_index).flat();
  }

  // Evaluates single state of the epicycle
  calculate_state(progress)
  {
    let point_list = [];
    // Updates period if needed and precalculates trail
    if(this.period_needs_update == true)
    {
      this.eval_period();
      this.calc_trail(0,100);
    }
    // This part clamps the progress to be between 0-100
    if(progress>100){progress =  progress - ((dec_div(progress,100)*100));}
    let origin_point = this.Center;
    let current_location = (this.evaluated_period/100)*progress    

    for(let arm_index = 0; arm_index<this.Arms.length; arm_index++ )
    {
      this.Arms[arm_index].calculate_state(origin_point,current_location);
      point_list.push([this.Arms[arm_index].origin_point.x,this.Arms[arm_index].origin_point.y,0]);
      origin_point = this.Arms[arm_index].end_point;
      point_list.push([this.Arms[arm_index].end_point.x,this.Arms[arm_index].end_point.y,0]);
    }
    return point_list;
  }
}
