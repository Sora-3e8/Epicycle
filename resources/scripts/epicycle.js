
class euler_fx
{
  amplitude = 0;
  frequency = 0;
  phase = 0;

  constructor(amplitude,frequency,phase=0)
  {
    this.amplitude = amplitude;
    this.frequency = frequency;
    this.phase = phase;
  }
  // Makes mat of shape {x,y,z,w} × {rotation matrix} and removes w as it was needed just match the shape of rot matrix
  get_state(t)
  { //
    return new Mat(new Mat([0,this.amplitude,0,0],4).multiply(Mutils.Rotate(0,0, (this.phase+(math.pi/2))+(t*this.frequency) ) ,true).cells.slice(0,-1),3);
  }

}



class FourierSeries
{
  sampling_rate = 100;
  tail_buffer = [];
  fx_array = [];
  fxs_buffers = [];
  point_buffer = [];
  precision = 3;
  constructor(){

  }

  eval_cperiod()
  {
    let freqs = [];

    
    for(let k=0; k<this.fx_array.length; k++)
    {
      let fx = this.fx_array[k];
      // Abs strips negative values, there's no such thing like negative frequency
      freqs.push( Math.abs(fx.frequency) );
    }

    // Removes duplicate values
    let unique_freqs = Array.from( new Set(freqs) );

    // Reverse sort
    unique_freqs = unique_freqs.sort((a, b) => b - a);

    for(let k = 0; k<unique_freqs.length; k++){ unique_freqs[k] = Math.round(Math.pow(10,this.precision)*(1/unique_freqs[k]))/Math.pow(10,this.precision); }

    return 2*math.pi*arr_lcm(unique_freqs);
  }

  precalc()
  {
    let common_period = this.eval_cperiod();
    alert(`End: ${common_period}`);
    let new_fx_buffers = [];
    let new_point_buffer = [];
    let new_tail_buffer = [];
    for(let t = 0; t<(common_period*this.sampling_rate); t++ )
    {
      let time_frame=[];
      let points = [[0,0,0]];
      let fx_buffer = [];
      let stack_mat = new Mat([0,0,0],3);
      for(let k = 0; k<this.fx_array.length; k++)
      {
        let fx_point = this.fx_array[k].get_state(t/this.sampling_rate);
        fx_buffer.push(fx_point.cells);
        
        stack_mat = stack_mat.add(fx_point);
        points.push(stack_mat.cells);
      }

      new_fx_buffers.push(fx_buffer);
      new_point_buffer.push(points);
      new_tail_buffer.push(stack_mat.cells);
    }
    new_point_buffer.push(new_point_buffer[0]);
    new_fx_buffers.push(new_fx_buffers[0]);
    new_tail_buffer.push(new_tail_buffer[0]);
    this.point_buffer = new_point_buffer;
    this.fxs_buffers = new_fx_buffers;
    this.tail_buffer = new_tail_buffer;
  }

  eval_state(percent)
  {
    let common_period = this.eval_cperiod();
    let time_frame=[];
    let points = [[0,0,0]];
    let fx_buffer = [];
    let stack_mat = new Mat([0,0,0],3);
    let t = (common_period/100)*percent;
    for(let k = 0; k<this.fx_array.length; k++)
    {
      let fx_point = this.fx_array[k].get_state((t/this.sampling_rate));
      fx_buffer.push(fx_point.cells);
      
      stack_mat = stack_mat.add(fx_point);
      points.push(stack_mat.cells);
    }
    new_fx_buffers.push(fx_buffer);
    new_point_buffer.push(points);
    new_tail_buffer.push(stack_mat.cells);
  }

  tail_segment(progress,start=0)
  {
    let start_index = Math.round( (this.tail_buffer.length/100)*Math.min(100,start) );
    let trail_index = Math.round( (this.tail_buffer.length/100)*Math.min(100,progress) );
    return this.tail_buffer.slice(start_index,trail_index);
  }

  // prc should be a float in range of 0 - 100 % - do not include percentage symbol [float]
  get_state(percent)
  {
   let prc = percent;
   if(prc>100){prc=prc-( Math.trunc( prc/100 )*100 );}
   let pos = Math.trunc( ( ( this.point_buffer.length-1) / 100 ) * prc );
   console.log("Curr pos:",pos);
   return this.point_buffer[pos];
  }
}

