
function dec_div(num1,num2)
{
  return Math.trunc(num1/num2);
}

class Ang{
  static deg = (2*Math.PI)/360;
  static rad = 1;
  // Fixes overlap of 360 and 0 deg
  static normalize(ang)
  {
    // Evals count of revolutions => 1 revolution = 2pi so the whole division count equals count of whole revolutions
    let revs = dec_div(ang,2*Math.PI);
    // if 0<ang returns = > 1, else ang <0 => -1 
    let pol = ang/Math.abs(ang);
    // Evals the over value between revolutions by subtracting value of whole number of revolutions multiplied by 2pi to make it equal to rads
    // And multiplied by pol to account for negative numbers making it always oposite polarity from angle
    if (Math.abs(ang)>=2*Math.PI)
    {
      return ang - (revs*2*Math.PI*pol);
    }
    else
    {
      return ang;
    }
  }
}


class Gimbal
{
  pitch = 0;
  yaw = 0;
  roll = 0;

  constructor(pitch,yaw,roll)
  {
    this.pitch = pitch;
    this.yaw = yaw;
    this.roll = roll;
  }

  from_vector(vector,UF_DIAGONAL)
  {
    
  }
}

class vector3D
{
  constructor(x,y,z)
  {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  add(vec)
  {
    return new vector3D(this.x+vec.x,this.y+vec.y,this.z+vec.z);
  }

  distance(vec)
  {
    this.subtract(vec).length();
  }

  divide(number)
  {
    return new vector3D(this.x/number,this.y/number,this.z/number);
  }

  subtract(vec)
  {
    return new vector3D(this.x-vec.x,this.y-vec.y,this.z-vec.z);
  }

  dot(vec)
  {
    return (this.x*vec.x)+(this.y+vec.y)+(this.z+vec.z);  
  }

  multiply(vec)
  {
    return new vector3D(this.x*vec.x,this.y*vec.y,this.z*vec.z);
  }

  static from_angles(pitch, yaw, roll)
  {
		let xz_len = math.cos(pitch);
		let uvec = { x: xz_len * math.sin(yaw), y: math.sin(pitch), z: xz_len * math.cos(yaw), };
		return uvec;
	}

  length()
  {
    return math.sqrt(math.pow(this.x,2)+math.pow(this.y,2)+math.pow(this.z,2));
  }

  normalize()
  {
    if(this.length()==0){return new vector3D(0,0,0);}
    return this.divide(this.length());
  }


}

class vector2D
{
  constructor(x,y)
  {
    this.x=x;
    this.y=y;
  }
  static vec_arr2verts(array)
  {
    let verts = [];
    for(let i=0; i<array.length; i++)
    {
      let vec = array[i];
      verts.push(vec.x);
      verts.push(vec.y);
      verts.push(0);
    }
    return verts;
  }
  static sum(vec_arr)
  {
    let tmp_x = 0;
    let tmp_y = 0;

    for(let i=0; i<vec_arr.length;i++)
    {
      tmp_x=tmp_x+vec_arr[i].x;
      tmp_y=tmp_y+vec_arr[i].y;
    }
    return new vector2D(tmp_x, tmp_y);
  }
  equal(vector)
  {
    let df = this.substract(vector);
    
    return df.length()==0;
  }
  add(vector)
  {
    return new vector2D(this.x+vector.x,this.y+vector.y);
  }

  length()
  {
    return math.sqrt(math.pow(this.x,2)+math.pow(this.y,2));
  }


  subtract(vec)
  {
    return new vector3D(this.x - vec.x, this.y - vec.y, this.z - vec.z);
  }

  sum(...vecs)
  {
    let nvec = new vector2D(0,0);
    for(i=0; i<vecs.length; i++)
    {
      let vec = vecs[i];
      nvec= nvec.add(vec);
    }
    return nvec;
  }
  rotate(angle,unit=Ang.rad)
  {
    let ang = Math.atan(this.y/this.x) + Ang.normalize(angle*unit);
    let x = Math.trunc( Math.cos(ang)*this.length()*Math.pow(10,5) )*Math.pow(10,-5);
    let y = Math.trunc( Math.sin(ang)*this.length()*Math.pow(10,5) )*Math.pow(10,-5);

    return new vector2D(x,y);
  }
}
